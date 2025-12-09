import {ComponentFixture, TestBed} from '@angular/core/testing';

import {CoucheDenseComponent} from './couche-dense.component';

describe('CoucheDenseComponent', () => {
  let component: CoucheDenseComponent;
  let fixture: ComponentFixture<CoucheDenseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CoucheDenseComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(CoucheDenseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeDefined();
  });
});
