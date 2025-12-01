import {ComponentFixture, TestBed} from '@angular/core/testing';

import {DialogCoursAchatsComponent} from './dialog-cours-achats.component';
import {TranslateModule} from '@ngx-translate/core';
import {BoursoramaService} from '../../../services/boursorama/boursorama.service';

describe('DialogCoursAchatsComponent', () => {
  let component: DialogCoursAchatsComponent;
  let fixture: ComponentFixture<DialogCoursAchatsComponent>;

  const mockBoursoramaService = jasmine.createSpyObj('BoursoramaService', ['chargerCoursTickers']);

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        DialogCoursAchatsComponent,
        TranslateModule.forRoot({})
      ],
      providers: [
        {provide: BoursoramaService, useValue: mockBoursoramaService}
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(DialogCoursAchatsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
