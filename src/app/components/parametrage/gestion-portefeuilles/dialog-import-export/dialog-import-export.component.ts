import {Component} from '@angular/core';
import {TranslatePipe} from "@ngx-translate/core";
import {PortefeuillesService} from '../../../../services/portefeuilles/portefeuilles.service';
import {Dialog} from 'primeng/dialog';
import {FormsModule} from '@angular/forms';
import {Button} from 'primeng/button';
import {NgClass} from '@angular/common';
import {Textarea} from 'primeng/textarea';
import {FloatLabel} from 'primeng/floatlabel';

@Component({
  selector: 'app-dialog-import-export',
  imports: [
    TranslatePipe,
    Dialog,
    FormsModule,
    Button,
    NgClass,
    Textarea,
    FloatLabel
  ],
  templateUrl: './dialog-import-export.component.html',
  styleUrl: './dialog-import-export.component.sass'
})
export class DialogImportExportComponent {
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
    this.configurationPortefeuilles = JSON.stringify(this.portefeuillesService.charger(), null, 2);
  }

  importer() {
    this.erreur = this.portefeuillesService.import(this.configurationPortefeuilles);
    if (this.erreur === undefined) {
      this.visible = false;
    }
  }

  exemple() {
    this.reinitialiserVue();
    this.configurationPortefeuilles = JSON.stringify(PortefeuillesService.CONFIGURATION_INITIALE, null, 2);
  }

  toutSupprimer() {
    this.portefeuillesService.import('[]');
    this.visible = false;
  }
}
