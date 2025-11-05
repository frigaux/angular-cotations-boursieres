import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PopoverActionsValeurComponent } from './popover-actions-valeur.component';

describe('PopoverActionsValeurComponent', () => {
  let component: PopoverActionsValeurComponent;
  let fixture: ComponentFixture<PopoverActionsValeurComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PopoverActionsValeurComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PopoverActionsValeurComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeDefined();
  });
});
