import {ComponentFixture, TestBed} from '@angular/core/testing';

import {FormulaireModeleComponent} from './formulaire-modele.component';

describe('FormulaireModeleComponent', () => {
  let component: FormulaireModeleComponent;
  let fixture: ComponentFixture<FormulaireModeleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormulaireModeleComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormulaireModeleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeDefined();
  });
});
