import {Component, input, InputSignal} from '@angular/core';
import {Dialog} from 'primeng/dialog';
import {TranslatePipe} from '@ngx-translate/core';
import {Cours} from '../cours.class';

@Component({
  selector: 'app-dialog-apropos',
  imports: [
    Dialog,
    TranslatePipe
  ],
  templateUrl: './dialog-apropos.component.html',
  styleUrl: './dialog-apropos.component.sass',
})
export class DialogAproposComponent {
  // input/output
  inputCours: InputSignal<{ cours: Cours, aPropos: string } | undefined> = input(undefined, {
    transform: dto => this.intercepteurCours(dto), alias: 'cours'
  });

  // données pour la vue
  visible: boolean = false;
  cours?: Cours;
  aPropos?: string;

  private intercepteurCours(dto: { cours: Cours, aPropos: string } | undefined) {
    if (dto) {
      this.cours = dto.cours;
      this.aPropos = dto.aPropos;
    }
    return dto;
  }

  protected ouvrir(event: MouseEvent) {
    event.stopImmediatePropagation();
    this.visible = true
  }
}
