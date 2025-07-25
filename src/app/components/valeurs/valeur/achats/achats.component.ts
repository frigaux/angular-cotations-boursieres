import {Component, input, InputSignal} from '@angular/core';
import {ValeursService} from '../../../../services/valeurs/valeurs.service';
import {Achat} from '../../../../services/valeurs/achat.interface';
import {TranslatePipe} from '@ngx-translate/core';
import {FormsModule} from '@angular/forms';
import {ToggleSwitch} from 'primeng/toggleswitch';
import {AchatDecore} from './achat-decore.class';
import {InputText} from 'primeng/inputtext';
import {DatePicker} from 'primeng/datepicker';
import {NgIf} from '@angular/common';

@Component({
  selector: 'app-achats',
  imports: [
    TranslatePipe,
    FormsModule,
    ToggleSwitch,
    InputText,
    DatePicker,
    NgIf
  ],
  templateUrl: './achats.component.html',
  styleUrl: './achats.component.sass'
})
export class AchatsComponent {
  // input/output
  inputTicker: InputSignal<string | undefined> = input(undefined,
    {transform: o => this.intercepteurTicker(o), alias: 'ticker'});
  ticker?: string;

  private achats: Array<Achat> = [];

  // données pour la vue
  achatsDecores: AchatDecore[] = [];
  erreur?: string;

  constructor(private valeursService: ValeursService) {

  }

  private intercepteurTicker(ticker: string | undefined): string | undefined {
    this.ticker = ticker;
    if (ticker) {
      this.achats = this.valeursService.chargerAchatsTicker(ticker);
    } else {
      this.achats = [];
    }
    this.decorerAchats();
    return ticker;
  }

  ajouterAchat() {
    this.achats.push({
      date: new Date(),
      quantite: undefined,
      prix: undefined,
      revendu: false
    });
    this.decorerAchats();
  }

  private decorerAchats() {
    let i = 0;
    this.achatsDecores = this.achats
      .sort((a1, a2) => a1.date.getTime() - a2.date.getTime())
      .map(achat => new AchatDecore(i++, achat));
  }

  supprimerAchat(achat: Achat) {
    this.achats.splice(this.achats.indexOf(achat), 1);
    this.decorerAchats();
  }

  enregistrerAchats() {
    if (this.ticker) {
      this.erreur = this.valeursService.enregistrerAchatsTicker(this.ticker, this.achats);
      // TODO : confirmation UX
    }
  }
}
