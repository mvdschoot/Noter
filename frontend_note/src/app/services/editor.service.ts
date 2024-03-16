import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { NoteDocument } from '../models/document.model';

@Injectable({
  providedIn: 'root'
})
export class EditorService {
  constructor(private readonly http: HttpClient) {}

  getContent(id: string): Observable<NoteDocument> {
    return this.http.get<NoteDocument>("/api/document/" + id);
  }

  updateContent(id: string, title: string, content: String): Observable<any> {
    let document = {id: id, title: title, content: content};
    return this.http.put("/api/document", document);
  }
}
