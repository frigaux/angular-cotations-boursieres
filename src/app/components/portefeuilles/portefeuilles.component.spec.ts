import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PortefeuillesComponent } from './portefeuilles.component';

describe('PortefeuillesComponent', () => {
  let component: PortefeuillesComponent;
  let fixture: ComponentFixture<PortefeuillesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PortefeuillesComponent]
    });

    fixture = TestBed.createComponent(PortefeuillesComponent);
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
