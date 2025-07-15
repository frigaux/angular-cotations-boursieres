import {AbstractControl, ValidationErrors, ValidatorFn} from '@angular/forms';
import {DTOPortefeuille} from '../../../services/portefeuilles/dto-portefeuille.interface';

export function pasDeNomEnDoublonValidator(portefeuilles: Array<DTOPortefeuille>): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const isDuplicate = portefeuilles.find(
      portefeuille => portefeuille.nom.localeCompare(control.value, undefined, {sensitivity: 'base'}) === 0
    ) !== undefined;
    return isDuplicate ? {duplicateValue: {value: control.value}} : null;
  };
}
