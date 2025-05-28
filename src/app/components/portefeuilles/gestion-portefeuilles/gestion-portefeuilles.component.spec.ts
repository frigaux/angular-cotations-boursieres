import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionPortefeuillesComponent } from './gestion-portefeuilles.component';
import {ValeursService} from '../../../services/valeurs/valeurs.service';
import {TranslateModule} from '@ngx-translate/core';

describe('GestionPortefeuillesComponent', () => {
  let component: GestionPortefeuillesComponent;
  let fixture: ComponentFixture<GestionPortefeuillesComponent>;

  const mockValeursService = jasmine.createSpyObj('ValeursService', ['chargerValeurs']);

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        GestionPortefeuillesComponent,
        TranslateModule.forRoot({})
      ],
      providers: [
        {provide: ValeursService, useValue: mockValeursService}
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GestionPortefeuillesComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
