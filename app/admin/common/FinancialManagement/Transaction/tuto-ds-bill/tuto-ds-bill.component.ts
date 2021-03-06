import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { CompacctGlobalUrlService } from "../../../../shared/compacct.global/global.service.service";
import { CompacctHeader } from "../../../../shared/compacct.services/common.header.service";
import { DateTimeConvertService } from "../../../../shared/compacct.global/dateTime.service";
import { CompacctCommonApi } from "../../../../shared/compacct.services/common.api.service";
import { MessageService } from "primeng/api";
import { CompacctGlobalApiService } from '../../../../shared/compacct.services/compacct.global.api.service';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';

@Component({
  selector: 'app-tuto-ds-bill',
  templateUrl: './tuto-ds-bill.component.html',
  styleUrls: ['./tuto-ds-bill.component.css'],
  providers: [MessageService],
  encapsulation: ViewEncapsulation.None
})
export class TutoDsBillComponent implements OnInit {
  DSBillFormSubmitted = false;
  DSProductFormSubmitted = false;
  ObjDSBill = new DSBill ();
  ObjDSProduct = new DSProduct();
  ProductList = [];
  AddedProductList = [];
  TransactionList = [];
  PreviousBillList = [];
  TotalAmount = 0;
  TotalProductAddedAmount = 0;
  Spinner = false;
  PGInvDetailsList = [];
  PGInvDetailsModalFlag = false;

  AmtMin = 0;
  AmtMax =0;
  AmtDisabledFlag = true;
  addSnipper = false;

  BDAList = [];
  BDA_ID = undefined;

  CouponObj: any = {};
  PiniValidSaved = false;
  constructor(
    private $http: HttpClient,
    private urlService: CompacctGlobalUrlService,
    private Header: CompacctHeader,
    private router : Router,
    private GlobalAPI: CompacctGlobalApiService,
    private DateService: DateTimeConvertService,
    public $CompacctAPI: CompacctCommonApi,
    private route: ActivatedRoute,
    private compacctToast: MessageService) { 
      this.route.queryParams.subscribe((val:any) => {
        if(val.Mobile) {
          this.AmtDisabledFlag = true;
          this.ObjDSBill.Mobile_No = window.atob(val['Mobile']);
          this.GetStudentsDetails();
          if(val.From === 'Y') {
            this.AmtDisabledFlag = true;
          }
        }
      } ); 


    }

