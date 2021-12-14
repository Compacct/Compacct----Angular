import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { CompacctHeader } from "../../../../shared/compacct.services/common.header.service";
import { CompacctCommonApi } from '../../../../shared/compacct.services/common.api.service';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { DateTimeConvertService } from '../../../../shared/compacct.global/dateTime.service';
import { CompacctGlobalApiService } from '../../../../shared/compacct.services/compacct.global.api.service';
import { MessageService } from 'primeng/api';
import * as XLSX from 'xlsx';
import { flatMap } from 'rxjs/operators';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';

@Component({
  selector: 'app-tuto-order-management',
  templateUrl: './tuto-order-management.component.html',
  styleUrls: ['./tuto-order-management.component.css'],
  providers: [MessageService],
  encapsulation: ViewEncapsulation.None
})
export class TutoOrderManagementComponent implements OnInit {
  Param_Flag ='';
  Param_FootFall ='';
  BillingList = [];
  productList = [];
  showProductList = [];
  totalAmt = undefined;
  buttonname = "Place Order";
  Spinner = false;
  Billing_Type = undefined;
  stdName = undefined;
  stdModile = undefined;
  stdPincode = undefined;
  Param_MenRefID = undefined;
  popup_Flag = false;
  popup_Flag2 = false;
  OrderId = undefined;
  savebutton = true;
  Foot_Fall_ID : any;
  Loan_Ac_No = undefined;
  BillingTypeFormSubmited = false;
  LoanRecvFlag = false;
  StudentID = undefined;
  SuscbID = undefined;

  BDA_ID = undefined;
  constructor(
    private $http: HttpClient,
    private Header: CompacctHeader,
    private $CompacctAPI: CompacctCommonApi,
    private route: ActivatedRoute,
    private router : Router,
    private compacctToast: MessageService,
    private GlobalAPI: CompacctGlobalApiService,
    private DateService: DateTimeConvertService,
    ) {
      this.route.queryParams.subscribe(params => {
         console.log(params);
         this.Loan_Ac_No = undefined;
        const paramsData = params['Subscription_Txn_ID'];
        if(params['Subscription_Txn_ID'] && params['Menu_Ref_ID']) {
          this.Param_Flag = window.atob(paramsData);
          this.Param_MenRefID = window.atob(params['Menu_Ref_ID'])
          console.log("Menu_Ref_ID",this.Param_MenRefID);
           this.popup_Flag = true;
            this.msgConfirm();


        }
        if(params['Foot_Fall_ID']) {
          this.Param_FootFall = window.atob(params['Foot_Fall_ID']);
          this.GetStudentID();
        }
        this.BDA_ID = params['BDA_ID'] ? window.atob(params['BDA_ID']) : 0;

         console.log (this.Param_Flag);
        })
     }

