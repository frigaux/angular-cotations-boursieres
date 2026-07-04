import {Component, OnDestroy, OnInit} from '@angular/core';
import {TableauxService} from '../../../services/tableaux/tableaux.service';
import {DTOTableaux} from '../../../services/tableaux/dto-tableaux.interface';
import {ConfigurationTableauComponent} from './configuration-tableau/configuration-tableau.component';
import {TypesColonnes} from '../../../services/tableaux/types-colonnes.enum.ts';
import {TranslatePipe, TranslateService} from '@ngx-translate/core';
import {Card} from 'primeng/card';
import {DialogImportExportComponent} from './dialog-import-export/dialog-import-export.component';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-gestion-tableaux',
  imports: [
    ConfigurationTableauComponent,
    TranslatePipe,
    Card,
    DialogImportExportComponent
  ],
  templateUrl: './gestion-tableaux.component.html',
  styleUrls: ['./gestion-tableaux.component.sass', '../../commun/titre.sass']
})
export class GestionTableauxComponent implements OnInit, OnDestroy {
  // données pour la vue
  tableaux?: DTOTableaux;
  protected readonly TypesColonnes = TypesColonnes;
  erreur?: string;
  succes?: string;

  private onImportTableaux?: Subscription;

  constructor(private translateService: TranslateService,
              private tableauxService: TableauxService) {
  }

  ngOnInit(): void {
    this.tableaux = this.tableauxService.charger();
    this.onImportTableaux = this.tableauxService.onImport(tableaux => this.tableaux = tableaux);
  }

  ngOnDestroy(): void {
    this.onImportTableaux?.unsubscribe();
  }

  enregistrer() {
    this.erreur = this.tableauxService.enregistrer(this.tableaux!);
    if (this.erreur === undefined) {
      this.succes = this.translateService.instant('COMPOSANTS.PARAMETRAGE.GESTION_TABLEAUX.ENREGISTREMENT_REUSSI');
      setTimeout(() => this.succes = undefined, 2000);
    }
  }
}
