import { data } from 'jquery';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MessageService } from "primeng/api";
import { HttpClient, HttpParams } from "@angular/common/http";
import { CompacctCommonApi } from '../../../shared/compacct.services/common.api.service';
import { CompacctHeader } from '../../../shared/compacct.services/common.header.service';
import { CompacctGlobalApiService } from '../../../shared/compacct.services/compacct.global.api.service';
import { DateTimeConvertService } from '../../../shared/compacct.global/dateTime.service';
import * as moment from "moment";
import { NgxUiLoaderService } from "ngx-ui-loader";

@Component({
  selector: 'app-hr-loan-application',
  templateUrl: './hr-loan-application.component.html',
  styleUrls: ['./hr-loan-application.component.css'],
  providers: [MessageService],
  encapsulation: ViewEncapsulation.None
})
export class HrLoanApplicationComponent implements OnInit {
  items:any = [];
  menuList:any =[];
  AllData:any = [];
  empDataList:any = [];
  hrYeatList:any = [];
  leaveList:any = [];
  menuData:any = [];
  tabIndexToView= 0;
  buttonname = "Apply For Loan";
  LoanApplFormSubmitted = false;
  ObjHrLoanAppl: HrLoanAppl = new HrLoanAppl ();
  Application_Date = new Date();
  EMI_Start_From_Date_Month : any;
  EMI_Start_Date:any = Date;
  HrleaveId = undefined ;
  Spinner = false;
  masterLeaveId : number;
  GlobalApi:any = [];
  txnId = undefined;
  mastertxnId = undefined;
  HRYearID = undefined;
  LEAVETYPE = undefined;
  TranType = undefined;
  Editdisable = false;
  // From_Time = new Date()
  // To_Time = new Date()
  // minDateFrom_Time = new Date()
  // minDateTo_Time = new Date()
  // maxDateFrom_Time = new Date()
  // maxDateTo_Time = new Date()
  showBaln = undefined;
  NOfDayApplyBackUp = undefined;
  leaveStatusCheck = true;
  showErrorMsg = false

  currentdate = new Date();
  FromDatevalue : any = Date;
  ToDatevalue = new Date();
  minFromDate : Date;
  maxFromDate : Date;
  minToDate : Date;
  maxToDate : Date;
  mndays = undefined;
  applydays = undefined;
  empid: any;
  TxnAppID: any;
  deleteError = false;
  
  ObjBrowse : Browse = new Browse ();
  HrLoanApplSearchFormSubmitted = false;
  seachSpinner = false;
  initDate:any = [];
  BackupAllData:any = [];
  DistEmpName:any = [];
  SelectedDistEmpName:any = [];
  SearchFields:any = [];

  constructor(
    private http: HttpClient,
    private compact: CompacctCommonApi,
    private header:CompacctHeader, 
    private GlobalAPI:CompacctGlobalApiService,
    private compacctToast:MessageService,
    private DateService: DateTimeConvertService,
    public $CompacctAPI: CompacctCommonApi,
    private ngxService: NgxUiLoaderService
  ) { }