  ngOnInit() {
    this.Header.pushHeader({
      Header: "Direct Sale Billing",
      Link: " Financial Management -> Transaction -> Direct Sale Billing"
     });
     this.GetBDA();
  }
  GetBDA(){
    const obj = {
      "SP_String": "Tutopia_Subscription_Accounts",
      "Report_Name_String": "GET_BDA_NAME",
    }
    this.GlobalAPI
        .getData(obj)
        .subscribe((data: any) => {
         console.log(data);
         data.forEach(element => {
          element.label = element.User_Name;
          element.value = element.User_ID;
         });
         this.BDAList = data.length ? data : undefined;
    });
  }
  GetStudentsDetails() {
    this.CouponObj = {};
    this.PiniValidSaved = false;
    this.ObjDSBill.Foot_Fall_ID = undefined;
    this.ObjDSBill.Contact_Name = undefined;
    this.ObjDSBill.Class_Name = undefined;
    this.ObjDSBill.City = undefined;
    this.ObjDSBill.Pin = undefined;
    this.ProductList = [];
    this.AddedProductList = [];
    this.ObjDSProduct = new DSProduct();
    this.TotalAmount = 0;
    this.TotalProductAddedAmount = 0;
    this.TransactionList = [];
    this.PreviousBillList = [];
    if(this.ObjDSBill.Mobile_No && this.ObjDSBill.Mobile_No.length === 10) {
      const obj = {
        "SP_String": "Tutopia_Subscription_Accounts_PG_Request",
        "Report_Name_String": "Get_Student_Details_For_Payment",
        "Json_Param_String" : JSON.stringify([{'Mobile' : this.ObjDSBill.Mobile_No}])
      }
      this.GlobalAPI
          .getData(obj)
          .subscribe((data: any) => {
           console.log(data);
           const ReturnObj = data.length ? data[0] : {};
           if(ReturnObj.Foot_Fall_ID) {
             this.ObjDSBill.Foot_Fall_ID = ReturnObj.Foot_Fall_ID;
             this.ObjDSBill.Contact_Name = ReturnObj.Contact_Name;
             this.ObjDSBill.Class_Name = ReturnObj.Class_Name;
             this.ObjDSBill.City = ReturnObj.City;
             this.ObjDSBill.Pin = ReturnObj.Pin;
             this.ObjDSBill.Student_ID =  ReturnObj.Student_ID;
             this.PiniValidSaved = (ReturnObj.Foot_Fall_ID && ReturnObj.Pin && +ReturnObj.Pin && ReturnObj.Pin.length === 6) ? true : false;
             this.GetProductDetaisl();
             this.GetTransactionDetails();
             this.GetPreviousBill();
           } else {
            this.ObjDSBill.Foot_Fall_ID = undefined;
            this.ObjDSBill.Contact_Name = undefined;
            this.ObjDSBill.Class_Name = undefined;
            this.ObjDSBill.City = undefined;
            this.ObjDSBill.Pin = undefined;
            this.ObjDSBill.Student_ID =  undefined;
            this.PiniValidSaved =  true;
            this.compacctToast.clear();
            this.compacctToast.add({
              key: "compacct-toast",
              severity: "warn",
              summary: "No Student Found",
              detail: "Please Enter Correct Registered Mobile No. or Enter Student Name and Class. "
            });
           }
      });
    }
  }
  GetProductDetaisl() {
      const obj = {
        "SP_String": "Tutopia_Subscription_Accounts_PG_Request",
        "Report_Name_String": "Get_Product_Billable",
        "Json_Param_String" : JSON.stringify([{'Mobile' : this.ObjDSBill.Mobile_No}])
      }
      this.GlobalAPI
          .getData(obj)
          .subscribe((data: any) => {
           console.log(data);
           data.forEach(element => {
            element['label'] = element.Product_Description,
            element['value'] = element.Product_ID
          });
           this.ProductList = data;
      });
  }
  GetTransactionDetails() {
    this.TransactionList = [];
    this.TotalAmount = 0;
    const obj = {
      "SP_String": "Tutopia_Subscription_Accounts_PG_Request",
      "Report_Name_String": "Get_Student_Transactions",
      "Json_Param_String" : JSON.stringify([{'Foot_Fall_ID' : this.ObjDSBill.Foot_Fall_ID}])
    }
    this.GlobalAPI
        .getData(obj)
        .subscribe((data: any) => {
         console.log(data);
         this.TransactionList = data;
         this.TransactionList.forEach(item =>{
           if(item.Current_Status === 'PAID') {
            this.TotalAmount = this.TotalAmount + item.Amount;
           }
         })
    });
  }
  GetPreviousBill(){
    if(this.ObjDSBill.Foot_Fall_ID) {
      const obj = {
        "SP_String": "Tutopia_Subscription_Accounts",
        "Report_Name_String": "GET_Previous_Bill",
        "Json_Param_String" : JSON.stringify([{'Foot_Fall_ID' : this.ObjDSBill.Foot_Fall_ID}])
      }
      this.GlobalAPI
          .getData(obj)
          .subscribe((data: any) => {
           console.log(data);
           this.PreviousBillList = data;
      });
    }    
  }
  GetPDF(obj) {
    if (obj.Bill_No) {
      if(obj.Bill_No.startsWith("O")) {
        window.open("/Report/Crystal_Files/Tutopia/Receipt_Cum_Invoice.aspx?Order_No=" + obj.Bill_No, 'mywindow', 'fullscreen=yes, scrollbars=auto,width=950,height=500');
      } else {
        window.open("/Report/Crystal_Files/Finance/SaleBill/tutopia_final.aspx?Doc_No=" + obj.Bill_No, 'mywindow', 'fullscreen=yes, scrollbars=auto,width=950,height=500');
      }

    }
  }
  GetPGInvDetails(PG_Inv_ID){
    this.PGInvDetailsList = [];
    const obj = {
      "SP_String": "Tutopia_Subscription_Accounts_PG_Request",
      "Report_Name_String": "PG_Get_Link_Details",
      "Json_Param_String" : JSON.stringify([{'PG_Inv_ID' : PG_Inv_ID}])
    }
    this.GlobalAPI
        .getData(obj)
        .subscribe((data: any) => {
         console.log(data);
         this.PGInvDetailsList = data;
         this.PGInvDetailsModalFlag = true;
    });
  }
  ProductChange() {
    this.CouponObj = {};
    this.ObjDSProduct.Rate = undefined;
    this.ObjDSProduct.Product_Description = undefined;
    this.AmtMin = 0;
    this.AmtMax =0;
    if(this.ObjDSProduct.Product_ID) {
      this.ObjDSProduct.Amount_Type = 'Sale_rate';
      const ProductObjArr = this.ProductList.filter(item => item.Product_ID == this.ObjDSProduct.Product_ID);
      if(ProductObjArr.length) {
        this.ObjDSProduct.Product_Description = ProductObjArr[0].Product_Description;
        this.AmtMin = Number(ProductObjArr[0].DS_Min_Bill_Amt);
        this.AmtMax = Number(ProductObjArr[0].DI_Max_Bill_Amt);
        if(this.AmtDisabledFlag) {
          this.AmtMin =  ProductObjArr[0].Sale_rate;
          this.AmtMax =  ProductObjArr[0].Sale_rate;
          this.ObjDSProduct.Rate = ProductObjArr[0].Sale_rate;
        }
      }
    }
  }
  AmountTypeChange() { 
    this.AmtDisabledFlag = true;
    this.CouponObj = {};
    if(this.ObjDSProduct.Amount_Type){
      const ProductObjArr = this.ProductList.filter(item => item.Product_ID == this.ObjDSProduct.Product_ID);
      if(ProductObjArr.length) {
        if(this.ObjDSProduct.Amount_Type === 'Custom') {
          this.AmtMin =  ProductObjArr[0]['Sale_rate'];
            this.AmtMax =  ProductObjArr[0]['Sale_rate'];
            this.ObjDSProduct.Rate = ProductObjArr[0]['Sale_rate'];
            this.AmtDisabledFlag = false;
        } else if(this.ObjDSProduct.Amount_Type === 'Coupon_Discount' && this.ObjDSBill.Foot_Fall_ID){
          const obj = {
            "SP_String": "Tutopia_Subscription_Accounts",
            "Report_Name_String": "GET_COUPON_PRODUCTS",
            "Json_Param_String" : JSON.stringify([{'Foot_Fall_ID' : this.ObjDSBill.Foot_Fall_ID}])
          }
          this.GlobalAPI
              .getData(obj)
              .subscribe((data: any) => {
               console.log(data);
               this.CouponObj = data[0];
               if(this.CouponObj.Coupon_Discount && this.CouponObj.Subscription_Txn_ID) {
                this.AmtDisabledFlag = true;
                this.ObjDSProduct.Product_Description = ProductObjArr[0].Product_Description;
                const disbaseAmt =  Number(ProductObjArr[0].Base_Price) -  Number(this.CouponObj.Coupon_Discount);
                const disAmt = Number((disbaseAmt + (disbaseAmt * 18) / 100).toFixed());
                this.AmtMin = Number(disAmt);
                this.AmtMax = Number(disAmt);
                this.ObjDSProduct.Rate = Number(disAmt);;
               } else {
                this.compacctToast.clear();
                this.compacctToast.add({
                  key: "compacct-toast",
                  severity: "error",
                  summary: "Coupon Validation",
                  detail: "Sorry No Coupon Found."
                });
               }
          });
        } else {
          this.AmtDisabledFlag = true;
          this.ObjDSProduct.Product_Description = ProductObjArr[0].Product_Description;
          this.AmtMin = Number(ProductObjArr[0][this.ObjDSProduct.Amount_Type]);
          this.AmtMax = Number(ProductObjArr[0][this.ObjDSProduct.Amount_Type]);
          if(this.AmtDisabledFlag) {
            this.AmtMin =  ProductObjArr[0][this.ObjDSProduct.Amount_Type];
            this.AmtMax =  ProductObjArr[0][this.ObjDSProduct.Amount_Type];
            this.ObjDSProduct.Rate = ProductObjArr[0][this.ObjDSProduct.Amount_Type];
          }
        }
        
    }
  }
  }
  AddProduct(valid){
    this.DSProductFormSubmitted = true;
    if(valid && this.ObjDSBill.Foot_Fall_ID) {
      this.addSnipper = true;
      const obj = {
        "SP_String": "Tutopia_Subscription_Accounts",
        "Report_Name_String": "Check_Bill",
        "Json_Param_String" : JSON.stringify([{'Foot_Fall_ID' : this.ObjDSBill.Foot_Fall_ID , 'Product_ID' : this.ObjDSProduct.Product_ID}])
      }
      this.GlobalAPI
          .getData(obj)
          .subscribe((data: any) => {
           console.log(data);
           if(data[0].remarks === 'success'){
            this.AddedProductList.push(this.ObjDSProduct);
            this.ObjDSProduct = new DSProduct ();
            this.AmtMin = 0;
            this.AmtMax = 0;
            this.DSProductFormSubmitted = false;
            this.getTotalProductAddedAmount();
            this.addSnipper = false;
           } else {
            this.addSnipper = false;
            this.compacctToast.clear();
            this.compacctToast.add({
              key: "compacct-toast",
              severity: "warn",
              life : 6000,
              summary: this.ObjDSBill['Contact_Name'] + " Has a Bill Already.",
              detail: "Bill No : " + data[0].remarks+ " | Bill Date : " + data[0].Dated
            });
           }
           
      });
      
    }
  }
  AmountChange() {
    if(this.ObjDSProduct.Rate && this.ObjDSProduct.Amount_Type !== 'Custom') {
      if(this.AmtMin > Number(this.ObjDSProduct.Rate)){
        this.compacctToast.clear();
        this.compacctToast.add({
          key: "compacct-toast",
          severity: "warn",
          life : 4500,
          summary: "MIN AMOUNT : " + this.AmtMin,
          detail: "Amount Validation"
        });
        this.ObjDSProduct.Rate = undefined;
        return false;
      }
      if(this.AmtMax < Number(this.ObjDSProduct.Rate)){
        this.compacctToast.clear();
        this.compacctToast.add({
          key: "compacct-toast",
          severity: "warn",
          life : 4500,
          summary: "MAX AMOUNT : " + this.AmtMax,
          detail: "Amount Validation"
        });
        this.ObjDSProduct.Rate = undefined;
        return false;
      }
      return true;
    }
  }
  DeleteProduct(index) {
    this.AddedProductList.splice(index,1);
    this.getTotalProductAddedAmount();
  
  }
  getTotalProductAddedAmount(){    
    this.TotalProductAddedAmount = 0;
    if(this.AddedProductList.length){
      this.AddedProductList.forEach(item =>{
         this.TotalProductAddedAmount = this.TotalProductAddedAmount + Number(item.Rate);
      })
    }
  }

