import {ParseUtil} from './parse-util.class';
import {DTOLien} from '../abc-bourse/dto-lien.class';

describe('ParseUtil', () => {
  const regexp_date_8601 = /^\d{4}-\d{2}-\d{2}$/;

  beforeEach(() => {
  });

  it('Given du html contenant une nouvelle when #execRegexpAndMap then on récupére un DTO contenant la nouvelle', () => {
    const html =
      '                            <div class="news-row">\n' +
      '                                <span class="news-time">17:46</span>\n' +
      '                                <a href="lien"><b>titre1</b> titre2</a>\n' +
      '                            </div>';
    let resultat: Array<DTOLien> = [];
    ParseUtil.execRegexpAndMap(
      resultat,
      html,
      new RegExp('<span class="news-time">(\\d{2}:\\d{2})<\\/span>\\s*<a href="([^"]+)">((<b>[^<]+</b>)?[^<]+)', 'gm'),
      (matches) => new DTOLien(matches[1], undefined, matches[3], matches[2])
    );
    expect(resultat).toEqual([new DTOLien('17:46', undefined, '<b>titre1</b> titre2', 'lien')]);
  });

  it('Given une chaîne when #parseNumber then on récupére le nombre', () => {
    expect(ParseUtil.parseNumber('634&#xA0;894')).toEqual(634894);
    expect(ParseUtil.parseNumber('109,30')).toEqual(109.3);
    expect(ParseUtil.parseNumber('12,13%')).toEqual(12.13);
  });

  it('Given une chaîne when #parseYear then on récupére l\'année', () => {
    expect(ParseUtil.parseYear('2026')).toEqual(2026);
  });

  it('Given une chaîne when #parseDateFrAndMapTo8601 then on récupére la date', () => {
    expect(ParseUtil.parseDateFrAndMapTo8601('07/08/2026')).toEqual('2026-08-07');
    expect(ParseUtil.parseDateFrAndMapTo8601('07/08/26')).toEqual('2026-08-07');
  });

  it('Given du html when #htmlToText then on récupére du texte', () => {
    expect(ParseUtil.htmlToText('ligne :<br><ul><li>element1,</li><li>element2.</li></ul>')).toEqual('ligne :\n- element1,\n- element2.\n');
  });

  it('Given des dates au format Boursorama when #parseDateBoursoramaAndMapTo8601 then on récupére une date au format 8601', () => {
    expect(ParseUtil.parseDateBoursoramaAndMapTo8601('lun.')).toMatch(regexp_date_8601);
    expect(ParseUtil.parseDateBoursoramaAndMapTo8601('mar.')).toMatch(regexp_date_8601);
    expect(ParseUtil.parseDateBoursoramaAndMapTo8601('mer.')).toMatch(regexp_date_8601);
    expect(ParseUtil.parseDateBoursoramaAndMapTo8601('jeu.')).toMatch(regexp_date_8601);
    expect(ParseUtil.parseDateBoursoramaAndMapTo8601('ven.')).toMatch(regexp_date_8601);
    expect(ParseUtil.parseDateBoursoramaAndMapTo8601('sam.')).toMatch(regexp_date_8601);
    expect(ParseUtil.parseDateBoursoramaAndMapTo8601('dim.')).toMatch(regexp_date_8601);

    expect(ParseUtil.parseDateBoursoramaAndMapTo8601('7:50')).toMatch(regexp_date_8601);
    expect(ParseUtil.parseDateBoursoramaAndMapTo8601('07:50')).toMatch(regexp_date_8601);

    expect(ParseUtil.parseDateBoursoramaAndMapTo8601('06 janv.')).toMatch(regexp_date_8601);
    expect(ParseUtil.parseDateBoursoramaAndMapTo8601('16 févr.')).toMatch(regexp_date_8601);
    expect(ParseUtil.parseDateBoursoramaAndMapTo8601('26 mars')).toMatch(regexp_date_8601);
    expect(ParseUtil.parseDateBoursoramaAndMapTo8601('06 avr.')).toMatch(regexp_date_8601);
    expect(ParseUtil.parseDateBoursoramaAndMapTo8601('6 mai')).toMatch(regexp_date_8601);
    expect(ParseUtil.parseDateBoursoramaAndMapTo8601('6 juin')).toMatch(regexp_date_8601);
    expect(ParseUtil.parseDateBoursoramaAndMapTo8601('6 juil.')).toMatch(regexp_date_8601);
    expect(ParseUtil.parseDateBoursoramaAndMapTo8601('6 août')).toMatch(regexp_date_8601);
    expect(ParseUtil.parseDateBoursoramaAndMapTo8601('6 sept.')).toMatch(regexp_date_8601);
    expect(ParseUtil.parseDateBoursoramaAndMapTo8601('6 oct.')).toMatch(regexp_date_8601);
    expect(ParseUtil.parseDateBoursoramaAndMapTo8601('6 nov.')).toMatch(regexp_date_8601);
    expect(ParseUtil.parseDateBoursoramaAndMapTo8601('6 déc.')).toMatch(regexp_date_8601);

    expect(ParseUtil.parseDateBoursoramaAndMapTo8601('11 déc. 2025')).toBe('2025-12-11');
    expect(ParseUtil.parseDateBoursoramaAndMapTo8601('6 août 2025')).toBe('2025-08-06');

    expect(ParseUtil.parseDateBoursoramaAndMapTo8601('lun 02 juin 2025')).toBe('2025-06-02');
  });
});
