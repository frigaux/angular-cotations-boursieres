import {Component, OnInit, viewChild} from '@angular/core';
import {ValeursService} from '../../../../services/valeurs/valeurs.service';
import {CoursService} from '../../../../services/cours/cours.service';
import {DTOValeur} from '../../../../services/valeurs/dto-valeur.interface';
import {Marches} from '../../../../services/valeurs/marches.enum';
import {ListboxModule} from 'primeng/listbox';
import {FormsModule} from '@angular/forms';
import {TranslatePipe, TranslateService} from '@ngx-translate/core';
import {InputNumber, InputNumberModule} from 'primeng/inputnumber';
import {Button} from 'primeng/button';
import {LoaderComponent} from '../../../loader/loader.component';
import {DonneesCoursVagues} from './donnees-cours-vagues.class';
import {UIChart} from 'primeng/chart';
import {DatePipe, NgClass} from '@angular/common';
import {FloatLabel} from 'primeng/floatlabel';

@Component({
  selector: 'app-generateur-donnees-entrainement-modele',
  imports: [
    ListboxModule,
    FormsModule,
    TranslatePipe,
    InputNumberModule,
    LoaderComponent,
    Button,
    UIChart,
    FloatLabel,
    NgClass
  ],
  templateUrl: './generateur-donnees-entrainement-modele.component.html',
  styleUrl: './generateur-donnees-entrainement-modele.component.sass',
})
export class GenerateurDonneesEntrainementModeleComponent implements OnInit {
  public inputNumber = viewChild(InputNumber);

  // données pour la vue
  protected loading: boolean = true;
  protected readonly marche: Marches = Marches.EURO_LIST_A;
  protected coursDecores?: Array<DonneesCoursVagues>;
  protected coursDecoreSelectionne?: DonneesCoursVagues;

  // données pour la vue
  // https://www.chartjs.org/
  data?: any;
  options: any = {
    plugins: {
      legend: {
        display: false
      },
      title: {
        display: false
      }
    }
  };

  constructor(private translateService: TranslateService,
              private datepipe: DatePipe,
              private valeursService: ValeursService,
              private coursService: CoursService) {
  }

  ngOnInit(): void {
    this.valeursService.chargerValeurs().subscribe(valeurs => {
      const valeurByTicker = new Map<string, DTOValeur>();
      valeurs.forEach(valeur => valeurByTicker.set(valeur.ticker, valeur));
      const tickers = valeurs
        .filter(valeur => valeur.marche === this.marche)
        .map(valeur => valeur.ticker);
      this.coursService.chargerCoursTickersWithLimit(tickers, 300)
        .subscribe(liste => {
          this.coursDecores = liste
            .map(dto => new DonneesCoursVagues(valeurByTicker.get(dto.ticker)!, dto.cours.reverse()))
            .sort((c1, c2) => c1.valeur.libelle.localeCompare(c2.valeur.libelle));
          this.loading = false;
        });
    });
  }

  rafraichirVue(): void {
    const labels = this.coursDecoreSelectionne!.cours
      .map(cours => this.datepipe.transform(cours.date, 'dd/MM/yyyy'));
    const data = this.coursDecoreSelectionne!.cours
      .map(cours => cours.cloture);

    this.data = {
      labels,
      datasets: [
        {
          label: this.translateService.instant('COMPOSANTS.PARAMETRAGE.ML.GENERATEUR_DONNEES_ENTRAINEMENT.COURS'),
          data,
          tension: 0.4 // Bezier curve tension of the line. Set to 0 to draw straightlines. This option is ignored if monotone cubic interpolation is used.
        }
      ]
    };

    setTimeout(() => {
      this.inputNumber()?.input.nativeElement.focus();
    }, 0);
  }

  exporterDonnees(): void {
    if (this.coursDecores) {
      const json = this.coursDecores;
      if (json.length > 0) {
        const data = JSON.stringify(json, null, 2);
        const blob = new Blob([data], {type: 'application/json'});
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `cours_vagues_${this.datepipe.transform(new Date(), 'dd/MM/yyyy')}.json`;
        a.click();
        window.URL.revokeObjectURL(url);
      }
    }
  }

  importerDonnees(event: any): void {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        try {
          this.coursDecores = JSON.parse(e.target.result);
        } catch (error) {
          console.error('Erreur lors de l\'importation du fichier JSON', error);
        }
      };
      reader.readAsText(file);
    }
  }
}
