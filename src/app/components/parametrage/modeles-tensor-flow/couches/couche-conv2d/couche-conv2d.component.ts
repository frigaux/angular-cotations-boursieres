import {Component, input, InputSignal} from '@angular/core';
import {DTOCouche} from '../../../../../services/modeles-tensor-flow/dto-couche.interface';
import {TypeCouche} from '../../../../../services/modeles-tensor-flow/type-couche.enum';
import {DecimalPipe} from '@angular/common';
import {TranslatePipe} from '@ngx-translate/core';
import {DTOCoucheConv2d} from '../../../../../services/modeles-tensor-flow/dto-couche-conv2d.class';

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
  inputCouche: InputSignal<DTOCouche | undefined> = input(undefined,
    {transform: o => this.intercepteurCouche(o), alias: 'couche'});

  // données pour la vue
  couche?: DTOCoucheConv2d;

  private intercepteurCouche(couche: DTOCouche | undefined) {
    this.couche = undefined;
    if (couche && couche.type === TypeCouche.CONV2D) {
      this.couche = couche as DTOCoucheConv2d;
    }
    return couche;
  }
}
