import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TableauAchats } from './tableau-achats';

describe('TableauAchats', () => {
  let component: TableauAchats;
  let fixture: ComponentFixture<TableauAchats>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TableauAchats]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TableauAchats);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
