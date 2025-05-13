import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ErreurTechniqueComponent } from './erreur-technique.component';

describe('ErreurTechniqueComponent', () => {
  let component: ErreurTechniqueComponent;
  let fixture: ComponentFixture<ErreurTechniqueComponent>;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      imports: [ErreurTechniqueComponent]
    });

    fixture = TestBed.createComponent(ErreurTechniqueComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeDefined();
  });

  it('should have <div>', () => {
    const element: HTMLElement = fixture.nativeElement;
    const el = element.querySelector('div');
    expect(el).toBeTruthy();
  });
});
