import { Component, ElementRef, OnInit, ViewChild, inject } from '@angular/core';
import { ListService as ListService } from '../services/list.service';
import { NoteDocument } from '../models/document.model';
import { NgClass, NgFor } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { UserService } from '../services/user.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-list',
  standalone: true,
  imports: [NgFor, HttpClientModule, ReactiveFormsModule, NgClass],
  templateUrl: './list.component.html',
  styleUrl: './list.component.scss'
})

export class ListComponent implements OnInit{
  notes!: Array<NoteDocument>;
  user_name!: String;

  isShowingTrashCan = false;

  @ViewChild("createModal") createModal!: ElementRef;
  createForm = new FormGroup({
    title: new FormControl("")
  });

  constructor(private readonly listService: ListService,
      private readonly userService: UserService,
      private modalService: NgbModal,
      private route: Router) {}

  ngOnInit() {
    this.listService.getNotes().subscribe((notes) => {
      this.notes = notes;
    });

    this.user_name = this.userService.getUser();
  }

  openCreateModal() {
    this.modalService.open(this.createModal).result.then((result) => {
      let title = this.createForm.controls.title.value;
      if (title == null || title == "") {
        return;
      }
      this.listService.addNote(title).subscribe((id) => {
        this.route.navigate(["/edit/" + id!]);
      });
    })
  }

  deleteNote(id: string) {
    this.listService.deleteNote(id).subscribe((_dummy) => {
      this.ngOnInit();
    })
  }
}
