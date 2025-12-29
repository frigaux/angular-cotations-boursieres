import {Component, model, OnInit} from '@angular/core';
import {FloatLabel} from "primeng/floatlabel";
import {InputNumber} from "primeng/inputnumber";
import {Select} from "primeng/select";
import {TranslatePipe} from "@ngx-translate/core";
import * as tf from '@tensorflow/tfjs';
import {FormsModule} from '@angular/forms';
import {ParametresModele} from './parametres-modele.interface';

@Component({
  selector: 'app-formulaire-modele',
  imports: [
    FloatLabel,
    InputNumber,
    Select,
    TranslatePipe,
    FormsModule
  ],
  templateUrl: './formulaire-modele.component.html',
  styleUrl: './formulaire-modele.component.sass',
})
export class FormulaireModeleComponent implements OnInit {
  parametres = model<ParametresModele>();

  // nombre de tenseur en mémoire
  protected nombreTenseurs?: number;

  // choix backend
  protected backends: Array<string> = ['cpu', 'webgl']; // 'tensorflow' (requires tfjs-node), 'wasm' (requires tfjs-backend-wasm).
  protected backend: string = this.backends[0];
  protected backendChangeAvecSucces?: boolean;

  ngOnInit(): void {
    this.changeBackend();
    window.setInterval(() => this.nombreTenseurs = tf.memory().numTensors, 1000);
  }

  protected changeBackend() {
    this.backendChangeAvecSucces = false;
    tf.setBackend(this.backend).then(success => {
      this.backendChangeAvecSucces = true;
    });
  }
}
