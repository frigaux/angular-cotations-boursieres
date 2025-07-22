import {Component, OnInit} from '@angular/core';
import {TableauxService} from '../../services/tableaux/tableaux.service';
import {DTOTableaux} from '../../services/tableaux/dto-tableaux.interface';
import {TableauComponent} from './tableau/tableau.component';
import {TypesColonnes} from '../../services/tableaux/types-colonnes.enum.ts';
import {TranslatePipe} from '@ngx-translate/core';
import {Card} from 'primeng/card';
import {NgIf} from '@angular/common';

@Component({
  selector: 'app-gestion-tableaux',
  imports: [
    TableauComponent,
    TranslatePipe,
    Card,
    NgIf
  ],
  templateUrl: './gestion-tableaux.component.html',
  styleUrl: './gestion-tableaux.component.sass'
})
export class GestionTableauxComponent implements OnInit {
  // données pour la vue
  tableaux?: DTOTableaux;
  protected readonly TypesColonnes = TypesColonnes;
  erreur: string | undefined;

  constructor(private tableauxService: TableauxService) {
  }

  ngOnInit(): void {
    this.tableaux = this.tableauxService.charger();
  }

  enregistrer() {
    this.erreur = this.tableauxService.enregistrer(this.tableaux!);
  }
}
