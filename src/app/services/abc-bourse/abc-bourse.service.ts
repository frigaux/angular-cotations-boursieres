import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {DTOInformationsTicker} from './dto-informations-ticker.class';
import {DTOInformationTicker} from './dto-information-ticker.class';
import {DTODividende} from './dto-dividende.class';
import {DTOVariation} from './dto-variation.class';
import {DTORatio} from './dto-ratio.class';

@Injectable({
  providedIn: 'root'
})
export class AbcBourseService {
  private static readonly regexpNumber = /-?[0-9]+,[0-9]+/g;
  private static readonly regexpYear = /[0-9]{4}/g;

  constructor(private http: HttpClient) {
  }

  // public chargerInformationsTicker(ticker: string): Observable<DTOInformationsTicker> {
  //   return new Observable(observer => {
  //     const headers = new HttpHeaders()
  //       .set('Accept', 'text/html; charset=utf-8');
  //     this.http.get(`abcbourse/cotation/${ticker}p`, {headers, responseType: 'text'}
  //     ).subscribe({
  //       error: httpResponseError => {
  //         observer.error(httpResponseError);
  //         observer.complete();
  //       },
  //       next: html => {
  //         observer.next(this.parse(html, ticker));
  //         observer.complete();
  //       }
  //     });
  //   });
  // }

