import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FilterSlideComponent } from './filter-slide.component';

describe('FilterSlideComponent', () => {
  let component: FilterSlideComponent;
  let fixture: ComponentFixture<FilterSlideComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FilterSlideComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FilterSlideComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
