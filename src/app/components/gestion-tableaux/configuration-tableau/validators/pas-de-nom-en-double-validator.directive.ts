import {Directive, input} from '@angular/core';
import {AbstractControl, NG_VALIDATORS, ValidationErrors, Validator,} from '@angular/forms';
import {pasDeNomEnDoublonValidator} from './pas-de-nom-en-doublon.validator'
import {ValidatorInput} from './validator-input.interface';

@Directive({
  selector: '[appPasDeNomEnDoublon]',
  providers: [{provide: NG_VALIDATORS, useExisting: PasDeNomEnDoubleValidatorDirective, multi: true}],
})
export class PasDeNomEnDoubleValidatorDirective implements Validator {
  parametres = input<ValidatorInput | undefined>(undefined, {alias: 'appPasDeNomEnDoublon'});

  validate(control: AbstractControl): ValidationErrors | null {
    return this.parametres
      ? pasDeNomEnDoublonValidator(this.parametres())(control)
      : null;
  }
}
