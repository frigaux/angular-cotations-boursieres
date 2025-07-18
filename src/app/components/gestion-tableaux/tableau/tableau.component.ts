import {Component, input, InputSignal, OnInit} from '@angular/core';
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
    ToggleSwitch
  ],
  templateUrl: './tableau.component.html',
  styleUrl: './tableau.component.sass'
})
export class TableauComponent implements OnInit {
  // input/output
  inputColonnes: InputSignal<DTOColonne<TypesColonnesPortefeuille | TypesColonnesCours>[] | undefined> = input(undefined,
    {transform: o => this.intercepteurColonnes(o), alias: 'colonnes'});
  inputTypeColonnes: InputSignal<TypesColonnes | undefined> = input(undefined,
    {transform: o => this.intercepteurTypeColonnes(o), alias: 'typeColonnes'});

  // données pour la vue
  protected colonnes: DTOColonne<TypesColonnesPortefeuille | TypesColonnesCours>[] = [];

  private typeColonnes?: TypesColonnes;
  private typesColonnes: TypeColonne[] = [];
  private typesDisponibles: TypeColonne[] = [];

  constructor(private tableauxService: TableauxService,
              private translateService: TranslateService) {
  }

  private intercepteurColonnes<T extends TypesColonnesPortefeuille | TypesColonnesCours>(colonnes: DTOColonne<T>[] | undefined) {
    this.colonnes = colonnes || [];
    return colonnes;
  }

  private intercepteurTypeColonnes(typeColonnes: TypesColonnes | undefined) {
    this.typeColonnes = typeColonnes;
    console.log(typeColonnes, TypesColonnes[typeColonnes!]);
    if (typeColonnes !== undefined) {
      switch (typeColonnes as TypesColonnes) {
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
          ];console.log(this.typesColonnes);
          break;
        case TypesColonnes.COURS:
          this.typesColonnes = [];
          break;
      }
    }
    return typeColonnes;
  }

  ngOnInit(): void {
    this.construireTypesDisponibles();
  }

  ajouterColonne() {
    this.colonnes.push({
      nom: '',
      type: this.typesDisponibles[0].type,
      tri: false,
      largeur: this.calculerLargeurDisponible(),
      ordre: this.colonnes.length
    });
    this.construireTypesDisponibles();
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

  private construireTypesDisponibles(): void {
    const typesUtilises = this.colonnes
      .filter(colonne => !this.tableauxService.colonneAvecParametre(colonne))
      .map(colonne => colonne.type);
    this.typesDisponibles = this.typesColonnes.filter(typeColonne => !typesUtilises.includes(typeColonne.type));
  }

  private calculerLargeurDisponible(): number {
    return 100 - this.colonnes.reduce((accumulator, colonne) => accumulator + colonne.largeur, 0);
  }

  typesDisponiblesColonne(colonne: DTOColonne<TypesColonnesPortefeuille | TypesColonnesCours>): TypeColonne[] {
    return this.typesDisponibles; //.concat(colonne.type);
  }
}
