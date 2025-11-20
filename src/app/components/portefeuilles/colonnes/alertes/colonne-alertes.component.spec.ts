import {ComponentFixture, TestBed} from '@angular/core/testing';

import {ColonneAlertesComponent} from './colonne-alertes.component';

describe('ColonneAlertesComponent', () => {
  let component: ColonneAlertesComponent;
  let fixture: ComponentFixture<ColonneAlertesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ColonneAlertesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ColonneAlertesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
