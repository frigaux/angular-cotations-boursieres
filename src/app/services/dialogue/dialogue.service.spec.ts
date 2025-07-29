import {TestBed} from '@angular/core/testing';

import {DialogueService} from './dialogue.service';
import {TranslateModule} from '@ngx-translate/core';
import {ConfirmationService} from 'primeng/api';

describe('DialogueService', () => {
  let dialogueService: DialogueService;
  let confirmationService: ConfirmationService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        TranslateModule.forRoot({})
      ],
      providers: [
        ConfirmationService
      ]
    });
    dialogueService = TestBed.inject(DialogueService);
    confirmationService = TestBed.inject(ConfirmationService);
  });

  it('should be created', () => {
    expect(dialogueService).toBeTruthy();
    dialogueService.confirmationSuppression(confirmationService,
      new MouseEvent('click'), '', () => {
      });
  });
});
