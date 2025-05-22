import {Component, OnInit} from '@angular/core';
import {NgIf} from "@angular/common";
import {ProgressBar} from "primeng/progressbar";
import {SelecteurValeursComponent} from "./selecteur-valeurs/selecteur-valeurs.component";

@Component({
  selector: 'app-gestion-portefeuilles',
    imports: [
        NgIf,
        ProgressBar,
        SelecteurValeursComponent
    ],
  templateUrl: './gestion-portefeuilles.component.html',
  styleUrl: './gestion-portefeuilles.component.sass'
})
export class GestionPortefeuillesComponent implements OnInit {
  // chargement des cours
  loading: boolean = false;

  constructor() {
  }

  ngOnInit(): void {
  }
}
