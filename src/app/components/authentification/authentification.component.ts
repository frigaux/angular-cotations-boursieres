import {Component, OnInit} from '@angular/core';

import {Dialog} from 'primeng/dialog';
import {ProgressBar} from 'primeng/progressbar';
import {AuthentificationService} from '../../services/authentification/authentification.service';
import {Statuts} from './statuts.enum';
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
  statut: Statuts = Statuts.AUTHENTIFICATION;
  messageErreur: string | undefined;
  enumStatut = Statuts;

  constructor(private authentificationService: AuthentificationService,
              private portefeuillesService: PortefeuillesService,
              private router: Router) {
  }

  ngOnInit(): void {
    this.authentifier();
  }

  authentifier(): void {
    this.authentificationService.authentifier().subscribe({
      error: httpResponseError => {
        this.messageErreur = `${httpResponseError.message}`;
        this.statut = Statuts.ERREUR;
      },
      complete: () => {
        this.statut = Statuts.SUCCES;
        if (this.portefeuillesService.auMoinsUnPortefeuilleCorrectementConfigure()) {
          this.router.navigate(['portefeuilles']);
        }
      }
    });
  }
}
