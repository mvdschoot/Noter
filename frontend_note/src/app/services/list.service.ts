import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UserService } from './user.service';
import { Observable } from 'rxjs';
import { NoteDocument } from '../models/document.model';

@Injectable({
  providedIn: 'root'
})
export class ListService {
  public API_URL: string = "localhost:8000";

  constructor(
    private readonly http: HttpClient,
    private readonly userService: UserService) { }

  getNotes(): Observable<Array<NoteDocument>> {
    return this.http.get<Array<NoteDocument>>("/api/documents/" + this.userService.getUser())
  }

  addNote(name: string): Observable<String> {
    const bod = {
      user_id: this.userService.getUser(),
      title: name,
      content: ''
    }
    return this.http.post("/api/document", bod, {responseType: 'text'});
  }

  deleteNote(id: string): Observable<Object> {
    return this.http.delete("/api/document/" + id);
  }
}
