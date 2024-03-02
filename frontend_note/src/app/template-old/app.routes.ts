import { Routes } from '@angular/router';
import { NoteListService } from '../services/note-list.service';
import { NoteEditorComponent } from '../note-editor/note-editor.component';
import { NoteListComponent } from '../note-list/note-list.component';

export const routes: Routes = [
    {path: '', component: NoteListComponent},
    {path: 'edit/:id', component: NoteEditorComponent},
];
