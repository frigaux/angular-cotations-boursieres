import {Component, inject, input, InputSignal} from '@angular/core';
import {CurrencyPipe, NgClass, PercentPipe} from '@angular/common';
import {Tooltip} from 'primeng/tooltip';

@Component({
  selector: 'app-jauge',
  imports: [
    NgClass,
    CurrencyPipe,
    Tooltip,
    PercentPipe
  ],
  templateUrl: './jauge.component.html',
  styleUrl: './jauge.component.sass'
})
export class JaugeComponent {
  private percentPipe = inject(PercentPipe);

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
  variationPlusBasPlusHaut?: number;
  tooltip?: string;

  // private
  private numberFormatToCurrency = new Intl.NumberFormat('fr-FR', {style: 'currency', currency: 'EUR'});
  private formatCurrency: Function = (value: number) => this.numberFormatToCurrency.format(value);

  private intercepteurDonnees(donnees: { cours: number; plusBas: number; plusHaut: number } | undefined) {
    if (donnees) {
      this.corrigerDonnees(donnees);
      this.cours = donnees.cours;
      this.plusBas = donnees.plusBas;
      this.plusHaut = donnees.plusHaut;
      this.pourcentage = Math.round(100 * (this.cours - this.plusBas) / (this.plusHaut - this.plusBas));
      this.variationPlusBasPlusHaut = (donnees.plusHaut - donnees.plusBas) / donnees.plusBas;
      this.tooltip = `${this.formatCurrency(this.plusBas)} - ${this.formatCurrency(this.plusHaut)}`;
    } else {
      this.cours = undefined;
      this.plusBas = undefined;
      this.plusHaut = undefined;
      this.tooltip = undefined;
      this.pourcentage = undefined;
    }
    return donnees;
  }

  private intercepteurTailleReduite(tailleReduite?: boolean) {
    this.tailleReduite = tailleReduite ? tailleReduite : false;
    return tailleReduite;
  }

  private corrigerDonnees(donnees: { cours: number; plusBas: number; plusHaut: number }) {
    if (donnees.cours < donnees.plusBas) {
      donnees.plusBas = donnees.cours;
    }
    if (donnees.cours > donnees.plusHaut) {
      donnees.plusHaut = donnees.cours;
    }
  }
}
