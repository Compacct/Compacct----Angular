import { DOCUMENT } from '@angular/common';
import {
  Directive,
  HostBinding,
  HostListener,
  Inject,
  Input,
} from '@angular/core';

@Directive({
  selector: '[CompacctOnlyAlphabets]'
})
export class CompacctOnlyAlphabetsDirective {
  
  @Input() CompacctOnlyAlphabets: boolean;
  @HostBinding('autocomplete') public autocomplete;
  constructor(@Inject(DOCUMENT) private document: Document){
    this.autocomplete = 'off';
  }
  @HostListener('keypress', ['$event']) public disableKeys(e: any) {
    console.log('appOnlyAlphabets', typeof(this.CompacctOnlyAlphabets));
    if (this.CompacctOnlyAlphabets) {
      this.document.all ? e.keyCode : e.keyCode;
      return (
        e.keyCode === 8 ||
        (e.keyCode >= 97 && e.keyCode <= 122) ||
        (e.keyCode >= 65 && e.keyCode <= 90)
      );
    }
  }
  @HostListener('paste', ['$event']) public blockPaste(e: KeyboardEvent) {
    console.log("blockPaste",e)
    e.preventDefault();
  }
}
