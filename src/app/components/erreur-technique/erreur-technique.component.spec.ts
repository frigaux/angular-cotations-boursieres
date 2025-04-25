import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ErreurTechniqueComponent } from './erreur-technique.component';

describe('ErreurTechniqueComponent', () => {
  let component: ErreurTechniqueComponent;
  let fixture: ComponentFixture<ErreurTechniqueComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ErreurTechniqueComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ErreurTechniqueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeDefined();
  });

  it('should have <div>', () => {
    const bannerElement: HTMLElement = fixture.nativeElement;
    const el = bannerElement.querySelector('div');
    expect(el).toBeTruthy();
  });
});
