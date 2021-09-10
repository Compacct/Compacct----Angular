import { Injectable, OnInit } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { map } from "rxjs/operators";
import { CookieService } from "ngx-cookie-service";
import { NgxUiLoaderService } from "ngx-ui-loader";

@Injectable({
  providedIn: "root"
})
export class CompacctCommonApi implements OnInit {
  url = window["config"];

  CompacctCookies: Cookies;
  public CompacctClientData: {};

  constructor(
    private http: HttpClient,
    private cookies: CookieService,
    private spiner: NgxUiLoaderService
  ) {
    // this.http
    //   .get("/Scripts/Common/countryInformation.json")
    //   .subscribe((data: any) => {
    //     let returnedObj = {};
    //     data.countryInformation.forEach(el => {
    //       if (el.CompanyName === this.CompacctCookies.Company_Name) {
    //         returnedObj = el;
    //       }
    //     });
    //     this.CompacctClientData = returnedObj;
    //   });
    this.CompacctCookies = JSON.parse(
      this.cookies.get("_Compacct_Cookie_data")
    );
    this.getClientData().then((data: any) => {
      let returnedObj = {};
      data.countryInformation.forEach(el => {
        if (el.CompanyName === this.CompacctCookies.Company_Name) {
          returnedObj = el;
        }
      });
      this.CompacctClientData = returnedObj;
    });
  }
  ngOnInit() {}

  async getClientData() {
    const clienRawtData = await fetch( "/Scripts/Common/countryInformation.json", {
      headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
      },
      method: 'GET',
  }
    );
    return clienRawtData.json();
  }

  compacctSpinnerShow() {
    this.spiner.start();
  }
  compacctSpinnerHide() {
    this.spiner.stop();
  }
  getCostCenter() {
    return this.http.get(this.url.apiGetCostCenter);
  }
  getProductPurschableGST(Pur_Doc_No, Doc_Date) {
    const params = new HttpParams()
      .set("Pur_Doc_No", Pur_Doc_No)
      .set("Doc_Date", Doc_Date);
    return this.http.get(this.url.apiGetProductPurchableGST, { params });
  }
}

class Cookies {
  User_ID: any;
  User_Name: any;
  User_Type: any;
  User_Mobile: any;
  User_Email: any;
  Cost_Cen_ID: any;
  Dept_ID: any;
  Sub_Dept_ID: any;
  Dept_Name: any;
  Sub_Dept_Description: any;
  Del_Right: any;
  Menu_Ref_ID: any;
  Name: any;
  Last_Login_Time: any;
  Last_IP: any;
  User_Pic: any;
  Company_ID: any;
  Company_Name: any;
  Mailing_Name: any;
  Mailing_Address_1: any;
  Mailing_Address_2: any;
  District: any;
  State: any;
  Country: any;
  Pin: any;
  Phone: any;
  Email: any;
  Currency_Symbol: any;
  Currency_Formal_Name: any;
  Decimal_Position: any;
  Is_Multiple_UOM: any;
  CIN: any;
  Fin_Year_ID: any;
  Currency_ID: any;
  Fin_Year_Start: any;
  Amyo_sessionId: any;
  Amyo_campaignId: any;
}
