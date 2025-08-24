import {Component, input, InputSignal, WritableSignal} from '@angular/core';
import {Dialog} from 'primeng/dialog';
import {DTOActualite} from '../../../../services/abc-bourse/dto-actualite.class';
import {AbcBourseService} from '../../../../services/abc-bourse/abc-bourse.service';

@Component({
  selector: 'app-actualite',
  imports: [
    Dialog
  ],
  templateUrl: './actualite.component.html',
  styleUrl: './actualite.component.sass'
})
export class ActualiteComponent {
  // input/output
  inputActualite: InputSignal<DTOActualite | undefined> = input(undefined,
    {transform: o => this.intercepteurActualite(o), alias: 'actualite'});

  // données pour la vue
  visible: boolean | WritableSignal<boolean> = false;
  actualite?: DTOActualite;
  html?: string;

  constructor(private abcBourseService: AbcBourseService) {
  }

  private intercepteurActualite(actualite: DTOActualite | undefined) {
    this.actualite = actualite;
    if (actualite) {
      this.abcBourseService.chargerActualite(actualite).subscribe({
        error: httpResponseError => {
        },
        next: html => {
          this.html = html;
          this.visible = true;
        }
      });
    }
    return actualite;
  }
}
