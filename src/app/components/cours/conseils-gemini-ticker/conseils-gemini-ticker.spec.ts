import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConseilsGeminiTicker } from './conseils-gemini-ticker';

describe('ConseilsGenkitTicker', () => {
  let component: ConseilsGeminiTicker;
  let fixture: ComponentFixture<ConseilsGeminiTicker>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConseilsGeminiTicker]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConseilsGeminiTicker);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
