import {ComponentFixture, TestBed} from '@angular/core/testing';

import {DialogCoursAchatsNonRevendusComponent} from './dialog-cours-achats-non-revendus.component';

describe('DialogCoursAchatsNonRevendusComponent', () => {
  let component: DialogCoursAchatsNonRevendusComponent;
  let fixture: ComponentFixture<DialogCoursAchatsNonRevendusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DialogCoursAchatsNonRevendusComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DialogCoursAchatsNonRevendusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
