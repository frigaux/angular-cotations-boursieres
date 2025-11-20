import {Component, input, InputSignal} from '@angular/core';
import {AlerteAvecSonEvaluation} from '../../alerte-avec-son-evaluation.class';

@Component({
  selector: 'app-colonne-alertes',
  imports: [
  ],
  templateUrl: './colonne-alertes.component.html',
  styleUrl: './colonne-alertes.component.sass'
})
export class ColonneAlertesComponent {
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
