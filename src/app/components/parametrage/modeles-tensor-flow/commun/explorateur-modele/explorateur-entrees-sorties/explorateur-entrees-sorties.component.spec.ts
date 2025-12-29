import {ComponentFixture, TestBed} from '@angular/core/testing';

import {ExplorateurEntreesSortiesComponent} from './explorateur-entrees-sorties.component';

describe('ExplorateurEntreesSortiesComponent', () => {
  let component: ExplorateurEntreesSortiesComponent;
  let fixture: ComponentFixture<ExplorateurEntreesSortiesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExplorateurEntreesSortiesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExplorateurEntreesSortiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
