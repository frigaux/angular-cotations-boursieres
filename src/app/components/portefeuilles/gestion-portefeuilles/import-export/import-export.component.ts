import {Component} from '@angular/core';
import {TranslatePipe} from "@ngx-translate/core";
import {PortefeuillesService} from '../../../../services/portefeuilles/portefeuilles.service';

@Component({
  selector: 'app-import-export',
  imports: [
    TranslatePipe
  ],
  templateUrl: './import-export.component.html',
  styleUrl: './import-export.component.sass'
})
export class ImportExportComponent {

  constructor(private portefeuillesService: PortefeuillesService) {

  }

  exporter() {
    navigator.clipboard.writeText(this.portefeuillesService.export());
  }

  importer() {
    navigator.clipboard.readText().then(json => this.portefeuillesService.import(json));
  }
}
