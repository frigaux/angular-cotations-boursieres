import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChartMoyennesMobilesComponent } from './chart-moyennes-mobiles.component';
import {TranslateModule} from '@ngx-translate/core';

describe('ChartMoyennesMobilesComponent', () => {
  let component: ChartMoyennesMobilesComponent;
  let fixture: ComponentFixture<ChartMoyennesMobilesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ChartMoyennesMobilesComponent,
        TranslateModule.forRoot({})
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChartMoyennesMobilesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeDefined();
  });
});
