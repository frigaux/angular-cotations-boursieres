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
  inputDTO: InputSignal<{ libelle: string, aPropos: string } | undefined> = input(undefined, {
    transform: dto => this.intercepteurDTO(dto), alias: 'dto'
  });

  // données pour la vue
  visible: boolean = false;
  libelle?: string;
  aPropos?: string;

  private intercepteurDTO(dto: { libelle: string, aPropos: string } | undefined) {
    if (dto) {
      this.libelle = dto.libelle;
      this.aPropos = dto.aPropos;
    }
    return dto;
  }

  protected ouvrir(event: MouseEvent) {
    event.stopImmediatePropagation();
    this.visible = true
  }
}
