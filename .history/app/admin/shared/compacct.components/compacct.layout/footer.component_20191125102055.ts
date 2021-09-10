import { Component , OnInit} from '@angular/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: [],
  providers:  []
})
export class FooterComponent implements  OnInit {
  currentYear: Number;
  companyFullName: String = 'Iconwizard Technologies Pvt. Ltd.';
  constructor() {}
    ngOnInit() {
      this.currentYear = new Date().getFullYear();
   }
}

