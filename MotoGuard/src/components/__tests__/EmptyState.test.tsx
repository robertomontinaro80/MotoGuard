import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import { EmptyState } from '../ui/EmptyState';

describe('EmptyState', () => {
  it('renders title', () => {
    render(<EmptyState title="Nessuna moto aggiunta" />);
    expect(screen.getByText('Nessuna moto aggiunta')).toBeTruthy();
  });

  it('renders description when provided', () => {
    render(<EmptyState title="Titolo" description="Aggiungi la tua prima moto" />);
    expect(screen.getByTestId('empty-state-description')).toHaveTextContent('Aggiungi la tua prima moto');
  });

  it('does not render description when omitted', () => {
    render(<EmptyState title="Titolo" />);
    expect(screen.queryByTestId('empty-state-description')).toBeNull();
  });

  it('renders action button when actionLabel + onAction provided', () => {
    render(<EmptyState title="x" actionLabel="Aggiungi moto" onAction={jest.fn()} />);
    expect(screen.getByTestId('empty-state-action')).toBeTruthy();
  });

  it('calls onAction when button pressed', () => {
    const onAction = jest.fn();
    render(<EmptyState title="x" actionLabel="Aggiungi" onAction={onAction} />);
    fireEvent.press(screen.getByTestId('empty-state-action'));
    expect(onAction).toHaveBeenCalledTimes(1);
  });

  it('does NOT render button when onAction is missing', () => {
    render(<EmptyState title="x" actionLabel="Aggiungi" />);
    expect(screen.queryByTestId('empty-state-action')).toBeNull();
  });
});
