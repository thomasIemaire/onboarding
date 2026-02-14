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
ng new frontend --style=scss --ssr=false --skip-tests
cd frontend
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
export type MemberRole = 'membre' | 'admin';

export interface Member {
    nom: string;
    prenom: string;
    email: string;
    role: MemberRole;
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
                        options: ['membre', 'admin'],
                        default: 'membre'
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
                    options: ['membre', 'admin'],
                    default: 'membre'
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

---

## Service Members

### 31. Créer une branche pour le service members

```bash
git checkout -b feature/members-service develop
```

### 32. Ajouter la propriété `key` au modèle FieldConfig

Dans `core/models/field.ts`, ajouter `key` pour identifier chaque champ lors de la collecte des valeurs :

```ts
export type FieldType = 'text' | 'select';

export interface FieldConfig {
    key: string;
    label?: string;
    type: FieldType;
    options?: any[];
    default?: any;
    required?: boolean;
}
```

> `key` permet de mapper la valeur saisie au bon champ (ex: `'nom'`, `'email'`).

### 33. Créer le service MembersService

```bash
ng generate service services/members
```

#### 33.1 Ajouter la logique dans `services/members.ts`

```ts
import { Injectable } from '@angular/core';
import { Member } from '../core/models/member';

@Injectable({
    providedIn: 'root',
})
export class MembersService {
    private members: Member[] = [
        { nom: 'Dupont', prenom: 'Jean', email: 'jean.dupont@email.com', role: 'admin' },
        { nom: 'Martin', prenom: 'Sophie', email: 'sophie.martin@email.com', role: 'membre' },
        { nom: 'Durand', prenom: 'Pierre', email: 'pierre.durand@email.com', role: 'membre' },
    ];

    getMembers(): Member[] {
        return this.members;
    }

    addMember(member: Member): void {
        this.members.push(member);
    }
}
```

> `providedIn: 'root'` rend le service disponible globalement sans l'ajouter manuellement aux providers.
> Les 3 membres sont des données mock pour tester l'affichage.

### 34. Propager les valeurs du formulaire vers le parent

Pour que le formulaire puisse remonter les valeurs saisies, il faut propager un `Output` depuis chaque `FieldComponent` jusqu'au `FormComponent`.

#### 34.1 Modifier `field.ts`

Ajouter un `Output` qui émet la clé et la valeur à chaque changement :

```ts
import { Component, Input, Output, EventEmitter } from '@angular/core';
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
    @Output() fieldValueChange = new EventEmitter<{ key: string; value: any }>();

    value: any = '';

    onValueChange(val: any): void {
        this.value = val;
        this.fieldValueChange.emit({ key: this.field.key, value: val });
    }

    get showError(): boolean {
        return this.submitted && !!this.field.required && !this.value;
    }
}
```

#### 34.2 Modifier `form-row.ts`

Re-émettre l'événement de changement de valeur :

```ts
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FieldComponent } from '../field/field';
import { FormRowConfig } from '../../core/models/form-row';

@Component({
    ...
    imports: [FieldComponent]
})
export class FormRowComponent {
    @Input({ required: true }) row!: FormRowConfig;
    @Input() submitted: boolean = false;
    @Output() fieldValueChange = new EventEmitter<{ key: string; value: any }>();

    onFieldValueChange(event: { key: string; value: any }): void {
        this.fieldValueChange.emit(event);
    }
}
```

#### 34.3 Modifier le template `form-row.html`

```html
@if (row.title) {
    <h3>{{ row.title }}</h3>
}

<div class="form-row">
    @for (field of row.fields; track field) {
        <app-field [field]="field" [submitted]="submitted" (fieldValueChange)="onFieldValueChange($event)" />
    }
</div>
```

#### 34.4 Modifier `form.ts`

Collecter les valeurs et émettre un `formSubmit` avec validation :

```ts
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormRowComponent } from '../form-row/form-row';
import { FormActionsComponent } from '../form-actions/form-actions';
import { FormConfig } from '../../core/models/form';

@Component({
    ...
    imports: [FormRowComponent, FormActionsComponent]
})
export class FormComponent {
    @Input({ required: true }) config!: FormConfig;
    @Output() formSubmit = new EventEmitter<Record<string, any>>();

    submitted: boolean = false;
    values: Record<string, any> = {};

    onFieldValueChange(event: { key: string; value: any }): void {
        this.values[event.key] = event.value;
    }

    onSubmit(): void {
        this.submitted = true;

        const hasErrors = this.config.rows
            .flatMap(row => row.fields)
            .some(field => field.required && !this.values[field.key]);

        if (!hasErrors) {
            this.formSubmit.emit({ ...this.values });
        }
    }
}
```

#### 34.5 Modifier le template `form.html`

```html
@if (config.title) {
    <h2>{{ config.title }}</h2>
}

@for (row of config.rows; track row) {
    <app-form-row [row]="row" [submitted]="submitted" (fieldValueChange)="onFieldValueChange($event)" />
}

@if (config.actions) {
    <app-form-actions [config]="config.actions" (actionClick)="onSubmit()" />
}
```

> Le `FormComponent` collecte les valeurs via `onFieldValueChange` et les émet via `formSubmit` uniquement si la validation passe.

### 35. Utiliser le service dans la page members

#### 35.1 Modifier `members.ts`

```ts
import { Component, inject } from '@angular/core';
import { FormComponent } from '../../components/form/form';
import { FormConfig } from '../../core/models/form';
import { Member } from '../../core/models/member';
import { MembersService } from '../../services/members';

@Component({
    ...
    imports: [FormComponent]
})
export class MembersComponent {
    private membersService = inject(MembersService);
    members: Member[] = this.membersService.getMembers();

    formConfig: FormConfig = {
        title: 'Ajouter un membre',
        rows: [
            {
                fields: [
                    { key: 'nom', type: 'text', label: 'Nom', required: true },
                    { key: 'prenom', type: 'text', label: 'Prénom', required: true }
                ]
            },
            {
                fields: [
                    { key: 'email', type: 'text', label: 'Email', required: true }
                ]
            },
            {
                fields: [
                    {
                        key: 'role',
                        type: 'select',
                        label: 'Statut',
                        options: ['membre', 'admin'],
                        default: 'membre'
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
                    command: () => {}
                }
            ]
        }
    };

    addMember(values: Record<string, any>): void {
        const member: Member = {
            nom: values['nom'],
            prenom: values['prenom'],
            email: values['email'],
            role: values['role'] ?? 'membre',
        };
        this.membersService.addMember(member);
    }
}
```

> `inject(MembersService)` est l'injection de dépendance fonctionnelle (alternative au constructeur).
> `addMember` reçoit les valeurs du formulaire via l'Output `formSubmit` et les ajoute au service.

#### 35.2 Modifier le template `members.html`

```html
<app-form [config]="formConfig" [style.width.px]="400" (formSubmit)="addMember($event)" />
```

> `(formSubmit)` écoute l'événement émis par le `FormComponent` après validation.

### 36. Sauvegarder et merger dans develop

```bash
git add .
git commit -m "Ajout du service members avec données mock"
git push -u origin feature/members-service
git checkout develop
git merge feature/members-service
git push -u origin develop
git branch -d feature/members-service
git push origin --delete feature/members-service
```

---

## Liste des membres

### 37. Créer une branche pour la liste des membres

```bash
git checkout -b feature/list-members develop
```

### 38. Ajouter la table PrimeNG dans la page members

#### 38.1 Modifier `members.ts`

Importer `TableModule` de PrimeNG :

```ts
import { Component, inject } from '@angular/core';
import { FormComponent } from '../../components/form/form';
import { FormConfig } from '../../core/models/form';
import { Member } from '../../core/models/member';
import { MembersService } from '../../services/members';
import { TableModule } from 'primeng/table';

@Component({
    ...
    imports: [FormComponent, TableModule]
})
export class MembersComponent {
    ...
}
```

> `TableModule` est le composant table de PrimeNG, puissant et configurable.

#### 38.2 Modifier le template `members.html`

Ajouter la table en dessous du formulaire :

```html
<div class="page">
    <section>
        <app-form [config]="formConfig" [style.width.px]="400" (formSubmit)="addMember($event)" />
    </section>
    <section [style.flex]="1">
        <h2>Liste des membres</h2>

        <p-table [value]="members">
            <ng-template #header>
                <tr>
                    <th>Nom</th>
                    <th>Prénom</th>
                    <th>Email</th>
                    <th>Statut</th>
                </tr>
            </ng-template>
            <ng-template #body let-member>
                <tr>
                    <td>{{ member.nom }}</td>
                    <td>{{ member.prenom }}</td>
                    <td>{{ member.email }}</td>
                    <td>{{ member.role }}</td>
                </tr>
            </ng-template>
            <ng-template #emptymessage>
                <tr>
                    <td colspan="4">Aucun membre</td>
                </tr>
            </ng-template>
        </p-table>
    </section>
</div>
```

> `p-table` est le composant table de PrimeNG.
> `#header` définit l'en-tête du tableau.
> `#body` définit le template de chaque ligne avec `let-member` pour accéder aux données.
> `#emptymessage` affiche un message quand la liste est vide.

#### 38.3 Ajouter le style dans `members.scss`

```scss
header {
    margin-bottom: 2rem;
}

.page {
    display: flex;
    gap: 2rem;
}

section {
    display: flex;
    flex-direction: column;
    gap: 1rem;
}
```

### 39. Sauvegarder et merger dans develop

```bash
git add .
git commit -m "Ajout de la liste des membres avec PrimeNG Table"
git push -u origin feature/list-members
git checkout develop
git merge feature/list-members
git push -u origin develop
git branch -d feature/list-members
git push origin --delete feature/list-members
```

---

## Hotfix : tag statut

### 40. Créer la branche hotfix

```bash
git checkout -b hotfix/tag-role main
```

### 41. Créer un pipe personnalisé `roleSeverity`

Un pipe qui transforme le statut d'un membre en severity PrimeNG pour le composant `p-tag`.

#### 41.1 Générer le pipe

```bash
ng generate pipe shared/pipes/role-severity
```

#### 41.2 Ajouter la logique dans `shared/pipes/role-severity.ts`

```ts
import { Pipe, PipeTransform } from '@angular/core';
import { MemberRole } from '../core/models/member';

@Pipe({
    name: 'roleSeverity',
})
export class RoleSeverityPipe implements PipeTransform {
    transform(value: MemberRole): 'success' | 'info' | 'warn' | 'danger' | 'secondary' | 'contrast' {
        switch (value) {
            case 'admin':
                return 'danger';
            case 'membre':
                return 'info';
            default:
                return 'secondary';
        }
    }
}
```

> Un **pipe** Angular transforme une valeur dans un template via la syntaxe `{{ value | pipeName }}`.
> Ici, il convertit le statut (`'membre'`, `'admin'`) en severity PrimeNG (`'info'`, `'warn'`, `'danger'`).

### 42. Utiliser le pipe et le tag dans la page members

#### 42.1 Modifier `members.ts`

Importer `TagModule` et le pipe :

```ts
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { RoleSeverityPipe } from '../../shared/pipes/role-severity';

@Component({
    ...
    imports: [FormComponent, TableModule, TagModule, RoleSeverityPipe]
})
```

> Les pipes standalone s'importent directement dans le tableau `imports` du composant.

#### 42.2 Modifier le template `members.html`

Remplacer l'affichage texte du statut par un `p-tag` :

```html
<td><p-tag [value]="member.role" [severity]="member.role | roleSeverity" /></td>
```

> `p-tag` est le composant Tag de PrimeNG qui affiche un label coloré.
> `[severity]` reçoit la valeur transformée par le pipe `roleSeverity`.

### 43. Sauvegarder et merger le hotfix

```bash
git add .
git commit -m "Hotfix: affichage du statut en tag PrimeNG"
git push -u origin hotfix/tag-role
git checkout main
git merge hotfix/tag-role
git push origin main
git checkout develop
git merge hotfix/tag-role
git push origin develop
git branch -d hotfix/tag-role
git push origin --delete hotfix/tag-role
```

> Un hotfix est mergé dans **main** ET **develop** pour que les deux branches restent synchronisées.

---

## Page Équipes

> À partir d'ici, les étapes sont plus guidées que dictées. Utilisez les concepts vus précédemment pour implémenter les fonctionnalités.

### 44. Créer une branche pour la page équipes

```bash
git checkout -b feature/teams develop
```

### 45. Renommer `status` en `role`

Le champ `status` du modèle `Member` est renommé en `role` avec les valeurs `'membre' | 'admin'`.

#### À faire :
- Modifier `core/models/member.ts` : renommer `MemberStatus` en `MemberRole`, changer les valeurs en `'membre' | 'admin'`, renommer le champ `status` en `role`
- Ajouter un champ `teamId: number` à l'interface `Member` pour lier un membre à une équipe
- Mettre à jour `services/members.ts` : adapter les données mock, ajouter `teamId` aux membres, remplacer `getMembers()` par `getMembersByTeam(teamId: number)`
- Renommer le pipe `StatusSeverityPipe` en `RoleSeverityPipe` dans `shared/pipes/role-severity.ts`, adapter le mapping
- Mettre à jour la page `members` pour utiliser `role` au lieu de `status`

### 46. Créer le modèle Team

Créer `core/models/team.ts` avec une interface contenant un `id` et un `nom`.

### 47. Créer le service TeamsService

Générer un service `services/teams` et implémenter :
- Une liste privée de teams mock (ex: Développement, Marketing, Design)
- `getTeams()` : retourne toutes les équipes
- `getTeamById(id: number)` : retourne une équipe par son id
- `addTeam(nom: string)` : ajoute une nouvelle équipe avec un id auto-incrémenté

> Inspirez-vous de la structure du `MembersService`.

### 48. Créer la page Teams

```bash
ng generate component pages/teams
```

#### 48.1 Logique (`teams.ts`)

- Injecter `TeamsService` et `Router`
- Créer un `formConfig` avec un seul champ : le nom de l'équipe (`key: 'nom'`, `required: true`)
- Implémenter `addTeam(values)` qui appelle le service
- Implémenter `onRowSelect(event)` qui navigue vers `/teams/:id/membres`

> Utilisez `Router.navigate()` pour la navigation programmatique.
> L'événement `onRowSelect` de PrimeNG Table émet un objet `TableRowSelectEvent` — importez-le depuis `primeng/table`.

#### 48.2 Template (`teams.html`)

Même structure que la page members (header, layout en deux colonnes) :
- À gauche : le formulaire de création via `<app-form>`
- À droite : une `<p-table>` avec les équipes

Pour rendre les lignes cliquables :

```html
<p-table [value]="teams" selectionMode="single" (onRowSelect)="onRowSelect($event)">
    ...
    <ng-template #body let-team>
        <tr [pSelectableRow]="team">
            <td>{{ team.nom }}</td>
        </tr>
    </ng-template>
</p-table>
```

> `selectionMode="single"` active la sélection de ligne.
> `[pSelectableRow]` rend la ligne cliquable et déclenche `onRowSelect`.

#### 48.3 Style (`teams.scss`)

Reprendre le même layout que `members.scss`.

### 49. Mettre à jour le routing

Dans `app.routes.ts`, configurer les routes suivantes :

| Route | Composant | Description |
|---|---|---|
| `teams` | `TeamsComponent` | Liste des équipes |
| `teams/:teamId/membres` | `MembersComponent` | Membres d'une équipe |
| ` ` | redirect → `teams` | Route par défaut |
| `**` | redirect → `teams` | Toute route inconnue |

> La route `**` (wildcard) capture toutes les URLs non reconnues et redirige vers `/teams`.
> Supprimer l'ancienne route `/members`.

### 50. Adapter la page Members au contexte d'équipe

La page members doit maintenant s'afficher dans le contexte d'une équipe.

#### À faire :
- Injecter `ActivatedRoute` pour récupérer le paramètre `teamId` depuis l'URL
- Utiliser `ngOnInit()` pour initialiser les données (le `teamId` n'est pas disponible dans le constructeur)
- Appeler `getMembersByTeam(teamId)` au lieu de `getMembers()`
- Passer le `teamId` lors de l'ajout d'un nouveau membre
- Afficher le nom de l'équipe dans le header
- Ajouter un bouton retour vers `/teams`

> Pour récupérer un paramètre de route :
> ```ts
> const teamId = Number(this.route.snapshot.paramMap.get('teamId'));
> ```

> Pour le bouton retour, utilisez `RouterLink` et `p-button` avec `[link]="true"` :
> ```html
> <p-button label="Retour aux équipes" icon="pi pi-arrow-left" [link]="true" routerLink="/teams" severity="secondary" />
> ```

### 51. Sauvegarder et merger dans develop

```bash
git add .
git commit -m "Ajout de la page équipes avec navigation"
git push -u origin feature/teams
git checkout develop
git merge feature/teams
git push -u origin develop
git branch -d feature/teams
git push origin --delete feature/teams
```

---

## API Node.js

### 52. Créer une branche pour l'API

```bash
git checkout -b feature/api develop
```

### 53. Initialiser le projet

```bash
mkdir backend
cd backend
npm init -y
npm install express cors
npm install -D nodemon
```

#### 53.1 Configurer `package.json`

Modifier les scripts :

```json
{
    "main": "src/index.js",
    "scripts": {
        "start": "node src/index.js",
        "dev": "nodemon src/index.js"
    }
}
```

> `nodemon` redémarre automatiquement le serveur à chaque modification de fichier.

#### 53.2 Créer l'arborescence

```
backend/src/
├── controllers/   # Routes Express (point d'entrée HTTP)
├── services/      # Logique métier (validation, règles)
├── dao/           # Data Access Object (lecture/écriture en base)
├── db/            # Fichier JSON (base de données)
└── index.js       # Point d'entrée de l'application
```

> **Controller** → reçoit la requête HTTP, appelle le service, retourne la réponse.
> **Service** → contient la logique métier (validation, transformations).
> **DAO** → accède directement aux données (ici le fichier JSON).

### 54. Créer la base de données JSON

#### 54.1 Créer le fichier `src/db/data.json`

```json
{
    "teams": [
        { "id": 1, "nom": "Développement" },
        { "id": 2, "nom": "Marketing" },
        { "id": 3, "nom": "Design" }
    ],
    "members": [
        { "id": 1, "nom": "Dupont", "prenom": "Jean", "email": "jean.dupont@email.com", "role": "admin", "teamId": 1 },
        { "id": 2, "nom": "Martin", "prenom": "Sophie", "email": "sophie.martin@email.com", "role": "membre", "teamId": 1 },
        { "id": 3, "nom": "Durand", "prenom": "Pierre", "email": "pierre.durand@email.com", "role": "membre", "teamId": 2 }
    ]
}
```

#### 54.2 Créer le module d'accès `src/db/db.js`

```js
const fs = require('fs');
const path = require('path');

const DB_PATH = path.join(__dirname, 'data.json');

function read() {
    const raw = fs.readFileSync(DB_PATH, 'utf-8');
    return JSON.parse(raw);
}

function write(data) {
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 4), 'utf-8');
}

module.exports = { read, write };
```

> `fs.readFileSync` / `fs.writeFileSync` : lecture/écriture synchrone du fichier.
> `path.join(__dirname, ...)` : construit un chemin absolu depuis le dossier courant.

### 55. Créer le CRUD Teams (exemple complet)

Cet exemple montre la chaîne complète **DAO → Service → Controller** pour les équipes.

#### 55.1 Créer `src/dao/teams.dao.js`

```js
const db = require('../db/db');

function findAll() {
    const data = db.read();
    return data.teams;
}

function findById(id) {
    const data = db.read();
    return data.teams.find(t => t.id === id);
}

function create(team) {
    const data = db.read();
    const newId = data.teams.length > 0
        ? Math.max(...data.teams.map(t => t.id)) + 1
        : 1;
    const newTeam = { id: newId, ...team };
    data.teams.push(newTeam);
    db.write(data);
    return newTeam;
}

module.exports = { findAll, findById, create };
```

> Le DAO ne fait aucune validation, il ne fait que lire/écrire dans la base.
> L'id est auto-incrémenté en prenant le max des ids existants + 1.

#### 55.2 Créer `src/services/teams.service.js`

```js
const teamsDao = require('../dao/teams.dao');

function getAllTeams() {
    return teamsDao.findAll();
}

function getTeamById(id) {
    return teamsDao.findById(id);
}

function createTeam(teamData) {
    if (!teamData.nom) {
        throw new Error('Le nom est obligatoire');
    }
    return teamsDao.create({ nom: teamData.nom });
}

module.exports = { getAllTeams, getTeamById, createTeam };
```

> Le service valide les données avant de les passer au DAO.
> Il `throw` une erreur si les données sont invalides — le controller la rattrapera.

#### 55.3 Créer `src/controllers/teams.controller.js`

```js
const { Router } = require('express');
const teamsService = require('../services/teams.service');

const router = Router();

router.get('/', (req, res) => {
    const teams = teamsService.getAllTeams();
    res.json(teams);
});

router.get('/:id', (req, res) => {
    const team = teamsService.getTeamById(Number(req.params.id));
    if (!team) {
        return res.status(404).json({ error: 'Équipe introuvable' });
    }
    res.json(team);
});

router.post('/', (req, res) => {
    try {
        const team = teamsService.createTeam(req.body);
        res.status(201).json(team);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

module.exports = router;
```

> `Router()` crée un mini-routeur Express qu'on monte ensuite sur un chemin.
> `req.params.id` récupère le paramètre de l'URL (ex: `/api/teams/1` → `id = "1"`).
> `req.body` contient le corps de la requête POST (grâce à `express.json()`).
> `res.status(201).json(...)` retourne un code 201 (Created) avec le JSON.

### 56. Créer le point d'entrée de l'application

Créer `src/index.js` :

```js
const express = require('express');
const cors = require('cors');

const teamsController = require('./controllers/teams.controller');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

app.use('/api/teams', teamsController);

app.listen(PORT, () => {
    console.log(`API démarrée sur http://localhost:${PORT}`);
});
```

> `cors()` autorise les requêtes cross-origin (nécessaire pour que Angular puisse appeler l'API).
> `express.json()` parse automatiquement le body JSON des requêtes.
> `app.use('/api/teams', teamsController)` monte le routeur sur le chemin `/api/teams`.
> **Important** : les routes seront réorganisées à l'étape 57.4 — les routes les plus spécifiques doivent être montées **avant** les plus génériques.

#### Tester l'API

```bash
npm run dev
```

Dans un autre terminal :

```bash
curl http://localhost:3000/api/teams
curl -X POST http://localhost:3000/api/teams -H "Content-Type: application/json" -d "{\"nom\":\"Ressources Humaines\"}"
```

### 57. Créer le CRUD Members

> En s'inspirant de l'exemple complet des Teams, créer la chaîne DAO → Service → Controller pour les membres.

#### 57.1 Créer `src/dao/members.dao.js`

Le DAO des membres doit implémenter :
- `findByTeamId(teamId)` : retourne tous les membres d'une équipe
- `create(member)` : ajoute un membre avec un id auto-incrémenté

> Même logique que `teams.dao.js`, mais en filtrant sur `teamId` au lieu de tout retourner.

#### 57.2 Créer `src/services/members.service.js`

Le service doit :
- Vérifier que l'équipe existe (via `teamsDao.findById`) avant de retourner ses membres
- Valider que `nom`, `prenom` et `email` sont présents avant la création
- Ajouter `teamId` et un `role` par défaut (`'membre'`) à chaque nouveau membre

> `throw new Error(...)` si la validation échoue — le controller rattrapera l'erreur.

#### 57.3 Créer `src/controllers/members.controller.js`

Le controller doit :
- Créer un `Router` avec l'option `{ mergeParams: true }`
- Implémenter `GET /` et `POST /`
- Récupérer `teamId` depuis `req.params.teamId`

```js
const router = Router({ mergeParams: true });
```

> **`mergeParams: true`** est nécessaire car ce routeur est monté en enfant d'une route paramétrée (`/api/teams/:teamId/members`). Sans cette option, `req.params.teamId` serait `undefined`.

#### 57.4 Monter le controller dans `index.js`

Ajouter le montage du controller members dans `src/index.js`. **Attention** : la route members doit être montée **avant** la route teams, car Express 5 matche les routes dans l'ordre de déclaration et `/api/teams` est un préfixe de `/api/teams/:teamId/members` :

```js
const membersController = require('./controllers/members.controller');

