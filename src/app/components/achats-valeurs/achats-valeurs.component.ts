import {Component, OnInit} from '@angular/core';
import {ValeursService} from '../../services/valeurs/valeurs.service';
import {DTOAchatsTicker} from '../../services/valeurs/dto-achats-ticker.interface';
import {DTOValeur} from '../../services/valeurs/dto-valeur.interface';
import {AchatsValeurDecores} from './achats-valeur-decores.class';
import {AchatDecore} from '../valeurs/achats-valeur/achat-decore.class';
import {TranslatePipe, TranslateService} from '@ngx-translate/core';
import {LoaderComponent} from '../loader/loader.component';
import {DialogImportExportComponent} from './dialog-import-export/dialog-import-export.component';
import {ConfirmationService} from 'primeng/api';
import {DialogueService} from '../../services/dialogue/dialogue.service';
import {TableauAchats} from './tableau-achats/tableau-achats';
import {BoursoramaService} from '../../services/boursorama/boursorama.service';
import {CurrencyPipe, PercentPipe} from '@angular/common';

@Component({
  selector: 'app-achats-valeurs',
  imports: [
    TranslatePipe,
    LoaderComponent,
    DialogImportExportComponent,
    TableauAchats,
    CurrencyPipe,
    PercentPipe
  ],
  templateUrl: './achats-valeurs.component.html',
  styleUrls: ['./achats-valeurs.component.sass', '../commun/titre.sass']
})
export class AchatsValeursComponent implements OnInit {
  // chargement des valeurs
  loading: boolean = true;

  // données pour la vue
  achatsNonRevendus?: Array<AchatsValeurDecores>;
  achatsRevendus?: Array<AchatsValeurDecores>;
  coursNonRevendus?: Array<AchatsValeurDecores>;

  private valeurByTicker?: Map<string, DTOValeur>;
  private achatsTickers?: Array<DTOAchatsTicker>;

  constructor(private translateService: TranslateService,
              private valeursService: ValeursService,
              private boursoramaService: BoursoramaService,
              private confirmationService: ConfirmationService,
              private dialogueService: DialogueService) {
  }

  ngOnInit(): void {
    this.valeursService.onImportAchats(achatsTickers => this.construireVue());
    this.valeursService.chargerValeurs().subscribe(valeurs => {
      this.valeurByTicker = new Map<string, DTOValeur>();
      valeurs.forEach(valeur => this.valeurByTicker!.set(valeur.ticker, valeur));
      this.construireVue();
      this.loading = false;
    });
  }

  private construireVue() {
    this.achatsTickers = this.valeursService.chargerAchats();
    this.achatsNonRevendus = this.decorerAchats(this.filtrerAchats(false));
    this.achatsRevendus = this.decorerAchats(this.filtrerAchats(true));
  }

  private filtrerAchats(revendus: boolean): Array<DTOAchatsTicker> {
    return this.achatsTickers!
      .map(achatsTicker => {
          return {ticker: achatsTicker.ticker, achats: achatsTicker.achats.filter(a => a.revendu === revendus)};
        }
      )
      .filter(achatsTicker => achatsTicker.achats.length > 0);
  }

  private decorerAchats(achats: Array<DTOAchatsTicker>): Array<AchatsValeurDecores> {
    let i = 0;
    return achats
      .map(achatsTicker => {
        let j = 0;
        const achatDecores: Array<AchatDecore> = achatsTicker.achats
          .sort((a1, a2) => new Date(a1.date).getTime() - new Date(a2.date).getTime())
          .map(achat => new AchatDecore(j++, new Date(achat.date), achat));
        const valeur: DTOValeur = this.valeurByTicker!.get(achatsTicker.ticker)!;
        return new AchatsValeurDecores(i++, valeur, achatsTicker, achatDecores);
      })
      .sort((a1, a2) => a1.valeur.libelle.localeCompare(a2.valeur.libelle));
  }

  suppressionAchat(data: { event: MouseEvent, achatsValeurDecores: AchatsValeurDecores, achatDecore: AchatDecore }) {
    this.dialogueService.confirmationSuppression(
      this.confirmationService,
      data.event,
      this.translateService.instant('COMPOSANTS.ACHATS_VALEURS.CONFIRMATION_SUPPRESSION'),
      () => {
        this.supprimerAchat(data.achatsValeurDecores, data.achatDecore);
      }
    );
  }

  supprimerAchat(achatsValeurDecores: AchatsValeurDecores, achatDecore: AchatDecore) {
    const achatsTicker = achatsValeurDecores.achatsTicker;
    achatsTicker.achats.splice(achatsTicker.achats.indexOf(achatDecore.achat), 1);
    this.valeursService.enregistrerAchatsTicker(achatsTicker.ticker, achatsTicker.achats);
    this.construireVue();
  }

  revendreAchat(data: { event: MouseEvent, achatsValeurDecores: AchatsValeurDecores, achatDecore: AchatDecore }) {
    data.achatDecore.achat.revendu = true;
    this.valeursService.enregistrerAchatsTicker(data.achatsValeurDecores.achatsTicker.ticker, data.achatsValeurDecores.achatsTicker.achats);
    this.construireVue();
  }

  recupererCoursValeursNonRevendues() {
    if (this.achatsNonRevendus && this.achatsNonRevendus.length > 0) {
      this.loading = true;
      const tickers = this.achatsNonRevendus.map(achat => achat.valeur.ticker);
      this.coursNonRevendus = JSON.parse(JSON.stringify(this.achatsNonRevendus));
      this.boursoramaService.chargerCoursTickers(tickers)
        .subscribe(liste => {
          this.coursNonRevendus?.forEach(achats => {
            const cours = liste.find(c => c.ticker === achats.valeur.ticker);
            achats.achatsDecores.forEach(achatDecore => {
              achatDecore.cours = cours ? cours.cloture : undefined;
              achatDecore.variationAchat = cours ? (cours.cloture / achatDecore.achat.prix) - 1 : undefined;
              achatDecore.variationBas = cours ? (cours.cloture / cours.plusBas) - 1 : undefined;
              achatDecore.variationHaut = cours ? (cours.cloture / cours.plusHaut) - 1 : undefined;
            });
          });
          this.loading = false;
        });
    }
  }

  evolutionVariation(variation?: number): string {
    if (variation === undefined) {
      return '';
    }
    return variation >= 0 ? 'positive' : 'negative';
  }
}