  ngOnInit() {
    this.Header.pushHeader({
      Header: "Subscription Order",
      Link: " Channel Sale -> Subscription"

    });
    this.popup_Flag = true;
    console.log("this.popup_Flag",this.popup_Flag);
  }
  GetStudentID(){
    const obj = {
      "SP_String": "Tutopia_Subscription_Accounts_PG_Request",
      "Report_Name_String": "Get_Student_ID",
      "Json_Param_String" : JSON.stringify([{'Foot_Fall_ID' : this.Param_FootFall}])
    }
    this.GlobalAPI
        .getData(obj)
        .subscribe((data: any) => {
         console.log(data);
         this.StudentID = data.length ? data[0].Student_ID : undefined;
    });
  }
  async CallTutopiaApiForTicket(url , obj) {
    const httpOptions = {headers: new HttpHeaders().set('Authorization', 'Bearer aZyAs0ynGvmOSNyyAOkJauiV')}
    const response = await this.$http.post('https://api.tutopia.in/api/crm/v1/'+url,obj,httpOptions).toPromise();
  return response;
  }
  async TutopiaApp(){
    if(this.Param_Flag === '0') {
      try {
        const apiObj = {
          "student_id": this.StudentID,
          "plan_ids": this.productList.filter(res=>Number(res.Product_ID) < 100).map(a => a.Product_ID).toString(),
          "referral_code": ""
        }
        const apiRes:any = await this.CallTutopiaApiForTicket('subscription/create',apiObj);
        this.InsertSuscription(apiRes.data.order_detail);
      } catch(error) {
        this.Spinner = false;
        this.compacctToast.clear();
        this.compacctToast.add({
          key: "compacct-toast",
          severity: "error",
          summary: "Warn Message",
          detail: "Error From TUTOPIA App API. "
        });
      }
    } else {
      this.compacctToast.clear();
      this.compacctToast.add({
        key: "compacct-toast",
        severity: "success",
        summary: "Order ID : " + this.OrderId,
        detail:  "Order Placed successfully "
      });
      this.makePayment();
    }
    
  }
  InsertSuscription(obj) {
    console.log(obj);
    if(obj.Subscription_Txn_ID) {
      let TempArr = [];
      this.SuscbID = obj.Subscription_Txn_ID;
      obj.Products.forEach(element => {
        const Salerate = this.productList.filter(item=> Number(item.Product_ID) ===   Number(element.Product_ID));
        const tempObj = {
          Subscription_Txn_ID : obj.Subscription_Txn_ID,
          Foot_Fall_ID : obj.Foot_Fall_ID,
          Distributor_CODE : obj.Distributor_CODE,
          PINCODE : obj.PINCODE,
          Bill_No : this.OrderId ,
          Present_Status : obj.Present_Status,
          Re_Trial_Enabled : obj.Re_Trial_Enabled,
          Product_ID : element.Product_ID,
          Rate : element.Rate,
          Discount : element.Discount,
          Amount : element.Amount,
          Direct_Sale_Revised_Amt : Salerate[0].Net_Amt,
        }
        TempArr.push(tempObj)
      });
      const obj2 = {
        "SP_String": "Tutopia_Subscription_Accounts_PG_Request",
        "Report_Name_String": "Insert_Subscription",
        "Json_Param_String" : JSON.stringify(TempArr)
      }
      this.GlobalAPI
          .getData(obj2)
          .subscribe((data: any) => {
           console.log(data);
           this.savebutton = false;
           this.compacctToast.clear();
            this.compacctToast.add({
              key: "compacct-toast",
              severity: "success",
              summary: "Order ID : " + this.OrderId,
              detail:  "Order Placed successfully "
            });
           this.popup_Flag2 = true;
           this.makePayment();
      });
    }

  }

  onReject() {
    this.compacctToast.clear("c");
  }

