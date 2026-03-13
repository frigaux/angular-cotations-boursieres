import {Component, input, InputSignal, viewChild} from '@angular/core';
import {ColonneDividendesComponent} from "../../portefeuilles/colonnes/dividendes/colonne-dividendes.component";
import {CurrencyPipe, DatePipe, DecimalPipe, PercentPipe} from "@angular/common";
import {
  DialogAchatsValeurComponent
} from "../../portefeuilles/popover-actions-valeur/dialog-achats-valeur/dialog-achats-valeur.component";
import {LoaderComponent} from "../../loader/loader.component";
import {TableModule} from "primeng/table";
import {TranslatePipe, TranslateService} from "@ngx-translate/core";
import {AchatValeurDecore} from '../tableau-achats/achat-valeur-decore.class';
import {CoursService} from '../../../services/cours/cours.service';
import {DividendesService} from '../../../services/dividendes/dividendes.service';
import {ClassVariation} from '../../../directives/class-variation';
import {ValeursService} from '../../../services/valeurs/valeurs.service';
import {ConfirmationService} from 'primeng/api';
import {DialogueService} from '../../../services/dialogue/dialogue.service';

@Component({
  selector: 'app-tableau-ordres-ventes',
  imports: [
    ColonneDividendesComponent,
    CurrencyPipe,
    DecimalPipe,
    DialogAchatsValeurComponent,
    LoaderComponent,
    PercentPipe,
    TableModule,
    TranslatePipe,
    DatePipe,
    ClassVariation
  ],
  templateUrl: './tableau-ordres-ventes.component.html',
  styleUrls: ['./tableau-ordres-ventes.component.sass', '../tableau-achats/tableau-achats.component.sass'],
})
export class TableauOrdresVentesComponent {
  private dialogAchatsValeurComponent = viewChild(DialogAchatsValeurComponent);

  // chargement des cours
  loading: boolean = true;

  // input/output
  inputOrdresVentes: InputSignal<Array<AchatValeurDecore> | undefined> = input(undefined,
    {transform: o => this.intercepteurOrdresVentes(o), alias: 'ordresVentes'});

  // données pour la vue
  achatValeurDecores?: Array<AchatValeurDecore>;
  totalQuantite: number = 0;
  totauxReventes: number = 0;
  variationClotures: number = 0;
  totauxClotures: number = 0;


  constructor(private translateService: TranslateService,
              private coursService: CoursService,
              private dividendesService: DividendesService,
              private valeursService: ValeursService,
              private confirmationService: ConfirmationService,
              private dialogueService: DialogueService) {
  }

  private intercepteurOrdresVentes(ordresVentes: Array<AchatValeurDecore> | undefined) {
    this.achatValeurDecores = ordresVentes;
    if (ordresVentes) {
      this.loading = true;
      this.calculerTotaux();
      this.recupererCours();
    }
    return ordresVentes;
  }

  private calculerTotaux() {
    this.totalQuantite = 0;
    this.totauxReventes = 0;
    this.achatValeurDecores!.forEach(achatValeurDecore => {
      const achat = achatValeurDecore.achatDecore.achat;
      this.totalQuantite += achat.quantite;
      this.totauxReventes += achat.prixRevente! * achat.quantite;
    });
  }

  private recupererCours() {
    const tickers = Array.from(new Set(this.achatValeurDecores!.map(achat => achat.valeur.ticker)));
    this.totauxClotures = 0;
    this.coursService.chargerCoursTickersWithLimit(tickers, 1)
      .subscribe(liste => {
          liste.forEach(cours => {
            const achats: Array<AchatValeurDecore> = this.achatValeurDecores!.filter(achat => achat.valeur.ticker === cours.ticker);
            achats.forEach(achatValeurDecore => {
              achatValeurDecore.achatDecore.cours = cours.cloture;
              achatValeurDecore.achatDecore.variation = (cours.cloture / achatValeurDecore.achatDecore.achat.prixRevente!) - 1;
              this.totauxClotures += cours.cloture * achatValeurDecore.achatDecore.achat.quantite;
            });
          });
          this.variationClotures = (this.totauxClotures / this.totauxReventes) - 1;
          const dividendesByTicker = this.dividendesService.chargerMapByTicker();
          this.achatValeurDecores!.forEach(achatValeurDecore => {
            achatValeurDecore.dividendes = dividendesByTicker?.get(achatValeurDecore.valeur.ticker) || [];
          });
          this.loading = false;
        }
      );
  }

  annulerOrdreVente(event: PointerEvent, achatValeurDecore: AchatValeurDecore) {
    this.dialogueService.confirmationSuppression(
      this.confirmationService,
      event,
      this.translateService.instant('COMPOSANTS.ACHATS_VALEURS.ORDRES_VENTES.CONFIRMATION_ANNULATION_ORDRE_VENTE'),
      () => {
        const ticker = achatValeurDecore.valeur.ticker;
        const achatsTicker = this.valeursService.chargerAchatsTicker(ticker);
        const achat = achatsTicker.find(achat => JSON.stringify(achat) === JSON.stringify(achatValeurDecore.achatDecore.achat));
        if (achat) {
          delete achat['prixRevente'];
          this.valeursService.enregistrerAchatsTicker(ticker, achatsTicker);
        }
      }
    );
  }

  protected achats(event: PointerEvent, achatValeurDecore: AchatValeurDecore) {
    this.dialogAchatsValeurComponent()?.afficherAchats({
      ticker: achatValeurDecore.valeur.ticker,
      libelle: achatValeurDecore.valeur.libelle,
      prixParDefaut: achatValeurDecore.achatDecore.cours || 0
    });
  }
}
