import {ComponentFixture, TestBed} from '@angular/core/testing';

import {DetailsValeurComponent} from './details-valeur.component';
import {TranslateModule} from '@ngx-translate/core';

describe('DetailsValeurComponent', () => {
  let component: DetailsValeurComponent;
  let fixture: ComponentFixture<DetailsValeurComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        DetailsValeurComponent,
        TranslateModule.forRoot({})
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(DetailsValeurComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeDefined();
  });
});
