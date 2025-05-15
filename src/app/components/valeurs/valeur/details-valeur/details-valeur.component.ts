import {Component, effect, input, InputSignal} from '@angular/core';
import {Timeline} from "primeng/timeline";
import {Cours} from '../../../cours/Cours';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-details-valeur',
  imports: [
    Timeline
  ],
  templateUrl: './details-valeur.component.html',
  styleUrl: './details-valeur.component.sass'
})
export class DetailsValeurComponent {
  cours: InputSignal<Cours | undefined> = input<Cours>();

  // données pour la vue
  timelineItems: any[] = [];

  constructor(private translateService: TranslateService) {
    effect(() => {
      this.timelineItems = [];
      const cours = this.cours();
      if (cours) {
        this.addItem(translateService, 'MINIMUM', cours!.plusBas);
        if (cours!.ouverture < cours!.cloture) {
          this.addItem(translateService, 'OUVERTURE', cours!.ouverture);
          this.addItem(translateService, 'CLOTURE', cours!.cloture);
        } else {
          this.addItem(translateService, 'CLOTURE', cours!.cloture);
          this.addItem(translateService, 'OUVERTURE', cours!.ouverture);
        }
        this.addItem(translateService, 'MAXIMUM', cours!.plusHaut);
      }
    });
  }

  addItem(translateService: TranslateService, keyTranslate: string, cours: number): void {
    this.timelineItems.push({
      libelle : translateService.instant(`COMPOSANTS.VALEURS.VALEUR.DETAILS_VALEUR.${keyTranslate}`),
      cours: new Intl.NumberFormat('fr-FR', {style: 'currency', currency: 'EUR'}).format(cours)
    });
  }
}
