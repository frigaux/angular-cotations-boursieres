import {Component, input, InputSignal, OnInit} from '@angular/core';
import {DTOColonne} from '../../../services/tableaux/dto-colonne-portefeuille.interface';
import {TypeColonnePortefeuille} from '../../../services/tableaux/type-colonne-portefeuille.enum';
import {TranslatePipe} from '@ngx-translate/core';
import {TableauxService} from '../../../services/tableaux/tableaux.service';
import {TypeColonneCours} from '../../../services/tableaux/type-colonne-cours.enum';
import {FloatLabel} from 'primeng/floatlabel';
import {InputText} from 'primeng/inputtext';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {AutoFocus} from 'primeng/autofocus';
import {Select} from 'primeng/select';
import {identity} from 'rxjs';
import {ToggleSwitch} from 'primeng/toggleswitch';

@Component({
  selector: 'app-tableau',
  imports: [
    TranslatePipe,
    FloatLabel,
    InputText,
    ReactiveFormsModule,
    AutoFocus,
    FormsModule,
    Select,
    ToggleSwitch
  ],
  templateUrl: './tableau.component.html',
  styleUrl: './tableau.component.sass'
})
export class TableauComponent implements OnInit {
  // input/output
  inputColonnes: InputSignal<DTOColonne<TypeColonnePortefeuille | TypeColonneCours>[] | undefined> = input(undefined,
    {transform: o => this.intercepteurColonnes(o), alias: 'colonnes'});
  inputTypesColonnes: InputSignal<(TypeColonnePortefeuille | TypeColonneCours)[] | undefined> = input(undefined,
    {transform: o => this.intercepteurTypeColonnes(o), alias: 'typesColonnes'});

  // données pour la vue
  colonnes: DTOColonne<TypeColonnePortefeuille | TypeColonneCours>[] = [];
  typesColonnes: (TypeColonnePortefeuille | TypeColonneCours)[] = [];
  typesDisponibles: (TypeColonnePortefeuille | TypeColonneCours)[] = [];

  constructor(private tableauxService: TableauxService) {
  }

  private intercepteurColonnes<T extends TypeColonnePortefeuille | TypeColonneCours>(colonnes: DTOColonne<T>[] | undefined) {
    this.colonnes = colonnes || [];
    return colonnes;
  }

  private intercepteurTypeColonnes(typesColonnes: (TypeColonnePortefeuille | TypeColonneCours)[] | undefined) {
    this.typesColonnes = typesColonnes || [];
    return typesColonnes;
  }

  ngOnInit(): void {
    this.calculerTypesDisponibles();
  }

  ajouterColonne() {
    this.colonnes.push({
      nom: '',
      type: this.typesDisponibles[0],
      tri: false,
      largeur: this.calculerLargeurDisponible()
    });
    this.calculerTypesDisponibles();
  }

  private calculerTypesDisponibles(): void {
    const typesUtilises = this.colonnes
      .filter(colonne => !this.tableauxService.colonneAvecParametre(colonne))
      .map(colonne => colonne.type);
    this.typesDisponibles = this.typesColonnes.filter(type => !typesUtilises.includes(type));
  }

  private calculerLargeurDisponible(): number {
    return 100 - this.colonnes.reduce((accumulator, colonne) => accumulator + colonne.largeur, 0);
  }

  typesDisponiblesColonne(colonne: DTOColonne<TypeColonnePortefeuille | TypeColonneCours>): (TypeColonnePortefeuille | TypeColonneCours)[] {
    return this.typesDisponibles.concat(colonne.type);
  }

  protected readonly identity = identity;
}
