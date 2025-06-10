import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditeurConditionAlerteComponent } from './editeur-condition-alerte.component';
import {TranslateModule} from '@ngx-translate/core';

describe('EditeurConditionAlerteComponent', () => {
  let component: EditeurConditionAlerteComponent;
  let fixture: ComponentFixture<EditeurConditionAlerteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        EditeurConditionAlerteComponent,
        TranslateModule.forRoot({})
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditeurConditionAlerteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
