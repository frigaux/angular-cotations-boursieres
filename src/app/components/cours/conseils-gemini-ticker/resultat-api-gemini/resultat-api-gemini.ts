import {Component, input, InputSignal} from '@angular/core';
import {CurrencyPipe} from "@angular/common";
import {TranslatePipe} from "@ngx-translate/core";
import {DTOConseilsGeminiTicker} from '../../../../services/IA/dto-conseils-gemini-ticker.class';

@Component({
  selector: 'app-resultat-api-gemini',
  imports: [
    CurrencyPipe,
    TranslatePipe
  ],
  templateUrl: './resultat-api-gemini.html',
  styleUrl: './resultat-api-gemini.sass'
})
export class ResultatApiGemini {
  // input/output
  inputDTO: InputSignal<DTOConseilsGeminiTicker | undefined> = input(undefined,
    {transform: o => this.intercepteurDTOConseilsGeminiTicker(o), alias: 'dto'});

  // données pour la vue
  conseilsGeminiTicker?: DTOConseilsGeminiTicker;

  private intercepteurDTOConseilsGeminiTicker(dto: DTOConseilsGeminiTicker | undefined) {
    this.conseilsGeminiTicker = dto;
    return dto;
  }
}
