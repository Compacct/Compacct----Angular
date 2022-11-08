import { Component, OnInit, ViewEncapsulation, ViewChild, AfterViewInit, ElementRef } from '@angular/core';
import { HttpClient, HttpParams } from "@angular/common/http";
import { CompacctCommonApi } from "../../../../shared/compacct.services/common.api.service";
import { CompacctGlobalApiService } from '../../../../shared/compacct.services/compacct.global.api.service';
import { CompacctHeader } from "../../../../shared/compacct.services/common.header.service";
import { DateTimeConvertService } from '../../../../shared/compacct.global/dateTime.service';
import { MessageService } from "primeng/api";
import { FileUpload } from "primeng/primeng";
import { AnyTxtRecord } from 'dns';
import { DateNepalConvertService } from '../../../../shared/compacct.global/dateNepal.service';
import * as XLSX from 'xlsx';
declare var NepaliFunctions: any;
const NepaliDate = require('nepali-date');
declare var nepaliDatePicker: any;
declare var $: any;

@Component({
  selector: 'app-support-ticket-nepal',
  templateUrl: './support-ticket-nepal.component.html',
  styleUrls: ['./support-ticket-nepal.component.css'],
  providers: [MessageService],
  encapsulation: ViewEncapsulation.None
})
export class SupportTicketNepalComponent implements OnInit {
  tabIndexToView = 0;
  url = window["config"];
  persons: [];
  buttonname = "Save";
  Spinner = false;
  seachSpinner = false;
  
  EngineerName = undefined;
  EngineerNameList = [];
  items:any = [];

  ObjSupportTicket = new SupportTicket();
  SupportTicketFormSubmit = false;
  SupportTicketDate : any = {};
  ExpectedcompletionDate : any = {};
  SupportStartDate : any = {};
  SupportEndDate : any = {};
  CallTypeList:any = [];
  CustomerList = [];
  LoctionList = [];
  MfList = [];
  MachineList = [];
  SerialNoList = [];
  EngineerList = [];
  ContractStatusList = [];
  SymptomList = [];

  previouscontractList = [];
  PreviousContractPopup = false;
  customername = undefined;
  locationname = undefined
  precontractdisable = true;

  StatusList = [];

  currentdate = new Date();
  ObjBrowse = new Browse();
  BrowseStartDate : any = {};
  BrowseEndDate : any = {};
  SearchFormSubmit = false;
  BrowseList = [];
  EditList = [];
  Contract_ID = undefined;
  browsestartdate: Date;
  CurrentDateNepal:any= undefined;

  alignedenggid = undefined;
  alignedengineer = undefined;
  AlEngineerList = [];
  NewBrowseEndDate:any;
  column:any =[];
  SpinnerExportoExcel:boolean = false
  constructor(
    private $http: HttpClient,
    private commonApi: CompacctCommonApi,
    private GlobalAPI: CompacctGlobalApiService,
    private Header: CompacctHeader,
    private compacctToast: MessageService,
    public $CompacctAPI: CompacctCommonApi,
    private DateService: DateTimeConvertService,
    private DateNepalConvertService : DateNepalConvertService
  ) {
   // console.log(nepaliDatePicker())
    this.CurrentDateNepal = this.DateNepalConvertService.GetNepaliCurrentDateNew();
    this.NewBrowseEndDate = this.CurrentDateNepal;
    console.log(this.DateNepalConvertService.convertNepaliDateToEngDate(this.CurrentDateNepal))
   }

