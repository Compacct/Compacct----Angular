import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MessageService } from 'primeng/api';
import { HttpClient, HttpParams } from '@angular/common/http';
import { DateTimeConvertService } from '../../../shared/compacct.global/dateTime.service';
import { CompacctCommonApi } from '../../../shared/compacct.services/common.api.service';
import { CompacctHeader } from '../../../shared/compacct.services/common.header.service';
import { CompacctGlobalApiService } from '../../../shared/compacct.services/compacct.global.api.service';

@Component({
  selector: 'app-coupon-expenses',
  templateUrl: './coupon-expenses.component.html',
  styleUrls: ['./coupon-expenses.component.css'],
  providers: [MessageService],
  encapsulation: ViewEncapsulation.None
})
export class CouponExpensesComponent implements OnInit {
  tabIndexToView: number = 0;
  displayPopup: boolean = false;
  allDataList: any = [];
  couponDate: Date = new Date();
  DynamicHeader: any = [];
  Spinner: boolean = false;
  couponExpensesFormSubmit: boolean = false;

  objExpenses = new Expenses();
  From_date: any;
  To_date: any;
  initDate:any = [];
  seachSpinner:boolean = false;
  DocNo: any;
  DocDate: any;
  constructor(
    private Header: CompacctHeader,
    private $http : HttpClient,
    private CompacctToast: MessageService,
    private GlobalAPI: CompacctGlobalApiService,
    private commonApi: CompacctCommonApi,
    private DateService: DateTimeConvertService,
    private compacctToast: MessageService,
  ) { }

  ngOnInit() {

    this.Header.pushHeader({
      Header: "Canteen Expenses",
      Link: "MICL --> Canteen Expenses"
    });
    this.Finyear();
    // this.getBrowseData()
  }
  Finyear() {
    this.$http
      .get("Common/Get_Fin_Year_Date?Fin_Year_ID=" + this.commonApi.CompacctCookies.Fin_Year_ID)
      .subscribe((res: any) => {
      let data = JSON.parse(res)
     this.initDate =  [new Date(data[0].Fin_Year_Start) , new Date(data[0].Fin_Year_End)]
      });
  }

  showPopup() {
    console.log('pop up works');
    this.displayPopup = true;
  }

  closePopup() {
    console.log('close up works');
    this.clearData();
  }
  
