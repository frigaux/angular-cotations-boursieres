import {Component, input, InputSignal} from '@angular/core';
import {DecimalPipe} from '@angular/common';
import {TranslatePipe} from '@ngx-translate/core';
import {DTOCouche} from '../../../../../../../services/modeles-tensor-flow/couches/dto-couche.interface';
import {TypeCouche} from '../../../../../../../services/modeles-tensor-flow/couches/type-couche.enum';
import {DTOCoucheDense} from '../../../../../../../services/modeles-tensor-flow/couches/dto-couche-dense.class';

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
  inputCouche: InputSignal<DTOCouche | undefined> = input(undefined,
    {transform: o => this.intercepteurCouche(o), alias: 'couche'});

  // données pour la vue
  couche?: DTOCoucheDense;

  private intercepteurCouche(couche: DTOCouche | undefined) {
    this.couche = undefined;
    if (couche && couche.type === TypeCouche.DENSE) {
      this.couche = couche as DTOCoucheDense;
    }
    return couche;
  }
}
