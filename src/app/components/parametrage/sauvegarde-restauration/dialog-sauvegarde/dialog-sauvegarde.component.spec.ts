import {ComponentFixture, TestBed} from '@angular/core/testing';
import {DialogSauvegardeComponent} from './dialog-sauvegarde.component';
import {TranslateModule} from '@ngx-translate/core';


describe('DialogSauvegardeComponent', () => {
  let component: DialogSauvegardeComponent;
  let fixture: ComponentFixture<DialogSauvegardeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        DialogSauvegardeComponent,
        TranslateModule.forRoot({})
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DialogSauvegardeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
