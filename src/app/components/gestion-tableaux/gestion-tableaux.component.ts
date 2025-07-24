import {Component, OnInit} from '@angular/core';
import {TableauxService} from '../../services/tableaux/tableaux.service';
import {DTOTableaux} from '../../services/tableaux/dto-tableaux.interface';
import {ConfigurationTableauComponent} from './configuration-tableau/configuration-tableau.component';
import {TypesColonnes} from '../../services/tableaux/types-colonnes.enum.ts';
import {TranslatePipe} from '@ngx-translate/core';
import {Card} from 'primeng/card';
import {NgIf} from '@angular/common';
import {ImportExportComponent} from './import-export/import-export.component';
import {DTOColonne} from '../../services/tableaux/dto-colonne-portefeuille.interface';

@Component({
  selector: 'app-gestion-tableaux',
  imports: [
    ConfigurationTableauComponent,
    TranslatePipe,
    Card,
    NgIf,
    ImportExportComponent
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
    this.tableauxService.onImport(tableaux => this.tableaux = tableaux);
  }

  enregistrer() {
    this.erreur = this.tableauxService.enregistrer(this.tableaux!);
  }
}
