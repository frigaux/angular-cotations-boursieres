import {Component, input, InputSignal} from '@angular/core';
import {Couche} from '../../../../../services/modeles-tensor-flow/couche.interface';
import {TypeCouche} from '../../../../../services/modeles-tensor-flow/type-couche';
import {DecimalPipe} from '@angular/common';
import {TranslatePipe} from '@ngx-translate/core';

@Component({
  selector: 'app-couche-conv2d',
  imports: [
    DecimalPipe,
    TranslatePipe
  ],
  templateUrl: './couche-conv2d.component.html',
  styleUrls: ['./couche-conv2d.component.sass', '../couche-dense/couche-dense.component.sass'],
})
export class CoucheConv2dComponent {
  inputCouche: InputSignal<Couche | undefined> = input(undefined,
    {transform: o => this.intercepteurCouche(o), alias: 'couche'});

  // données pour la vue
  couche?: Couche;

  private intercepteurCouche(couche: Couche | undefined) {
    this.couche = undefined;
    if (couche && couche.type === TypeCouche.CONV2D) {
      this.couche = couche;
    }
    return couche;
  }
}
