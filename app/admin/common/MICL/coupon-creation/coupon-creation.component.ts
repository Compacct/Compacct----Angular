import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MessageService } from 'primeng/api';
import { DateTimeConvertService } from '../../../shared/compacct.global/dateTime.service';
import { CompacctCommonApi } from '../../../shared/compacct.services/common.api.service';
import { CompacctHeader } from '../../../shared/compacct.services/common.header.service';
import { CompacctGlobalApiService } from '../../../shared/compacct.services/compacct.global.api.service';

@Component({
  selector: 'app-coupon-creation',
  templateUrl: './coupon-creation.component.html',
  styleUrls: ['./coupon-creation.component.css'],
  providers: [MessageService],
  encapsulation: ViewEncapsulation.None
})
export class CouponCreationComponent implements OnInit {

  tabIndexToView: number = 0;
  displayPopup: boolean = false;
  allDataList: any = [];
  couponType: any = [];
  couponDate: Date = new Date();
  DynamicHeader: any = [];
  Spinner: boolean = false;
  couponCreateFormSubmit: boolean = false;
  StartCheck: boolean = false;
  EndCheck: boolean = false;


  objCoupon = new Coupon();
  constructor(
    private Header: CompacctHeader,
    private CompacctToast: MessageService,
    private GlobalAPI: CompacctGlobalApiService,
    private commonApi: CompacctCommonApi,
    private DateService: DateTimeConvertService
  ) { }

  ngOnInit() {

    this.Header.pushHeader({
      Header: "Coupon Creation",
      Link: "MICL --> Coupon Creation"
    });
    this.getCouponTypes();
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

  getCouponTypes() {
    const obj = {
      "SP_String": "SP_Master_Coupon_Receive",
      "Report_Name_String": "Get_Coupon_Type"
    }

    this.GlobalAPI.getData(obj).subscribe((data: any) => {
      if (data.length) {
        console.log('coupon type>>', data);
        data.forEach((ele) => {
          this.couponType.push(ele.Coupon_Type)
        });
      }
    });
  }

  getBrowseData() {
    const obj = {
      "SP_String": "SP_Master_Coupon_Receive",
      "Report_Name_String": "Get_Master_Coupon_Receive_Data"
    }

    this.GlobalAPI.getData(obj).subscribe((data: any) => {
      console.log('coupon browse data>>', data);
      if (data.length) {
        this.allDataList = data;
        this.DynamicHeader = Object.keys(this.allDataList[0]);
        console.log(this.DynamicHeader);
      }
    });
  }

  getCouponNo() {
    {
      if ((this.objCoupon.End_No && this.objCoupon.Start_No) && (Number(this.objCoupon.End_No) > Number(this.objCoupon.Start_No))) {
        this.objCoupon.No_Of_Coupon = (Number(this.objCoupon.End_No) - Number(this.objCoupon.Start_No)) + 1;
        this.EndCheck = false;

      }
      else if ((this.objCoupon.End_No && this.objCoupon.Start_No) && (Number(this.objCoupon.End_No) < Number(this.objCoupon.Start_No))) {
        this.objCoupon.No_Of_Coupon = undefined;
        this.EndCheck = true;
      }
    }
  }

  SaveCoupon(valid) {
    console.log('save works')
    this.couponCreateFormSubmit = true;
    if (valid) {
      if (Number(this.objCoupon.End_No) < Number(this.objCoupon.Start_No)) {
        this.CompacctToast.clear();
        this.CompacctToast.add({
          key: "compacct-toast",
          severity: "error",
          summary: "Error",
          detail: "End No Can't Less than Start No"
        });
        this.Spinner = false;
      }

      else {
        this.Spinner = true;
        this.couponCreateFormSubmit = false;
        this.objCoupon.Date = this.DateService.dateConvert(this.couponDate);
        this.objCoupon.Created_By = this.commonApi.CompacctCookies.User_ID;
        console.log(this.objCoupon);
        const obj = {
          "SP_String": "SP_Master_Coupon_Receive",
          "Report_Name_String": "Save_Master_Coupon_Receive",
          "Json_Param_String": JSON.stringify([this.objCoupon])
        }
        this.GlobalAPI.postData(obj).subscribe((data) => {
          console.log('save response>>', data);
          if (data[0].Status == "Done") {
            this.CompacctToast.clear();
            this.CompacctToast.add({
              key: "compacct-toast",
              severity: "success",
              summary: "Coupon",
              detail: "Succesfully Created"
            });
            this.clearData();
            this.getBrowseData();
          }

          else if (data[0].Status == "Already Exists these Coupon") {

            this.CompacctToast.clear();
            this.CompacctToast.add({
              key: "compacct-toast",
              severity: "error",
              summary: "Error",
              detail: "Already Exists these Coupon"
            });
            this.Spinner = false;
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
  }

  clearData() {
    this.couponDate = new Date();
    this.Spinner = false;
    this.displayPopup = false;
    this.objCoupon = new Coupon();
    this.couponCreateFormSubmit = false;
    this.EndCheck = false;
  }

  TabClick(e) {
    this.tabIndexToView = e.index;
  }

}

class Coupon {
  Date: any;
  Coupon_Type: any;
  Start_No: any;
  End_No: any;
  No_Of_Coupon: any;
  Created_By: any;
}
