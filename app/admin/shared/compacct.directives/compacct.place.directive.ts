import { Directive, ElementRef, OnInit, Output, EventEmitter } from '@angular/core';
import {NgModel} from '@angular/forms';
declare var require: any;
// const google = require('@types/googlemaps');
declare var google: any;

@Directive({
  // tslint:disable-next-line:directive-selector
  selector: '[Compacct-Place]',
  providers: [NgModel],
})
export class CompacctGooglePlacesDirective implements OnInit {
  private element: HTMLInputElement;
  @Output() setAddress: EventEmitter<any> = new EventEmitter();

  constructor(private elRef: ElementRef) {
    this.element = elRef.nativeElement;
  }

  ngOnInit() {
    const autocomplete = new google.maps.places.Autocomplete(this.element);
    google.maps.event.addListener(autocomplete, 'place_changed', () => {
        const place = autocomplete.getPlace();
        this.invokeEvent(place);
      });
  }
  invokeEvent(place: Object) {
    this.setAddress.emit(place['formatted_address']);
  }
}
