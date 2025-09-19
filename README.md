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

## Ajout de PrimeNG et chart.js
```
npm install primeng @primeng/themes primeicons --force
npm install chart.js --save
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

Ajout de primeicons.css dans le fichier angular.json :
`
            "styles": [
              "src/styles.sass",
              "primeicons/primeicons.css"
            ],
`

## Ajout de NGX-translate
```
npm install @ngx-translate/core
```

## Ajout de Capacitor et des plugins : Status Bar, Navigation Bar et Screen Orientation
```
ng add @capacitor/angular
npm run build
npm i @capacitor/android
npx cap add android
npm install @capacitor/status-bar
npx cap sync
npm install @squareetlabs/capacitor-navigation-bar
npx cap sync
npm install @capacitor/screen-orientation
npx cap sync
```

## Ajout du drag and drop
https://angular.dev/guide/drag-drop
```
ng add @angular/cdk
```

## Ajout de l'API Gemini
https://ai.google.dev/gemini-api/docs?hl=fr
https://aistudio.google.com/apikey
```
npm install @google/genai
```

## Scripts dans package.json
```
    "ng": "ng",
    "start": "ng serve",
    "build": "ng build",
    "buildAndroid": "ng build && npx cap sync",
    "watch": "ng build --watch --configuration development",
    "test": "ng test",
    "coverage": "ng test --no-watch --code-coverage",
    "continuous-integration": "ng test --no-watch --no-progress --browsers=ChromeHeadless",
    "lint": "ng lint"
```
