import {TestBed} from '@angular/core/testing';
import {AppInitializerService} from './app-initializer-service';
import {Capacitor, CapacitorHttp} from '@capacitor/core';
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

  describe('#prechaufferDnsEtHttp', () => {
    afterEach(() => {
      // restore any spied globals
      (Date.now as any).and?.callThrough?.();
    });

    it('completes immediately on non-native platforms without HTTP calls', (done) => {
      spyOn(Capacitor, 'isNativePlatform').and.returnValue(false);
      const httpSpy = spyOn(CapacitorHttp, 'request');

      service.prechaufferDnsEtHttp().subscribe({
        next: () => fail('Should not emit next values'),
        error: err => fail('Should not error: ' + err),
        complete: () => {
          expect(httpSpy).not.toHaveBeenCalled();
          done();
        }
      });
    });

    it('on native platforms, performs two GET requests with prewarm param and completes', (done) => {
      spyOn(Capacitor, 'isNativePlatform').and.returnValue(true);
      spyOn(Date, 'now').and.returnValue(1234567890);

      const mockRequest = jasmine.createSpy('request').and.callFake((opts: any) => {
        // simulate quick successful responses
        return Promise.resolve({
          data: null,
          status: 200,
          headers: {},
          url: opts.url
        } as any);
      });
      const mockCapacitorHttpPlugin = { request: mockRequest } as unknown as CapacitorHttpPlugin;
      spyOn<any>(service as any, 'capacitorHttp').and.returnValue(mockCapacitorHttpPlugin);

      service.prechaufferDnsEtHttp().subscribe({
        next: () => fail('Should not emit next values'),
        error: err => fail('Should not error: ' + err),
        complete: () => {
          expect(mockRequest).toHaveBeenCalledTimes(2);

          const expectedUrl1 = `${environment.staticPrefixUrl}?_prewarm=1234567890`;
          const expectedUrl2 = `${environment.apiPrefixUrl}?_prewarm=1234567890`;

          const calledUrls = mockRequest.calls.allArgs().map(args => args[0].url);
          expect(calledUrls).toContain(expectedUrl1);
          expect(calledUrls).toContain(expectedUrl2);

          // Also ensure method and timeouts are set as in the service
          for (const call of mockRequest.calls.allArgs()) {
            const opts = call[0];
            expect(opts.method).toBe('GET');
            expect(opts.connectTimeout).toBe(500);
            expect(opts.readTimeout).toBe(500);
          }

          done();
        }
      });
    });
  });
});
