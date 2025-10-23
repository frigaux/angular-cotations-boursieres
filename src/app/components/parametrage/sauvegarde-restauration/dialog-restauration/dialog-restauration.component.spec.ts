import {ComponentFixture, TestBed} from '@angular/core/testing';
import {DialogRestaurationComponent} from './dialog-restauration.component';
import {TranslateModule} from '@ngx-translate/core';


describe('DialogRestaurationComponent', () => {
  let component: DialogRestaurationComponent;
  let fixture: ComponentFixture<DialogRestaurationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        DialogRestaurationComponent,
        TranslateModule.forRoot({})
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DialogRestaurationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
