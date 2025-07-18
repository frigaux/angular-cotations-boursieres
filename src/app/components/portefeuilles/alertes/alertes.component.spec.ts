import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlertesComponent } from './alertes.component';

describe('AlertesComponent', () => {
  let component: AlertesComponent;
  let fixture: ComponentFixture<AlertesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AlertesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AlertesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
