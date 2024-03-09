import { HttpClient } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { Document } from '../models/document.model';

@Injectable({
  providedIn: 'root'
})
export class EditorService {
  constructor(private readonly http: HttpClient) {}

  getContent(id: string): Observable<Document> {
    return this.http.get<Document>("/api/document/" + id);
  }

  updateContent(id: string, content: String): Observable<any> {
    let document = {id: id, content: content};
    return this.http.put("/api/document", document);
  }
}
