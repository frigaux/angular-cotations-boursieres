import {Component, input, InputSignal} from '@angular/core';
import {DTOColonne} from '../../../services/tableaux/dto-colonne-portefeuille.interface';
import {TypesColonnesPortefeuille} from '../../../services/tableaux/types-colonnes-portefeuille.enum';
import {TranslatePipe, TranslateService} from '@ngx-translate/core';
import {TableauxService} from '../../../services/tableaux/tableaux.service';
import {TypesColonnesCours} from '../../../services/tableaux/types-colonnes-cours.enum';
import {FloatLabel} from 'primeng/floatlabel';
import {InputText} from 'primeng/inputtext';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {AutoFocus} from 'primeng/autofocus';
import {Select} from 'primeng/select';
import {ToggleSwitch} from 'primeng/toggleswitch';
import {TypesColonnes} from '../../../services/tableaux/types-colonnes.enum.ts';
import {TypeColonne} from './type-colonne.class';
import {ColonneDecoree} from './colonne-decoree.class';
import {CdkDrag, CdkDragDrop, CdkDropList, moveItemInArray} from '@angular/cdk/drag-drop';
import {PasDeNomEnDoubleValidatorDirective} from './validators/pas-de-nom-en-double-validator.directive';
import {EntierPositifValidatorDirective} from './validators/entier-positif-validator.directive';

// TODO : renommer en configuration tableau
@Component({
  selector: 'app-tableau',
  imports: [
    TranslatePipe,
    FloatLabel,
    InputText,
    ReactiveFormsModule,
    AutoFocus,
    FormsModule,
    Select,
    ToggleSwitch,
    CdkDropList,
    CdkDrag,
    PasDeNomEnDoubleValidatorDirective,
    EntierPositifValidatorDirective
  ],
  templateUrl: './tableau.component.html',
  styleUrl: './tableau.component.sass'
})
export class TableauComponent {
  // input/output
  inputConfiguration: InputSignal<{
    colonnes: DTOColonne<TypesColonnesPortefeuille | TypesColonnesCours>[],
    type: TypesColonnes
  } | undefined> = input(undefined,
    {transform: o => this.intercepteurColonnes(o), alias: 'configuration'});

  protected colonnes: DTOColonne<TypesColonnesPortefeuille | TypesColonnesCours>[] = [];
  private typeColonnes?: TypesColonnes;


  // données pour la vue
  colonnesDecorees: ColonneDecoree[] = [];

  // privé
  private typesColonnes: TypeColonne[] = [];
  private typesDisponibles: TypeColonne[] = [];

  constructor(private tableauxService: TableauxService,
              private translateService: TranslateService) {
  }

  private intercepteurColonnes<T extends TypesColonnesPortefeuille | TypesColonnesCours>
  (colonnes: {
    colonnes: DTOColonne<TypesColonnesPortefeuille | TypesColonnesCours>[],
    type: TypesColonnes
  } | undefined) {
    this.colonnes = colonnes?.colonnes || [];
    this.typeColonnes = colonnes?.type;
    if (this.typeColonnes !== undefined) {
      switch (this.typeColonnes as TypesColonnes) {
        case TypesColonnes.PORTEFEUILLE:
          this.typesColonnes = [
            this.construireTypeColonne(TypesColonnesPortefeuille.DATE),
            this.construireTypeColonne(TypesColonnesPortefeuille.MARCHE),
            this.construireTypeColonne(TypesColonnesPortefeuille.TICKER),
            this.construireTypeColonne(TypesColonnesPortefeuille.LIBELLE),
            this.construireTypeColonne(TypesColonnesPortefeuille.OUVERTURE),
            this.construireTypeColonne(TypesColonnesPortefeuille.PLUS_HAUT),
            this.construireTypeColonne(TypesColonnesPortefeuille.PLUS_BAS),
            this.construireTypeColonne(TypesColonnesPortefeuille.CLOTURE),
            this.construireTypeColonne(TypesColonnesPortefeuille.VOLUME),
            this.construireTypeColonne(TypesColonnesPortefeuille.ALERTES),
            this.construireTypeColonne(TypesColonnesPortefeuille.COURS),
            this.construireTypeColonne(TypesColonnesPortefeuille.MOYENNE_MOBILE),
            this.construireTypeColonne(TypesColonnesPortefeuille.VARIATION)
          ];
          break;
        case TypesColonnes.COURS:
          this.typesColonnes = [];
          break;
      }
    }
    this.decorerColonnes();
    return colonnes;
  }

  ajouterColonne() {
    this.colonnes.push({
      nom: '',
      type: this.typesDisponibles[0].type,
      parametre: this.tableauxService.typeAvecParametre(this.typesDisponibles[0].type) ? 1 : undefined,
      tri: false,
      largeur: this.calculerLargeurDisponible()
    });
    this.decorerColonnes();
  }

  supprimerColonne(colonne: DTOColonne<TypesColonnesPortefeuille | TypesColonnesCours>) {
    this.colonnes.splice(this.colonnes.indexOf(colonne), 1);
    this.decorerColonnes();
  }

  dropColonne(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.colonnes, event.previousIndex, event.currentIndex);
    this.decorerColonnes();
  }

  protected onChangeTypecolonne(colonne: DTOColonne<TypesColonnesPortefeuille | TypesColonnesCours>) {
    colonne.parametre = this.tableauxService.typeAvecParametre(colonne.type) ? 1 : undefined;
    this.decorerColonnes();
  }

  private construireTypeColonne(type: TypesColonnesPortefeuille | TypesColonnesCours): TypeColonne {
    return new TypeColonne(type, this.translateService.instant(`ENUMERATIONS.COLONNES.${TypesColonnes[this.typeColonnes!]}.${this.enumKey(type)}`));
  }

  private enumKey(type: TypesColonnesPortefeuille | TypesColonnesCours): string {
    switch (this.typeColonnes! as TypesColonnes) {
      case TypesColonnes.PORTEFEUILLE:
        return TypesColonnesPortefeuille[type];
      case TypesColonnes.COURS:
        return TypesColonnesCours[type];
    }
  }

  private calculerLargeurDisponible(): number {
    return 100 - this.colonnes.reduce((accumulator, colonne) => accumulator + colonne.largeur, 0);
  }

  private construireTypesDisponibles(): void {
    const typesUtilises = this.colonnes
      .filter(colonne => !this.tableauxService.typeAvecParametre(colonne.type))
      .map(colonne => colonne.type);
    this.typesDisponibles = this.typesColonnes.filter(typeColonne => !typesUtilises.includes(typeColonne.type));
  }

  private decorerColonnes() {
    this.construireTypesDisponibles();
    let i = 0;
    this.colonnesDecorees = this.colonnes.map(colonne => {
      const typesDisponibles = this.typesDisponibles
        .concat(this.typesColonnes.filter(typeColonne => typeColonne.type === colonne.type));
      return new ColonneDecoree(i++, colonne, typesDisponibles);
    })
  }
}
