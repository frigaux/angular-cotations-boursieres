import {ComponentFixture, TestBed} from '@angular/core/testing';

import {SauvegardeRestaurationComponent} from './sauvegarde-restauration.component';
import {TranslateModule} from '@ngx-translate/core';
import {ConfirmationService} from 'primeng/api';

describe('SauvegardeRestaurationComponent', () => {
  let component: SauvegardeRestaurationComponent;
  let fixture: ComponentFixture<SauvegardeRestaurationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        SauvegardeRestaurationComponent,
        TranslateModule.forRoot({})
      ],
      providers: [
        ConfirmationService
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
