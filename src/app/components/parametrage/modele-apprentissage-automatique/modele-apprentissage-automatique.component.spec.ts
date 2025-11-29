import {ComponentFixture, TestBed} from '@angular/core/testing';

import {ModeleApprentissageAutomatiqueComponent} from './modele-apprentissage-automatique.component';
import {TranslateModule} from '@ngx-translate/core';

describe('ModeleApprentissageAutomatiqueComponent', () => {
  let component: ModeleApprentissageAutomatiqueComponent;
  let fixture: ComponentFixture<ModeleApprentissageAutomatiqueComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ModeleApprentissageAutomatiqueComponent,
        TranslateModule.forRoot({})
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(ModeleApprentissageAutomatiqueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
