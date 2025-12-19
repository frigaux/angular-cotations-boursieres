import {ComponentFixture, TestBed} from '@angular/core/testing';

import {GenerateurDonneesEntrainementModeleComponent} from './generateur-donnees-entrainement-modele.component';

describe('GenerateurDonneesEntrainementModeleComponent', () => {
  let component: GenerateurDonneesEntrainementModeleComponent;
  let fixture: ComponentFixture<GenerateurDonneesEntrainementModeleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GenerateurDonneesEntrainementModeleComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GenerateurDonneesEntrainementModeleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
