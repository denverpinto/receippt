import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MasspartContentComponent } from './masspart-content.component';

describe('MasspartContentComponent', () => {
  let component: MasspartContentComponent;
  let fixture: ComponentFixture<MasspartContentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MasspartContentComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MasspartContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
