import {ComponentFixture, TestBed} from '@angular/core/testing';

import {DernieresExecutionsBatchs} from './dernieres-executions-batchs.component';
import {BatchService} from '../../../services/batch/batch.service';
import {TranslateModule} from '@ngx-translate/core';
import {provideAnimations} from '@angular/platform-browser/animations';
import {of} from 'rxjs';
import {DTO_BATCHS} from '../../../services/jdd/jdd-batch.dataset';
import {By} from '@angular/platform-browser';
import {DebugElement} from '@angular/core';

describe('DernieresExecutionsBatchs', () => {
  let component: DernieresExecutionsBatchs;
  let fixture: ComponentFixture<DernieresExecutionsBatchs>;

  const mockBatchService = jasmine.createSpyObj('BatchService', ['chargerDerniereExecution']);

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        DernieresExecutionsBatchs,
        TranslateModule.forRoot({})
      ],
      providers: [
        {provide: BatchService, useValue: mockBatchService},
        provideAnimations()
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(DernieresExecutionsBatchs);
    component = fixture.componentInstance;
  });

  describe('Given #chargerDerniereExecution renvoie des batchs', () => {
    beforeEach(() => {
      mockBatchService.chargerDerniereExecution.and.returnValue(of(DTO_BATCHS));
    });

    it('when #ngOnInit then le composant est chargé', () => {
      expect(component).toBeDefined();
      expect(component.loading).toBeTrue();
      fixture.detectChanges(); // appelle le ngOnInit
      expect(component.loading).toBeFalse();
      expect(component.jobInstances).toBeDefined();
      const elDivBatchs: DebugElement[] = fixture.debugElement.queryAll(By.css('.job-instance'));
      expect(elDivBatchs).toHaveSize(DTO_BATCHS.length);
    });
  });
});
