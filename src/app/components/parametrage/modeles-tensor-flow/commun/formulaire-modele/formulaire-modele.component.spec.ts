import {ComponentFixture, TestBed} from '@angular/core/testing';

import {FormulaireModeleComponent} from './formulaire-modele.component';
import {TranslateModule} from '@ngx-translate/core';
import {ParametresModele} from './parametres-modele.interface';

describe('FormulaireModeleComponent', () => {
  let component: FormulaireModeleComponent;
  let fixture: ComponentFixture<FormulaireModeleComponent>;

  const mockParametres: ParametresModele = {
    tauxApprentissage: 0.01,
    optimiseur: 'adam',
    fonctionsPertes: ['meanSquaredError'],
    metriques: ['meanAbsoluteError'],
    iterations: 100,
    lot: 32
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        FormulaireModeleComponent,
        TranslateModule.forRoot({})
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormulaireModeleComponent);
    component = fixture.componentInstance;

    // Initialisation du model()
    fixture.componentRef.setInput('parametres', mockParametres);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeDefined();
  });
});
