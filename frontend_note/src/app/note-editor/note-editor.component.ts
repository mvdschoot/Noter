import { Component, OnInit } from '@angular/core';
import { NoteEditorService } from '../services/note-editor.service';
import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-note-editor',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './note-editor.component.html',
  styleUrl: './note-editor.component.scss'
})
export class NoteEditorComponent implements OnInit{
  doc_id!: string;
  content!: String;

  constructor(private readonly noteService: NoteEditorService,
    private readonly route: ActivatedRoute) {}

  ngOnInit(): void {
    this.doc_id = this.route.snapshot.paramMap.get("id")!;
    this.noteService.getContent(this.doc_id).subscribe((document) => {
      this.content = document.content;
    })
  }

  change(): void {
    console.log(this.content);
    this.noteService.updateContent(this.doc_id, this.content).subscribe((_) => {return;});
  }
}
