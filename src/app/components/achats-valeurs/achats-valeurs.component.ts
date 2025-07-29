import {Component, OnInit} from '@angular/core';
import {ValeursService} from '../../services/valeurs/valeurs.service';
import {AchatsTicker} from '../../services/valeurs/achats-ticker.interface';
import {DTOValeur} from '../../services/valeurs/dto-valeur.interface';
import {AchatsValeurDecores} from './achats-valeur-decores.class';
import {AchatDecore} from '../valeurs/details-valeur/achats-valeur/achat-decore.class';

// TODO : déplacer ImportExportComponent dans achars-valeur ici
@Component({
  selector: 'app-achats-valeurs',
  imports: [],
  templateUrl: './achats-valeurs.component.html',
  styleUrl: './achats-valeurs.component.sass'
})
export class AchatsValeursComponent implements OnInit {

  // données pour la vue
  achatsValeursDecores?: Array<AchatsValeurDecores>;

  private valeurByTicker?: Map<string, DTOValeur>;
  private achatsTickers?: Array<AchatsTicker>;

  constructor(private valeursService: ValeursService) {
  }

  ngOnInit(): void {
    this.valeursService.chargerValeurs().subscribe(valeurs => {
      this.valeurByTicker = new Map<string, DTOValeur>();
      valeurs.forEach(valeur => this.valeurByTicker!.set(valeur.ticker, valeur));
      this.achatsTickers = this.valeursService.chargerAchats();
      this.decorerAchats();
    });
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
        return new AchatsValeurDecores(i++, valeur, achatDecores);
      })
      .sort((a1, a2) => a1.valeur.libelle.localeCompare(a2.valeur.libelle));
  }
}
