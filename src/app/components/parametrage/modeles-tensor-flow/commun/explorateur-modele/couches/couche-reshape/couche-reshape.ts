import {Component, input, InputSignal} from '@angular/core';
import {TranslatePipe} from "@ngx-translate/core";
import {DTOCouche} from '../../../../../../../services/modeles-tensor-flow/commun/couches/dto-couche.interface';
import {TypeCouche} from '../../../../../../../services/modeles-tensor-flow/commun/couches/type-couche.enum';
import {
  DTOCoucheReshape
} from '../../../../../../../services/modeles-tensor-flow/commun/couches/dto-couche-reshape.class';

@Component({
  selector: 'app-couche-reshape',
  imports: [
    TranslatePipe
  ],
  templateUrl: './couche-reshape.html',
  styleUrl: './couche-reshape.sass',
})
export class CoucheReshape {
  inputCouche: InputSignal<DTOCouche | undefined> = input(undefined,
    {transform: o => this.intercepteurCouche(o), alias: 'couche'});

  // données pour la vue
  couche?: DTOCoucheReshape;

  private intercepteurCouche(couche: DTOCouche | undefined) {
    this.couche = undefined;
    if (couche && couche.type === TypeCouche.RESHAPE) {
      this.couche = couche as DTOCoucheReshape;
    }
    return couche;
  }
}
