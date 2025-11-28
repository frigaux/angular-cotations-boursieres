import {AbstractControl, ValidationErrors, ValidatorFn} from '@angular/forms';
import {ValidatorInput} from './validator-input.interface';

export function pasDeNomEnDoublonValidator(input: ValidatorInput | undefined): ValidatorFn {
  return (parametres: AbstractControl): ValidationErrors | null => {
    if (input === undefined) {
      return null;
    } else {
      const isDuplicate = input.colonnes
        .filter(c => c !== input.colonne)
        .find(
          colonne => colonne.nom.localeCompare(parametres.value, undefined, {sensitivity: 'base'}) === 0
        ) !== undefined;
      return isDuplicate ? {doublon: {nom: parametres.value}} : null;
    }
  };
}
