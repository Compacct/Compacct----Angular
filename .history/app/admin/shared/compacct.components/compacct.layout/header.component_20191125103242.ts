import { Component, OnInit } from '@angular/core';
import { CompacctCommonApi } from '../../compacct.services/common.api.service';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: []
})
export class HeaderComponent implements OnInit {
 // title = 'ClientApp';
 userName: String;
 CompanyName: String;
 constructor (private $compacct: CompacctCommonApi) {

 }
 ngOnInit () {
  this.userName = this.$compacct.CompacctCookies.Name;
  this.CompanyName = this.$compacct.CompacctCookies.Company_Name;
 }
}
