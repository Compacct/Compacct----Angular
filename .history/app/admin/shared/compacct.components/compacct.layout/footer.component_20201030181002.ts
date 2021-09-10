import { Component , OnInit} from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { CompacctCommonApi } from '../../compacct.services/common.api.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: [],
  providers:  []
})
export class FooterComponent implements  OnInit {
  currentYear: Number;
  companyFullName: String = 'Iconwizard Technologies Pvt. Ltd.';
  constructor(private cookies: CookieService,) {}
    ngOnInit() {
      this.companyFullName = JSON.parse(this.cookies.get("_Compacct_Cookie_data")).Company_Name;
      this.currentYear = new Date().getFullYear();
   }
}

