import { HttpClient } from '@angular/common/http';
import { APP_ID, Injectable } from '@angular/core';
import { UserService } from './user.service';
import { Observable } from 'rxjs';
import { Document } from '../models/document.model';

@Injectable({
  providedIn: 'root'
})
export class NoteListService {
  public API_URL: string = "localhost:8000";

  constructor(
    private readonly http: HttpClient,
    private readonly userService: UserService) { }

  getNotes(): Observable<Array<Document>> {
    return this.http.get<Array<Document>>("/api/documents/" + this.userService.getUser())
  }
}
