import {Component, input, InputSignal} from '@angular/core';
import {DTOCouche} from '../../../../../services/modeles-tensor-flow/dto-couche.interface';
import {TypeCouche} from '../../../../../services/modeles-tensor-flow/type-couche.enum';
import {TranslatePipe} from '@ngx-translate/core';

@Component({
  selector: 'app-couche-flatten',
  imports: [
    TranslatePipe
  ],
  templateUrl: './couche-flatten.html',
  styleUrl: './couche-flatten.sass',
})
export class CoucheFlatten {
  inputCouche: InputSignal<DTOCouche | undefined> = input(undefined,
    {transform: o => this.intercepteurCouche(o), alias: 'couche'});

  // données pour la vue
  couche?: DTOCouche;

  private intercepteurCouche(couche: DTOCouche | undefined) {
    this.couche = undefined;
    if (couche && couche.type === TypeCouche.FLATTEN) {
      this.couche = couche;
    }
    return couche;
  }
}
