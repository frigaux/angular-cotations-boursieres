import {ComponentFixture, TestBed} from '@angular/core/testing';

import {ExplorateurModeleComponent} from './explorateur-modele.component';

describe('ExplorateurModele', () => {
  let component: ExplorateurModeleComponent;
  let fixture: ComponentFixture<ExplorateurModeleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExplorateurModeleComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExplorateurModeleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
