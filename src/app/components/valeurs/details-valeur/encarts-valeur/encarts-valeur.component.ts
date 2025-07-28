import {Component, input, InputSignal} from '@angular/core';
import {Timeline} from "primeng/timeline";
import {Cours} from '../../../cours/cours.class';
import {TranslatePipe, TranslateService} from '@ngx-translate/core';
import {DatePipe, DecimalPipe, NgClass} from '@angular/common';
import {Fieldset} from 'primeng/fieldset';
import {AchatsComponent} from '../achats/achats.component';

@Component({
  selector: 'app-encarts-valeur',
  imports: [
    Timeline,
    NgClass,
    Fieldset,
    TranslatePipe,
    DecimalPipe,
    DatePipe,
    AchatsComponent
  ],
  templateUrl: './encarts-valeur.component.html',
  styleUrl: './encarts-valeur.component.sass'
})
export class EncartsValeurComponent {
  // input/output
  inputCours: InputSignal<Cours | undefined> = input(undefined,
    {transform: o => this.intercepteurCours(o), alias: 'cours'});
  cours?: Cours;

  // données pour la vue
  timelineItems: any[] = [];
  croissant: boolean = true;

  // privé
  private currencyFormatter: Intl.NumberFormat;

  constructor(private translateService: TranslateService) {
    this.currencyFormatter = new Intl.NumberFormat('fr-FR', {style: 'currency', currency: 'EUR'});
  }

  private intercepteurCours(cours: Cours | undefined) {
    this.cours = cours;
    this.timelineItems = [];
    if (cours) {
      this.addItem(this.translateService, 'MINIMUM', cours!.plusBas);
      if (cours!.ouverture < cours!.cloture) {
        this.croissant = true;
        this.addItem(this.translateService, 'OUVERTURE', cours!.ouverture);
        this.addItem(this.translateService, 'CLOTURE', cours!.cloture);
      } else {
        this.croissant = false;
        this.addItem(this.translateService, 'CLOTURE', cours!.cloture);
        this.addItem(this.translateService, 'OUVERTURE', cours!.ouverture);
      }
      this.addItem(this.translateService, 'MAXIMUM', cours!.plusHaut);
    }
    return cours;
  }

  addItem(translateService: TranslateService, keyTranslate: string, cours: number): void {
    this.timelineItems.push({
      libelle: translateService.instant(`COMPOSANTS.VALEURS.VALEUR.DETAILS_VALEUR.${keyTranslate}`),
      cours: this.currencyFormatter.format(cours)
    });
  }
}
