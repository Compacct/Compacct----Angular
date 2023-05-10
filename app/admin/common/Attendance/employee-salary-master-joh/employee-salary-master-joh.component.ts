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
  selector: 'app-employee-salary-master-joh',
  templateUrl: './employee-salary-master-joh.component.html',
  styleUrls: ['./employee-salary-master-joh.component.css'],
  providers: [MessageService],
  encapsulation: ViewEncapsulation.None
})
export class EmployeeSalaryMasterJohComponent implements OnInit {
  items:any = [];
  Spinner = false;
  seachSpinner = false
  ShowSpinner = false;
  tabIndexToView = 0;
  buttonname = "Save";
  myDate = new Date();
  EmpSalaryListMICL:any = [];
  flag:boolean = false;
  Distdepartment:any = [];
  SelectedDistdepartment:any = [];
  SearchFields:any = [];
  BackupEmpSalaryListMICL:any = [];
  scrollableCols:any = [];
  frozenCols:any = [];
  rowGroupMetadata: any;
  expanded = false;
  Cols:any = [];
  DistPresentStatus:any = [];
  SelectedDistPresentStatus:any = [];

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
    this.expanded = false;
    this.scrollableCols = [
      { field: 'Emp_Code', header: 'Employee Code' },
      { field: 'Emp_Joining_Dt', header: 'Emp Joining Dt'},
      { field: 'Effective_From', header: 'Effective From' },
      { field: 'Basic_Salary', header: 'Basic Salary' },
      { field: 'HRA', header: 'HRA' },
      { field: 'Medical_Allowance', header: 'Medical Allowance' },
      { field: 'Special_Allowance', header: 'Special Allowance' },
      { field: 'Meal_Allownce', header: 'Meal Allownce' },
      { field: 'City_Compensation_Allowance', header: 'City Compensation Allowance' },
      { field: 'Educational_Allowance', header: 'Educational Allowance' },
      { field: 'Total_Earning_Amout', header: 'Total Earning Amout' },
      { field: 'PF_Cal_Type', header: 'PF Cal Type' },
      { field: 'PF_Cal_Amount', header: 'PF Cal Amount' },
      { field: 'PF_Extra_Contribution', header: 'Voluntary PF Contribution' },
      { field: 'ESI_Percentage', header: 'ESI Percentage' },
      { field: 'ESI_Amount', header: 'ESI Amount' },
      { field: 'Total_Deduction', header: 'Total Deduction' },
      { field: 'Total_CTC', header: 'Net Pay' },
      { field: 'CTC', header: 'CTC' },
      { field: 'Action', header: 'Action' },
  ];
  
