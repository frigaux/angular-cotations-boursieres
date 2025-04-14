# AngularCotationsBoursieres

## Création du projet avec Angular CLI
```
sudo npm install -g @angular/cli
sudo npm install -g npm@latest
ng new angular-cotations-boursieres --skip-install
cd angular-cotations-boursieres
npm install
npm start
```

```
ng version
```

`
Angular CLI: 19.2.4
Node: 22.14.0
Angular: 19.2.2
`

### Vérification du code avec ESLint
```
ng add @angular-eslint/schematics
```

Et ajouter la ligne suivante dans les scripts du fichier package.json :
`
"lint": "ng lint"
`

```
npm run lint
```

### Couverture du code
Ajouter la ligne suivante dans les scripts du fichier package.json :
`
"coverage": "ng test --no-watch --code-coverage"
`

```
npm run coverage
```

### Paramètres d'environnement
```
ng generate environments
```

### Guard
```
ng generate guard authentification
```

## Décodage d'un JWT
```
npm install --save jwt-decode
```

## Ajout de PrimeNG
```
npm install primeng @primeng/themes --force
```

Ajout des deux providers providePrimeNG, provideAnimationsAsync et définition du thème dans le fichier app.config.ts :
`
    provideAnimationsAsync(),
    providePrimeNG({
      theme: {
        preset: Material // Aura, Material, Lara and Nora
      }
    })
`

## Finalement pas ajoutés : bootstrap et fontawesome
```
npm install --save bootstrap
npm install --save @fortawesome/fontawesome-free
```

Ajout des lignes suivantes dans les styles du fichier angular.json :
`
"node_modules/bootstrap/dist/css/bootstrap.min.css",
"node_modules/bootstrap/dist/css/bootstrap-grid.min.css",
"node_modules/@fortawesome/fontawesome-free/css/all.min.css"
`

## Scripts dans package.json
```
    "ng": "ng",
    "start": "ng serve",
    "build": "ng build",
    "watch": "ng build --watch --configuration development",
    "test": "ng test",
    "coverage": "ng test --no-watch --code-coverage",
    "lint": "ng lint"
```
