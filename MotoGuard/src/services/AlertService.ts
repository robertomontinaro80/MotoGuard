/**
 * AlertService — invia allerte SMS ai contatti di emergenza.
 */

import * as Linking from 'expo-linking';
import { EmergencyContact } from '@types/index';
import { database, FallEventModel, EmergencyContactModel } from './database';

export interface AlertPayload {
  lat: number;
  lng: number;
  contacts: EmergencyContact[];
}

export const AlertService = {
  buildSmsBody(lat: number, lng: number): string {
    const mapsUrl = `https://maps.google.com/?q=${lat},${lng}`;
    return `🚨 ALLERTA CADUTA MOTO - MotoGuard ha rilevato una possibile caduta. Posizione: ${mapsUrl}`;
  },

  async sendSms(phone: string, body: string): Promise<void> {
    const url = `sms:${phone}?body=${encodeURIComponent(body)}`;
    const canOpen = await Linking.canOpenURL(url);
    if (canOpen) {
      await Linking.openURL(url);
    }
  },

  async triggerEmergency(payload: AlertPayload): Promise<void> {
    const { lat, lng, contacts } = payload;
    const body = this.buildSmsBody(lat, lng);

    // Salva evento nel DB
    await database.write(async () => {
      await database.get<FallEventModel>('fall_events').create((e) => {
        e.lat            = lat;
        e.lng            = lng;
        e.gForce         = 0;
        e.alertSent      = true;
        e.canceledByUser = false;
      });
    });

    // Invia SMS a tutti i contatti
    for (const contact of contacts) {
      await this.sendSms(contact.phone, body);
    }
  },

  async getContacts(): Promise<EmergencyContact[]> {
    const records = await database
      .get<EmergencyContactModel>('emergency_contacts')
      .query()
      .fetch();
    return records.map((r) => ({
      id: r.id,
      name: r.name,
      phone: r.phone,
      relationship: r.relationship,
    }));
  },

  async addContact(data: Omit<EmergencyContact, 'id'>): Promise<EmergencyContact> {
    const existing = await this.getContacts();
    if (existing.length >= 3) throw new Error('MAX_CONTACTS_REACHED');

    let created!: EmergencyContactModel;
    await database.write(async () => {
      created = await database
        .get<EmergencyContactModel>('emergency_contacts')
        .create((c) => {
          c.name         = data.name;
          c.phone        = data.phone;
          c.relationship = data.relationship ?? '';
        });
    });

    return { id: created.id, name: created.name, phone: created.phone, relationship: created.relationship };
  },

  async removeContact(id: string): Promise<void> {
    await database.write(async () => {
      const record = await database.get<EmergencyContactModel>('emergency_contacts').find(id);
      await record.markAsDeleted();
    });
  },
};
