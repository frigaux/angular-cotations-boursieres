import {Component, WritableSignal} from '@angular/core';
import {Dialog} from 'primeng/dialog';
import {DTOActualiteTicker} from '../../../services/abc-bourse/dto-actualite-ticker.class';
import {AbcBourseService} from '../../../services/abc-bourse/abc-bourse.service';
import {LoaderComponent} from '../../loader/loader.component';
import {DTOInformation} from '../../../services/boursorama/dto-information.interface';
import {BoursoramaService} from '../../../services/boursorama/boursorama.service';

@Component({
  selector: 'app-dialog-actualite-valeur',
  imports: [
    Dialog,
    LoaderComponent
  ],
  templateUrl: './dialog-actualite-valeur.component.html',
  styleUrl: './dialog-actualite-valeur.component.sass'
})
export class DialogActualiteValeurComponent {
  // données pour la vue
  loading: boolean = false;
  visible: boolean | WritableSignal<boolean> = false;
  actualite?: DTOActualiteTicker | DTOInformation;
  html?: string;

  constructor(private abcBourseService: AbcBourseService,
              private boursoramaService: BoursoramaService) {
  }

  afficherActualiteABCBourse(actualite: DTOActualiteTicker) {
    this.loading = true;
    this.visible = true;
    this.actualite = actualite;
    if (actualite) {
      this.abcBourseService.chargerLien(actualite.pathname).subscribe({
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

  afficherInformationBoursorama(actualite: DTOInformation) {
    this.loading = true;
    this.visible = true;
    this.actualite = actualite;
    if (actualite) {
      this.boursoramaService.chargerLien(actualite.pathname).subscribe({
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
