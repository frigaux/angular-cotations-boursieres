import {Component, OnInit} from '@angular/core';
import {NgIf} from "@angular/common";
import {PickList} from "primeng/picklist";
import {DTOValeur} from '../../../../services/valeurs/dto-valeur.interface';
import {ValeursService} from '../../../../services/valeurs/valeurs.service';
import {ProgressBar} from 'primeng/progressbar';
import {TranslatePipe} from '@ngx-translate/core';

@Component({
  selector: 'app-selecteur-valeurs',
  imports: [
    NgIf,
    PickList,
    ProgressBar,
    TranslatePipe
  ],
  templateUrl: './selecteur-valeurs.component.html',
  styleUrl: './selecteur-valeurs.component.sass'
})
export class SelecteurValeursComponent implements OnInit {
  private static readonly PORTEFEUILLE: string = 'portefeuille';

  // chargement des valeurs
  loading: boolean = true;

  // données pour la vue
  valeursSource: DTOValeur[] = [];
  valeursTarget: DTOValeur[] = [];

  constructor(private valeursService: ValeursService) {
  }

  ngOnInit(): void {
    let tickersSelectionnes: Array<string> = [];
    const json = window.localStorage.getItem(SelecteurValeursComponent.PORTEFEUILLE);
    if (json) {
      tickersSelectionnes = JSON.parse(json);
    }
    this.valeursService.chargerValeurs().subscribe(valeurs => {
      this.valeursSource = valeurs.filter(valeur => !tickersSelectionnes.includes(valeur.ticker));
      this.valeursTarget = valeurs.filter(valeur => tickersSelectionnes.includes(valeur.ticker));
      this.loading = false;
    });
  }

  onMove() {
    const tickers = this.valeursTarget.map(valeur => valeur.ticker);
    window.localStorage.setItem(SelecteurValeursComponent.PORTEFEUILLE, JSON.stringify(tickers));
  }
}
