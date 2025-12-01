import {ComponentFixture, TestBed} from '@angular/core/testing';

import {TableauVentesComponent} from './tableau-ventes.component';
import {TranslateModule} from '@ngx-translate/core';

describe('TableauVentesComponent', () => {
  let component: TableauVentesComponent;
  let fixture: ComponentFixture<TableauVentesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        TableauVentesComponent,
        TranslateModule.forRoot({})
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(TableauVentesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeDefined();
  });
});
