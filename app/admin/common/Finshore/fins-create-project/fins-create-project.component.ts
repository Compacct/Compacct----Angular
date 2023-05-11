import { Component, OnInit, ViewEncapsulation, ViewChild } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { MessageService } from "primeng/api";
import { FileUpload } from "primeng/primeng";
import { CompacctCommonApi } from "../../../shared/compacct.services/common.api.service";
import { CompacctHeader } from "../../../shared/compacct.services/common.header.service";
import { map, catchError } from 'rxjs/operators';
import { CompacctGlobalApiService } from "../../../shared/compacct.services/compacct.global.api.service";
import { DateTimeConvertService } from "../../../shared/compacct.global/dateTime.service";
@Component({
  selector: 'app-fins-create-project',
  templateUrl: './fins-create-project.component.html',
  styleUrls: ['./fins-create-project.component.css'],
  providers: [MessageService],
  encapsulation: ViewEncapsulation.None
})
export class FinsCreateProjectComponent implements OnInit {
  EngagmentDate: Date = new Date()
  ValuationDate: Date = new Date()
  buttonname: string = 'save'
  Spinner: boolean = false
  SubledgerList: any = []
  projectList: any = ["Valuation of Share", "Fairness Opinion", "Others"]
  purposeList: any = []
  ActList: any = []
  allList: any = [
    { Project_Type: "Valuation of Share", Purpose: "Allotment", Act: "Income Tax Act" },
    { Project_Type: "Valuation of Share", Purpose: "Transfer", Act: "FEMA" },
    { Project_Type: "Valuation of Share", Purpose: "ESOP Tax Perquisties", Act: "Co Act" },
    { Project_Type: "Valuation of Share", Purpose: "Internal", Act: "Internal" },
    { Project_Type: "Fairness Opinion", Purpose: "Marger", Act: "" },
    { Project_Type: "Fairness Opinion", Purpose: "Demerger", Act: "" },
    { Project_Type: "Fairness Opinion", Purpose: "ESOP", Act: "" },
    { Project_Type: "Others" },
  ]
  ConsultantList: any = [];
  selectStatus: any = undefined;
  selectAssigne: any = undefined;
  RemarksOne: any = undefined;
  UserList: any = [];
  StatusList: any = [];
  ViewStatusModal: boolean = false;
  CreateStatusModal: boolean = false;
  Create_Status: any = undefined;
  StatusFormSubmitted: boolean = false;
  StatusDelId: any = undefined;
  StatusDelName: any = undefined;
  CokiuserId: any = undefined;
  Objproject: project = new project();
  ProjectMainForm: boolean = false;
  constructor(
    private $http: HttpClient,
    private DateService: DateTimeConvertService,
    private Header: CompacctHeader,
    private compacctToast: MessageService,
    private GlobalAPI: CompacctGlobalApiService,
    public $CompacctAPI: CompacctCommonApi,

  ) { }

