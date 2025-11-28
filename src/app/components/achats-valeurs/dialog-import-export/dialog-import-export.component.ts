import {Component} from '@angular/core';
import {Button} from "primeng/button";
import {Dialog} from "primeng/dialog";
import {FloatLabel} from "primeng/floatlabel";
import {NgClass} from "@angular/common";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {Textarea} from "primeng/textarea";
import {TranslatePipe} from "@ngx-translate/core";
import {ValeursService} from '../../../services/valeurs/valeurs.service';

@Component({
  selector: 'app-dialog-import-export',
  imports: [
    Button,
    Dialog,
    FloatLabel,
    ReactiveFormsModule,
    Textarea,
    TranslatePipe,
    FormsModule,
    NgClass
  ],
  templateUrl: './dialog-import-export.component.html',
  styleUrls: ['../../parametrage/gestion-portefeuilles/dialog-import-export/dialog-import-export.component.sass', './dialog-import-export.component.sass']
})
export class DialogImportExportComponent {
  visible: boolean = false;
  achats: string = '';
  erreur: string | undefined;

  constructor(private valeursService: ValeursService) {
  }

  reinitialiserVue() {
    this.achats = '';
    this.erreur = undefined;
  }

  exporter() {
    this.achats = JSON.stringify(this.valeursService.chargerAchats(), null, 2);
  }

  importer() {
    this.erreur = this.valeursService.importAchats(this.achats);
    if (this.erreur === undefined) {
      this.visible = false;
    }
  }
}
