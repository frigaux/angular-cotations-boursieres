import {Component, WritableSignal} from '@angular/core';
import {Dialog} from 'primeng/dialog';
import {DTOActualiteTicker} from '../../../services/abc-bourse/dto-actualite-ticker.class';
import {AbcBourseService} from '../../../services/abc-bourse/abc-bourse.service';
import {LoaderComponent} from '../../loader/loader.component';
import {DTOInformation} from '../../../services/boursorama/dto-information.interface';
import {BoursoramaService} from '../../../services/boursorama/boursorama.service';
import {DTOActualitesZoneBourse} from '../../../services/zone-bourse/dto-actualites-zone-bourse.interface';
import {Observable} from 'rxjs';
import {ZoneBourseService} from '../../../services/zone-bourse/zone-bourse.service';

@Component({
  selector: 'app-dialog-charger-lien',
  imports: [
    Dialog,
    LoaderComponent
  ],
  templateUrl: './dialog-charger-lien.component.html',
  styleUrl: './dialog-charger-lien.component.sass'
})
export class DialogChargerLienComponent {
  // données pour la vue
  loading: boolean = false;
  visible: boolean | WritableSignal<boolean> = false;
  actualite?: DTOActualiteTicker | DTOInformation | DTOActualitesZoneBourse;
  html?: string;

  constructor(private abcBourseService: AbcBourseService,
              private boursoramaService: BoursoramaService,
              private zoneBourseService: ZoneBourseService) {
  }

  afficherActualiteABCBourse(actualite: DTOActualiteTicker) {
    this.chargerEtAfficher(actualite, (pathname: string) => this.abcBourseService.chargerLien(pathname));
  }

  afficherInformationBoursorama(actualite: DTOInformation) {
    this.chargerEtAfficher(actualite, (pathname: string) => this.boursoramaService.chargerLien(pathname));
  }

  afficherActualiteZoneBourse(actualite: DTOActualitesZoneBourse) {
    this.chargerEtAfficher(actualite, (pathname: string) => this.zoneBourseService.chargerLien(pathname));
  }

  private chargerEtAfficher(actualite: DTOActualiteTicker | DTOInformation | DTOActualitesZoneBourse,
                            chargerLien: (pathname: string) => Observable<string>) {
    this.loading = true;
    this.visible = true;
    this.actualite = actualite;
    if (actualite) {
      chargerLien(actualite.pathname).subscribe({
        error: httpErrorResponse => {
          this.loading = false;
        },
        next: html => {
          this.html = html;
          this.loading = false;
        }
      });
    }
  }
}
