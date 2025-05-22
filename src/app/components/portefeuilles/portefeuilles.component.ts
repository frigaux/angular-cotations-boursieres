import {Component, OnInit} from '@angular/core';
import {NgIf} from '@angular/common';
import {ProgressBar} from 'primeng/progressbar';

@Component({
  selector: 'app-portefeuilles',
  imports: [
    NgIf,
    ProgressBar
  ],
  templateUrl: './portefeuilles.component.html',
  styleUrl: './portefeuilles.component.sass'
})
export class PortefeuillesComponent implements OnInit {
  // chargement des cours
  loading: boolean = false;

  constructor() {
  }

  ngOnInit(): void {
  }
}
