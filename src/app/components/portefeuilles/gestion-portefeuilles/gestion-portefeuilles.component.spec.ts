import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionPortefeuillesComponent } from './gestion-portefeuilles.component';

describe('GestionPortefeuillesComponent', () => {
  let component: GestionPortefeuillesComponent;
  let fixture: ComponentFixture<GestionPortefeuillesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GestionPortefeuillesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GestionPortefeuillesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
