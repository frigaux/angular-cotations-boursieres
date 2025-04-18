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
  }
}
