import {Injectable} from '@angular/core';
import {Capacitor, CapacitorHttp, HttpOptions, HttpResponse} from '@capacitor/core';
import {environment} from '../../../environments/environment';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AppInitializerService {
  /**
   * Préchauffage de HTTP/DNS sur Android/iOS pour éviter une première requête très lente ~2 minutes.
   */
  public prechaufferDnsEtHttp(): Observable<void> {
    if (Capacitor.isNativePlatform()) { // Android/iOS
      return new Observable(observer => {
        const now = Date.now();
        const urls = [
          `${environment.staticPrefixUrl}?_prewarm=${now}`,
          `${environment.apiPrefixUrl}?_prewarm=${now}`
        ];
        Promise.allSettled(urls.map(url => this.requestGet(url)))
          .then(value => {
            observer.complete();
          })
          .catch(error => {
            console.log(error);
            observer.error(error);
            observer.complete();
          })
      });
    } else {
      return new Observable(observer => observer.complete());
    }
  }

  private async requestGet(url: string): Promise<HttpResponse> {
    const options: HttpOptions = {
      url,
      method: 'GET',
      connectTimeout: 500,
      readTimeout: 500
    };
    return CapacitorHttp.request(options);
  }
}
