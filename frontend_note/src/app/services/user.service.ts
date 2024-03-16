import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor() { }

  getUser(): String {
    return "Mathijs van der Schoot";
  }
}
