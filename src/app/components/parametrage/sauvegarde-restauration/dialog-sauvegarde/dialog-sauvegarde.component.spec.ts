import {ComponentFixture, TestBed} from '@angular/core/testing';
import {DialogSauvegarde} from './dialog-sauvegarde.component';
import {TranslateModule} from '@ngx-translate/core';


describe('DialogSauvegarde', () => {
  let component: DialogSauvegarde;
  let fixture: ComponentFixture<DialogSauvegarde>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        DialogSauvegarde,
        TranslateModule.forRoot({})
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DialogSauvegarde);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
