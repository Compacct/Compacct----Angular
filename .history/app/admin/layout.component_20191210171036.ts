import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { CompacctHeader } from './shared/compacct.services/common.header.service';
import { SPINNER , POSITION} from 'ngx-ui-loader';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css'],
  encapsulation : ViewEncapsulation.None
})
export class AppLayoutComponent implements OnInit {
  cookieValue = '';
  CompacctHeaderTemplate: any;
  spinnerStyle = SPINNER;
  position = POSITION;
 constructor(
   private cookieService: CookieService,
   private Header: CompacctHeader
   ) {}
   ngOnInit() {
    this.cookieService.set( 'Test', 'Hello World' );
    this.cookieValue = this.cookieService.get('Test');
    this.Header.cast.subscribe((value) => {
      this.CompacctHeaderTemplate = value;
    });
   }
}
