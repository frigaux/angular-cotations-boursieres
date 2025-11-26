import {ComponentFixture, TestBed} from '@angular/core/testing';

import {DialogAchatsValeurComponent} from './dialog-achats-valeur.component';
import {TranslateModule} from '@ngx-translate/core';

describe('DialogAchatsValeurComponent', () => {
  let component: DialogAchatsValeurComponent;
  let fixture: ComponentFixture<DialogAchatsValeurComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        DialogAchatsValeurComponent,
        TranslateModule.forRoot({})
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(DialogAchatsValeurComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
