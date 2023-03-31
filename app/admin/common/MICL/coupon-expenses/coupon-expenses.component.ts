import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MessageService } from 'primeng/api';
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
  constructor(
    private Header: CompacctHeader,
    private CompacctToast: MessageService,
    private GlobalAPI: CompacctGlobalApiService,
    private commonApi: CompacctCommonApi,
    private DateService: DateTimeConvertService
  ) { }

  ngOnInit() {

    this.Header.pushHeader({
      Header: "Coupon Expenses",
      Link: "MICL --> Coupon Expenses"
    });
    this.getBrowseData()
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
   if(Number(this.objExpenses.Vegetables) && Number(this.objExpenses.Grocery) && Number(this.objExpenses.Misc_Other_NV_Item) && Number(this.objExpenses.Fuel)){
    this.objExpenses.Total_Amount = Number(this.objExpenses.Vegetables) + Number(this.objExpenses.Grocery) + Number(this.objExpenses.Misc_Other_NV_Item) + Number(this.objExpenses.Fuel)
   }
  }

  getBrowseData() {
    const obj = {
      "SP_String": "SP_Master_Coupon_Receive",
      "Report_Name_String": "Get_Master_Coupon_Canteen_Expenses"

    }
    this.GlobalAPI.getData(obj).subscribe((data: any) => {
      console.log('coupon browse data>>', data);
      if(data.length){
      this.allDataList = data;
      this.DynamicHeader = Object.keys(this.allDataList[0]);
      console.log('Dynamic Header',this.DynamicHeader);
    }
    });
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
