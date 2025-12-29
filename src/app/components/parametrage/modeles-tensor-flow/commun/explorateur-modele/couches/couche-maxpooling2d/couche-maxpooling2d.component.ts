import {Component, input, InputSignal} from '@angular/core';
import {DTOCouche} from '../../../../../../../services/modeles-tensor-flow/couches/dto-couche.interface';
import {TypeCouche} from '../../../../../../../services/modeles-tensor-flow/couches/type-couche.enum';
import {
  DTOCoucheMaxpooling2d
} from '../../../../../../../services/modeles-tensor-flow/couches/dto-couche-pooling2d.class';
import {TranslatePipe} from '@ngx-translate/core';

@Component({
  selector: 'app-couche-maxpooling2d',
  imports: [
    TranslatePipe
  ],
  templateUrl: './couche-maxpooling2d.component.html',
  styleUrl: './couche-maxpooling2d.component.sass',
})
export class CoucheMaxpooling2dComponent {
  inputCouche: InputSignal<DTOCouche | undefined> = input(undefined,
    {transform: o => this.intercepteurCouche(o), alias: 'couche'});

  // données pour la vue
  couche?: DTOCoucheMaxpooling2d;

  private intercepteurCouche(couche: DTOCouche | undefined) {
    this.couche = undefined;
    if (couche && couche.type === TypeCouche.MAXPOOLING2D) {
      this.couche = couche as DTOCoucheMaxpooling2d;
    }
    return couche;
  }
}
