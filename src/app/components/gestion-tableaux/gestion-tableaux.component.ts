import {Component, OnInit} from '@angular/core';
import {TableauxService} from '../../services/tableaux/tableaux.service';
import {DTOTableaux} from '../../services/tableaux/dto-tableaux.interface';
import {TableauComponent} from './tableau/tableau.component';
import {TypesColonnes} from '../../services/tableaux/types-colonnes.enum.ts';

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

  constructor(private tableauxService: TableauxService) {
  }

  ngOnInit(): void {
    this.tableaux = this.tableauxService.charger();
  }

  protected readonly TypesColonnes = TypesColonnes;
}
