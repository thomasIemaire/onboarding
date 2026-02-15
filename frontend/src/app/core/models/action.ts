export type ActionSeverity = 'primary' | 'secondary' | 'success' | 'info' | 'warn' | 'danger';

export interface ActionConfig {
    label: string;
    severity?: ActionSeverity;
    icon?: string;            // icône PrimeIcons (ex: 'pi pi-check')
    disabled?: boolean;
    command: () => void;      // fonction exécutée au clic
}