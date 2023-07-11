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
  selector: 'app-employee-synchronise-with-app',
  templateUrl: './employee-synchronise-with-app.component.html',
  styleUrls: ['./employee-synchronise-with-app.component.css'],
  providers: [MessageService],
  encapsulation: ViewEncapsulation.None
})
export class EmployeeSynchroniseWithAppComponent implements OnInit {
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
  EmpSynchroniselist:any = [];
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
      Header: "Employee Synchronise With App",
      Link: " HR -> Employee Synchronise With App"
    });
    this.SearchEmpSynchroniseData();
  }
  // SearchEmpSynchroniseData(valid){
  //   this.BonusFormSubmitted = true;
  //   this.seachSpinner = true;
  //   this.EmpSynchroniselist = [];
  //   this.ngxService.start();
  //   const From_date = this.From_Date
  //   ? this.DateService.dateConvert(new Date(this.From_Date))
  //   : this.DateService.dateConvert(new Date());
  //   const To_date = this.To_Date
  //   ? this.DateService.dateConvert(new Date(this.To_Date))
  //   : this.DateService.dateConvert(new Date());
  //   const tempobj = {
  //    From_Date : From_date,
  //    To_Date : To_date,
  //   //  Company_ID : this.ObjBonus.Company_ID
  //  }
  //  if (valid && From_date && To_date) {
  // const obj = {
  //   "SP_String": "SP_HR_Txn_Employee_Bonus",
  //   "Report_Name_String": "Get_EMP_Data_List",
  //   "Json_Param_String": JSON.stringify([tempobj])
  // }
  //  this.GlobalAPI.getData(obj).subscribe((data:any)=>{
  //    this.EmpSynchroniselist = data;
  //   //  this.EmpSynchroniselist.forEach(element => {
  //   //   var Bonus_Amount = Number(element.Total_Earning_Basic) * Number(this.Bonus_Per);
  //   //   element['Bonus_Amount'] = Number(this.RoundOff(Number(Bonus_Amount)));
  //   //  });
  //    this.ngxService.stop();
  //   //  this.BackupSearchedlist = data;
  //    //console.log('Search list=====',this.Searchedlist)
  //    this.seachSpinner = false;
  //    this.BonusFormSubmitted = false;
  //  })
  // }
  // else {
  //   this.ngxService.stop();
  //      }
  // }
  SearchEmpSynchroniseData(){
    const obj = {
      "SP_String": "SP_HR_ATTN_DETAILS",
      "Report_Name_String": "Get_Employee_For_Syn"
    }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      this.EmpSynchroniselist = data;
     })
  }
  UpdateEmpSynchronise(Obj){
     const TempObj = {
            Comp_ID: Obj.Comp_ID,
            Br_ID: Obj.Br_ID,
            Emp_Code: Obj.Emp_Code,
            Emp_ID: Obj.Emp_ID ? Obj.Emp_ID : 'A',
            Emp_Name: Obj.Emp_Name,
            Gender: Obj.Gender,
            Emp_Address: Obj.Emp_Address,
            Emp_PIN: Obj.Emp_PIN,
            EmailID: Obj.EmailID,
            Mobile: Obj.Mobile,
            Password: Obj.Password,
            Approved_Photo: Obj.Approved_Photo,
            Allow_Field_Attn: Obj.Allow_Field_Attn,
            On_Board: Obj.On_Board,
            Is_Active: Obj.Is_Active
         }
         const Tempobj = {
          "SP_String": "SP_HR_ATTN_DETAILS",
          "Report_Name_String": "Update_Employe",
          "Json_Param_String" : JSON.stringify([TempObj])
        }
        this.GlobalAPI.postData(Tempobj).subscribe((data:any)=>{
             // console.log(data);
              if(data[0].Column1 === "Done") {
                this.compacctToast.clear();
                this.compacctToast.add({
                  key: "compacct-toast",
                  severity: "success",
                  // summary: 'Emp ID : ' + Obj.Emp_ID,
                  detail: "Succesfully Updated."
                });
                this.SearchEmpSynchroniseData();
              }
              else {
                this.compacctToast.clear();
                this.compacctToast.add({
                  key: "compacct-toast",
                  severity: "error",
                  summary: "Error",
                  detail: "Error Occured"
                });
              }
        });
      
  }
  onConfirm(){}
  onReject(){}

}
