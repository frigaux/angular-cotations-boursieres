import {Component, input, InputSignal, WritableSignal} from '@angular/core';
import {Dialog} from 'primeng/dialog';
import {DTOActualiteTicker} from '../../../../services/abc-bourse/dto-actualite-ticker.class';
import {AbcBourseService} from '../../../../services/abc-bourse/abc-bourse.service';

@Component({
  selector: 'app-actualite-ticker',
  imports: [
    Dialog
  ],
  templateUrl: './actualite-ticker.component.html',
  styleUrl: './actualite-ticker.component.sass'
})
export class ActualiteTickerComponent {
  // input/output
  inputActualite: InputSignal<DTOActualiteTicker | undefined> = input(undefined,
    {transform: o => this.intercepteurActualite(o), alias: 'actualite'});

  // données pour la vue
  visible: boolean | WritableSignal<boolean> = false;
  actualite?: DTOActualiteTicker;
  html?: string;

  constructor(private abcBourseService: AbcBourseService) {
  }

  private intercepteurActualite(actualite: DTOActualiteTicker | undefined) {
    this.actualite = actualite;
    if (actualite) {
      this.abcBourseService.chargerActualiteTicker(actualite).subscribe({
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
