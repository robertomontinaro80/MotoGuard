import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import { Input } from '../ui/Input';

describe('Input — render', () => {
  it('renders without crashing', () => {
    render(<Input testID="km-input" />);
    expect(screen.getByTestId('km-input')).toBeTruthy();
  });

  it('renders label when provided', () => {
    render(<Input label="Chilometri attuali" testID="km" />);
    expect(screen.getByTestId('km-label')).toHaveTextContent('Chilometri attuali');
  });

  it('does not render label when omitted', () => {
    render(<Input testID="km" />);
    expect(screen.queryByTestId('km-label')).toBeNull();
  });

  it('renders error message', () => {
    render(<Input error="Campo obbligatorio" testID="km" />);
    expect(screen.getByTestId('km-error')).toHaveTextContent('Campo obbligatorio');
  });

  it('renders hint when no error', () => {
    render(<Input hint="Es: 15000" testID="km" />);
    expect(screen.getByTestId('km-hint')).toHaveTextContent('Es: 15000');
  });

  it('hides hint when error is present', () => {
    render(<Input hint="Es: 15000" error="Errore" testID="km" />);
    expect(screen.queryByTestId('km-hint')).toBeNull();
  });
});

describe('Input — interaction', () => {
  it('calls onChangeText with typed value', () => {
    const onChange = jest.fn();
    render(<Input onChangeText={onChange} testID="km" />);
    fireEvent.changeText(screen.getByTestId('km'), '15000');
    expect(onChange).toHaveBeenCalledWith('15000');
  });

  it('triggers onFocus and onBlur', () => {
    const onFocus = jest.fn();
    const onBlur  = jest.fn();
    render(<Input onFocus={onFocus} onBlur={onBlur} testID="km" />);
    fireEvent(screen.getByTestId('km'), 'focus');
    fireEvent(screen.getByTestId('km'), 'blur');
    expect(onFocus).toHaveBeenCalledTimes(1);
    expect(onBlur).toHaveBeenCalledTimes(1);
  });
});
