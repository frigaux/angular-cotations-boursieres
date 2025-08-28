import {Component, input, InputSignal} from '@angular/core';
import {Fieldset} from "primeng/fieldset";
import {TableModule} from "primeng/table";
import {TranslatePipe} from "@ngx-translate/core";
import {DTOLien} from '../../../../services/abc-bourse/dto-lien.class';
import {AbcBourseService} from '../../../../services/abc-bourse/abc-bourse.service';
import {LienDecore} from './lien-decore';

@Component({
  selector: 'app-bloc-liens',
  imports: [
    Fieldset,
    TableModule,
    TranslatePipe
  ],
  templateUrl: './bloc-liens.component.html',
  styleUrl: './bloc-liens.component.sass'
})
export class BlocLiensComponent {
  // input/output
  inputConfiguration: InputSignal<{
    liens: Array<DTOLien>,
    keysTranslation: {
      legende: string,
      moment: string,
      titre: string
    }
  } | undefined> = input(undefined,
    {transform: o => this.intercepteurConfiguration(o), alias: 'configuration'});

  // données pour la vue
  liensDecores?: Array<LienDecore>;
  keysTranslation?: {
    legende: string,
    moment: string,
    titre: string
  };

  constructor(private abcBourseService: AbcBourseService) {
  }

  private intercepteurConfiguration(configuration: {
    liens: Array<DTOLien>;
    keysTranslation: {
      legende: string,
      moment: string,
      titre: string
    }
  } | undefined) {
    if (configuration) {
      let i = 0;
      this.liensDecores = configuration.liens
        .map(lien => new LienDecore(i++, lien));
      this.keysTranslation = configuration.keysTranslation;
    } else {
      this.liensDecores = undefined;
      this.keysTranslation = undefined;
    }
    return configuration;
  }

  chargerLien(lienDecore: LienDecore) {
    if (lienDecore.html === undefined) {
      this.abcBourseService.chargerLien(lienDecore.lien.pathname).subscribe({
        error: httpResponseError => {
        },
        next: html => {
          lienDecore.html = html;
        }
      });
    }
  }
}