  ngOnInit() {
    this.items = ["BROWSE", "CREATE"];
    this.Header.pushHeader({
      Header: "Support Ticket",
      Link: " Engineering CRM -> Master -> Support Ticket"
    });
    this.SupportTicketDate = this.CurrentDateNepal;
    this.ExpectedcompletionDate = this.CurrentDateNepal;
    this.SupportStartDate = this.CurrentDateNepal;
    this.SupportEndDate = this.CurrentDateNepal;
    this.BrowseStartDate = this.CurrentDateNepal;
    this.BrowseEndDate = this.CurrentDateNepal;
    this.GetEngineerName();
       this.GetCallType();
       this.GetCustomer();
      // this.GetManufacturer();
      // this.GetSerialNo();
       this.GetEngineer();
       this.GetContractStatus();
       this.GetSymptom();

       this.column = [
        { field: 'Support_Ticket_No', header: 'Support Ticket No' },
        { field: 'Support_Ticket_Date_Nepali', header: 'Support Ticket Date' },
        { field: 'Call_Type', header: 'Call Type' },
        { field: 'Sub_Ledger_Name', header: 'Customer Name' },
        { field: 'Location_Name', header: 'Location' },
        { field: 'Mfg_Company', header: 'Machine Make' },
        { field: 'Machine', header: 'Machine' },
        { field: 'Serial_No', header: 'Machine Serial No' },
        { field: 'Member_Name', header: 'Engineer' },
        { field: 'Support_Ticket_Status', header: 'Status' },
        { field: 'Contract_Status', header: 'Contract Status' },
        { field: 'Remarks', header: 'Remarks' }
      ];
  }
 
  
  // Clear & Tab
  TabClick(e) {
    this.tabIndexToView = e.index;
    this.items = ["BROWSE", "CREATE"];
    this.buttonname = "Save";
    this.clearData();
  }
  clearData() {
    this.Spinner = false;
    this.ObjSupportTicket = new SupportTicket();
    this.SupportTicketDate = this.CurrentDateNepal;
    this.ExpectedcompletionDate = this.CurrentDateNepal;
    this.SupportStartDate = this.CurrentDateNepal;
    this.SupportEndDate = this.CurrentDateNepal;
    this.SupportTicketFormSubmit = false;
    this.MfList = [];
    this.MachineList = [];
    this.LoctionList = [];
    this.SerialNoList = [];
    // this.GetBrowseList();
     this.EditList = [];
     this.Contract_ID = undefined;
     this.previouscontractList = [];
     this.GetContractStatus();
     this.alignedenggid = undefined;
     this.alignedengineer = undefined;
     this.SpinnerExportoExcel = false
  }
  
