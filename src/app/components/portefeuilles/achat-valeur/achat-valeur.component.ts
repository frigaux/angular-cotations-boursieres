import {Component, viewChild} from '@angular/core';
import {Popover} from "primeng/popover";
import {AchatsComponent} from '../../valeurs/valeur/achats/achats.component';
import {Cours} from '../../cours/cours.class';

@Component({
  selector: 'app-achat-valeur',
  imports: [
    Popover,
    AchatsComponent
  ],
  templateUrl: './achat-valeur.component.html',
  styleUrl: './achat-valeur.component.sass'
})
export class AchatValeurComponent {
  private popover = viewChild(Popover);

  cours?: Cours;

  afficher(event: MouseEvent, cours: Cours) {
    this.cours = cours;
    this.popover()?.toggle(event);
  }
}
