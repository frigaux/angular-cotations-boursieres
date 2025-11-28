import {ComponentFixture, TestBed} from '@angular/core/testing';

import {ConfigurationPortefeuilleComponent} from './configuration-portefeuille.component';

describe('ConfigurationPortefeuilleComponent', () => {
  let component: ConfigurationPortefeuilleComponent;
  let fixture: ComponentFixture<ConfigurationPortefeuilleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfigurationPortefeuilleComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConfigurationPortefeuilleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeDefined();
  });
});
