import {Component} from '@angular/core';
import {Button} from "primeng/button";
import {Dialog} from "primeng/dialog";
import {FloatLabel} from "primeng/floatlabel";
import {NgClass, NgIf} from "@angular/common";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {Textarea} from "primeng/textarea";
import {TranslatePipe} from "@ngx-translate/core";
import {CoursService} from '../../../../services/cours/cours.service';

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
  styleUrls: ['../../../portefeuilles/gestion-portefeuilles/import-export/import-export.component.sass', './import-export.component.sass']
})
export class ImportExportComponent {
  visible: boolean = false;
  filtres: string = '';
  erreur: string | undefined;

  constructor(private coursService: CoursService) {
  }

  reinitialiserVue() {
    this.filtres = '';
    this.erreur = undefined;
  }

  exporter() {
    this.filtres = JSON.stringify(this.coursService.chargerFiltres(), null, 2);
  }

  importer() {
    this.erreur = this.coursService.importFiltres(this.filtres);
    if (this.erreur === undefined) {
      this.visible = false;
    }
  }

  exemple() {
    this.reinitialiserVue();
    this.filtres = JSON.stringify(CoursService.CONFIGURATION_INITIALE_FILTRE, null, 2);
  }
}
