import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ValeursComponent } from './valeurs.component';
import { ValeursService } from '../../services/valeurs.service';

describe('ValeursComponent', () => {
  let component: ValeursComponent;
  let fixture: ComponentFixture<ValeursComponent>;

  const mockValeursService = jasmine.createSpyObj('ValeursService', ['getValeurs']);

  beforeEach(async () => {
    TestBed.configureTestingModule({
      imports: [ValeursComponent],
      providers: [
        { provide: ValeursService, useValue: mockValeursService }
      ]
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
