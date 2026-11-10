import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogAproposComponent } from './dialog-apropos.component';
import {TranslateModule} from '@ngx-translate/core';

describe('DialogAproposComponent', () => {
  let component: DialogAproposComponent;
  let fixture: ComponentFixture<DialogAproposComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DialogAproposComponent, TranslateModule.forRoot({})]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DialogAproposComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
