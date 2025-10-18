import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SauvegardeRestaurationComponent } from './sauvegarde-restauration.component';

describe('SauvegardeRestaurationComponent', () => {
  let component: SauvegardeRestaurationComponent;
  let fixture: ComponentFixture<SauvegardeRestaurationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SauvegardeRestaurationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SauvegardeRestaurationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeDefined();
  });
});
