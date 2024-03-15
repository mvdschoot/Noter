import { Component, EventEmitter, HostListener, Output } from '@angular/core';
import { StyleCommand } from '../models/style-command.model';

@Component({
  selector: 'app-toolbar',
  standalone: true,
  imports: [],
  templateUrl: './toolbar.component.html',
  styleUrl: './toolbar.component.scss'
})
export class ToolbarComponent {
  @Output() commandEmitter = new EventEmitter<StyleCommand>();

  constructor() {}

  undo() {
    console.log("undo clicked");
  }
  
  redo() {
    console.log("redo clicked");
  }

  setBold() {
    this.commandEmitter.emit(StyleCommand.Bold);
  }

  setItalic() {
    this.commandEmitter.emit(StyleCommand.Italic);
  }

  setUnderline() {
    this.commandEmitter.emit(StyleCommand.Underline);
  }

  setStrikethrough() {
    this.commandEmitter.emit(StyleCommand.Strikethrough);
  }

  setBulletList() {
    this.commandEmitter.emit(StyleCommand.BulletList);
  }

  setNumberedList() {
    this.commandEmitter.emit(StyleCommand.NumberedList);
  }

  setIndent() {
    this.commandEmitter.emit(StyleCommand.Indent);
  }

  setDeIndent() {
    this.commandEmitter.emit(StyleCommand.DeIndent);
  }

  setLink() {
    this.commandEmitter.emit(StyleCommand.Link);
  }

  setCode() {
    this.commandEmitter.emit(StyleCommand.Code);
  }

  setHeader1() {
    this.commandEmitter.emit(StyleCommand.Header1);
  }

  setHeader2() {
    this.commandEmitter.emit(StyleCommand.Header2);
  }

  setHeader3() {
    this.commandEmitter.emit(StyleCommand.Header3);
  }

  @HostListener('mousedown', ['$event'])
  preventFocus(event: MouseEvent) {
    event.preventDefault();
  }
}
