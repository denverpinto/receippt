import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteMasspartComponent } from './delete-masspart.component';

describe('DeleteMasspartComponent', () => {
  let component: DeleteMasspartComponent;
  let fixture: ComponentFixture<DeleteMasspartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeleteMasspartComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeleteMasspartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
