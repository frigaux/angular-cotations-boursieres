import {Component, input, InputSignal, OnInit} from '@angular/core';
import {ValeursService} from '../../../../services/valeurs/valeurs.service';
import {Achat} from '../../../../services/valeurs/achat.interface';
import {TranslatePipe} from '@ngx-translate/core';
import {FormsModule} from '@angular/forms';
import {ToggleSwitch} from 'primeng/toggleswitch';
import {AchatDecore} from './achat-decore.class';
import {InputText} from 'primeng/inputtext';
import {DatePicker} from 'primeng/datepicker';
import {DatePipe, NgIf} from '@angular/common';
import {ImportExportComponent} from './import-export/import-export.component';

@Component({
  selector: 'app-achats',
  imports: [
    TranslatePipe,
    FormsModule,
    ToggleSwitch,
    InputText,
    DatePicker,
    NgIf,
    ImportExportComponent
  ],
  templateUrl: './achats.component.html',
  styleUrl: './achats.component.sass'
})
export class AchatsComponent implements OnInit {
  // input/output
  inputTicker: InputSignal<string | undefined> = input(undefined,
    {transform: o => this.intercepteurTicker(o), alias: 'ticker'});
  ticker?: string;

  private achats: Array<Achat> = [];

  // données pour la vue
  achatsDecores: AchatDecore[] = [];
  erreur?: string;

  constructor(private valeursService: ValeursService, private datepipe: DatePipe) {
  }

  ngOnInit(): void {
    this.valeursService.onImport(achatsTickers => this.construireVue());
  }

  private intercepteurTicker(ticker: string | undefined): string | undefined {
    this.ticker = ticker;
    this.construireVue();
    return ticker;
  }

  private construireVue() {
    if (this.ticker) {
      this.achats = this.valeursService.chargerAchatsTicker(this.ticker);
    } else {
      this.achats = [];
    }
    this.decorerAchats();
  }

  ajouterAchat() {
    this.achats.push({
      date: this.datepipe.transform(new Date(), 'yyyy-MM-dd')!,
      quantite: undefined,
      prix: undefined,
      revendu: false
    });
    this.decorerAchats();
  }

  private decorerAchats() {
    let i = 0;
    this.achatsDecores = this.achats
      .sort((a1, a2) => new Date(a1.date).getTime() - new Date(a2.date).getTime())
      .map(achat => new AchatDecore(i++, new Date(achat.date), achat));
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

  onSelectDate(achatDecore: AchatDecore) {
    achatDecore.achat.date = this.datepipe.transform(achatDecore.date, 'yyyy-MM-dd')!;
  }
}
