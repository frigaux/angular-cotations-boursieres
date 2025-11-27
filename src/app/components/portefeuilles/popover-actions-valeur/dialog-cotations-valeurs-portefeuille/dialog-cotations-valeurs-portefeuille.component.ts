import {Component, viewChild} from '@angular/core';
import {TranslatePipe, TranslateService} from '@ngx-translate/core';
import {BoursoramaService} from '../../../../services/boursorama/boursorama.service';
import {CotationsValeurBoursoramaDecore} from '../dialog-cotations-valeur/cotations-valeur-boursorama-genere.class';
import {PortefeuilleAvecCours} from '../../portefeuille-avec-cours.class';
import {Dialog} from 'primeng/dialog';
import {LoaderComponent} from '../../../loader/loader.component';
import {JaugeComponent} from '../../../commun/jauge/jauge.component';
import {CurrencyPipe, PercentPipe} from '@angular/common';
import {UIChart} from 'primeng/chart';
import {TableModule} from 'primeng/table';
import {DialogCotationsValeurComponent} from '../dialog-cotations-valeur/dialog-cotations-valeur.component';
import {VueUtil} from '../../../../services/commun/vue-util.class';
import {PopoverActionsValeurComponent} from './popover-actions-valeur/popover-actions-valeur.component';
import {ColonneDividendesComponent} from '../../colonnes/dividendes/colonne-dividendes.component';
import {DividendesService} from '../../../../services/dividendes/dividendes.service';
import {ClassVariation} from '../../../../directives/class-variation';

@Component({
  selector: 'app-dialog-cotations-valeurs-portefeuille',
  imports: [
    Dialog,
    LoaderComponent,
    TranslatePipe,
    JaugeComponent,
    PercentPipe,
    UIChart,
    CurrencyPipe,
    TableModule,
    PopoverActionsValeurComponent,
    ColonneDividendesComponent,
    ClassVariation
  ],
  templateUrl: './dialog-cotations-valeurs-portefeuille.component.html',
  styleUrls: ['./dialog-cotations-valeurs-portefeuille.component.sass', '../../../commun/barre-superieure.sass']
})
export class DialogCotationsValeursPortefeuilleComponent {
  private actionsValeur = viewChild(PopoverActionsValeurComponent);

  private dialogCoursTickerComponent?: DialogCotationsValeurComponent;

  // données pour la vue
  visible: boolean = false;
  loading: boolean = false;
  portefeuilleAvecCours?: PortefeuilleAvecCours;
  cotationsTickersDecores?: Array<CotationsValeurBoursoramaDecore>;
  protected readonly VueUtil = VueUtil;

  constructor(private translateService: TranslateService,
              private dividendesService: DividendesService,
              private boursoramaService: BoursoramaService) {
  }

  afficherPortefeuille(portefeuilleAvecCours: PortefeuilleAvecCours, dialogCoursTickerComponent?: DialogCotationsValeurComponent) {
    this.portefeuilleAvecCours = portefeuilleAvecCours;
    this.dialogCoursTickerComponent = dialogCoursTickerComponent;
    this.visible = true;
    this.loading = true;
    this.boursoramaService.chargerInformationsTickers(portefeuilleAvecCours.cours).subscribe({
        next:
          cotationsTickersBoursorama => {
            let i = 0;
            const dividendesByTicker = this.dividendesService.chargerMapByTicker();
            this.cotationsTickersDecores = cotationsTickersBoursorama.map(cotationsTickerBoursorama =>
              new CotationsValeurBoursoramaDecore(this.translateService, i++, cotationsTickerBoursorama,
                dividendesByTicker ? dividendesByTicker.get(cotationsTickerBoursorama.valeur.ticker) || [] : undefined)
            );
            this.loading = false;
          },
        error:
          httpErrorResponse => this.loading = false
      }
    )
  }

  protected fermer() {
    this.visible = false;
  }

  protected rafraichir() {
    if (this.portefeuilleAvecCours && this.dialogCoursTickerComponent) {
      this.afficherPortefeuille(this.portefeuilleAvecCours, this.dialogCoursTickerComponent);
    }
  }

  private afficherActions(event: MouseEvent, cotationsTickerDecore: CotationsValeurBoursoramaDecore) {
    this.actionsValeur()?.afficher(event, cotationsTickerDecore, this.dialogCoursTickerComponent);
  }

  protected onClickCours(event: MouseEvent, cotationsTickerDecore: CotationsValeurBoursoramaDecore) {
    if (event.target instanceof Element && event.target.tagName === 'SPAN' && event.target.className.indexOf('pi') !== -1) {
      this.afficherActions(event, cotationsTickerDecore);
    } else {
      this.dialogCoursTickerComponent?.afficherCotationsTickerBoursoramaDecore(cotationsTickerDecore);
    }
  }
}
