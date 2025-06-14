import {Component} from '@angular/core';
import {TranslatePipe} from "@ngx-translate/core";
import {PortefeuillesService} from '../../../../services/portefeuilles/portefeuilles.service';
import {Dialog} from 'primeng/dialog';
import {FormsModule} from '@angular/forms';
import {Button} from 'primeng/button';
import {NgClass, NgIf} from '@angular/common';
import {IftaLabel} from 'primeng/iftalabel';
import {Textarea} from 'primeng/textarea';

@Component({
  selector: 'app-import-export',
  imports: [
    TranslatePipe,
    Dialog,
    FormsModule,
    Button,
    NgClass,
    IftaLabel,
    Textarea,
    NgIf
  ],
  templateUrl: './import-export.component.html',
  styleUrl: './import-export.component.sass'
})
export class ImportExportComponent {
  visible: boolean = false;
  configurationPortefeuilles: string = '';
  erreur: string | undefined;

  constructor(private portefeuillesService: PortefeuillesService) {

  }

  reinitialiserVue() {
    this.configurationPortefeuilles = '';
    this.erreur = undefined;
  }

  exporter() {
    this.configurationPortefeuilles = this.portefeuillesService.export();
  }

  importer() {
    this.erreur = this.portefeuillesService.import(this.configurationPortefeuilles);
    if (this.erreur === undefined) {
      this.visible = false;
    }
  }

  exemple() {
    this.reinitialiserVue();
    this.configurationPortefeuilles = '[{\n' +
      '      "nom": "Spéculation",\n' +
      '      "parDefaut": true,\n' +
      '      "tickers": ["CA", "GLE", "BNP", "DSY", "SGO", "SAN", "SK", "STMPA"],\n' +
      '      "alertes": [{"nom": "Remontée", "condition": "M20 > M10 && M10 > M5 && C2 < (0.98 * C1)"}, {\n' +
      '        "nom": "Chute",\n' +
      '        "condition": "M20 < M10 && M10 < M5 && C2 > (1.02 * C1)"\n' +
      '      }, {"nom": "Grosse variation veille", "condition": "C2 < 0.98 * C1 || C2 > 1.02 * C1"}]\n' +
      '    }, {\n' +
      '      "nom": "Spéculation2",\n' +
      '      "parDefaut": false,\n' +
      '      "tickers": ["PUB", "ALO", "EDEN", "WLN", "VLTSA", "FR", "OVH", "ATO", "NXI"],\n' +
      '      "alertes": []\n' +
      '    }, {\n' +
      '      "nom": "Cac40",\n' +
      '      "parDefaut": false,\n' +
      '      "tickers": ["ACA", "AI", "CA", "AC", "EN", "CS", "BN", "EL", "CAP", "BNP", "BVI", "ENGI", "EDEN", "DSY", "MT", "AIR", "ERF", "RMS", "KER", "LR", "OR", "MC", "ML", "ORA", "RI", "PUB", "RNO", "SAF", "SGO", "SAN", "SU", "GLE", "STLAP", "STMPA", "TEP", "HO", "TTE", "URW", "VIE", "DG"],\n' +
      '      "alertes": []\n' +
      '    }, {\n' +
      '      "nom": "Charles Gave",\n' +
      '      "parDefaut": false,\n' +
      '      "tickers": ["AC", "AI", "CAP", "BN", "RMS", "KER", "OR", "MC", "RI", "SU", "SW", "TTE"],\n' +
      '      "alertes": []\n' +
      '    }]';
  }

  toutSupprimer() {
    this.portefeuillesService.import('[]');
    this.visible = false;
  }
}