  public chargerInformationsTicker(ticker: string): Observable<DTOInformationsTicker> {
    return new Observable(observer => {
      observer.next(this.parseAndMap(' <!DOCTYPE html>\n' +
        '\n' +
        '<html lang="fr">\n' +
        '<head>\n' +
        '    <meta charset="utf-8">\n' +
        '    <meta name="viewport" content="width=device-width, initial-scale=1" />\n' +
        '    <link rel="apple-touch-icon" href="/apple-icon.png">\n' +
        '    <link rel="icon" type="image/png" sizes="192x192" href="/android-icon-192x192.png">\n' +
        '    <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">\n' +
        '    <link rel="stylesheet" href="/css2/v131.min.css" type="text/css" />\n' +
        '    \n' +
        '    <title>ACCOR HOTELS, cours action. Cotation bourse en direct - FR0000120404 - AC</title>\n' +
        '    <meta name="description" content="Cours de bourse en direct  de l\'action ACCOR HOTELS. Cotation à la bourse de Paris , actus et infos boursières, graphiques temps réel - FR0000120404 AC " />\n' +
        '\n' +
        '        <script>window.dataLayer = window.dataLayer || []; window.dataLayer.push({ advertisement: { page: { pageCategory: "marches"}}});</script>\n' +
        '\n' +
        '<script src="https://cache.consentframework.com/js/pa/21074/c/9whRO/stub" charset="utf-8"></script><script src="https://choices.consentframework.com/js/pa/21074/c/9whRO/cmp" charset="utf-8" async></script><script>var optidigitalQueue = optidigitalQueue || {};optidigitalQueue.cmd = optidigitalQueue.cmd || [];</script><script type=\'text/javascript\' id=\'optidigital-ad-init\' async data-config=\'{"adUnit": "/22599412183/od.abcbourse.com/home"}\' src=\'//scripts.opti-digital.com/tags/?site=abcbourse\' ></script>            <script async data-cmp-src="https://ads.sportslocalmedia.com/slm.prebid.abcbourse.js" data-cmp-fallback-src="/scripts2/noconsent2.min.js"></script>\n' +
        '</head>\n' +
        '<body class="bmaster">\n' +
        '\n' +
        '    <header>\n' +
        '        <div class="headmenu">\n' +
        '            <div class="headmenu1">\n' +
        '                <div class="logo">\n' +
        '                    <a href="/" title="la bourse et les marchés financiers, cotations en direct">\n' +
        '                        investir en bourse\n' +
        '                    </a>\n' +
        '                </div>\n' +
        '                <ul class="main_menu">\n' +
        '                    <li id="u_analyses" ><a href="/analyses/analyses">ANALYSES</a></li>\n' +
        '                    <li id="u_apprendre" ><a href="/apprendre/">APPRENDRE</a></li>\n' +
        '                    <li id="u_marches" class="selected"><a href="/marches/">MARCHÉS</a></li>\n' +
        '                    <li id="u_shop" ><a href="/boutique/">BOUTIQUE</a></li>\n' +
        '                    <li id="u_commu" ><a href="/forums/">COMMUNAUT&Eacute;</a></li>\n' +
        '                    <li ><a href="/game/">JEU</a></li>\n' +
        '                    <li class="bk_o"><a href="/premium/">PREMIUM</a></li>\n' +
        '                    <li class="bk_o2"><a href="/graphes/prochart">CHART&nbsp;365</a></li>\n' +
        '                </ul>\n' +
        '            </div>\n' +
        '        </div>\n' +
        '\n' +
        '        <div class="headg clearfix">\n' +
        '            <div class="fr">\n' +
        '                <div class="outsearch">\n' +
        '                    <input id="txtAutoComplete" type="text" placeholder="Chercher une valeur" autocomplete="off" onkeypress="return isEnterAC(event)" />\n' +
        '                </div>\n' +
        '                <div class="btn_home2" id="btnAC">OK</div>\n' +
        '            </div>\n' +
        '\n' +
        '            <div class="fr lh24">\n' +
        '                    <div class="sp6 sp6-pv"><a class="lnkLogin" href="#" data-name="portif">Portefeuille virtuel</a></div>\n' +
        '                    <div class="sp6 sp6-lv"><a class="lnkLogin" href="#" data-name="list">Mes valeurs</a></div>\n' +
        '                <div class="sp6 sp6-re"><a href="/accueil/search">Recherche</a></div>\n' +
        '                <div class="sp6 sp6-nb" onclick="toggleTheme()"><a href="#">&nbsp;</a></div>\n' +
        '            </div>\n' +
        '\n' +
        '        </div>\n' +
        '    </header>\n' +
        '\n' +
        '    <div id="skinABC"></div>\n' +
        '\n' +
        '            <div class="hom_ban">\n' +
        '                <div style="display:none;" class="Billboard_1"></div>\n' +
        '            </div>\n' +
        '\n' +
        '    <div class="header_map2">\n' +
        '        \n' +
        '    <a href="/">Accueil</a> > <a href="/marches/">Marchés Boursiers</a> > <h1 class="h1c">Cours Accor Hotels</h1>\n' +
        '\n' +
        '    </div>\n' +
        '\n' +
        '    <div class="header1">\n' +
        '        <div class="inner_left">\n' +
        '            \n' +
        '\n' +
        '\n' +
        '\n' +
        '\n' +
        '<script type="application/ld&#x2B;json">\n' +
        '    {\n' +
        '    "@context":"http://schema.org/","@type":"Intangible/FinancialQuote","url":"www.abcbourse.com/cotation/ACp","name":"Accor Hotels","tickerSymbol":"AC","price":"44,80","priceChangePercent":"&#x2B;0,25%","quoteTime":"2025-08-18T17:35:04Z","priceCurrency":"EUR"\n' +
        '    }\n' +
        '</script>\n' +
        '\n' +
        '<div class="mobpad3">\n' +
        '\n' +
        '        <span class="h1l">Accor Hotels</span>\n' +
        '\n' +
        '    <div class="co_g2 clearfix">\n' +
        '        <span class="fr">La bourse de Paris ouvre dans 13h17min</span>\n' +
        '        <span>\n' +
        '            AC -\n' +
        '            <span class="mobno">FR0000120404 - </span>\n' +
        '        <a href="/marches/aaz"><img title="France" src="/game/flag/FR.gif" class="tipt flagm" alt="Bourse France" /></a>\n' +
        '    </span>\n' +
        '</div>\n' +
        '</div>\n' +
        '\n' +
        '<table class="navbar">\n' +
        '    <tr>\n' +
        '        <td class="selected"><a href="/cotation/ACp">Cours</a></td><td><a href="/graphes/eod/ACp">Graphes</a></td><td><a href="/marches/news_valeur/ACp">News</a></td><td><a href="/analyses/conseil/ACp">Analyses et conseils</a></td><td><a href="/analyses/chiffres/ACp">Société</a></td><td><a href="/download/valeur/ACp">Historiques</a></td><td><a href="/marches/events/ACp">Vie du titre</a></td><td><a href="/marches/secteur/ACp">Secteur</a></td><td><a href="/forums/accor-hotels_10001">Forum</a></td>\n' +
        '    </tr>\n' +
        '</table>\n' +
        '\n' +
        '\n' +
        '    <table class="tbl100_0_0 mar10">\n' +
        '        <tr class="vbot">\n' +
        '            <td>\n' +
        '                <ul class="menu_gr">\n' +
        '                        <li class="beg selected"><a href="/graphes/eod/ACp/lcd">1</a></li>\n' +
        '                        <li><a href="/graphes/eod/ACp/lca">2</a></li>\n' +
        '                        <li><a href="/graphes/eod/ACp/lcb">5</a></li>\n' +
        '                        <li class="end"><a href="/graphes/eod/ACp/lcc">10 jours</a></li>\n' +
        '\n' +
        '                    <li class="beg"><a href="/graphes/eod/ACp/lc2">3</a></li>\n' +
        '                    <li class="end"><a href="/graphes/eod/ACp/lc3">6 mois</a></li>\n' +
        '                    <li class="beg"><a href="/graphes/eod/ACp">1</a></li>\n' +
        '                    <li><a href="/graphes/eod/ACp/lc5">2</a></li>\n' +
        '                    <li><a href="/graphes/eod/ACp/lc6">5</a></li>\n' +
        '                    <li><a href="/graphes/eod/ACp/lc7">10</a></li>\n' +
        '                    <li class="end"><a href="/graphes/eod/ACp/lc9">20 ans</a></li>\n' +
        '                </ul>\n' +
        '            </td>\n' +
        '            <td class="alct">\n' +
        '                <img src="/Logo/AC.gif" alt="logo Accor Hotels"/>\n' +
        '            </td>\n' +
        '            <td>\n' +
        '                <a href="/aide/display_aide" class="m_hlp" title="FAQ cotations"></a>\n' +
        '                <span title="ajouter cette valeur dans mes listes" id="addlistbtn" data-name="ACp" class="m_lst tipt"></span>\n' +
        '                <span title="ajouter cette valeur dans mon portefeuille" id="addportifbtn" data-name="ACp" class="m_port tipt"></span>\n' +
        '                <span title="Mettre une alerte" id="addalertbtn" data-name="ACp" class="m_alert tipt"></span>\n' +
        '            </td>\n' +
        '        </tr>\n' +
        '    </table>\n' +
        '\n' +
        '<br />\n' +
        '\n' +
        '<div class="clearfix">\n' +
        '\n' +
        '    <div id="dis03">\n' +
        '        <div class="disqzone" id="vZone" data-name="&#x2B;0,25">\n' +
        '            <span id="lastcx">44,80</span>&nbsp;&#x20AC;<span id="varcx" class="quote_upb ml20">&#x2B;0,25%</span>\n' +
        '        </div>\n' +
        '        <div class="co_g2 f12 alri mtb10" id="lastTrade">18/08/2025 - 17:35:04</div>\n' +
        '        <table class="mar6 tbl0_3">\n' +
        '            <tr>\n' +
        '                <td>Volume</td>\n' +
        '                <td class="alri" id="vol">567&#xA0;680</td>\n' +
        '            </tr>\n' +
        '            <tr>\n' +
        '                <td>Ouverture</td>\n' +
        '                <td class="alri" id="open">44,59</td>\n' +
        '            </tr>\n' +
        '            <tr>\n' +
        '                <td>Plus haut</td>\n' +
        '                <td class="alri quote_upb" id="high">44,82</td>\n' +
        '            </tr>\n' +
        '            <tr>\n' +
        '                <td>Plus bas</td>\n' +
        '                <td class="alri quote_downb" id="low">44,54</td>\n' +
        '            </tr>\n' +
        '            <tr>\n' +
        '                <td>Clôture veille</td>\n' +
        '                <td class="alri" id="veille">44,69</td>\n' +
        '            </tr>\n' +
        '            <tr>\n' +
        '                <td>Volatilité</td>\n' +
        '                <td class="alri" id="volat">0,63%</td>\n' +
        '            </tr>\n' +
        '        </table>\n' +
        '\n' +
        '        <table class="mar6 tbl0_3 mt15">\n' +
        '                <tr>\n' +
        '                    <td>Capital échangé</td>\n' +
        '                    <td class="alri">0,24%</td>\n' +
        '                </tr>\n' +
        '                <tr>\n' +
        '                    <td>Valorisation</td>\n' +
        '                    <td class="alri">10&#xA0;741 M&#x20AC;</td>\n' +
        '                </tr>\n' +
        '            <tr><td>SRD / PEA</td><td class="alri"><a class="ap2" href="/marches/cotation_srd">Oui</a> / Oui</td></tr>\n' +
        '            <tr>\n' +
        '                <td><span class="tipt" title="Le titre supporte-t-il la taxe sur les transactions financières ?"><a href="/marches/liste_societes_ttf">TTF</a></span></td>\n' +
        '                <td class="alri">Oui</td>\n' +
        '            </tr>\n' +
        '                <tr>\n' +
        '                    <td colspan="2">\n' +
        '                        Marché\n' +
        '                        <span class="fr"><a class="ap2" href="/marches/cotation_eurolista">Euronext A</a></span>\n' +
        '                    </td>\n' +
        '                </tr>\n' +
        '        </table>\n' +
        '\n' +
        '        <table class="mar6 tbl0_3 mt10">\n' +
        '            <tr>\n' +
        '                <td><a class="ap2" href="/cotation/PX1p">Cac 40</a></td>\n' +
        '                <td class="alri">\n' +
        '                    7&#xA0;884,05&nbsp;<span class="quote_downb">\n' +
        '                        -0,50%\n' +
        '                    </span>\n' +
        '                </td>\n' +
        '            </tr>\n' +
        '        </table>\n' +
        '    </div>\n' +
        '\n' +
        '        <div class="dis01">\n' +
        '            <div class="ab12 alct">Dernières transactions</div>\n' +
        '            <table class="mar5 tbl0_3">\n' +
        '                <thead>\n' +
        '                    <tr>\n' +
        '                        <td>Heure</td>\n' +
        '                        <td>Quantité</td>\n' +
        '                        <td>Cours</td>\n' +
        '                    </tr>\n' +
        '                </thead>\n' +
        '                <tbody id="tZone">\n' +
        '                </tbody>\n' +
        '            </table>\n' +
        '\n' +
        '            <table class="bog tbl100_6 mt5" id="bbarc">\n' +
        '                <tr class="alct">\n' +
        '                    <td class="bk_g2">\n' +
        '                        Bougie<br />\n' +
        '                        Barchart\n' +
        '                    </td>\n' +
        '                    <td>\n' +
        '                        <canvas id="bbar" width="45" height="31"></canvas>\n' +
        '                    </td>\n' +
        '                </tr>\n' +
        '            </table>\n' +
        '        </div>\n' +
        '\n' +
        '\n' +
        '    <div id="dis02">\n' +
        '        <div id="imgChart" style="height:300px" class="eod_container" data-name="ACp" onclick="location.href=\'/graphes/eod/ACp\'"></div>\n' +
        '            <div class="allf mt15">\n' +
        '                    <select id="droplist" class="w140 ml10">\n' +
        '                        <option value="lc">Ligne continue</option>\n' +
        '                        <option value="bc">Bar Chart</option>\n' +
        '                        <option value="ca">Chandeliers</option>\n' +
        '                    </select>\n' +
        '                    <select id="droplistComp" class="w140 ml10">\n' +
        '                        <option value="">Comparer</option>\n' +
        '                        <option value="PX1p">CAC 40</option>\n' +
        '                        <option value="PX4p">SBF 120</option>\n' +
        '                        <option value="a">Autre...</option>\n' +
        '                    </select>\n' +
        '\n' +
        '                    <a class="ap2" href="/download/valeur/ACp">\n' +
        '                        <img src="/5/excel_icon.gif" alt="télécharger cotations Accor Hotels " title="Télécharger les cotations" width="22" height="22" class="tipt" style="margin: 0 0 -6px 20px" />\n' +
        '                    </a>\n' +
        '            </div>\n' +
        '    </div>\n' +
        '\n' +
        '</div>\n' +
        '\n' +
        '\n' +
        '<div class="content_news_out mt30">\n' +
        '\n' +
        '        <div class="w300 mr10 mb20">\n' +
        '            <div style=\'display:none;\' class="HalfpageAd_2"></div>\n' +
        '        </div>\n' +
        '\n' +
        '    <div class="dis06">\n' +
        '                <div class="ab12 mb10 clearfix">\n' +
        '                    <a class="lkw" href="/marches/news_valeur/ACp">Informations Accor Hotels </a>\n' +
        '                </div>\n' +
        '                    <div class="newsln2">\n' +
        '                        <div>15/08/25</div>\n' +
        '                        <div><a href="/marches/accor-blackrock-passe-sous-les-5-du-capital_672359">BlackRock passe sous les 5% du capital</a></div>\n' +
        '                    </div>\n' +
        '                    <div class="newsln2">\n' +
        '                        <div>14/08/25</div>\n' +
        '                        <div><a href="/marches/accor-blackrock-franchit-le-seuil-des-5-du-capital_672297">BlackRock franchit le seuil des 5% du capital</a></div>\n' +
        '                    </div>\n' +
        '                    <div class="newsln2">\n' +
        '                        <div>12/08/25</div>\n' +
        '                        <div><a href="/marches/accor-blackrock-sous-le-seuil-des-5-du-capital_672161">BlackRock sous le seuil des 5% du capital</a></div>\n' +
        '                    </div>\n' +
        '                    <div class="newsln2">\n' +
        '                        <div>11/08/25</div>\n' +
        '                        <div><a href="/marches/accor-parvus-am-detient-plus-de-10-du-capital_672062">Parvus AM détient plus de 10% du capital</a></div>\n' +
        '                    </div>\n' +
        '                    <div class="newsln2">\n' +
        '                        <div>08/08/25</div>\n' +
        '                        <div><a href="/marches/accor-blackrock-franchit-les-5-du-capital_672017">BlackRock franchit les 5% du capital</a></div>\n' +
        '                    </div>\n' +
        '                    <div class="newsln2">\n' +
        '                        <div>07/08/25</div>\n' +
        '                        <div><a href="/marches/accor-rebondit-sur-42e-fuse-a-la-hausse-au-dela-des-44-7e_671889">Rebondit sur 42E, fuse à la hausse au-delà des 44,7E</a></div>\n' +
        '                    </div>\n' +
        '\n' +
        '\n' +
        '\n' +
        '        <div class="ab12 mb20 mt30">Les variations historiques  de l\'action</div>\n' +
        '        <table class="tableDis tbl5">\n' +
        '            <thead>\n' +
        '                <tr>\n' +
        '                    <th></th>\n' +
        '                    <th>Plus haut</th>\n' +
        '                    <th>Plus bas</th>\n' +
        '                    <th>Vol. moyen</th>\n' +
        '                    <th>Variation</th>\n' +
        '                </tr>\n' +
        '            </thead>\n' +
        '            <tbody>\n' +
        '                <tr>\n' +
        '                    <td class="t1">1 semaine</td>\n' +
        '                    <td>44,94</td>\n' +
        '                    <td>43,66</td>\n' +
        '                    <td>616&#xA0;431</td>\n' +
        '                    <td class="quote_upb">1,82%</td>\n' +
        '                </tr>\n' +
        '                <tr>\n' +
        '                    <td class="t1">1 mois</td>\n' +
        '                    <td>50,34</td>\n' +
        '                    <td>41,73</td>\n' +
        '                    <td>844&#xA0;891</td>\n' +
        '                    <td class="quote_downb">-7,09%</td>\n' +
        '                </tr>\n' +
        '                <tr>\n' +
        '                    <td class="t1">1er janvier</td>\n' +
        '                    <td>51,10</td>\n' +
        '                    <td>34,62</td>\n' +
        '                    <td>690&#xA0;783</td>\n' +
        '                    <td class="quote_downb">-4,76%</td>\n' +
        '                </tr>\n' +
        '                <tr>\n' +
        '                    <td class="t1">1 an</td>\n' +
        '                    <td>51,10</td>\n' +
        '                    <td>34,62</td>\n' +
        '                    <td>671&#xA0;510</td>\n' +
        '                    <td class="quote_upb">26,52%</td>\n' +
        '                </tr>\n' +
        '                <tr>\n' +
        '                    <td class="t1">3 ans</td>\n' +
        '                    <td>51,10</td>\n' +
        '                    <td>20,47</td>\n' +
        '                    <td>715&#xA0;009</td>\n' +
        '                    <td class="quote_upb">72,77%</td>\n' +
        '                </tr>\n' +
        '                <tr>\n' +
        '                    <td class="t1">5 ans</td>\n' +
        '                    <td>51,10</td>\n' +
        '                    <td>20,47</td>\n' +
        '                    <td>770&#xA0;104</td>\n' +
        '                    <td class="quote_upb">94,28%</td>\n' +
        '                </tr>\n' +
        '                <tr>\n' +
        '                    <td class="t1">10 ans</td>\n' +
        '                    <td>51,10</td>\n' +
        '                    <td>20,15</td>\n' +
        '                    <td>1&#xA0;161&#xA0;933</td>\n' +
        '                    <td class="quote_downb">-1,60%</td>\n' +
        '                </tr>\n' +
        '                <tr>\n' +
        '                    <td class="t1">Extrêmes</td>\n' +
        '                    <td class="quote_upb bold">63,92</td>\n' +
        '                    <td class="quote_downb bold">3,04</td>\n' +
        '                    <td></td>\n' +
        '                    <td></td>\n' +
        '                </tr>\n' +
        '            </tbody>\n' +
        '        </table>\n' +
        '    </div>\n' +
        '\n' +
        '</div>\n' +
        '\n' +
        '    <div class="content_news_out">\n' +
        '            <div class="w300">\n' +
        '                <div class="ab12 mb20">\n' +
        '                    Dividendes versés\n' +
        '                </div>\n' +
        '                    <table class="tableDis">\n' +
        '                        <tr>\n' +
        '                            <th>Année</th>\n' +
        '                            <th>Montant</th>\n' +
        '                            <th></th>\n' +
        '                        </tr>\n' +
        '                            <tr>\n' +
        '                                <td>2025</td>\n' +
        '                                <td>1,26 €</td>\n' +
        '                                <td></td>\n' +
        '                            </tr>\n' +
        '                            <tr>\n' +
        '                                <td>2024</td>\n' +
        '                                <td>1,18 €</td>\n' +
        '                                <td></td>\n' +
        '                            </tr>\n' +
        '                            <tr>\n' +
        '                                <td>2023</td>\n' +
        '                                <td>1,05 €</td>\n' +
        '                                <td></td>\n' +
        '                            </tr>\n' +
        '                            <tr>\n' +
        '                                <td>2022</td>\n' +
        '                                <td>1,05 €</td>\n' +
        '                                <td></td>\n' +
        '                            </tr>\n' +
        '                            <tr>\n' +
        '                                <td>2019</td>\n' +
        '                                <td>1,05 €</td>\n' +
        '                                <td></td>\n' +
        '                            </tr>\n' +
        '                    </table>\n' +
        '            </div>\n' +
        '\n' +
        '\n' +
        '        <div class="dis06">\n' +
        '                <div class="ab12 mb20">\n' +
        '                    <a class="lkw" href="/analyses/chiffres/ACp">Les ratios financiers de Accor Hotels</a>\n' +
        '                </div>\n' +
        '                <table class="tableDis" id="tabBnpa">\n' +
        '                    <thead>\n' +
        '                        <tr>\n' +
        '                            <th></th>\n' +
        '                            <th>2024</th>\n' +
        '                            <th>2025e</th>\n' +
        '                            <th>2026e</th>\n' +
        '                        </tr>\n' +
        '                    </thead>\n' +
        '                    <tbody>\n' +
        '                        <tr>\n' +
        '                            <td class="t1 tipt" title="Bénéfice net par action">BNPA (&#x20AC;)</td>\n' +
        '                            <td>2,24 </td>\n' +
        '                            <td>2,33 </td>\n' +
        '                            <td>2,72 </td>\n' +
        '                        </tr>\n' +
        '                        <tr>\n' +
        '                            <td class="t1 tipt" title="Price earning ratio : rapport du cours et du BNPA">PER</td>\n' +
        '                            <td>20,03 </td>\n' +
        '                            <td>19,23 </td>\n' +
        '                            <td>16,49 </td>\n' +
        '                        </tr>\n' +
        '                    </tbody>\n' +
        '                </table>\n' +
        '\n' +
        '                <table class="tableDis">\n' +
        '                    <tbody>\n' +
        '                            <tr>\n' +
        '                                <td class="t1"><a href="#" onclick="loadPopupHelp(\'helpBeta\');return false">Beta 1 an / CAC 40</a></td>\n' +
        '                                <td>1,12</td>\n' +
        '                            </tr>\n' +
        '                            <tr>\n' +
        '                                <td class="t1"><a href="#" onclick="loadPopupHelp(\'helpCorrelation\');return false">Corrélation / CAC 40</a></td>\n' +
        '                                <td>58,40%</td>\n' +
        '                            </tr>\n' +
        '                            <tr>\n' +
        '                                <td class="t1">\n' +
        '                                    <a href="/analyses/chiffres/ACp"> Note de qualité financière : </a>\n' +
        '                                </td>\n' +
        '                                <td>\n' +
        '                                    <div class="rangecb">\n' +
        '                                        <div id="rangein"></div>\n' +
        '                                    </div>\n' +
        '                                    <span class="bold ml10" id="noteglobale" data-name="13">13/20</span>\n' +
        '                                </td>\n' +
        '                            </tr>\n' +
        '                    </tbody>\n' +
        '                </table>\n' +
        '        </div>\n' +
        '    </div>\n' +
        '\n' +
        '\n' +
        '\n' +
        '\n' +
        '\n' +
        '\n' +
        '    <div class="ab12 mt30">Positions en vente à découvert</div>\n' +
        '    <table class="tablesorter tbl100_6">\n' +
        '        <thead>\n' +
        '            <tr>\n' +
        '                <th>Fonds</th>\n' +
        '                <th class="mobno">Début de position</th>\n' +
        '                <th>% du capital</th>\n' +
        '                <th>Position en valeur (M€)</th>\n' +
        '            </tr>\n' +
        '        </thead>\n' +
        '        <tbody>\n' +
        '                <tr class="alri">\n' +
        '                        <td class="allf"><a href="/marches/vadholder/6BS8JLEICI3VGJ264L55">MARSHALL WACE LLP</a></td>\n' +
        '                    <td class="mobno">31/03/2025</td>\n' +
        '                    <td>1,09%</td>\n' +
        '                    <td>117,08</td>\n' +
        '                </tr>\n' +
        '            <tr>\n' +
        '                <td><b>TOTAL</b></td>\n' +
        '                <td class="mobno"></td>\n' +
        '                <td class="alri">\n' +
        '                    <b>1,09 %</b>\n' +
        '                </td>\n' +
        '                <td class="alri">\n' +
        '                    <b>117,08 M€</b>\n' +
        '                </td>\n' +
        '            </tr>\n' +
        '        </tbody>\n' +
        '    </table>\n' +
        '    <p class="alri mobpad">\n' +
        '        Voir <a class="ap2" href="/marches/vadposition/FR0000120404">l\'évolution des ventes à découvert sur Accor Hotels</a>\n' +
        '    </p>\n' +
        '\n' +
        '    <div class="ab12 mt30">Transactions réalisées par les dirigeants</div>\n' +
        '    <table class="tablesorter tbl100_6">\n' +
        '        <thead>\n' +
        '            <tr>\n' +
        '                <th>Date</th>\n' +
        '                <th>Personne</th>\n' +
        '                <th>Opération</th>\n' +
        '                <th>Montant</th>\n' +
        '            </tr>\n' +
        '        </thead>\n' +
        '        <tbody>\n' +
        '                    <tr>\n' +
        '                        <td>07/08/2025</td>\n' +
        '                        <td>Paul DUBRULE, Co fondateur</td>\n' +
        '                        <td class="quote_up">Acquisition</td>\n' +
        '                        <td class="alri">419&#xA0;200€</td>\n' +
        '                    </tr>\n' +
        '                    <tr>\n' +
        '                        <td>04/08/2025</td>\n' +
        '                        <td>Paul DUBRULE, Co fondateur</td>\n' +
        '                        <td class="quote_up">Acquisition</td>\n' +
        '                        <td class="alri">424&#xA0;029€</td>\n' +
        '                    </tr>\n' +
        '                    <tr>\n' +
        '                        <td>13/05/2025</td>\n' +
        '                        <td>Paul DUBRULE, Co fondateur</td>\n' +
        '                        <td class="quote_down">Cession</td>\n' +
        '                        <td class="alri">472&#xA0;200€</td>\n' +
        '                    </tr>\n' +
        '        </tbody>\n' +
        '    </table>\n' +
        '    <p class="alri mobpad">\n' +
        '        Voir <a class="ap2" href="/marches/transactions_dirigeants/FR0000120404p">toutes les transactions d\'initiés sur Accor Hotels</a>\n' +
        '    </p>\n' +
        '\n' +
        '\n' +
        '\n' +
        '        <input type="hidden" id="ConsensusData" value="41.6667;48.00;41.245;42.775" />\n' +
        '        <input id="StackDataB" type="hidden" value="3;1;3;2" />\n' +
        '        <input id="StackDataH" type="hidden" value="0;1;0;0" />\n' +
        '        <input id="StackDataS" type="hidden" value="0;0;1;2" />\n' +
        '        <div class="ab12 mt30">Consensus des analystes sur Accor Hotels</div>\n' +
        '        <div class="clearfix">\n' +
        '            <div class="cons_col2">\n' +
        '                <canvas height="270" width="490" id="chartConsensus"></canvas>\n' +
        '            </div>\n' +
        '            <div class="cons_col1">\n' +
        '                <div class="alct mt30 mb20">\n' +
        '                    <button class="btn_abc" id="btnVote">Donnez votre avis</button>\n' +
        '                </div>\n' +
        '                <table class="tablesorter tbl100_6">\n' +
        '                    <tbody>\n' +
        '                        <tr>\n' +
        '                            <td></td>\n' +
        '                            <td></td>\n' +
        '                        </tr>\n' +
        '                        <tr class="bold f16">\n' +
        '                            <td>Consensus</td>\n' +
        '                            <td>42,78&nbsp;&#x20AC;</td>\n' +
        '                        </tr>\n' +
        '                        <tr>\n' +
        '                            <td>Potentiel</td>\n' +
        '                            <td><span class="quote_downb">-4,52%</span></td>\n' +
        '                        </tr>\n' +
        '                        <tr class="quote_upb">\n' +
        '                            <td>Achat</td>\n' +
        '                            <td>2</td>\n' +
        '                        </tr>\n' +
        '                        <tr style="color:#3499ff" class="bold">\n' +
        '                            <td>Conserver</td>\n' +
        '                            <td>0</td>\n' +
        '                        </tr>\n' +
        '                        <tr class="quote_downb">\n' +
        '                            <td>Vente</td>\n' +
        '                            <td>2</td>\n' +
        '                        </tr>\n' +
        '                    </tbody>\n' +
        '                </table>\n' +
        '            </div>\n' +
        '        </div>\n' +
        '        <div class="clearfix mt30">\n' +
        '            <div class="cons_col1">\n' +
        '                <canvas height="320" width="310" id="chartStack"></canvas>\n' +
        '            </div>\n' +
        '            <div class="cons_col2">\n' +
        '                <div class="ab12 mt15">Dernières recommandations</div>\n' +
        '                        <div class="cons_head clearfix">\n' +
        '                            <div class="cons_left">\n' +
        '                                <img src="/api/image/getavatar?id=minouchat" class="mb10 br50" alt="" width="45" height="45" /><br />\n' +
        '                                <a href="/forums/profile/minouchat">minouchat</a>\n' +
        '                            </div>\n' +
        '\n' +
        '                            <div class="cons_high">\n' +
        '                                <span class="co_g2 fr">07/08/2025</span>\n' +
        '                                <span class="quote_upb"><b>HAUSSIER</b></span><span class="cons_obj">Objectif : <b>50€ </b> </span>\n' +
        '                            </div>\n' +
        '\n' +
        '\n' +
        '                            <div class="cons_right">\n' +
        '                                <p>Moyen terme</p>\n' +
        '                            </div>\n' +
        '                        </div>\n' +
        '                        <div class="cons_head clearfix">\n' +
        '                            <div class="cons_left">\n' +
        '                                <img src="/api/image/getavatar?id=souris21" class="mb10 br50" alt="" width="45" height="45" /><br />\n' +
        '                                <a href="/forums/profile/souris21">souris21</a>\n' +
        '                            </div>\n' +
        '\n' +
        '                            <div class="cons_high">\n' +
        '                                <span class="co_g2 fr">31/07/2025</span>\n' +
        '                                <span class="quote_downb"><b>BAISSIER</b></span><span class="cons_obj">Objectif : <b>32€ </b> </span>\n' +
        '                            </div>\n' +
        '\n' +
        '\n' +
        '                            <div class="cons_right">\n' +
        '                                <p>forte baisse a venir</p>\n' +
        '                            </div>\n' +
        '                        </div>\n' +
        '                <div class="mt10"><a class="ap2" href="/analyses/consensus_list/ACp">Voir tous les avis et donnez votre conseil</a></div>\n' +
        '            </div>\n' +
        '        </div>\n' +
        '        <script src="/ext/chartjs38.js"></script>\n' +
        '        <script src="/ext/chartjs100percent.plugin.js"></script>\n' +
        '        <script src="/scripts2/consensus.plugin4.min.js"></script>\n' +
        '\n' +
        '\n' +
        '<p class="co_g2 alct">\n' +
        '    Les cours de bourse en direct pour Euronext. Autres places décalées de 15 minutes.\n' +
        '</p>\n' +
        '\n' +
        '<input type="hidden" id="userid" value="" />\n' +
        '<input type="hidden" id="symbolName" value="Accor Hotels" />\n' +
        '<input type="hidden" id="symbolID" value="FR0000120404p" />\n' +
        '<input type="hidden" id="symbolLast" value="44,8" />\n' +
        '<input type="hidden" id="shortID" value="ACp" />\n' +
        '<span class="no" id="guid">diiv3NgJ-8whfm4qJ6ufwWNxaFLzSwQJM-YZyREOYHMnMxNxMwrDbIC-LLLfGnH4</span>\n' +
        '<input type="hidden" id="sixsymbol" value="AC_25" />\n' +
        '\n' +
        '\n' +
        '            \n' +
        '                \n' +
        '        <div style="margin:60px auto 0 auto;width:500px">\n' +
        '            <p class="alct">\n' +
        '                <a href="/comparatif-des-courtiers">\n' +
        '                    <img src="/5/bannercourtier360.jpg" alt="Comparatif des courtiers en ligne">\n' +
        '                </a>\n' +
        '            </p>\n' +
        '        </div>\n' +
        '\n' +
        '\n' +
        '\n' +
        '\n' +
        '\n' +
        '            \n' +
        '        </div>\n' +
        '            <div class="inner_right">\n' +
        '<div class="stickright">\n' +
        '                        <div id="pbcontent" class="alct" data-id="optihalfpage"></div>\n' +
        '                    </div>\n' +
        '            </div>\n' +
        '    </div>\n' +
        '\n' +
        '    <footer class="footerct">\n' +
        '    <div class="footer">\n' +
        '        Copyright © 1999-2025 ABC Bourse <a href="/accueil/abcbourse_legal2">Mentions légales</a>. Tous droits réservés. Cours en temps réel Six Financial Information.<br />\n' +
        '        <a href="/accueil/contact">Nous écrire</a> | <a href="/accueil/cookies">Politique de confidentialité</a> | <a href="javascript:Sddan.cmp.displayUI()">Cookies</a>\n' +
        '        <br />\n' +
        '        <br />\n' +
        '    </div>\n' +
        '</footer>\n' +
        '\n' +
        '\n' +
        '            <div id="Abcbourse_Habillage"></div>\n' +
        '            <script>\n' +
        '                var slmadshb = slmadshb || {};\n' +
        '                slmadshb.que = slmadshb.que || [];\n' +
        '                slmadshb.que.push(function () {\n' +
        '                    slmadshb.display("Abcbourse_Habillage");\n' +
        '                });\n' +
        '            </script>\n' +
        '        \n' +
        '<script src="https://www.googletagmanager.com/gtag/js?id=G-0Q2B0K8BWH"></script>\n' +
        '<script>\n' +
        '    window.dataLayer = window.dataLayer || [];\n' +
        '    function gtag() { dataLayer.push(arguments); }\n' +
        '    gtag(\'js\', new Date());\n' +
        '\n' +
        '    gtag(\'config\', \'G-0Q2B0K8BWH\');\n' +
        '</script>\n' +
        '\n' +
        '    <script src="/scripts2/jqtools90.min.js"></script>\n' +
        '    \n' +
        '    <script src="/scripts2/streaming7.min.js"></script>\n' +
        '    <script src="/scripts2/abcgraph.pluginVN25.min.js"></script>\n' +
        '    <script src="/scripts2/display2y.min.js"></script>\n' +
        '\n' +
        '\n' +
        '</body>\n' +
        '</html>\n', ticker));
      observer.complete();
    });
  }