// L'ordre est important : routes spécifiques AVANT routes génériques
app.use('/api/teams/:teamId/members', membersController);
app.use('/api/teams', teamsController);
```

#### Tester

```bash
curl http://localhost:3000/api/teams/1/members
curl -X POST http://localhost:3000/api/teams/1/members -H "Content-Type: application/json" -d "{\"nom\":\"Leroy\",\"prenom\":\"Julie\",\"email\":\"julie@test.com\"}"
```

### 58. Sauvegarder et merger dans develop

```bash
git add .
git commit -m "Ajout de l'API Node.js avec Express"
git push -u origin feature/api
git checkout develop
git merge feature/api
git push -u origin develop
git branch -d feature/api
git push origin --delete feature/api
```

---

## Connexion Angular ↔ API

### 59. Créer une branche pour l'intégration API

```bash
git checkout -b feature/api-integration develop
```

### 60. Configurer les environnements Angular

Angular permet de définir des variables d'environnement différentes selon le contexte (dev, prod, etc.).

#### 60.1 Générer les fichiers d'environnement

```bash
cd frontend
ng generate environments
```

Cela crée :
- `src/environments/environment.ts` (développement)
- `src/environments/environment.development.ts` (développement local)

#### 60.2 Configurer l'URL de l'API

Dans `environment.ts` :

```ts
export const environment = {
    apiUrl: 'http://localhost:3000/api',
};
```

Dans `environment.development.ts` :

```ts
export const environment = {
    apiUrl: 'http://localhost:3000/api',
};
```

> En production, `apiUrl` pourrait pointer vers un autre serveur. Pour le moment, les deux sont identiques.

### 61. Créer le service API pour les Teams (exemple complet)

#### 61.1 Générer le service

```bash
ng generate service services/api/teams-api
```

#### 61.2 Implémenter le service `teams-api.ts`

```ts
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Team } from '../core/models/team';
import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root',
})
export class TeamsApiService {
    private http = inject(HttpClient);
    private baseUrl = `${environment.apiUrl}/teams`;

