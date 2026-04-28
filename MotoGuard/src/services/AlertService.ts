import * as Linking from 'expo-linking';
import { EmergencyContact } from '@types/index';
import { db, generateId } from './database';

export const AlertService = {
  buildSmsBody(lat: number, lng: number): string {
    const mapsUrl = `https://maps.google.com/?q=${lat},${lng}`;
    return `🚨 ALLERTA CADUTA MOTO - MotoGuard ha rilevato una possibile caduta. Posizione: ${mapsUrl}`;
  },

  async sendSms(phone: string, body: string): Promise<void> {
    const url = `sms:${phone}?body=${encodeURIComponent(body)}`;
    const canOpen = await Linking.canOpenURL(url);
    if (canOpen) await Linking.openURL(url);
  },

  async triggerEmergency(payload: { lat: number; lng: number; contacts: EmergencyContact[] }): Promise<void> {
    const { lat, lng, contacts } = payload;
    await db.saveFallEvent({
      id: generateId(), timestamp: Date.now(),
      lat, lng, gForce: 0, alertSent: true, canceledByUser: false, createdAt: Date.now(),
    });
    const body = this.buildSmsBody(lat, lng);
    for (const contact of contacts) {
      await this.sendSms(contact.phone, body);
    }
  },

  async getContacts(): Promise<EmergencyContact[]> {
    const records = await db.getContacts();
    return records.map((r) => ({
      id: r.id, name: r.name, phone: r.phone, relationship: r.relationship,
    }));
  },

  async addContact(data: Omit<EmergencyContact, 'id'>): Promise<EmergencyContact> {
    const existing = await this.getContacts();
    if (existing.length >= 3) throw new Error('MAX_CONTACTS_REACHED');
    const saved = await db.saveContact({
      id: generateId(), name: data.name, phone: data.phone,
      relationship: data.relationship, createdAt: Date.now(),
    });
    return { id: saved.id, name: saved.name, phone: saved.phone, relationship: saved.relationship };
  },

  async removeContact(id: string): Promise<void> {
    await db.deleteContact(id);
  },
};
