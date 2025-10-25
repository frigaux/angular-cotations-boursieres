import {Component} from '@angular/core';
import {Dialog} from 'primeng/dialog';
import {LoaderComponent} from '../../../loader/loader.component';
import {TableModule} from 'primeng/table';
import {TranslatePipe, TranslateService} from '@ngx-translate/core';
import {Cours} from '../../../cours/cours.class';
import {BoursoramaService} from '../../../../services/boursorama/boursorama.service';
import {DtoCotationsTickerBoursorama} from '../../../../services/boursorama/dto-cotations-ticker-boursorama.interface';
import {UIChart} from 'primeng/chart';
import {Fieldset} from 'primeng/fieldset';

@Component({
  selector: 'app-dialog-cotations-ticker',
  imports: [
    Dialog,
    LoaderComponent,
    TableModule,
    TranslatePipe,
    UIChart,
    Fieldset
  ],
  templateUrl: './dialog-cotations-ticker.component.html',
  styleUrl: './dialog-cotations-ticker.component.sass'
})
export class DialogCotationsTickerComponent {

  // données pour la vue
  visible: boolean = false;
  loading: boolean = false;
  ticker?: string;
  cours?: Cours;
  coursBoursorama?: DtoCotationsTickerBoursorama;
  data?: any;

  constructor(private translateService: TranslateService, private boursoramaService: BoursoramaService) {
  }

  afficherCours(cours: Cours) {
    this.cours = cours;
    this.visible = true;
    this.loading = true;
    this.boursoramaService.chargerCoursTicker(cours.ticker).subscribe(
      coursBoursorama => {
        const documentStyle = getComputedStyle(document.documentElement);
        this.coursBoursorama = coursBoursorama;
        this.loading = false;
        const qtAchats = this.coursBoursorama.achats.reduce((accumulator, achat) => accumulator + achat.quantite, 0);
        const qtVentes = this.coursBoursorama.ventes.reduce((accumulator, vente) => accumulator + vente.quantite, 0);
        const pourcentageAchats = Math.round((qtAchats / (qtAchats + qtVentes)) * 100);
        this.data = {
          labels: [
            this.translateService.instant('COMPOSANTS.PORTEFEUILLES.ACTIONS_VALEUR.DIALOG_COURS_TICKER.ACHATS'),
            this.translateService.instant('COMPOSANTS.PORTEFEUILLES.ACTIONS_VALEUR.DIALOG_COURS_TICKER.VENTES')
          ],
          datasets: [
            {
              data: [pourcentageAchats, 100 - pourcentageAchats],
              backgroundColor: [documentStyle.getPropertyValue('--p-green-500'), documentStyle.getPropertyValue('--p-red-500')],
              hoverBackgroundColor: [documentStyle.getPropertyValue('--p-green-400'), documentStyle.getPropertyValue('--p-red-400')]
            }
          ]
        };
      }
    )
  }
}
