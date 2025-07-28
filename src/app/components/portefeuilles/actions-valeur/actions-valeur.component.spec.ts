import {ComponentFixture, TestBed} from '@angular/core/testing';

import {ActionsValeurComponent} from './actions-valeur.component';

describe('AchatValeurComponent', () => {
  let component: ActionsValeurComponent;
  let fixture: ComponentFixture<ActionsValeurComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ActionsValeurComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(ActionsValeurComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeDefined();
  });
});
