export class ParseUtil {
  private static readonly REGEXP_NUMBER = /-?[0-9]+,?[0-9]*/g;
  private static readonly REGEXP_YEAR = /[0-9]{4}/g;

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

  static parseAndMapTo8601(dateFr: string): string {
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
      return el.innerHTML.trim();
    }
    return undefined;
  }

  static queryAndParseDate(parent: ParentNode, selector: string): string | undefined {
    const el = parent.querySelector(selector);
    if (el) {
      return this.parseAndMapTo8601(el.innerHTML.trim());
    }
    return undefined;
  }
}