  GetEngineerName(){
    const obj = {
      "SP_String": "SP_Support_Ticket_Nepal",
      "Report_Name_String": "Get_Engineer_Dropdown",
      "Json_Param_String": JSON.stringify([{User_ID : this.$CompacctAPI.CompacctCookies.User_ID}])
     }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      console.log("EngineerName");
     this.EngineerNameList = data;
    })
  }
  GetCallType(){
    //  console.log("StatusList ===", this.StatusList)
        this.CallTypeList =[
          {Name : "Installation"},
          {Name : "PM"},
          {Name : "Sales & Training"},
          {Name : "Breakdown"},
          {Name : "courtesy visit"},
          {Name : "courtesy Call"}
        ];
  }
  GetCustomer(){
      const obj = {
        "SP_String": "SP_Engg_CRM_Installed_Machine_Service_Contract",
        "Report_Name_String": "Get_Customer"
       }
      this.GlobalAPI.getData(obj).subscribe((data:any)=>{
        data.forEach(el => {
          el['label'] = el.Sub_Ledger_Name;
          el['value'] = el.Sub_Ledger_ID;
        });
       this.CustomerList = data;
       //console.log('CustomerList ==', this.CustomerList)
    
      });
  }
  GetLocation(){
      const TObj = {
        Sub_Ledger_ID : this.ObjSupportTicket.Customer_Name
      }
      const obj = {
        "SP_String": "SP_Support_Ticket_Nepal",
        "Report_Name_String": "Get_Location",
        "Json_Param_String": JSON.stringify([TObj])
       }
      this.GlobalAPI.getData(obj).subscribe((data:any)=>{
       this.LoctionList = data;
      // console.log('LoctionList ==', this.LoctionList)
    
      });
  }
  GetManufacturer(){
    const Obj = {
      Sub_Ledger_ID: this.ObjSupportTicket.Customer_Name,
      Location_ID: this.ObjSupportTicket.Location
    }
      const obj = {
        "SP_String": "SP_Engg_CRM_Installed_Machine_Service_Contract",
        "Report_Name_String": "Get_Manufacturer",
        "Json_Param_String": JSON.stringify([Obj])
       }
      this.GlobalAPI.getData(obj).subscribe((data:any)=>{
       this.MfList = data;
      // console.log('MfList ==', this.MfList)
    
      });
  }
  GetMachine(){
      const TObj = {
        Product_Mfg_Comp_ID : this.ObjSupportTicket.Machine_Manufacturer,
        Sub_Ledger_ID: this.ObjSupportTicket.Customer_Name,
        Location_ID: this.ObjSupportTicket.Location
      }
      const obj = {
        "SP_String": "SP_Engg_CRM_Installed_Machine_Service_Contract",
        "Report_Name_String": "Get_Machine",
        "Json_Param_String": JSON.stringify([TObj])
       }
      this.GlobalAPI.getData(obj).subscribe((data:any)=>{
       this.MachineList = data;
      // console.log('MachineList ==', this.MachineList)
      });
  }
  GetSerialNo(){
      const TObj = {
        Sub_Ledger_ID: this.ObjSupportTicket.Customer_Name,
        Location_ID: this.ObjSupportTicket.Location,
        Product_ID: this.ObjSupportTicket.Machine
      }
      const obj = {
        "SP_String": "SP_Engg_CRM_Installed_Machine_Service_Contract",
        "Report_Name_String": "Get_Serial_NOs",
        "Json_Param_String": JSON.stringify([TObj])
       }
      this.GlobalAPI.getData(obj).subscribe((data:any)=>{
       this.SerialNoList = data;
      // console.log('SerialNoList ==', this.SerialNoList)
      this.GetAlignedEngineer();
    
      });
  }
  GetEngineer(){
    // const TObj = {
    //   Product_Mfg_Comp_ID : this.ObjServiceContract.Machine_Manufacturer
    // }
    const obj = {
      "SP_String": "SP_Support_Ticket_Nepal",
      "Report_Name_String": "Get_Engineer",
      //"Json_Param_String": JSON.stringify([TObj])
     }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
     this.EngineerList = data;
    // console.log('SerialNoList ==', this.SerialNoList)
  
    });
  }
  GetAlignedEngineer(){
    this.alignedenggid = undefined;
    this.alignedengineer = undefined;
    const TObj = {
      Sub_Ledger_ID : this.ObjSupportTicket.Customer_Name,
      Location_ID : this.ObjSupportTicket.Location,
      Product_ID : this.ObjSupportTicket.Machine
    }
    const obj = {
      "SP_String": "SP_Support_Ticket_Nepal",
      "Report_Name_String": "Get_Engineer_Aligned",
      "Json_Param_String": JSON.stringify([TObj])
     }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
     this.AlEngineerList = data;
     this.alignedenggid = data[0].User_ID;
     this.alignedengineer = data[0].Member_Name;
     this.EngineerList.forEach(el => {
       if (el.User_ID == this.alignedenggid) {
        this.ObjSupportTicket.Assigned_Engineer = el.User_ID;
       }
    })
    // this.ObjSupportTicket.Assigned_Engineer = this.EngineerList[0].User_ID;
    console.log('Aligned EngineerList ==', this.AlEngineerList)
  
    });
  }
  ViewContract(){
    this.PreviousContractPopup = true;
  }
  ShowPreviousContract(){
    this.previouscontractList = [];
    const TObj = {
      Product_Mfg_Comp_ID : this.ObjSupportTicket.Machine_Manufacturer,
        Product_ID : this.ObjSupportTicket.Machine,
        Serial_No : this.ObjSupportTicket.Serial_No,
        Sub_Ledger_ID : this.ObjSupportTicket.Customer_Name,
        Location_ID : this.ObjSupportTicket.Location
    }
    const obj = {
      "SP_String": "SP_Support_Ticket_Nepal",
      "Report_Name_String": "Get_Previous_Contract",
      "Json_Param_String": JSON.stringify([TObj])
    }
    this.GlobalAPI.getData(obj).subscribe((data: any) => {
      this.previouscontractList = data;
      //this.PreviousContractPopup = true;
      // console.log('previouscontractList ==', this.previouscontractList)
    });
  }
  GetContractStatus(){
    //  console.log("StatusList ===", this.StatusList)
        this.ContractStatusList =[
          {Service_Type : "Chargeable"},
          {Service_Type : "Not Chargeable"}
        ];
  }
  GetPreContractStatus(){
    const TObj = {
        Product_Mfg_Comp_ID : this.ObjSupportTicket.Machine_Manufacturer,
        Product_ID : this.ObjSupportTicket.Machine,
        Serial_No : this.ObjSupportTicket.Serial_No,
        Sub_Ledger_ID : this.ObjSupportTicket.Customer_Name,
        Location_ID : this.ObjSupportTicket.Location
      }
      const obj = {
        "SP_String": "SP_Support_Ticket_Nepal",
        "Report_Name_String": "Get_Contract_Status",
        "Json_Param_String": JSON.stringify([TObj])
       }
      this.GlobalAPI.getData(obj).subscribe((data:any)=>{
       this.ContractStatusList = data;
       if(this.ContractStatusList.length) {
       this.ObjSupportTicket.Contract_Status = data[0].Service_Type;
       this.ShowPreviousContract();
       }
       else {
        this.GetContractStatus();
        this.ShowPreviousContract();
       }
      // console.log('SerialNoList ==', this.SerialNoList)
    
      });
  }
  GetSymptom(){
    // const TempObj = {
    //   User_ID:this.$CompacctAPI.CompacctCookies.User_ID,
    //   Cost_Cen_ID : this.$CompacctAPI.CompacctCookies.Cost_Cen_ID,
    //   Doc_Type : "Sale_Bill",
    //   Product_Type_ID : 0,
    //   bill_type : this.QueryStringObj.Ledger_Name ? 'Online' : ''
    //  }
   const obj = {
    "SP_String": "SP_Support_Ticket_Nepal",
    "Report_Name_String" : "Get_Symptom",
   //"Json_Param_String": JSON.stringify([TempObj])

  }
  this.GlobalAPI.getData(obj).subscribe((data:any)=>{
    if(data.length) {
      data.forEach(element => {
        element['label'] = element.Symptom,
        element['value'] = element.Symptom_ID
      });
      this.SymptomList = data;
    } else {
      this.SymptomList = [];

     }
    console.log("this.SymptomList======",this.SymptomList);


  });
  }
  convertToNepaliDateObj = function (_Date) {
    const EnglishDate = new Date(_Date);
    var month = EnglishDate.getUTCMonth() + 1;
    var day = EnglishDate.getDate();
    var year = EnglishDate.getUTCFullYear();
    const NepalDateObj = NepaliFunctions.AD2BS({
      year: year,
      month: month,
      day: day
    });
    //const NepalDate = {nyear: NepalDateObj.year, nmonth: Number(NepalDateObj.month) - 1, nday: NepalDateObj.day};
    const d1 = new NepaliDate(NepalDateObj.year, Number(NepalDateObj.month) - 1, NepalDateObj.day)
    // const nyear = NepalDateObj.year.toString().length == 1 ? "0" + NepalDateObj.year : NepalDateObj.year;
    // const nmonth = NepalDateObj.month.toString().length == 1 ? "0" + NepalDateObj.month : NepalDateObj.month;
    // const nday = NepalDateObj.day.toString().length == 1 ? "0" + NepalDateObj.day : NepalDateObj.day;
    //const NepalDate = NepalDateObj.day + '/' + NepalDateObj.month + '/' + NepalDateObj.year;
    //const NepalDate = nday + '/' + nmonth + '/' + nyear;
    return d1.format('dd mmmm, yyyy');
    // return {
    //   day: Number(nday),
    //   month: Number(nmonth),
    //   year: nyear
    // };
  }
 
  SaveSupportTicket(valid) {
    // this.SupportTicketFormSubmit = true;
    // this.Spinner = true;
    // if (valid && this.Contract_ID) {

    //   const d1 = new NepaliDate(this.ServiceStartDate.year, this.ServiceStartDate.month, this.ServiceStartDate.day);
    //   const d2 = new NepaliDate(this.ServiceEndDate.year, this.ServiceEndDate.month, this.ServiceEndDate.day);
    //   const d3 = new NepaliDate(this.PaymentDate.year, this.PaymentDate.month, this.PaymentDate.day);
    //   const Obj = {
    //     Contract_ID: this.Contract_ID,
    //     Sub_Ledger_ID: this.ObjServiceContract.Customer_Name,
    //     Location_ID: this.ObjServiceContract.Location,
    //     Product_Mfg_Comp_ID: this.ObjServiceContract.Machine_Manufacturer,
    //     Product_ID: this.ObjServiceContract.Machine,
    //     Serial_No: this.ObjServiceContract.Serial_No,
    //     Service_Type: this.ObjServiceContract.Type_of_Service,
    //     Service_Start_Date: d1.format('dd-mm-yyyy'),
    //     Service_End_Date: d2.format('dd-mm-yyyy'),
    //     Payment_Status: this.ObjServiceContract.Payment_Status,
    //     Payment_Date: d3.format('dd-mm-yyyy')
    //   }
    //   const obj = {
    //     "SP_String": "SP_Support_Ticket_Nepal",
    //     "Report_Name_String": "Update_Engg_CRM_Installed_Machine_Service_Contract",
    //     "Json_Param_String": JSON.stringify([Obj])

    //   }
    //   this.GlobalAPI.postData(obj).subscribe((data: any) => {
    //     console.log(data);
    //     //var tempID = data[0].Column1;
    //     if (data[0].Column1) {
    //       this.compacctToast.clear();
    //       //const mgs = this.buttonname === 'Save & Print Bill' ? "Created" : "updated";
    //       this.compacctToast.add({
    //         key: "compacct-toast",
    //         severity: "success",
    //         summary: "Installed Machine",
    //         detail: "Succesfully Updated" //+ mgs
    //       });
    //       this.clearData();
    //       this.GetSearchedList(true);
    //       this.Contract_ID = undefined;
    //       this.tabIndexToView = 0;
    //       this.items = ["BROWSE", "CREATE"];
    //       //  this.buttonname = "Save";
    //       // this.testchips =[];

    //     } else {
    //       // this.ngxService.stop();
    //       this.Spinner = false;
    //       this.compacctToast.clear();
    //       this.compacctToast.add({
    //         key: "compacct-toast",
    //         severity: "error",
    //         summary: "Warn Message",
    //         detail: "Error Occured "
    //       });
    //     }
    //   })
    // } else {
      this.SupportTicketFormSubmit = true;
      this.Spinner = true;
      if (valid) {
        let arr =[]
    if(this.ObjSupportTicket.Symptom.length) {
      this.ObjSupportTicket.Symptom.forEach(el => {
        if(el){
          const Dobj = {
            Symptom_ID : el
            }
            arr.push(Dobj)
        }

    });
      // console.log("Table Data ===", Rarr)
      // return Rarr.length ? JSON.stringify(Rarr) : '';
   }
       // const d1 = new NepaliDate(this.SupportTicketDate.year, this.SupportTicketDate.month, this.SupportTicketDate.day);
        const TempObj = {
          Doc_No: 'A',
          Cost_Cent_ID: this.$CompacctAPI.CompacctCookies.Cost_Cen_ID,
          Support_Ticket_Status: 'PENDING',
         // Support_Ticket_Date: this.DateService.dateConvert(d1.getEnglishDate()),
        //  Support_Ticket_Date_Nepali: d1.format('dd-mm-yyyy'),
          Support_Ticket_Date: this.DateService.dateConvert(this.DateNepalConvertService.convertNepaliDateToEngDate(this.SupportTicketDate)),
          Support_Ticket_Date_Nepali: this.SupportTicketDate,
          Expected_Completion_Date: this.DateService.dateConvert(this.DateNepalConvertService.convertNepaliDateToEngDate(this.ExpectedcompletionDate)),
          Support_Start_Date: this.DateService.dateConvert(this.DateNepalConvertService.convertNepaliDateToEngDate(this.SupportStartDate)),
          Support_End_Date: this.DateService.dateConvert(this.DateNepalConvertService.convertNepaliDateToEngDate(this.SupportEndDate)),
          Call_Type: this.ObjSupportTicket.Call_Type,
          Sub_Ledger_ID: this.ObjSupportTicket.Customer_Name,
          Location_ID: this.ObjSupportTicket.Location,
          Product_Mfg_Comp_ID: this.ObjSupportTicket.Machine_Manufacturer,
          Product_ID: this.ObjSupportTicket.Machine,
          Serial_No: this.ObjSupportTicket.Serial_No,
          Engineer_User_ID: this.ObjSupportTicket.Assigned_Engineer,
          Contract_Status: this.ObjSupportTicket.Contract_Status,
          Remarks: this.ObjSupportTicket.Remarks
        }
        const obj = {
          "SP_String": "SP_Support_Ticket_Nepal",
          "Report_Name_String": "Create_Engg_CRM_Support_Ticket_Master",
          "Json_Param_String": JSON.stringify([TempObj]),
          "Json_1_String" : JSON.stringify(arr)
        }
        this.GlobalAPI.postData(obj).subscribe((data: any) => {
          console.log(data);
          var msg = data[0].Column1;
          if (data[0].Column1) {
            this.compacctToast.clear();
            this.compacctToast.add({
              key: "compacct-toast",
              severity: "success",
              summary: "Installed Machine",
              detail: msg != "Already Exists" ? "Succesfully Saved" : "Already Exists"
            });
            if (msg != "Already Exists") {
              this.clearData();
            }
            // this.ServiceContractFormSubmit = false;
            this.Spinner = false;
            // this.ObjServiceContract = new ServiceContract();
            // this.MachineList = [];
            // this.LoctionList = [];

          } else {
            this.Spinner = false;
            this.compacctToast.clear();
            this.compacctToast.add({
              key: "compacct-toast",
              severity: "error",
              summary: "Warn Message",
              detail: "Error Occured "
            });
          }

        })
      } else {
        this.Spinner = false;
        this.compacctToast.clear();
        this.compacctToast.add({
          key: "compacct-toast",
          severity: "error",
          summary: "Warn Message",
          detail: "Error Occured "
        });
      }
    //}
  }
  getDateRange(dateRangeObj) {
    if (dateRangeObj.length) {
      this.ObjBrowse.start_date = dateRangeObj[0];
      this.ObjBrowse.end_date = dateRangeObj[1];
    }
  }
  GetSearchedList(valid) {
    this.SearchFormSubmit = true;
    // const start = this.ObjBrowse.start_date
    //  ? this.DateService.dateConvert(new Date(this.ObjBrowse.start_date))
    //  : this.DateService.dateConvert(new Date());
    // const end = this.ObjBrowse.end_date
    //  ? this.DateService.dateConvert(new Date(this.ObjBrowse.end_date))
    //  : this.DateService.dateConvert(new Date());
    if (valid) {
      this.seachSpinner = true;
      const tempobj = {
        Engineer_User_ID: this.EngineerName ? this.EngineerName : 0 ,
        From_Date : this.DateService.dateConvert(this.DateNepalConvertService.convertNepaliDateToEngDate(this.BrowseStartDate)),
        To_Date : this.DateService.dateConvert(this.DateNepalConvertService.convertNepaliDateToEngDate(this.BrowseEndDate)),
      }
      const obj = {
        "SP_String": "SP_Support_Ticket_Nepal",
        "Report_Name_String": "Browse_Engg_CRM_Support_Ticket_Master",
        "Json_Param_String": JSON.stringify([tempobj])
      }
      this.GlobalAPI.getData(obj).subscribe((data: any) => {
        this.BrowseList = data;
      
        this.seachSpinner = false;
        this.SearchFormSubmit = false;
       // for(let i = 0; i < this.BrowseList.length ; i++){
          // this.BrowseList[i]['Support_Ticket_Date'] = this.convertToNepaliDateObj(this.BrowseList[i]['Support_Ticket_Date']);
          // console.log('Service_Start_Date==', this.BrowseList[i]['Service_Start_Date'])
       // }  
      })
    }
  }
  exportoexcel(data): void {
      if(data.length){
        this.SpinnerExportoExcel = true
        let Arr:any = []
        data.forEach((z:any) => {
          Arr.push({
            ['Support Ticket No'] : z.Support_Ticket_No,
            ['Support Ticket Date'] : this.DateService.dateConvert(z.Support_Ticket_Date),
            ['Call Type'] : z.Call_Type,
            ['Customer Name'] : z.Sub_Ledger_Name,
            ['Location'] : z.Location_Name,
            ['Machine Make'] : z.Mfg_Company,
            ['Machine'] : z.Machine,
            ['Machine Serial No'] : z.Serial_No,
            ['Engineer'] : z.Member_Name,
            ['Status'] : z.Support_Ticket_Status,
            ['Contract Status'] : z.Contract_Status,
            ['Remarks'] : z.Remarks
           })
         });
 
        const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(Arr);
        const workbook: XLSX.WorkBook = {Sheets: {'data': worksheet}, SheetNames: ['data']};
        XLSX.writeFile(workbook,'SupportTicket.xlsx');
        this.SpinnerExportoExcel = false
      }
    
  }
  Edit(){}
  onConfirm(){}
  onReject(){}

}
class SupportTicket{
  Call_Type:string;
  Customer_Name:string;
  Location:string;
  Machine_Manufacturer:string;
  Machine:string;
  Serial_No:any;
  Assigned_Engineer:string;
  Aligned_Engineer:string;
  Contract_Status:string;
  Symptom:any;
  Remarks:string
}
class Browse{
  Customer_Name:string;
  start_date : Date ;
  end_date : Date;
}
