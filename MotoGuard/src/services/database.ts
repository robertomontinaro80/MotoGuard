/**
 * WatermelonDB — definizione modelli e schema del database locale.
 */

import { Database } from '@nozbe/watermelondb';
import SQLiteAdapter from '@nozbe/watermelondb/adapters/sqlite';
import { appSchema, tableSchema } from '@nozbe/watermelondb';
import { Model, field, date, readonly, text, relation } from '@nozbe/watermelondb/decorators';

// ─── Schema ────────────────────────────────────────────────────────────────

export const schema = appSchema({
  version: 1,
  tables: [
    tableSchema({
      name: 'motorcycles',
      columns: [
        { name: 'brand',         type: 'string' },
        { name: 'model',         type: 'string' },
        { name: 'year',          type: 'number' },
        { name: 'license_plate', type: 'string' },
        { name: 'current_km',    type: 'number' },
        { name: 'engine_cc',     type: 'number' },
        { name: 'color',         type: 'string', isOptional: true },
        { name: 'photo',         type: 'string', isOptional: true },
        { name: 'created_at',    type: 'number' },
        { name: 'updated_at',    type: 'number' },
      ],
    }),
    tableSchema({
      name: 'maintenance_records',
      columns: [
        { name: 'motorcycle_id',  type: 'string', isIndexed: true },
        { name: 'type',           type: 'string' },
        { name: 'km',             type: 'number' },
        { name: 'date',           type: 'number' },
        { name: 'cost',           type: 'number', isOptional: true },
        { name: 'notes',          type: 'string', isOptional: true },
        { name: 'receipt_photo',  type: 'string', isOptional: true },
        { name: 'workshop',       type: 'string', isOptional: true },
        { name: 'created_at',     type: 'number' },
      ],
    }),
    tableSchema({
      name: 'emergency_contacts',
      columns: [
        { name: 'name',         type: 'string' },
        { name: 'phone',        type: 'string' },
        { name: 'relationship', type: 'string', isOptional: true },
        { name: 'created_at',   type: 'number' },
      ],
    }),
    tableSchema({
      name: 'fall_events',
      columns: [
        { name: 'timestamp',         type: 'number' },
        { name: 'lat',               type: 'number' },
        { name: 'lng',               type: 'number' },
        { name: 'g_force',           type: 'number' },
        { name: 'alert_sent',        type: 'boolean' },
        { name: 'canceled_by_user',  type: 'boolean' },
        { name: 'created_at',        type: 'number' },
      ],
    }),
  ],
});

// ─── Modelli ───────────────────────────────────────────────────────────────

export class MotorcycleModel extends Model {
  static table = 'motorcycles';

  @text('brand')          brand!: string;
  @text('model')          model!: string;
  @field('year')          year!: number;
  @text('license_plate')  licensePlate!: string;
  @field('current_km')    currentKm!: number;
  @field('engine_cc')     engineCC!: number;
  @text('color')          color!: string;
  @text('photo')          photo!: string;
  @readonly @date('created_at') createdAt!: Date;
  @date('updated_at')     updatedAt!: Date;
}

export class MaintenanceRecordModel extends Model {
  static table = 'maintenance_records';

  @text('motorcycle_id')  motorcycleId!: string;
  @text('type')           type!: string;
  @field('km')            km!: number;
  @date('date')           date!: Date;
  @field('cost')          cost!: number;
  @text('notes')          notes!: string;
  @text('receipt_photo')  receiptPhoto!: string;
  @text('workshop')       workshop!: string;
  @readonly @date('created_at') createdAt!: Date;
}

export class EmergencyContactModel extends Model {
  static table = 'emergency_contacts';

  @text('name')         name!: string;
  @text('phone')        phone!: string;
  @text('relationship') relationship!: string;
  @readonly @date('created_at') createdAt!: Date;
}

export class FallEventModel extends Model {
  static table = 'fall_events';

  @date('timestamp')          timestamp!: Date;
  @field('lat')               lat!: number;
  @field('lng')               lng!: number;
  @field('g_force')           gForce!: number;
  @field('alert_sent')        alertSent!: boolean;
  @field('canceled_by_user')  canceledByUser!: boolean;
  @readonly @date('created_at') createdAt!: Date;
}

// ─── Database singleton ────────────────────────────────────────────────────

const adapter = new SQLiteAdapter({
  schema,
  migrations: undefined,
  jsi: true,
  onSetUpError: (error) => {
    console.error('DB setup error:', error);
  },
});

export const database = new Database({
  adapter,
  modelClasses: [
    MotorcycleModel,
    MaintenanceRecordModel,
    EmergencyContactModel,
    FallEventModel,
  ],
});
