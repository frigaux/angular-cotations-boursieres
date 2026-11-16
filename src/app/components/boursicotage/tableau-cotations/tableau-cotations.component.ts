import {Component, Inject, input, InputSignal, LOCALE_ID} from '@angular/core';
import {EtapeValeur} from '../../valeurs/achats-valeur/etape-valeur.enum';
import {CotationsDecorees} from '../cotations-decorees.class';
import {CurrencyPipe, DecimalPipe, formatCurrency, formatDate, NgClass, PercentPipe} from '@angular/common';
import {ClassVariation} from '../../../directives/class-variation';
import {TranslatePipe, TranslateService} from '@ngx-translate/core';
import {FormsModule} from '@angular/forms';
import {InputNumber} from 'primeng/inputnumber';
import {JaugeComponent} from '../../commun/jauge/jauge.component';
import {DTOCotations} from '../../../services/yahoo/dto-cotations.interface';

@Component({
  selector: 'app-tableau-cotations',
  imports: [
    CurrencyPipe,
    PercentPipe,
    ClassVariation,
    DecimalPipe,
    TranslatePipe,
    FormsModule,
    InputNumber,
    JaugeComponent,
    NgClass
  ],
  templateUrl: './tableau-cotations.component.html',
  styleUrl: './tableau-cotations.component.sass',
})
export class TableauCotationsComponent {
  inputDTO: InputSignal<{
    cotations: CotationsDecorees[],
    etape?: EtapeValeur,
    seuilVariation: number
  } | undefined> = input(undefined,
    {transform: o => this.intercepteurDTO(o), alias: 'dto'});
  inputCotationsByTicker: InputSignal<Map<string, DTOCotations> | undefined> = input(undefined,
    {transform: o => this.intercepteurCotationsByTicker(o), alias: 'cotationsByTicker'});

  // données pour la vue
  protected readonly EtapeValeur = EtapeValeur;
  protected cotations?: CotationsDecorees[];
  protected etape?: EtapeValeur;
  protected seuilVariation?: number;

  constructor(private translateService: TranslateService,
              @Inject(LOCALE_ID) private locale: string) {
  }

  private intercepteurDTO(dto: {
    cotations: CotationsDecorees[],
    etape?: EtapeValeur,
    seuilVariation: number
  } | undefined) {
    if (dto) {
      this.cotations = dto.cotations;
      this.etape = dto.etape;
      this.seuilVariation = dto.seuilVariation;
    } else {
      this.cotations = undefined;
      this.etape = undefined;
      this.seuilVariation = undefined;
    }
    return dto;
  }

  private intercepteurCotationsByTicker(cotationsByTicker: Map<string, DTOCotations> | undefined) {
    if (cotationsByTicker && this.cotations) {
      this.cotations.forEach(cotationsDecorees => {
        const ticker = cotationsDecorees.valeur.ticker;
        if (cotationsByTicker.has(ticker)) {
          cotationsDecorees.cotations.push(cotationsByTicker.get(ticker)!);
        }
      });
      this.construireVue();
    }
    return cotationsByTicker;
  }

  private construireVue() {
    this.cotations?.forEach(cotationsDecorees => {
      this.calculerVariationCours(cotationsDecorees);
      this.calculerVariationAchat(cotationsDecorees);
    });
  }

  private calculerVariationCours(cotationsDecorees: CotationsDecorees) {
    if (cotationsDecorees.cotations.length > 1) {
      const c1 = cotationsDecorees.cotations[cotationsDecorees.cotations.length - 2];
      const c2 = cotationsDecorees.cotations[cotationsDecorees.cotations.length - 1];
      cotationsDecorees.variationDernierCours = (c2.cours / c1.cours) - 1;
      cotationsDecorees.notifierVariationDernierCours = false;
      if (this.seuilVariation) {
        if (cotationsDecorees.variationDernierCours >= this.seuilVariation) {
          cotationsDecorees.notifierVariationDernierCours = true;
          this.translateService.instant('COMPOSANTS.BOURSICOTAGE.TABLEAU_COTATIONS.VARIATION_HAUSSE',
            {'variation': cotationsDecorees.variationDernierCours, 'heure': this.heureCourante()});
        }
        if (cotationsDecorees.variationDernierCours <= -this.seuilVariation) {
          cotationsDecorees.notifierVariationDernierCours = true;
          this.translateService.instant('COMPOSANTS.BOURSICOTAGE.TABLEAU_COTATIONS.VARIATION_BAISSE',
            {'variation': cotationsDecorees.variationDernierCours, 'heure': this.heureCourante()});
        }
      }
      cotationsDecorees.notifierSeuilCours = false;
      if (cotationsDecorees.seuilCours) {
        if (c1.cours <= cotationsDecorees.seuilCours && cotationsDecorees.seuilCours <= c2.cours) {
          cotationsDecorees.notifierSeuilCours = true;
          this.translateService.instant('COMPOSANTS.BOURSICOTAGE.TABLEAU_COTATIONS.COURS_HAUSSE',
            {'cours': formatCurrency(c2.cours, this.locale, 'EUR'), 'heure': this.heureCourante()});
        }
        if (c2.cours <= cotationsDecorees.seuilCours && cotationsDecorees.seuilCours <= c1.cours) {
          cotationsDecorees.notifierSeuilCours = true;
          this.translateService.instant('COMPOSANTS.BOURSICOTAGE.TABLEAU_COTATIONS.COURS_BAISSE',
            {'cours': formatCurrency(c2.cours, this.locale, 'EUR'), 'heure': this.heureCourante()});
        }
      }
    }
  }

  private heureCourante(): string {
    return formatDate(new Date(), 'HH:mm:ss', this.locale);
  }

  private calculerVariationAchat(cotationsDecorees: CotationsDecorees) {
    if (cotationsDecorees.cotations.length > 0) {
      const achat = cotationsDecorees.achat;
      const cotations = cotationsDecorees.cotations[cotationsDecorees.cotations.length - 1];
      switch (this.etape) {
        case EtapeValeur.ORDRE_ACHAT:
          cotationsDecorees.variationAchat = (achat!.prix / cotations.cours) - 1;
          break;
        case EtapeValeur.ACHAT:
          cotationsDecorees.variationAchat = (cotations.cours / achat!.prix) - 1;
          break;
        case EtapeValeur.ORDRE_VENTE:
          cotationsDecorees.variationAchat = (cotations.cours / achat!.prixRevente!) - 1;
          break;
      }
    }
  }
}
