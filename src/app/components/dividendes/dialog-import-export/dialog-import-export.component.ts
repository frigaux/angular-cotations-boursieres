import {Component, OnInit} from '@angular/core';
import {TranslatePipe} from "@ngx-translate/core";
import {Dialog} from 'primeng/dialog';
import {FloatLabel} from 'primeng/floatlabel';
import {FormsModule} from '@angular/forms';
import {DatePipe, NgClass} from '@angular/common';
import {Button} from 'primeng/button';
import {DividendesService} from '../../../services/dividendes/dividendes.service';
import {Chip} from 'primeng/chip';
import {DTODividende} from '../../../services/dividendes/dto-dividende.interface';
import {ParseUtil} from '../../../services/commun/parse-util.class';
import {TypeDividende} from '../../../services/dividendes/type-dividende.enum';
import {DTODividendes} from '../../../services/dividendes/dto-dividendes.class';

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
export class DialogImportExportComponent implements OnInit {
  visible: boolean = false;
  dividendes: string = '';
  erreur?: string;
  moisDejaImportes?: Array<string>;

  constructor(private dividendesService: DividendesService) {
  }

  ngOnInit(): void {
    this.dividendesService.onUpdate(dividendes => this.construireVue());
  }

  reinitialiserVue() {
    this.dividendes = '';
    this.erreur = undefined;

    this.construireVue();
  }

  construireVue() {
    const dividendes = this.dividendesService.charger();
    if (dividendes) {
      const moisDistinct: Set<string> = new Set();
      dividendes.dividendes.forEach(dividende =>
        moisDistinct.add(`${dividende.date.substring(0, 7)}-01`));
      this.moisDejaImportes = Array.from(moisDistinct).sort();
    }
  }

  exporter() {
    this.dividendes = JSON.stringify(this.dividendesService.charger(), DividendesService.REPLACER, 2);
  }

  importer() {
    const dividendesAImporter = this.parseAndMapDividendes(this.dividendes);
    if (dividendesAImporter.length > 0) {
      const moisAImporter = dividendesAImporter[0].date.substring(0, 7);

      let dividendesExistants = this.dividendesService.charger()?.dividendes || [];
      dividendesExistants = dividendesExistants.filter(dividende => dividende.date.substring(0, 7) !== moisAImporter);
      dividendesExistants.push(...dividendesAImporter);

      const dto = new DTODividendes();
      dto.dividendes = dividendesExistants;
      this.dividendesService.enregistrer(dto);
    }
  }

  private parseAndMapDividendes(html: string): Array<DTODividende> {
    const dividendes: Array<DTODividende> = [];
    const document = new DOMParser().parseFromString(html, 'text/html');
    const elTBODY = document.querySelector('table.tablesorter > tbody');
    if (!elTBODY) {
      console.error('tbody introuvable');
    } else {
      const elTRs = elTBODY.querySelectorAll('tr');
      for (const elTR of elTRs) {
        const elTDs = elTR.querySelectorAll('td');
        if (elTDs.length !== 5) {
          console.error('le TR n\'a pas 5 TD', elTR, elTDs.length);
        } else {
          const elA = elTDs[1].querySelector('a');
          if (elA) {
            const date = ParseUtil.parseDateFrAndMapTo8601(elTDs[0].innerText);
            const matchTicker = /\/([A-Z0-9]+)p/.exec(elA.href);
            const type: TypeDividende = elTDs[2].innerText.toLowerCase() as TypeDividende;
            const montant = ParseUtil.parseNumber(elTDs[3].innerText);
            const pourcentageRendement = ParseUtil.parseNumber(elTDs[4].innerText) / 100;
            if (!matchTicker) {
              console.error('ticker introuvable dans : %s', elA.href);
            } else {
              dividendes.push({date, ticker: matchTicker[1], type, montant, pourcentageRendement});
            }
          }
        }
      }
    }
    return dividendes;
  }

  protected supprimerMois(mois: string) {
    const dto = this.dividendesService.charger();
    if (dto) {
      dto.dividendes = dto.dividendes.filter(dividende => dividende.date.substring(0, 7) !== mois.substring(0, 7));
      this.dividendesService.enregistrer(dto);
    }
  }
}
