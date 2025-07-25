import {Component} from '@angular/core';
import {Button} from "primeng/button";
import {Dialog} from "primeng/dialog";
import {FloatLabel} from "primeng/floatlabel";
import {NgClass, NgIf} from "@angular/common";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {Textarea} from "primeng/textarea";
import {TranslatePipe} from "@ngx-translate/core";
import {ValeursService} from '../../../../../services/valeurs/valeurs.service';

@Component({
  selector: 'app-import-export',
  imports: [
    Button,
    Dialog,
    FloatLabel,
    NgIf,
    ReactiveFormsModule,
    Textarea,
    TranslatePipe,
    FormsModule,
    NgClass
  ],
  templateUrl: './import-export.component.html',
  styleUrls: ['../../../../portefeuilles/gestion-portefeuilles/import-export/import-export.component.sass', './import-export.component.sass']
})
export class ImportExportComponent {
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
