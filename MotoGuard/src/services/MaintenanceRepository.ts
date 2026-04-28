/**
 * MaintenanceRepository — CRUD per gli interventi di manutenzione.
 * ReminderService — calcola stato scadenze per ogni tipo di manutenzione.
 */

import { database, MaintenanceRecordModel } from './database';
import { Q } from '@nozbe/watermelondb';
import { MaintenanceRecord, MaintenanceReminder, MaintenanceType, ReminderStatus } from '@types/index';
import { MAINTENANCE_INTERVALS } from './maintenanceIntervals';
import { differenceInDays } from 'date-fns';

// ─── Repository ────────────────────────────────────────────────────────────

const collection = database.get<MaintenanceRecordModel>('maintenance_records');

function toRecord(r: MaintenanceRecordModel): MaintenanceRecord {
  return {
    id: r.id,
    motorcycleId: r.motorcycleId,
    type: r.type as MaintenanceType,
    km: r.km,
    date: r.date,
    cost: r.cost,
    notes: r.notes,
    receiptPhoto: r.receiptPhoto,
    workshop: r.workshop,
    createdAt: r.createdAt,
  };
}

export const MaintenanceRepository = {
  async getByMotorcycle(motorcycleId: string): Promise<MaintenanceRecord[]> {
    const records = await collection
      .query(Q.where('motorcycle_id', motorcycleId))
      .fetch();
    return records.map(toRecord).sort((a, b) => b.date.getTime() - a.date.getTime());
  },

  async getLastByType(motorcycleId: string, type: MaintenanceType): Promise<MaintenanceRecord | null> {
    const records = await collection
      .query(
        Q.where('motorcycle_id', motorcycleId),
        Q.where('type', type),
        Q.sortBy('date', Q.desc),
        Q.take(1),
      )
      .fetch();
    return records.length > 0 ? toRecord(records[0]) : null;
  },

  async create(data: Omit<MaintenanceRecord, 'id' | 'createdAt'>): Promise<MaintenanceRecord> {
    let created!: MaintenanceRecordModel;
    await database.write(async () => {
      created = await collection.create((r) => {
        r.motorcycleId = data.motorcycleId;
        r.type         = data.type;
        r.km           = data.km;
        r.date         = data.date;
        r.cost         = data.cost ?? 0;
        r.notes        = data.notes ?? '';
        r.receiptPhoto = data.receiptPhoto ?? '';
        r.workshop     = data.workshop ?? '';
      });
    });
    return toRecord(created);
  },

  async delete(id: string): Promise<void> {
    await database.write(async () => {
      const record = await collection.find(id);
      await record.markAsDeleted();
    });
  },

  async getTotalCost(motorcycleId: string): Promise<number> {
    const records = await this.getByMotorcycle(motorcycleId);
    return records.reduce((sum, r) => sum + (r.cost ?? 0), 0);
  },
};

// ─── ReminderService ───────────────────────────────────────────────────────

export interface ReminderCheckInput {
  lastKm?: number;
  lastDate?: Date;
  currentKm: number;
  intervalKm?: number;
  intervalDays?: number;
}

export interface ReminderCheckResult {
  status: ReminderStatus;
  kmLeft?: number;
  daysLeft?: number;
  nextKm?: number;
  nextDate?: Date;
}

export const ReminderService = {
  /** Calcola lo stato di una singola scadenza — funzione pura, testabile. */
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

    // Determina il peggior stato tra km e giorni
    const values = [kmLeft, daysLeft].filter((v) => v !== undefined) as number[];
    const min = values.length > 0 ? Math.min(...values) : Infinity;

    let status: ReminderStatus;
    if (min < 0)   status = 'overdue';
    else if (min <= 14) status = 'due';
    else if (min <= 30) status = 'warning';
    else           status = 'ok';

    return { status, kmLeft, daysLeft, nextKm, nextDate };
  },

  /** Calcola tutti i reminder per una moto, dato lo storico manutenzioni. */
  async computeAllReminders(
    motorcycleId: string,
    currentKm: number,
  ): Promise<MaintenanceReminder[]> {
    const reminders: MaintenanceReminder[] = [];

    for (const [type, interval] of Object.entries(MAINTENANCE_INTERVALS)) {
      const last = await MaintenanceRepository.getLastByType(
        motorcycleId,
        type as MaintenanceType,
      );

      if (!last && !interval.intervalDays) continue;

      const result = this.check({
        lastKm:      last?.km,
        lastDate:    last?.date,
        currentKm,
        intervalKm:  interval.intervalKm,
        intervalDays: interval.intervalDays,
      });

      reminders.push({
        type: type as MaintenanceType,
        status: result.status,
        lastKm:   last?.km,
        lastDate: last?.date,
        nextKm:   result.nextKm,
        nextDate: result.nextDate,
        kmLeft:   result.kmLeft,
        daysLeft: result.daysLeft,
      });
    }

    return reminders.sort((a, b) => {
      const order: ReminderStatus[] = ['overdue', 'due', 'warning', 'ok'];
      return order.indexOf(a.status) - order.indexOf(b.status);
    });
  },
};
