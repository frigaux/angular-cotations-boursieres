import {Component, model, output} from '@angular/core';
import {Dialog} from 'primeng/dialog';
import {Button} from 'primeng/button';
import {FormsModule} from '@angular/forms';
import {TranslatePipe} from '@ngx-translate/core';

@Component({
  selector: 'app-dialog-sauvegarde',
  imports: [
    Dialog,
    Button,
    FormsModule,
    TranslatePipe
  ],
  templateUrl: './dialog-sauvegarde.component.html',
  styleUrl: './dialog-sauvegarde.component.sass'
})
export class DialogSauvegarde {
  visible = model<boolean>(false);
  outputSauvegarde = output<void>({alias: 'sauvegarde'});

  sauvegarder() {
    this.visible.set(false);
    this.outputSauvegarde.emit();
  }
}
