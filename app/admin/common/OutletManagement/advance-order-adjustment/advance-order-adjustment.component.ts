import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MessageService } from "primeng/api";
import {CompacctHeader} from "../../../shared/compacct.services/common.header.service"
import { HttpClient, HttpParams } from '@angular/common/http';
import { CompacctGlobalApiService } from '../../../shared/compacct.services/compacct.global.api.service';
import { DateTimeConvertService } from '../../../shared/compacct.global/dateTime.service';
import { CompacctCommonApi } from '../../../shared/compacct.services/common.api.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxUiLoaderService } from "ngx-ui-loader";

@Component({
  selector: 'app-advance-order-adjustment',
  templateUrl: './advance-order-adjustment.component.html',
  styleUrls: ['./advance-order-adjustment.component.css'],
  providers: [MessageService],
  encapsulation: ViewEncapsulation.None
})
export class AdvanceOrderAdjustmentComponent implements OnInit {
  seachSpinner : any= false;
  Spinner : any = false;
  From_date: any;
  To_date: any;
  AdvanceOrderlist:any = [];
  BackupAdvanceOrderlist:any = [];
  DynamicHeaderforAdvOrderList:any = [];
  SelectAllFLag:boolean = false;
  data: any[];
  globalFilterValue: string = '';

  constructor(
    private Header: CompacctHeader,
    private route : ActivatedRoute,
    private router : Router,
    private $http : HttpClient,
    private GlobalAPI: CompacctGlobalApiService,
    private DateService: DateTimeConvertService,
    public $CompacctAPI: CompacctCommonApi,
    private compacctToast: MessageService,
    private ngxService: NgxUiLoaderService
  ) { }

  ngOnInit() {
    this.Header.pushHeader({
      Header:  "Advance Order Adjustment " ,
      Link: "Advance Order Adjustment " 
    });
  }
  DateRange(dateRangeObj) {
    if (dateRangeObj.length) {
      this.From_date = dateRangeObj[0];
      this.To_date = dateRangeObj[1];
    }
  }
  GetAdvanceOrderlist() {
    this.globalFilterValue = '';
    this.AdvanceOrderlist = [];
    this.Spinner = true;
    this.seachSpinner = true;
    this.SelectAllFLag = false;
    const start = this.From_date
    ? this.DateService.dateConvert(new Date(this.From_date))
    : this.DateService.dateConvert(new Date());
    const end = this.To_date
    ? this.DateService.dateConvert(new Date(this.To_date))
    : this.DateService.dateConvert(new Date());
    if(start && end){
  const tempobj = {
    StartDate : start,
    EndDate : end,
  }
  const obj = {
    "SP_String": "SP_Advance_Order_Adjusted",
    "Report_Name_String": "Advance Order List",
    "Json_Param_String": JSON.stringify([tempobj])
  }
   this.GlobalAPI.getData(obj).subscribe((data:any)=>{
     this.AdvanceOrderlist = data;
     //console.log('Invoice list=====',this.PenInvoicelist)
     this.BackupAdvanceOrderlist = this.AdvanceOrderlist.slice();
     if(this.AdvanceOrderlist.length){
      this.DynamicHeaderforAdvOrderList = Object.keys(data[0]);
      console.log('this.DynamicHeaderforAdvOrderList===',this.DynamicHeaderforAdvOrderList)
    }
    else {
      this.DynamicHeaderforAdvOrderList = [];
    }
     this.Spinner = false;
     this.seachSpinner = false;
   })
   }
  }
  SelectAllChange(){
     if(this.SelectAllFLag){
      this.AdvanceOrderlist.forEach(el=>{
        el.Check_Order_Adjustment = true
        console.log('list===',this.AdvanceOrderlist)
      })
    } else {
      this.AdvanceOrderlist.forEach(el=>{
        el.Check_Order_Adjustment = false
        console.log('list===',this.AdvanceOrderlist)
      })
    }
  }
  SaveAdvanceOrder(){
    this.Spinner = false;
    this.ngxService.start();
  if(this.AdvanceOrderlist.length){
    let updateData:any = [];
    this.AdvanceOrderlist.forEach(el=>{
      console.log("Check_Order_Adjustment ====",el.Check_Order_Adjustment)
      if (el.Check_Order_Adjustment === true) {
        const updateObj = {
          Adv_Order_No : el.Adv_Order_No
        }
        updateData.push(updateObj)
        console.log("updateData",updateData);
      }

    })
    if(updateData.length){
     console.log("updateData",updateData);
     const obj = {
      "SP_String": "SP_Advance_Order_Adjusted",
      "Report_Name_String": "Update Advance Order List",
      "Json_Param_String": JSON.stringify(updateData)
     }
     this.GlobalAPI.postData(obj).subscribe((data:any)=>{
      console.log("data",data)

      if(data[0].Column1 === "Done"){
        this.GetAdvanceOrderlist();
        this.Spinner = false;
        this.ngxService.stop();
        this.compacctToast.clear();
        this.compacctToast.add({
          key: "compacct-toast",
          severity: "success",
          summary: "Advance Order Adjustment. ",
          detail: "Saved Successfully."
        });
        }
        else{
          this.Spinner = false;
          this.ngxService.stop();
          this.compacctToast.clear();
              this.compacctToast.add({
                key: "compacct-toast",
                severity: "error",
                summary: "Warn Message",
                detail: "Something Wrong"
              });
        }
     })
     
    }
    else{
      this.Spinner = false;
      this.ngxService.stop();
      this.compacctToast.clear();
          this.compacctToast.add({
            key: "compacct-toast",
            severity: "error",
            summary: "Warn Message",
            detail: "Something Wrong"
          });
    }

  }
  else{
    this.Spinner = false;
    this.ngxService.stop();
    this.compacctToast.clear();
        this.compacctToast.add({
          key: "compacct-toast",
          severity: "error",
          summary: "Warn Message",
          detail: "Something Wrong"
        });
  }
  }
  onReject(){}
  onConfirm(){}

  onGlobalFilterChange(value: string) {
    if(value) {
    this.globalFilterValue = value;
    this.applyGlobalFilter(value);
    this.resetDataWithFilter(this.data);
    }
    else{
      this.AdvanceOrderlist = this.BackupAdvanceOrderlist;
      this.SelectAllFLag = false;
      this.SelectAllChange();
    }
  }

  resetDataWithFilter(newData: any[]) {
    this.AdvanceOrderlist = newData;
    this.applyGlobalFilter(this.globalFilterValue);
  }

  applyGlobalFilter(filterValue: string) {
      this.data = this.AdvanceOrderlist.filter(item =>
        Object.values(item).some(value => {
          if (value !== null && value !== undefined) {
            return value.toString().toLowerCase().includes(filterValue.toLowerCase());
          }
          return false;
        })
      );
  }

}
