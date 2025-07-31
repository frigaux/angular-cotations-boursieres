import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelecteurFiltreComponent } from './selecteur-filtre.component';

describe('SelecteurFiltreComponent', () => {
  let component: SelecteurFiltreComponent;
  let fixture: ComponentFixture<SelecteurFiltreComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SelecteurFiltreComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SelecteurFiltreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
