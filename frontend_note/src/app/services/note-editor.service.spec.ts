import { TestBed } from '@angular/core/testing';

import { NoteEditorService } from './note-editor.service';

describe('NoteEditorService', () => {
  let service: NoteEditorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NoteEditorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
