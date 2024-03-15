import { Routes } from '@angular/router';
import { EditorComponent } from '../editor/editor.component';
import { ListComponent } from '../list/list.component';

export const routes: Routes = [
    {path: '', component: ListComponent},
    {path: 'edit/:id', component: EditorComponent},
];
