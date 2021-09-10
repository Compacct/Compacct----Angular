import { Component , OnInit} from '@angular/core';
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
  constructor(private $CompacctAPI: CompacctCommonApi) {}
    ngOnInit() {
      console.log(this.$CompacctAPI)
      this.currentYear = new Date().getFullYear();
   }
}

