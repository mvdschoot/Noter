import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { EditorService } from '../services/editor.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ToolbarComponent } from "../toolbar/toolbar.component";
import { StyleCommand } from '../models/style-command.model';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-editor',
    standalone: true,
    templateUrl: './editor.component.html',
    styleUrl: './editor.component.scss',
    imports: [ReactiveFormsModule, ToolbarComponent]
})
export class EditorComponent implements OnInit {
  id!: string;
  @ViewChild("title") title!: ElementRef;
  @ViewChild("textArea") content!: ElementRef;
  @ViewChild("linkModal") linkModal!: ElementRef;
  preModalRange: Range | undefined;
  linkForm = new FormGroup({
    link: new FormControl(""),
    placeholder: new FormControl("")
  });

  constructor(private readonly route: ActivatedRoute,
    private readonly noteService: EditorService,
    private modalService: NgbModal,
    public router: Router) {}

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get("id")!;
    this.noteService.getContent(this.id).subscribe((doc) => {
      this.title.nativeElement.innerHTML = doc.title;
      this.content.nativeElement.innerHTML = doc.content;
    })
  }

  change(): void {
    this.noteService.updateContent(this.id!, this.title.nativeElement.innerHTML!, this.content.nativeElement.innerHTML!).subscribe((_) => {return;});
  }

  markdownCommandHandler(event: StyleCommand) {
    switch (event) {
      case StyleCommand.Bold: 
        this.set("B");
        break;
      case StyleCommand.Italic: 
        this.set("I");
        break;
      case StyleCommand.Underline: 
        this.set("U");
        break;
      case StyleCommand.Strikethrough: 
        this.set("S");
        break;
      case StyleCommand.BulletList: 
        this.setList("ul");
        break;
      case StyleCommand.NumberedList: 
        this.setList("ol");
        break;
      case StyleCommand.Indent:
        this.indent();
        break;
      case StyleCommand.DeIndent: 
        this.deIndent();
        break;
      case StyleCommand.Link: 
        this.openLinkModal();
        break;
      case StyleCommand.Code: 
        this.setCode();
        break;
      case StyleCommand.Header1: 
        this.set("h1");
        break;
      case StyleCommand.Header2:
        this.set("h2");
        break;
      case StyleCommand.Header3:
        this.set("h3");
        break;
    }
  }

  insertTab() {
    let tab = document.createTextNode("\u00a0\u00a0\u00a0\u00a0");

    let selection = window.getSelection();
    selection?.getRangeAt(0).insertNode(tab);

    let newRange = document.createRange();
    newRange.setStart(tab, 0);
    selection?.getRangeAt(0).setStart(tab, 4);
    // selection?.removeAllRanges()
    // selection?.addRange(newRange);
  }

  setCode() {
    this.set("CODE", "code");
  }

  openLinkModal() {
    let selection = window.getSelection()!;
    var preModalRange: Range | undefined;
    if (selection.rangeCount !== 0) {
      preModalRange = selection!.getRangeAt(0).cloneRange();
    }

    this.modalService.open(this.linkModal).result.then((result) => {
      this.addLink(preModalRange);
      this.linkForm.controls.link.setValue("");
      this.linkForm.controls.placeholder.setValue("");
    })
  }

  addLink(preModalRange: Range | undefined) {
    let a = document.createElement("a");
    a.setAttribute("contenteditable", "false");
    a.setAttribute("target", "_blank");
    
    let link = this.linkForm.controls.link.value;
    let placeholder = this.linkForm.controls.placeholder.value;
    if (link == null || placeholder == null) {
      return;
    }

    a.href = this.modifyUrl(link);
    a.innerText = placeholder;
    preModalRange?.insertNode(a);

    a.insertAdjacentText("afterend", "\ ");;

    let selection = window.getSelection();
    selection?.removeAllRanges();
    let newRange = document.createRange();
    newRange.setStart(a.nextSibling!, 0);
    selection?.addRange(newRange);
  }

  modifyUrl(url: string): string {
    if (url.startsWith("http")) {
      return url;
    }

    return "https://" + url;
  }

  indent() {
    let selection = window.getSelection();
    let range = selection?.getRangeAt(0);
    let parent = range?.startContainer.parentElement;

    if (parent?.nodeName == "SPAN") {
      parent = parent.parentElement;
    }

    let listType = parent?.parentElement?.nodeName;

    if (parent?.nodeName === "LI") {
      let listElement = document.createElement(listType!);
      let listItem = document.createElement("li");
      listItem.innerHTML = parent.innerHTML;
      listElement.appendChild(listItem);
      parent.replaceWith(listElement);

      let newRange = document.createRange();
      newRange.setStart(listItem, 0);
      selection?.removeAllRanges();
      selection?.addRange(newRange);
    } else {
      this.setList("ul");
    }
  }

  deIndent() {
    let selection = window.getSelection();
    let range = selection?.getRangeAt(0);
    let parent = range?.startContainer.parentElement;

    if (parent?.nodeName == "SPAN") {
      parent = parent.parentElement;
    }

    if (parent?.nodeName == "UL") {
      parent = parent.lastElementChild as HTMLElement;
    }

    if (parent?.nodeName === "LI") {
      if (parent.parentElement?.previousElementSibling?.nodeName === "LI") {
        let listItem = document.createElement("li");
        listItem.innerHTML = parent.innerHTML;
        parent.parentElement?.insertAdjacentElement("afterend", listItem);
        parent.parentElement?.remove();
        range?.setStart(listItem, listItem.innerHTML.length);
      } else {
        parent.parentElement!.insertAdjacentHTML("afterend", parent.innerHTML);

        let newRange = document.createRange();
        newRange.setStart(parent.parentElement!.nextSibling!, 0);
        selection?.removeAllRanges();
        selection?.addRange(newRange);
        parent.remove();
      }
    }
  }

  setList(type: string) {
    let selection = window.getSelection()!;
    let range = selection.getRangeAt(0);

    if (selection.isCollapsed) {
      let listElement = document.createElement(type);
      let listItem = document.createElement("li");
      listElement.appendChild(listItem);
      range.insertNode(listElement);

      let newRange = document.createRange();
      newRange.setStart(listItem, 0);
      selection.removeAllRanges();
      selection.addRange(newRange);
    } else {
      let listElement = document.createElement(type);
      let listItem1 = document.createElement("li");
      listItem1.innerHTML = range.extractContents().textContent!;
      listElement.appendChild(listItem1);
      let listItem2 = document.createElement("li");
      listElement.appendChild(listItem2);
      range.insertNode(listElement);

      let newRange = document.createRange();
      newRange.setStart(listElement, 1);
      selection.removeAllRanges();
      selection.addRange(newRange);
    }
  }

  set(type: string, ...classes: string[]) {
    let selection = window.getSelection()!;
    let range = selection.getRangeAt(0);
    let parent = range.startContainer.parentElement!;

    // Check if there's a selection
    if (!selection.isCollapsed) {
      if (parent.nodeName === type) {
        let contents = range.cloneContents();
        if (parent.innerText.length === contents.textContent?.length) {
          parent.replaceWith(document.createTextNode(range.extractContents().textContent!));
        } else if (range.startOffset === 0) {
          let normal = document.createTextNode(range.extractContents().textContent!);
          let leftover = document.createElement(type);
          leftover.innerText = parent.innerText;
          parent.replaceWith(normal, leftover);
        } else if (range.endOffset === parent.innerText.length) {
          let normal = document.createTextNode(range.extractContents().textContent!);
          let leftover = document.createElement(type);
          leftover.innerText = parent.innerText;
          parent.replaceWith(leftover, normal);
        } else {
          let left = document.createElement(type);
          left.innerText = parent.innerText.substring(0, range.startOffset);
          let right = document.createElement(type);
          right.innerText = parent.innerText.substring(range.endOffset);
          let middle = document.createTextNode(range.extractContents().textContent!);
          parent.replaceWith(left, middle, right);
        }

        return;
      } 
      
      let selectedText = range.extractContents();
      let styledChild = selectedText.querySelector(type);
      if (styledChild !== null) {
        range.insertNode(document.createTextNode(selectedText.textContent!));
      }  else {
        let styledElement = document.createElement(type);
        styledElement.appendChild(selectedText);
        styledElement.classList.add(...classes);

        range.insertNode(styledElement);
      }
    } else {
      if (parent.nodeName === type) {
        if (parent.nextSibling !== null && parent.nextSibling.textContent?.trim().length !== 0) {
          parent.nextSibling!.textContent = " " + parent.nextSibling!.textContent;
        } else {
          parent.insertAdjacentText("afterend", " .");
        }

        let nextElement = parent.nextSibling!;
        let newRange = document.createRange();
        newRange.setStart(nextElement, 1);
        newRange.setEnd(nextElement, 2);
        selection.removeAllRanges();
        selection.addRange(newRange);
      } else {
        let newElement = document.createElement(type);
        for (var class_ of classes) {
          newElement.classList.add(class_);
        }
        newElement.insertAdjacentText("afterbegin", "Sample text");
        range.insertNode(newElement);
      }
    }
  }
}