  private parseAndMap(html: string, ticker: string): DTOInformationsTicker {
    const result = new DTOInformationsTicker(ticker);

    this.execRegexpAndMap(
      result.informations,
      html,
      new RegExp('<div class="newsln2">\\s*<div>([^>]+)<\\/div>\\s*<div><a href="([^"]+)">([^>]+)<\\/a>', 'gm'),
      (matches) => new DTOInformationTicker(matches[1], matches[3])
    );

    const elTables = new DOMParser()
      .parseFromString(html, 'text/html')
      .querySelectorAll('table.tableDis');

    this.mapVariations(result.variations, elTables[0]);
    this.mapDividendes(result.dividendes, elTables[1]);
    this.mapRatios(result.ratios, elTables[2]);
    this.mapIndicateurs(result, elTables[3]);

    return result;
  }

  private execRegexpAndMap<T>(result: Array<T>, html: string, regexp: RegExp, mapper: (m: Array<string>) => T) {
    let matches;
    while ((matches = regexp.exec(html))) {
      result.push(mapper(matches));
    }
  }

  private mapVariations(variations: DTOVariation[], elTable: Element) {
    elTable.querySelectorAll('tbody > tr:not(:last-child)')
      .forEach(elTr => {
        const elTds = elTr.querySelectorAll('td');
        variations.push(new DTOVariation(elTds[0].innerText, this.parseNumber(elTds[4].innerText)));
      });
  }

