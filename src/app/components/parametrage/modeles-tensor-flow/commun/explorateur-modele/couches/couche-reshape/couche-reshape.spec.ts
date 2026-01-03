import {ComponentFixture, TestBed} from '@angular/core/testing';

import {CoucheReshape} from './couche-reshape';

describe('CoucheReshape', () => {
  let component: CoucheReshape;
  let fixture: ComponentFixture<CoucheReshape>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CoucheReshape]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CoucheReshape);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