    this.frozenCols = [
      { field: 'Emp_Name', header: 'Employee Name' }
    ];
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
      // this.rowGroupMetadata = {};
      this.EmpSalaryListMICL = [];
      // this.updateRowGroupMetaData();
      const obj = {
        "SP_String": "SP_Employee_Salary_Master_MICL",
        "Report_Name_String": "Get_EMP_Data"
      }
      this.GlobalAPI.getData(obj).subscribe((data:any)=>{
        this.EmpSalaryListMICL = data;
        this.BackupEmpSalaryListMICL = data;
        this.GetDistinct();
        this.EmpSalaryListMICL.forEach((item)=>{
          item.PF_Cal_Type = item.PF_Cal_Type ? item.PF_Cal_Type : undefined;
          this.totalearnings();
        });
        // this.updateRowGroupMetaData();
       })
    }
    updateRowGroupMetaData() {
      this.rowGroupMetadata = {};
      let previousRowGroup = [];
    
            if (this.EmpSalaryListMICL) {
                for (let i = 0; i < this.EmpSalaryListMICL.length; i++) {
                    let rowData = this.EmpSalaryListMICL[i];
                    //console.log("rowData ===",rowData);
                    let Dept_Name = rowData.Dept_Name;
                    if (i == 0) {
                        this.rowGroupMetadata[Dept_Name] = { index: 0, size: 1 };
                    }
                    else {
                        let previousRowData = this.EmpSalaryListMICL[i - 1];
                        let previousRowGroup = previousRowData.Dept_Name;
    
                        if (Dept_Name === previousRowGroup){
                          this.rowGroupMetadata[Dept_Name].size++;
                        }else {
                          this.rowGroupMetadata[Dept_Name] = { index: i, size: 1 };
                        }
                    }
                }
            }
    }
    // DISTINCT & FILTER
  GetDistinct() {
    let DDepartment:any = [];
    let DPresentstatus:any = [];
    this.Distdepartment = [];
    this.SelectedDistdepartment = [];
    this.DistPresentStatus = [];
    this.SelectedDistPresentStatus = [];
    this.SearchFields =[];
    this.EmpSalaryListMICL.forEach((item) => {
   if (DDepartment.indexOf(item.Dept_Name) === -1) {
    DDepartment.push(item.Dept_Name);
   this.Distdepartment.push({ label: item.Dept_Name, value: item.Dept_Name });
   }
   if (DPresentstatus.indexOf(item.Present_Status) === -1) {
    DPresentstatus.push(item.Present_Status);
   this.DistPresentStatus.push({ label: item.Present_Status, value: item.Present_Status });
   }
  });
     this.BackupEmpSalaryListMICL = [...this.EmpSalaryListMICL];
  }
  FilterDist() {
    let DDepartment:any = [];
    let DPresentStatus:any = [];
    this.SearchFields =[];
  if (this.SelectedDistdepartment.length) {
    this.SearchFields.push('Dept_Name');
    DDepartment = this.SelectedDistdepartment;
  }
  if (this.SelectedDistPresentStatus.length) {
    this.SearchFields.push('Present_Status');
    DPresentStatus = this.SelectedDistPresentStatus;
  }
  this.EmpSalaryListMICL = [];
  if (this.SearchFields.length) {
    let LeadArr = this.BackupEmpSalaryListMICL.filter(function (e) {
      return (DDepartment.length ? DDepartment.includes(e['Dept_Name']) : true) &&
             (DPresentStatus.length ? DPresentStatus.includes(e['Present_Status']) : true)
    });
  this.EmpSalaryListMICL = LeadArr.length ? LeadArr : [];
  } else {
  this.EmpSalaryListMICL = [...this.BackupEmpSalaryListMICL] ;
  }
  }
    // TOTAL EARNINGS
  totalearnings(){
    this.EmpSalaryListMICL.forEach((item)=>{
      item.Total_Earning_Amout = Number(Number(item.Basic_Salary) + Number(item.HRA) + Number(item.Medical_Allowance) + Number(item.Special_Allowance) +
                                Number(item.Meal_Allownce) + Number(item.Educational_Allowance) + Number(item.City_Compensation_Allowance)).toFixed(2);
      this.totaldeduction();
      this.ctccal();
    });
  }
  // TOTAL DEDUCTION
  totaldeduction(){
    this.EmpSalaryListMICL.forEach((item)=>{
      item.Total_Deduction = Number(Number(item.PF_Cal_Amount) + Number(item.PF_Extra_Contribution) + Number(item.ESI_Amount)).toFixed(2);
      this.totalctc();
    });
  }
  // CTC (NET PAY)
  totalctc(){
    this.EmpSalaryListMICL.forEach((item)=>{
      item.Total_CTC = Number(Number(item.Total_Earning_Amout) - Number(item.Total_Deduction)).toFixed(2);
    });
  }
  // PF CALCULATION
  PFChange(col){
    if(!col.PF_Cal_Type){
      col.PF_Cal_Amount = 0;
      // col.PF_Amount = 0;
      this.AfterPFCalChange(col);
    } 
    else {
      col.PF_Cal_Amount = undefined;
      // col.PF_Amount = undefined;
      this.AfterPFCalChange(col);
    }
  }
  AfterPFCalChange(col){
    col.PF_Cal_Amount = 0;
    if (col.PF_Cal_Type) { 
      var pfamt;
    if(col.PF_Cal_Type == "%") {
      pfamt = Number(Number(col.Basic_Salary) * 12 / 100).toFixed(2);
      col.PF_Cal_Amount =Number(pfamt);
      this.totalearnings();
    }
    if(col.PF_Cal_Type == "PF Fixed") {
      col.PF_Cal_Amount = 1800;
      this.totalearnings();
    }
    if(col.PF_Cal_Type == "NO PF") {
      col.PF_Cal_Amount = 0;
      this.totalearnings();
    }
    }
    else {
      col.PF_Cal_Amount = 0;
      this.totalearnings();
    }
  }
  ESICalChange(col){
    col.ESI_Amount = 0;
    var esiamt;
    if (col.ESI_Percentage) { 
      esiamt = Number(Number(col.Basic_Salary) * Number(col.ESI_Percentage) / 100).toFixed(2);
      col.ESI_Amount =Number(esiamt);
      this.totalearnings();
    }
    else {
      col.ESI_Amount = 0;
      this.totalearnings();
    }
  }
  ctccal(){
    this.EmpSalaryListMICL.forEach((item)=>{
      var ctccal;
    if(item.Total_Earning_Amout && item.PF_Cal_Amount) {
      ctccal = Number(Number(item.Total_Earning_Amout) +  Number(item.PF_Cal_Amount)).toFixed(2);
      item.CTC =Number(ctccal);
    }
  });
  }

    UpdateMaster(Obj){
      // console.log(this.DateService.dateConvert(new Date(this.myDate)))
      //  this.ObjProClosingStock.Doc_Date = this.DateService.dateConvert(new Date(this.todayDate));
      if(Obj.Emp_ID && Obj.Effective_From) {
       const TempObj = {
              Emp_ID: Obj.Emp_ID,
              Effective_From: this.DateService.dateConvert(new Date(Obj.Effective_From)),
              Basic_Salary : Obj.Basic_Salary,
              HRA	: Obj.HRA,
              Medical_Allowance	: Obj.Medical_Allowance,
              Special_Allowance : Obj.Special_Allowance,
              Meal_Allownce	: Obj.Meal_Allownce,
              Educational_Allowance	: Obj.Educational_Allowance,
              City_Compensation_Allowance : Obj.City_Compensation_Allowance,
              Total_Earning_Amout : Obj.Total_Earning_Amout,
              PF_Cal_Type : Obj.PF_Cal_Type,
              PF_Cal_Amount : Obj.PF_Cal_Amount,
              PF_Extra_Contribution : Obj.PF_Extra_Contribution,
              ESI_Percentage : Obj.ESI_Percentage,
              ESI_Amount : Obj.ESI_Amount,
              Total_Deduction : Obj.Total_Deduction,
              Total_CTC : Obj.Total_CTC
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
