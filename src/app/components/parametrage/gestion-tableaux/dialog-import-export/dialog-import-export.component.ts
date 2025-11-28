import {Component} from '@angular/core';
import {Button} from "primeng/button";
import {Dialog} from "primeng/dialog";
import {NgClass} from "@angular/common";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {Textarea} from "primeng/textarea";
import {TranslatePipe} from "@ngx-translate/core";
import {TableauxService} from '../../../../services/tableaux/tableaux.service';
import {FloatLabel} from 'primeng/floatlabel';

@Component({
  selector: 'app-dialog-import-export',
  imports: [
    Button,
    Dialog,
    ReactiveFormsModule,
    Textarea,
    TranslatePipe,
    FormsModule,
    NgClass,
    FloatLabel
  ],
  templateUrl: './dialog-import-export.component.html',
  styleUrls: ['../../gestion-portefeuilles/dialog-import-export/dialog-import-export.component.sass', './dialog-import-export.component.sass']
})
export class DialogImportExportComponent {
  visible: boolean = false;
  configurationTableaux: string = '';
  erreur: string | undefined;

  constructor(private tableauxService: TableauxService) {

  }

  reinitialiserVue() {
    this.configurationTableaux = '';
    this.erreur = undefined;
  }

  exporter() {
    this.configurationTableaux = JSON.stringify(this.tableauxService.charger(), null, 2);
  }

  importer() {
    this.erreur = this.tableauxService.import(this.configurationTableaux);
    if (this.erreur === undefined) {
      this.visible = false;
    }
  }

  exemple(nom: 'DESKTOP' | 'MOBILE' | 'TABLETTE') {
    this.reinitialiserVue();
    this.configurationTableaux = JSON.stringify(TableauxService.CONFIGURATION_INITIALE[nom], null, 2);
  }
}
