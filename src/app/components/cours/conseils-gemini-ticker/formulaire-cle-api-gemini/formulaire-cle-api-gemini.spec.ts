import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormulaireCleApiGemini } from './formulaire-cle-api-gemini';

describe('FormulaireCleApiGemini', () => {
  let component: FormulaireCleApiGemini;
  let fixture: ComponentFixture<FormulaireCleApiGemini>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormulaireCleApiGemini]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormulaireCleApiGemini);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
