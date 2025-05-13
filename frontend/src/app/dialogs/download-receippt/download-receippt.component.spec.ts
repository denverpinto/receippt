import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DownloadReceipptComponent } from './download-receippt.component';

describe('DownloadReceipptComponent', () => {
  let component: DownloadReceipptComponent;
  let fixture: ComponentFixture<DownloadReceipptComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DownloadReceipptComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DownloadReceipptComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
