/**
 * Barrel export — importa tutti i componenti UI da un solo punto.
 *
 * @example
 * import { Button, Card, Badge, StatusIndicator } from '@components/ui';
 */

export { Button }          from './Button';
export type { ButtonProps, ButtonVariant, ButtonSize } from './Button';

export { Card }            from './Card';
export type { CardProps, CardVariant } from './Card';

export { Typography, Display, Heading1, Heading2, Heading3, Body, BodyS, Label, Caption }
                           from './Typography';
export type { TypographyProps, TypographyVariant } from './Typography';

export { Badge }           from './Badge';
export type { BadgeProps, BadgeStatus } from './Badge';

export { StatusIndicator, computeStatus }
                           from './StatusIndicator';
export type { StatusIndicatorProps } from './StatusIndicator';

export { Input }           from './Input';
export type { InputProps } from './Input';

export { Divider, Spacer } from './Divider';
export type { DividerProps, SpacerProps } from './Divider';

export { ProgressBar }     from './ProgressBar';
export type { ProgressBarProps } from './ProgressBar';

export { EmptyState }      from './EmptyState';
export type { EmptyStateProps } from './EmptyState';

export { VerdictCard }     from './VerdictCard';

export { ScreenShell }     from './ScreenShell';
