import {Component, input, InputSignal} from '@angular/core';
import {CoucheDense} from '../../../../../services/modeles-tensor-flow/couche-dense.interface';
import {DecimalPipe} from '@angular/common';
import {TranslatePipe} from '@ngx-translate/core';

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
  inputCouche: InputSignal<CoucheDense | undefined> = input(undefined,
    {transform: o => this.intercepteurCouche(o), alias: 'couche'});

  // données pour la vue
  couche?: CoucheDense;

  private intercepteurCouche(couche: CoucheDense | undefined) {
    this.couche = couche;
    return couche;
  }
}
