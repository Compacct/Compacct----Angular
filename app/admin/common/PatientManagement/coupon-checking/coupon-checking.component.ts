import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { MessageService } from 'primeng/api';
import { DateTimeConvertService } from '../../../shared/compacct.global/dateTime.service';
import { CompacctCommonApi } from '../../../shared/compacct.services/common.api.service';
import { CompacctHeader } from '../../../shared/compacct.services/common.header.service';
import { CompacctGlobalApiService } from '../../../shared/compacct.services/compacct.global.api.service';
import { FileUpload } from 'primeng/primeng';

@Component({
  selector: 'app-coupon-checking',
  templateUrl: './coupon-checking.component.html',
  styleUrls: ['./coupon-checking.component.css'],
  providers: [MessageService],
  encapsulation: ViewEncapsulation.None
})
export class CouponCheckingComponent implements OnInit {
  CouponID:any
  couponFormFormSubmitted:boolean = false
  seachSpinner:boolean = false
  UtilizationList:any = []
  objCouponValue:Object = {}
  constructor(
    private $http: HttpClient,
    private commonApi: CompacctCommonApi,
    private Header: CompacctHeader,
    private compacctToast: MessageService,
    private GlobalAPI: CompacctGlobalApiService,
  ) { }
  
  ngOnInit() {
    this.Header.pushHeader({
      Header: "Coupon Check",
      Link: " Clinic -> Coupon Check"
    });
  }
  GetcouponData(){
    this.UtilizationList = []
    this.objCouponValue = {}
    const tempobj = 
      {Coupon_ID:this.CouponID}
    
    const obj = {
      "SP_String": "SP_BL_Txn_Coupon_Utilization",
      "Report_Name_String": "get_coupon_id_details",
      "Json_Param_String": JSON.stringify([tempobj])
    }
    this.GlobalAPI.getData(obj).subscribe((data: any) => {
      console.log(data)
      this.objCouponValue = {
        Contact_Name: data[0].Contact_Name,
        Coupon_ID: data[0].Coupon_ID,
        Coupon_Type:data[0].Coupon_Type,
        Coupon_Value:data[0].Coupon_Value,
        Exp_date: data[0].Exp_date,
        Pending_Coupon_Value: data[0].Pending_Coupon_Value ? data[0].Pending_Coupon_Value : 0,
      }
      this.UtilizationList = data[0].utilization ? JSON.parse(data[0].utilization) : []
    })
  }

  checkObj(){
    return Object.keys(this.objCouponValue).length ? true : false
  }
}