  private mapDividendes(dividendes: DTODividende[], elTable: Element) {
    elTable.querySelectorAll('tr:not(:first-child)')
      .forEach(elTr => {
        const elTds: NodeListOf<HTMLTableCellElement> = elTr.querySelectorAll('td');
        dividendes.push(new DTODividende(this.parseYear(elTds[0].innerText), elTds[1].innerText));
      });
  }

  private mapRatios(ratios: DTORatio[], elTable: Element) {
    const elThsAnnees: NodeListOf<HTMLTableCellElement> = elTable.querySelectorAll('thead > tr > th:not(:first-child)');
    const elTdsBnpa: NodeListOf<HTMLTableCellElement> = elTable.querySelectorAll('tbody > tr:nth-child(1) > td:not(:first-child)');
    const elTdsPer: NodeListOf<HTMLTableCellElement> = elTable.querySelectorAll('tbody > tr:nth-child(2) > td:not(:first-child)');
    for (let i = 0; i < elThsAnnees.length; i++) {
      ratios.push(new DTORatio(
        this.parseYear(elThsAnnees[i].innerText),
        this.parseNumber(elTdsBnpa[i].innerText),
        this.parseNumber(elTdsPer[i].innerText))
      );
    }
  }

  private mapIndicateurs(result: DTOInformationsTicker, elTable: Element) {
    const elTrs: NodeListOf<HTMLTableCellElement> = elTable.querySelectorAll('tbody > tr');

    const elTdVariation: HTMLTableCellElement | null = elTrs[0].querySelector('td:nth-child(2)');
    if (elTdVariation) {
      result.variationCAC = this.parseNumber(elTdVariation.innerText) * 100;
    }

    const elTdCorrelation: HTMLTableCellElement | null = elTrs[1].querySelector('td:nth-child(2)');
    if (elTdCorrelation) {
      result.correlationCAC = this.parseNumber(elTdCorrelation.innerText);
    }

    const elSpanQualite: HTMLSpanElement | null = elTrs[2].querySelector('td:nth-child(2) > span');
    if (elSpanQualite) {
      result.qualiteFinanciere = elSpanQualite.innerText;
    }
  }

  private parseNumber(str: string): number {
    const match = str.match(AbcBourseService.regexpNumber);
    if (match) {
      return Number(match[0].replace(',', '.'));
    }
    return NaN;
  }

  private parseYear(str: string): number {
    const match = str.match(AbcBourseService.regexpYear);
    if (match) {
      return Number(match[0]);
    }
    return NaN;
  }
}