  CreatPaymentLink(){
    const navigationExtras: NavigationExtras = {
      queryParams: {
        Mobile : window.btoa(this.ObjDSBill.Mobile_No),
      },
    };
    this.router.navigate(['./Tutopia_DS_Payment_Link'], navigationExtras);
  }

  

  SaveDSbill(valid) {
    if(valid && this.AddedProductList.length && (this.TotalProductAddedAmount && this.TotalAmount && this.TotalProductAddedAmount === this.TotalAmount)) {
      this.Spinner = true;
      const tempArr = this.ObjArrMerge();
      const obj = {
        "SP_String": "Tutopia_Subscription_Accounts_PG_Request",
        "Report_Name_String": "Insert_Subscription_Products_Tmp",
        "Json_Param_String" : JSON.stringify(tempArr)
      }
      this.GlobalAPI
          .getData(obj)
          .subscribe((data: any) => {
            this.Spinner = false;
            if(data[0].Column1 === "Save Successfully") {
              const obj1 = {
                Subscription_Txn_ID : (this.CouponObj && this.CouponObj.Subscription_Txn_ID) ? window.btoa(this.CouponObj.Subscription_Txn_ID) : window.btoa('0'),
                Discount_Amount : (this.CouponObj && this.CouponObj.Coupon_Discount) ?  window.btoa(this.CouponObj.Coupon_Discount) :  window.btoa('0'),
                Menu_Ref_ID : window.btoa(this.$CompacctAPI.CompacctCookies.Menu_Ref_ID),
                Foot_Fall_ID : window.btoa(this.ObjDSBill.Foot_Fall_ID),
                BDA_ID :  window.btoa(this.BDA_ID)
              }
              this.DynamicRedirectTo(obj1,'./Tutopia_Student_Order');
           console.log(data);
          }
      });
    }
    if(!(this.TotalProductAddedAmount && this.TotalAmount && this.TotalProductAddedAmount === this.TotalAmount)){
      this.compacctToast.clear();
      this.compacctToast.add({
        key: "compacct-toast",
        severity: "error",
        summary: "Validation",
        detail: "Transaction Amount and Product Amount Does not Match."
      });
    }
  }
  // Save Pin 
  PinCodeValidCheck() {
    return (this.ObjDSBill.Foot_Fall_ID && this.ObjDSBill.Pin && +this.ObjDSBill.Pin && this.ObjDSBill.Pin.length === 6);
  }
  CallTutopiaAppApi() {
    if (this.ObjDSBill.Student_ID && this.PinCodeValidCheck()) {
      const httpOptions = {
        headers: new HttpHeaders()
          .set('Authorization', 'Bearer aZyAs0ynGvmOSNyyAOkJauiV')
      }
      const TempObj = {
        "student_id":this.ObjDSBill.Student_ID,
        "pincode":this.ObjDSBill.Pin
      };
      this.$http
        .post("https://api.tutopia.in/api/crm/v1/student/update", TempObj, httpOptions)
        .subscribe((data: any) => {
          console.log('tutopia',data);
          if(data.status) {
            this.savePinForBill();
          } else {
            this.compacctToast.clear();
            this.compacctToast.add({
              key: "compacct-toast",
              severity: "error",
              summary: "Error",
              detail: "Tutopia App Api Error."
            });
          }
          
        });
    } 
    if(!(this.PinCodeValidCheck())) {
      this.compacctToast.clear();
      this.compacctToast.add({
        key: "compacct-toast",
        severity: "error",
        summary: "Validation",
        detail: "Enter a valid poncode."
      });
    }
    }
  savePinForBill() {
    if(this.ObjDSBill.Student_ID && this.PinCodeValidCheck()) {
      const obj = {
        "SP_String": "Tutopia_Subscription_Accounts",
        "Report_Name_String": "Update_PIN_Code",
        "Json_Param_String" : JSON.stringify([{ Foot_Fall_ID :this.ObjDSBill.Foot_Fall_ID,PIN_Code : this.ObjDSBill.Pin}])
      }
      this.GlobalAPI
          .getData(obj)
          .subscribe((data: any) => {
            this.Spinner = false;
            console.log('app',data);
            if(data[0].remarks === "success") {
              this.compacctToast.clear();
              this.compacctToast.add({
                key: "compacct-toast",
                severity: "success",
                summary: 'Success',
                detail: "Succesfully Pincode Updated."
              });
              this.PiniValidSaved =  this.PinCodeValidCheck();
           console.log(data);
          }
      });
    }   
    if(!(this.PinCodeValidCheck())) {
      this.compacctToast.clear();
      this.compacctToast.add({
        key: "compacct-toast",
        severity: "error",
        summary: "Validation",
        detail: "Enter a valid poncode."
      });
    }
  }
  ObjArrMerge() {
    let arr = [];
    this.AddedProductList.forEach(item =>{
      const obj = {
        Foot_Fall_ID : this.ObjDSBill.Foot_Fall_ID,
        Product_ID : item.Product_ID,
        Direct_Sale_Revised_Amt :item.Rate,
        Discount_Amount : (this.CouponObj && this.CouponObj.Coupon_Discount) ? this.CouponObj.Coupon_Discount : 0,
      }
      arr.push(obj);
    })
    return arr;
  }
  DynamicRedirectTo (obj,Redirect_To){
    const navigationExtras: NavigationExtras = {
      queryParams: obj,
    };
    this.router.navigate([Redirect_To], navigationExtras);
  }
  OpenInNewTab(File_URL){
    window.open(File_URL,'_blank');
  }
}
class DSBill{
  Mobile_No:any;
  Foot_Fall_ID:any;
  Contact_Name :any;
  Class_Name:string;
  City:string;
  Pin:string;
  Student_ID:string;

}
class DSProduct {
  Product_ID:any;
  Product_Description:any;
  Amount_Type:any;
  Rate:any;
}