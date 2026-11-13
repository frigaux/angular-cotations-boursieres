import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BoursicotageComponent } from './boursicotage.component';

describe('BoursicotageComponent', () => {
  let component: BoursicotageComponent;
  let fixture: ComponentFixture<BoursicotageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BoursicotageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BoursicotageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
