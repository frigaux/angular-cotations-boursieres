import {Component, input, InputSignal, output, viewChild} from '@angular/core';
import {ColonneDividendesComponent} from '../../portefeuilles/colonnes/dividendes/colonne-dividendes.component';
import {CurrencyPipe, DecimalPipe, PercentPipe} from '@angular/common';
import {
  DialogAchatsValeurComponent
} from '../../portefeuilles/popover-actions-valeur/dialog-achats-valeur/dialog-achats-valeur.component';
import {LoaderComponent} from '../../loader/loader.component';
import {TableModule} from 'primeng/table';
import {TranslatePipe} from '@ngx-translate/core';
import {ClassVariation} from '../../../directives/class-variation';
import {AchatValeurDecore} from '../tableau-achats/achat-valeur-decore.class';
import {CoursService} from '../../../services/cours/cours.service';
import {DividendesService} from '../../../services/dividendes/dividendes.service';

@Component({
  selector: 'app-tableau-ordres-achats',
  imports: [
    ColonneDividendesComponent,
    CurrencyPipe,
    DecimalPipe,
    DialogAchatsValeurComponent,
    LoaderComponent,
    PercentPipe,
    TableModule,
    TranslatePipe,
    ClassVariation
  ],
  templateUrl: './tableau-ordres-achats.component.html',
  styleUrl: './tableau-ordres-achats.component.sass',
})
export class TableauOrdresAchatsComponent {
  private dialogAchatsValeurComponent = viewChild(DialogAchatsValeurComponent);

  // chargement des cours
  loading: boolean = true;

  // input/output
  inputOrdresAchats: InputSignal<Array<AchatValeurDecore> | undefined> = input(undefined,
    {transform: o => this.intercepteurOrdresAchats(o), alias: 'ordresAchats'});
  suppression = output<{ event: MouseEvent, achatValeurDecore: AchatValeurDecore }>();

  // données pour la vue
  achatValeurDecores?: Array<AchatValeurDecore>;
  totalQuantite: number = 0;
  totauxOrdresAchats: number = 0;
  variationOrdres: number = 0;
  totauxClotures: number = 0;


  constructor(private coursService: CoursService,
              private dividendesService: DividendesService) {
  }

  private intercepteurOrdresAchats(ordresAchats: Array<AchatValeurDecore> | undefined) {
    this.achatValeurDecores = ordresAchats;
    if (ordresAchats) {
      this.loading = true;
      this.calculerTotaux();
      this.recupererCours();
    }
    return ordresAchats;
  }

  private calculerTotaux() {
    this.totalQuantite = 0;
    this.totauxOrdresAchats = 0;
    this.achatValeurDecores!.forEach(achatValeurDecore => {
      const achat = achatValeurDecore.achatDecore.achat;
      this.totalQuantite += achat.quantite;
      this.totauxOrdresAchats += achat.prix * achat.quantite;
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
              achatValeurDecore.achatDecore.variation = (achatValeurDecore.achatDecore.achat.prix / cours.cloture) - 1;
              this.totauxClotures += cours.cloture * achatValeurDecore.achatDecore.achat.quantite;
            });
          });
          this.variationOrdres = (this.totauxOrdresAchats / this.totauxClotures) - 1;
          const dividendesByTicker = this.dividendesService.chargerMapByTicker();
          this.achatValeurDecores!.forEach(achatValeurDecore => {
            achatValeurDecore.dividendes = dividendesByTicker?.get(achatValeurDecore.valeur.ticker) || [];
          });
          this.loading = false;
        }
      );
  }

  suppressionAchat(event: PointerEvent, achatValeurDecore: AchatValeurDecore) {
    this.suppression.emit({event, achatValeurDecore});
  }

  protected achats(event: PointerEvent, achatValeurDecore: AchatValeurDecore) {
    this.dialogAchatsValeurComponent()?.afficherAchats({
      ticker: achatValeurDecore.valeur.ticker,
      libelle: achatValeurDecore.valeur.libelle,
      prixParDefaut: achatValeurDecore.achatDecore.cours || 0
    });
  }
}
