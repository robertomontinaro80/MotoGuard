/**
 * MotorcycleRepository — CRUD per le moto salvate nel DB locale.
 */

import { database, MotorcycleModel } from './database';
import { Motorcycle } from '@types/index';

const collection = database.get<MotorcycleModel>('motorcycles');

function toMotorcycle(m: MotorcycleModel): Motorcycle {
  return {
    id: m.id,
    brand: m.brand,
    model: m.model,
    year: m.year,
    licensePlate: m.licensePlate,
    currentKm: m.currentKm,
    engineCC: m.engineCC,
    color: m.color,
    photo: m.photo,
    createdAt: m.createdAt,
    updatedAt: m.updatedAt,
  };
}

export const MotorcycleRepository = {
  async getAll(): Promise<Motorcycle[]> {
    const records = await collection.query().fetch();
    return records.map(toMotorcycle);
  },

  async findById(id: string): Promise<Motorcycle | null> {
    try {
      const record = await collection.find(id);
      return toMotorcycle(record);
    } catch {
      return null;
    }
  },

  async create(data: Omit<Motorcycle, 'id' | 'createdAt' | 'updatedAt'>): Promise<Motorcycle> {
    let created!: MotorcycleModel;
    await database.write(async () => {
      created = await collection.create((m) => {
        m.brand = data.brand;
        m.model = data.model;
        m.year = data.year;
        m.licensePlate = data.licensePlate;
        m.currentKm = data.currentKm;
        m.engineCC = data.engineCC;
        m.color = data.color ?? '';
        m.photo = data.photo ?? '';
      });
    });
    return toMotorcycle(created);
  },

  async updateKm(id: string, currentKm: number): Promise<void> {
    await database.write(async () => {
      const record = await collection.find(id);
      await record.update((m) => { m.currentKm = currentKm; });
    });
  },

  async delete(id: string): Promise<void> {
    await database.write(async () => {
      const record = await collection.find(id);
      await record.markAsDeleted();
    });
  },
};
