import { Component, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { HttpClient, HttpParams } from "@angular/common/http";
import { CompacctCommonApi } from "../../../../shared/compacct.services/common.api.service";
import { CompacctGlobalApiService } from '../../../../shared/compacct.services/compacct.global.api.service';
import { CompacctHeader } from "../../../../shared/compacct.services/common.header.service";
import { MessageService } from "primeng/api";
import { FileUpload } from "primeng/primeng";
import { DateTimeConvertService } from '../../../../shared/compacct.global/dateTime.service';
import { DateNepalConvertService } from '../../../../shared/compacct.global/dateNepal.service';
declare var NepaliFunctions: any;
const NepaliDate = require('nepali-date');

@Component({
  selector: 'app-engg-crm-installed-machine',
  templateUrl: './engg-crm-installed-machine.component.html',
  styleUrls: ['./engg-crm-installed-machine.component.css'],
  providers: [MessageService],
  encapsulation: ViewEncapsulation.None
})
export class EnggCrmInstalledMachineComponent implements OnInit {
  tabIndexToView = 0;
  url = window["config"];
  persons: [];
  buttonname = "Save";
  Spinner = false;
  seachSpinner = false;
  items = [];

  ObjInstalledMachine = new InstalledMachine();
  InstalledMachineFormSubmit = false;
  MfList = [];
  MachineList = [];
  CustomerList = [];
  LoctionList = [];
  EngineerList = [];
  StatusList = [];

  ObjBrowse = new Browse();
  SearchFormSubmit = false;
  BrowseList = [];
  EditList = [];
  trnid = undefined;
  // memberid = undefined;
  // deluserid = undefined;
  // delmemberid = undefined;
  CurrentDateNepal = undefined;
  DateOfInstallation : any = {};
  cols = [];

  constructor(
    private $http: HttpClient,
    private commonApi: CompacctCommonApi,
    private GlobalAPI: CompacctGlobalApiService,
    private Header: CompacctHeader,
    private compacctToast: MessageService,
    private DateService: DateTimeConvertService,
    private DateNepalConvertService : DateNepalConvertService
  ) {
    this.CurrentDateNepal = this.DateNepalConvertService.GetNepaliCurrentDateNew();
   }

  ngOnInit() {
    this.items = ["BROWSE", "CREATE"];
    this.Header.pushHeader({
      Header: "Installed Machine",
      Link: " Engineering CRM -> Master -> Installed Machine"
    });
      this.DateOfInstallation = this.CurrentDateNepal;
      this.GetManufacturer();
      this.GetCustomer();
      this.GetEngineer();
      this.getStatus();

      this.cols = [
        { field: 'Mfg_Company', header: 'Manufacturer' },
        { field: 'Machine', header: 'Machine' },
        { field: 'Serial_No', header: 'Serial No' },
        { field: 'Location_Name', header: 'Location' },
        { field: 'Status', header: 'Status' }
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
    this.ObjInstalledMachine = new InstalledMachine();
    this.InstalledMachineFormSubmit = false;
    this.MachineList = [];
    this.LoctionList = [];
    // this.GetBrowseList();
     this.EditList = [];
     this.trnid = undefined;
    // this.memberid = undefined;
    // this.deluserid = undefined;
    // this.delmemberid = undefined;
    this.DateOfInstallation = this.CurrentDateNepal;
  }
  GetManufacturer(){
    const obj = {
      "SP_String": "SP_Engg_CRM_Installed_Machine",
      "Report_Name_String": "Get_Manufacturer"
     }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
     this.MfList = data;
    // console.log('MfList ==', this.MfList)
  
    });
  }
  GetMachine(){
    const TObj = {
      Product_Mfg_Comp_ID : this.ObjInstalledMachine.Machine_Manufacturer
    }
    const obj = {
      "SP_String": "SP_Engg_CRM_Installed_Machine",
      "Report_Name_String": "Get_Machine",
      "Json_Param_String": JSON.stringify([TObj])
     }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      data.forEach(element => {
        element['label'] = element.Machine,
        element['value'] = element.Product_ID
      });
     this.MachineList = data;
    // console.log('MachineList ==', this.MachineList)
  
    });
  }
  GetCustomer(){
    const obj = {
      "SP_String": "SP_Engg_CRM_Installed_Machine",
      "Report_Name_String": "Get_Customer"
     }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      if(data.length) {
          data.forEach(element => {
            element['label'] = element.Sub_Ledger_Name,
            element['value'] = element.Sub_Ledger_ID
          });
     this.CustomerList = data;
    }
    // console.log('CustomerList ==', this.CustomerList)
  
    });
  }
  GetLocation(){
    const TObj = {
      Sub_Ledger_ID : this.ObjInstalledMachine.Customer_Name
    }
    const obj = {
      "SP_String": "SP_Engg_CRM_Installed_Machine",
      "Report_Name_String": "Get_Location",
      "Json_Param_String": JSON.stringify([TObj])
     }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
     this.LoctionList = data;
     console.log('LoctionList ==', this.LoctionList)
  
    });
  }
  GetEngineer(){
    // const TObj = {
    //   Product_Mfg_Comp_ID : this.ObjServiceContract.Machine_Manufacturer
    // }
    const obj = {
      "SP_String": "SP_Engg_CRM_Installed_Machine",
      "Report_Name_String": "Get_Engineer",
      //"Json_Param_String": JSON.stringify([TObj])
     }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
     this.EngineerList = data;
    // console.log('SerialNoList ==', this.SerialNoList)
  
    });
  }
  getStatus(){
  //  console.log("StatusList ===", this.StatusList)
      this.StatusList =[
        {Name : "Active"},
        {Name : "Standby"},
        {Name : "Not in Use"}
        // {value : "Active" , Name : "Active"},
        // {value : "Standby" , Name : "Standby"},
        // {value : "Not in Use" , Name : "Not in Use"}
      ];

  }
 
  SaveInstalledMachine(valid){
    this.InstalledMachineFormSubmit = true;
    this.Spinner = true;
    if(valid && this.trnid){
      const Obj = {
        Trn_ID  : this.trnid,
        Product_ID : this.ObjInstalledMachine.Machine,
        Sub_Ledger_ID : this.ObjInstalledMachine.Customer_Name,
        Location_ID : this.ObjInstalledMachine.Location,
        Serial_No : this.ObjInstalledMachine.Serial_No,
        Engg_User_ID : this.ObjInstalledMachine.Engineer_Name,
        Status : this.ObjInstalledMachine.Status,
        Year_Manufacturing : this.ObjInstalledMachine.Year_Manufacturing,
        Installation_Date : this.DateService.dateConvert(this.DateNepalConvertService.convertNepaliDateToEngDate(this.DateOfInstallation)),
        Installation_Date_Nepali : this.DateOfInstallation,
      }
         const obj = {
           "SP_String": "SP_Engg_CRM_Installed_Machine",
           "Report_Name_String" : "Update_Engg_CRM_Installed_Machine",
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
           this.trnid = undefined;
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
    this.InstalledMachineFormSubmit = true;
    this.Spinner = true;
    if(valid) {
      const TempObj = {
        Product_ID : this.ObjInstalledMachine.Machine,
        Sub_Ledger_ID : this.ObjInstalledMachine.Customer_Name,
        Location_ID : this.ObjInstalledMachine.Location,
        Serial_No : this.ObjInstalledMachine.Serial_No,
        Engg_User_ID : this.ObjInstalledMachine.Engineer_Name,
        Status : this.ObjInstalledMachine.Status,
        Year_Manufacturing : this.ObjInstalledMachine.Year_Manufacturing,
        Installation_Date : this.DateService.dateConvert(this.DateNepalConvertService.convertNepaliDateToEngDate(this.DateOfInstallation)),
        Installation_Date_Nepali : this.DateOfInstallation
      }
      const obj = {
        "SP_String": "SP_Engg_CRM_Installed_Machine",
        "Report_Name_String": "Create_Engg_CRM_Installed_Machine",
        "Json_Param_String":  JSON.stringify([TempObj])
      }
      this.GlobalAPI.postData(obj).subscribe((data:any)=>{
        console.log(data);
        if(data[0].Column1) {
          this.compacctToast.clear();
          this.compacctToast.add({
            key: "compacct-toast",
            severity: "success",
            summary: "Installed Machine",
            detail:  "Succesfully Saved"
          });
          this.InstalledMachineFormSubmit = false;
          this.Spinner = false;
          this.ObjInstalledMachine = new InstalledMachine();
          this.DateOfInstallation = this.CurrentDateNepal;
          this.MachineList = [];
          this.LoctionList = [];

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
      //Status : this.ObjBrowse.Status
    }
    const obj = {
    "SP_String": "SP_Engg_CRM_Installed_Machine",
    "Report_Name_String": "Browse_Engg_CRM_Installed_Machine",
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
  Edit(edit){
    this.clearData();
    if(edit.Trn_ID) {
      this.trnid = edit.Trn_ID;
      this.tabIndexToView = 1;
      this.items = ["BROWSE", "UPDATE"];
      this.buttonname = "Update";
      const ObjT = {
        Trn_ID : this.trnid
      }
     const obj = {
       "SP_String": "SP_Engg_CRM_Installed_Machine",
       "Report_Name_String": "Get_Engg_CRM_Installed_Machine_Data",
       "Json_Param_String": JSON.stringify([ObjT])
     }
     this.GlobalAPI.getData(obj).subscribe((data:any)=>{
       this.EditList = data;
       this.ObjInstalledMachine.Machine_Manufacturer = data[0].Product_Mfg_Comp_ID;
       this.GetMachine();
       this.ObjInstalledMachine.Machine = data[0].Product_ID;
       this.ObjInstalledMachine.Customer_Name = data[0].Sub_Ledger_ID;
       this.GetLocation();
       this.ObjInstalledMachine.Location = data[0].Location_ID;
       this.ObjInstalledMachine.Serial_No = data[0].Serial_No;
       this.ObjInstalledMachine.Engineer_Name = data[0].Engg_User_ID;
       this.ObjInstalledMachine.Status = data[0].Status;
       this.ObjInstalledMachine.Year_Manufacturing = data[0].Year_Manufacturing;
       this.DateOfInstallation = this.DateNepalConvertService.convertEngDateToNepaliDateObj(data[0].Installation_Date);
    })
    }
  }
  // Delete(del){
    // this.deluserid = undefined ;
    // this.delmemberid = undefined;
    // if(del.User_ID){
    // this.deluserid = del.User_ID;
    // this.delmemberid = del.Member_ID;
    // this.compacctToast.clear();
    // this.compacctToast.add({
    // key: "c",
    // sticky: true,
    // severity: "warn",
    // summary: "Are you sure?",
    // detail: "Confirm to proceed"
    // });
    // }
  // }
  onConfirm(){
    // const Tempobj = {
    //   User_ID : this.deluserid,
    //   Member_ID : this.delmemberid
    // }
    // const obj = {
    //   "SP_String" : "SP_BL_CRM_Engg_Master_Nepal",
    //   "Report_Name_String" : "Delete_Engg_Master",
    //   "Json_Param_String" : JSON.stringify([Tempobj])
    // }
    // this.GlobalAPI.getData(obj).subscribe((data:any)=>{
    //  // console.log(data);
    //   if(data[0].Column1 === "Done") {
    //     this.compacctToast.clear();
    //     this.compacctToast.add({
    //       key: "compacct-toast",
    //       severity: "success",
    //       summary: "Engineer Master",
    //       detail:  "Succesfully Delete"
    //     });
    //     this.GetBrowseList();
    //   } else{
    //     this.compacctToast.clear();
    //     this.compacctToast.add({
    //       key: "compacct-toast",
    //       severity: "error",
    //       summary: "Warn Message",
    //       detail: "Error Occured "
    //     });
    //   }
    // })
  }
  onReject(){
    // this.compacctToast.clear("c");
  }

}
class InstalledMachine{
  Machine_Manufacturer:string;
  Machine:string;
  Customer_Name:string;
  Location:string;
  Serial_No:any;
  Engineer_Name:any;
  Status:string;
  Year_Manufacturing:any;
}
class Browse{
  Customer_Name:string;
  Status:string;
}
