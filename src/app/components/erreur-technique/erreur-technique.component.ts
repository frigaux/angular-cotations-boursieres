import {Component} from '@angular/core';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-erreur-technique',
  imports: [],
  templateUrl: './erreur-technique.component.html',
  styleUrl: './erreur-technique.component.sass'
})
export class ErreurTechniqueComponent {
  message: string;

  constructor(private route: ActivatedRoute) {
    this.message = this.route.snapshot.queryParams['message'];
  }
}
