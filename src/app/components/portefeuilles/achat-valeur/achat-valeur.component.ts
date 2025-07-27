import {Component, viewChild} from '@angular/core';
import {Popover} from "primeng/popover";
import {AchatsComponent} from '../../valeurs/valeur/achats/achats.component';

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

  ticker?: string;

  afficher(event: MouseEvent, ticker: string) {
    this.ticker = ticker;
    this.popover()?.toggle(event);
  }
}
