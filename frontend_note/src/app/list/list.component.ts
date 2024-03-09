import { Component, OnInit, inject } from '@angular/core';
import { ListService as ListService } from '../services/list.service';
import { Document } from '../models/document.model';
import { NgFor } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-list',
  standalone: true,
  imports: [NgFor, HttpClientModule],
  templateUrl: './list.component.html',
  styleUrl: './list.component.scss'
})

export class ListComponent implements OnInit{
  notes!: Array<Document>;
  user_name!: String;

  constructor(private readonly listService: ListService,
      private readonly userService: UserService) {}

  ngOnInit(): void {
    this.listService.getNotes().subscribe((notes) => {
      this.notes = notes;
    });

    this.user_name = this.userService.getUser();
  }
}
