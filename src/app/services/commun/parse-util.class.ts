export class ParseUtil {
  private static readonly REGEXP_NUMBER = /-?[0-9]+,?[0-9]*/g;
  private static readonly REGEXP_YEAR = /[0-9]{4}/g;

  private static readonly REGEXP_BOURSORAMA_JOUR = /^(\w+)\.$/;
  private static readonly REGEXP_BOURSORAMA_HEURE = /^(\d{1,2}):(\d{2})$/;
  private static readonly REGEXP_BOURSORAMA_JOUR_MOIS = /^(\d{1,2}) ([\wéû]+)\.?$/;
  private static readonly REGEXP_BOURSORAMA_JOUR_MOIS_ANNEE = /^(\d{1,2}) ([\wéû]+)\.? (\d{4})$/;

  static execRegexpAndMap<T>(result: Array<T>, html: string, regexp: RegExp, mapper: (m: Array<string>) => T) {
    let matches;
    while ((matches = regexp.exec(html))) {
      result.push(mapper(matches));
    }
  }

  static parseNumber(str: string): number {
    const match = str
      .replaceAll(/&[\w#]+;/g, '')
      .replaceAll(/\s+/g, '')
      .match(ParseUtil.REGEXP_NUMBER);
    if (match) {
      return Number(match[0].replace(',', '.'));
    }
    return NaN;
  }

  static parseYear(str: string): number {
    const match = str.match(ParseUtil.REGEXP_YEAR);
    if (match) {
      return Number(match[0]);
    }
    return NaN;
  }

  static parseDateFrAndMapTo8601(dateFr: string): string {
    const regexp = /(\d{2})[\/\.]{1}(\d{2})[\/\.]{1}(\d{2,4})/g;
    const match = regexp.exec(dateFr);
    if (match) {
      if (match[3].length === 4) {
        return `${match[3]}-${match[2]}-${match[1]}`;
      } else {
        return `20${match[3]}-${match[2]}-${match[1]}`;
      }
    }
    return dateFr;
  }

  static parseAndMapTagArticle(html: string) {
    let result = '';
    new DOMParser()
      .parseFromString(html, 'text/html')
      .querySelectorAll('article')
      .forEach(elArticle => result += '<p>' + elArticle.innerHTML + '</p>');
    // return result.replaceAll(/<img src="([^"]+)"/g, '<img src="https://www.abcbourse.com$1"');
    return result.replaceAll(/<img [^>]*>/g, '')
      .replaceAll(/<a [^>]*>([^<]*)<\/a>/g, '$1');
  }

  static isMobile(): boolean {
    return window.navigator.userAgent.toLowerCase().includes('mobile');
  }

  static queryAndParseNumber(parent: ParentNode, selector: string): number {
    const el = parent.querySelector(selector);
    if (el) {
      return ParseUtil.parseNumber(el.innerHTML);
    }
    return NaN;
  }

  static queryAndParseString(parent: ParentNode, selector: string): string | undefined {
    const el = parent.querySelector(selector);
    if (el) {
      return el.innerHTML.trim()
        .replaceAll('&nbsp;', ' ')
        .replaceAll('&lt;', '<')
        .replaceAll('&gt;', '>')
        .replaceAll('&euro;', '€')
        .replaceAll('&apos;', '\'');
    }
    return undefined;
  }

  static queryAndParseDate(parent: ParentNode, selector: string): string | undefined {
    const el = parent.querySelector(selector);
    if (el) {
      return this.parseDateFrAndMapTo8601(el.innerHTML.trim());
    }
    return undefined;
  }

  static parseDateBoursoramaAndMapTo8601(dateBoursorama: string): string {
    const matchJour = ParseUtil.REGEXP_BOURSORAMA_JOUR.exec(dateBoursorama);
    if (matchJour) {
      const date = new Date();
      var distance = ParseUtil.mapJourBoursorama(matchJour[1]) - date.getDay();
      date.setDate(date.getDate() + distance);
      return date.toISOString().slice(0, 10);
    }
    const matchHeure = ParseUtil.REGEXP_BOURSORAMA_HEURE.exec(dateBoursorama);
    if (matchHeure) {
      return new Date().toISOString().slice(0, 10);
    }
    const matchJourMois = ParseUtil.REGEXP_BOURSORAMA_JOUR_MOIS.exec(dateBoursorama);
    if (matchJourMois) {
      const date = new Date();
      date.setMonth(ParseUtil.mapMoisBoursorama(matchJourMois[2]), Number(matchJourMois[1]));
      return date.toISOString().slice(0, 10);
    }
    const matchJourMoisAnnee = ParseUtil.REGEXP_BOURSORAMA_JOUR_MOIS_ANNEE.exec(dateBoursorama);
    if (matchJourMoisAnnee) {
      const date = new Date(Number(matchJourMoisAnnee[3]), ParseUtil.mapMoisBoursorama(matchJourMoisAnnee[2]),
        Number(matchJourMoisAnnee[1]), 23);
      return date.toISOString().slice(0, 10);
    }
    throw new Error(`Format de date boursorama inconnu : ${dateBoursorama}`);
  }

  private static mapJourBoursorama(jour: string): number {
    switch (jour) {
      case 'dim':
        return 0;
      case 'lun':
        return 1;
      case 'mar':
        return 2;
      case 'mer':
        return 3;
      case 'jeu':
        return 4;
      case 'ven':
        return 5;
      case 'sam':
        return 6;
      default:
        throw new Error(`Jour boursorama inconnu : ${jour}`);
    }
  }

  private static mapMoisBoursorama(mois: string): number {
    switch (mois) {
      case 'janv':
        return 0;
      case 'févr':
        return 1;
      case 'mars':
        return 2;
      case 'avr':
        return 3;
      case 'mai':
        return 4;
      case 'juin':
        return 5;
      case 'juil':
        return 6;
      case 'août':
        return 7;
      case 'sept':
        return 8;
      case 'oct':
        return 9;
      case 'nov':
        return 10;
      case 'déc':
        return 11;
      default:
        throw new Error(`Mois boursorama inconnu : ${mois}`);
    }
  }
}
