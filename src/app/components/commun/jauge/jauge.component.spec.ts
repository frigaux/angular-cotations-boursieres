import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JaugeComponent } from './jauge.component';

describe('Jauge', () => {
  let component: JaugeComponent;
  let fixture: ComponentFixture<JaugeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JaugeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JaugeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeDefined();
  });
});
