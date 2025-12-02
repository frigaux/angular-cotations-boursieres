import {Component, OnInit} from '@angular/core';

import {Dialog} from 'primeng/dialog';
import {ProgressBar} from 'primeng/progressbar';
import {AuthentificationService} from '../../services/authentification/authentification.service';
import {StatutAuthentification} from './statuts.enum';
import {TranslatePipe} from "@ngx-translate/core";
import {Router} from '@angular/router';
import {PortefeuillesService} from '../../services/portefeuilles/portefeuilles.service';

@Component({
  selector: 'app-authentification',
  imports: [Dialog, ProgressBar, TranslatePipe],
  templateUrl: './authentification.component.html',
  styleUrl: './authentification.component.sass'
})
export class AuthentificationComponent implements OnInit {
  statut: StatutAuthentification = StatutAuthentification.AUTHENTIFICATION;
  messageErreur: string | undefined;
  enumStatut = StatutAuthentification;

  constructor(private authentificationService: AuthentificationService,
              private portefeuillesService: PortefeuillesService,
              private router: Router) {
  }

  ngOnInit(): void {
    this.authentifier();
  }

  authentifier(): void {
    this.authentificationService.authentifier().subscribe({
      error: httpErrorResponse => {
        this.messageErreur = `${httpErrorResponse.message}`;
        this.statut = StatutAuthentification.ERREUR;
      },
      complete: () => {
        this.statut = StatutAuthentification.SUCCES;
        if (this.portefeuillesService.auMoinsUnPortefeuilleCorrectementConfigure()) {
          this.router.navigate(['portefeuilles']);
        }
      }
    });
  }
}
