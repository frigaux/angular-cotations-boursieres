import {Component} from '@angular/core';
import {ValeursService} from '../../services/valeurs.service';
import {TableModule} from 'primeng/table';
import {CommonModule} from '@angular/common';
import {DTOValeur} from '../../services/DTOValeur';
import {TranslatePipe} from '@ngx-translate/core';

@Component({
  selector: 'app-valeurs',
  imports: [TableModule, CommonModule, TranslatePipe],
  templateUrl: './valeurs.component.html',
  styleUrl: './valeurs.component.sass'
})
export class ValeursComponent {
  valeurs!: DTOValeur[];
  loading: boolean = true;

  constructor(private valeursService: ValeursService) {
  }

  ngOnInit(): void {
    this.valeursService.getValeurs().subscribe({
      next: valeurs => {
        this.valeurs = valeurs;
        this.loading = false;
      }
    });
  }
}
