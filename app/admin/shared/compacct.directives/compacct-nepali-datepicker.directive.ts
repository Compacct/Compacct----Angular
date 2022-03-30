import { AfterViewInit, Directive,DoCheck,ElementRef, EventEmitter, Input, Output, SimpleChanges  } from '@angular/core';
declare var nepaliDatePicker: any,$: any;


@Directive({
  selector: '[CompacctNepaliDatepicker]'
})
export class CompacctNepaliDatepickerDirective implements AfterViewInit  {
  private el: any;
  @Input() containerId:any;
  @Output() ngModelChange:EventEmitter<any> = new EventEmitter()
  @Output() GetDetailsModelChange:EventEmitter<any> = new EventEmitter()
  constructor(public elementRef:ElementRef ) { 
    this.el = this.elementRef.nativeElement;
  }
  ngAfterViewInit() {
    this.el.nepaliDatePicker({
      dateFormat: "DD/MM/YYYY",
      ndpYear: true,
      ndpMonth: true,
      ndpYearCount: 10,
      container : this.containerId ? this.containerId : 'body',
      onChange:  (e) => {
        this.ngModelChange.emit(e.bs)
        this.GetDetailsModelChange.emit(e)
      }
    });
  }

}
