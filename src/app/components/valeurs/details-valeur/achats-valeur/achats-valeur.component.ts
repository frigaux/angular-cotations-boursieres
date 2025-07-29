import {Component, input, InputSignal, OnInit} from '@angular/core';
import {ValeursService} from '../../../../services/valeurs/valeurs.service';
import {Achat} from '../../../../services/valeurs/achat.interface';
import {TranslatePipe, TranslateService} from '@ngx-translate/core';
import {FormsModule} from '@angular/forms';
import {ToggleSwitch} from 'primeng/toggleswitch';
import {AchatDecore} from './achat-decore.class';
import {InputText} from 'primeng/inputtext';
import {DatePicker} from 'primeng/datepicker';
import {DatePipe, NgIf} from '@angular/common';
import {ImportExportComponent} from './import-export/import-export.component';
import {ConfirmationService} from 'primeng/api';
import {DialogueService} from '../../../../services/dialogue/dialogue.service';

@Component({
  selector: 'app-achats-valeur',
  imports: [
    TranslatePipe,
    FormsModule,
    ToggleSwitch,
    InputText,
    DatePicker,
    NgIf,
    ImportExportComponent
  ],
  templateUrl: './achats-valeur.component.html',
  styleUrl: './achats-valeur.component.sass'
})
export class AchatsValeurComponent implements OnInit {
  // input/output
  inputValeur: InputSignal<{ ticker: string, cloture: number } | undefined> = input(undefined,
    {transform: o => this.intercepteurTicker(o), alias: 'valeur'});
  valeur?: { ticker: string, cloture: number };

  private achats: Array<Achat> = [];

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
    this.valeursService.onImport(achatsTickers => this.construireVue());
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
        prix: this.valeur.cloture,
        revendu: false
      });
      this.decorerAchats();
    }
  }

  private decorerAchats() {
    let i = 0;
    this.achatsDecores = this.achats
      .sort((a1, a2) => new Date(a1.date).getTime() - new Date(a2.date).getTime())
      .map(achat => new AchatDecore(i++, new Date(achat.date), achat));
  }

  suppressionAchat(event: Event, achat: Achat) {
    this.dialogueService.confirmationSuppression(
      this.confirmationService,
      event,
      this.translateService.instant('COMPOSANTS.VALEURS.DETAILS_VALEUR.ACHATS_VALEUR.CONFIRMATION_SUPPRESSION'),
      () => {
        this.supprimerAchat(achat);
      }
    );
  }

  supprimerAchat(achat: Achat) {
    this.achats.splice(this.achats.indexOf(achat), 1);
    this.decorerAchats();
  }

  enregistrerAchats() {
    if (this.valeur) {
      this.erreur = this.valeursService.enregistrerAchatsTicker(this.valeur.ticker, this.achats);
      if (this.erreur === undefined) {
        this.succes = this.translateService.instant('COMPOSANTS.VALEURS.DETAILS_VALEUR.ACHATS_VALEUR.ENREGISTREMENT_REUSSI');
        setTimeout(() => this.succes = undefined, 2000);
      }
    }
  }

  onSelectDate(achatDecore: AchatDecore) {
    achatDecore.achat.date = this.datepipe.transform(achatDecore.date, 'yyyy-MM-dd')!;
  }
}
