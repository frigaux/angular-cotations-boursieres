import {ComponentFixture, TestBed} from '@angular/core/testing';
import {By} from '@angular/platform-browser';

import {JaugeComponent} from './jauge.component';
import {TranslateModule} from '@ngx-translate/core';

// généré par Junie le 04/11/2025
describe('JaugeComponent', () => {
  let component: JaugeComponent;
  let fixture: ComponentFixture<JaugeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        JaugeComponent,
        TranslateModule.forRoot({})
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(JaugeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeDefined();
  });

  it('should display translated min and max labels', () => {
    fixture.componentRef.setInput('cleMinimum' , 'minKey');
    fixture.componentRef.setInput('cleMaximum' , 'maxKey');
    fixture.detectChanges();

    const labels = fixture.debugElement.queryAll(By.css('.libelles span'));
    expect(labels.length).toBe(2);
    expect(labels[0].nativeElement.textContent.trim()).toBe('minKey');
    expect(labels[1].nativeElement.textContent.trim()).toBe('maxKey');
  });

  it('should render percentage bar with correct width and red class when < 50%', () => {
    fixture.componentRef.setInput('pourcentage', 25);
    fixture.detectChanges();

    const barDe = fixture.debugElement.query(By.css('.pourcentage'));
    expect(barDe).toBeTruthy();
    const barEl: HTMLElement = barDe.nativeElement;
    expect(barEl.style.width).toBe('25%');
    expect(barEl.classList.contains('rouge')).toBeTrue();
    expect(barEl.classList.contains('vert')).toBeFalse();
  });

  it('should render percentage bar with green class when >= 50%', () => {
    fixture.componentRef.setInput('pourcentage' , 80);
    fixture.detectChanges();

    const barDe = fixture.debugElement.query(By.css('.pourcentage'));
    expect(barDe).toBeTruthy();
    const barEl: HTMLElement = barDe.nativeElement;
    expect(barEl.style.width).toBe('80%');
    expect(barEl.classList.contains('vert')).toBeTrue();
    expect(barEl.classList.contains('rouge')).toBeFalse();
  });

  it('should not render the percentage bar when pourcentage is 0 or undefined', () => {
    // undefined
    fixture.componentRef.setInput('pourcentage', undefined);
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('.pourcentage'))).toBeNull();

    // 0 is falsy, should not render due to template @if (pourcentage)
    fixture.componentRef.setInput('pourcentage', 0);
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('.pourcentage'))).toBeNull();
  });
});
