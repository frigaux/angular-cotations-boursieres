import {pasDeNomEnDoublonValidator} from './pas-de-nom-en-doublon.validator';
import {FormControl} from '@angular/forms';

describe('pasDeNomEnDoublonValidator', () => {
  let validator: Function
  let control: FormControl
  const NOM: string = 'Spéculation'

  beforeEach(async () => {
    validator = pasDeNomEnDoublonValidator([{'nom': NOM, tickers: []}])
    control = new FormControl()
  });

  it('Given un validator initialisé when on valide un nom de portefeuille inexistant then le validator renvoie null', () => {
    control.setValue('cac40')
    expect(validator(control)).toBeNull()
  });

  it('Given un validator initialisé when on valide un nom de portefeuille déjà existant then le validator renvoie une erreur', () => {
    control.setValue(NOM)
    expect(validator(control)).toEqual({duplicateValue: {value: control.value}})
  });
});
