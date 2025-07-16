import {Component, input, InputSignal} from '@angular/core';
import {DTOColonne} from '../../../services/tableaux/dto-colonne-portefeuille.interface';
import {TypeColonnePortefeuille} from '../../../services/tableaux/type-colonne-portefeuille.enum';

@Component({
  selector: 'app-tableau',
  imports: [],
  templateUrl: './tableau.component.html',
  styleUrl: './tableau.component.sass'
})
export class TableauComponent {
  // input/output
  inputColonnes: InputSignal<DTOColonne<TypeColonnePortefeuille>[] | undefined> = input(undefined,
    {transform: o => this.intercepteurColonnes(o), alias: 'colonnes'});

  // données pour la vue
  colonnes?: DTOColonne<TypeColonnePortefeuille>[];

  private intercepteurColonnes<T extends TypeColonnePortefeuille>(colonnes: DTOColonne<T>[] | undefined) {
    this.colonnes = colonnes;
    return colonnes;
  }
}
