import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/template-old/app.config';
import { NoteListComponent } from './app/note-list/note-list.component';

bootstrapApplication(NoteListComponent, appConfig)
  .catch((err) => console.error(err));
