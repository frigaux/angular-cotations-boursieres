import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionTableauxComponent } from './gestion-tableaux.component';

describe('GestionTableauxComponent', () => {
  let component: GestionTableauxComponent;
  let fixture: ComponentFixture<GestionTableauxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GestionTableauxComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GestionTableauxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
