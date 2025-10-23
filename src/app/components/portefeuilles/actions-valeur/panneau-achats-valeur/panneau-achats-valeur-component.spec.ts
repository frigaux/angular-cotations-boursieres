import {ComponentFixture, TestBed} from '@angular/core/testing';

import {PanneauAchatsValeurComponent} from './panneau-achats-valeur-component';
import {TranslateModule} from '@ngx-translate/core';

describe('PanneauAchatsValeur', () => {
  let component: PanneauAchatsValeurComponent;
  let fixture: ComponentFixture<PanneauAchatsValeurComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        PanneauAchatsValeurComponent,
        TranslateModule.forRoot({})
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(PanneauAchatsValeurComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