    getTeams(): Observable<Team[]> {
        return this.http.get<Team[]>(this.baseUrl);
    }

    createTeam(nom: string): Observable<Team> {
        return this.http.post<Team>(this.baseUrl, { nom });
    }
}
```

> `HttpClient` est le client HTTP d'Angular pour appeler des API REST.
> Les méthodes retournent des `Observable` — il faudra `subscribe` dans les composants.

#### 61.3 Activer `HttpClient` dans `app.config.ts`

```ts
import { provideHttpClient } from '@angular/common/http';

export const appConfig: ApplicationConfig = {
    providers: [
        ...
        provideHttpClient(),
    ]
};
```

> `provideHttpClient()` rend `HttpClient` injectable dans toute l'application.

#### 61.4 Mettre à jour la page Teams

Remplacer l'utilisation de `TeamsService` (mock local) par `TeamsApiService` :

```ts
import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { TeamsApiService } from '../../services/api/teams-api';

export class TeamsComponent implements OnInit {
    private teamsApi = inject(TeamsApiService);
    private cdr = inject(ChangeDetectorRef);
    teams: Team[] = [];

    ngOnInit(): void {
        this.teamsApi.getTeams().subscribe(teams => {
            this.teams = teams;
            this.cdr.markForCheck();
        });
    }

