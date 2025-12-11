import {Component, OnInit} from '@angular/core';
import {
  DonneesService
} from '../../../services/modeles-tensor-flow/classification-supervisee-convolutive/donnees.service';
import {Donnees} from '../../../services/modeles-tensor-flow/classification-supervisee-convolutive/donnees.class';
import {LoaderComponent} from '../../loader/loader.component';

@Component({
  selector: 'app-classification-supervisee-convolutive',
  imports: [
    LoaderComponent
  ],
  templateUrl: './classification-supervisee-convolutive.component.html',
  styleUrl: './classification-supervisee-convolutive.component.sass',
})
export class ClassificationSuperviseeConvolutiveComponent implements OnInit {
  // données pour la vue
  loading: boolean = true;
  private donnees?: Donnees;

  constructor(private donneesService: DonneesService) {

  }

  ngOnInit(): void {
    this.donneesService.donneesImagesLibelles()
      .then(donnees => {
        this.donnees = donnees;
        this.loading = false;
        console.log(donnees);
      });
  }

}
