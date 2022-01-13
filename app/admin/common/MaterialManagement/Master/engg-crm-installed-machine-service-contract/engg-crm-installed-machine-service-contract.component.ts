import { Component, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { HttpClient, HttpParams } from "@angular/common/http";
import { CompacctCommonApi } from "../../../../shared/compacct.services/common.api.service";
import { CompacctGlobalApiService } from '../../../../shared/compacct.services/compacct.global.api.service';
import { CompacctHeader } from "../../../../shared/compacct.services/common.header.service";
import { DateTimeConvertService } from '../../../../shared/compacct.global/dateTime.service';
import { MessageService } from "primeng/api";
import { FileUpload } from "primeng/primeng";
import { AnyTxtRecord } from 'dns';
declare var NepaliFunctions:any;

@Component({
  selector: 'app-engg-crm-installed-machine-service-contract',
  templateUrl: './engg-crm-installed-machine-service-contract.component.html',
  styleUrls: ['./engg-crm-installed-machine-service-contract.component.css'],
  providers: [MessageService],
  encapsulation: ViewEncapsulation.None
})
export class EnggCrmInstalledMachineServiceContractComponent implements OnInit {
  tabIndexToView = 0;
  url = window["config"];
  persons: [];
  buttonname = "Save";
  Spinner = false;
  seachSpinner = false;
  items = [];

  ObjServiceContract = new ServiceContract();
  ServiceContractFormSubmit = false;
  MfList = [];
  MachineList = [];
  SerialNoList = [];

  previouscontractList = [];
  PreviousContractPopup = false;
  customername = undefined;
  locationname = undefined;
  manufacturer = undefined;
  machinename = undefined;
  slno = undefined;
  servicetype = undefined;
  sstartdate = undefined;
  senddate = undefined;
  paystatus = undefined;
  paydate = undefined;
  precontractdisable = true;

  CustomerList = [];
  LoctionList = [];
  ServiceList = [];
  //ServiceStartDate = new Date();
  ServiceStartDate : Date;
  ServiceEndDate : Date;
  StatusList = [];
  PaymentDate = new Date();

  currentdate = new Date();
  ObjBrowse = new Browse();
  SearchFormSubmit = false;
  BrowseList = [];
  EditList = [];
  Contract_ID = undefined;
  browsestartdate: Date;
  CurrentDateNepal= undefined;
  // getdate: any;
  // memberid = undefined;
  // deluserid = undefined;
  // delmemberid = undefined;
  

  constructor(
    private $http: HttpClient,
    private commonApi: CompacctCommonApi,
    private GlobalAPI: CompacctGlobalApiService,
    private Header: CompacctHeader,
    private compacctToast: MessageService,
    private DateService: DateTimeConvertService
  ) {
    const year = NepaliFunctions.GetCurrentBsDate().year.toString().length == 1 ? "0" + NepaliFunctions.GetCurrentBsDate().year : NepaliFunctions.GetCurrentBsDate().year;
        const month = NepaliFunctions.GetCurrentBsDate().month.toString().length == 1 ? "0" + NepaliFunctions.GetCurrentBsDate().month : NepaliFunctions.GetCurrentBsDate().month;
        const day = NepaliFunctions.GetCurrentBsDate().day.toString().length == 1 ? "0" + NepaliFunctions.GetCurrentBsDate().day : NepaliFunctions.GetCurrentBsDate().day;
        this.CurrentDateNepal = day + '/' + month + '/' + year;
   }

  ngOnInit() {
    this.items = ["BROWSE", "CREATE"];
    this.Header.pushHeader({
      Header: "Service Contract",
      Link: " Engineering CRM -> Master -> Service Contract"
    });
    this.ServiceStartDate = this.CurrentDateNepal;
      this.GetCustomer();
      this.GetManufacturer();
      this.GetSerialNo();
      this.gettypeofservice();
      this.getStatus();
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
    this.ObjServiceContract = new ServiceContract();
    this.ServiceContractFormSubmit = false;
    this.MachineList = [];
    this.LoctionList = [];
    this.ServiceStartDate = new Date();
    this.ServiceEndDate = new Date();
    this.PaymentDate = new Date();
    // this.GetBrowseList();
     this.EditList = [];
     this.Contract_ID = undefined;
     this.previouscontractList = [];
  }
  GetCustomer(){
    const obj = {
      "SP_String": "SP_Engg_CRM_Installed_Machine_Service_Contract",
      "Report_Name_String": "Get_Customer"
     }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
     this.CustomerList = data;
     //console.log('CustomerList ==', this.CustomerList)
  
    });
  }
  GetLocation(){
    const TObj = {
      Sub_Ledger_ID : this.ObjServiceContract.Customer_Name
    }
    const obj = {
      "SP_String": "SP_Engg_CRM_Installed_Machine_Service_Contract",
      "Report_Name_String": "Get_Location",
      "Json_Param_String": JSON.stringify([TObj])
     }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
     this.LoctionList = data;
    // console.log('LoctionList ==', this.LoctionList)
  
    });
  }
  GetManufacturer(){
    const obj = {
      "SP_String": "SP_Engg_CRM_Installed_Machine_Service_Contract",
      "Report_Name_String": "Get_Manufacturer"
     }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
     this.MfList = data;
    // console.log('MfList ==', this.MfList)
  
    });
  }
  GetMachine(){
    const TObj = {
      Product_Mfg_Comp_ID : this.ObjServiceContract.Machine_Manufacturer
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
    // const TObj = {
    //   Product_Mfg_Comp_ID : this.ObjServiceContract.Machine_Manufacturer
    // }
    const obj = {
      "SP_String": "SP_Engg_CRM_Installed_Machine_Service_Contract",
      "Report_Name_String": "Get_Serial_NOs",
      //"Json_Param_String": JSON.stringify([TObj])
     }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
     this.SerialNoList = data;
    // console.log('SerialNoList ==', this.SerialNoList)
  
    });
  }
  previouscontract(){
    this.PreviousContractPopup = true;
  }
  Getpreviouscontract(){
    this.previouscontractList = [];
    this.customername = undefined;
    this.locationname = undefined;
    this.manufacturer = undefined;
    this.machinename = undefined;
    this.slno = undefined;
    this.servicetype = undefined;
    this.sstartdate = undefined;
    this.senddate = undefined;
    this.paystatus = undefined;
    this.paydate = undefined;
    const TObj = {
      Product_Mfg_Comp_ID : this.ObjServiceContract.Machine_Manufacturer,
      Product_ID : this.ObjServiceContract.Machine,
      Serial_No : this.ObjServiceContract.Serial_No
    }
    const obj = {
      "SP_String": "SP_Engg_CRM_Installed_Machine_Service_Contract",
      "Report_Name_String": "Get_Previous_Contract",
      "Json_Param_String": JSON.stringify([TObj])
     }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
     this.previouscontractList = data;
     //this.PreviousContractPopup = true;
    // console.log('previouscontractList ==', this.previouscontractList)
    //  this.customername = data[0].Sub_Ledger_Name;
    //  this.locationname = data[0].Location_Name;
    //  this.manufacturer = data[0].Mfg_Company;
    //  this.machinename = data[0].Machine;
    //  this.slno = data[0].Serial_No;
    //  this.servicetype = data[0].Service_Type;
    //  this.sstartdate = this.DateService.dateConvert(new Date(data[0].Service_Start_Date));
    //  this.senddate = this.DateService.dateConvert(new Date(data[0].Service_End_Date));
    //  this.paystatus = data[0].Payment_Status;
    //  this.paydate = this.DateService.dateConvert(new Date(data[0].Payment_Date));
  
    });
  }
  gettypeofservice(){
  //  console.log("ServiceList ===", this.ServiceList)
      this.ServiceList =[
        {Name : "AMC"},
        {Name : "Warranty"}
      ];

  }
  getStatus(){
  //  console.log("StatusList ===", this.StatusList)
      this.StatusList =[
        {Name : "Paid"},
        {Name : "Due"}
      ];

  }
  convertToNepaliDate = function (_Date) {
    const EnglishDate = new Date(_Date);
    var month = EnglishDate.getUTCMonth() + 1;
    var day = EnglishDate.getDate();
    var year = EnglishDate.getUTCFullYear();
    const NepalDateObj = NepaliFunctions.AD2BS({ year: year, month: month, day: day });
    const NepalDate = NepalDateObj.day + '/' + NepalDateObj.month + '/' + NepalDateObj.year;
    return NepalDate;
  }
  SaveServiceContract(valid){
    console.log('this.ServiceStartDate===',this.ServiceStartDate)
    this.ServiceContractFormSubmit = true;
    this.Spinner = true;
    if(valid && this.Contract_ID){
      const Obj = {
        Contract_ID  : this.Contract_ID,
        Sub_Ledger_ID : this.ObjServiceContract.Customer_Name,
        Location_ID : this.ObjServiceContract.Location,
        Product_Mfg_Comp_ID : this.ObjServiceContract.Machine_Manufacturer,
        Product_ID : this.ObjServiceContract.Machine,
        Serial_No : this.ObjServiceContract.Serial_No,
        Service_Type : this.ObjServiceContract.Type_of_Service,
        Service_Start_Date : this.DateService.dateConvert(new Date (this.ServiceStartDate)),
        Service_End_Date : this.DateService.dateConvert(new Date (this.ServiceEndDate)),
        Payment_Status : this.ObjServiceContract.Payment_Status,
        Payment_Date : this.DateService.dateConvert(new Date (this.PaymentDate))
      }
         const obj = {
           "SP_String": "SP_Engg_CRM_Installed_Machine_Service_Contract",
           "Report_Name_String" : "Update_Engg_CRM_Installed_Machine_Service_Contract",
           "Json_Param_String": JSON.stringify([Obj])
       
         }
         this.GlobalAPI.postData(obj).subscribe((data:any)=>{
           console.log(data);
           //var tempID = data[0].Column1;
           if(data[0].Column1){
            this.compacctToast.clear();
            //const mgs = this.buttonname === 'Save & Print Bill' ? "Created" : "updated";
            this.compacctToast.add({
             key: "compacct-toast",
             severity: "success",
             summary: "Installed Machine",
             detail: "Succesfully Updated" //+ mgs
           });
           this.clearData();
           this.GetSearchedList(true);
           this.Contract_ID = undefined;
           this.tabIndexToView = 0;
           this.items = ["BROWSE", "CREATE"];
          //  this.buttonname = "Save";
            // this.testchips =[];
       
           } else{
            // this.ngxService.stop();
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
        } 
        else {
    this.ServiceContractFormSubmit = true;
    this.Spinner = true;
    if(valid) {
      const TempObj = {
        Sub_Ledger_ID : this.ObjServiceContract.Customer_Name,
        Location_ID : this.ObjServiceContract.Location,
        Product_Mfg_Comp_ID : this.ObjServiceContract.Machine_Manufacturer,
        Product_ID : this.ObjServiceContract.Machine,
        Serial_No : this.ObjServiceContract.Serial_No,
        Service_Type : this.ObjServiceContract.Type_of_Service,
        Service_Start_Date : this.ServiceStartDate,
        Service_End_Date : this.ServiceEndDate,
        Payment_Status : this.ObjServiceContract.Payment_Status,
        Payment_Date : this.DateService.dateConvert(new Date (this.PaymentDate))
      }
      const obj = {
        "SP_String": "SP_Engg_CRM_Installed_Machine_Service_Contract",
        "Report_Name_String": "Create_Engg_CRM_Installed_Machine_Service_Contract",
        "Json_Param_String":  JSON.stringify([TempObj])
      }
      this.GlobalAPI.postData(obj).subscribe((data:any)=>{
        console.log(data);
        var msg = data[0].Column1;
        if(data[0].Column1) {
          this.compacctToast.clear();
          this.compacctToast.add({
            key: "compacct-toast",
            severity: "success",
            summary: "Installed Machine",
            detail:  msg != "Already Exists" ? "Succesfully Saved" : "Already Exists"
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
    }
    else {
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
  }
  GetSearchedList(valid){
    this.SearchFormSubmit = true;
    if(valid){
      this.seachSpinner = true;
    const tempobj = {
      Sub_Ledger_ID : this.ObjBrowse.Customer_Name
    }
    const obj = {
    "SP_String": "SP_Engg_CRM_Installed_Machine_Service_Contract",
    "Report_Name_String": "Browse_Engg_CRM_Installed_Machine_Service_Contract",
    "Json_Param_String": JSON.stringify([tempobj])
    }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
     this.BrowseList = data;
    // console.log('Search list=====',this.BrowseList)
     this.seachSpinner = false;
     this.SearchFormSubmit = false;
    })
    }
  }
  textcolor(col){
    this.browsestartdate = new Date(col.Service_Start_Date);
    // this.getdate = this.DateService.dateConvert(new Date(this.currentdate));
    // console.log('browsestartdate==',this.browsestartdate.getDate())
    // console.log('currentdate===',this.currentdate.getDate())
    // console.log('browsestartdate==',this.browsestartdate.getMonth() + 1)
    // console.log('currentdate===',this.currentdate.getMonth() + 1)
    // console.log('browsestartdate==',this.browsestartdate.getFullYear())
    // console.log('currentdate===',this.currentdate.getFullYear())
    return  this.browsestartdate < this.currentdate ? "text-red-active" : "";
  //  if (this.browsestartdate.getTime() < this.currentdate.getTime()) {
  //     return "text-red-active";
  //  }
  }
  Edit(edit){
    this.clearData();
    if(edit.Contract_ID) {
      this.Contract_ID = edit.Contract_ID;
      this.tabIndexToView = 1;
      this.items = ["BROWSE", "UPDATE"];
      this.buttonname = "Update";
      const ObjT = {
        Contract_ID : this.Contract_ID
      }
     const obj = {
       "SP_String": "SP_Engg_CRM_Installed_Machine_Service_Contract",
       "Report_Name_String": "Get_Engg_CRM_Installed_Machine_Service_Contract",
       "Json_Param_String": JSON.stringify([ObjT])
     }
     this.GlobalAPI.getData(obj).subscribe((data:any)=>{
       this.EditList = data;
       this.ObjServiceContract.Customer_Name = data[0].Sub_Ledger_ID;
       this.GetLocation();
       this.ObjServiceContract.Location = data[0].Location_ID;
       this.ObjServiceContract.Machine_Manufacturer = data[0].Product_Mfg_Comp_ID;
       this.GetMachine();
       this.ObjServiceContract.Machine = data[0].Product_ID;
       this.ObjServiceContract.Serial_No = data[0].Serial_No;
       this.ObjServiceContract.Type_of_Service = data[0].Service_Type;
       this.ServiceStartDate = new Date(data[0].Service_Start_Date);
       this.ServiceEndDate = new Date(data[0].Service_End_Date);
       this.ObjServiceContract.Payment_Status = data[0].Payment_Status;
       this.PaymentDate = new Date(data[0].Payment_Date)
    })
    }
  }
  onConfirm(){}
  onReject(){}

}
class ServiceContract{
  Customer_Name:string;
  Location:string;
  Machine_Manufacturer:string;
  Machine:string;
  Serial_No:any;
  Type_of_Service:string;
  Payment_Status:string;
}
class Browse{
  Customer_Name:string;
}
