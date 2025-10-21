import {Component, model, output} from '@angular/core';
import {Dialog} from 'primeng/dialog';
import {TranslatePipe} from '@ngx-translate/core';
import {Button} from 'primeng/button';
import {Checkbox} from 'primeng/checkbox';
import {FormsModule} from '@angular/forms';
import {DTORestauration} from './dto-restauration.class';

@Component({
  selector: 'app-dialog-restauration',
  imports: [
    Dialog,
    TranslatePipe,
    Button,
    Checkbox,
    FormsModule
  ],
  templateUrl: './dialog-restauration.component.html',
  styleUrls: ['./dialog-restauration.component.sass', '../dialog-sauvegarde/dialog-sauvegarde.component.sass']
})
export class DialogRestauration {
  visible = model<boolean>(false);
  outputRestauration = output<DTORestauration>({alias: 'restauration'});
  dtoRestauration: DTORestauration = new DTORestauration();

  restaurer() {
    this.visible.set(false);
    this.outputRestauration.emit(this.dtoRestauration);
  }
}
