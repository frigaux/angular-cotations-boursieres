import {ComponentFixture, TestBed} from '@angular/core/testing';

import {EntrainementModeleComponent} from './entrainement-modele.component';
import {TranslateModule} from '@ngx-translate/core';

describe('EntrainementModeleComponent', () => {
  let component: EntrainementModeleComponent;
  let fixture: ComponentFixture<EntrainementModeleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EntrainementModeleComponent,
        TranslateModule.forRoot({})]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EntrainementModeleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeDefined();
  });
});
