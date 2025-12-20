import {Component, input, InputSignal, OnInit} from '@angular/core';
import {ValeursService} from '../../../services/valeurs/valeurs.service';
import {DTOAchat} from '../../../services/valeurs/dto-achat.interface';
import {TranslatePipe, TranslateService} from '@ngx-translate/core';
import {FormsModule} from '@angular/forms';
import {AchatDecore} from './achat-decore.class';
import {InputNumber} from 'primeng/inputnumber';
import {DatePicker} from 'primeng/datepicker';
import {DatePipe} from '@angular/common';
import {ConfirmationService} from 'primeng/api';
import {DialogueService} from '../../../services/dialogue/dialogue.service';
import {EtapeValeur} from './etape-valeur.enum';
import {Select} from 'primeng/select';

@Component({
  selector: 'app-achats-valeur',
  imports: [
    TranslatePipe,
    FormsModule,
    InputNumber,
    DatePicker,
    Select
  ],
  templateUrl: './achats-valeur.component.html',
  styleUrl: './achats-valeur.component.sass'
})
export class AchatsValeurComponent implements OnInit {
  // input/output
  inputValeur: InputSignal<{ ticker: string, prixParDefaut: number } | undefined> = input(undefined,
    {transform: o => this.intercepteurTicker(o), alias: 'valeur'});
  valeur?: { ticker: string, prixParDefaut: number };

  private achats: Array<DTOAchat> = [];

  // données pour la vue
  achatsDecores: AchatDecore[] = [];
  erreur?: string;
  succes?: string;
  etapesValeur?: Array<{ libelle: string, etape: EtapeValeur }>;
  protected readonly EtapeValeur = EtapeValeur;


  constructor(private translateService: TranslateService,
              private valeursService: ValeursService,
              private confirmationService: ConfirmationService,
              private dialogueService: DialogueService,
              private datepipe: DatePipe) {
  }

  ngOnInit(): void {
    this.etapesValeur = [
      {libelle: this.translateService.instant('ENUMERATIONS.ETAPE_VALEUR.ORDRE_ACHAT'), etape: EtapeValeur.ORDRE_ACHAT},
      {libelle: this.translateService.instant('ENUMERATIONS.ETAPE_VALEUR.ACHAT'), etape: EtapeValeur.ACHAT},
      {libelle: this.translateService.instant('ENUMERATIONS.ETAPE_VALEUR.ORDRE_VENTE'), etape: EtapeValeur.ORDRE_VENTE},
      {libelle: this.translateService.instant('ENUMERATIONS.ETAPE_VALEUR.VENTE'), etape: EtapeValeur.VENTE},
    ];
    this.valeursService.onImportAchats(achatsTickers => this.construireVue());
  }

  private intercepteurTicker(valeur: { ticker: string, prixParDefaut: number } | undefined): {
    ticker: string,
    prixParDefaut: number
  } | undefined {
    this.valeur = valeur;
    this.construireVue();
    return valeur;
  }

  private construireVue() {
    if (this.valeur) {
      this.achats = this.valeursService.chargerAchatsTicker(this.valeur.ticker);
    } else {
      this.achats = [];
    }
    this.decorerAchats();
  }

  ajouterAchat() {
    if (this.valeur) {
      this.achats.push({
        quantite: 1,
        prix: this.valeur.prixParDefaut
      });
      this.decorerAchats();
      this.enregistrerAchats();
    }
  }

  suppressionAchat(event: Event, achat: DTOAchat) {
    this.dialogueService.confirmationSuppression(
      this.confirmationService,
      event,
      this.translateService.instant('COMPOSANTS.VALEURS.ACHATS_VALEUR.CONFIRMATION_SUPPRESSION'),
      () => {
        this.supprimerAchat(achat);
      }
    );
  }

  supprimerAchat(achat: DTOAchat) {
    this.achats.splice(this.achats.indexOf(achat), 1);
    this.decorerAchats();
    this.enregistrerAchats();
  }

  onSelectDate(achatDecore: AchatDecore) {
    achatDecore.achat.date = this.datepipe.transform(achatDecore.form.date, 'yyyy-MM-dd')!;
    this.enregistrerAchats();
  }

  onSelectDateRevente(achatDecore: AchatDecore) {
    achatDecore.achat.dateRevente = this.datepipe.transform(achatDecore.form.dateRevente, 'yyyy-MM-dd')!;
    this.enregistrerAchats();
  }

  onChange(achatDecore: AchatDecore) {
    if (achatDecore.achat.prixRevente === null) {
      achatDecore.achat.prixRevente = undefined;
    }
    this.enregistrerAchats();
  }

  protected onChangeEtape(achatDecore: AchatDecore) {
    if (achatDecore.form.etape < 3) {
      achatDecore.form.dateRevente = undefined;
      delete achatDecore.achat['dateRevente'];
    }
    if (achatDecore.form.etape < 2) {
      delete achatDecore.achat['prixRevente'];
    }
    if (achatDecore.form.etape < 1) {
      achatDecore.form.date = undefined;
      delete achatDecore.achat['date'];
    }
    this.enregistrerAchats();
  }

  private decorerAchats() {
    let i = 0;
    this.achatsDecores = this.achats
      .sort((a1, a2) => {
        const d1 = a1.date ? new Date(a1.date) : new Date();
        const d2 = a2.date ? new Date(a2.date) : new Date();
        return d1.getTime() - d2.getTime();
      })
      .map(achat => new AchatDecore(i++, achat));
  }

  private enregistrerAchats() {
    if (this.valeur) {
      this.erreur = this.valeursService.enregistrerAchatsTicker(this.valeur.ticker, this.achats);
      if (this.erreur === undefined) {
        this.succes = this.translateService.instant('COMPOSANTS.VALEURS.ACHATS_VALEUR.ENREGISTREMENT_REUSSI');
        setTimeout(() => this.succes = undefined, 2000);
      } else {
        setTimeout(() => this.erreur = undefined, 2000);
      }
    }
  }
}
