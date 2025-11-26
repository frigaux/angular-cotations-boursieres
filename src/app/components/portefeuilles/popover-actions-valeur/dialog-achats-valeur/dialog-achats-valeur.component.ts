import {Component} from '@angular/core';
import {AchatsValeurComponent} from '../../../valeurs/achats-valeur/achats-valeur.component';
import {TranslatePipe} from '@ngx-translate/core';
import {Dialog} from 'primeng/dialog';

@Component({
  selector: 'app-dialog-achats-valeur',
  imports: [
    AchatsValeurComponent,
    Dialog,
    TranslatePipe
  ],
  templateUrl: './dialog-achats-valeur.component.html',
  styleUrl: './dialog-achats-valeur.component.sass'
})
export class DialogAchatsValeurComponent {
  // données pour la vue
  visible: boolean = false;
  valeur?: { ticker: string, libelle: string, prixParDefaut: number };

  public afficherAchats(valeur: { ticker: string, libelle: string, prixParDefaut: number }) {
    this.valeur = valeur;
    this.visible = true;
  }
}
