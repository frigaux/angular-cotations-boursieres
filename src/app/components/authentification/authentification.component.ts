import { Component } from '@angular/core';
import { NgSwitch, NgSwitchCase } from '@angular/common';

import { Dialog } from 'primeng/dialog';
import { ProgressBar } from 'primeng/progressbar';
import { AuthentificationService } from '../../services/authentification.service';
import { Statut } from './statut';

@Component({
  selector: 'app-authentification',
  imports: [Dialog, ProgressBar, NgSwitch, NgSwitchCase],
  templateUrl: './authentification.component.html',
  styleUrl: './authentification.component.sass'
})
export class AuthentificationComponent {
  statut: Statut = Statut.AUTHENTIFICATION;
  messageErreur: string | undefined;
  enumStatut = Statut;

  constructor(private authentificationService: AuthentificationService) { }

  ngOnInit(): void {
    this.authentificationService.authentifier().subscribe({
      error: httpResponseError => {
        this.messageErreur = `${httpResponseError.url} => ${httpResponseError.status}`;
        this.statut = Statut.ERREUR;
      },
      complete: () => this.statut = Statut.SUCCES
    });
  }
}
