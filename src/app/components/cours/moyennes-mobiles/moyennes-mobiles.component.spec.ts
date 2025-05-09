import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MoyennesMobilesComponent } from './moyennes-mobiles.component';

describe('MoyennesMobilesComponent', () => {
  let component: MoyennesMobilesComponent;
  let fixture: ComponentFixture<MoyennesMobilesComponent>;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      imports: [MoyennesMobilesComponent]
    });

    fixture = TestBed.createComponent(MoyennesMobilesComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeDefined();
  });

  // TODO : verifier bon affichage si input défini
});
