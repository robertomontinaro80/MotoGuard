import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react-native';
import { AddMotorcycleScreen } from '../AddMotorcycleScreen';

jest.mock('@store/appStore', () => ({
  useAppStore: (sel: (s: object) => unknown) => sel({ addMotorcycle: jest.fn().mockResolvedValue(undefined) }),
}));
jest.mock('@hooks/useAppNavigation', () => ({ useAppNavigation: () => ({ goBack: jest.fn() }) }));

describe('AddMotorcycleScreen — validation', () => {
  it('shows error if km field is empty — matches roadmap T2.2 spec', async () => {
    render(<AddMotorcycleScreen />);
    fireEvent.press(screen.getByTestId('submit-button'));
    await waitFor(() => {
      expect(screen.getByText('Inserisci i km attuali')).toBeTruthy();
    });
  });

  it('shows error if brand is empty', async () => {
    render(<AddMotorcycleScreen />);
    fireEvent.press(screen.getByTestId('submit-button'));
    await waitFor(() => expect(screen.getByText('Inserisci la marca')).toBeTruthy());
  });

  it('shows error if model is empty', async () => {
    render(<AddMotorcycleScreen />);
    fireEvent.press(screen.getByTestId('submit-button'));
    await waitFor(() => expect(screen.getByText('Inserisci il modello')).toBeTruthy());
  });

  it('shows error if year is invalid', async () => {
    render(<AddMotorcycleScreen />);
    fireEvent.changeText(screen.getByTestId('year-input'), '1800');
    fireEvent.press(screen.getByTestId('submit-button'));
    await waitFor(() => expect(screen.getByText('Anno non valido')).toBeTruthy());
  });

  it('clears error on field change', async () => {
    render(<AddMotorcycleScreen />);
    fireEvent.press(screen.getByTestId('submit-button'));
    await waitFor(() => expect(screen.getByText('Inserisci la marca')).toBeTruthy());
    fireEvent.changeText(screen.getByTestId('brand-input'), 'Ducati');
    await waitFor(() => expect(screen.queryByText('Inserisci la marca')).toBeNull());
  });
});

describe('AddMotorcycleScreen — submit', () => {
  const fillForm = () => {
    fireEvent.changeText(screen.getByTestId('brand-input'),   'Ducati');
    fireEvent.changeText(screen.getByTestId('model-input'),   'Monster 950');
    fireEvent.changeText(screen.getByTestId('year-input'),    '2022');
    fireEvent.changeText(screen.getByTestId('engine-input'),  '937');
    fireEvent.changeText(screen.getByTestId('plate-input'),   'AB123CD');
    fireEvent.changeText(screen.getByTestId('km-input'),      '15000');
  };

  it('submits successfully with valid data', async () => {
    render(<AddMotorcycleScreen />);
    fillForm();
    fireEvent.press(screen.getByTestId('submit-button'));
    await waitFor(() => expect(screen.queryByText('Inserisci la marca')).toBeNull());
  });
});
