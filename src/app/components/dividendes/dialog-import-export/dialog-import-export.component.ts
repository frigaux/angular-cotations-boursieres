import {Component} from '@angular/core';
import {TranslatePipe} from "@ngx-translate/core";
import {Dialog} from 'primeng/dialog';
import {FloatLabel} from 'primeng/floatlabel';
import {FormsModule} from '@angular/forms';
import {DatePipe, NgClass} from '@angular/common';
import {Button} from 'primeng/button';
import {DividendesService} from '../../../services/dividendes/dividendes.service';
import {Chip} from 'primeng/chip';

@Component({
  selector: 'app-dialog-import-export',
  imports: [
    TranslatePipe,
    Dialog,
    FloatLabel,
    FormsModule,
    NgClass,
    Button,
    DatePipe,
    Chip
  ],
  templateUrl: './dialog-import-export.component.html',
  styleUrls: ['../../parametrage/gestion-portefeuilles/dialog-import-export/dialog-import-export.component.sass', './dialog-import-export.component.sass']
})
export class DialogImportExportComponent {
  visible: boolean = false;
  dividendes: string = '';
  erreur?: string;
  moisDejaImportes?: Array<string>;

  constructor(private dividendesService: DividendesService) {
  }

  reinitialiserVue() {
    this.dividendes = '';
    this.erreur = undefined;

    const dividendes = this.dividendesService.charger();
    if (dividendes) {
      const moisDistinct: Set<string> = new Set();
      dividendes.dividendes.forEach(dividende =>
        moisDistinct.add(`${dividende.date.substring(0, 7)}-01`));
      this.moisDejaImportes = Array.from(moisDistinct).sort();
    }
  }

  exporter() {
  }

  importer() {
    // this.erreur = this.valeursService.importAchats(this.achats);
    // if (this.erreur === undefined) {
    //   this.visible = false;
    // }
  }
}
