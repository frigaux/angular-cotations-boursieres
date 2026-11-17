import {ComponentFixture, TestBed} from '@angular/core/testing';

import {TableauCotationsComponent} from './tableau-cotations.component';
import {TranslateModule} from '@ngx-translate/core';
import {DatePipe} from '@angular/common';

describe('TableauCotationsComponent', () => {
  let component: TableauCotationsComponent;
  let fixture: ComponentFixture<TableauCotationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        TableauCotationsComponent,
        TranslateModule.forRoot({})
      ],
      providers: [
        DatePipe
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(TableauCotationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
