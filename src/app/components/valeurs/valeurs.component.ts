import {Component, inject, OnInit} from '@angular/core';
import {ValeursService} from '../../services/valeurs/valeurs.service';
import {TableModule} from 'primeng/table';
import {CommonModule} from '@angular/common';
import {TranslatePipe, TranslateService} from '@ngx-translate/core';
import {Select} from 'primeng/select';
import {Valeur} from './Valeur';
import {Marche} from '../../services/valeurs/marche';
import { ScrollPanelModule } from 'primeng/scrollpanel';
import {ValeurComponent} from './valeur/valeur.component';

@Component({
  selector: 'app-valeurs',
  imports: [TableModule, CommonModule, TranslatePipe, Select, ScrollPanelModule, ValeurComponent],
  templateUrl: './valeurs.component.html',
  styleUrl: './valeurs.component.sass'
})
export class ValeursComponent implements OnInit {
  // chargement des cours
  loading: boolean = true;
  // données pour la vue
  valeurs!: Valeur[];
  marches!: any[];
  // ticker pour lequel afficher les détails
  ticker : string | undefined = undefined;

  private translateService = inject(TranslateService);

  constructor(private valeursService: ValeursService) {
  }

  ngOnInit(): void {
    this.marches = Object.values(Marche)
      .map(marche => {
        const libelle: string = this.translateService.instant('ENUMERATIONS.MARCHE.' + marche);
        return {libelle, valeur: libelle};
      });
    this.valeursService.chargerValeurs().subscribe(valeurs => {
      this.valeurs = valeurs.map(valeur => new Valeur(valeur, this.translateService));
      this.loading = false;
    });
  }
}
