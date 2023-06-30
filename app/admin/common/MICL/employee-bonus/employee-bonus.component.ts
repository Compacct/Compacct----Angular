import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MessageService } from "primeng/api";
import {CompacctHeader} from "../../../shared/compacct.services/common.header.service"
import { HttpClient, HttpParams } from '@angular/common/http';
import { CompacctGlobalApiService } from '../../../shared/compacct.services/compacct.global.api.service';
import { DateTimeConvertService } from '../../../shared/compacct.global/dateTime.service';
import { CompacctCommonApi } from '../../../shared/compacct.services/common.api.service';
import { Dropdown } from "primeng/components/dropdown/dropdown";
import { Router } from '@angular/router';
import { NgxUiLoaderService } from "ngx-ui-loader";

@Component({
  selector: 'app-employee-bonus',
  templateUrl: './employee-bonus.component.html',
  styleUrls: ['./employee-bonus.component.css'],
  providers: [MessageService],
  encapsulation: ViewEncapsulation.None
})
export class EmployeeBonusComponent implements OnInit {
  items:any = [];
  menuList:any = [];
  Spinner = false;
  seachSpinner = false;
  buttonname = "Save";
  Bonus_Month : any;
  Process_Date = new Date();
  From_Date: any;
  To_Date: any;
  Bonus_Per : any;
  BonusFormSubmitted:boolean = false;
  EmpBonuslist:any = [];
  initDate:any = [];

  constructor(
    private Header: CompacctHeader,
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
      Header: "Employee Bonus",
      Link: " HR -> Transaction -> Employee Bonus"
    });
    this.initDate =  [new Date() , new Date()]
    const d = new Date();
    let month = d.getMonth() + 1;
    console.log('month',month)
    let year = d.getFullYear();
    this.Bonus_Month = month < 10 ? year+'-'+0+month : year+'-'+month
    this.GetMonthData();
    this.Bonus_Per = 8.33;
  }
  GetMonthData(){
    this.EmpBonuslist = [];
    this.seachSpinner = true;
    this.ngxService.start();
    var firstDate = this.Bonus_Month+'-'+'01'
    console.log('firstDate',firstDate)
    const AtObj = {
      Bonus_Month : this.DateService.dateConvert(new Date(firstDate)),
    }
    if (this.Bonus_Month) {
    const obj = {
      "SP_String": "SP_HR_Txn_Employee_Bonus",
      "Report_Name_String": "Get_Bonus_Data",
      "Json_Param_String": JSON.stringify([AtObj])

    }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
        this.EmpBonuslist = data;
        this.initDate =  this.EmpBonuslist.length ? [new Date(data[0].From_Date) , new Date(data[0].To_Date)] : [new Date() , new Date()];
        this.Bonus_Per = this.EmpBonuslist.length ? data[0].Bonus_Per : 8.33;
        this.ngxService.stop();
        this.seachSpinner = false;
  })
    }
    else {
      this.ngxService.stop();
    }
  }
  getDateRange(dateRangeObj){
    if (dateRangeObj.length) {
      this.From_Date = dateRangeObj[0];
      this.To_Date = dateRangeObj[1];
    }
  }
  SearchBonusData(valid){
    this.BonusFormSubmitted = true;
    this.seachSpinner = true;
    this.EmpBonuslist = [];
    this.ngxService.start();
    const From_date = this.From_Date
    ? this.DateService.dateConvert(new Date(this.From_Date))
    : this.DateService.dateConvert(new Date());
    const To_date = this.To_Date
    ? this.DateService.dateConvert(new Date(this.To_Date))
    : this.DateService.dateConvert(new Date());
    const tempobj = {
     From_Date : From_date,
     To_Date : To_date,
    //  Company_ID : this.ObjBonus.Company_ID
   }
   if (valid && From_date && To_date) {
  const obj = {
    "SP_String": "SP_HR_Txn_Employee_Bonus",
    "Report_Name_String": "Get_EMP_Data_List",
    "Json_Param_String": JSON.stringify([tempobj])
  }
   this.GlobalAPI.getData(obj).subscribe((data:any)=>{
     this.EmpBonuslist = data;
     this.EmpBonuslist.forEach(element => {
      var Bonus_Amount = Number(element.Total_Earning_Basic) * Number(this.Bonus_Per);
      element['Bonus_Amount'] = Number(this.RoundOff(Number(Bonus_Amount)));
     });
     this.ngxService.stop();
    //  this.BackupSearchedlist = data;
     //console.log('Search list=====',this.Searchedlist)
     this.seachSpinner = false;
     this.BonusFormSubmitted = false;
   })
  }
  else {
    this.ngxService.stop();
       }
  }
  RoundOff(key:any){
    return Math.round(Number(Number(key).toFixed(2)))
  }
  SaveBonus(){
    if(this.EmpBonuslist.length){
      let updateData:any = [];
      this.EmpBonuslist.forEach(el=>{
        var firstDate = this.Bonus_Month+'-'+'01'
        const From_date = this.From_Date
        ? this.DateService.dateConvert(new Date(this.From_Date))
        : this.DateService.dateConvert(new Date());
        const To_date = this.To_Date
        ? this.DateService.dateConvert(new Date(this.To_Date))
        : this.DateService.dateConvert(new Date());
          const updateObj = {
            Emp_ID : el.Emp_ID,
            Bonus_Month : this.DateService.dateConvert(new Date(firstDate)),
            From_Date : From_date,
            To_Date : To_date,
            Bonus_Per : this.Bonus_Per,
            Total_Earning : el.Total_Earning_Basic,
            Bonus_Amount :  el.Bonus_Amount,
            Remarks : el.Remarks,
            Created_By :  this.$CompacctAPI.CompacctCookies.User_ID
  
          }
          updateData.push(updateObj)
  
      })
      if(updateData.length){
        const obj = {
          "SP_String": "SP_HR_Txn_Employee_Bonus",
          "Report_Name_String" : "Insert_Data",
          "Json_Param_String": JSON.stringify(updateData)
        }
        this.GlobalAPI.getData(obj).subscribe((data:any)=>{
          // this.RTFchallanno = data[0].Column1;
          if(data[0].Column1){
          // this.SearchBonusData(true);
          this.GetMonthData();
        this.ngxService.stop();
       this.compacctToast.clear();
       this.compacctToast.add({
        key: "compacct-toast",
        severity: "success",
        summary: "Employee Bonus",
        detail: "Save Succesfully"
      });
          }
          else{
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
        this.ngxService.stop();
        this.compacctToast.clear();
            this.compacctToast.add({
              key: "compacct-toast",
              severity: "error",
              summary: "Warn Message",
              detail: "Something Wrong"
            });
      }
    // }
    }
    else{
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
  onConfirm(){}
  onReject(){}

}
class Bonus {
  Emp_ID : any;
  From_Date : Date;
  To_Date : Date;
  Bonus_Per : any;
  Total_Earning : any;
  Bonus_Amount :  any;
  Created_By :  any;
 }
