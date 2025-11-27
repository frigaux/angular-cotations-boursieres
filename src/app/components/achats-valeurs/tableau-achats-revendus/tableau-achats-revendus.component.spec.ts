import {ComponentFixture, TestBed} from '@angular/core/testing';

import {TableauAchatsRevendusComponent} from './tableau-achats-revendus.component';
import {TranslateModule} from '@ngx-translate/core';

describe('TableauAchatsRevendusComponent', () => {
  let component: TableauAchatsRevendusComponent;
  let fixture: ComponentFixture<TableauAchatsRevendusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        TableauAchatsRevendusComponent,
        TranslateModule.forRoot({})
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(TableauAchatsRevendusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeDefined();
  });
});
