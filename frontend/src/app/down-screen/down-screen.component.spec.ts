import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DownScreenComponent } from './down-screen.component';

describe('DownScreenComponent', () => {
  let component: DownScreenComponent;
  let fixture: ComponentFixture<DownScreenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DownScreenComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DownScreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
