import {Component, OnInit} from '@angular/core';
import {TableauxService} from '../../services/tableaux/tableaux.service';
import {DTOTableaux} from '../../services/tableaux/dto-tableaux.interface';
import {TableauComponent} from './tableau/tableau.component';
import {TypeColonnePortefeuille} from '../../services/tableaux/type-colonne-portefeuille.enum';

@Component({
  selector: 'app-gestion-tableaux',
  imports: [
    TableauComponent
  ],
  templateUrl: './gestion-tableaux.component.html',
  styleUrl: './gestion-tableaux.component.sass'
})
export class GestionTableauxComponent implements OnInit {
  tableaux?: DTOTableaux;
  typeColonnesPortefeuille?: TypeColonnePortefeuille[];

  constructor(private tableauxService: TableauxService) {
  }

  ngOnInit(): void {
    this.tableaux = this.tableauxService.charger();
    this.typeColonnesPortefeuille = [TypeColonnePortefeuille.DATE,
      TypeColonnePortefeuille.MARCHE,
      TypeColonnePortefeuille.TICKER,
      TypeColonnePortefeuille.LIBELLE,
      TypeColonnePortefeuille.OUVERTURE,
      TypeColonnePortefeuille.PLUS_HAUT,
      TypeColonnePortefeuille.PLUS_BAS,
      TypeColonnePortefeuille.CLOTURE,
      TypeColonnePortefeuille.VOLUME,
      TypeColonnePortefeuille.ALERTES,
      TypeColonnePortefeuille.COURS,
      TypeColonnePortefeuille.MOYENNE_MOBILE,
      TypeColonnePortefeuille.VARIATION];
    // this.typeColonnesPortefeuille = Object.keys(TypeColonnePortefeuille).filter(v => isNaN(Number(v)));
  }
}
