import { Component, OnInit, ViewEncapsulation, ViewChild } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { MessageService } from "primeng/api";
import { FileUpload } from "primeng/primeng";
import { CompacctCommonApi } from "../../../shared/compacct.services/common.api.service";
import { CompacctHeader } from "../../../shared/compacct.services/common.header.service";
import { map, catchError } from 'rxjs/operators';
import { DateTimeConvertService } from "../../../shared/compacct.global/dateTime.service";
import { CompacctGlobalApiService } from "../../../shared/compacct.services/compacct.global.api.service";
@Component({
  selector: 'app-fins-browse-project',
  templateUrl: './fins-browse-project.component.html',
  styleUrls: ['./fins-browse-project.component.css'],
  providers: [MessageService],
  encapsulation: ViewEncapsulation.None
})
export class FinsBrowseProjectComponent implements OnInit {
  alldataList:any = []
  dialogModel:boolean = false
  dialogheader:string =""
  EngagmentLetter: any = undefined
  Type_of_eng: any = undefined;
  Letter2: any = undefined;
  SigningDate:Date = new Date()
  DynamicHeader:any =[]
  SubledgerList:any = []
  CourierDate:Date = new Date()
  userlist:any = []
  DistCustomer:any = []
  DistCustomerSelect:any = []

  DistConsultant:any = []
  DistConsultantSelect:any = []

  DistStatus:any = []
  DistStatusSelect:any = []

  DistEmployee:any = []
  DistEmployeeSelect: any = []
  
  cokiseId: any = undefined;
  backUPdataList; any = [];
  StatusList: any = [];
  AllPopForm: boolean = false;
  SelectEmp: any = undefined;
  SelectRemarksEmp: any = undefined;
  SelectStatus: any = undefined;
  SelectRemarkstatus: any = undefined;
  userid: any = undefined;
  statusId: any = undefined;
  projectId: any = undefined;
  LetterType: any = undefined;
  SelectRemarksE_letter: any = undefined;
  SelectRemarksFinal_Doc: any = undefined;
  SelectFinalDoc: any = undefined;
  FinalDocP: any = undefined;
  Signing_Date: any = undefined;
  viewList: any = [];
  ViewModel: boolean = false;
  constructor(
    private $http: HttpClient,
    private commonApi: CompacctCommonApi,
    private Header: CompacctHeader,
    private compacctToast: MessageService,
    private DateService: DateTimeConvertService,
    private GlobalAPI: CompacctGlobalApiService,
    public $CompacctAPI: CompacctCommonApi,
  ) { }

