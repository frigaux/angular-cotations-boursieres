import {Component, input, InputSignal} from '@angular/core';
import {Alerte} from '../alerte.class';
import {NgIf} from '@angular/common';

@Component({
  selector: 'app-alertes',
  imports: [
    NgIf
  ],
  templateUrl: './alertes.component.html',
  styleUrl: './alertes.component.sass'
})
export class AlertesComponent {
  // input/output
  alertes: InputSignal<Alerte[] | undefined> = input(undefined,
    {transform: o => this.intercepteurAlerte(o)});

  // données pour la vue
  alertesVue: Alerte[] | undefined;

  private intercepteurAlerte(alertes: Alerte[] | undefined) {
    if (alertes) {
      this.alertesVue = alertes;
    }
    return alertes;
  }
}
