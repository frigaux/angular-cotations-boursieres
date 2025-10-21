import {TestBed} from '@angular/core/testing';
import {AppInitializerService} from './app-initializer-service';
import {Capacitor} from '@capacitor/core';
import {environment} from '../../../environments/environment';
import {CapacitorHttpPlugin} from '@capacitor/core/types/core-plugins';

// Généré par Junie le 19/09/2025
describe('AppInitializerService', () => {
  let service: AppInitializerService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AppInitializerService]
    });
    service = TestBed.inject(AppInitializerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('Given une date mockée et la méthode request mockée avec succès', () => {
    let mockRequest: jasmine.Spy;

    beforeEach(() => {
      spyOn(Date, 'now').and.returnValue(1234567890);

      mockRequest = jasmine.createSpy('request').and.returnValue(Promise.resolve());
      spyOn(service as any, 'capacitorHttp').and.returnValue(
        {request: mockRequest} as unknown as CapacitorHttpPlugin
      );
    });

    it('when !isNativePlatform et #prechaufferDnsEtHttp then la méthode request mockée n\'est pas appelée', (done) => {
      spyOn(Capacitor, 'isNativePlatform').and.returnValue(false);

      service.prechaufferDnsEtHttp().subscribe({
        next: () => fail('Should not emit next values'),
        error: err => fail('Should not error: ' + err),
        complete: () => {
          expect(mockRequest).not.toHaveBeenCalled();
          done();
        }
      });
    });

    it('when isNativePlatform et #prechaufferDnsEtHttp then la méthode request mockée est appelée trois fois', (done) => {
      spyOn(Capacitor, 'isNativePlatform').and.returnValue(true);

      service.prechaufferDnsEtHttp().subscribe({
        next: () => fail('Should not emit next values'),
        error: err => fail('Should not error: ' + err),
        complete: () => {
          expect(mockRequest).toHaveBeenCalledTimes(3);

          const urls = [
            `${environment.staticPrefixUrl}?_prewarm=1234567890`,
            `${environment.apiPrefixUrl}?_prewarm=1234567890`,
            `http://fabien.rigaux.free.fr?_prewarm=1234567890`
          ];

          mockRequest.calls.allArgs().forEach((call, i) => {
            const opts = call[0];
            expect(opts.method).toBe('GET');
            expect(opts.connectTimeout).toBe(500);
            expect(opts.readTimeout).toBe(500);
            expect(opts.url).toBe(urls[i]);
          });

          done();
        }
      });
    });
  });
});
