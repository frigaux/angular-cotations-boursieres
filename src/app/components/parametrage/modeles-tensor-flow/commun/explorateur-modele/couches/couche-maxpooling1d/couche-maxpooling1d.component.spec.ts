import {ComponentFixture, TestBed} from '@angular/core/testing';

import {CoucheMaxpooling1dComponent} from './couche-maxpooling1d.component';

describe('CoucheMaxpooling1dComponent', () => {
  let component: CoucheMaxpooling1dComponent;
  let fixture: ComponentFixture<CoucheMaxpooling1dComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CoucheMaxpooling1dComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CoucheMaxpooling1dComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeDefined();
  });
});
