import { Component, OnInit, ViewEncapsulation, ViewChild, ElementRef } from "@angular/core";
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
  DistCustomerSelect: any = []
  DistCustomer1:any = []
  DistCustomerSelect1:any = []

  DistConsultant:any = []
  DistConsultantSelect: any = []
  DistConsultant1:any = []
  DistConsultantSelect1:any = []

  DistStatus:any = []
  DistStatusSelect: any = []
  DistStatus1:any = []
  DistStatusSelect1:any = []

  DistEmployee:any = []
  DistEmployeeSelect: any = []
  DistEmployee1:any = []
  DistEmployeeSelect1: any = []
  tabIndexToView: number = 0;
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
  SelectReportShr: any = undefined;
  Pveus_Report_Shr: any = undefined;
  SelectClientName: any = undefined;
  bckupCilint: any = undefined;
  bckupCurDate: any = undefined;
  items: any = [];
  completedList: any = [];
  DynamicHeaderCompleted: any = [];
  backUPdataListCompleted: any = [];
  SelectBill_To: any = undefined;
  PIDate: Date = new Date();
  SelectPIno:any = undefined;
  SelectPIAmt: any = undefined;
  PvbBillto:any =undefined;
  PvbDatebill:any =undefined;

  rindex:any = undefined
  fieldname:string = ""
  abData:any
  @ViewChild('dtTr',{read: ElementRef,static:false}) table:ElementRef
  //@ViewChild('wanted', {read: ElementRef}) myWantedChild: ElementRef;

  DistEmployeeTwo:any = [];
  DistStatusTwo:any = [];
  DistCustomerTwo:any = [];
  DistConsultantTwo:any = [];

  DistEmployeeSelectTwo: any = [];
  DistStatusSelectTwo: any = [];
  DistCustomerSelectTwo: any = [];
  DistConsultantSelectTwo: any = [];

  alldataListTwo: any=[];
  DynamicHeaderTwo: any=[];
  backUPalldataListTwo: any=[];
  selectedValue:any=undefined;

  dialogInvoice:boolean=false;
  PiList:any=[];
  BrowseData:any=[];

  UpdatePIFormSubmitted:boolean=false;
  PISpinner:boolean=false;
  PI_Date: Date = new Date();
  PiName:any=undefined;

  UpdateInvFormSubmitted:boolean=false;
  InvSpinner:boolean=false;
  Inv_Date: Date = new Date();
  InvName:any=undefined;
  
  UpdatePaymentFormSubmitted:boolean=false;
  PaymentSpinner:boolean=false;
  TotalAmt:any=undefined;
  PaidAmt:any=undefined;
  PendingAmt:any=undefined;
  PaymentList:any=[];
  UPmtSpinner:boolean=false;

  Amountt:number=0;
  TDSS:number=0;
  NetPayment:number=0;

  objUpdateInvoice = new UpdateInvoice();
  objUpdatePI = new UpdatePI();
  objUpdatePayment = new UpdatePayment();
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
    this.items =['UPDATE','INVOICE/PAYMENT']
    this.Header.pushHeader({
      Header: "Browse",
      Link: "Track Project"
    });
    this.cokiseId = this.$CompacctAPI.CompacctCookies.User_ID;
    this.PiList=['Customer','Consultant'];
    this.getAllBrowse();
    this.getSubledger();
    this.getAllBrowseCompled();
  }
  TabClick(e) {
    this.tabIndexToView = e.index;
    this.items =['UPDATE','INVOICE/PAYMENT']
    this.ClearData();
    this.getAllBrowse();
  }
  ClearData(){
    this.DistEmployeeSelect=[];
    this.DistStatusSelect = [];
    this.DistCustomerSelect = [];
    this.DistConsultantSelect = [];

    this.selectedValue=undefined;
    this.alldataListTwo = [];
    this.backUPalldataListTwo = [];
    this.DynamicHeaderTwo=[];

    this.DistEmployeeSelectTwo = [];
    this.DistStatusSelectTwo = [];
    this.DistCustomerSelectTwo = [];
    this.DistConsultantSelectTwo = [];
  }
  getAllBrowse() {

    this.alldataList = [];
    this.backUPdataList = [];
    const obj = {
      "SP_String": "SP_BL_Txn_Finshore_Project",
      "Report_Name_String": "Browse_Project",
       "Json_Param_String": JSON.stringify([{ Assigned_To: this.cokiseId }])
    }
    this.abData = this.GlobalAPI.getData(obj)
    this.GlobalAPI.getData(obj).subscribe((data: any) => {
      if (data.length > 0) {
        this.alldataList = data;
        this.backUPdataList = data;
        this.DynamicHeader = Object.keys(data[0]);
        this.GetDistinct();
        // console.log('getAllBrowse',this.alldataList);
        // console.log('DynamicHeader',this.DynamicHeader);
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
  getAllBrowseCompled() {
    this.completedList = [];
    this.backUPdataListCompleted = [];
    const obj = {
      "SP_String": "SP_BL_Txn_Finshore_Project",
      "Report_Name_String": "Browse_Project_Completed",
       "Json_Param_String": JSON.stringify([{ Assigned_To: this.cokiseId }])
    }
    this.GlobalAPI.getData(obj).subscribe((data: any) => {
      if (data.length > 0) {
        this.completedList = data;
        this.backUPdataListCompleted = data;
        this.DynamicHeaderCompleted = Object.keys(data[0]);
        this.GetDistinct1();
      }
    });
  }
  GetDistinct1() {
    let Status: any = [];
    this.DistCustomer1 = [];
    this.DistConsultant1 = [];
    this.DistStatus1 = [];
    this.DistEmployee1 = [];
    this.completedList.forEach((item) => {
      if (Status.indexOf(item.Sub_Ledger_Client) === -1) {
        Status.push(item.Sub_Ledger_Client);
        this.DistCustomer1.push({ label: item.Sub_Ledger_Client, value: item.Sub_Ledger_Client });
      }
      if (Status.indexOf(item.Status_Name) === -1) {
        Status.push(item.Status_Name);
        this.DistStatus1.push({ label: item.Status_Name, value: item.Status_Name });
      }
       if (Status.indexOf(item.Assign_To_Name) === -1) {
        Status.push(item.Assign_To_Name);
        this.DistEmployee1.push({ label: item.Assign_To_Name, value: item.Assign_To_Name });
      }
      if (Status.indexOf(item.Sub_Ledger_Consultant) === -1) {
        Status.push(item.Sub_Ledger_Consultant);
        this.DistConsultant1.push({ label: item.Sub_Ledger_Consultant, value: item.Sub_Ledger_Consultant });
      }    
    });
    this.backUPdataListCompleted = [...this.completedList];
  }
  FilterDist1() {
    let First: any = [];
    let Second: any = [];
    let three: any = [];
    let fore: any = [];
    let SearchFields: any = [];
    if (this.DistEmployeeSelect1.length) {
      SearchFields.push('Assign_To_Name');
      First = this.DistEmployeeSelect1;
    }
    if (this.DistStatusSelect1.length) {
      SearchFields.push('Status_Name');
      Second = this.DistStatusSelect1;
    }
    if (this.DistCustomerSelect1.length) {
      SearchFields.push('Sub_Ledger_Client');
      three = this.DistCustomerSelect1;
    }
     if (this.DistConsultantSelect1.length) {
      SearchFields.push('Sub_Ledger_Consultant');
      fore = this.DistConsultantSelect1;
    }
    this.completedList = [];
    if (SearchFields.length) {
      let LeadArr = this.backUPdataListCompleted.filter(function (e) {
        return (First.length ? First.includes(e['Assign_To_Name']) : true)
          && (Second.length ? Second.includes(e['Status_Name']) : true)
          && (three.length ? three.includes(e['Sub_Ledger_Client']) : true)
          &&(fore.length ? fore.includes(e['Sub_Ledger_Consultant']) : true)
      });
      this.completedList = LeadArr.length ? LeadArr : [];
    } else {
      this.completedList = [...this.backUPdataListCompleted];
    }

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
        const FilterData = this.StatusList.filter((el: any) => el.Status_ID === this.statusId);
        this.SelectStatus = FilterData[0].Status_ID
      }
    });
  }
  onReject() {
    this.compacctToast.clear("c");
  }
  onConfirm(){}
  openDialog(col: any, field: any,index?:any) {
    this.rindex = index
    console.log(this.rindex)
    this.fieldname = field
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
    this.Signing_Date = col.Signning_Date;
    this.SigningDate = this.Signing_Date == null ? new Date() : this.Signing_Date ;  
    }
    else if (field == 'Report Shared') { 
    this.projectId = col.Project_ID;
    this.dialogheader = field;
    this.dialogModel = true;
    this.AllPopForm = false; 
    this.Pveus_Report_Shr = col.Report_Shared
    this.SelectReportShr = this.Pveus_Report_Shr
    }
    else if (field == 'Courier Detalis To' || field == 'Courier Detalis Date' ) { 
    this.projectId = col.Project_ID;
    this.dialogheader = field;
    this.dialogModel = true;
    this.AllPopForm = false;
    this.bckupCilint = col.Courier_Details_To;
    this.bckupCurDate = col.Courier_Details_Date
    this.SelectClientName = this.bckupCilint 
    this.CourierDate = this.bckupCurDate == null ? new Date() : this.bckupCurDate   
    }
    else if (field == 'Bill To' || field == 'Bill PI No' || field == 'Bill PI Date' || field == 'Bill PI Amt') { 
    this.projectId = col.Project_ID;
    this.dialogheader = field;
    this.dialogModel = true;
      this.AllPopForm = false; 
      this.PvbBillto = col.Bill_To;
      this.PvbDatebill = col.Bill_To_PI_Date
      this.SelectBill_To = this.PvbBillto;
      this.PIDate = this.PvbDatebill == null ? new Date() : this.PvbDatebill;
      this.SelectPIAmt = col.Bill_To_PI_Amount;
      this.SelectPIno = col.Bill_To_PI_No;
    }
  }
  UpdateAllPop(valid:any) {
    this.AllPopForm = true;
      if(!valid){
      return
    }
      else {
        var tempobj:any = {};
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
          this.alldataList[this.rindex].Assigned_To = tempobj.Changed_To
          this.alldataList[this.rindex].Assign_To_Name =  tempobj.Changed_To_Text
        
          
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
          console.log(tempobj)
          this.alldataList[this.rindex].Status_ID = this.SelectStatus
          this.alldataList[this.rindex].Status_Name = Filter2[0].Status_Name
          console.log(this.alldataList)
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
          this.alldataList[this.rindex].Engagement_Letter = this.EngagmentLetter
          this.alldataList[this.rindex].Engagement_Letter_Type = this.Type_of_eng
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
          this.alldataList[this.rindex].Final_Doc = this.SelectFinalDoc
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
          this.alldataList[this.rindex].Signning_Date = this.SigningDate
        }
        else if (this.dialogheader == 'Report Shared') {
           tempobj = {
            Project_ID: this.projectId,
            Project_Column: this.dialogheader,
            User_ID: this.cokiseId,
            Previous_Data: this.Pveus_Report_Shr,
            Previous_Data_Text :this.Pveus_Report_Shr,
            Changed_To: this.SelectReportShr, 
            Changed_To_Text : this.SelectReportShr 
          }
          this.alldataList[this.rindex].Report_Shared = this.SelectReportShr
        }
        else if (this.dialogheader == 'Courier Detalis To' || this.dialogheader == 'Courier Detalis Date' ) {
           tempobj = {
            Project_ID: this.projectId,
            Project_Column: this.dialogheader,
            User_ID: this.cokiseId,
            Courier_Details_To: this.SelectClientName,
						Courier_Details_Date: this.DateService.dateConvert( this.CourierDate),	        	
						Previous_Courier_Details_To: this.bckupCilint,	              							
						Previous_Courier_Details_Date: this.DateService.dateConvert(this.bckupCurDate)
            
          }
          this.alldataList[this.rindex].Courier_Details_To = this.SelectClientName
          this.alldataList[this.rindex].Courier_Details_Date = this.CourierDate
          const Obj = {
            "SP_String": "SP_BL_Txn_Finshore_Project",
            "Report_Name_String": 'Update_Courier_Detalis',
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
          //this.getAllBrowse(); 
            }
        })
          return
        }
        else if ( this.dialogheader == 'Bill To' || this.dialogheader == 'Bill PI No' || this.dialogheader == 'Bill PI Date' || this.dialogheader == 'Bill PI Amt') {
           tempobj = {
            Project_ID: this.projectId,
            Project_Column: this.dialogheader,
            User_ID: this.cokiseId,
            Bill_To: this.SelectBill_To,
            Bill_To_PI_No: this.SelectPIno, 
            Bill_To_PI_Date: this.DateService.dateConvert(this.PIDate),
            Bill_To_PI_Amount: this.SelectPIAmt,        	
						Previous_Bill_To: this.PvbBillto,	              							
            Previous_Bill_To_PI_Date: this.DateService.dateConvert(this.PvbDatebill) 	                     																  
          }
          this.alldataList[this.rindex].Bill_To = this.SelectBill_To
          this.alldataList[this.rindex].Bill_To_PI_No = this.SelectPIno
          this.alldataList[this.rindex].Bill_To_PI_Date = this.PIDate
          this.alldataList[this.rindex].Bill_To_PI_Amount = this.SelectPIAmt
          const Obj = {
            "SP_String": "SP_BL_Txn_Finshore_Project",
            "Report_Name_String": 'Update_Bill_To',
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
          //this.getAllBrowse();       
            }
        })
          return
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
          if (this.SelectStatus === 8) {
            this.dialogModel = false;
            this.AllPopForm = false;
            this.dialogheader = '';
            //this.getAllBrowse();
            this.FilterDist();
            this.GetDistinct();
            this.tabIndexToView = 1
            this.getAllBrowseCompled(); 
          } else {
              this.dialogModel = false;
              this.AllPopForm = false;
              this.dialogheader = '';
             // this.getAllBrowse(); 
          }

          
        }
      })
        
    }
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
  trackByFn(index: number, item: any): any {
   return item.Project_ID; // Assuming 'id' is a unique identifier in your data
  }

  FilterDistTwo(){
    let First: any = [];
    let Second: any = [];
    let three: any = [];
    let fore: any = [];
    let SearchFields: any = [];
    if (this.DistEmployeeSelectTwo.length) {
      SearchFields.push('Assign_To_Name');
      First = this.DistEmployeeSelectTwo;
    }
    if (this.DistStatusSelectTwo.length) {
      SearchFields.push('Status_Name');
      Second = this.DistStatusSelectTwo;
    }
    if (this.DistCustomerSelectTwo.length) {
      SearchFields.push('Sub_Ledger_Client');
      three = this.DistCustomerSelectTwo;
    }
     if (this.DistConsultantSelectTwo.length) {
      SearchFields.push('Sub_Ledger_Consultant');
      fore = this.DistConsultantSelectTwo;
    }
    this.alldataListTwo = [];
    if (SearchFields.length) {
      let LeadArr = this.backUPalldataListTwo.filter(function (e) {
        return (First.length ? First.includes(e['Assign_To_Name']) : true)
          && (Second.length ? Second.includes(e['Status_Name']) : true)
          && (three.length ? three.includes(e['Sub_Ledger_Client']) : true)
          &&(fore.length ? fore.includes(e['Sub_Ledger_Consultant']) : true)
      });
      this.alldataListTwo = LeadArr.length ? LeadArr : [];
    } else {
      this.alldataListTwo = [...this.backUPalldataListTwo];
    }

  }
  GetDistinctTwo(){
    let Status: any = [];
    this.DistCustomerTwo = [];
    this.DistConsultantTwo = [];
    this.DistStatusTwo = [];
    this.DistEmployeeTwo = [];
    this.alldataListTwo.forEach((item) => {
      if (Status.indexOf(item.Sub_Ledger_Client) === -1) {
        Status.push(item.Sub_Ledger_Client);
        this.DistCustomerTwo.push({ label: item.Sub_Ledger_Client, value: item.Sub_Ledger_Client });
      }
      if (Status.indexOf(item.Status_Name) === -1) {
        Status.push(item.Status_Name);
        this.DistStatusTwo.push({ label: item.Status_Name, value: item.Status_Name });
      }
       if (Status.indexOf(item.Assign_To_Name) === -1) {
        Status.push(item.Assign_To_Name);
        this.DistEmployeeTwo.push({ label: item.Assign_To_Name, value: item.Assign_To_Name });
      }
      if (Status.indexOf(item.Sub_Ledger_Consultant) === -1) {
        Status.push(item.Sub_Ledger_Consultant);
        this.DistConsultantTwo.push({ label: item.Sub_Ledger_Consultant, value: item.Sub_Ledger_Consultant });
      }    
    });
    this.backUPalldataListTwo = [...this.alldataListTwo];
  }
  getData(){
    console.log('selectedValue',this.selectedValue);
    this.alldataListTwo = [];
    this.backUPalldataListTwo = [];
    this.DynamicHeaderTwo=[];

    if(this.selectedValue=='All'){
      const obj = {
        "SP_String": "SP_BL_Txn_Finshore_Project_Invoice",
        "Report_Name_String": "Browse_Project_All",
        "Json_Param_String": JSON.stringify([{ Assigned_To: this.cokiseId }])
      }
      this.GlobalAPI.getData(obj).subscribe((data: any) => {
        if (data.length > 0) {
          this.alldataListTwo = data;
          this.backUPalldataListTwo = data;
          this.DynamicHeaderTwo = Object.keys(data[0]);
          this.GetDistinctTwo();
          console.log('getData All',this.alldataListTwo);
          console.log('DynamicHeader All',this.DynamicHeaderTwo);
        }
      });
    }
    else if(this.selectedValue=='Invoice Pending'){
      const obj = {
        "SP_String": "SP_BL_Txn_Finshore_Project_Invoice",
        "Report_Name_String": "Browse_Project_Invoice_Pending",
        "Json_Param_String": JSON.stringify([{ Assigned_To: this.cokiseId }])
      }
      this.GlobalAPI.getData(obj).subscribe((data: any) => {
        if (data.length > 0) {
          this.alldataListTwo = data;
          this.backUPalldataListTwo = data;
          this.DynamicHeaderTwo = Object.keys(data[0]);
          this.GetDistinctTwo();
          console.log('getData All',this.alldataListTwo);
          console.log('DynamicHeader All',this.DynamicHeaderTwo);
        }
      });
    }
    else if(this.selectedValue=='Payment Pending'){
      const obj = {
        "SP_String": "SP_BL_Txn_Finshore_Project_Invoice",
        "Report_Name_String": "Browse_Project_Payment_Pending",
        "Json_Param_String": JSON.stringify([{ Assigned_To: this.cokiseId }])
      }
      this.GlobalAPI.getData(obj).subscribe((data: any) => {
        if (data.length > 0) {
          this.alldataListTwo = data;
          this.backUPalldataListTwo = data;
          this.DynamicHeaderTwo = Object.keys(data[0]);
          this.GetDistinctTwo();
          console.log('getData All',this.alldataListTwo);
          console.log('DynamicHeader All',this.DynamicHeaderTwo);
        }
      });
    }
  }
  UpdateData(col: any) {
    this.objUpdatePI=new UpdatePI();
    this.PiName=undefined;

    this.objUpdateInvoice=new UpdateInvoice();
    this.InvName=undefined;

    this.BrowseData=[];
    this.dialogInvoice=true;
    this.BrowseData=col;
    console.log('BrowseData',this.BrowseData);
    

    this.objUpdatePI.Bill_To_PI_No=this.BrowseData.Bill_To_PI_No;
    this.PI_Date=this.BrowseData.Bill_To_PI_Date ? this.BrowseData.Bill_To_PI_Date : new Date();
    this.objUpdatePI.Bill_To_PI_Amount=this.BrowseData.Bill_To_PI_Amount;
    this.objUpdatePI.Previous_Bill_To=this.BrowseData.Bill_To;
    this.objUpdatePI.Previous_Bill_To_PI_Date=this.BrowseData.Bill_To_PI_Date ? this.DateService.dateConvert(this.BrowseData.Bill_To_PI_Date) : null;
    this.objUpdatePI.Bill_To=this.BrowseData.Bill_To;
    this.PI_Cust_Cons_change();

    this.objUpdateInvoice.Invoice_No=this.BrowseData.Invoice_No;
    this.Inv_Date=this.BrowseData.Invoice_Date ? this.BrowseData.Invoice_Date : new Date();
    this.objUpdateInvoice.Invoice_Amount=this.BrowseData.Invoice_Amount;
    this.objUpdateInvoice.Previous_Invoice_To=this.BrowseData.Invoice_To;
    this.objUpdateInvoice.Previous_Invoice_Date=this.BrowseData.Invoice_Date ? this.DateService.dateConvert(this.BrowseData.Invoice_Date) : null;
    this.objUpdateInvoice.Invoice_To=this.BrowseData.Invoice_To;
    this.Inv_Cust_Cons_change();

    this.TotalAmt=this.BrowseData.Invoice_Amount;
    this.PaidAmt=this.BrowseData.total_Paid_Net_Amount;
    this.PendingAmt=Number(this.TotalAmt)-Number(this.PaidAmt);
    
    this.getPaymentList(this.BrowseData.Project_ID);
  }
  PI_Cust_Cons_change(){
    this.PiName=undefined;
    this.objUpdatePI.Bill_To_Sub_Ledger_ID=undefined;
    if(this.objUpdatePI.Bill_To == 'Customer'){
      this.PiName=this.BrowseData.Sub_Ledger_Client;
      this.objUpdatePI.Bill_To_Sub_Ledger_ID=this.BrowseData.Sub_Ledger_ID_Client;
    }
    else if(this.objUpdatePI.Bill_To == 'Consultant'){
      this.PiName=this.BrowseData.Sub_Ledger_Consultant;
      this.objUpdatePI.Bill_To_Sub_Ledger_ID=this.BrowseData.Sub_Ledger_ID_Consultant;
    }
  }
  Update_PI(valid:any){
    console.log('BrowseData',this.BrowseData);
    this.UpdatePIFormSubmitted = true;
    console.log('UpdatePIFormSubmitted',valid);
    if(valid){
      this.PISpinner = true;

      this.objUpdatePI.Project_ID=this.BrowseData.Project_ID;
      this.objUpdatePI.Bill_To_PI_Date=this.PI_Date ? this.DateService.dateConvert(this.PI_Date) : null;
      this.objUpdatePI.User_ID=this.cokiseId;

      console.log('this.objUpdatePI',this.objUpdatePI);
      const PIobj = {
        "SP_String": "SP_BL_Txn_Finshore_Project_Invoice",
        "Report_Name_String": "Update_PI",
        "Json_Param_String": JSON.stringify([this.objUpdatePI])
      }
      this.GlobalAPI.postData(PIobj).subscribe((data:any) => {
        console.log('data res', data);
        if(data[0].Column1){
          this.UpdatePIFormSubmitted=false;
          this.PISpinner=false;
          this.getData();
          this.compacctToast.clear();
          this.compacctToast.add({
            key: "compacct-toast",
            severity: "success",
            summary: "PI",
            detail: "Succesfully Updated"
          });
        }
        else {
          this.PISpinner=false;
          this.compacctToast.clear();
          this.compacctToast.add({
            key: "compacct-toast",
            severity: "error",
            summary: "Error",
            detail: "Something Went Wrong"
          });
        }
      });
    }
  }
  Inv_Cust_Cons_change(){
    this.InvName=undefined;
    this.objUpdateInvoice.Invoice_To_Sub_Ledger_ID=undefined;
    if(this.objUpdateInvoice.Invoice_To == 'Customer'){
      this.InvName=this.BrowseData.Sub_Ledger_Client;
      this.objUpdateInvoice.Invoice_To_Sub_Ledger_ID=this.BrowseData.Sub_Ledger_ID_Client;
    }
    else if(this.objUpdateInvoice.Invoice_To == 'Consultant'){
      this.InvName=this.BrowseData.Sub_Ledger_Consultant;
      this.objUpdateInvoice.Invoice_To_Sub_Ledger_ID=this.BrowseData.Sub_Ledger_ID_Consultant;
    }
  }
  Update_Inv(valid:any){
    console.log('BrowseData',this.BrowseData);
    this.UpdateInvFormSubmitted = true;
    console.log('UpdateInvFormSubmitted',valid);
    if(valid){
      this.InvSpinner = true;

      this.objUpdateInvoice.Project_ID=this.BrowseData.Project_ID;
      this.objUpdateInvoice.Invoice_Date=this.Inv_Date ? this.DateService.dateConvert(this.Inv_Date) : null;
      this.objUpdateInvoice.User_ID=this.cokiseId;

      console.log('this.objUpdateInvoice',this.objUpdateInvoice);
      const Invobj = {
        "SP_String": "SP_BL_Txn_Finshore_Project_Invoice",
        "Report_Name_String": "Update_Invoice",
        "Json_Param_String": JSON.stringify([this.objUpdateInvoice])
      }
      this.GlobalAPI.postData(Invobj).subscribe((data:any) => {
        console.log('data res', data);
        if(data[0].Column1){
          this.TotalAmt=this.objUpdateInvoice.Invoice_Amount;
          this.UpdateInvFormSubmitted=false;
          this.InvSpinner=false;
          this.getData();
          this.compacctToast.clear();
          this.compacctToast.add({
            key: "compacct-toast",
            severity: "success",
            summary: "INVOICE",
            detail: "Succesfully Updated"
          });
        }
        else {
          this.InvSpinner=false;
          this.compacctToast.clear();
          this.compacctToast.add({
            key: "compacct-toast",
            severity: "error",
            summary: "Error",
            detail: "Something Went Wrong"
          });
        }
      });
    }
  }
  AmountChange(){
    this.objUpdateInvoice.Invoice_Amount=this.objUpdatePI.Bill_To_PI_Amount;
  }
  TotalAmountChange(){
    this.TotalAmt=this.objUpdateInvoice.Invoice_Amount
    this.PendingAmt=Number(this.TotalAmt)-Number(this.PaidAmt);
  }
  NetPaymentChange(){
    this.objUpdatePayment.Net_Payment=Number(this.objUpdatePayment.Amount)-Number(this.objUpdatePayment.TDS);
  }
  Add_Payment(valid:any){
    this.UpdatePaymentFormSubmitted = true;
    console.log('UpdatePaymentFormSubmitted',valid);
    if(valid){
      this.PaymentSpinner=true;

      this.objUpdatePayment.Project_ID=this.BrowseData.Project_ID;
      this.objUpdatePayment.Created_By=this.cokiseId;

      this.PaymentList.push(this.objUpdatePayment);
      console.log('this.PaymentList',this.PaymentList);

      this.objUpdatePayment = new UpdatePayment();
      this.UpdatePaymentFormSubmitted = false;
      this.PaymentSpinner=false;
    }
  }
  deletePaymentList(index:any){
    this.PaymentList.splice(index, 1);
  }
  getPaymentList(ProjectID:any){
      console.log('ProjectID',ProjectID);
      this.PaymentList=[];
      const Pmtobj = {
        "SP_String": "SP_BL_Txn_Finshore_Project_Invoice",
        "Report_Name_String": "Get_Payment_Details",
        "Json_Param_String": JSON.stringify([{ Project_ID: ProjectID }])
      }
      this.GlobalAPI.postData(Pmtobj).subscribe((data:any) => {
        console.log('getPaymentList',data);
        this.PaymentList=data
        console.log('this.PaymentList',data);
      });
  }
  UpdatePaymentList(){
    this.UPmtSpinner = true;
    console.log('this.PaymentList',this.PaymentList);
    const Pmtobj = {
      "SP_String": "SP_BL_Txn_Finshore_Project_Invoice",
      "Report_Name_String": "Update_Payment",
      "Json_Param_String": JSON.stringify(this.PaymentList)
    }
    this.GlobalAPI.postData(Pmtobj).subscribe((data:any) => {
      console.log('data res', data);
      if(data[0].Column1){
        this.PaidAmt=this.NetPayment;
        this.PendingAmt=Number(this.TotalAmt)-Number(this.PaidAmt);
        this.UPmtSpinner=false;
        this.getData();
        this.compacctToast.clear();
        this.compacctToast.add({
          key: "compacct-toast",
          severity: "success",
          summary: "PAYMENT",
          detail: "Succesfully Updated"
        });
      }
      else {
        this.UPmtSpinner=false;
        this.compacctToast.clear();
        this.compacctToast.add({
          key: "compacct-toast",
          severity: "error",
          summary: "Error",
          detail: "Something Went Wrong"
        });
      }
    });
  }
  CalAmountt(){
    this.Amountt=0;
    this.PaymentList.forEach((item:any) => {
      this.Amountt+=Number(item.Amount);
    })
    return this.Amountt;  
  }
  CalTDSS(){
    this.TDSS=0;
    this.PaymentList.forEach((item:any) => {
      this.TDSS+=Number(item.TDS);
    })
    return this.TDSS;  
  }
  CalNetPaymentt(){
    this.NetPayment=0;
    this.PaymentList.forEach((item:any) => {
      this.NetPayment+=Number(item.Net_Payment);
    })
    return this.NetPayment;  
  }
}

class UpdatePI{
  Project_ID:any;            				   
	Bill_To:any   
	Bill_To_PI_No:any;        			
	Bill_To_PI_Date:any;  	      
	Bill_To_PI_Amount:any;    
	Bill_To_Sub_Ledger_ID:any;  
  User_ID:any;            					
	Previous_Bill_To:any;       						
	Previous_Bill_To_PI_Date:any;     
}
class UpdateInvoice{
  Project_ID:any;						
  User_ID:any;					
  Previous_Invoice_To:any;			
  Previous_Invoice_Date:any;
  Invoice_To:any;
  Invoice_No:any;					
  Invoice_Date:any;
  Invoice_Amount:any;
  Invoice_To_Sub_Ledger_ID:any;
}

class UpdatePayment{
  Amount:any;
  TDS:any;
  Net_Payment:any;
  Project_ID:any;
  Created_By:any;
}

