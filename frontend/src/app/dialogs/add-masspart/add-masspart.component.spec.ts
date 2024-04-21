import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddMasspartComponent } from './add-masspart.component';

describe('AddMasspartComponent', () => {
  let component: AddMasspartComponent;
  let fixture: ComponentFixture<AddMasspartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddMasspartComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddMasspartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
