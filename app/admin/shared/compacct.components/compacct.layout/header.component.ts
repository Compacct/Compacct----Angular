import { Component, OnInit } from '@angular/core';
import { CompacctCommonApi } from '../../compacct.services/common.api.service';
import { HttpClient } from '@angular/common/http';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: []
})
export class HeaderComponent implements OnInit {
 // title = 'ClientApp';
 userName: String;
 CompanyName: String;
 FinYearName: string;
 constructor (
  private $http: HttpClient,private $compacct: CompacctCommonApi) {

 }
 ngOnInit () {
  this.userName = this.$compacct.CompacctCookies.Name;
  this.CompanyName = this.$compacct.CompacctCookies.Company_Name;
  this.GetFinDetails();
 }
 GetFinDetails() {
  this.$http
  .get('/Common/Get_Fin_Year_Date?Fin_Year_ID=' + this.$compacct.CompacctCookies.Fin_Year_ID, {})
  .subscribe((data: any) => {
    this.FinYearName = data ? JSON.parse(data)[0].Fin_Year_Name : [];
    const fin = JSON.parse(localStorage.getItem('Fin'));
      if (fin) {
        localStorage.setItem('Fin', '');
        localStorage.setItem('Fin', JSON.stringify([JSON.parse(data)[0]]));
    } else {
        localStorage.setItem('Fin', JSON.stringify([JSON.parse(data)[0]]));
    }
  });
  }

}
