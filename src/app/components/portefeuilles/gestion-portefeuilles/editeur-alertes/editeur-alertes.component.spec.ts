import {ComponentFixture, TestBed} from '@angular/core/testing';

import {EditeurAlertesComponent} from './editeur-alertes.component';
import {TranslateModule} from '@ngx-translate/core';
import {ConfirmationService} from 'primeng/api';

describe('EditeurAlertesComponent', () => {
  let component: EditeurAlertesComponent;
  let fixture: ComponentFixture<EditeurAlertesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        EditeurAlertesComponent,
        TranslateModule.forRoot({})
      ],
      providers: [
        {provide: ConfirmationService}
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(EditeurAlertesComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeDefined();
  });
});
