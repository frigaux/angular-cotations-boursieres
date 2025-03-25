import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PortefeuillesComponent } from './portefeuilles.component';

describe('PortefeuillesComponent', () => {
  let component: PortefeuillesComponent;
  let fixture: ComponentFixture<PortefeuillesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PortefeuillesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PortefeuillesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
