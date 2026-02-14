export type FieldType = 'text' | 'select';

export interface FieldConfig {
    label?: string;
    type: FieldType;
    options?: any[];
    default?: any;
    required?: boolean;
}
