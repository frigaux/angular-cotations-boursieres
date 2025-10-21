import {ComponentFixture, TestBed} from '@angular/core/testing';
import {DialogRestauration} from './dialog-restauration.component';
import {TranslateModule} from '@ngx-translate/core';


describe('DialogRestauration', () => {
  let component: DialogRestauration;
  let fixture: ComponentFixture<DialogRestauration>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        DialogRestauration,
        TranslateModule.forRoot({})
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DialogRestauration);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
