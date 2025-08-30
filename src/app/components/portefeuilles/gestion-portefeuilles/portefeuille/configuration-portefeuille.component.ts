import {Component, input, InputSignal} from '@angular/core';
import {DTOPortefeuille} from '../../../../services/portefeuilles/dto-portefeuille.interface';
import {TranslatePipe} from '@ngx-translate/core';

@Component({
  selector: 'app-configuration-portefeuille',
  imports: [
    TranslatePipe
  ],
  templateUrl: './configuration-portefeuille.component.html',
  styleUrl: './configuration-portefeuille.component.sass'
})
export class ConfigurationPortefeuilleComponent {
  // input/output
  inputPortefeuille: InputSignal<DTOPortefeuille | undefined> = input(undefined,
    {transform: o => this.intercepteurPortefeuille(o), alias: 'portefeuille'});

  // données pour la vue
  portefeuille: DTOPortefeuille | undefined;

  private intercepteurPortefeuille(portefeuille: DTOPortefeuille | undefined) {
    this.portefeuille = portefeuille;
    return portefeuille;
  }

  tickers(portefeuille: DTOPortefeuille) {
    if (portefeuille.tickers.length > 0) {
      return portefeuille.tickers.reduce((t1, t2) => t1 + ', ' + t2);
    }
    return '';
  }
}
