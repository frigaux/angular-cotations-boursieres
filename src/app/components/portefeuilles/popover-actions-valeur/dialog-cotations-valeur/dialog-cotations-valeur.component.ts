import {Component, viewChild} from '@angular/core';
import {Dialog} from 'primeng/dialog';
import {LoaderComponent} from '../../../loader/loader.component';
import {TableModule} from 'primeng/table';
import {TranslatePipe, TranslateService} from '@ngx-translate/core';
import {BoursoramaService} from '../../../../services/boursorama/boursorama.service';
import {UIChart} from 'primeng/chart';
import {Fieldset} from 'primeng/fieldset';
import {CotationsValeurBoursoramaDecore} from './cotations-valeur-boursorama-genere.class';
import {DialogChargerLienComponent} from '../../../commun/dialog-charger-lien/dialog-charger-lien.component';
import {DTOInformation} from '../../../../services/boursorama/dto-information.interface';
import {DTOValeur} from '../../../../services/boursorama/dto-valeur.interface';
import {FieldsetIndicateursComponent} from './fieldset-indicateurs/fieldset-indicateurs.component';
import {FieldsetCotationsComponent} from './fieldset-cotations/fieldset-cotations.component';
import {FieldsetActualitesComponent} from './fieldset-actualites/fieldset-actualites.component';
import {FieldsetAnalysesComponent} from './fieldset-analyses/fieldset-analyses.component';
import {FieldsetPrevisionsComponent} from './fieldset-previsions/fieldset-previsions.component';
import {DividendesService} from '../../../../services/dividendes/dividendes.service';

@Component({
  selector: 'app-dialog-cotations-valeur',
  imports: [
    Dialog,
    LoaderComponent,
    TableModule,
    TranslatePipe,
    UIChart,
    Fieldset,
    DialogChargerLienComponent,
    FieldsetIndicateursComponent,
    FieldsetCotationsComponent,
    FieldsetActualitesComponent,
    FieldsetAnalysesComponent,
    FieldsetPrevisionsComponent
  ],
  templateUrl: './dialog-cotations-valeur.component.html',
  styleUrls: ['./dialog-cotations-valeur.component.sass', '../../../commun/barre-superieure.sass']
})
export class DialogCotationsValeurComponent {
  private dialogChargerLienComponent = viewChild(DialogChargerLienComponent);

  // données pour la vue
  protected visible: boolean = false;
  protected loading: boolean = false;
  protected valeur?: DTOValeur;
  protected cotationsTickerDecore?: CotationsValeurBoursoramaDecore;

  constructor(private translateService: TranslateService,
              private dividendesService: DividendesService,
              private boursoramaService: BoursoramaService) {
  }

  public afficherCotationsTickerBoursoramaDecore(cotationsTickerDecore: CotationsValeurBoursoramaDecore) {
    this.visible = true;
    this.valeur = cotationsTickerDecore.dto.valeur;
    this.cotationsTickerDecore = cotationsTickerDecore;
  }

  protected fermer() {
    this.visible = false;
  }

  protected rafraichir() {
    if (this.valeur) {
      this.cotationsTickerDecore = undefined;
      this.visible = true;
      this.loading = true;
      this.boursoramaService.chargerInformationsTicker(this.valeur).subscribe({
          next:
            cotationsTickerBoursorama => {
              const dividendes = this.dividendesService.chargerParTicker(this.valeur!.ticker);
              this.cotationsTickerDecore = new CotationsValeurBoursoramaDecore(this.translateService, 0, cotationsTickerBoursorama, dividendes);
              this.loading = false;
            },
          error:
            httpErrorResponse => this.loading = false
        }
      )
    }
  }

  protected afficherInformation(information: DTOInformation) {
    this.dialogChargerLienComponent()?.afficherInformationBoursorama(information);
  }
}
