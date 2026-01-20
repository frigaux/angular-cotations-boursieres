import {ParseUtil} from './parse-util.class';

describe('ParseUtil', () => {
  const regexp_date_8601 = /^\d{4}-\d{2}-\d{2}$/;

  beforeEach(() => {
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
  });
});
