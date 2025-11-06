import {ComponentFixture, TestBed} from '@angular/core/testing';

import {DialogCotationsValeurComponent} from './dialog-cotations-valeur.component';
import {TranslateModule} from '@ngx-translate/core';
import {BoursoramaService} from '../../../../services/boursorama/boursorama.service';
import {AbcBourseService} from '../../../../services/abc-bourse/abc-bourse.service';
import {ZoneBourseService} from '../../../../services/zone-bourse/zone-bourse.service';

describe('DialogCotationsValeurComponent', () => {
  let component: DialogCotationsValeurComponent;
  let fixture: ComponentFixture<DialogCotationsValeurComponent>;

  const mockBoursoramaService = jasmine.createSpyObj('BoursoramaService', ['chargerCoursTicker', 'chargerLien']);
  const mockAbcBourseService = jasmine.createSpyObj('AbcBourseService', ['chargerLien']);
  const mockZoneBourseService = jasmine.createSpyObj('ZoneBourseService', ['chargerLien']);

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        DialogCotationsValeurComponent,
        TranslateModule.forRoot({})
      ],
      providers: [
        {provide: BoursoramaService, useValue: mockBoursoramaService},
        {provide: AbcBourseService, useValue: mockAbcBourseService},
        {provide: ZoneBourseService, useValue: mockZoneBourseService}
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(DialogCotationsValeurComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeDefined();
  });
});
