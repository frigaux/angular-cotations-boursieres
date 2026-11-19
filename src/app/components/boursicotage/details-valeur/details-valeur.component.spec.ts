import {ComponentFixture, TestBed} from '@angular/core/testing';

import {DetailsValeurComponent} from './details-valeur.component';
import {TranslateModule} from '@ngx-translate/core';
import {provideAnimations} from '@angular/platform-browser/animations';
import {ConfirmationService} from 'primeng/api';
import {ValeursService} from '../../../services/valeurs/valeurs.service';
import {DatePipe} from '@angular/common';

describe('DetailsValeurComponent', () => {
  let component: DetailsValeurComponent;
  let fixture: ComponentFixture<DetailsValeurComponent>;

  const mockValeursService = jasmine.createSpyObj('ValeursService', ['chargerAchatsTicker']);

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        DetailsValeurComponent,
        TranslateModule.forRoot({})
      ],
      providers: [
        provideAnimations(),
        ConfirmationService,
        {provide: ValeursService, useValue: mockValeursService},
        DatePipe
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(DetailsValeurComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
