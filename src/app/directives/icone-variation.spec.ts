import {Component} from '@angular/core';
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {By} from '@angular/platform-browser';
import {IconeVariation} from './icone-variation';

// host component for directive testing
@Component({
  imports: [
    IconeVariation
  ],
  template: '<div [appIconeVariation]="value"></div>'
})
class HostTestComponent {
  value?: number;
}

describe('IconeVariation', () => {
  let fixture: ComponentFixture<HostTestComponent>;
  let host: HostTestComponent;
  let elDiv: HTMLElement;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [IconeVariation]
    });

    fixture = TestBed.createComponent(HostTestComponent);
    host = fixture.componentInstance;
    elDiv = fixture.debugElement.query(By.css('div')).nativeElement;
  });

  it('should work', () => {
    host.value = 0;
    fixture.detectChanges();
    expect(elDiv.classList.value).toBe('pi-arrow-circle-right');
    host.value = 1;
    fixture.detectChanges();
    expect(elDiv.classList.value).toBe('pi-arrow-circle-up');
    host.value = -1;
    fixture.detectChanges();
    expect(elDiv.classList.value).toBe('pi-arrow-circle-down');
    host.value = undefined;
    fixture.detectChanges();
    expect(elDiv.classList.value).toBe('');
  });
});
