import {pasDeNomEnDoublonValidator} from './pas-de-nom-en-doublon.validator';
import {FormControl} from '@angular/forms';
import {PORTEFEUILLES} from '../../../services/jdd/jdd-portefeuilles.dataset';

describe('pasDeNomEnDoublonValidator', () => {
  let validator: Function;
  let control: FormControl;

  beforeEach(async () => {
    validator = pasDeNomEnDoublonValidator(PORTEFEUILLES);
    control = new FormControl();
  });

  it('Given un validator initialisé when on valide un nom de portefeuille inexistant then le validator renvoie null', () => {
    control.setValue('nomUnique');
    expect(validator(control)).toBeNull();
  });

  it('Given un validator initialisé when on valide un nom de portefeuille déjà existant then le validator renvoie une erreur', () => {
    control.setValue(PORTEFEUILLES[0].nom);
    expect(validator(control)).toEqual({doublon: {nom: control.value}});
  });
});
