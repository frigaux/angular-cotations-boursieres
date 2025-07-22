import {FormControl} from '@angular/forms';
import {pasDeNomEnDoublonValidator} from './pas-de-nom-en-doublon.validator';
import {TABLEAUX} from '../../../../services/jdd/jdd-tableaux.dataset';

describe('pasDeNomEnDoublonValidator', () => {
  let validator: Function;
  let control: FormControl;

  beforeEach(() => {
    validator = pasDeNomEnDoublonValidator({colonnes: TABLEAUX.portefeuille.colonnesPaysage, colonne: TABLEAUX.portefeuille.colonnesPaysage[0]});
    control = new FormControl();
  });

  it('Given un validator initialisé when on valide un nom de colonne inexistant then le validator renvoie null', () => {
    control.setValue('nomUnique');
    expect(validator(control)).toBeNull();
  });

  it('Given un validator initialisé when on valide un nom de colonne déjà existant then le validator renvoie une erreur', () => {
    control.setValue(TABLEAUX.portefeuille.colonnesPaysage[1].nom);
    expect(validator(control)).toEqual({doublon: {nom: control.value}});
  });
});
