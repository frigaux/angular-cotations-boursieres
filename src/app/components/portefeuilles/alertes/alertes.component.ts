import {Component, input, InputSignal} from '@angular/core';
import {Alerte} from '../alerte.class';

@Component({
  selector: 'app-alertes',
  imports: [
  ],
  templateUrl: './alertes.component.html',
  styleUrl: './alertes.component.sass'
})
export class AlertesComponent {
  // input/output
  inputAlertes: InputSignal<Alerte[] | undefined> = input([],
    {transform: o => this.intercepteurAlerte(o), alias: 'alertes'});

  // données pour la vue
  alertes: Alerte[] | undefined;

  private intercepteurAlerte(alertes: Alerte[] | undefined) {
    if (alertes) {
      this.alertes = alertes;
    }
    return alertes;
  }
}
