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

  describe('Given ConfirmationService.confirm', () => {
    let onSuppression: Function;
    let confirmation: any;

    beforeEach(() => {
      onSuppression = jasmine.createSpy('onSuppression');
      spyOn(confirmationService, 'confirm').and.callThrough();
      dialogueService.confirmationSuppression(confirmationService,
        new MouseEvent('click'), '', onSuppression);
      expect(confirmationService.confirm).toHaveBeenCalled();
      confirmation = (confirmationService.confirm as jasmine.Spy).calls.mostRecent().args[0];
    });

    it('when trigger accept then onSuppression is called', () => {
      confirmation.accept();
      expect(onSuppression).toHaveBeenCalled();
    });
  });
});
