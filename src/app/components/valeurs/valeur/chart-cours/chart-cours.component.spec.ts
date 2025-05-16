import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChartCoursComponent } from './chart-cours.component';
import {TranslateModule} from '@ngx-translate/core';

describe('ChartCoursComponent', () => {
  let component: ChartCoursComponent;
  let fixture: ComponentFixture<ChartCoursComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ChartCoursComponent,
        TranslateModule.forRoot({})
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChartCoursComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeDefined();
  });
});
