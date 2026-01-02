import {Component, OnInit} from '@angular/core';
import * as tf from '@tensorflow/tfjs';
import {TranslatePipe} from '@ngx-translate/core';

@Component({
  selector: 'app-nombre-tenseurs',
  imports: [
    TranslatePipe
  ],
  templateUrl: './nombre-tenseurs.html',
  styleUrl: './nombre-tenseurs.sass',
})
export class NombreTenseurs implements OnInit {

  // nombre de tenseur en mémoire
  protected nombreTenseurs?: number;

  ngOnInit(): void {
    window.setInterval(() => this.nombreTenseurs = tf.memory().numTensors, 1000);
  }

}
