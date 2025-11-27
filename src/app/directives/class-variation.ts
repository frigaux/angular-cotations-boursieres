import {Directive, ElementRef, input, InputSignal} from '@angular/core';

@Directive({
  selector: '[appClassVariation]'
})
export class ClassVariation {
  inputVariation: InputSignal<number | undefined> = input(undefined,
    {transform: o => this.intercepteurVariation(o), alias: 'appClassVariation'});

  constructor(private el: ElementRef) {
  }

  private intercepteurVariation(variation?: number) {
    const nativeElement = this.el.nativeElement;
    nativeElement.classList.remove('positive', 'negative');
    if (variation) { // !undefined, !null, !0, !NaN
      if (variation >= 0) {
        nativeElement.classList.add('positive');
      } else {
        nativeElement.classList.add('negative');
      }
    }
    return variation;
  }
}
