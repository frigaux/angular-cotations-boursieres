import {ComponentFixture, TestBed} from '@angular/core/testing';

import {CoucheConv1dComponent} from './couche-conv1d.component';

describe('CoucheConv1dComponent', () => {
  let component: CoucheConv1dComponent;
  let fixture: ComponentFixture<CoucheConv1dComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CoucheConv1dComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CoucheConv1dComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeDefined();
  });
});
