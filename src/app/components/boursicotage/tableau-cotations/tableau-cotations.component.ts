import {Component, input, InputSignal, output} from '@angular/core';
import {EtapeValeur} from '../../valeurs/achats-valeur/etape-valeur.enum';
import {CotationsDecorees} from '../cotations-decorees.class';
import {CurrencyPipe, DatePipe, NgClass, PercentPipe} from '@angular/common';
import {ClassVariation} from '../../../directives/class-variation';
import {TranslatePipe, TranslateService} from '@ngx-translate/core';
import {FormsModule} from '@angular/forms';
import {InputNumber} from 'primeng/inputnumber';
import {JaugeComponent} from '../../commun/jauge/jauge.component';
import {Tooltip} from 'primeng/tooltip';
import {DTOCotations} from '../../../services/bourse-direct/dto-cotations.interface';
import {BoursicotageComponent} from '../boursicotage.component';
import {LocalNotifications} from '@capacitor/local-notifications';
import {Capacitor} from '@capacitor/core';
import {BoursoramaService} from '../../../services/boursorama/boursorama.service';

@Component({
  selector: 'app-tableau-cotations',
  imports: [
    CurrencyPipe,
    PercentPipe,
    ClassVariation,
    TranslatePipe,
    FormsModule,
    InputNumber,
    JaugeComponent,
    NgClass,
    Tooltip
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
  inputTailleReduite: InputSignal<boolean | undefined> = input(undefined,
    {transform: o => this.intercepteurTailleReduite(o), alias: 'tailleReduite'});
  libelleClique = output<CotationsDecorees>();
  achatClique = output<CotationsDecorees>();

  // données pour la vue
  protected readonly EtapeValeur = EtapeValeur;
  protected cotations?: CotationsDecorees[];
  protected etape?: EtapeValeur;
  protected seuilVariation?: number;
  protected tailleReduite: boolean = false;
  protected readonly BoursicotageComponent = BoursicotageComponent;
  protected readonly BoursoramaService = BoursoramaService;

  // private
  private numberFormatToCurrency = new Intl.NumberFormat('fr-FR', {style: 'currency', currency: 'EUR'});
  private formatCurrency: Function = (value: number) => this.numberFormatToCurrency.format(value);

  constructor(private translateService: TranslateService,
              private datepipe: DatePipe,
              private percentPipe: PercentPipe) {
  }

  private intercepteurDTO(dto: {
    cotations: CotationsDecorees[],
    etape?: EtapeValeur,
    seuilVariation: number
  } | undefined) {
    if (dto) {
      this.cotations = dto.cotations
        .sort((c1, c2) => c1.valeur.libelle.localeCompare(c2.valeur.libelle));
      this.etape = dto.etape;
      this.seuilVariation = dto.seuilVariation;
      this.calculerJaugePeriode();
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
          // nettoyage des anciens DTOCotations
          cotationsDecorees.cotations.forEach(cotation => {
            cotation.jour = undefined;
          })
          cotationsDecorees.cotations.push(cotationsByTicker.get(ticker)!);
        }
      });
      this.construireVue();
    }
    return cotationsByTicker;
  }

  private intercepteurTailleReduite(tailleReduite?: boolean) {
    this.tailleReduite = tailleReduite ? tailleReduite : false;
    return tailleReduite;
  }

  private construireVue() {
    this.cotations?.forEach(cotationsDecorees => {
      this.calculerVariationCours(cotationsDecorees);
      this.calculerVariationAchat(cotationsDecorees);
      this.notificationsVariation(cotationsDecorees);
      this.iconeVariationPrecedent(cotationsDecorees);
      this.notificationsCours(cotationsDecorees);
    });
  }

  private calculerVariationCours(cotationsDecorees: CotationsDecorees) {
    if (cotationsDecorees.cotations.length > 1) {
      const premier = cotationsDecorees.cotations[0];
      const avantDernier = cotationsDecorees.cotations[cotationsDecorees.cotations.length - 2];
      const dernier = cotationsDecorees.cotations[cotationsDecorees.cotations.length - 1];
      cotationsDecorees.variationPrecedent = (dernier.cours / avantDernier.cours) - 1;
      cotationsDecorees.variationOuverture = (dernier.cours / premier.cours) - 1;
    }
  }

  private notificationsCours(cotationsDecorees: CotationsDecorees) {
    if (cotationsDecorees.cotations.length > 1) {
      const avantDernier = cotationsDecorees.cotations[cotationsDecorees.cotations.length - 2];
      const dernier = cotationsDecorees.cotations[cotationsDecorees.cotations.length - 1];
      cotationsDecorees.notifierSeuilCours = false;
      if (cotationsDecorees.seuilCours) {
        if (avantDernier.cours <= cotationsDecorees.seuilCours && cotationsDecorees.seuilCours <= dernier.cours) {
          cotationsDecorees.notifierSeuilCours = true;
          cotationsDecorees.notifications.push(
            this.translateService.instant('COMPOSANTS.BOURSICOTAGE.TABLEAU_COTATIONS.COURS_HAUSSE',
              {'cours': this.formatCurrency(dernier.cours), 'heure': this.heureCourante()}));
          this.notifierDerniereNotificationSurAndroid(cotationsDecorees);
        }
        if (dernier.cours <= cotationsDecorees.seuilCours && cotationsDecorees.seuilCours <= avantDernier.cours) {
          cotationsDecorees.notifierSeuilCours = true;
          cotationsDecorees.notifications.push(this.translateService.instant('COMPOSANTS.BOURSICOTAGE.TABLEAU_COTATIONS.COURS_BAISSE',
            {'cours': this.formatCurrency(dernier.cours), 'heure': this.heureCourante()}));
          this.notifierDerniereNotificationSurAndroid(cotationsDecorees);
        }
      }
    }
  }

  private notificationsVariation(cotationsDecorees: CotationsDecorees) {
    cotationsDecorees.notifierVariationPrecedent = false;
    if (this.seuilVariation) {
      if (Math.abs(cotationsDecorees.variationPrecedent! * 100) >= this.seuilVariation) {
        cotationsDecorees.notifierVariationPrecedent = true;
        cotationsDecorees.notifications.push(this.translateService.instant('COMPOSANTS.BOURSICOTAGE.TABLEAU_COTATIONS.VARIATION',
          {
            'pourcentage': this.percentPipe.transform(cotationsDecorees.variationPrecedent, '1.2-2'),
            'heure': this.heureCourante()
          }));
        this.notifierDerniereNotificationSurAndroid(cotationsDecorees);
      }
    }
  }

  public iconeVariationPrecedent(cotationsDecorees: CotationsDecorees) {
    if (cotationsDecorees.variationPrecedent !== undefined) {
      if (cotationsDecorees.variationPrecedent == 0) {
        cotationsDecorees.iconeVariationPrecedent = 'pi-arrow-circle-right';
      } else if (cotationsDecorees.variationPrecedent > 0) {
        cotationsDecorees.iconeVariationPrecedent = 'pi-arrow-circle-up';
      } else {
        cotationsDecorees.iconeVariationPrecedent = 'pi-arrow-circle-down';
      }
    } else {
      cotationsDecorees.iconeVariationPrecedent = '';
    }
  }

  private heureCourante(): string {
    return this.datepipe.transform(new Date(), 'HH:mm:ss')!;
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

  private calculerJaugePeriode() {
    this.cotations?.forEach((cotationsDecorees) => {
      if (cotationsDecorees.cours && cotationsDecorees.cours.cours.length > 0) {
        const liste = cotationsDecorees.cours.cours;
        let plusBas = liste[0].cloture;
        let plusHaut = liste[0].cloture;
        liste.forEach((cours) => {
          if (plusBas > cours.cloture) {
            plusBas = cours.cloture;
          }
          if (plusHaut < cours.cloture) {
            plusHaut = cours.cloture;
          }
        });
        cotationsDecorees.plusBas = plusBas;
        cotationsDecorees.plusHaut = plusHaut;
      }
    });
  }

  protected supprimerNotification(cotationsDecorees: CotationsDecorees, indexCotation: number) {
    cotationsDecorees.notifications.splice(indexCotation, 1);
  }

  private notifierDerniereNotificationSurAndroid(cotationsDecorees: CotationsDecorees) {
    if (Capacitor.isNativePlatform() && cotationsDecorees.notifications.length > 0) {
      LocalNotifications.schedule({
        notifications: [
          {
            id: Math.floor(Date.now() % 2147483647),
            channelId: 'alertes_urgentes',
            title: cotationsDecorees.valeur.libelle,
            body: cotationsDecorees.notifications[cotationsDecorees.notifications.length - 1],
            extra: {ticker: cotationsDecorees.valeur.ticker},
            silent: false
          }
        ]
      });
    }
  }
}
