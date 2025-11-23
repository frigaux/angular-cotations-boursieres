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
import {TableauAchatsNonRevendusComponent} from './tableau-achats-non-revendus/tableau-achats-non-revendus.component';
import {AchatValeurDecore} from './tableau-achats-non-revendus/achat-valeur-decore.class';
import {
  DialogCoursAchatsNonRevendusComponent
} from './dialog-cours-achats-non-revendus/dialog-cours-achats-non-revendus.component';

@Component({
  selector: 'app-achats-valeurs',
  imports: [
    TranslatePipe,
    LoaderComponent,
    DialogImportExportComponent,
    TableauAchatsNonRevendusComponent,
    DialogCoursAchatsNonRevendusComponent
  ],
  templateUrl: './achats-valeurs.component.html',
  styleUrls: ['./achats-valeurs.component.sass', '../commun/titre.sass']
})
export class AchatsValeursComponent implements OnInit {
  public dialogCoursAchatsNonRevendusComponent = viewChild(DialogCoursAchatsNonRevendusComponent);

  // données pour la vue
  loading: boolean = true; // chargement des valeurs
  achatsNonRevendus?: Array<AchatValeurDecore>;
  achatsRevendus?: Array<AchatValeurDecore>;

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

  private decorerAchats(achats: Array<DTOAchatsTicker>): Array<AchatValeurDecore> {
    const resultat: Array<AchatValeurDecore> = [];
    let i = 0;
    achats.forEach(achatsTicker => {
      const valeur: DTOValeur = this.valeurByTicker!.get(achatsTicker.ticker)!;
      achatsTicker.achats
        .sort((a1, a2) => new Date(a1.date).getTime() - new Date(a2.date).getTime())
        .map(achat => new AchatDecore(i++, new Date(achat.date), achat))
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
    this.dialogCoursAchatsNonRevendusComponent()?.afficherCours(this.achatsNonRevendus!);
  }
}
