import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChosenSlidesComponent } from './chosen-slides.component';

describe('ChosenSlidesComponent', () => {
  let component: ChosenSlidesComponent;
  let fixture: ComponentFixture<ChosenSlidesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChosenSlidesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChosenSlidesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
