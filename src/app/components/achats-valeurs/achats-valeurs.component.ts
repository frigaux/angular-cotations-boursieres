import {Component, OnInit} from '@angular/core';
import {ValeursService} from '../../services/valeurs/valeurs.service';
import {DTOAchatsTicker} from '../../services/valeurs/dto-achats-ticker.interface';
import {DTOValeur} from '../../services/valeurs/dto-valeur.interface';
import {AchatsValeurDecores} from './achats-valeur-decores.class';
import {AchatDecore} from '../valeurs/details-valeur/achats-valeur/achat-decore.class';
import {CurrencyPipe, DatePipe, DecimalPipe} from '@angular/common';
import {TranslatePipe, TranslateService} from '@ngx-translate/core';
import {DTOAchat} from '../../services/valeurs/dto-achat.interface';
import {ConfirmationService} from 'primeng/api';
import {DialogueService} from '../../services/dialogue/dialogue.service';
import {LoaderComponent} from '../loader/loader.component';
import {ImportExportComponent} from './import-export/import-export.component';

@Component({
  selector: 'app-achats-valeurs',
  imports: [
    DatePipe,
    CurrencyPipe,
    DecimalPipe,
    TranslatePipe,
    LoaderComponent,
    ImportExportComponent
  ],
  templateUrl: './achats-valeurs.component.html',
  styleUrl: './achats-valeurs.component.sass'
})
export class AchatsValeursComponent implements OnInit {
  // chargement des valeurs
  loading: boolean = true;

  // données pour la vue
  achatsValeursDecores?: Array<AchatsValeurDecores>;
  totalPrix?: number;
  totalQuantite?: number;

  private valeurByTicker?: Map<string, DTOValeur>;
  private achatsTickers?: Array<DTOAchatsTicker>;

  constructor(private translateService: TranslateService,
              private valeursService: ValeursService,
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
    this.decorerAchats();
    this.calculerTotaux();
  }

  private decorerAchats() {
    let i = 0;
    this.achatsValeursDecores = this.achatsTickers!
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

  private calculerTotaux() {
    this.totalQuantite = 0;
    this.totalPrix = 0;
    this.achatsTickers!.forEach(achatsTicker => {
      achatsTicker.achats
        .filter(achat => !achat.revendu)
        .forEach(achat => {
          this.totalQuantite! += achat.quantite;
          this.totalPrix! += achat.prix * achat.quantite;
        })
    });
  }

  suppressionAchat(event: MouseEvent, achatsTicker: DTOAchatsTicker, achat: DTOAchat) {
    this.dialogueService.confirmationSuppression(
      this.confirmationService,
      event,
      this.translateService.instant('COMPOSANTS.ACHATS_VALEURS.CONFIRMATION_SUPPRESSION'),
      () => {
        this.supprimerAchat(achatsTicker, achat);
      }
    );
  }

  supprimerAchat(achatsTicker: DTOAchatsTicker, achat: DTOAchat) {
    achatsTicker.achats.splice(achatsTicker.achats.indexOf(achat), 1);
    this.valeursService.enregistrerAchatsTicker(achatsTicker.ticker, achatsTicker.achats)
    this.construireVue();
  }
}
