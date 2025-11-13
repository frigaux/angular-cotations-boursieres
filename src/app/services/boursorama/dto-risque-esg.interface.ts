import {RisqueESG} from './risque-esg.enum';

export interface DTORisqueESG {
  pourcentage: number;
  risque?: RisqueESG;
  tonnesCO2: number;
  niveauControverse?: string;
  impactPositif?: string;
  impactNegatif?: string;
}
