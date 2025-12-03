import {ComponentFixture, TestBed} from '@angular/core/testing';

import {TableauAchatsComponent} from './tableau-achats.component';

describe('TableauAchatsComponent', () => {
  let component: TableauAchatsComponent;
  let fixture: ComponentFixture<TableauAchatsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TableauAchatsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TableauAchatsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeDefined();
  });
});
