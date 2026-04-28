import { db, generateId, DBMotorcycle } from './database';
import { Motorcycle } from '@types/index';

function toMotorcycle(m: DBMotorcycle): Motorcycle {
  return { ...m, createdAt: new Date(m.createdAt), updatedAt: new Date(m.updatedAt) };
}

export const MotorcycleRepository = {
  async getAll(): Promise<Motorcycle[]> {
    const records = await db.getMotorcycles();
    return records.map(toMotorcycle);
  },

  async findById(id: string): Promise<Motorcycle | null> {
    const r = await db.getMotorcycle(id);
    return r ? toMotorcycle(r) : null;
  },

  async create(data: Omit<Motorcycle, 'id' | 'createdAt' | 'updatedAt'>): Promise<Motorcycle> {
    const now = Date.now();
    const record: DBMotorcycle = {
      id: generateId(),
      brand: data.brand, model: data.model, year: data.year,
      licensePlate: data.licensePlate, currentKm: data.currentKm,
      engineCC: data.engineCC, color: data.color, photo: data.photo,
      createdAt: now, updatedAt: now,
    };
    const saved = await db.saveMotorcycle(record);
    return toMotorcycle(saved);
  },

  async updateKm(id: string, currentKm: number): Promise<void> {
    const existing = await db.getMotorcycle(id);
    if (!existing) return;
    await db.saveMotorcycle({ ...existing, currentKm, updatedAt: Date.now() });
  },

  async delete(id: string): Promise<void> {
    await db.deleteMotorcycle(id);
  },
};
