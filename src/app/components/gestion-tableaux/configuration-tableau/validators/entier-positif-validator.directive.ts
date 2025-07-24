import {Directive} from '@angular/core';
import {AbstractControl, NG_VALIDATORS, ValidationErrors, Validator,} from '@angular/forms';

@Directive({
  selector: '[appEntierPositif]',
  providers: [{provide: NG_VALIDATORS, useExisting: EntierPositifValidatorDirective, multi: true}],
})
export class EntierPositifValidatorDirective implements Validator {
  validate(control: AbstractControl): ValidationErrors | null {
    const value = Number(control.value);
    return isNaN(value) || value < 1
      ? {entierPositif: {valeur: value}}
      : null;
  }
}
