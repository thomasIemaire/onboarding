# Exangular

## Initialiser un projet Angular (dernière version)

### Prérequis

- [Node.js](https://nodejs.org/) (version LTS recommandée)
- npm (inclus avec Node.js)

### 1. Installer Angular CLI

```bash
npm install -g @angular/cli@latest
```

> Sur Windows, si PowerShell bloque l'exécution, lancer :
> ```powershell
> Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned
> ```

### 2. Créer une architecture git

```bash
git checkout -b develop main
git checkout -b feature/create-project develop
```

### 3. Créer un nouveau projet

```bash
ng new form-angular --style=scss --ssr=false --skip-tests
cd form-angular
```

### 4. Installer PrimeNG

```bash
npm install -f primeng @primeuix/themes
npm install -f primeicons
```

#### 4.1 Configurer le provider PrimeNG

Ajouter `providePrimeNG` dans la liste des providers de `app.config.ts` :

```ts
import { ApplicationConfig } from '@angular/core';
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeuix/themes/aura';

export const appConfig: ApplicationConfig = {
    providers: [
        ...
        providePrimeNG({
            theme: {
                preset: Aura
            }
        })
    ]
};
```

#### 4.2 Importer les icônes PrimeNG

Ajouter la ligne suivante dans `styles.scss` :

```scss
@import "primeicons/primeicons.css";
```

### 5. Lancer le serveur de développement

```bash
ng serve --open
```

L'application est accessible sur `http://localhost:4200/`.

#### Commandes utiles

| Commande | Description |
|---|---|
| `ng generate component nom` | Créer un composant |
| `ng generate service nom` | Créer un service |
| `ng test` | Lancer les tests unitaires |
| `ng build` | Compiler pour la production |

#### Documentation officielle

[angular.dev](https://angular.dev/)

### 6. Préparer l'architecture du projet

1. Vider le contenu de `src/app/app.html` (supprimer le template par défaut d'Angular)

2. Créer l'arborescence suivante dans `src/app/` :

```
src/app/
├── core/
│   └── models/     # Interfaces et types (FieldConfig, FormConfig, etc.)
├── services/       # Services partagés (API, auth, etc.)
├── components/     # Composants réutilisables (field, form-row, form, etc.)
├── pages/          # Composants de pages (routed components)
└── shared/         # Pipes, directives, modules partagés
```

```powershell
foreach ($dir in "core/models","services","components","pages","shared") { New-Item -Path "src/app/$dir/.gitkeep" -ItemType File -Force }
```

> Le flag `-Force` crée automatiquement les dossiers parents s'ils n'existent pas.

> Git ignore les dossiers vides. Le fichier `.gitkeep` sert uniquement à forcer leur suivi.

3. Ajouter du contenu dans `src/styles.scss`

```scss
@import url('https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap');

* {
    -webkit-tap-highlight-color: transparent;
    box-sizing: border-box;

    ::after,
    ::before {
        box-sizing: inherit;
    }
}

html,
body {
    margin: 0;
    padding: 0;
    font-size: 14px;
    font-family: "Inter", sans-serif;
    line-height: normal;
}

body {
    padding: 1rem;
}

app-form {
    display: block;
}
```


### 7. Sauvegarder et merger dans develop

```bash
git add .
git commit -m "Création du projet Angular"
git push -u origin feature/create-project
git checkout develop
git merge feature/create-project
git push -u origin develop
git branch -d feature/create-project
git push origin --delete feature/create-project
```

### 8. Créer une branche pour développer le formulaire

```bash
git checkout -b feature/form develop
```

---

## Développement des composants

> Architecture des composants :
> `FormComponent` > `FormRowComponent` > `FieldComponent` > `TextFieldComponent` / `SelectFieldComponent`
> `FormComponent` > `FormActionsComponent` > `ActionComponent`

### 9. Créer un composant text-field

#### 9.1 Générer le composant

```bash
ng generate component components/text-field
```

#### 9.2 Ajouter la logique dans `text-field.ts`

```ts
import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';

@Component({
    ...
    imports: [InputTextModule, FormsModule]
})
export class TextFieldComponent {
    @Input() value: string = '';
}
```

#### 9.3 Ajouter le template dans `text-field.html`

```html
<input type="text" pInputText [(ngModel)]="value" fluid />
```

> `pInputText` est la directive PrimeNG qui applique le style au champ.
> `[(ngModel)]` lie la valeur du champ à la propriété `value` du composant (two-way binding).

### 10. Créer un composant select-field

#### 10.1 Générer le composant

```bash
ng generate component components/select-field
```

#### 10.2 Ajouter la logique dans `select-field.ts`

```ts
import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SelectModule } from 'primeng/select';

@Component({
    ...
    imports: [SelectModule, FormsModule]
})
export class SelectFieldComponent {
    @Input() options: any[] = [];
    @Input() selected: any = null;
}
```

#### 10.3 Ajouter le template dans `select-field.html`

```html
<p-select [options]="options" [(ngModel)]="selected" placeholder="Sélectionner..." fluid />
```

> `p-select` est le composant dropdown de PrimeNG.
> `[options]` reçoit la liste des choix depuis le composant parent via `@Input()`.
> `[(ngModel)]` lie la valeur sélectionnée à la propriété `selected` (two-way binding).

### 11. Créer un composant field (wrapper générique)

Un composant qui affiche un label optionnel et délègue le rendu au bon sous-composant selon le type.

#### 11.1 Créer le modèle dans `core/models/field.ts`

```ts
export type FieldType = 'text' | 'select';

export interface FieldConfig {
    label?: string;
    type: FieldType;
    options?: any[];  // uniquement pour le type 'select'
    default?: any;    // valeur par défaut du champ
}
```

> On sépare l'interface du composant pour pouvoir la réutiliser ailleurs (services, pages, etc.).

#### 11.2 Générer le composant

```bash
ng generate component components/field
```

#### 11.3 Ajouter la logique dans `field.ts`

```ts
import { Component, Input } from '@angular/core';
import { TextFieldComponent } from '../text-field/text-field';
import { SelectFieldComponent } from '../select-field/select-field';
import { FieldConfig } from '../../core/models/field';

@Component({
    ...
    imports: [TextFieldComponent, SelectFieldComponent]
})
export class FieldComponent {
    @Input({ required: true }) field!: FieldConfig;
}
```

#### 11.4 Ajouter le template dans `field.html`

```html
@if (field.label) {
    <label>{{ field.label }}</label>
}

@switch (field.type) {
    @case ('text') {
        <app-text-field [value]="field.default" (valueChange)="onValueChange($event)" />
    }
    @case ('select') {
        <app-select-field [options]="field.options ?? []" [selected]="field.default" (valueChange)="onValueChange($event)" />
    }
}
```

> `@switch` est la nouvelle syntaxe de control flow d'Angular (remplace `ngSwitch`).

#### 11.5 Ajouter le style dans `field.scss`

```scss
:host {
    display: block;
}

label {
    display: block;
    margin-bottom: 0.5rem;
}

input,
p-select {
    width: 100%;
}
```

> `:host` permet au composant de se comporter en `block` pour que `flex: 1` du parent fonctionne.
> `width: 100%` rend les inputs fluides : ils prennent toute la largeur disponible.

### 12. Créer un composant form-row

Un composant qui regroupe plusieurs champs sur une même ligne, avec un titre optionnel.

#### 12.1 Créer le modèle dans `core/models/form-row.ts`

```ts
import { FieldConfig } from './field';

export interface FormRowConfig {
    title?: string;
    fields: FieldConfig[];
}
```

#### 12.2 Générer le composant

```bash
ng generate component components/form-row
```

#### 12.3 Ajouter la logique dans `form-row.ts`

```ts
import { Component, Input } from '@angular/core';
import { FieldComponent } from '../field/field';
import { FormRowConfig } from '../../core/models/form-row';

@Component({
    ...
    imports: [FieldComponent]
})
export class FormRowComponent {
    @Input({ required: true }) row!: FormRowConfig;
}
```

#### 12.4 Ajouter le template dans `form-row.html`

```html
@if (row.title) {
    <h3>{{ row.title }}</h3>
}

<div class="form-row">
    @for (field of row.fields; track field) {
        <app-field [field]="field" />
    }
</div>
```

> `@for` est la nouvelle syntaxe de boucle Angular (remplace `*ngFor`).

#### 12.5 Ajouter le style dans `form-row.scss`

```scss
.form-row {
    display: flex;
    gap: 1rem;
    align-items: flex-start;

    app-field {
        flex: 1;
        min-width: 0;
    }
}
```

> `flex: 1` permet à chaque champ de prendre une largeur égale dans la ligne.
> `min-width: 0` empêche les champs de déborder du conteneur flex.
> `align-items: flex-start` aligne les champs en haut (le label est au-dessus).

### 13. Créer un composant action

Un bouton configurable utilisant PrimeNG Button.

#### 13.1 Créer le modèle dans `core/models/action.ts`

```ts
export type ActionSeverity = 'primary' | 'secondary' | 'success' | 'info' | 'warn' | 'danger';

export interface ActionConfig {
    label: string;
    severity?: ActionSeverity;
    icon?: string;            // icône PrimeIcons (ex: 'pi pi-check')
    disabled?: boolean;
    command: () => void;      // fonction exécutée au clic
}
```

#### 13.2 Générer le composant

```bash
ng generate component components/action
```

#### 13.3 Ajouter la logique dans `action.ts`

```ts
import { Component, Input } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { ActionConfig } from '../../core/models/action';

@Component({
    ...
    imports: [ButtonModule]
})
export class ActionComponent {
    @Input({ required: true }) action!: ActionConfig;
}
```

#### 13.4 Ajouter le template dans `action.html`

```html
<p-button
    [label]="action.label"
    [severity]="action.severity ?? 'primary'"
    [icon]="action.icon ?? ''"
    [disabled]="action.disabled ?? false"
    (onClick)="action.command()"
/>
```

> `p-button` est le composant bouton de PrimeNG.
> `(onClick)` appelle la fonction `command` définie dans la config.

### 14. Créer un composant form-actions

Un composant qui regroupe les boutons d'action du formulaire sur une ligne.

#### 14.1 Créer le modèle dans `core/models/form-actions.ts`

```ts
import { ActionConfig } from './action';

export interface FormActionsConfig {
    actions: ActionConfig[];
}
```

#### 14.2 Générer le composant

```bash
ng generate component components/form-actions
```

#### 14.3 Ajouter la logique dans `form-actions.ts`

```ts
import { Component, Input } from '@angular/core';
import { ActionComponent } from '../action/action';
import { FormActionsConfig } from '../../core/models/form-actions';

@Component({
    ...
    imports: [ActionComponent]
})
export class FormActionsComponent {
    @Input({ required: true }) config!: FormActionsConfig;
}
```

#### 14.4 Ajouter le template dans `form-actions.html`

```html
<div class="form-actions">
    @for (action of config.actions; track action) {
        <app-action [action]="action" />
    }
</div>
```

#### 14.5 Ajouter le style dans `form-actions.scss`

```scss
.form-actions {
    display: flex;
    gap: 0.5rem;
    justify-content: flex-end;
    margin-top: 1rem;
}
```

> Les boutons sont alignés à droite avec `justify-content: flex-end`.

### 15. Créer un composant form

Le composant principal qui assemble le tout : un titre optionnel, des lignes de champs et des boutons d'action.

#### 15.1 Créer le modèle dans `core/models/form.ts`

```ts
import { FormRowConfig } from './form-row';
import { FormActionsConfig } from './form-actions';

export interface FormConfig {
    title?: string;
    rows: FormRowConfig[];
    actions?: FormActionsConfig;
}
```

#### 15.2 Générer le composant

```bash
ng generate component components/form
```

#### 15.3 Ajouter la logique dans `form.ts`

```ts
import { Component, Input } from '@angular/core';
import { FormRowComponent } from '../form-row/form-row';
import { FormActionsComponent } from '../form-actions/form-actions';
import { FormConfig } from '../../core/models/form';

@Component({
    ...
    imports: [FormRowComponent, FormActionsComponent]
})
export class FormComponent {
    @Input({ required: true }) config!: FormConfig;
}
```

#### 15.4 Ajouter le template dans `form.html`

```html
@if (config.title) {
    <h2>{{ config.title }}</h2>
}

@for (row of config.rows; track row) {
    <app-form-row [row]="row" />
}

@if (config.actions) {
    <app-form-actions [config]="config.actions" />
}
```

```scss
:host {
    display: flex;
    flex-direction: column;
    gap: .5rem;
}
```

> Architecture finale :
> ```
> FormComponent
> ├── FormRowComponent
> │   └── FieldComponent
> │       ├── TextFieldComponent
> │       └── SelectFieldComponent
> └── FormActionsComponent
>     └── ActionComponent
> ```

### 16. Sauvegarder et merger dans develop

```bash
git add .
git commit -m "Ajout des composants formulaire"
git push -u origin feature/form
git checkout develop
git merge feature/form
git push -u origin develop
git branch -d feature/form
git push origin --delete feature/form
```

---

## Page Members

### 17. Créer une branche pour la page members

```bash
git checkout -b feature/members develop
```

### 18. Créer le modèle Member

Créer le fichier `core/models/member.ts` :

```ts
export type MemberStatus = 'lecteur' | 'editeur' | 'admin';

export interface Member {
    nom: string;
    prenom: string;
    email: string;
    status: MemberStatus;
}
```

### 19. Créer la page members

#### 19.1 Générer le composant page

```bash
ng generate component pages/members
```

#### 19.2 Configurer la route `/members`

Dans `app.routes.ts` :

```ts
import { Routes } from '@angular/router';
import { MembersComponent } from './pages/members/members';

export const routes: Routes = [
    { path: 'members', component: MembersComponent },
    { path: '', redirectTo: 'members', pathMatch: 'full' }
];
```

> `redirectTo` redirige la racine `/` vers `/members` par défaut.

#### 19.3 Vérifier que le routeur est configuré dans `app.config.ts`

```ts
import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeuix/themes/aura';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
    providers: [
        provideRouter(routes),
        providePrimeNG({
            theme: {
                preset: Aura
            }
        })
    ]
};
```

#### 19.4 Ajouter le router-outlet dans `app.html`

```html
<router-outlet />
```

> `<router-outlet>` est le point d'insertion où Angular affiche le composant correspondant à la route active.

### 20. Ajouter le formulaire d'ajout de membre

#### 20.1 Ajouter la logique dans `members.ts`

```ts
import { Component } from '@angular/core';
import { FormComponent } from '../../components/form/form';
import { FormConfig } from '../../core/models/form';
import { Member } from '../../core/models/member';

@Component({
    ...
    imports: [FormComponent]
})
export class MembersComponent {
    members: Member[] = [];

    formConfig: FormConfig = {
        title: 'Ajouter un membre',
        rows: [
            {
                fields: [
                    { type: 'text', label: 'Nom' },
                    { type: 'text', label: 'Prénom' }
                ]
            },
            {
                fields: [
                    { type: 'text', label: 'Email' }
                ]
            },
            {
                fields: [
                    {
                        type: 'select',
                        label: 'Statut',
                        options: ['lecteur', 'editeur', 'admin'],
                        default: 'lecteur'
                    }
                ]
            }
        ],
        actions: {
            actions: [
                {
                    label: 'Ajouter',
                    severity: 'primary',
                    icon: 'pi pi-plus',
                    command: () => this.addMember()
                }
            ]
        }
    };

    addMember(): void {
        // TODO: récupérer les valeurs du formulaire et ajouter le membre
    }
}
```

> Nom et Prénom sont sur la même ligne (même `row` avec deux `fields`).
> Email et Statut sont chacun sur leur propre ligne.

#### 20.2 Ajouter le template dans `members.html`

```html
<h1>Membres</h1>

<app-form [config]="formConfig" [style.width.px]="400" />
```

### 21. Sauvegarder et merger dans develop

```bash
git add .
git commit -m "Ajout de la page members avec formulaire"
git push -u origin feature/members
git checkout develop
git merge feature/members
git push -u origin develop
git branch -d feature/members
git push origin --delete feature/members
```

### 22. Merger develop dans main

```bash
git checkout main
git merge develop
git push origin main
```

> Develop et main sont maintenant au même niveau.

---

## Hotfix : champs obligatoires

### 23. Créer la branche hotfix

```bash
git checkout -b hotfix/required-field main
```

### 24. Ajouter le support des champs obligatoires

#### 24.1 Ajouter la propriété `required` au modèle FieldConfig

Dans `core/models/field.ts` :

```ts
export type FieldType = 'text' | 'select';

export interface FieldConfig {
    label?: string;
    type: FieldType;
    options?: any[];
    default?: any;
    required?: boolean;
}
```

#### 24.2 Modifier le composant field

```html
@if (field.label) {
<label>
  {{ field.label }}
  @if (field.required) {
  <span class="required">*</span>
  }
</label>
}
```

```scss
.required {
    color: var(--p-red-500)
}
```


### 25. Ajouter un `Output` value aux sous-composants

Les sous-composants doivent remonter leur valeur au composant `Field` pour vérifier si le champ est vide.

#### 25.1 Modifier `text-field.ts`

```ts
import { Component, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';

@Component({
    ...
    imports: [InputTextModule, FormsModule]
})
export class TextFieldComponent {
    value: string = '';
    @Output() valueChange = new EventEmitter<string>();

    onInput(): void {
        this.valueChange.emit(this.value);
    }
}
```

#### 25.2 Modifier le template `text-field.html`

```html
<input type="text" pInputText [(ngModel)]="value" (ngModelChange)="onInput()" fluid />
```

#### 25.3 Modifier `select-field.ts`

```ts
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SelectModule } from 'primeng/select';

@Component({
    ...
    imports: [SelectModule, FormsModule]
})
export class SelectFieldComponent {
    @Input() options: any[] = [];
    @Input() selected: any = null;
    @Output() valueChange = new EventEmitter<any>();

    onSelect(): void {
        this.valueChange.emit(this.selected);
    }
}
```

#### 25.4 Modifier le template `select-field.html`

```html
<p-select [options]="options" [selected]="selected" (ngModelChange)="onSelect()" placeholder="Sélectionner..." fluid />
```

### 26. Ajouter la validation dans le composant Field

#### 26.1 Modifier `field.ts`

```ts
import { Component, Input } from '@angular/core';
import { TextFieldComponent } from '../text-field/text-field';
import { SelectFieldComponent } from '../select-field/select-field';
import { FieldConfig } from '../../core/models/field';

@Component({
    ...
    imports: [TextFieldComponent, SelectFieldComponent]
})
export class FieldComponent {
    @Input({ required: true }) field!: FieldConfig;
    @Input() submitted: boolean = false;

    value: any = '';

    onValueChange(val: any): void {
        this.value = val;
    }

    get showError(): boolean {
        return this.submitted && !!this.field.required && !this.value;
    }
}
```

#### 26.2 Modifier le template `field.html`

```html
@if (field.label) {
    <label>
        {{ field.label }}
        @if (field.required) {
            <span class="required">*</span>
        }
    </label>
}

@switch (field.type) {
    @case ('text') {
        <app-text-field (valueChange)="onValueChange($event)" />
    }
    @case ('select') {
        <app-select-field [options]="field.options ?? []" (valueChange)="onValueChange($event)" />
    }
}

@if (showError) {
    <small class="error">Champ obligatoire</small>
}
```

#### 26.3 Ajouter le style d'erreur dans `field.scss`

```scss
:host {
    display: block;
}

label {
    display: block;
    margin-bottom: 0.5rem;
}

input,
p-select {
    width: 100%;
}

.required {
    color: var(--p-red-500);
}

.error {
    color: #e24c4c;
    margin-top: 0.25rem;
    display: block;
}
```

### 27. Propager le `submitted` depuis Form vers Field

#### 27.1 Modifier `form.ts`

```ts
import { Component, Input } from '@angular/core';
import { FormRowComponent } from '../form-row/form-row';
import { FormActionsComponent } from '../form-actions/form-actions';
import { FormConfig } from '../../core/models/form';

@Component({
    ...
    imports: [FormRowComponent, FormActionsComponent]
})
export class FormComponent {
    @Input({ required: true }) config!: FormConfig;
    submitted: boolean = false;

    onSubmit(): void {
        this.submitted = true;
    }
}
```

#### 27.2 Modifier le template `form.html`

```html
@if (config.title) {
    <h2>{{ config.title }}</h2>
}

@for (row of config.rows; track row) {
    <app-form-row [row]="row" [submitted]="submitted" />
}

@if (config.actions) {
    <app-form-actions [config]="config.actions" (actionClick)="onSubmit()" />
}
```

#### 27.3 Modifier `form-row.ts`

```ts
import { Component, Input } from '@angular/core';
import { FieldComponent } from '../field/field';
import { FormRowConfig } from '../../core/models/form-row';

@Component({
    ...
    imports: [FieldComponent]
})
export class FormRowComponent {
    @Input({ required: true }) row!: FormRowConfig;
    @Input() submitted: boolean = false;
}
```

#### 27.4 Modifier le template `form-row.html`

```html
@if (row.title) {
    <h3>{{ row.title }}</h3>
}

<div class="form-row">
    @for (field of row.fields; track field) {
        <app-field [field]="field" [submitted]="submitted" />
    }
</div>
```

### 28. Ajouter un `Output` au composant form-actions

Pour notifier le form qu'un bouton a été cliqué (déclenchement de la validation).

#### 28.1 Modifier `form-actions.ts`

```ts
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ActionComponent } from '../action/action';
import { FormActionsConfig } from '../../core/models/form-actions';

@Component({
    ...
    imports: [ActionComponent]
})
export class FormActionsComponent {
    @Input({ required: true }) config!: FormActionsConfig;
    @Output() actionClick = new EventEmitter<void>();

    onAction(): void {
        this.actionClick.emit();
    }
}
```

#### 28.2 Modifier le template `form-actions.html`

```html
<div class="form-actions">
    @for (action of config.actions; track action) {
        <app-action [action]="action" (click)="onAction()" />
    }
</div>
```

### 29. Marquer les champs obligatoires dans la page members

Dans `members.ts`, ajouter `required: true` aux champs :

```ts
formConfig: FormConfig = {
    title: 'Ajouter un membre',
    rows: [
        {
            fields: [
                { type: 'text', label: 'Nom', required: true },
                { type: 'text', label: 'Prénom', required: true }
            ]
        },
        {
            fields: [
                { type: 'text', label: 'Email', required: true }
            ]
        },
        {
            fields: [
                {
                    type: 'select',
                    label: 'Statut',
                    options: ['lecteur', 'editeur', 'admin'],
                    default: 'lecteur'
                }
            ]
        }
    ],
    actions: {
        actions: [
            {
                label: 'Ajouter',
                severity: 'primary',
                icon: 'pi pi-plus',
                command: () => this.addMember()
            }
        ]
    }
};
```

### 30. Sauvegarder et merger le hotfix

```bash
git add .
git commit -m "Hotfix: validation champs obligatoires"
git push -u origin hotfix/required-field
git checkout main
git merge hotfix/required-field
git push origin main
git checkout develop
git merge hotfix/required-field
git push origin develop
git branch -d hotfix/required-field
git push origin --delete hotfix/required-field
```

> Un hotfix est mergé dans **main** ET **develop** pour que les deux branches restent synchronisées.
