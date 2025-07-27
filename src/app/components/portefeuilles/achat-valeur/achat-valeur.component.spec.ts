import {ComponentFixture, TestBed} from '@angular/core/testing';

import {AchatValeurComponent} from './achat-valeur.component';

describe('AchatValeurComponent', () => {
  let component: AchatValeurComponent;
  let fixture: ComponentFixture<AchatValeurComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AchatValeurComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(AchatValeurComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeDefined();
  });
});
