import {ComponentFixture, TestBed} from '@angular/core/testing';

import {CoucheConv2dComponent} from './couche-conv2d.component';

describe('CoucheConv2dComponent', () => {
  let component: CoucheConv2dComponent;
  let fixture: ComponentFixture<CoucheConv2dComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CoucheConv2dComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(CoucheConv2dComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeDefined();
  });
});