  ngOnInit() {
    this.Header.pushHeader({
      Header: "Create New Project",
      Link: "Create New Project"
    });
    this.CokiuserId = this.$CompacctAPI.CompacctCookies.User_ID;
    this.getSubledger();
    this.getConsultant();
    this.getUser();
    this.getStatus();
  }
  onReject() {
    this.compacctToast.clear("c");
    this.compacctToast.clear("d");
  }
  onConfirm() { }
  changeEngagment() {
  }
  getSubledger() {
    this.SubledgerList = [];
    const obj = {
      "SP_String": "SP_BL_Txn_Finshore_Project",
      "Report_Name_String": "Get_Client_Name",
    }
    this.GlobalAPI.getData(obj).subscribe((data: any) => {
      if (data.length > 0) {
        this.SubledgerList = data;
      }
    });
  }
  getConsultant() {
    this.ConsultantList = [];
    const obj = {
      "SP_String": "SP_BL_Txn_Finshore_Project",
      "Report_Name_String": "Get_Consultant_Name",
    }
    this.GlobalAPI.getData(obj).subscribe((data: any) => {
      if (data.length > 0) {
        this.ConsultantList = data;
      }
    });
  }
  getUser() {
    this.UserList = [];
    const obj = {
      "SP_String": "SP_BL_Txn_Finshore_Project",
      "Report_Name_String": "Get_User_Name",
    }
    this.GlobalAPI.getData(obj).subscribe((data: any) => {
      if (data.length > 0) {
        this.UserList = data;
      }
    });
  }
  getStatus() {
    this.StatusList = [];
    const obj = {
      "SP_String": "SP_BL_Txn_Finshore_Project",
      "Report_Name_String": "Get_Status_Name",
    }
    this.GlobalAPI.getData(obj).subscribe((data: any) => {
      if (data.length > 0) {
        this.StatusList = data;
      }
    });
  }
  ViewStatus() {
    this.ViewStatusModal = true;
  }
  deleteStatusLst(StDel: any) {
    this.StatusDelId = undefined;
    this.StatusDelName = undefined;
    if (StDel.Status_ID) {
      this.StatusDelId = StDel.Status_ID
      this.StatusDelName = StDel.Status_Name
      this.compacctToast.clear();
      this.compacctToast.add({
        key: "d",
        sticky: true,
        severity: "warn",
        summary: "Are you sure?",
        detail: "Confirm to proceed"
      });
    }
  }
  onCnfStatusDel() {
    if (this.StatusDelId) {
      const obj = {
        "SP_String": "SP_BL_Txn_Finshore_Project",
        "Report_Name_String": "Delete_Status",
        "Json_Param_String": JSON.stringify([{ Status_ID: this.StatusDelId, User_ID: this.CokiuserId }])
      }
      this.GlobalAPI.getData(obj).subscribe((data: any) => {
        if (data[0].Column1) {
          this.onReject();
          this.getStatus();
          this.compacctToast.clear();
          this.compacctToast.add({
            key: "compacct-toast",
            severity: 'error',
            summary: "Status:- " + this.StatusDelName,
            detail: "Succesfully Delete"
          });
          this.Objproject.Status_ID = undefined;
        }
      })
    }
  }
  StatusCreatPopup() {
    this.StatusFormSubmitted = false;
    this.CreateStatusModal = true;
    this.Create_Status = undefined;
  }
  CreateStatus(valid: any) {
    this.StatusFormSubmitted = true;
    if (valid) {
      const tempSave = {
        Status_Name: this.Create_Status,
      }
      const obj = {
        "SP_String": "SP_BL_Txn_Finshore_Project",
        "Report_Name_String": "Create_Status",
        "Json_Param_String": JSON.stringify([tempSave])
      }
      this.GlobalAPI.postData(obj).subscribe((data: any) => {
        if (data[0].Column1) {
          this.compacctToast.clear();
          this.compacctToast.add({
            key: "compacct-toast",
            severity: "success",
            summary: "Status Name:- " + this.Create_Status,
            detail: "Succesfully Created"
          });
          this.getStatus();
          this.StatusFormSubmitted = false;
          this.CreateStatusModal = false;
        }
      })
    }
  }
  changeProject(value: any) {
    this.purposeList = []
    this.Objproject.Project_Purpose = undefined
    this.Objproject.Project_Act = undefined
    let FilterallList = this.allList.filter((el: any) => el.Project_Type == value)
    FilterallList.forEach((ele: any) => {
      if (ele.Purpose) {
        this.purposeList.push(ele.Purpose)
      }
    });
  }
  changePurpose(value: any) {
    //console.log("v")
    this.ActList = []
    this.Objproject.Project_Act = undefined
    let FilterallList = this.allList.filter((el: any) => el.Purpose == value)
    FilterallList.forEach((ele: any) => {
      if (ele.Act) {
        this.ActList.push(ele.Purpose)
      }
    });
  }
  SaveProject(valid: any) {
    this.ProjectMainForm = true;
    if (!valid) {
      return
    }
    else {
      this.Objproject.Engagement_Letter_Date = this.DateService.dateConvert(this.EngagmentDate);
      this.Objproject.Valuation_Date = this.DateService.dateConvert(this.ValuationDate);
      this.Objproject.User_ID = this.CokiuserId
      const obj = {
        "SP_String": "SP_BL_Txn_Finshore_Project",
        "Report_Name_String": 'Create_Project',
        "Json_Param_String": JSON.stringify([this.Objproject])
      }
      this.GlobalAPI.getData(obj).subscribe((data: any) => {
        if (data[0].Column1) {
          this.compacctToast.clear();
          this.compacctToast.add({
            key: "compacct-toast",
            severity: "success",
            summary: "Project Save",
            detail: "Succesfully "
          });
          this.ProjectMainForm = false;
          this.Objproject = new project();
        }
      })
    }
  }
}
class project{                 
Sub_Ledger_ID_Client :any;	          
Sub_Ledger_ID_Consultant :any;	       
Engagement_Letter :any;	             
Engagement_Letter_Date :any;	                
Project_Detalis :any;	                   
Project_Purpose :any;	                      
Project_Act :any;                    	  
Valuation_Date :any;	                 
Bill_To :any;	                             
Assigned_To :any;	                        
Status_ID: any;	
Remarks: any;  
User_ID :any;	                    
}
