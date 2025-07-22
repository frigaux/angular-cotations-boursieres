import {TestBed} from '@angular/core/testing';
import {FormControl} from '@angular/forms';
import {EntierPositifValidatorDirective} from './entier-positif-validator.directive';

describe('EntierPositifValidatorDirective', () => {
  let validator: EntierPositifValidatorDirective;
  let control: FormControl;

  beforeEach(() => {
    control = new FormControl();
    TestBed.runInInjectionContext(() => {
      validator = new EntierPositifValidatorDirective();
    });
  });

  it('Given un validator initialisé when on valide un parametre valide then le validator renvoie null', () => {
    control.setValue(1);
    expect(validator.validate(control)).toBeNull();
  });

  it('Given un validator initialisé when on valide un parametre invalide then le validator renvoie une erreur', () => {
    control.setValue(0);
    expect(validator.validate(control)).toEqual({entierPositif: {valeur: control.value}});
  });
});