  ngOnInit() {
    this.Header.pushHeader({
      Header: "Create Browse",
      Link: "Create Browse"
    });
    this.cokiseId = this.$CompacctAPI.CompacctCookies.User_ID;
    this.getAllBrowse();
    this.getSubledger()
  }
  getAllBrowse() {
    this.alldataList = [];
    this.backUPdataList = [];
    const obj = {
      "SP_String": "SP_BL_Txn_Finshore_Project",
      "Report_Name_String": "Browse_Project",
       "Json_Param_String": JSON.stringify([{ Assigned_To: this.cokiseId }])
    }
    this.GlobalAPI.getData(obj).subscribe((data: any) => {
      if (data.length > 0) {
        this.alldataList = data;
        this.backUPdataList = data;
        this.DynamicHeader = Object.keys(data[0]);
        this.GetDistinct();
      }
    });
  }
  GetDistinct() {
    let Status: any = [];
    this.DistCustomer = [];
    this.DistConsultant = [];
    this.DistStatus = [];
    this.DistEmployee = [];
    this.alldataList.forEach((item) => {
      if (Status.indexOf(item.Sub_Ledger_Client) === -1) {
        Status.push(item.Sub_Ledger_Client);
        this.DistCustomer.push({ label: item.Sub_Ledger_Client, value: item.Sub_Ledger_Client });
      }
      if (Status.indexOf(item.Status_Name) === -1) {
        Status.push(item.Status_Name);
        this.DistStatus.push({ label: item.Status_Name, value: item.Status_Name });
      }
       if (Status.indexOf(item.Assign_To_Name) === -1) {
        Status.push(item.Assign_To_Name);
        this.DistEmployee.push({ label: item.Assign_To_Name, value: item.Assign_To_Name });
      }
      if (Status.indexOf(item.Sub_Ledger_Consultant) === -1) {
        Status.push(item.Sub_Ledger_Consultant);
        this.DistConsultant.push({ label: item.Sub_Ledger_Consultant, value: item.Sub_Ledger_Consultant });
      }    
    });
    this.backUPdataList = [...this.alldataList];
  }
  FilterDist() {
    let First: any = [];
    let Second: any = [];
    let three: any = [];
    let fore: any = [];
    let SearchFields: any = [];
    if (this.DistEmployeeSelect.length) {
      SearchFields.push('Assign_To_Name');
      First = this.DistEmployeeSelect;
    }
    if (this.DistStatusSelect.length) {
      SearchFields.push('Status_Name');
      Second = this.DistStatusSelect;
    }
    if (this.DistCustomerSelect.length) {
      SearchFields.push('Sub_Ledger_Client');
      three = this.DistCustomerSelect;
    }
     if (this.DistConsultantSelect.length) {
      SearchFields.push('Sub_Ledger_Consultant');
      fore = this.DistConsultantSelect;
    }
    this.alldataList = [];
    if (SearchFields.length) {
      let LeadArr = this.backUPdataList.filter(function (e) {
        return (First.length ? First.includes(e['Assign_To_Name']) : true)
          && (Second.length ? Second.includes(e['Status_Name']) : true)
          && (three.length ? three.includes(e['Sub_Ledger_Client']) : true)
          &&(fore.length ? fore.includes(e['Sub_Ledger_Consultant']) : true)
      });
      this.alldataList = LeadArr.length ? LeadArr : [];
    } else {
      this.alldataList = [...this.backUPdataList];
    }

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
        const FilterData = this.StatusList.filter((el: any) => el.Status_ID === this.statusId);
        this.SelectStatus = FilterData[0].Status_ID
      }
    });
  }
  onReject() {
    this.compacctToast.clear("c");
  }
  onConfirm(){}
  openDialog(col: any, field: any) {
    if (field == 'EMP Assigned To') {
    this.projectId = col.Project_ID;
    this.dialogheader = field;
    this.dialogModel = true;
    this.AllPopForm = false;
    this.userid = col.Assigned_To;
    this.SelectRemarksEmp = undefined;
    this.getuser()  
    }
    else if (field == 'Status') {
    this.projectId = col.Project_ID;
    this.dialogheader = field;
    this.dialogModel = true;
    this.AllPopForm = false;
    this.statusId = col.Status_ID;
    this.SelectRemarksEmp = undefined;
    this.getStatus(); 
    } 
    else if (field == 'Engagment Letter') {
    this.projectId = col.Project_ID;
    this.dialogheader = field;
    this.dialogModel = true;
    this.AllPopForm = false;
    this.LetterType = col.Engagement_Letter;
    this.Letter2 = col.Engagement_Letter_Type;
    this.EngagmentLetter = this.LetterType; 
    this.Type_of_eng = this.Letter2; 
    if (this.LetterType == 'N') {
     this.Type_of_eng = this.Letter2; 
    }  
    this.SelectRemarksE_letter = undefined;
    }
    else if (field == 'Final Doc') {
    this.projectId = col.Project_ID;
    this.dialogheader = field;
    this.dialogModel = true;
    this.AllPopForm = false;
    this.FinalDocP = col.Final_Doc;
    this.SelectFinalDoc = this.FinalDocP;  
    this.SelectRemarksFinal_Doc = undefined;
    }
    else if (field == 'Signing Date') { 
    this.projectId = col.Project_ID;
    this.dialogheader = field;
    this.dialogModel = true;
    this.AllPopForm = false;
    this.Signing_Date = this.DateService.dateConvert(col.Signning_Date);
    this.SigningDate = this.Signing_Date == null ? new Date() : this.Signing_Date ;  
    this.SelectRemarksFinal_Doc = undefined;
    }
  }
  UpdateAllPop(valid:any) {
    this.AllPopForm = true;
      if(!valid){
      return
    }
      else {
        var tempobj = {};
        if (this.dialogheader == 'EMP Assigned To') {
          const Filter1 = this.alldataList.filter((ele: any) => ele.Assigned_To === this.userid)
          const Filter2 = this.userlist.filter((el: any) => el.User_ID === this.SelectEmp)
           tempobj = {
            Project_ID: this.projectId,
            Project_Column: this.dialogheader,
            User_ID: this.cokiseId,
            Previous_Data: this.userid,
            Changed_To: this.SelectEmp,
            Previous_Data_Text: Filter1[0].Assign_To_Name,
            Changed_To_Text: Filter2[0].User_Name,
            Remarks: this.SelectRemarksEmp
          }
        }
        else if (this.dialogheader == 'Status') {
          const Filter1 = this.alldataList.filter((ele: any) => ele.Status_ID === this.statusId)
          const Filter2 = this.StatusList.filter((el: any) => el.Status_ID === this.SelectStatus)
           tempobj = {
            Project_ID: this.projectId,
            Project_Column: this.dialogheader,
            User_ID: this.cokiseId,
            Previous_Data: this.statusId,
            Changed_To: this.SelectStatus,
            Previous_Data_Text: Filter1[0].Status_Name,
            Changed_To_Text: Filter2[0].Status_Name,
            Remarks: this.SelectRemarkstatus
          }       
        }
        else if (this.dialogheader == 'Engagment Letter') {
           tempobj = {
            Project_ID: this.projectId,
            Project_Column: this.dialogheader,
            User_ID: this.cokiseId,
            Previous_Data: this.LetterType,
            Changed_To: this.EngagmentLetter,
            Next_Engagement_Letter_Type: this.Type_of_eng , 
            Previous_Data_Text: this.LetterType + " : " + this.Letter2,
            Previuos_Engagement_Letter_Type: this.Letter2,
            Changed_To_Text: this.EngagmentLetter +" : " + this.Type_of_eng ,
            Remarks: this.SelectRemarksE_letter
          }
        }
        else if (this.dialogheader == 'Final Doc') {
           tempobj = {
            Project_ID: this.projectId,
            Project_Column: this.dialogheader,
            User_ID: this.cokiseId,
            Previous_Data: this.FinalDocP,
            Changed_To: this.SelectFinalDoc,
            Previous_Data_Text: this.FinalDocP,
            Changed_To_Text:this.SelectFinalDoc,
            Remarks: this.SelectRemarksFinal_Doc
          }
        }
        else if (this.dialogheader == 'Signing Date') {
           tempobj = {
            Project_ID: this.projectId,
            Project_Column: this.dialogheader,
            User_ID: this.cokiseId,
            Previous_Data: this.Signing_Date,
            Previous_Data_Text :this.Signing_Date,
            Changed_To: this.DateService.dateConvert(this.SigningDate), 
            Changed_To_Text : this.DateService.dateConvert(this.SigningDate) 
          }
        }
         const Obj = {
            "SP_String": "SP_BL_Txn_Finshore_Project",
            "Report_Name_String": 'Update_Project_Column',
            "Json_Param_String": JSON.stringify([tempobj])
          }  
        
        this.GlobalAPI.getData(Obj).subscribe((data: any) => {
        if (data[0].Column1) {
          this.compacctToast.clear();
          this.compacctToast.add({
            key: "compacct-toast",
            severity: "success",
            summary: this.dialogheader,
            detail: "Succesfully Update "
          });
          this.dialogModel = false;
          this.AllPopForm = false;
          this.dialogheader = '';
          this.getAllBrowse();
          
        }
      })
        
    }
  }
  getSubledger(){
    this.$http.get("/Common/Get_Subledger_DR")
    .pipe(map((data:any) => data ? JSON.parse(data) : []))
    .subscribe((data:any)=>{
      this.SubledgerList = [...data]
    })
  }
  getuser() {
    this.userlist = [];
    const obj = {
      "SP_String": "SP_BL_Txn_Finshore_Project",
      "Report_Name_String": "Get_User_Name",
    }
    this.GlobalAPI.getData(obj).subscribe((data: any) => {
      if (data.length > 0) {
        this.userlist = data;
        const FilterData = this.userlist.filter((el: any) => el.User_ID === this.userid);
        this.SelectEmp =FilterData[0].User_ID;
      }
    });
  }
  GetView(col: any) {
    this.projectId = undefined;
    this.viewList = [];
    if (col.Project_ID) {
      this.projectId = col.Project_ID;
    const obj = {
      "SP_String": "SP_BL_Txn_Finshore_Project",
      "Report_Name_String": "Get_View_Log",
       "Json_Param_String": JSON.stringify([{ Project_ID: this.projectId }])
    }
    this.GlobalAPI.getData(obj).subscribe((data: any) => {
      if (data.length > 0) {
        this.viewList = data;
        setTimeout(() => {
        this.ViewModel =true  
        },200);       
      }
    });  
  } 
  }
  DataClear() {
    if (this.EngagmentLetter === 'N' || this.EngagmentLetter === undefined ) {
      this.Type_of_eng = undefined;  
    }
    if (this.EngagmentLetter === 'Y' || this.EngagmentLetter === undefined) {
      this.Type_of_eng = undefined;
    }
  }
}

