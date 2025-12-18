import {ComponentFixture, TestBed} from '@angular/core/testing';

import {CoucheMaxpooling2dComponent} from './couche-maxpooling2d.component';

describe('CoucheMaxpooling2dComponent', () => {
  let component: CoucheMaxpooling2dComponent;
  let fixture: ComponentFixture<CoucheMaxpooling2dComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CoucheMaxpooling2dComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(CoucheMaxpooling2dComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeDefined();
  });
});
