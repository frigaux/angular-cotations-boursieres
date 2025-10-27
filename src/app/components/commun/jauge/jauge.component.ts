import {Component, input, InputSignal} from '@angular/core';
import {TranslatePipe} from '@ngx-translate/core';
import {NgClass} from '@angular/common';

@Component({
  selector: 'app-jauge',
  imports: [
    TranslatePipe,
    NgClass
  ],
  templateUrl: './jauge.component.html',
  styleUrl: './jauge.component.sass'
})
export class JaugeComponent {
  // input/output
  inputCleMinimum: InputSignal<string | undefined> = input(undefined,
    {transform: o => this.intercepteurCleMinimum(o), alias: 'cleMinimum'});
  inputCleMaximum: InputSignal<string | undefined> = input(undefined,
    {transform: o => this.intercepteurCleMaximum(o), alias: 'cleMaximum'});
  inputPourcentage: InputSignal<number | undefined> = input(undefined,
    {transform: o => this.intercepteurPourcentage(o), alias: 'pourcentage'});

  // données pour la vue
  cleMinimum?: string;
  cleMaximum?: string;
  pourcentage?: number;

  private intercepteurCleMinimum(cleMinimum: string | undefined) {
    this.cleMinimum = cleMinimum;
    return cleMinimum;
  }

  private intercepteurCleMaximum(cleMaximum: string | undefined) {
    this.cleMaximum = cleMaximum;
    return cleMaximum;
  }

  private intercepteurPourcentage(pourcentage: number | undefined) {
    this.pourcentage = pourcentage;
    return pourcentage;
  }
}
