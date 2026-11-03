import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DernieresExecutionsBatchs } from './dernieres-executions-batchs.component';

describe('DernieresExecutionsBatchs', () => {
  let component: DernieresExecutionsBatchs;
  let fixture: ComponentFixture<DernieresExecutionsBatchs>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DernieresExecutionsBatchs]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DernieresExecutionsBatchs);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
