import {Component, input, InputSignal} from '@angular/core';
import {CurrencyPipe, NgClass} from '@angular/common';

@Component({
  selector: 'app-jauge',
  imports: [
    NgClass,
    CurrencyPipe
  ],
  templateUrl: './jauge.component.html',
  styleUrl: './jauge.component.sass'
})
export class JaugeComponent {
  // input/output
  inputTailleReduite: InputSignal<boolean | undefined> = input(undefined,
    {transform: o => this.intercepteurTailleReduite(o), alias: 'tailleReduite'});
  inputDonnees: InputSignal<{ cours: number, plusBas: number, plusHaut: number } | undefined> = input(undefined,
    {transform: o => this.intercepteurDonnees(o), alias: 'donnees'});

  // données pour la vue
  tailleReduite: boolean = false;
  cours?: number;
  plusBas?: number;
  plusHaut?: number;
  pourcentage?: number;

  private intercepteurDonnees(donnees: { cours: number; plusBas: number; plusHaut: number } | undefined) {
    if (donnees) {
      this.cours = donnees.cours;
      this.plusBas = donnees.plusBas;
      this.plusHaut = donnees.plusHaut;
      this.pourcentage = Math.round(100 * (this.cours - this.plusBas) / (this.plusHaut - this.plusBas));
    } else {
      this.cours = undefined;
      this.plusBas = undefined;
      this.plusHaut = undefined;
      this.pourcentage = undefined;
    }
    return donnees;
  }

  private intercepteurTailleReduite(tailleReduite?: boolean) {
    this.tailleReduite = tailleReduite ? tailleReduite : false;
    return tailleReduite;
  }
}
