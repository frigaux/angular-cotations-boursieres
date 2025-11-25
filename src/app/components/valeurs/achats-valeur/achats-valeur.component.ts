import {Component, input, InputSignal, OnInit} from '@angular/core';
import {ValeursService} from '../../../services/valeurs/valeurs.service';
import {DTOAchat} from '../../../services/valeurs/dto-achat.interface';
import {TranslatePipe, TranslateService} from '@ngx-translate/core';
import {FormsModule} from '@angular/forms';
import {AchatDecore} from './achat-decore.class';
import {InputText} from 'primeng/inputtext';
import {DatePicker} from 'primeng/datepicker';
import {DatePipe} from '@angular/common';
import {ConfirmationService} from 'primeng/api';
import {DialogueService} from '../../../services/dialogue/dialogue.service';
import {ToggleSwitch} from 'primeng/toggleswitch';

@Component({
  selector: 'app-achats-valeur',
  imports: [
    TranslatePipe,
    FormsModule,
    InputText,
    DatePicker,
    ToggleSwitch
  ],
  templateUrl: './achats-valeur.component.html',
  styleUrl: './achats-valeur.component.sass'
})
export class AchatsValeurComponent implements OnInit {
  // input/output
  inputValeur: InputSignal<{ ticker: string, cloture: number } | undefined> = input(undefined,
    {transform: o => this.intercepteurTicker(o), alias: 'valeur'});
  valeur?: { ticker: string, cloture: number };

  private achats: Array<DTOAchat> = [];

  // données pour la vue
  achatsDecores: AchatDecore[] = [];
  erreur?: string;
  succes?: string;

  constructor(private translateService: TranslateService,
              private valeursService: ValeursService,
              private confirmationService: ConfirmationService,
              private dialogueService: DialogueService,
              private datepipe: DatePipe) {
  }

  ngOnInit(): void {
    this.valeursService.onImportAchats(achatsTickers => this.construireVue());
  }

  private intercepteurTicker(valeur: { ticker: string, cloture: number } | undefined): {
    ticker: string,
    cloture: number
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
        date: this.datepipe.transform(new Date(), 'yyyy-MM-dd')!,
        quantite: 1,
        prix: this.valeur.cloture
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

  protected onChangeRevendu(achatDecore: AchatDecore) {
    if (!achatDecore.form.revendu) {
      achatDecore.form.dateRevente = undefined;
      achatDecore.achat.dateRevente = undefined;
      achatDecore.achat.prixRevente = undefined;
      this.enregistrerAchats();
    }
  }

  private decorerAchats() {
    let i = 0;
    this.achatsDecores = this.achats
      .sort((a1, a2) => new Date(a1.date).getTime() - new Date(a2.date).getTime())
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
