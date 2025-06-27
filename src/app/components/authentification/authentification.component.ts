import {Component, OnInit} from '@angular/core';
import {NgSwitch, NgSwitchCase} from '@angular/common';

import {Dialog} from 'primeng/dialog';
import {ProgressBar} from 'primeng/progressbar';
import {AuthentificationService} from '../../services/authentification/authentification.service';
import {Statut} from './statut.enum';
import {TranslatePipe} from "@ngx-translate/core";
import {Router} from '@angular/router';
import {PortefeuillesService} from '../../services/portefeuilles/portefeuilles.service';

@Component({
  selector: 'app-authentification',
  imports: [Dialog, ProgressBar, NgSwitch, NgSwitchCase, TranslatePipe],
  templateUrl: './authentification.component.html',
  styleUrl: './authentification.component.sass'
})
export class AuthentificationComponent implements OnInit {
  statut: Statut = Statut.AUTHENTIFICATION;
  messageErreur: string | undefined;
  enumStatut = Statut;

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
        this.messageErreur = `${httpResponseError.url} => ${httpResponseError.status}`;
        this.statut = Statut.ERREUR;
      },
      complete: () => {
        this.statut = Statut.SUCCES;
        if (this.portefeuillesService.auMoinsUnPortefeuilleCorrectementConfigure()) {
          this.router.navigate(['portefeuilles']);
        }
      }
    });
  }
}
