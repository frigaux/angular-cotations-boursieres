import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResultatApiGemini } from './resultat-api-gemini';

describe('ResultatApiGemini', () => {
  let component: ResultatApiGemini;
  let fixture: ComponentFixture<ResultatApiGemini>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResultatApiGemini]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ResultatApiGemini);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
