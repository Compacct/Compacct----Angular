import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { CompacctHeader } from "../../../../shared/compacct.services/common.header.service";
import { CompacctCommonApi } from '../../../../shared/compacct.services/common.api.service';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { DateTimeConvertService } from '../../../../shared/compacct.global/dateTime.service';
import { CompacctGlobalApiService } from '../../../../shared/compacct.services/compacct.global.api.service';
import { MessageService } from 'primeng/api';
import * as XLSX from 'xlsx';
import { flatMap } from 'rxjs/operators';

@Component({
  selector: 'app-tuto-order-management',
  templateUrl: './tuto-order-management.component.html',
  styleUrls: ['./tuto-order-management.component.css'],
  providers: [MessageService],
  encapsulation: ViewEncapsulation.None
})
export class TutoOrderManagementComponent implements OnInit {
  Param_Flag ='';
  BillingList = [];
  productList = [];
  showProductList = [];
  totalAmt = undefined;
  buttonname = "Save";
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
        Subscription_Txn_ID: this.Param_Flag
      })
    })
    console.log("save Data",this.showProductList);
    const obj = {
      "SP_String": "Tutopia_Subscription_Accounts",
      "Report_Name_String": "Save_Bill",
      "Json_Param_String": JSON.stringify(this.showProductList)
    }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      const tempID = data[0].Column1;
      if(data[0].Column1){
        this.savebutton = false;
        this.popup_Flag2 = true;
        this.OrderId = tempID;
       }
    })
  }
  makePayment(){
    const navigationExtras: NavigationExtras = {
      queryParams: {
        'Subscription_Txn_ID' : window.btoa(this.Param_Flag),
        'Menu_Ref_ID' : window.btoa(this.Param_MenRefID),
        'Foot_Fall_ID' : window.btoa(this.Foot_Fall_ID)
      },
    };
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
