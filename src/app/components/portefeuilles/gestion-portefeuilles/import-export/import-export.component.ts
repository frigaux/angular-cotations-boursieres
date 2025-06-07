import {Component} from '@angular/core';
import {TranslatePipe} from "@ngx-translate/core";
import {PortefeuillesService} from '../../../../services/portefeuilles/portefeuilles.service';
import {Dialog} from 'primeng/dialog';
import {FormsModule} from '@angular/forms';
import {Button} from 'primeng/button';
import {NgClass} from '@angular/common';

@Component({
  selector: 'app-import-export',
  imports: [
    TranslatePipe,
    Dialog,
    FormsModule,
    Button,
    NgClass
  ],
  templateUrl: './import-export.component.html',
  styleUrl: './import-export.component.sass'
})
export class ImportExportComponent {
  visible: boolean = false;
  configurationPortefeuilles: string = '';
  importEchoue: boolean = false;

  constructor(private portefeuillesService: PortefeuillesService) {

  }

  reinitialiser() {
    this.configurationPortefeuilles = '';
    this.importEchoue = false;
  }

  exporter() {
    this.configurationPortefeuilles = this.portefeuillesService.export();
  }

  importer() {
    this.importEchoue = !this.portefeuillesService.import(this.configurationPortefeuilles);
    if (!this.importEchoue) {
      this.visible = false;
    }
  }
}
