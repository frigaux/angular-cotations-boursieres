import {ComponentFixture, TestBed} from '@angular/core/testing';

import {BarreProgressionComponent} from './barre-progression.component';

describe('BarreProgressionComponent', () => {
  let component: BarreProgressionComponent;
  let fixture: ComponentFixture<BarreProgressionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BarreProgressionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BarreProgressionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
