import {Component, OnInit, viewChild} from '@angular/core';
import {ValeursService} from '../../services/valeurs/valeurs.service';
import {DTOAchatsTicker} from '../../services/valeurs/dto-achats-ticker.interface';
import {DTOValeur} from '../../services/valeurs/dto-valeur.interface';
import {AchatDecore} from '../valeurs/achats-valeur/achat-decore.class';
import {TranslatePipe, TranslateService} from '@ngx-translate/core';
import {LoaderComponent} from '../loader/loader.component';
import {DialogImportExportComponent} from './dialog-import-export/dialog-import-export.component';
import {ConfirmationService} from 'primeng/api';
import {DialogueService} from '../../services/dialogue/dialogue.service';
import {TableauAchatsComponent} from './tableau-achats/tableau-achats.component';
import {AchatValeurDecore} from './tableau-achats/achat-valeur-decore.class';
import {DialogCoursAchatsComponent} from './dialog-cours-achats/dialog-cours-achats.component';
import {TableauVentesComponent} from './tableau-ventes/tableau-ventes.component';
import {TableauOrdresAchatsComponent} from './tableau-ordres-achats/tableau-ordres-achats.component';
import {EtapeValeur} from '../valeurs/achats-valeur/etape-valeur.enum';
import {EtapeValeurUtil} from '../valeurs/achats-valeur/etape-valeur-util.class';
import {TableauOrdresVentesComponent} from './tableau-ordres-ventes/tableau-ordres-ventes.component';

@Component({
  selector: 'app-achats-valeurs',
  imports: [
    TranslatePipe,
    LoaderComponent,
    DialogImportExportComponent,
    TableauAchatsComponent,
    DialogCoursAchatsComponent,
    TableauVentesComponent,
    TableauOrdresAchatsComponent,
    TableauOrdresVentesComponent
  ],
  templateUrl: './achats-valeurs.component.html',
  styleUrls: ['./achats-valeurs.component.sass', '../commun/titre.sass']
})
export class AchatsValeursComponent implements OnInit {
  public dialogCoursAchatsNonRevendusComponent = viewChild(DialogCoursAchatsComponent);

  // données pour la vue
  loading: boolean = true; // chargement des valeurs
  ordresAchats?: Array<AchatValeurDecore>;
  achats?: Array<AchatValeurDecore>;
  ordresVentes?: Array<AchatValeurDecore>;
  ventes?: Array<AchatValeurDecore>;

  // private
  private valeurByTicker?: Map<string, DTOValeur>;
  private achatsTickers?: Array<DTOAchatsTicker>;

  constructor(private translateService: TranslateService,
              private valeursService: ValeursService,
              private confirmationService: ConfirmationService,
              private dialogueService: DialogueService) {
  }

  ngOnInit(): void {
    this.valeursService.onImportAchats(achatsTickers => this.construireVue());
    this.valeursService.onUpdateAchats(achatsTickers => this.construireVue());
    this.valeursService.chargerValeurs().subscribe(valeurs => {
      this.valeurByTicker = new Map<string, DTOValeur>();
      valeurs.forEach(valeur => this.valeurByTicker!.set(valeur.ticker, valeur));
      this.construireVue();
      this.loading = false;
    });
  }

  private construireVue() {
    this.achatsTickers = this.valeursService.chargerAchats();
    this.ordresAchats = this.decorerAchats(this.filtrerAchats(EtapeValeur.ORDRE_ACHAT));
    this.achats = this.decorerAchats(this.filtrerAchats(EtapeValeur.ACHAT));
    this.ordresVentes = this.decorerAchats(this.filtrerAchats(EtapeValeur.ORDRE_VENTE));
    this.ventes = this.decorerAchats(this.filtrerAchats(EtapeValeur.VENTE));
  }

  private filtrerAchats(etape: EtapeValeur): Array<DTOAchatsTicker> {
    return this.achatsTickers!
      .map(achatsTicker => {
          return {
            ticker: achatsTicker.ticker,
            achats: achatsTicker.achats
              .filter(achat => {
                switch (etape) {
                  case EtapeValeur.ORDRE_ACHAT:
                    return EtapeValeurUtil.isOrdreAchat(achat);
                  case EtapeValeur.ACHAT:
                    return EtapeValeurUtil.isAchat(achat);
                  case EtapeValeur.ORDRE_VENTE:
                    return EtapeValeurUtil.isOrdreVente(achat);
                  case EtapeValeur.VENTE:
                    return EtapeValeurUtil.isVente(achat);
                }
              })
          };
        }
      )
      .filter(achatsTicker => achatsTicker.achats.length > 0);
  }

  private decorerAchats(achats: Array<DTOAchatsTicker>): Array<AchatValeurDecore> {
    const resultat: Array<AchatValeurDecore> = [];
    let i = 0;
    achats.forEach(achatsTicker => {
      const valeur: DTOValeur = this.valeurByTicker!.get(achatsTicker.ticker)!;
      achatsTicker.achats
        .sort((a1, a2) => {
          const d1 = a1.date ? new Date(a1.date) : new Date();
          const d2 = a2.date ? new Date(a2.date) : new Date();
          return d1.getTime() - d2.getTime();
        })
        .map(achat => new AchatDecore(i++, achat))
        .forEach(achatDecore => {
          resultat.push(new AchatValeurDecore(valeur, achatDecore));
        });
    })
    resultat.sort((a1, a2) => a1.valeur.libelle.localeCompare(a2.valeur.libelle));
    return resultat;
  }

  suppressionAchat(data: { event: MouseEvent, achatValeurDecore: AchatValeurDecore }) {
    this.dialogueService.confirmationSuppression(
      this.confirmationService,
      data.event,
      this.translateService.instant('COMPOSANTS.ACHATS_VALEURS.CONFIRMATION_SUPPRESSION'),
      () => {
        this.supprimerAchat(data.achatValeurDecore);
      }
    );
  }

  private supprimerAchat(achatValeurDecore: AchatValeurDecore) {
    const ticker = achatValeurDecore.valeur.ticker;
    const achatsTicker = this.valeursService.chargerAchatsTicker(ticker);
    const achatASupprimer = achatValeurDecore.achatDecore.achat;
    const indexASupprimer = achatsTicker.findIndex(achat => JSON.stringify(achat) === JSON.stringify(achatASupprimer));
    achatsTicker.splice(indexASupprimer, 1);
    this.valeursService.enregistrerAchatsTicker(ticker, achatsTicker);
  }

  recupererCours() {
    this.dialogCoursAchatsNonRevendusComponent()?.afficherCours(this.achats!);
  }
}
