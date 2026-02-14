export type FieldType = 'text' | 'select';

export interface FieldConfig {
    key: string;
    label?: string;
    type: FieldType;
    options?: any[];
    default?: any;
    required?: boolean;
}
