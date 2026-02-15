export type FieldType = 'text' | 'select';

export interface FieldConfig {
    label?: string;
    type: FieldType;
    options?: any[];  // uniquement pour le type 'select'
    default?: any;    // valeur par défaut du champ
    required?: boolean;
}