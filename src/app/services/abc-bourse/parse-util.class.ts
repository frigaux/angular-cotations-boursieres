export class ParseUtil {
  private static readonly regexpNumber = /-?[0-9]+,?[0-9]*/g;
  private static readonly regexpYear = /[0-9]{4}/g;

  static execRegexpAndMap<T>(result: Array<T>, html: string, regexp: RegExp, mapper: (m: Array<string>) => T) {
    let matches;
    while ((matches = regexp.exec(html))) {
      result.push(mapper(matches));
    }
  }

  static parseNumber(str: string): number {
    const match = str
      .replaceAll(/&[\w#]+;/g, '')
      .match(ParseUtil.regexpNumber);
    if (match) {
      return Number(match[0].replace(',', '.'));
    }
    return NaN;
  }

  static parseYear(str: string): number {
    const match = str.match(ParseUtil.regexpYear);
    if (match) {
      return Number(match[0]);
    }
    return NaN;
  }

  static parseAndMap2To8601(dateFr: string) {
    return dateFr.replace(/(\d{2})\/(\d{2})\/(\d{2})/g, '20$3-$2-$1');
  }

  static parseAndMap4To8601(dateFr: string) {
    return dateFr.replace(/(\d{2})\/(\d{2})\/(\d{4})/g, '$3-$2-$1');
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
}
