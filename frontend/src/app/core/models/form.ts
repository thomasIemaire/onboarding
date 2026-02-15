import { FormRowConfig } from './form-row';
import { FormActionsConfig } from './form-actions';

export interface FormConfig {
    title?: string;
    rows: FormRowConfig[];
    actions?: FormActionsConfig;
}