  calTotal(){
   console.log('cal Total working');
   var Total_Amount = 0;
   this.objExpenses.Total_Amount = 0;
   this.objExpenses.Vegetables = this.objExpenses.Vegetables ? Number(this.objExpenses.Vegetables) : 0;
   this.objExpenses.Grocery = this.objExpenses.Grocery ? Number(this.objExpenses.Grocery) : 0;
   this.objExpenses.Misc_Other_NV_Item = this.objExpenses.Misc_Other_NV_Item ? Number(this.objExpenses.Misc_Other_NV_Item) : 0;
   this.objExpenses.Fuel = this.objExpenses.Fuel ? Number(this.objExpenses.Fuel) : 0;
   if(Number(this.objExpenses.Vegetables) || Number(this.objExpenses.Grocery) || Number(this.objExpenses.Misc_Other_NV_Item) || Number(this.objExpenses.Fuel)){
    Total_Amount = Number(this.objExpenses.Vegetables) + Number(this.objExpenses.Grocery) + Number(this.objExpenses.Misc_Other_NV_Item) + Number(this.objExpenses.Fuel)
    this.objExpenses.Total_Amount = Number(Total_Amount).toFixed(2);
   }
  }
  onReject(){
    this.compacctToast.clear("c");
  }
  getDateRange(dateRangeObj) {
    if (dateRangeObj.length) {
      this.From_date = dateRangeObj[0];
      this.To_date = dateRangeObj[1];
    }
  }
  getBrowseData() {
    this.seachSpinner = true;
    const From_date = this.From_date
    ? this.DateService.dateConvert(new Date(this.From_date))
    : this.DateService.dateConvert(new Date());
    const To_date = this.To_date
    ? this.DateService.dateConvert(new Date(this.To_date))
    : this.DateService.dateConvert(new Date());
    if(From_date && To_date) {
    const tempobj = {
      From_Date : From_date,
      To_Date : To_date
    }
    const obj = {
      "SP_String": "SP_Master_Coupon_Receive",
      "Report_Name_String": "Get_Master_Coupon_Canteen_Expenses",
      "Json_Param_String": JSON.stringify([tempobj])

    }
    this.GlobalAPI.getData(obj).subscribe((data: any) => {
      console.log('coupon browse data>>', data);
      if(data.length){
      this.allDataList = data;
      this.DynamicHeader = Object.keys(this.allDataList[0]);
      console.log('Dynamic Header',this.DynamicHeader);
      this.seachSpinner = false;
    }
    else {
      this.seachSpinner = false;
    }
    });
    }
    else {
      this.seachSpinner = false;
    }
  }
  Delete(col){
    this.DocNo = undefined;
    if(col.Canteen_Exp_ID){
     this.DocNo = col.Canteen_Exp_ID
     this.DocDate = new Date(col.Date)
     this.compacctToast.clear();
     this.compacctToast.add({
       key: "c",
       sticky: true,
       severity: "warn",
       summary: "Are you sure?",
       detail: "Confirm to proceed"
     });
    }
  }
  onConfirm() {
    if (this.DocNo) {
      const obj = {
        "SP_String": "SP_Master_Coupon_Receive",
        "Report_Name_String": "Delete_Master_Coupon_Canteen_Expenses",
        "Json_Param_String": JSON.stringify([{ Canteen_Exp_ID: this.DocNo, Date: this.DateService.dateConvert(new Date(this.DocDate))}])
      }
      this.GlobalAPI.getData(obj).subscribe((data: any) => {
        if (data[0].Column1 === "Done") {
          this.compacctToast.clear();
          this.compacctToast.add({
            key: "compacct-toast",
            severity: "success",
            summary: "Coupon Expenses",
            detail: "Succesfully Deleted"
          });
          this.DocNo = undefined;
          this.DocDate = undefined;
          this.getBrowseData();
        } else {
            this.CompacctToast.clear();
            this.CompacctToast.add({
              key: "compacct-toast",
              severity: "error",
              summary: "Error",
              detail: "Something Wrong"
            });
        }
      });
    }
  }
  

  SaveCoupon(valid) {
    console.log('save works')
    this.couponExpensesFormSubmit = true;
    if (valid) {
        this.Spinner = true;
        this.couponExpensesFormSubmit = false;
        this.objExpenses.Date = this.DateService.dateConvert(this.couponDate);
        this.objExpenses.Created_By = this.commonApi.CompacctCookies.User_ID;
        console.log(this.objExpenses);
        const obj = {
          "SP_String": "SP_Master_Coupon_Receive",
          "Report_Name_String": "Save_Master_Coupon_Canteen_Expenses",
          "Json_Param_String": JSON.stringify([this.objExpenses])
        }
        this.GlobalAPI.postData(obj).subscribe((data) => {
          console.log('save response>>', data);
          if (data[0].Column1) {
            this.CompacctToast.clear();
            this.CompacctToast.add({
              key: "compacct-toast",
              severity: "success",
              summary: "Coupon",
              detail: "Succesfully Expenses"
            });
            this.clearData();
            this.getBrowseData();

          }
          else {
            this.CompacctToast.clear();
            this.CompacctToast.add({
              key: "compacct-toast",
              severity: "error",
              summary: "Error",
              detail: "Something Wrong"
            });
            this.Spinner = false;
          }
        });

      
    }

  }

  clearData() {
    this.couponDate = new Date();
    this.Spinner = false;
    this.displayPopup = false;
    this.objExpenses = new Expenses();
    this.couponExpensesFormSubmit = false;
  }

  TabClick(e) {
    this.tabIndexToView = e.index;
  }

}

class Expenses {
  Date: any;
  Vegetables: any;
  Grocery: any;
  Misc_Other_NV_Item: any;
  Fuel: any;
  Total_Amount: any;
  Created_By: any;
}
