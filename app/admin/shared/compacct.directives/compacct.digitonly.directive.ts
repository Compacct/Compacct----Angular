import { Directive, HostListener, Input, ElementRef } from '@angular/core';

@Directive({
  // tslint:disable-next-line:directive-selector
  selector: '[CompacctDigitonly]'
})
export class CompacctDigitonlyDirective {

  constructor(private el: ElementRef) { }

  @Input() CompacctDigitonly: boolean;

  @HostListener('keydown', ['$event']) onKeyDown(event) {
    const e = <KeyboardEvent> event;
    if (this.CompacctDigitonly) {
      if ([46, 8, 9, 27, 13, 110, 190].indexOf(e.keyCode) !== -1 ||
        // Allow: Ctrl+A
        (e.keyCode === 65 && (e.ctrlKey || e.metaKey)) ||
        // Allow: Ctrl+C
        (e.keyCode === 67 && (e.ctrlKey || e.metaKey)) ||
        // Allow: Ctrl+V
        (e.keyCode === 86 && (e.ctrlKey || e.metaKey)) ||
        // Allow: Ctrl+X
        (e.keyCode === 88 && (e.ctrlKey || e.metaKey)) ||
        // Allow: home, end, left, right
        (e.keyCode >= 35 && e.keyCode <= 39)) {
          // let it happen, don't do anything
          return;
        }
        // Ensure that it is a number and stop the keypress
        if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
            e.preventDefault();
        }
      }
  }
  @HostListener('paste', ['$event']) blockPaste(e: KeyboardEvent) {
    e.preventDefault();
  }

}