    addTeam(values: Record<string, any>): void {
        this.teamsApi.createTeam(values['nom']).subscribe(team => {
            this.teams = [...this.teams, team];
            this.cdr.markForCheck();
        });
    }
}
```

> `.subscribe()` s'abonne à l'Observable et exécute le callback quand la réponse arrive.
> On met à jour `teams` localement après la création pour rafraîchir la liste sans rappeler l'API.
> **`ChangeDetectorRef.markForCheck()`** est nécessaire car Angular 21 est **zoneless** par défaut (pas de `zone.js`). Sans cet appel, les callbacks asynchrones (HTTP, setTimeout, etc.) ne déclenchent pas de re-render automatique. On utilise aussi `[...this.teams, team]` au lieu de `.push()` pour créer une nouvelle référence de tableau.

### 62. Créer le service API pour les Members

> En s'inspirant du `TeamsApiService`, créer `services/api/members-api.ts`.

#### À faire :
- Générer le service : `ng generate service services/api/members-api`
- URL de base : `` `${environment.apiUrl}/teams/${teamId}/members` ``
- Implémenter `getMembers(teamId: number): Observable<Member[]>`
- Implémenter `createMember(teamId: number, member): Observable<Member>`
- Mettre à jour la page Members pour utiliser `MembersApiService` au lieu de `MembersService`
- Injecter `ChangeDetectorRef` et appeler `markForCheck()` après chaque mise à jour dans un `subscribe`

> Les deux méthodes prennent `teamId` en paramètre pour construire l'URL dynamiquement.

### 63. Tester l'ensemble

1. Lancer l'API : `cd backend && npm run dev`
2. Lancer Angular : `cd frontend && ng serve`
3. Vérifier que :
   - La liste des équipes se charge depuis l'API
   - La création d'une équipe l'ajoute en base (vérifier `data.json`)
   - Le clic sur une équipe affiche ses membres
   - L'ajout d'un membre l'enregistre en base

### 64. Sauvegarder et merger dans develop

```bash
git add .
git commit -m "Intégration API Angular avec HttpClient"
git push -u origin feature/api-integration
git checkout develop
git merge feature/api-integration
git push -u origin develop
git branch -d feature/api-integration
git push origin --delete feature/api-integration
```
