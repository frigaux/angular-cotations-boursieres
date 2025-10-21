import {Injectable} from '@angular/core';
import {ConfirmationService} from 'primeng/api';
import {TranslateService} from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})
export class DialogueService {

  constructor(private translateService: TranslateService) {
  }

  confirmationSuppression(confirmationService: ConfirmationService, event: Event, header: string, onSuppression: Function) {
    this.confirmation(confirmationService, event, header, onSuppression, 'COMPOSANTS.COMMUN.SUPPRIMER');
  }

  confirmation(confirmationService: ConfirmationService, event: Event, header: string, onConfirmation: Function, keyTranslation: string) {
    confirmationService.confirm({
      target: event.target as EventTarget,
      header,
      closable: false,
      closeOnEscape: true,
      rejectButtonProps: {
        label: this.translateService.instant('COMPOSANTS.COMMUN.ANNULER'),
        severity: 'warn'
      },
      acceptButtonProps: {
        label: this.translateService.instant(keyTranslation),
        severity: 'danger'
      },
      accept: () => onConfirmation()
    });
  }
}
