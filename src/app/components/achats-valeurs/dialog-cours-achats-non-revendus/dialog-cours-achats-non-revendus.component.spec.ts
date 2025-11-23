import {ComponentFixture, TestBed} from '@angular/core/testing';

import {DialogCoursAchatsNonRevendusComponent} from './dialog-cours-achats-non-revendus.component';
import {TranslateModule} from '@ngx-translate/core';
import {BoursoramaService} from '../../../services/boursorama/boursorama.service';

describe('DialogCoursAchatsNonRevendusComponent', () => {
  let component: DialogCoursAchatsNonRevendusComponent;
  let fixture: ComponentFixture<DialogCoursAchatsNonRevendusComponent>;

  const mockBoursoramaService = jasmine.createSpyObj('BoursoramaService', ['chargerCoursTickers']);

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        DialogCoursAchatsNonRevendusComponent,
        TranslateModule.forRoot({})
      ],
      providers: [
        {provide: BoursoramaService, useValue: mockBoursoramaService}
      ]
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
