import { Component, OnInit, inject } from '@angular/core';
import { NoteListService } from '../services/note-list.service';
import { Document } from '../models/document.model';
import { NgFor } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-note-list',
  standalone: true,
  imports: [NgFor, HttpClientModule],
  templateUrl: './note-list.component.html',
  styleUrl: './note-list.component.scss'
})

export class NoteListComponent implements OnInit{
  notes!: Array<Document>;

  constructor(private readonly listService: NoteListService) {}

  ngOnInit(): void {
    this.listService.getNotes().subscribe((notes) => {
      this.notes = notes;
    });
  }

}
