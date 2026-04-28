/**
 * EmergencyScreen — gestione contatti SOS + stato rilevamento caduta.
 */

import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { ScreenShell } from '@components/ui/ScreenShell';
import { Card } from '@components/ui/Card';
import { Badge } from '@components/ui/Badge';
import { Button } from '@components/ui/Button';
import { Input } from '@components/ui/Input';
import { Divider, Spacer } from '@components/ui/Divider';
import { Colors, Spacing, Typography } from '@theme/index';
import { AlertService } from '@services/AlertService';
import { EmergencyContact } from '@types/index';

export function EmergencyScreen() {
  const [contacts, setContacts] = useState<EmergencyContact[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [name,  setName]  = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => { loadContacts(); }, []);

  const loadContacts = async () => {
    const list = await AlertService.getContacts();
    setContacts(list);
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!name.trim())  e.name  = 'Inserisci un nome';
    if (!phone.trim()) e.phone = 'Inserisci un numero';
    else if (!/^\+?[\d\s\-]{8,15}$/.test(phone)) e.phone = 'Numero non valido';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleAdd = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      await AlertService.addContact({ name: name.trim(), phone: phone.trim() });
      await loadContacts();
      setName(''); setPhone(''); setShowForm(false); setErrors({});
    } catch (e: any) {
      if (e.message === 'MAX_CONTACTS_REACHED')
        Alert.alert('Limite raggiunto', 'Puoi aggiungere massimo 3 contatti SOS.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (contact: EmergencyContact) => {
    Alert.alert('Rimuovi contatto', `Rimuovere ${contact.name}?`, [
      { text: 'Annulla', style: 'cancel' },
      { text: 'Rimuovi', style: 'destructive', onPress: async () => {
        await AlertService.removeContact(contact.id);
        await loadContacts();
      }},
    ]);
  };

  const isActive = contacts.length > 0;

  return (
    <ScreenShell testID="screen-emergency" title="SOS & Sicurezza" scrollable>
      <Card variant={isActive ? 'accent' : 'flat'} style={styles.statusCard} testID="fall-detection-card">
        <View style={styles.statusRow}>
          <Text style={styles.statusTitle}>Rilevamento caduta</Text>
          <Badge label={isActive ? 'Attivo' : 'Non attivo'}
            status={isActive ? 'ok' : 'neutral'} testID="fall-detection-badge" />
        </View>
        <Text style={styles.statusDesc}>
          {isActive ? 'Attivato automaticamente quando sei in movimento sopra 10 km/h.'
            : 'Aggiungi almeno un contatto SOS per abilitare il rilevamento caduta.'}
        </Text>
      </Card>

      <Text style={styles.sectionTitle}>Contatti SOS ({contacts.length}/3)</Text>

      {contacts.length === 0 ? (
        <Card variant="flat" style={styles.emptyContacts} testID="contacts-empty">
          <Text style={styles.emptyText}>Nessun contatto aggiunto</Text>
        </Card>
      ) : (
        <Card style={styles.contactsCard} testID="contacts-list">
          {contacts.map((c, i) => (
            <View key={c.id}>
              <View style={styles.contactRow} testID={`contact-${c.id}`}>
                <Text style={styles.contactEmoji}>👤</Text>
                <View style={styles.contactInfo}>
                  <Text style={styles.contactName}>{c.name}</Text>
                  <Text style={styles.contactPhone}>{c.phone}</Text>
                </View>
                <TouchableOpacity onPress={() => handleDelete(c)} testID={`delete-contact-${c.id}`}>
                  <Text style={styles.deleteBtn}>✕</Text>
                </TouchableOpacity>
              </View>
              {i < contacts.length - 1 && <Divider />}
            </View>
          ))}
        </Card>
      )}

      {contacts.length < 3 && (
        <>
          <Spacer size="md" />
          {!showForm ? (
            <Button label="+ Aggiungi contatto" variant="secondary" fullWidth
              onPress={() => setShowForm(true)} testID="add-contact-btn"
              style={{ marginHorizontal: Spacing.md }} />
          ) : (
            <Card style={styles.formCard} testID="add-contact-form">
              <Input label="Nome" value={name} onChangeText={setName}
                error={errors.name} placeholder="Es: Mario Rossi" testID="contact-name-input" />
              <Spacer size="sm" />
              <Input label="Telefono" value={phone} onChangeText={setPhone}
                error={errors.phone} placeholder="+39 333 111 2222"
                keyboardType="phone-pad" testID="contact-phone-input" />
              <Spacer size="md" />
              <View style={styles.formBtns}>
                <Button label="Annulla" variant="ghost"
                  onPress={() => { setShowForm(false); setErrors({}); }}
                  style={styles.formBtn} testID="cancel-contact-btn" />
                <Button label="Salva" onPress={handleAdd} loading={loading}
                  style={styles.formBtn} testID="save-contact-btn" />
              </View>
            </Card>
          )}
        </>
      )}

      {contacts.length > 0 && (
        <>
          <Spacer size="lg" />
          <Card variant="flat" style={styles.testCard} testID="test-alert-card">
            <Text style={styles.testTitle}>Test allerta</Text>
            <Text style={styles.testDesc}>Verifica che i tuoi contatti ricevano la notifica.</Text>
            <Button label="📤 Invia test" variant="ghost" fullWidth
              onPress={() => Alert.alert('Test inviato', 'Notifica di test inviata.')}
              testID="test-alert-btn" style={{ marginTop: Spacing.sm }} />
          </Card>
        </>
      )}
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  statusCard:   { margin: Spacing.md, gap: Spacing.sm },
  statusRow:    { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  statusTitle:  { ...(Typography.h3 as object) },
  statusDesc:   { ...(Typography.bodyS as object) },
  sectionTitle: { ...(Typography.label as object), paddingHorizontal: Spacing.md, paddingBottom: Spacing.xs },
  emptyContacts:{ marginHorizontal: Spacing.md, alignItems: 'center', paddingVertical: Spacing.lg },
  emptyText:    { ...(Typography.bodyS as object) },
  contactsCard: { marginHorizontal: Spacing.md },
  contactRow:   { flexDirection: 'row', alignItems: 'center', paddingVertical: Spacing.sm, gap: Spacing.sm },
  contactEmoji: { fontSize: 22 },
  contactInfo:  { flex: 1 },
  contactName:  { ...(Typography.body as object), fontWeight: '600' },
  contactPhone: { ...(Typography.caption as object) },
  deleteBtn:    { color: Colors.status.danger, fontSize: 16, padding: Spacing.xs },
  formCard:     { margin: Spacing.md },
  formBtns:     { flexDirection: 'row', gap: Spacing.md },
  formBtn:      { flex: 1 },
  testCard:     { marginHorizontal: Spacing.md, gap: Spacing.xs },
  testTitle:    { ...(Typography.h3 as object) },
  testDesc:     { ...(Typography.bodyS as object) },
});
