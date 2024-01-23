import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MessageService } from 'primeng/api';
import { HttpClient, HttpParams } from '@angular/common/http';
import { DateTimeConvertService } from '../../../shared/compacct.global/dateTime.service';
import { CompacctCommonApi } from '../../../shared/compacct.services/common.api.service';
import { CompacctHeader } from '../../../shared/compacct.services/common.header.service';
import { CompacctGlobalApiService } from '../../../shared/compacct.services/compacct.global.api.service';

@Component({
  selector: 'app-coupon-utilization',
  templateUrl: './coupon-utilization.component.html',
  styleUrls: ['./coupon-utilization.component.css'],
  providers: [MessageService],
  encapsulation: ViewEncapsulation.None
})
export class CouponUtilizationComponent implements OnInit {

  tabIndexToView: number = 0;
  displayPopup: boolean = false;
  allDataList: any = [];
  couponDate: Date = new Date();
  DynamicHeader: any = [];
  Spinner: boolean = false;
  couponUtilizationFormSubmit: boolean = false;

  objUtilization = new Utilization();
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
      Header: "Coupon Utilization",
      Link: "MICL --> Coupon Utilization"
    });
    // this.getBrowseData();
    this.Finyear();
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
  onReject(){
    this.compacctToast.clear("c");
  }
  closePopup() {
    console.log('close up works');
    this.clearData();
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
      "Report_Name_String": "Get_Master_Coupon_Utilization",
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
    if(col.Coupon_Utilization_ID){
     this.DocNo = col.Coupon_Utilization_ID
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
        "Report_Name_String": "Delete_Master_Coupon_Utilization",
        "Json_Param_String": JSON.stringify([{ Coupon_Utilization_ID: this.DocNo, Date: this.DateService.dateConvert(new Date(this.DocDate))}])
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
    this.couponUtilizationFormSubmit = true;
    if (valid) {
        this.Spinner = true;
        this.couponUtilizationFormSubmit = false;
        this.objUtilization.Date = this.DateService.dateConvert(this.couponDate);
        this.objUtilization.Created_By = this.commonApi.CompacctCookies.User_ID;
        console.log(this.objUtilization);
        const obj = {
          "SP_String": "SP_Master_Coupon_Receive",
          "Report_Name_String": "Save_Master_Coupon_Utilization",
          "Json_Param_String": JSON.stringify([this.objUtilization])
        }
        this.GlobalAPI.postData(obj).subscribe((data) => {
          console.log('save response>>', data);
          if (data[0].Column1) {
            this.CompacctToast.clear();
            this.CompacctToast.add({
              key: "compacct-toast",
              severity: "success",
              summary: "Coupon",
              detail: "Succesfully Utilized"
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
    this.objUtilization = new Utilization();
    this.couponUtilizationFormSubmit = false;
  }

  TabClick(e) {
    this.tabIndexToView = e.index;
  }

}

class Utilization {
  Issue_To: any;
  Date: any;
  Total_Breakfast: any;
  Total_Lunch: any;
  Total_Dinner: any;
  Created_By: any;
}
