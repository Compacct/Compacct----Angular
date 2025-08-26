import { Component, OnInit } from '@angular/core';
import { CompacctCommonApi } from '../../compacct.services/common.api.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styles: [`   
 .marquee-container {
            width: 100%;
            background-color: #dc2626;
            overflow: hidden;
            position: relative;
            border-radius: 5px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }

        .marquee-text {
            position: relative;
            white-space: nowrap;
            color: white;
            font-weight: bold;
            font-family: 'Source Sans Pro', sans-serif;
            padding: 0 20px;
            transform: translateX(100%);
            animation: marqueeAnimation 20s linear infinite;
        }

        @keyframes marqueeAnimation {
            0% {
                transform: translateX(100%);
            }
            100% {
                transform: translateX(-100%);
            }
        }`],
})
export class HeaderComponent implements OnInit {
 // title = 'ClientApp';
 userName: String;
 CompanyName: String;
 FinYearName: string;
 LogoReqFlag = false;
 constructor (
  private $http: HttpClient,private $compacct: CompacctCommonApi) {

 }
 ngOnInit () {
  this.userName = this.$compacct.CompacctCookies.Name;
  this.CompanyName = this.$compacct.CompacctCookies.Company_Name;
  this.GetFinDetails();
  this.GetLogoReq();
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
  GetLogoReq() {
    const httpHeader = new HttpHeaders({'Content-Type':'text/plain'})
    this.$http
    .get('/Common/Get_SHOW_LOGO',{headers : httpHeader, responseType: 'text'})
    .subscribe((data: any) => {
      this.LogoReqFlag = data === 'Y' ? true : false;
    });
  }

}
