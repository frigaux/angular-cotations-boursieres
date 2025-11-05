import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResultatApiGeminiComponent } from './resultat-api-gemini.component';

describe('ResultatApiGeminiComponent', () => {
  let component: ResultatApiGeminiComponent;
  let fixture: ComponentFixture<ResultatApiGeminiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResultatApiGeminiComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ResultatApiGeminiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
