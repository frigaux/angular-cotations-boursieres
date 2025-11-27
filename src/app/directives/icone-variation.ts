import {Directive, ElementRef, input, InputSignal} from '@angular/core';

@Directive({
  selector: '[appIconeVariation]'
})
export class IconeVariation {
  inputVariation: InputSignal<number | undefined> = input(undefined,
    {transform: o => this.intercepteurVariation(o), alias: 'appIconeVariation'});

  constructor(private el: ElementRef) {
  }

  private intercepteurVariation(variation?: number) {
    const nativeElement = this.el.nativeElement;
    nativeElement.classList.remove('pi-arrow-circle-right', 'pi-arrow-circle-up', 'pi-arrow-circle-down');
    if (variation !== undefined && variation !== null && !isNaN(variation)) {
      if (variation === 0) {
        nativeElement.classList.add('pi-arrow-circle-right');
      } else if (variation > 0) {
        nativeElement.classList.add('pi-arrow-circle-up');
      } else {
        nativeElement.classList.add('pi-arrow-circle-down');
      }
    }
    return variation;
  }
}
