import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CataloguedSlidesComponent } from './catalogued-slides.component';

describe('CataloguedSlidesComponent', () => {
  let component: CataloguedSlidesComponent;
  let fixture: ComponentFixture<CataloguedSlidesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CataloguedSlidesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CataloguedSlidesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
