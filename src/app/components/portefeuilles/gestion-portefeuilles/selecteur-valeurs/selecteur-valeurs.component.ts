import {Component, input, InputSignal, output} from '@angular/core';
import {NgIf} from "@angular/common";
import {PickList} from "primeng/picklist";
import {DTOValeur} from '../../../../services/valeurs/dto-valeur.interface';
import {ValeursService} from '../../../../services/valeurs/valeurs.service';
import {TranslatePipe, TranslateService} from '@ngx-translate/core';
import {DTOPortefeuille} from '../dto-portefeuille.interface';
import {Dialog} from 'primeng/dialog';
import {Button} from 'primeng/button';
import {LoaderComponent} from '../../../loader/loader.component';

@Component({
  selector: 'app-selecteur-valeurs',
  imports: [
    NgIf,
    PickList,
    TranslatePipe,
    Dialog,
    Button,
    LoaderComponent
  ],
  templateUrl: './selecteur-valeurs.component.html',
  styleUrl: './selecteur-valeurs.component.sass'
})
export class SelecteurValeursComponent {
  // chargement des valeurs
  loading: boolean = true;

  // input/output
  portefeuille: InputSignal<DTOPortefeuille | undefined> = input(undefined,
    {transform: o => this.intercepteurPortefeuille(o)});
  modifie = output<string[]>();
  abandon = output<void>();

  // données pour la vue
  portefeuilleEnModification: DTOPortefeuille | undefined;
  titre: string | undefined;
  valeursSource: DTOValeur[] = [];
  valeursTarget: DTOValeur[] = [];

  constructor(private valeursService: ValeursService,
              private translateService: TranslateService) {
  }

  private intercepteurPortefeuille(portefeuille: DTOPortefeuille | undefined) {
    this.portefeuilleEnModification = portefeuille;
    if (this.portefeuilleEnModification) {
      this.titre = this.translateService.instant('COMPOSANTS.PORTEFEUILLES.GESTION_PORTEFEUILLES.SELECTEUR_VALEURS.MODIFICATION_PORTEFEUILLE', {'nom': this.portefeuilleEnModification.nom});
      this.initPicklist(this.portefeuilleEnModification);
    }
    return portefeuille;
  }

  initPicklist(portefeuille: DTOPortefeuille): void {
    this.valeursService.chargerValeurs().subscribe(valeurs => {
      this.valeursSource = valeurs.filter(valeur => !portefeuille!.tickers.includes(valeur.ticker));
      this.valeursTarget = valeurs.filter(valeur => portefeuille!.tickers.includes(valeur.ticker));
      this.loading = false;
    });
  }

  modifierValeursPortefeuille() {
    this.modifie.emit(this.valeursTarget.map(valeur => valeur.ticker));
  }
}
