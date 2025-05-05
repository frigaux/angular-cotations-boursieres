import {Component, inject, OnInit} from '@angular/core';
import {ValeursService} from '../../services/valeurs/valeurs.service';
import {TableModule} from 'primeng/table';
import {CommonModule} from '@angular/common';
import {TranslatePipe, TranslateService} from '@ngx-translate/core';
import {Marche} from '../../services/valeurs/marche';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {Select} from 'primeng/select';
import {Valeur} from './Valeur';

@Component({
  selector: 'app-valeurs',
  imports: [TableModule, CommonModule, TranslatePipe, FormsModule, ReactiveFormsModule, Select],
  templateUrl: './valeurs.component.html',
  styleUrl: './valeurs.component.sass'
})
export class ValeursComponent implements OnInit {
  valeurs!: Valeur[];
  loading: boolean = true;
  marches!: any[];
  private translateService = inject(TranslateService);

  constructor(private valeursService: ValeursService) {
  }

  ngOnInit(): void {
    this.marches = [
      {libelle: 'Euronext A', valeur: 'Euronext A'},
      {libelle: 'Euronext B', valeur: 'Euronext B'},
      {libelle: 'Euronext C', valeur: 'Euronext C'}
    ];
    this.valeursService.getValeurs().subscribe({
      next: valeurs => {
        this.valeurs = valeurs.map(valeur => new Valeur(valeur, this.translateService));
        this.loading = false;
      }
    });
  }
}
