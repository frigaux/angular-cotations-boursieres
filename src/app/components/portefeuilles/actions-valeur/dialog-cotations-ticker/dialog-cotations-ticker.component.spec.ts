import {ComponentFixture, TestBed} from '@angular/core/testing';

import {DialogCotationsTickerComponent} from './dialog-cotations-ticker.component';
import {TranslateModule} from '@ngx-translate/core';
import {BoursoramaService} from '../../../../services/boursorama/boursorama.service';

describe('DialogCoursTickerComponent', () => {
  let component: DialogCotationsTickerComponent;
  let fixture: ComponentFixture<DialogCotationsTickerComponent>;

  const mockBoursoramaService = jasmine.createSpyObj('BoursoramaService', ['chargerCoursTicker']);

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        DialogCotationsTickerComponent,
        TranslateModule.forRoot({})
      ],
      providers: [
        {provide: BoursoramaService, useValue: mockBoursoramaService}
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(DialogCotationsTickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeDefined();
  });
});
