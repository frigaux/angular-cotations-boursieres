import { Component } from '@angular/core';
import { ValeursService } from '../../services/valeurs.service';

@Component({
  selector: 'app-valeurs',
  imports: [],
  templateUrl: './valeurs.component.html',
  styleUrl: './valeurs.component.sass'
})
export class ValeursComponent {
  constructor(private valeursService: ValeursService) { }

  ngOnInit(): void {
    this.valeursService.getValeurs().subscribe({
      error: httpResponseError => {
        console.log(httpResponseError);
      },
      next: valeurs => {
        console.log('valeurs', valeurs);
      }
    });
  }
}