  ngOnInit() {
    this.items = ["BROWSE", "APPLY"];
    this.menuList = [
      { label: "Edit", icon: "pi pi-fw pi-user-edit" },
      { label: "Delete", icon: "fa fa-fw fa-trash" }
    ];
   
    this.header.pushHeader({
      Header: "Loan Application",
      Link: " HR -> Transaction -> Loan Application"
    })
  // this.minDateTo_Time = this.From_Time
    this.FromDatevalue = new Date(this.currentdate);
    this.ToDatevalue = new Date();
    this.employeeData();
    // this.GetBrowseData();
    this.Finyear();
    this.ToDatevalue = new Date();
    // this.initDate = [new Date(),new Date()]
  }
  TabClick(e) {
    this.tabIndexToView = e.index;
    this.items = ["BROWSE", "APPLY"];
    this.buttonname = "Apply For Loan";
    this.clearData();
    this.Editdisable = false;
    // this.hrYearList();
  }
  clearData(){
    this.LoanApplFormSubmitted = false;
    this.ObjHrLoanAppl =new HrLoanAppl();
    this.HrleaveId = undefined;
    // this.From_Time = new Date(this.To_Time.setDate(new Date().getDate() + 1 ))
    // this.To_Time = new Date(this.To_Time.setDate(this.From_Time.getDate() + 1 ))
    this.minToDate = this.FromDatevalue
    this.showBaln = undefined;
    this.applydays = undefined;
    this.showErrorMsg = false
    // this.GetNumberOfdays();
    this.ObjHrLoanAppl.HR_Year_ID =  this.hrYeatList.length ? this.hrYeatList[0].HR_Year_ID : undefined;
    this.employeeData();
    this.FromDatevalue = new Date();
    this.minFromDate = new Date();
    this.ToDatevalue = new Date();
  }
  employeeData(){
    const obj = {
      "SP_String":"SP_HR_Txn_Loan",
      "Report_Name_String": "Get_Employee_List",
      "Json_Param_String": JSON.stringify([{User_ID:this.$CompacctAPI.CompacctCookies.User_ID}])
    }
     this.GlobalAPI.getData(obj)
     .subscribe((data:any)=>{
      this.empDataList = data;
      var empname = this.empDataList.filter(el=> Number(el.User_ID) === Number(this.$CompacctAPI.CompacctCookies.User_ID))
      console.log(empname)
      this.ObjHrLoanAppl.Emp_ID = empname.length ? empname[0].Emp_ID : undefined;
      console.log("employee==",this.empDataList);
      });
  }
  Finyear() {
    this.http
      .get("Common/Get_Fin_Year_Date?Fin_Year_ID=" + this.$CompacctAPI.CompacctCookies.Fin_Year_ID)
      .subscribe((res: any) => {
      let data = JSON.parse(res)
      // this.vouchermaxDate = new Date(data[0].Fin_Year_End);
      // this.voucherminDate = new Date(data[0].Fin_Year_Start);
      // this.voucherdata = new Date().getMonth() > new Date(data[0].Fin_Year_End).getMonth() ? new Date() : new Date(data[0].Fin_Year_End)
     this.initDate =  [new Date(data[0].Fin_Year_Start) , new Date(data[0].Fin_Year_End)]
      });
  }
  getEMIstartDate() {
    this.EMI_Start_Date = new Date();
    var addfirstDate = this.EMI_Start_From_Date_Month+'-'+'01';
    var firstDate = this.DateService.dateConvert(new Date(addfirstDate));
    if (firstDate) {
      this.EMI_Start_Date = new Date(firstDate);
    }
  }
  saveLoanData(valid:any){
    this.Spinner = true;
    this.LoanApplFormSubmitted = true;
    this.ngxService.start();
    if (valid) {
      this.Spinner = true;
      this.ngxService.start();
     this.compacctToast.clear();
     this.compacctToast.add({
       key: "s",
       sticky: true,
       closable: false,
       severity: "warn",
       summary: "Are you sure?",
       detail: "Confirm to proceed"
     });
    }
    else{
      this.ngxService.stop();
      this.Spinner = false;
      this.compacctToast.clear();
      this.compacctToast.add({
        key: "compacct-toast",
        severity: "error",
        summary: "Warn Message",
        detail: "Error Occured "
      });
    }
  }
  onConfirmSave(valid:any){
    // if(valid){
      // if(this.$CompacctAPI.CompacctCookies.User_Type === "A") {
     this.ObjHrLoanAppl.Application_Date = this.DateService.dateConvert(new Date(this.Application_Date));
     this.ObjHrLoanAppl.EMI_Start_From_Date_Month = this.EMI_Start_From_Date_Month;
     var date:any = new Date(this.EMI_Start_From_Date_Month);
     this.ObjHrLoanAppl.EMI_Start_Month = this.DateService.dateConvert(new Date(this.EMI_Start_From_Date_Month));
     this.ObjHrLoanAppl.EMI_Start_Year = date.getFullYear();
     this.ObjHrLoanAppl.EMI_START_DATE = this.DateService.dateConvert(new Date(this.EMI_Start_Date));
     this.ObjHrLoanAppl.Approve_By = this.$CompacctAPI.CompacctCookies.User_ID;
    //  this.ObjHrLoanAppl.HR_Remarks = this.ObjHrLoanAppl.Remarks
      
        const obj = {
          "SP_String": "SP_HR_Txn_Loan",
          "Report_Name_String": 'Save_Loan_Application',
          "Json_Param_String": JSON.stringify([this.ObjHrLoanAppl])
         }
         this.GlobalAPI.getData(obj)
         .subscribe((data:any)=>{
          console.log("Final save data ==",data);
          if (data[0].Column1){
            this.compacctToast.clear();
            this.compacctToast.add({
              key: "compacct-toast",
              severity: "success",
              summary: "Application No " +data[0].Column1,
              detail: "Succesfully Apply"
            });
            this.Spinner = false;
            this.ngxService.stop();
            this.GetBrowseData(true);
            this.HrleaveId = undefined;
            this.txnId = undefined;
            this.Editdisable = false;
            this.LoanApplFormSubmitted = false;
            this.ObjHrLoanAppl =new HrLoanAppl();
            this.Application_Date = new Date();
            this.EMI_Start_From_Date_Month = undefined;
            this.EMI_Start_Date = undefined;
            }
            else {
              this.Spinner = false;
              this.ngxService.stop();
              this.compacctToast.clear();
              this.compacctToast.add({
                key: "compacct-toast",
                severity: "error",
                summary: "Warn Message ",
                detail: "Error occured"
              });
            }
           
           
          });
      // }
      // else{
      //   console.error("error password")
      // }
        
  }
  onReject(){
    this.compacctToast.clear("s");
    this.ngxService.stop();
    this.Spinner = false;
  }
  getDateRange(dateRangeObj) {
    if (dateRangeObj.length) {
      this.ObjBrowse.From_date = dateRangeObj[0];
      this.ObjBrowse.To_date = dateRangeObj[1];
    }
  }
  GetBrowseData(valid){
  this.HrLoanApplSearchFormSubmitted = true;
  // this.seachSpinner = true;
  const From_date = this.ObjBrowse.From_date
     ? this.DateService.dateConvert(new Date(this.ObjBrowse.From_date))
     : this.DateService.dateConvert(new Date());
   const To_date = this.ObjBrowse.To_date
     ? this.DateService.dateConvert(new Date(this.ObjBrowse.To_date))
     : this.DateService.dateConvert(new Date());
     const tempobj = {
       From_Date : From_date,
       To_Date : To_date,
       Emp_ID : this.ObjBrowse.Emp_ID ? this.ObjBrowse.Emp_ID : 0
       }
  if(valid){
  const obj = {
    "SP_String":"SP_HR_Txn_Loan",
    "Report_Name_String":"Browse_Loan_Application",
    "Json_Param_String": JSON.stringify([tempobj])
  }
   this.GlobalAPI.getData(obj)
   .subscribe((data:any)=>{
    this.AllData = data;
    this.BackupAllData = data;
   this.HrLoanApplSearchFormSubmitted = false;
   this.seachSpinner = false;
    console.log("Browse data==",this.AllData);
    }); 
  }
  }

}
class HrLoanAppl {
  Emp_ID:any;
  HR_Year_ID:any;
  Remarks:any;
  Application_Date:any;
  EMI_Start_From_Date_Month:any;
  EMI_Start_Month:any;
  EMI_Start_Year:any;
  EMI_START_DATE:any;
  Loan_Amount:any;
  No_Of_EMI:any;
  EMI_Amount:any;
  Approve_By:any;
}
class Browse {
  Leave_Type : any;
  From_date : Date;
  To_date : Date;
  Emp_ID : any;
 }
