import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MoyennesMobilesComponent } from './moyennes-mobiles.component';
import {TranslateModule} from '@ngx-translate/core';

describe('MoyennesMobilesComponent', () => {
  let component: MoyennesMobilesComponent;
  let fixture: ComponentFixture<MoyennesMobilesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        MoyennesMobilesComponent,
        TranslateModule.forRoot({})
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MoyennesMobilesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeDefined();
  });
});
