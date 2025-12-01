import {Component, input, InputSignal} from '@angular/core';
import {NgStyle} from '@angular/common';

@Component({
  selector: 'app-barre-progression',
  imports: [
    NgStyle
  ],
  templateUrl: './barre-progression.component.html',
  styleUrl: './barre-progression.component.sass',
})
export class BarreProgressionComponent {
  inputLargeur: InputSignal<string | undefined> = input(undefined,
    {transform: o => this.intercepteurLargeur(o), alias: 'largeur'});
  inputPourcentage: InputSignal<number | undefined> = input(undefined,
    {transform: o => this.intercepteurPourcentage(o), alias: 'pourcentage'});

  // données pour la vue
  protected pourcentage: number = 0;
  protected largeur: string = '0';

  private intercepteurPourcentage(pourcentage: number | undefined) {
    this.pourcentage = pourcentage || 0;
    return pourcentage;
  }

  private intercepteurLargeur(largeur: string | undefined) {
    this.largeur = largeur || '0';
    return largeur;
  }
}
