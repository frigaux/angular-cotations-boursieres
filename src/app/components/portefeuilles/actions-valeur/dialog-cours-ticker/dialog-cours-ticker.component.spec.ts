import {ComponentFixture, TestBed} from '@angular/core/testing';

import {DialogCoursTickerComponent} from './dialog-cours-ticker.component';
import {TranslateModule} from '@ngx-translate/core';
import {BoursoramaService} from '../../../../services/boursorama/boursorama.service';

describe('DialogCoursTickerComponent', () => {
  let component: DialogCoursTickerComponent;
  let fixture: ComponentFixture<DialogCoursTickerComponent>;

  const mockBoursoramaService = jasmine.createSpyObj('BoursoramaService', ['chargerCoursTicker']);

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        DialogCoursTickerComponent,
        TranslateModule.forRoot({})
      ],
      providers: [
        {provide: BoursoramaService, useValue: mockBoursoramaService}
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(DialogCoursTickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
