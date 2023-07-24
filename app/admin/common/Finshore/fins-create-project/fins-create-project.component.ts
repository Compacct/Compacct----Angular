import { Component, OnInit, ViewEncapsulation, ViewChild } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { MessageService } from "primeng/api";
import { FileUpload } from "primeng/primeng";
import { CompacctCommonApi } from "../../../shared/compacct.services/common.api.service";
import { CompacctHeader } from "../../../shared/compacct.services/common.header.service";
import { map, catchError } from 'rxjs/operators';
import { CompacctGlobalApiService } from "../../../shared/compacct.services/compacct.global.api.service";
import { DateTimeConvertService } from "../../../shared/compacct.global/dateTime.service";
import { valHooks } from "jquery";
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
  projectList: any = ["Valuation of Share", "Fairness Opinion","AIF","Addendum","Others"]
  purposeList: any = []
  ActList: any = []
  allList: any = [
    { Project_Type: "Valuation of Share", Purpose: "Allotment"},
    { Project_Type: "Valuation of Share", Purpose: "Transfer"},
    { Project_Type: "Valuation of Share", Purpose: "Allotment & Transfer"},
    { Project_Type: "Valuation of Share", Purpose: "ESOP Tax Perquisties"},
    { Project_Type: "Valuation of Share", Purpose: "Internal"},
    { Project_Type: "Valuation of Share", Purpose: "Others"},
    { Project_Type: "Fairness Opinion", Purpose: "Marger"},
    { Project_Type: "Fairness Opinion", Purpose: "Demerger"},
    { Project_Type: "Fairness Opinion", Purpose: "ESOP" },
    { Project_Type: "Fairness Opinion", Purpose: "Others" },
    { Project_Type: "AIF", Purpose: "Valuation of Units" },
    { Project_Type: "AIF", Purpose: "Due Diligence" },
    { Project_Type: "AIF", Purpose: "Certificate" },
    { Project_Type: "AIF", Purpose: "Others" },
    { Project_Type: "Addendum"},
    { Project_Type: "Others" },
  ]
  AllList2:any = [
    { Project_Type: "Valuation of Share",  Act:"Income Tax Act"},
    { Project_Type: "Valuation of Share", Act:"FEMA"},
    { Project_Type: "Valuation of Share", Act:"FEMA-ODI"},
    { Project_Type: "Valuation of Share", Act:"Companies Act"},
    { Project_Type: "Valuation of Share", Act:"Others"},,
  ]
   AllList3:any = [
   { Project_Type: "Valuation of Share",  Method:"NAV" },
    { Project_Type: "Valuation of Share", Method:"DCF"},
    { Project_Type: "Valuation of Share", Method:"CCM"},
    { Project_Type: "Valuation of Share", Method:"CTM"},
    { Project_Type: "Valuation of Share", Method:"PORI"},
    { Project_Type: "Valuation of Share", Method: "90/10" },
    { Project_Type: "Valuation of Share", Method: "AVERAGE" },
    { Project_Type: "Valuation of Share", Method:"Others"},

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
  MethodList: any = [];
  InputFiled1: boolean = false;
  SelectedProjectAct: any = [];
  SelectedMethod: any = [];
  InputFiled2: boolean = false;
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
      "Report_Name_String": "Get_Status_Name_without_completed",
    }
    this.GlobalAPI.getData(obj).subscribe((data: any) => {
      if (data.length > 0) {
        this.StatusList = data;
      }
    });
  }
  changeProject(value: any) {
    this.purposeList = [];
    this.SelectedProjectAct = [];
    this.SelectedMethod = [];
    this.InputFiled1 = false;
    this.InputFiled2 = false;
    this.Objproject.Project_Purpose = undefined;
    this.Objproject.Project_Act = undefined;
    this.Objproject.Method = undefined;
    let FilterallList = this.allList.filter((el: any) => el.Project_Type == value)
    FilterallList.forEach((ele: any) => {
      if (ele.Purpose) {
        this.purposeList.push(ele.Purpose)
      }
    });
    this.changePurpose(value)
    this.changeMethod(value)  
  }
  changePurpose(value: any) {
    //console.log("v")
    this.ActList = []
    this.Objproject.Project_Act = undefined
    this.ActList = this.AllList2.filter((el: any) => el.Project_Type == value);
    // console.log(this.ActList)
    this.ActList.forEach((ele: any) => {
      if (ele.Act) {
        ele['label'] = ele.Act,
        ele['value'] = ele.Act
      }
    });
  }
  changeMethod(value: any) {
    //console.log("v")
    this.MethodList = []
    this.Objproject.Project_Act = undefined
    this.MethodList = this.AllList3.filter((el: any) => el.Project_Type == value);
    // console.log(this.MethodList)
    this.MethodList.forEach((ele: any) => {
      if (ele.Method) {
        ele['label'] = ele.Method,
        ele['value'] = ele.Method
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
      this.Objproject.User_ID = this.CokiuserId;
      this.Objproject.Project_Act = this.SelectedProjectAct.length ? this.SelectedProjectAct.toString() : this.Objproject.Project_Act;
      this.Objproject.Method = this.SelectedMethod.length ? this.SelectedMethod.toString() : this.Objproject.Method;
     //console.log('this.Objproject',this.Objproject)
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
          this.SelectedProjectAct = [];
          this.SelectedMethod = [];
          this.InputFiled1 = false;
          this.InputFiled2 = false;
          this.ActList = [];
          this.MethodList = [];
        }
      })
    }
  }
  getOtherInp() {
    this.Objproject.Project_Purpose_Others = undefined;
  }
  ActOtherInp() {
    this.InputFiled1 = true
     this.Objproject.Project_Act_Others = undefined;  
      if (this.SelectedProjectAct.indexOf('Others') === -1) {
      this.InputFiled1 = false
      }  
  } 
  MethodOtherInp() {
    this.InputFiled2 = true
     this.Objproject.Method_Others = undefined;  
      if (this.SelectedMethod.indexOf('Others') === -1) {
      this.InputFiled2 = false
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
User_ID: any;	
Method: any;
Project_Purpose_Others: any;
Project_Act_Others: any;
Method_Others: any;
Bill_To_PI_Amount: any;
Payment_Status: any;
}
