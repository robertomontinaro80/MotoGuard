/**
 * Store globale Zustand — moto selezionata e lista manutenzioni.
 */

import { create } from 'zustand';
import { Motorcycle, MaintenanceRecord, MaintenanceReminder } from '@types/index';
import { MotorcycleRepository } from '@services/MotorcycleRepository';
import { MaintenanceRepository, ReminderService } from '@services/MaintenanceRepository';

interface AppState {
  // Moto
  motorcycles: Motorcycle[];
  selectedMotorcycleId: string | null;
  loadingMotorcycles: boolean;

  // Manutenzione
  maintenanceRecords: MaintenanceRecord[];
  reminders: MaintenanceReminder[];
  loadingMaintenance: boolean;

  // Actions
  loadMotorcycles: () => Promise<void>;
  selectMotorcycle: (id: string) => void;
  addMotorcycle: (data: Omit<Motorcycle, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateMotorcycleKm: (id: string, km: number) => Promise<void>;
  deleteMotorcycle: (id: string) => Promise<void>;

  loadMaintenance: (motorcycleId: string) => Promise<void>;
  addMaintenanceRecord: (data: Omit<MaintenanceRecord, 'id' | 'createdAt'>) => Promise<void>;
  deleteMaintenanceRecord: (id: string) => Promise<void>;
}

export const useAppStore = create<AppState>((set, get) => ({
  motorcycles: [],
  selectedMotorcycleId: null,
  loadingMotorcycles: false,
  maintenanceRecords: [],
  reminders: [],
  loadingMaintenance: false,

  // ─── Motorcycles ──────────────────────────────────────────────────────

  loadMotorcycles: async () => {
    set({ loadingMotorcycles: true });
    try {
      const motorcycles = await MotorcycleRepository.getAll();
      const selectedId = motorcycles.length > 0
        ? (get().selectedMotorcycleId ?? motorcycles[0].id)
        : null;
      set({ motorcycles, selectedMotorcycleId: selectedId, loadingMotorcycles: false });
    } catch (e) {
      set({ loadingMotorcycles: false });
    }
  },

  selectMotorcycle: (id) => {
    set({ selectedMotorcycleId: id });
    get().loadMaintenance(id);
  },

  addMotorcycle: async (data) => {
    const moto = await MotorcycleRepository.create(data);
    set((s) => ({
      motorcycles: [...s.motorcycles, moto],
      selectedMotorcycleId: s.selectedMotorcycleId ?? moto.id,
    }));
  },

  updateMotorcycleKm: async (id, km) => {
    await MotorcycleRepository.updateKm(id, km);
    set((s) => ({
      motorcycles: s.motorcycles.map((m) => m.id === id ? { ...m, currentKm: km } : m),
    }));
  },

  deleteMotorcycle: async (id) => {
    await MotorcycleRepository.delete(id);
    set((s) => {
      const remaining = s.motorcycles.filter((m) => m.id !== id);
      return {
        motorcycles: remaining,
        selectedMotorcycleId: remaining.length > 0 ? remaining[0].id : null,
      };
    });
  },

  // ─── Maintenance ──────────────────────────────────────────────────────

  loadMaintenance: async (motorcycleId) => {
    set({ loadingMaintenance: true });
    try {
      const moto = get().motorcycles.find((m) => m.id === motorcycleId);
      const [records, reminders] = await Promise.all([
        MaintenanceRepository.getByMotorcycle(motorcycleId),
        ReminderService.computeAllReminders(motorcycleId, moto?.currentKm ?? 0),
      ]);
      set({ maintenanceRecords: records, reminders, loadingMaintenance: false });
    } catch (e) {
      set({ loadingMaintenance: false });
    }
  },

  addMaintenanceRecord: async (data) => {
    const record = await MaintenanceRepository.create(data);
    set((s) => ({ maintenanceRecords: [record, ...s.maintenanceRecords] }));
    // Ricalcola reminder
    await get().loadMaintenance(data.motorcycleId);
  },

  deleteMaintenanceRecord: async (id) => {
    await MaintenanceRepository.delete(id);
    set((s) => ({
      maintenanceRecords: s.maintenanceRecords.filter((r) => r.id !== id),
    }));
  },
}));

// Selettori derivati
export const useSelectedMotorcycle = () => {
  const { motorcycles, selectedMotorcycleId } = useAppStore();
  return motorcycles.find((m) => m.id === selectedMotorcycleId) ?? null;
};
