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
        label: this.translateService.instant('COMPOSANTS.COMMUN.SUPPRIMER'),
        severity: 'danger'
      },
      accept: () => onSuppression()
    });
  }
}
