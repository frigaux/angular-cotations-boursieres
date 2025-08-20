import {Component, input, InputSignal} from '@angular/core';
import {DTOInformationsTicker} from '../../../services/abc-bourse/dto-informations-ticker.class';
import {AbcBourseService} from '../../../services/abc-bourse/abc-bourse.service';
import {JsonPipe} from '@angular/common';

@Component({
  selector: 'app-informations-ticker',
  imports: [
    JsonPipe
  ],
  templateUrl: './informations-ticker.component.html',
  styleUrl: './informations-ticker.component.sass'
})
export class InformationsTickerComponent {
  // chargement des informations pour le ticker
  loading: boolean = true;

  // input/output
  inputTicker: InputSignal<string | undefined> = input(undefined,
    {transform: o => this.intercepteurTicker(o), alias: 'ticker'});

  // données pour la vue
  informationsTicker?: DTOInformationsTicker;

  constructor(private abcBourseService: AbcBourseService) {
  }

  private intercepteurTicker(ticker: string | undefined) {
    if (ticker) {
      this.loading = true;
      this.abcBourseService.chargerInformationsTicker(ticker)
        .subscribe(dto => {
          this.informationsTicker = dto;
          this.loading = true;
        });
    }
    return ticker;
  }
}
