import { Component } from '@angular/core';

import { Dialog } from 'primeng/dialog';
import { ProgressBar } from 'primeng/progressbar';

@Component({
  selector: 'app-authentification',
  imports: [Dialog, ProgressBar],
  templateUrl: './authentification.component.html',
  styleUrl: './authentification.component.sass'
})
export class AuthentificationComponent {
  // TODO : appeler le WS d'authent ; observable qui route vers la route par défaut
  ngOnInit(): void {
  }
}
