import {PasDeNomEnDoubleValidatorDirective} from './pas-de-nom-en-double-validator.directive';
import {TestBed} from '@angular/core/testing';
import {TABLEAUX} from '../../../../services/jdd/jdd-tableaux.dataset';
import {FormControl} from '@angular/forms';
import {input} from '@angular/core';
import {DTOColonne} from '../../../../services/tableaux/dto-colonne-portefeuille.interface';
import {TypesColonnesPortefeuille} from '../../../../services/tableaux/types-colonnes-portefeuille.enum';
import {TypesColonnesCours} from '../../../../services/tableaux/types-colonnes-cours.enum';

describe('PasDeNomEnDoubleValidatorDirective', () => {
  let validator: PasDeNomEnDoubleValidatorDirective;
  let control: FormControl;

  beforeEach(() => {
    control = new FormControl();
    TestBed.runInInjectionContext(() => {
      validator = new PasDeNomEnDoubleValidatorDirective();
      validator.colonnes = input<DTOColonne<TypesColonnesPortefeuille | TypesColonnesCours>[]>(TABLEAUX.portefeuille.colonnesPaysage);
    });
  });

  it('Given un validator initialisé when on valide un nom de colonne inexistant then le validator renvoie null', () => {
    control.setValue('nomUnique');
    expect(validator.validate(control)).toBeNull();
  });

  it('Given un validator initialisé when on valide un nom de colonne déjà existant then le validator renvoie une erreur', () => {
    control.setValue(TABLEAUX.portefeuille.colonnesPaysage[0].nom);
    expect(validator.validate(control)).toEqual({doublon: {nom: control.value}});
  });
});
