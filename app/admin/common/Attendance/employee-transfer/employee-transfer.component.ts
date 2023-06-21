import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MessageService } from "primeng/api";
import { HttpClient } from '@angular/common/http';
import { CompacctCommonApi } from "../../../shared/compacct.services/common.api.service";
import { CompacctHeader } from "../../../shared/compacct.services/common.header.service";
import { CompacctGlobalApiService } from '../../../shared/compacct.services/compacct.global.api.service';
import { DateTimeConvertService } from '../../../shared/compacct.global/dateTime.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { FileUpload } from 'primeng/fileupload';

@Component({
  selector: 'app-employee-transfer',
  templateUrl: './employee-transfer.component.html',
  styleUrls: ['./employee-transfer.component.css'],
  providers: [MessageService],
  encapsulation: ViewEncapsulation.None
})
export class EmployeeTransferComponent implements OnInit {
  tabIndexToView: number = 0;
  buttonname: string = "Save";
  items: any = [];
  initDate:any = [];
  Spinner: boolean = false;
  seachSpinner: boolean = false;
  ObjEmpTransfer: EmpTransfer = new EmpTransfer();
  EmpTransferFormSubmitted: boolean = false;
  EmployeeList:any = [];
  TransferFromList:any = [];
  TransferToList:any = [];
  Transfer_Date:any = new Date();
  StatusList:any = [];
  ReasonForTransferList:any = [];
  file: boolean = false;
  upload: boolean = true;

  @ViewChild("UploadFile", { static: false }) UploadFile!: FileUpload;
  start_date: any;
  end_date: any;
  SerarchEmpTransferList:any = [];
  SerarchEmpTransferListHeader:any = [];

  constructor(
    private $http : HttpClient,
    public $CompacctAPI: CompacctCommonApi,
    private header: CompacctHeader,
    private GlobalAPI: CompacctGlobalApiService,
    private compacctToast: MessageService,
    private DateService: DateTimeConvertService,
    private ngxService: NgxUiLoaderService
  ) { }

  ngOnInit() {
    this.items = ["BROWSE", "CREATE"];
    this.header.pushHeader({
      Header: "Employee Transfer",
      Link: "HR-> Employee Transfer"
    })
    this.StatusList = ["Transferred", "On Hold", "Cancelled", "In Progress"];
    this.ReasonForTransferList = ["Requested ", "Skills and talent utilization", "Career development", "Employee retention",
                                 "Succession planning", "Business needs and resource allocation", "Performance improvement or disciplinary reasons",
                                 "Organizational restructuring"];
    this.Finyear();
    this.GetEmployee();
    this.GetTransferFrom();
    this.GetTransferTo();
    // this.GetAllDataBrowswe();
    // this.getReviewPeriod();
  }
  TabClick(e) {
    this.items = ["BROWSE", "CREATE",];
    this.buttonname = "Save";
    this.tabIndexToView = e.index;
    this.clearData();
  }
  clearData(){
    this.Spinner = false;
    this.seachSpinner = false;
    this.ObjEmpTransfer = new EmpTransfer();
    this.EmpTransferFormSubmitted = false;
    this.Transfer_Date = new Date();
    this.ObjEmpTransfer.Emp_Name = undefined;
    this.ObjEmpTransfer.Emp_Code = undefined;
    this.ObjEmpTransfer.DOJ = undefined;
    this.ObjEmpTransfer.Designation = undefined;
    this.ObjEmpTransfer.Department = undefined;
    this.file = false;
    this.upload = true;
    if (this.UploadFile) {
      this.UploadFile.clear();
    }
  }
  Finyear() {
    this.$http
      .get("Common/Get_Fin_Year_Date?Fin_Year_ID=" + this.$CompacctAPI.CompacctCookies.Fin_Year_ID)
      .subscribe((res: any) => {
      let data = JSON.parse(res)
     this.initDate =  [new Date(data[0].Fin_Year_Start) , new Date(data[0].Fin_Year_End)]
      });
  }
  GetEmployee(){
    this.EmployeeList = [];
      const obj = {
        "SP_String": "SP_HR_Txn_Employee_Transfer_Module",
        "Report_Name_String":"Get_Employee_List",
       }
       this.GlobalAPI.getData(obj).subscribe((data:any)=>{
        if(data.length){
          data.forEach((el:any) => {
            el['label'] = el.Emp_Name,
            el['value'] = el.Emp_ID
          });
          this.EmployeeList = data;
        }
        else {
          this.EmployeeList = [];
        }
      })
  }
  EmployeeDetails(){
    this.ObjEmpTransfer.Emp_Name = undefined;
    this.ObjEmpTransfer.Emp_Code = undefined;
    this.ObjEmpTransfer.DOJ = undefined;
    this.ObjEmpTransfer.Designation = undefined;
    this.ObjEmpTransfer.Department = undefined;
    if(this.ObjEmpTransfer.Emp_ID) {
      const objemployee = this.EmployeeList.filter(ele=> Number(ele.Emp_ID)===Number(this.ObjEmpTransfer.Emp_ID));
      this.ObjEmpTransfer.Emp_Name = objemployee.length ? objemployee[0].Emp_Name : undefined;
      this.ObjEmpTransfer.Emp_Code = objemployee.length ? objemployee[0].Emp_Code : undefined;
      this.ObjEmpTransfer.DOJ = objemployee.length ? this.DateService.dateConvert(new Date(objemployee[0].Emp_Joining_Dt)) : undefined;
      this.ObjEmpTransfer.Designation = objemployee.length ? objemployee[0].Designation : undefined;
      this.ObjEmpTransfer.Department = objemployee.length ? objemployee[0].Dept_Name : undefined;
    } 
  }
  GetTransferFrom(){
    this.TransferFromList = [];
      const obj = {
        "SP_String": "SP_HR_Txn_Employee_Transfer_Module",
        "Report_Name_String":"Get_Cost_Center",
       }
       this.GlobalAPI.getData(obj).subscribe((data:any)=>{
        this.TransferFromList = data;
      })
  }
  GetTransferTo(){
    this.TransferToList = [];
      const obj = {
        "SP_String": "SP_HR_Txn_Employee_Transfer_Module",
        "Report_Name_String":"Get_Cost_Center",
       }
       this.GlobalAPI.getData(obj).subscribe((data:any)=>{
        this.TransferToList = data;
      })
  }
  ClearUploadInpt(elem: any) {
    if (this.ObjEmpTransfer.File_Upload) {
      this.upload = true;
      this.ObjEmpTransfer.File_Upload = undefined;
    }
    else {
      this.UploadFile.clear();
      this.file = false;
    }
  }

