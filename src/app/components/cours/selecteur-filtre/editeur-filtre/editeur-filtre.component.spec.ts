import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditeurFiltreComponent } from './editeur-filtre.component';

describe('EditeurFiltreComponent', () => {
  let component: EditeurFiltreComponent;
  let fixture: ComponentFixture<EditeurFiltreComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditeurFiltreComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditeurFiltreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
