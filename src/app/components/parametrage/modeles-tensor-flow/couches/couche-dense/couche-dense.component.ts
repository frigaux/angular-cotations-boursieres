import {Component, input, InputSignal} from '@angular/core';
import {DecimalPipe} from '@angular/common';
import {TranslatePipe} from '@ngx-translate/core';
import {Couche} from '../../../../../services/modeles-tensor-flow/couche.interface';

@Component({
  selector: 'app-couche-dense',
  imports: [
    DecimalPipe,
    TranslatePipe
  ],
  templateUrl: './couche-dense.component.html',
  styleUrl: './couche-dense.component.sass',
})
export class CoucheDenseComponent {
  inputCouche: InputSignal<Couche | undefined> = input(undefined,
    {transform: o => this.intercepteurCouche(o), alias: 'couche'});

  // données pour la vue
  couche?: Couche;

  private intercepteurCouche(couche: Couche | undefined) {
    this.couche = couche;
    return couche;
  }
}
