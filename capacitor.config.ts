import type {CapacitorConfig} from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'fr.fabien.cotations',
  appName: 'angular-cotations-boursieres',
  webDir: 'dist/angular-cotations-boursieres/browser',
  plugins: {
    CapacitorHttp: {
      enabled: true
    }
  }
};

export default config;
