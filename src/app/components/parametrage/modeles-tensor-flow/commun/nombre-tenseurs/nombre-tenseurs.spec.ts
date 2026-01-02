import {ComponentFixture, TestBed} from '@angular/core/testing';

import {NombreTenseurs} from './nombre-tenseurs';

describe('NombreTenseurs', () => {
  let component: NombreTenseurs;
  let fixture: ComponentFixture<NombreTenseurs>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NombreTenseurs]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NombreTenseurs);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
