import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MessageService } from 'primeng/api';
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

  constructor(
    private Header: CompacctHeader,
    private CompacctToast: MessageService,
    private GlobalAPI: CompacctGlobalApiService,
    private commonApi: CompacctCommonApi,
    private DateService: DateTimeConvertService
  ) { }

  ngOnInit() {

    this.Header.pushHeader({
      Header: "Coupon Utilization",
      Link: "MICL --> Coupon Utilization"
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
  getBrowseData() {
    const obj = {
      "SP_String": "SP_Master_Coupon_Receive",
      "Report_Name_String": "Get_Master_Coupon_Utilization"

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
  Date: any;
  Total_Breakfast: any;
  Total_Lunch: any;
  Total_Dinner: any;
  Created_By: any;
}
