import { Component, OnInit, ViewEncapsulation, ViewChild } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { MessageService } from "primeng/api";
import { FileUpload } from "primeng/primeng";
declare var $: any;
import { THIS_EXPR } from "@angular/compiler/src/output/output_ast";
import { CompacctCommonApi } from "../../../shared/compacct.services/common.api.service";
import { CompacctHeader } from "../../../shared/compacct.services/common.header.service";
import { CompacctGlobalApiService } from "../../../shared/compacct.services/compacct.global.api.service";
import { DateTimeConvertService } from "../../../shared/compacct.global/dateTime.service"
import { ActivatedRoute, Router } from "@angular/router";

@Component({
  selector: 'app-employee-salary-master-micl',
  templateUrl: './employee-salary-master-micl.component.html',
  styleUrls: ['./employee-salary-master-micl.component.css'],
  providers: [MessageService],
  encapsulation: ViewEncapsulation.None
})
export class EmployeeSalaryMasterMiclComponent implements OnInit {
  items:any = [];
  Spinner = false;
  seachSpinner = false
  ShowSpinner = false;
  tabIndexToView = 0;
  buttonname = "Save";
  myDate = new Date();
  EmpSalaryListMICL:any = [];

  constructor(
    private Header: CompacctHeader,
    private router : Router,
    private route : ActivatedRoute,
    private $http : HttpClient,
    private GlobalAPI: CompacctGlobalApiService,
    private DateService: DateTimeConvertService,
    public $CompacctAPI: CompacctCommonApi,
    private compacctToast: MessageService,
  ) { }

  ngOnInit() {
    // this.items = ["BROWSE", "CREATE"];
    this.Header.pushHeader({
      Header: "Employee Salary Master", 
      Link: "HR -> Employee Salary Master"
    });
    this.GetEmpData();
  }
   // TabClick(e){
      // console.log(e)
      //  this.tabIndexToView = e.index;
      //  this.items = ["BROWSE", "CREATE"];
      //  this.buttonname = "Save";
    //  }
    onReject() {
      this.compacctToast.clear("c");
    }
     GetEmpData(){
      const obj = {
        "SP_String": "SP_Employee_Salary_Master_MICL",
        "Report_Name_String": "Get_EMP_Data"
      }
      this.GlobalAPI.getData(obj).subscribe((data:any)=>{
        this.EmpSalaryListMICL = data;
       })
    }

    UpdateMaster(Obj){
      // console.log(this.DateService.dateConvert(new Date(this.myDate)))
      //  this.ObjProClosingStock.Doc_Date = this.DateService.dateConvert(new Date(this.todayDate));
      if(Obj.Emp_ID) {
       const TempObj = {
              Emp_ID: Obj.Emp_ID,
              Basic_Salary : Obj.Basic_Salary,
              HRA	: Obj.HRA,
              Conveyance_Allowance : Obj.Conveyance_Allowance,
              Children_Education_Allowance	: Obj.Children_Education_Allowance,
              Medical_Allownce	: Obj.Medical_Allownce,
              Washing_Allowance	: Obj.Washing_Allowance,
              Other_Allowance : Obj.Other_Allowance
           }
           const Tempobj = {
            "SP_String": "SP_Employee_Salary_Master_MICL",
            "Report_Name_String": "Update_Salary",
            "Json_Param_String" : JSON.stringify([TempObj])
          }
          this.GlobalAPI.postData(Tempobj).subscribe((data:any)=>{
               // console.log(data);
                if(data[0].Column1 === "Done") {
                  this.compacctToast.clear();
                  this.compacctToast.add({
                    key: "compacct-toast",
                    severity: "success",
                    summary: 'Emp ID : ' + Obj.Emp_ID,
                    detail: "Succesfully Updated."
                  });
                  this.GetEmpData();
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
        else {
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
  
}

