import {ClassVariation} from './class-variation';
import {Component} from '@angular/core';
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {By} from '@angular/platform-browser';

// host component for directive testing
@Component({
  imports: [
    ClassVariation
  ],
  template: '<div [appClassVariation]="value"></div>'
})
class HostTestComponent {
  value?: number;
}

describe('ClassVariation', () => {
  let fixture: ComponentFixture<HostTestComponent>;
  let host: HostTestComponent;
  let elDiv: HTMLElement;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ClassVariation]
    });

    fixture = TestBed.createComponent(HostTestComponent);
    host = fixture.componentInstance;
    elDiv = fixture.debugElement.query(By.css('div')).nativeElement;
  });

  it('should work', () => {
    host.value = 0;
    fixture.detectChanges();
    expect(elDiv.classList.value).toBe('');
    host.value = 1;
    fixture.detectChanges();
    expect(elDiv.classList.value).toBe('positive');
    host.value = -1;
    fixture.detectChanges();
    expect(elDiv.classList.value).toBe('negative');
    host.value = undefined;
    fixture.detectChanges();
    expect(elDiv.classList.value).toBe('');
  });
});
