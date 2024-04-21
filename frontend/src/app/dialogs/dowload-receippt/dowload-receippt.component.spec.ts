import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DowloadReceipptComponent } from './dowload-receippt.component';

describe('DowloadReceipptComponent', () => {
  let component: DowloadReceipptComponent;
  let fixture: ComponentFixture<DowloadReceipptComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DowloadReceipptComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DowloadReceipptComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
