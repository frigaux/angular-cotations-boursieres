import {Component, input, InputSignal} from '@angular/core';
import {AlerteAvecSonEvaluation} from '../../alerte-avec-son-evaluation.class';

@Component({
  selector: 'app-alertes',
  imports: [
  ],
  templateUrl: './alertes.component.html',
  styleUrl: './alertes.component.sass'
})
export class AlertesComponent {
  // input/output
  inputAlertes: InputSignal<AlerteAvecSonEvaluation[] | undefined> = input([],
    {transform: o => this.intercepteurAlertes(o), alias: 'alertes'});

  // données pour la vue
  alertes: AlerteAvecSonEvaluation[] | undefined;

  private intercepteurAlertes(alertes: AlerteAvecSonEvaluation[] | undefined) {
    if (alertes) {
      this.alertes = alertes;
    }
    return alertes;
  }
}
