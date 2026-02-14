export type ActionSeverity = 'primary' | 'secondary' | 'success' | 'info' | 'warn' | 'danger';

export interface ActionConfig {
    label: string;
    severity?: ActionSeverity;
    icon?: string;
    disabled?: boolean;
    command: () => void;
}
