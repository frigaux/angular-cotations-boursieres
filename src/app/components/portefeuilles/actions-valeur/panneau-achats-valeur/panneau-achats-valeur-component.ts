import {Component, input, InputSignal, model} from '@angular/core';
import {Panel} from 'primeng/panel';
import {AchatsValeurComponent} from '../../../valeurs/details-valeur/achats-valeur/achats-valeur.component';
import {Cours} from '../../../cours/cours.class';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-panneau-achats-valeur',
  imports: [
    Panel,
    AchatsValeurComponent
  ],
  templateUrl: './panneau-achats-valeur-component.html',
  styleUrl: './panneau-achats-valeur.component.sass'
})
export class PanneauAchatsValeurComponent {
  // input/output
  visible = model<boolean>(false);
  inputCours: InputSignal<Cours | undefined> = input(undefined,
    {transform: o => this.intercepteurCours(o), alias: 'cours'});

  // données pour la vue
  cours?: Cours;
  titre?: string;

  constructor(private translateService: TranslateService) {
  }

  private intercepteurCours(cours: Cours | undefined) {
    this.cours = cours;
    if (cours) {
      this.titre = this.translateService.instant('COMPOSANTS.PORTEFEUILLES.ACTIONS_VALEUR.ACHATS_VALEUR', {'nom': cours.libelle});
    }
    return cours;
  }
}
