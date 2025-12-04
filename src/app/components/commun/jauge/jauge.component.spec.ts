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
    const donnees = {cours: 3, plusBas: 2, plusHaut: 5};
    fixture.componentRef.setInput('donnees' , donnees);
    fixture.detectChanges();

    const labels = fixture.debugElement.queryAll(By.css('.libelles span'));
    expect(labels.length).toBe(2);
    expect(labels[0].nativeElement.textContent.trim()).toContain(donnees.plusBas);
    expect(labels[1].nativeElement.textContent.trim()).toContain(donnees.plusHaut);
  });

  it('should render percentage bar with correct width and red class when < 50%', () => {
    const donnees = {cours: 5, plusBas: 4, plusHaut: 8};
    fixture.componentRef.setInput('donnees' , donnees);
    fixture.detectChanges();

    const barDe = fixture.debugElement.query(By.css('.pourcentage'));
    expect(barDe).toBeTruthy();
    const barEl: HTMLElement = barDe.nativeElement;
    expect(barEl.style.width).toBe('25%');
    expect(barEl.classList.contains('rouge')).toBeTrue();
    expect(barEl.classList.contains('vert')).toBeFalse();
  });

  it('should render percentage bar with green class when >= 50%', () => {
    const donnees = {cours: 7, plusBas: 4, plusHaut: 8};
    fixture.componentRef.setInput('donnees' , donnees);
    fixture.detectChanges();

    const barDe = fixture.debugElement.query(By.css('.pourcentage'));
    expect(barDe).toBeTruthy();
    const barEl: HTMLElement = barDe.nativeElement;
    expect(barEl.style.width).toBe('75%');
    expect(barEl.classList.contains('vert')).toBeTrue();
    expect(barEl.classList.contains('rouge')).toBeFalse();
  });

  it('should not render the percentage bar when pourcentage is 0 or undefined', () => {
    // undefined
    fixture.componentRef.setInput('donnees' , undefined);
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('.pourcentage'))).toBeNull();

    // 0 is falsy, should not render due to template @if (pourcentage)
    const donnees = {cours: 4, plusBas: 4, plusHaut: 8};
    fixture.componentRef.setInput('donnees' , donnees);
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('.pourcentage'))).toBeNull();
  });
});
