import {Component, OnInit} from '@angular/core';
import {InputNumber} from 'primeng/inputnumber';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {FloatLabel} from 'primeng/floatlabel';
import {TranslatePipe} from '@ngx-translate/core';
import {Select} from 'primeng/select';
import {PortefeuillesService} from '../../services/portefeuilles/portefeuilles.service';
import {DTOPortefeuille} from '../../services/portefeuilles/dto-portefeuille.interface';

@Component({
  selector: 'app-boursicotage',
  imports: [
    InputNumber,
    ReactiveFormsModule,
    FormsModule,
    FloatLabel,
    TranslatePipe,
    Select
  ],
  templateUrl: './boursicotage.component.html',
  styleUrl: './boursicotage.component.sass',
})
export class BoursicotageComponent implements OnInit {
  // formulaire
  protected delaiRafraichissement: number = 60;
  protected alerteVariation: number = 1;
  protected portefeuille?: DTOPortefeuille;

  // données pour la vue
  protected portefeuilles?: Array<DTOPortefeuille>;

  constructor(private portefeuillesService: PortefeuillesService) {
  }

  ngOnInit(): void {
    this.portefeuilles = this.portefeuillesService.charger();
  }


}
