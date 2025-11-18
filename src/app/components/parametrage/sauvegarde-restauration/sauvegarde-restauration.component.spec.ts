import {ComponentFixture, TestBed} from '@angular/core/testing';

import {SauvegardeRestaurationComponent} from './sauvegarde-restauration.component';
import {TranslateModule} from '@ngx-translate/core';
import {ParametrageService} from '../../../services/parametrage/parametrage.service';

describe('SauvegardeRestaurationComponent', () => {
  let component: SauvegardeRestaurationComponent;
  let fixture: ComponentFixture<SauvegardeRestaurationComponent>;

  const mockParametrageService = jasmine.createSpyObj('ParametrageService', ['chargerUrlSauvegardeRestauration', 'sauvegarder', 'restaurer']);

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        SauvegardeRestaurationComponent,
        TranslateModule.forRoot({})
      ],
      providers: [
        {provide: ParametrageService, useValue: mockParametrageService}
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(SauvegardeRestaurationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeDefined();
  });
});
