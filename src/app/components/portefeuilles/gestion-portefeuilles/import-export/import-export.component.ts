import {Component} from '@angular/core';
import {TranslatePipe} from "@ngx-translate/core";
import {PortefeuillesService} from '../../../../services/portefeuilles/portefeuilles.service';
import {Dialog} from 'primeng/dialog';
import {FormsModule} from '@angular/forms';
import {Button} from 'primeng/button';
import {NgClass, NgIf} from '@angular/common';
import {Textarea} from 'primeng/textarea';
import {FloatLabel} from 'primeng/floatlabel';

@Component({
  selector: 'app-import-export',
  imports: [
    TranslatePipe,
    Dialog,
    FormsModule,
    Button,
    NgClass,
    Textarea,
    NgIf,
    FloatLabel
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
    this.configurationPortefeuilles = JSON.stringify(PortefeuillesService.CONFIGURATION_INITIALE, null, 2);
  }

  toutSupprimer() {
    this.portefeuillesService.import('[]');
    this.visible = false;
  }
}
