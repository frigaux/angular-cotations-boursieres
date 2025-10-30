import {Component} from '@angular/core';
import {AchatsValeurComponent} from '../../../valeurs/achats-valeur/achats-valeur.component';
import {TranslatePipe} from '@ngx-translate/core';
import {CoursPortefeuille} from '../../cours-portefeuille.class';
import {Dialog} from 'primeng/dialog';

@Component({
  selector: 'app-panneau-achats-valeur',
  imports: [
    AchatsValeurComponent,
    Dialog,
    TranslatePipe
  ],
  templateUrl: './panneau-achats-valeur.component.html',
  styleUrl: './panneau-achats-valeur.component.sass'
})
export class PanneauAchatsValeurComponent {
  // données pour la vue
  visible: boolean = false;
  cours?: CoursPortefeuille;

  public afficherCours(cours: CoursPortefeuille) {
    this.cours = cours;
    this.visible = true;
  }
}
