import {ComponentFixture, TestBed} from '@angular/core/testing';

import {PortefeuillesComponent} from './portefeuilles.component';
import {TranslateModule} from '@ngx-translate/core';
import {ValeursService} from '../../services/valeurs/valeurs.service';

describe('PortefeuillesComponent', () => {
  let component: PortefeuillesComponent;
  let fixture: ComponentFixture<PortefeuillesComponent>;

  const mockValeursService = jasmine.createSpyObj('ValeursService', ['chargerValeurs']);

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        PortefeuillesComponent,
        TranslateModule.forRoot({})
      ],
      providers: [
        {provide: ValeursService, useValue: mockValeursService}
      ]
    });

    fixture = TestBed.createComponent(PortefeuillesComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeDefined();
  });
});