  msgConfirm(){
    if(this.Param_Flag && this.Param_MenRefID){
      const TempObj = {
        "menu_ref_id": this.Param_MenRefID
      }
      const obj = {
        "SP_String": "Tutopia_Subscription_Accounts",
        "Report_Name_String": "Get_Bill_Type",
        "Json_Param_String": JSON.stringify([TempObj])
      }
      this.GlobalAPI.getData(obj).subscribe((data:any)=>{
        //console.log("data",data);
        this.BillingList = data;
        this.Billing_Type = this.BillingList[0].Pay_ID;
        this.compacctToast.clear();
        this.compacctToast.add({
          key: "c",
          sticky: true,
          severity: "warn",
          summary: "",
          detail: ""
        });
      })

    }
  }
  isLoanAcReq () {
   const tempArr = this.BillingList.filter((item)=> item.Loan === 'Y' && Number(item.Pay_ID) === Number(this.Billing_Type));
   if(tempArr.length) {
      return true;
   } else {
     return false;
   }
  }
  ChangedRevcFlag() {
    if(this.LoanRecvFlag) {
      this.Loan_Ac_No = 'NOT RECEIVED';
    } else {
      this.Loan_Ac_No = undefined;
    }
  }
  CheckValidAC(evt) {
    const charCode = (evt.which) ? evt.which : evt.keyCode;
    if(charCode === 45 || charCode === 32) {
      return true;
    }else {
      const regex = new RegExp("^[a-zA-Z0-9]+$");
      const key = String.fromCharCode(!evt.charCode ? evt.which : evt.charCode);
      if (!regex.test(key)) {
        evt.preventDefault();
        return false;
      }else {
        return true;
      }
    }
  }
  onConfirm(valid){
    this.BillingTypeFormSubmited = true;
    if(valid){
      this.popup_Flag = false;
      const TempObj = {
        Subscription_Txn_ID : this.Param_Flag,
        Foot_Fall_ID : this.Param_FootFall ? this.Param_FootFall : 0,
        Pay_ID : this.Billing_Type,
        menu_ref_id : this.Param_MenRefID,
        loan_ac_no : this.isLoanAcReq() ? this.Loan_Ac_No : 'NA'
      }
      console.log("TempObj",TempObj);
      const obj = {
        "SP_String": "Tutopia_Subscription_Accounts",
        "Report_Name_String": "GET_Student_Wise_Products",
        "Json_Param_String": JSON.stringify([TempObj])
      }
      this.GlobalAPI.getData(obj).subscribe((data:any)=>{
        console.log("data",data);
        this.BillingTypeFormSubmited = false;
        this.productList = data;
        console.log("productList",this.productList);
        this.stdName = data[0].Contact_Name;
        this.stdModile = data[0].Mobile;
        this.stdPincode = data[0].PINCODE;
        this.Foot_Fall_ID = data[0].Foot_Fall_ID;
        this.compacctToast.clear();
      })
    }
  }
  onConfirmsave(){

  }
  getTotalValue(){
    let val = 0;
    this.productList.forEach((item)=>{
      val += item.Net_Amt
    });
    this.totalAmt = val;
    return val ? val : '-';

  }
  Saveorder(){
    this.showProductList = [];
    this.popup_Flag = false;
    this.Spinner = true;
    const BILL = this.BillingList.filter(item => Number(item.Pay_ID) === Number(this.Billing_Type));
    this.productList.forEach((item)=>{
      // item['Total_Order_Amount'] =  this.totalAmt;
      // item['Created_By'] = this.$CompacctAPI.CompacctCookies.User_ID;
      this.showProductList.push({
        Doc_No: "A",
        Created_By: this.$CompacctAPI.CompacctCookies.User_ID,
        Foot_Fall_ID: item.Foot_Fall_ID,
        Place_Of_Supply: item.Place_Of_Supply,
        Cost_Cent_ID: 2,
        Product_ID: item.Product_ID,
        Product_Description: item.Product_Description,
        SAC_Code: item.SAC_Code,
        loan_ac_no : this.isLoanAcReq() ? this.Loan_Ac_No : 'NA',
        Rate: item.Rate,
        Qty: item.Qty,
        Taxable_Amt: item.Taxable_Amt,
        CGST_Per: item.CGST_Per,
        CGST_Amt: item.CGST_AMT,
        SGSt_Per: item.SGST_Per,
        SGST_Amt: item.SGST_AMT,
        IGST_Per: item.IGST_Per,
        IGST_Amt: item.IGST_Amt,
        Total_Tax: item.Total_Tax,
        Gross_Amt: item.Gross_Amt,
        Rounded_Off: item.Rounded_Off,
        Net_Amt: item.Net_Amt,
        Total_Order_Amount: this.totalAmt,
        Subscription_Txn_ID: this.Param_Flag,
        User_ID: this.$CompacctAPI.CompacctCookies.User_ID,
        Billing_Type : BILL[0].Pay_Type , 
        Pay_ID : BILL[0].Pay_ID,
        BDA_ID : this.BDA_ID ? this.BDA_ID : 0
      })
    });
    console.log("save Data",this.showProductList);
    const obj = {
      "SP_String": "Tutopia_Subscription_Accounts",
      "Report_Name_String": "Save_Bill",
      "Json_Param_String": JSON.stringify(this.showProductList)
    }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      const tempID = data[0].Column1;
      if(data[0].Column1){
        if(this.Param_Flag === '0') { 
          this.SuscbID = undefined;
          this.OrderId = tempID;
          this.TutopiaApp();
        } else {
          this.savebutton = false;
          this.popup_Flag2 = true;
          this.OrderId = tempID;          
          this.makePayment();
        }
       }
    })
  }
  makePayment(){
    const navigationExtras: NavigationExtras = {
      queryParams: {
        'Subscription_Txn_ID' : this.Param_Flag === '0' ?  window.btoa(this.SuscbID) : window.btoa(this.Param_Flag),
        'Menu_Ref_ID' : window.btoa(this.Param_MenRefID),
        'Foot_Fall_ID' : window.btoa(this.Foot_Fall_ID)
      },
    };
    this.Spinner = false;
    this.router.navigate(['./Tutopia_Order_Payment'], navigationExtras);
    // const Link = '/?Subscription_Txn_ID='+ +'&Menu_Ref_ID='+window.btoa(this.Param_MenRefID)+'&Foot_Fall_ID='+window.btoa(this.Foot_Fall_ID);
   // window.open(Link);
  }
  printOut(){
   console.log("Print");
  window.open("/Report/Crystal_Files/Tutopia/Receipt_Cum_Invoice.aspx?Order_No=" + this.OrderId, 'mywindow', 'fullscreen=yes, scrollbars=auto,width=950,height=500');
 }
}

// class order {
//   Pay_ID : number;
// }
