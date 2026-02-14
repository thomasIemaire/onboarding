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

### 2. Créer un nouveau projet

```bash
ng new mon-projet
```

Suivre les instructions interactives (choix du style CSS, SSR, etc.) ou valider les options par défaut avec Entrée.

**Alternative sans installation globale (npx) :**

```bash
npx @angular/cli@latest new mon-projet
```

### 3. Lancer le serveur de développement

```bash
cd mon-projet
ng serve --open
```

L'application est accessible sur `http://localhost:4200/`.

### Commandes utiles

| Commande | Description |
|---|---|
| `ng generate component nom` | Créer un composant |
| `ng generate service nom` | Créer un service |
| `ng test` | Lancer les tests unitaires |
| `ng build` | Compiler pour la production |

### Documentation officielle

[angular.dev](https://angular.dev/)
