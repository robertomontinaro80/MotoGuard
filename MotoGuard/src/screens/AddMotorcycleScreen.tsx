/**
 * AddMotorcycleScreen — form completo per aggiunta moto.
 * Implementa T2.2 della roadmap.
 */

import React, { useState } from 'react';
import { View, StyleSheet, Alert, ScrollView } from 'react-native';
import { ScreenShell } from '@components/ui/ScreenShell';
import { Input } from '@components/ui/Input';
import { Button } from '@components/ui/Button';
import { Spacer } from '@components/ui/Divider';
import { Spacing } from '@theme/index';
import { useAppStore } from '@store/appStore';
import { useAppNavigation } from '@hooks/useAppNavigation';

interface FormState {
  brand: string;
  model: string;
  year: string;
  licensePlate: string;
  currentKm: string;
  engineCC: string;
}

interface FormErrors {
  brand?: string;
  model?: string;
  year?: string;
  licensePlate?: string;
  currentKm?: string;
  engineCC?: string;
}

function validate(form: FormState): FormErrors {
  const errors: FormErrors = {};
  if (!form.brand.trim())        errors.brand = 'Inserisci la marca';
  if (!form.model.trim())        errors.model = 'Inserisci il modello';
  if (!form.licensePlate.trim()) errors.licensePlate = 'Inserisci la targa';

  const year = parseInt(form.year);
  if (!form.year || isNaN(year) || year < 1980 || year > new Date().getFullYear() + 1)
    errors.year = 'Anno non valido';

  const km = parseInt(form.currentKm);
  if (!form.currentKm || isNaN(km) || km < 0)
    errors.currentKm = 'Inserisci i km attuali';

  const cc = parseInt(form.engineCC);
  if (!form.engineCC || isNaN(cc) || cc < 50)
    errors.engineCC = 'Cilindrata non valida';

  return errors;
}

export function AddMotorcycleScreen() {
  const nav = useAppNavigation();
  const addMotorcycle = useAppStore((s) => s.addMotorcycle);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState<FormState>({
    brand: '', model: '', year: '', licensePlate: '', currentKm: '', engineCC: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});

  const set = (key: keyof FormState) => (value: string) => {
    setForm((f) => ({ ...f, [key]: value }));
    if (errors[key]) setErrors((e) => ({ ...e, [key]: undefined }));
  };

  const handleSubmit = async () => {
    const errs = validate(form);
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }

    setLoading(true);
    try {
      await addMotorcycle({
        brand:        form.brand.trim(),
        model:        form.model.trim(),
        year:         parseInt(form.year),
        licensePlate: form.licensePlate.toUpperCase().trim(),
        currentKm:    parseInt(form.currentKm),
        engineCC:     parseInt(form.engineCC),
      });
      nav.goBack();
    } catch (e) {
      Alert.alert('Errore', 'Impossibile salvare la moto. Riprova.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScreenShell title="Aggiungi moto" showBack testID="screen-add-motorcycle" scrollable>
      <Input label="Marca" value={form.brand} onChangeText={set('brand')}
        error={errors.brand} placeholder="Es: Ducati" testID="brand-input" />
      <Spacer size="md" />

      <Input label="Modello" value={form.model} onChangeText={set('model')}
        error={errors.model} placeholder="Es: Monster 950" testID="model-input" />
      <Spacer size="md" />

      <View style={styles.row}>
        <View style={styles.half}>
          <Input label="Anno" value={form.year} onChangeText={set('year')}
            error={errors.year} placeholder="Es: 2022"
            keyboardType="numeric" testID="year-input" />
        </View>
        <View style={styles.half}>
          <Input label="Cilindrata (cc)" value={form.engineCC} onChangeText={set('engineCC')}
            error={errors.engineCC} placeholder="Es: 937"
            keyboardType="numeric" testID="engine-input" />
        </View>
      </View>
      <Spacer size="md" />

      <Input label="Targa" value={form.licensePlate} onChangeText={set('licensePlate')}
        error={errors.licensePlate} placeholder="Es: AB123CD"
        autoCapitalize="characters" testID="plate-input" />
      <Spacer size="md" />

      <Input label="Chilometri attuali" value={form.currentKm} onChangeText={set('currentKm')}
        error={errors.currentKm} placeholder="Es: 15000"
        keyboardType="numeric" testID="km-input"
        hint="Controlla il quadro strumenti" />
      <Spacer size="xl" />

      <Button label="Salva moto" onPress={handleSubmit}
        loading={loading} fullWidth testID="submit-button" />
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: Spacing.md },
  half: { flex: 1 },
});
