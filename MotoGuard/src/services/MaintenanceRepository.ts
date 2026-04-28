import { db, generateId, DBMaintenanceRecord } from './database';
import { MaintenanceRecord, MaintenanceReminder, MaintenanceType, ReminderStatus } from '@types/index';
import { MAINTENANCE_INTERVALS } from './maintenanceIntervals';
import { differenceInDays } from 'date-fns';

function toRecord(r: DBMaintenanceRecord): MaintenanceRecord {
  return { ...r, type: r.type as MaintenanceType, date: new Date(r.date), createdAt: new Date(r.createdAt) };
}

export const MaintenanceRepository = {
  async getByMotorcycle(motorcycleId: string): Promise<MaintenanceRecord[]> {
    const records = await db.getMaintenanceByMoto(motorcycleId);
    return records.map(toRecord);
  },

  async getLastByType(motorcycleId: string, type: MaintenanceType): Promise<MaintenanceRecord | null> {
    const r = await db.getLastMaintenance(motorcycleId, type);
    return r ? toRecord(r) : null;
  },

  async create(data: Omit<MaintenanceRecord, 'id' | 'createdAt'>): Promise<MaintenanceRecord> {
    const record: DBMaintenanceRecord = {
      id: generateId(),
      motorcycleId: data.motorcycleId, type: data.type,
      km: data.km, date: data.date.getTime(),
      cost: data.cost, notes: data.notes,
      receiptPhoto: data.receiptPhoto, workshop: data.workshop,
      createdAt: Date.now(),
    };
    const saved = await db.saveMaintenance(record);
    return toRecord(saved);
  },

  async delete(id: string): Promise<void> {
    await db.deleteMaintenance(id);
  },

  async getTotalCost(motorcycleId: string): Promise<number> {
    const records = await this.getByMotorcycle(motorcycleId);
    return records.reduce((sum, r) => sum + (r.cost ?? 0), 0);
  },
};

// ─── ReminderService ───────────────────────────────────────────────────────

export interface ReminderCheckInput {
  lastKm?: number; lastDate?: Date; currentKm: number;
  intervalKm?: number; intervalDays?: number;
}

export interface ReminderCheckResult {
  status: ReminderStatus; kmLeft?: number; daysLeft?: number;
  nextKm?: number; nextDate?: Date;
}

export const ReminderService = {
  check(input: ReminderCheckInput): ReminderCheckResult {
    const { lastKm, lastDate, currentKm, intervalKm, intervalDays } = input;
    let kmLeft: number | undefined;
    let daysLeft: number | undefined;
    let nextKm: number | undefined;
    let nextDate: Date | undefined;

    if (intervalKm !== undefined && lastKm !== undefined) {
      nextKm = lastKm + intervalKm;
      kmLeft = nextKm - currentKm;
    }
    if (intervalDays !== undefined && lastDate !== undefined) {
      const next = new Date(lastDate);
      next.setDate(next.getDate() + intervalDays);
      nextDate = next;
      daysLeft = differenceInDays(next, new Date());
    }

    const values = [kmLeft, daysLeft].filter((v) => v !== undefined) as number[];
    const min = values.length > 0 ? Math.min(...values) : Infinity;

    let status: ReminderStatus;
    if (min < 0)        status = 'overdue';
    else if (min <= 14) status = 'due';
    else if (min <= 30) status = 'warning';
    else                status = 'ok';

    return { status, kmLeft, daysLeft, nextKm, nextDate };
  },

  async computeAllReminders(motorcycleId: string, currentKm: number): Promise<MaintenanceReminder[]> {
    const reminders: MaintenanceReminder[] = [];
    for (const [type, interval] of Object.entries(MAINTENANCE_INTERVALS)) {
      const last = await MaintenanceRepository.getLastByType(motorcycleId, type as MaintenanceType);
      if (!last && !interval.intervalDays && !interval.intervalKm) continue;
      const result = this.check({
        lastKm: last?.km, lastDate: last?.date, currentKm,
        intervalKm: interval.intervalKm, intervalDays: interval.intervalDays,
      });
      reminders.push({
        type: type as MaintenanceType, status: result.status,
        lastKm: last?.km, lastDate: last?.date,
        nextKm: result.nextKm, nextDate: result.nextDate,
        kmLeft: result.kmLeft, daysLeft: result.daysLeft,
      });
    }
    const order: ReminderStatus[] = ['overdue', 'due', 'warning', 'ok'];
    return reminders.sort((a, b) => order.indexOf(a.status) - order.indexOf(b.status));
  },
};
