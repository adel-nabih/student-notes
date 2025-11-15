import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadNotes } from './upload-notes';

describe('UploadNotes', () => {
  let component: UploadNotes;
  let fixture: ComponentFixture<UploadNotes>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UploadNotes]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UploadNotes);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