  fileSelect() {
    this.file = true;
  }

  showDoc() {
    window.open(this.ObjEmpTransfer.File_Upload);
  }

  onBasicUpload(elem: any) {
    if (elem._files.length) {
      this.UploadDocApprove(elem);
    }
  }

  UploadDocApprove(elem: any) {
    const upfile = elem._files[0];
    // console.log('file elem', upfile);
    if (upfile['size']) {
      this.ngxService.start();
      this.GlobalAPI.CommonFileUpload(upfile)
        .subscribe((data: any) => {
          // console.log('upload response', data);
          this.ObjEmpTransfer.File_Upload = data.file_url;
          this.ngxService.stop();
          this.upload = false;
        })
    }
  }
  SaveTransfer(valid){
  this.EmpTransferFormSubmitted = true;
  this.Spinner = true;
    if (valid) {
      let repName: string = ""
      let msg: string = ""
      if (this.buttonname === "Update") {
        repName = "Update_HR_Txn_Employee_Transfer"
        msg = "Upadte"
      }
      else {
        repName = "Save_HR_Txn_Employee_Transfer"
        msg = "Save"
      }
      this.ObjEmpTransfer.Transfer_Date = this.DateService.dateConvert(new Date(this.Transfer_Date));
      this.ObjEmpTransfer.Created_By = this.$CompacctAPI.CompacctCookies.User_ID;
      // console.log('save obj', this, this.ObjAppraisal);
      const obj = {
        "SP_String": "SP_HR_Txn_Employee_Transfer_Module",
        "Report_Name_String": repName,
        "Json_Param_String": JSON.stringify([this.ObjEmpTransfer])
      }
      this.GlobalAPI.getData(obj).subscribe((data: any) => {
        // console.log('save res', data);

        if (data[0].Column1) {
          this.compacctToast.clear();
          this.compacctToast.add({
            key: "compacct-toast",
            severity: "success",
            summary: "Employee tranfer Form ",
            detail: "Succesfully " + msg
          });
          this.Spinner = false;
          this.GetSerarchBrowse();
          // this.tabIndexToView = 0;
          this.clearData();
        }
        else {
          this.compacctToast.clear();
          this.compacctToast.add({
            key: "compacct-toast",
            severity: "error",
            summary: "Error message",
            detail: "Somethig Went Wrong"
          });
        }
      });
    }
  }
  
  getDateRange(dateRangeObj) {
    if (dateRangeObj.length) {
      this.start_date = dateRangeObj[0];
      this.end_date = dateRangeObj[1];
    }
  }
  GetSerarchBrowse() {
    this.SerarchEmpTransferList = [];
    this.SerarchEmpTransferListHeader = [];
    this.seachSpinner = true;
    const start = this.start_date
      ? this.DateService.dateConvert(new Date(this.start_date))
      : this.DateService.dateConvert(new Date());
    const end = this.end_date
      ? this.DateService.dateConvert(new Date(this.end_date))
      : this.DateService.dateConvert(new Date());
      if (start && end) {
    const tempobj = {
      From_Date: start,
      To_Date: end,
    }
      const obj = {
        "SP_String": "SP_HR_Txn_Employee_Transfer_Module",
        "Report_Name_String": "Browse_HR_Txn_Employee_Transfer",
        "Json_Param_String": JSON.stringify([tempobj])
      }
      this.GlobalAPI.getData(obj).subscribe((data: any) => {
        console.log("SerarchEmpTransferList", data)
        this.SerarchEmpTransferList = data;
        this.SerarchEmpTransferListHeader = data.length ? Object.keys(data[0]): []
        this.seachSpinner = false;
      });
    }
  }
  onConfirm(){}
  onReject(){}

}
class EmpTransfer {
  Emp_ID: any;
  Emp_Name: any;
  Emp_Code: any;
  DOJ: any;
  Designation: any;
  Department: any;
  Transfer_From: any;
  Transfer_To: any;
  Transfer_Date: any;
  Status: any;
  Reason_For_Transfer: any;
  Any_Change_In_CTC: any;
  Remarks: any;
  File_Upload: any;
  Created_By: any;
}