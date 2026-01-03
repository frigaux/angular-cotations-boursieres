import {Component, input, InputSignal} from '@angular/core';
import {TranslatePipe} from "@ngx-translate/core";
import {DTOCouche} from '../../../../../../../services/modeles-tensor-flow/commun/couches/dto-couche.interface';
import {TypeCouche} from '../../../../../../../services/modeles-tensor-flow/commun/couches/type-couche.enum';
import {
  DTOCoucheMaxPooling1D
} from '../../../../../../../services/modeles-tensor-flow/commun/couches/dto-couche-max-pooling1d.class';

@Component({
  selector: 'app-couche-maxpooling1d',
  imports: [
    TranslatePipe
  ],
  templateUrl: './couche-maxpooling1d.component.html',
  styleUrl: './couche-maxpooling1d.component.sass',
})
export class CoucheMaxpooling1dComponent {
  inputCouche: InputSignal<DTOCouche | undefined> = input(undefined,
    {transform: o => this.intercepteurCouche(o), alias: 'couche'});

  // données pour la vue
  couche?: DTOCoucheMaxPooling1D;

  private intercepteurCouche(couche: DTOCouche | undefined) {
    this.couche = undefined;
    if (couche && couche.type === TypeCouche.MAXPOOLING1D) {
      this.couche = couche as DTOCoucheMaxPooling1D;
    }
    return couche;
  }
}
