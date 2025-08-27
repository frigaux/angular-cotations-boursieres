export class DTOLien {
  moment?: string;
  objet?: string;
  titre: string;
  pathname: string;

  constructor(moment: string | undefined, objet: string | undefined, titre: string, url: string) {
    this.moment = moment;
    this.objet = objet;
    this.titre = titre;
    this.pathname = url;
  }
}
