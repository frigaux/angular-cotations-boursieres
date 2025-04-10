import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ValeursComponent } from './valeurs.component';

describe('ValeursComponent', () => {
  let component: ValeursComponent;
  let fixture: ComponentFixture<ValeursComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ValeursComponent]
    });

    fixture = TestBed.createComponent(ValeursComponent);
    component = fixture.componentInstance;
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
