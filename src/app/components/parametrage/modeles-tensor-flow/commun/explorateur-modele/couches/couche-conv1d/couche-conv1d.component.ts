import {Component, input, InputSignal} from '@angular/core';
import {TranslatePipe} from '@ngx-translate/core';
import {DecimalPipe} from '@angular/common';
import {DTOCouche} from '../../../../../../../services/modeles-tensor-flow/commun/couches/dto-couche.interface';
import {TypeCouche} from '../../../../../../../services/modeles-tensor-flow/commun/couches/type-couche.enum';
import {
  DTOCoucheConv1D
} from '../../../../../../../services/modeles-tensor-flow/commun/couches/dto-couche-conv1d.class';

@Component({
  selector: 'app-couche-conv1d',
  imports: [
    TranslatePipe,
    DecimalPipe
  ],
  templateUrl: './couche-conv1d.component.html',
  styleUrls: ['./couche-conv1d.component.sass', '../couche-dense/couche-dense.component.sass'],
})
export class CoucheConv1dComponent {
  inputCouche: InputSignal<DTOCouche | undefined> = input(undefined,
    {transform: o => this.intercepteurCouche(o), alias: 'couche'});

  // données pour la vue
  couche?: DTOCoucheConv1D;

  private intercepteurCouche(couche: DTOCouche | undefined) {
    this.couche = undefined;
    if (couche && couche.type === TypeCouche.CONV1D) {
      this.couche = couche as DTOCoucheConv1D;
    }
    return couche;
  }
}
