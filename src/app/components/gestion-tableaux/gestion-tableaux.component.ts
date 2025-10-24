import {Component, OnInit} from '@angular/core';
import {TableauxService} from '../../services/tableaux/tableaux.service';
import {DTOTableaux} from '../../services/tableaux/dto-tableaux.interface';
import {ConfigurationTableauComponent} from './configuration-tableau/configuration-tableau.component';
import {TypesColonnes} from '../../services/tableaux/types-colonnes.enum.ts';
import {TranslatePipe, TranslateService} from '@ngx-translate/core';
import {Card} from 'primeng/card';
import {DialogImportExportComponent} from './dialog-import-export/dialog-import-export.component';

@Component({
  selector: 'app-gestion-tableaux',
  imports: [
    ConfigurationTableauComponent,
    TranslatePipe,
    Card,
    DialogImportExportComponent
  ],
  templateUrl: './gestion-tableaux.component.html',
  styleUrl: './gestion-tableaux.component.sass'
})
export class GestionTableauxComponent implements OnInit {
  // données pour la vue
  tableaux?: DTOTableaux;
  protected readonly TypesColonnes = TypesColonnes;
  erreur?: string;
  succes?: string;

  constructor(private translateService: TranslateService,
              private tableauxService: TableauxService) {
  }

  ngOnInit(): void {
    this.tableaux = this.tableauxService.charger();
    this.tableauxService.onImport(tableaux => this.tableaux = tableaux);
  }

  enregistrer() {
    this.erreur = this.tableauxService.enregistrer(this.tableaux!);
    if (this.erreur === undefined) {
      this.succes = this.translateService.instant('COMPOSANTS.GESTION_TABLEAUX.ENREGISTREMENT_REUSSI');
      setTimeout(() => this.succes = undefined, 2000);
    }
  }
}
