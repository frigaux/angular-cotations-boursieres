import {AbstractControl, ValidationErrors, ValidatorFn} from '@angular/forms';
import {DTOColonne} from '../../../../services/tableaux/dto-colonne-portefeuille.interface';
import {TypesColonnesPortefeuille} from '../../../../services/tableaux/types-colonnes-portefeuille.enum';
import {TypesColonnesCours} from '../../../../services/tableaux/types-colonnes-cours.enum';

export function pasDeNomEnDoublonValidator(colonnes: DTOColonne<TypesColonnesPortefeuille | TypesColonnesCours>[]): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const isDuplicate = colonnes.find(
      colonne => colonne.nom.localeCompare(control.value, undefined, {sensitivity: 'base'}) === 0
    ) !== undefined;
    return isDuplicate ? {doublon: {nom: control.value}} : null;
  };
}
