import {Component, input, InputSignal, output} from '@angular/core';
import {Button} from 'primeng/button';
import {NombreTenseurs} from '../nombre-tenseurs/nombre-tenseurs';
import {BarreProgressionComponent} from '../../../../commun/barre-progression/barre-progression.component';
import {TranslatePipe} from '@ngx-translate/core';

@Component({
  selector: 'app-entrainement-modele',
  imports: [
    Button,
    NombreTenseurs,
    BarreProgressionComponent,
    TranslatePipe
  ],
  templateUrl: './entrainement-modele.component.html',
  styleUrl: './entrainement-modele.component.sass',
})
export class EntrainementModeleComponent {
  inputProgressionEntrainement: InputSignal<number> = input(0,
    {transform: o => this.intercepteurProgressionEntrainement(o), alias: 'progressionEntrainement'});
  entrainer = output<void>();

  protected training: boolean = false;
  protected progressionEntrainement: number = 0;

  private intercepteurProgressionEntrainement(progressionEntrainement: number) {
    this.progressionEntrainement = progressionEntrainement;
    if (progressionEntrainement >= 100) {
      this.training = false;
    }
    return progressionEntrainement;
  }

  protected entrainerModele() {
    if (!this.training) {
      this.entrainer.emit();
      this.training = true;
    }
  }
}
