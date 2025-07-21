import {Directive, input} from '@angular/core';
import {AbstractControl, NG_VALIDATORS, ValidationErrors, Validator,} from '@angular/forms';
import {DTOColonne} from '../../../../services/tableaux/dto-colonne-portefeuille.interface';
import {TypesColonnesPortefeuille} from '../../../../services/tableaux/types-colonnes-portefeuille.enum';
import {TypesColonnesCours} from '../../../../services/tableaux/types-colonnes-cours.enum';
import {pasDeNomEnDoublonValidator} from './pas-de-nom-en-doublon.validator'

@Directive({
  selector: '[appPasDeNomEnDoublon]',
  providers: [{provide: NG_VALIDATORS, useExisting: PasDeNomEnDoubleValidatorDirective, multi: true}],
})
export class PasDeNomEnDoubleValidatorDirective implements Validator {
  colonnes = input<DTOColonne<TypesColonnesPortefeuille | TypesColonnesCours>[]>([], {alias: 'appPasDeNomEnDoublon'});

  validate(control: AbstractControl): ValidationErrors | null {
    return this.colonnes
      ? pasDeNomEnDoublonValidator(this.colonnes())(control)
      : null;
  }
}
