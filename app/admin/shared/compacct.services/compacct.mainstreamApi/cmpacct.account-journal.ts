import { Injectable, OnInit } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { DateTimeConvertService } from '../../compacct.global/dateTime.service';


@Injectable()

export class CompacctAccountJournal implements OnInit {
    url = window['config'];

    CompacctACJCookies: Cookies;
    CompacctACJClientData: {};
    NativeRoundoffID: any;

    constructor( private $http: HttpClient ,
                 private cookies: CookieService ,
                 private DateService: DateTimeConvertService) {
                    this.$http.get('/Scripts/Common/countryInformation.json').subscribe((data: any) => {
                        let returnedObj = {};
                         data.countryInformation.forEach(el => {
                                    if (el.CompanyName === this.CompacctACJCookies.Company_Name) {
                                        returnedObj = el;
                                    }
                            });
                         this.CompacctACJClientData = returnedObj;
                    });
                    this.CompacctACJCookies = JSON.parse(this.cookies.get('_Compacct_Cookie_data'));
                    this.GetRoundoffID();
    }
    ngOnInit() {
    }
    GetRoundoffID () {
        this.$http.get(this.url.apiGetRoundOffId).subscribe((data: any) => {
            this.NativeRoundoffID = data;
        });
      }
  GetInitilizaData (ObjVoucherCommon: any, ObjVoucherTopper: any ,  ObjCostCenter: any , ObjBillDetails: any ,
     CatidwithAmount , TermList , termWithOutputLedgerID) {
        // , FlagObj
    const VoucherDataList = [];
    //  this.ObjVoucherCommon.Voucher_No = Doc_No;
      ObjVoucherCommon.Voucher_Date = this.DateService.dateConvert(new Date(ObjBillDetails.Doc_Date));

      ObjVoucherCommon.Cost_Cen_ID = ObjCostCenter.Cost_Cen_ID;
      ObjVoucherCommon.User_ID = this.CompacctACJCookies.User_ID;
      ObjVoucherCommon.Posted_On = this.DateService.dateConvert(new Date());
    //  this.getFinancialYear();
    const TopperData =  Object.assign(ObjVoucherTopper, ObjVoucherCommon);
    VoucherDataList.push(TopperData);

    // product
    const voucherproduct = [];
    const holder = {};
    CatidwithAmount.forEach(function (d) {
        if (holder.hasOwnProperty(d.Ledger_ID)) {
            holder[d.Ledger_ID] = holder[d.Ledger_ID] + parseFloat(d.Amount);

        } else {
            holder[d.Ledger_ID] = parseFloat(d.Amount);
        }
    });

    for (const prop in holder) {
      if (true) {
        voucherproduct.push({ Ledger_ID: Number(prop), CR_Amt: 0, Sub_Ledger_ID: 0, DR_Amt: (holder[prop]).toFixed(2), Is_Topper: 'N' });
      }
   }

    for (let i = 0; i < voucherproduct.length; i++) {
        const tempproduct = Object.assign(voucherproduct[i], ObjVoucherCommon);
        VoucherDataList.push(tempproduct);
    }
    // CGST_Input_Ledger_ID
    const voucherCGST = [];
    const holderCGST = {};
    CatidwithAmount.forEach(function (d) {
        if (holderCGST.hasOwnProperty(d.CGST_Input_Ledger_ID)) {
            holderCGST[d.CGST_Input_Ledger_ID] = holderCGST[d.CGST_Input_Ledger_ID] + parseFloat(d.CGST_Amount);

        } else {
            holderCGST[d.CGST_Input_Ledger_ID] = parseFloat(d.CGST_Amount);
        }
    });

    for (const prop in holderCGST) {
      if ( !!Number(ObjBillDetails.CGST_Amt)) {
        voucherCGST.push({ Ledger_ID: Number(prop), CR_Amt: 0, Sub_Ledger_ID: 0, DR_Amt: (holderCGST[prop]).toFixed(2), Is_Topper: 'N' });
         }
   }

    for (let i = 0; i < voucherCGST.length; i++) {
        if (voucherCGST[i].Ledger_ID !== 0) {
            const tempCGST = Object.assign(voucherCGST[i], ObjVoucherCommon);
            VoucherDataList.push(tempCGST);
        }

    }

    // SGST_Input_Ledger_Id
    const voucherSGST = [];
    const holderSGST = {};
    CatidwithAmount.forEach(function (d) {
        if (holderSGST.hasOwnProperty(d.SGST_Input_Ledger_Id)) {
            holderSGST[d.SGST_Input_Ledger_Id] = holderSGST[d.SGST_Input_Ledger_Id] + parseFloat(d.SGST_Amount);

        } else {
            holderSGST[d.SGST_Input_Ledger_Id] = parseFloat(d.SGST_Amount);
        }
    });

    for (const prop in holderSGST) {
      if ( !!Number(ObjBillDetails.SGST_Amt)) {
        voucherSGST.push({ Ledger_ID: Number(prop), CR_Amt: 0, Sub_Ledger_ID: 0, DR_Amt: (holderSGST[prop]).toFixed(2), Is_Topper: 'N' });
      }
    }

    for (let i = 0; i < voucherSGST.length; i++) {
        if (voucherSGST[i].Ledger_ID !== 0) {
            const tempSGST = Object.assign(voucherSGST[i], ObjVoucherCommon);
            VoucherDataList.push(tempSGST);
        }

    }
    // IGST_Input_Ledger_ID
    const voucherIGST = [];
    const holderIGST = {};
    CatidwithAmount.forEach(function (d) {
        if (holderIGST.hasOwnProperty(d.IGST_Input_Ledger_ID)) {
            holderIGST[d.IGST_Input_Ledger_ID] = holderIGST[d.IGST_Input_Ledger_ID] + parseFloat(d.IGST_Amount);

        } else {
            holderIGST[d.IGST_Input_Ledger_ID] = parseFloat(d.IGST_Amount);
        }
    });

    for (const prop in holderIGST) {
      if (!!Number(ObjBillDetails.IGST_Amt)) {
        voucherIGST.push({ Ledger_ID: Number(prop), CR_Amt: 0, Sub_Ledger_ID: 0, DR_Amt: (holderIGST[prop]).toFixed(2), Is_Topper: 'N' });
      }
    }

    for (let i = 0; i < voucherIGST.length; i++) {
        if (voucherIGST[i].Ledger_ID !== 0) {
            const tempIGST = Object.assign(voucherIGST[i], ObjVoucherCommon);
            VoucherDataList.push(tempIGST);
        }

    }


    //   Round_off_ID
    const RoundoffID = [];
    // console.log(ctrl.RoundoffID);
    if (!!Number(ObjBillDetails.ROUNDED_OFF)) {
    if (parseFloat(ObjBillDetails.ROUNDED_OFF) > 0) {
      const roundaedOf = Math.abs(ObjBillDetails.ROUNDED_OFF);
        RoundoffID.push({ Ledger_ID: Number(this.NativeRoundoffID), DR_Amt: parseFloat(roundaedOf.toString()),
           Sub_Ledger_ID: 0, CR_Amt: 0, Is_Topper: 'N' });

    } else {
      const roundaedOf = Math.abs(ObjBillDetails.ROUNDED_OFF);
        RoundoffID.push({ Ledger_ID: Number(this.NativeRoundoffID), DR_Amt: 0, Sub_Ledger_ID: 0,
           CR_Amt: parseFloat(roundaedOf.toString()).toFixed(2), Is_Topper: 'N' });
    }
  }
    for (let i = 0; i < RoundoffID.length; i++) {
        if (RoundoffID[i].Ledger_ID !== 0) {
          const tempRoundOff = Object.assign(RoundoffID[i], ObjVoucherCommon);
            VoucherDataList.push(tempRoundOff);
        }

    }
    // Term List
    if (TermList.length !== 0) {
        // SGST_Input_Ledger_Id
        const termSGST = [];
        const TermholderSGST = {};
        termWithOutputLedgerID.forEach(function (d) {
            if (TermholderSGST.hasOwnProperty(d.SGST_Input_Ledger_Id)) {
              TermholderSGST[d.SGST_Input_Ledger_Id] = TermholderSGST[d.SGST_Input_Ledger_Id] + parseFloat(d.SGST_Amount);

            } else {
              TermholderSGST[d.SGST_Input_Ledger_Id] = parseFloat(d.SGST_Amount);
            }
        });
        for (const prop in TermholderSGST) {
          if ( true) {
            termSGST.push({ Ledger_ID: Number(prop), CR_Amt: 0, Sub_Ledger_ID: 0,
               DR_Amt: (TermholderSGST[prop]).toFixed(2), Is_Topper: 'N' });
          }
        }
        for (let i = 0; i < termSGST.length; i++) {
            if (termSGST[i].Ledger_ID !== 0) {
                const tempSGST = Object.assign(termSGST[i], ObjVoucherCommon);
                VoucherDataList.push(tempSGST);
            }
        }
        // CGST_Input_Ledger_ID
        const termCGST = [];
        const TermholderCGST = {};
        termWithOutputLedgerID.forEach(function (d) {
            if (TermholderCGST.hasOwnProperty(d.CGST_Input_Ledger_ID)) {
              TermholderCGST[d.CGST_Input_Ledger_ID] = TermholderCGST[d.CGST_Input_Ledger_ID] + parseFloat(d.CGST_Amount);

            } else {
              TermholderCGST[d.CGST_Input_Ledger_ID] = parseFloat(d.CGST_Amount);
            }
        });
        for (const prop in TermholderCGST) {
          if ( true) {
            termCGST.push({ Ledger_ID: Number(prop), CR_Amt: 0, Sub_Ledger_ID: 0,
               DR_Amt: (TermholderSGST[prop]).toFixed(2), Is_Topper: 'N' });
          }
        }
        for (let i = 0; i < termCGST.length; i++) {
            if (termCGST[i].Ledger_ID !== 0) {
              const tempCGST = Object.assign(termCGST[i], ObjVoucherCommon);
                VoucherDataList.push(tempCGST);
            }
        }
        // IGST_Input_Ledger_ID
        const termIGST = [];
        const TermholderIGST = {};
        termWithOutputLedgerID.forEach(function (d) {
            if (TermholderIGST.hasOwnProperty(d.IGST_Input_Ledger_ID)) {
              TermholderIGST[d.IGST_Input_Ledger_ID] = TermholderIGST[d.IGST_Input_Ledger_ID] + parseFloat(d.IGST_Amount);

            } else {
              TermholderIGST[d.IGST_Input_Ledger_ID] = parseFloat(d.IGST_Amount);
            }
        });
        for (const prop in TermholderIGST) {
          if ( true) {
            termIGST.push({ Ledger_ID: Number(prop), CR_Amt: 0, Sub_Ledger_ID: 0,
               DR_Amt: (TermholderIGST[prop]).toFixed(2), Is_Topper: 'N' });
          }
        }
        for (let i = 0; i < termIGST.length; i++) {
            if (termIGST[i].Ledger_ID !== 0) {
              const tempCGST = Object.assign(termIGST[i], ObjVoucherCommon);
                VoucherDataList.push(tempCGST);
            }
        }
        // Purchase_Ac_Ledger
        const termSalesAc = [];
        const holderSalesAc = {};
        termWithOutputLedgerID.forEach(function (d) {
            if (holderSalesAc.hasOwnProperty(d.Purchase_Ac_Ledger)) {
                holderSalesAc[d.Purchase_Ac_Ledger] = holderSalesAc[d.Purchase_Ac_Ledger] + parseFloat(d.Term_Amount);

            } else {
                holderSalesAc[d.Purchase_Ac_Ledger] = parseFloat(d.Term_Amount);
            }
        });
        for (const prop in holderSalesAc) {
          if ( true) {
            termSalesAc.push({ Ledger_ID: Number(prop), CR_Amt: 0, Sub_Ledger_ID: 0,
               DR_Amt: (holderSalesAc[prop]).toFixed(2), Is_Topper: 'N' });
          }
        }
        for (let i = 0; i < termSalesAc.length; i++) {
            if (termSalesAc[i].Ledger_ID !== 0) {
              const tempCGST = Object.assign(termSalesAc[i], ObjVoucherCommon);
                VoucherDataList.push(tempCGST);
            }
        }
    }

    let totaldr = 0;
    let totalcr = 0;
    for (let i = 0; i < VoucherDataList.length; i++) {
        totaldr = totaldr + parseFloat(VoucherDataList[i].DR_Amt);
        totalcr = totalcr + parseFloat(VoucherDataList[i].CR_Amt);

    }
      console.log('DR :' + totaldr.toFixed(2) + ' && ' + 'CR:' + totalcr.toFixed(2));
      console.log(VoucherDataList);
      return  VoucherDataList;
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
