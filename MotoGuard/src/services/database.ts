/**
 * Database layer — in-memory store per Expo Go (sviluppo).
 * Per produzione con build nativa, sostituire con WatermelonDB + SQLiteAdapter.
 *
 * Struttura: semplici Map<id, record> con persist via AsyncStorage.
 */

import AsyncStorage from '@react-native-async-storage/async-storage';

// ─── Tipi interni ──────────────────────────────────────────────────────────

export interface DBMotorcycle {
  id: string; brand: string; model: string; year: number;
  licensePlate: string; currentKm: number; engineCC: number;
  color?: string; photo?: string; createdAt: number; updatedAt: number;
}

export interface DBMaintenanceRecord {
  id: string; motorcycleId: string; type: string; km: number;
  date: number; cost?: number; notes?: string;
  receiptPhoto?: string; workshop?: string; createdAt: number;
}

export interface DBEmergencyContact {
  id: string; name: string; phone: string; relationship?: string; createdAt: number;
}

export interface DBFallEvent {
  id: string; timestamp: number; lat: number; lng: number;
  gForce: number; alertSent: boolean; canceledByUser: boolean; createdAt: number;
}

// ─── ID generator ─────────────────────────────────────────────────────────

export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

// ─── In-memory store con AsyncStorage persistence ─────────────────────────

class InMemoryDB {
  private motorcycles       = new Map<string, DBMotorcycle>();
  private maintenanceRecords= new Map<string, DBMaintenanceRecord>();
  private emergencyContacts = new Map<string, DBEmergencyContact>();
  private fallEvents        = new Map<string, DBFallEvent>();
  private loaded            = false;

  async load(): Promise<void> {
    if (this.loaded) return;
    try {
      const keys = ['mg_motorcycles', 'mg_maintenance', 'mg_contacts', 'mg_falls'];
      const pairs = await AsyncStorage.multiGet(keys);
      for (const [key, value] of pairs) {
        if (!value) continue;
        const data = JSON.parse(value) as Record<string, unknown>;
        if (key === 'mg_motorcycles')
          Object.entries(data).forEach(([id, v]) => this.motorcycles.set(id, v as DBMotorcycle));
        if (key === 'mg_maintenance')
          Object.entries(data).forEach(([id, v]) => this.maintenanceRecords.set(id, v as DBMaintenanceRecord));
        if (key === 'mg_contacts')
          Object.entries(data).forEach(([id, v]) => this.emergencyContacts.set(id, v as DBEmergencyContact));
        if (key === 'mg_falls')
          Object.entries(data).forEach(([id, v]) => this.fallEvents.set(id, v as DBFallEvent));
      }
    } catch { /* first run */ }
    this.loaded = true;
  }

  private async persist(key: string, map: Map<string, unknown>): Promise<void> {
    try {
      await AsyncStorage.setItem(key, JSON.stringify(Object.fromEntries(map)));
    } catch { /* ignore persistence errors */ }
  }

  // ─── Motorcycles ──────────────────────────────────────────────────────

  async getMotorcycles(): Promise<DBMotorcycle[]> {
    await this.load();
    return Array.from(this.motorcycles.values());
  }

  async getMotorcycle(id: string): Promise<DBMotorcycle | null> {
    await this.load();
    return this.motorcycles.get(id) ?? null;
  }

  async saveMotorcycle(m: DBMotorcycle): Promise<DBMotorcycle> {
    await this.load();
    this.motorcycles.set(m.id, m);
    await this.persist('mg_motorcycles', this.motorcycles as Map<string, unknown>);
    return m;
  }

  async deleteMotorcycle(id: string): Promise<void> {
    await this.load();
    this.motorcycles.delete(id);
    await this.persist('mg_motorcycles', this.motorcycles as Map<string, unknown>);
  }

  // ─── Maintenance ──────────────────────────────────────────────────────

  async getMaintenanceByMoto(motorcycleId: string): Promise<DBMaintenanceRecord[]> {
    await this.load();
    return Array.from(this.maintenanceRecords.values())
      .filter((r) => r.motorcycleId === motorcycleId)
      .sort((a, b) => b.date - a.date);
  }

  async getLastMaintenance(motorcycleId: string, type: string): Promise<DBMaintenanceRecord | null> {
    const records = await this.getMaintenanceByMoto(motorcycleId);
    return records.find((r) => r.type === type) ?? null;
  }

  async saveMaintenance(r: DBMaintenanceRecord): Promise<DBMaintenanceRecord> {
    await this.load();
    this.maintenanceRecords.set(r.id, r);
    await this.persist('mg_maintenance', this.maintenanceRecords as Map<string, unknown>);
    return r;
  }

  async deleteMaintenance(id: string): Promise<void> {
    await this.load();
    this.maintenanceRecords.delete(id);
    await this.persist('mg_maintenance', this.maintenanceRecords as Map<string, unknown>);
  }

  // ─── Contacts ─────────────────────────────────────────────────────────

  async getContacts(): Promise<DBEmergencyContact[]> {
    await this.load();
    return Array.from(this.emergencyContacts.values())
      .sort((a, b) => a.createdAt - b.createdAt);
  }

  async saveContact(c: DBEmergencyContact): Promise<DBEmergencyContact> {
    await this.load();
    this.emergencyContacts.set(c.id, c);
    await this.persist('mg_contacts', this.emergencyContacts as Map<string, unknown>);
    return c;
  }

  async deleteContact(id: string): Promise<void> {
    await this.load();
    this.emergencyContacts.delete(id);
    await this.persist('mg_contacts', this.emergencyContacts as Map<string, unknown>);
  }

  // ─── Fall events ──────────────────────────────────────────────────────

  async saveFallEvent(e: DBFallEvent): Promise<DBFallEvent> {
    await this.load();
    this.fallEvents.set(e.id, e);
    await this.persist('mg_falls', this.fallEvents as Map<string, unknown>);
    return e;
  }
}

export const db = new InMemoryDB();
