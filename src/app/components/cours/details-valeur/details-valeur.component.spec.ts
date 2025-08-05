import {ComponentFixture, TestBed} from '@angular/core/testing';

import {DetailsValeurComponent} from './details-valeur.component';
import {COURS_CROISSANT} from '../../../services/jdd/jdd-cours.dataset';
import {TranslateModule} from '@ngx-translate/core';
import {provideAnimations} from '@angular/platform-browser/animations';

describe('DetailsValeurComponent', () => {
  let component: DetailsValeurComponent;
  let fixture: ComponentFixture<DetailsValeurComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        DetailsValeurComponent,
        TranslateModule.forRoot({})
      ],
      providers: [
        provideAnimations()
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(DetailsValeurComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeDefined();
  });

  it('Given un cours when le composant est rendu then le <p-panel> et <p-chart> sont rendus', () => {
    const element: HTMLElement = fixture.nativeElement;
    fixture.componentRef.setInput('cours', COURS_CROISSANT);
    fixture.detectChanges();
    const elPanel = element.querySelector('p-panel');
    expect(elPanel).toBeTruthy();
    const elChart = element.querySelector('p-chart');
    expect(elChart).toBeTruthy();
  });

  it('Given un cours when #abcBourse ou #boursorama then une popup est ouverte', () => {
    fixture.componentRef.setInput('cours', COURS_CROISSANT);
    spyOn(window, "open");
    component.abcBourse();
    component.boursorama();
    expect(window.open).toHaveBeenCalledTimes(2);
  });
});
