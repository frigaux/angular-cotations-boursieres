import {ComponentFixture, TestBed} from '@angular/core/testing';

import {CoucheFlatten} from './couche-flatten';

describe('CoucheFlatten', () => {
  let component: CoucheFlatten;
  let fixture: ComponentFixture<CoucheFlatten>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CoucheFlatten]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CoucheFlatten);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
