import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RenameMasspartComponent } from './rename-masspart.component';

describe('RenameMasspartComponent', () => {
  let component: RenameMasspartComponent;
  let fixture: ComponentFixture<RenameMasspartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RenameMasspartComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RenameMasspartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
