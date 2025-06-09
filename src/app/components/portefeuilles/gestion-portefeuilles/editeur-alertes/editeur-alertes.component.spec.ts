import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditeurAlertesComponent } from './editeur-alertes.component';
import {TranslateModule} from '@ngx-translate/core';

describe('EditeurAlertesComponent', () => {
  let component: EditeurAlertesComponent;
  let fixture: ComponentFixture<EditeurAlertesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        EditeurAlertesComponent,
        TranslateModule.forRoot({})
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditeurAlertesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeDefined();
  });
});
