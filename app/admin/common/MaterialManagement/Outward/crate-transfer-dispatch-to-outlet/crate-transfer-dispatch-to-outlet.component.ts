import { Component, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { HttpClient, HttpParams } from "@angular/common/http";
import { MessageService } from "primeng/api";
import { FileUpload } from "primeng/primeng";
declare var $: any;
import { CompacctCommonApi } from "../../../../shared/compacct.services/common.api.service";
import { CompacctGlobalApiService } from "../../../../shared/compacct.services/compacct.global.api.service";
import { DateTimeConvertService } from "../../../../shared/compacct.global/dateTime.service";
import { CompacctHeader } from "../../../../shared/compacct.services/common.header.service";
import { NgxUiLoaderService } from "ngx-ui-loader";

@Component({
  selector: 'app-crate-transfer-dispatch-to-outlet',
  templateUrl: './crate-transfer-dispatch-to-outlet.component.html',
  styleUrls: ['./crate-transfer-dispatch-to-outlet.component.css'],
  providers: [MessageService],
  encapsulation: ViewEncapsulation.None
})
export class CrateTransferDispatchToOutletComponent implements OnInit {
  items:any = [];
  Spinner = false;
  seachSpinner = false;
  tabIndexToView = 0;
  buttonname = "Save";
  ObjBrowse : Browse  = new Browse();
  BFromOutletList:any = [];
  Bfromoutletdisableflag:boolean = false;
  BFromGodownList:any = [];
  Bfromstockdisableflag:boolean = false;
  SearchFormSubmitted:boolean = false;
  Searchedlist:any = [];
  BackupGetToOutletList:any = [];
  lockdate:any;
  todayDate : Date;
  ObjCrateTransfer : CrateTransfer = new CrateTransfer();
  ObjCrateTransferFormSubmitted:boolean = false;
  FromOutletList:any = [];
  fromoutletdisableflag:boolean = false;
  FromGodownList:any = [];
  fromstockdisableflag:boolean = false;
  GetToOutletList:any = [];
  HeaderGetToOutletList:any = [];
  EditDocNo:any;
  currentdate = new Date();
  AcceptList:any = [];
  acceptchallanpopup:boolean = false;
  DocNO:any;
  docdate:any;
  fromoutletid: any;
  FromOutlet: any;
  FromStokePointid: any;
  FromStokePoint: any;
  tooutletid: any;
  ToOutlet: any;
  toStokePointid: any;
  toStokePoint: any;
  date: Date;
  Txnid: any;
  acceptcrate: any;
  cratein: any;
  crateAcceptFormSubmitted:boolean = false;
  deldocno: undefined;
  delfcostcen: undefined;
  delfgodown: undefined;
  ViewList:any = [];
  viewpopup: boolean = false;
  viewDocNO: any;
  vfromoutlet: any;
  vFromStokePoint: any;
  vtooutlet: any;
  vtoStokePoint: any;
  viewdate: Date;
  vacceptcrate: any;
  DistBrandName:any = [];
  SelectedDistBrandName:any = [];
  SearchFields:any = [];
  EditList:any = [];
  editcrate: any;

  constructor(
    private $http: HttpClient,
    private commonApi: CompacctCommonApi,
    private GlobalAPI: CompacctGlobalApiService,
    private Header: CompacctHeader,
    private DateService: DateTimeConvertService,
    public $CompacctAPI: CompacctCommonApi,
    private compacctToast: MessageService,
    private ngxService: NgxUiLoaderService
  ) { }

  ngOnInit() {
    this.items = ["BROWSE", "CREATE"];
    this.Header.pushHeader({
      Header: "Crate In / Out",
      Link: "Material Management -> Crate In / Out"
    });
    this.getLockDate();
    this.getBFromOutlet();
    this.getFromOutlet();
    this.getToOutlet();
  }
  TabClick(e) {
    this.tabIndexToView = e.index;
    this.items = ["BROWSE", "CREATE"];
    this.buttonname = "Save";
    this.clearData();
  }
  getLockDate(){
    const obj = {
     "SP_String": "sp_Comm_Controller",
     "Report_Name_String": "Get_LockDate"
   }
   this.GlobalAPI.getData(obj).subscribe((data:any)=>{
    this.lockdate = data[0].dated;
  
  })
  }
  checkLockDate(docdate){
    if(this.lockdate && docdate){
      if(new Date(docdate) > new Date(this.lockdate)){
        return true;
      } else {
        var msg = this.tabIndexToView === 0 ? "edit or delete" : "create";
        this.Spinner = false;
        this.ngxService.stop();
        this.compacctToast.clear();
        this.compacctToast.add({
         key: "compacct-toast",
         severity: "error",
         summary: "Warn Message",
         detail: "Can't "+msg+" this document. Transaction locked till "+ this.DateService.dateConvert(new Date (this.lockdate))
      });
        return false;
      }
    } else {
      this.Spinner = false;
      this.ngxService.stop();
      this.compacctToast.clear();
      this.compacctToast.add({
       key: "compacct-toast",
       severity: "error",
       summary: "Warn Message",
       detail: "Date not found."
      });
      return false;
    }
  }
  clearData(){
    this.todayDate = new Date();
    // this.getToGodown();
    this.ObjCrateTransfer.From_Cost_Cen_ID = this.$CompacctAPI.CompacctCookies.Cost_Cen_ID;
    this.fromoutletdisableflag = true;
    this.getFromGodown();

      if(this.$CompacctAPI.CompacctCookies.User_Type != 'A'){
        this.ObjBrowse.From_Cost_Cen_ID = this.$CompacctAPI.CompacctCookies.Cost_Cen_ID;
        this.Bfromoutletdisableflag = true;
        this.getBFromGodown();
        } else {
          this.ObjBrowse.From_Cost_Cen_ID = this.$CompacctAPI.CompacctCookies.Cost_Cen_ID;
          this.Bfromoutletdisableflag = false;
          this.getBFromGodown();
        }

    this.ObjCrateTransferFormSubmitted = false;
    this.Spinner = false;
    this.ngxService.stop();
    // this.EditList = [];
    this.getToOutlet();
  }
  getDateRange(dateRangeObj) {
    if (dateRangeObj.length) {
      this.ObjBrowse.start_date = dateRangeObj[0];
      this.ObjBrowse.end_date = dateRangeObj[1];
    }
  }
  getBFromOutlet(){
    const obj = {
      "SP_String": "SP_Controller_Master",
      "Report_Name_String": "Get - Cost Center Name All",
      "Json_Param_String": JSON.stringify([{User_ID:this.$CompacctAPI.CompacctCookies.User_ID}])
     }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
     this.BFromOutletList = data;
    //  console.log("this.BFromOutletList ======",this.BFromOutletList);
      
      if(this.$CompacctAPI.CompacctCookies.User_Type != 'A'){
        this.ObjBrowse.From_Cost_Cen_ID = this.$CompacctAPI.CompacctCookies.Cost_Cen_ID;
        this.Bfromoutletdisableflag = true;
        this.getBFromGodown();
        } else {
          this.ObjBrowse.From_Cost_Cen_ID = this.$CompacctAPI.CompacctCookies.Cost_Cen_ID;
          this.Bfromoutletdisableflag = false;
          this.getBFromGodown();
        }

    });
  }
  getBFromGodown(){
    const obj = {
      "SP_String": "SP_Production_Voucher",
      "Report_Name_String": "Get - Godown",
      "Json_Param_String": JSON.stringify([{Cost_Cen_ID:this.ObjBrowse.From_Cost_Cen_ID}])
     }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
     this.BFromGodownList = data;
     // console.log("this.BFromGodownList ======",this.BFromGodownList);
     if(this.BFromGodownList.length){
      if(this.ObjBrowse.From_Cost_Cen_ID == 2){
        this.ObjBrowse.From_Godown_Id = 56;
        this.Bfromstockdisableflag = false;
        } else if(this.BFromGodownList.length === 1){
          this.ObjBrowse.From_Godown_Id = this.BFromGodownList[0].godown_id;
          this.Bfromstockdisableflag = true;
        } else{
          this.ObjBrowse.From_Godown_Id = undefined;
          this.Bfromstockdisableflag = false;
        }
      } else{
        this.ObjBrowse.From_Godown_Id = undefined;
        this.Bfromstockdisableflag = false;
      }

    });
  }
  GetSearchedList(valid){
    this.SearchFormSubmitted = true;
    this.Searchedlist = [];
    const start = this.ObjBrowse.start_date
    ? this.DateService.dateConvert(new Date(this.ObjBrowse.start_date))
    : this.DateService.dateConvert(new Date());
    const end = this.ObjBrowse.end_date
    ? this.DateService.dateConvert(new Date(this.ObjBrowse.end_date))
    : this.DateService.dateConvert(new Date());
    if(valid){
      this.seachSpinner = true;
      const tempobj = {
      From_Date : start,
      To_Date	 : end,
      F_Cost_Cen_ID : this.ObjBrowse.From_Cost_Cen_ID,
      F_Godown_ID : this.ObjBrowse.From_Godown_Id,
      }
      const obj = {
      "SP_String": "SP_BL_Txn_K4C_Crate_IN_OUT",
      "Report_Name_String": "Get crate Tansfer",
      "Json_Param_String": JSON.stringify([tempobj])
      }
      this.GlobalAPI.getData(obj).subscribe((data:any)=>{
       this.Searchedlist = data;
       for(let i = 0; i < this.Searchedlist.length ; i++){
        //this.selectBox(i);
        if(this.Searchedlist[i].Crate_IN === 0){
         this.Searchedlist[i]['Crate_IN'] = this.Searchedlist[i]['Crate_Out']
        } else {
         this.Searchedlist[i]['Crate_IN'] = this.Searchedlist[i]['Crate_IN']
        }
        }
         this.seachSpinner = false;
         this.SearchFormSubmitted = false;
      })
    }
  }

  getFromOutlet(){
    const obj = {
      "SP_String": "SP_Controller_Master",
      "Report_Name_String": "Get - Cost Center Name All",
      "Json_Param_String": JSON.stringify([{User_ID:this.$CompacctAPI.CompacctCookies.User_ID}])
     }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
     this.FromOutletList = data;
          this.ObjCrateTransfer.From_Cost_Cen_ID = this.$CompacctAPI.CompacctCookies.Cost_Cen_ID;
          this.fromoutletdisableflag = true;
          this.getFromGodown();

    });
  }
  getFromGodown(){
    const obj = {
      "SP_String": "SP_Production_Voucher",
      "Report_Name_String": "Get - Godown",
      "Json_Param_String": JSON.stringify([{Cost_Cen_ID:this.ObjCrateTransfer.From_Cost_Cen_ID}])
     }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
     this.FromGodownList = data;
     // console.log("this.FromGodownList ======",this.FromGodownList);
     if(this.FromGodownList.length){
      if(this.ObjCrateTransfer.From_Cost_Cen_ID == 2){
        this.ObjCrateTransfer.From_Godown_Id = 56;
        this.fromstockdisableflag = false;
        } else if(this.FromGodownList.length === 1){
          this.ObjCrateTransfer.From_Godown_Id = this.FromGodownList[0].godown_id;
          this.fromstockdisableflag = true;
        } else{
          this.ObjCrateTransfer.From_Godown_Id = undefined;
          this.fromstockdisableflag = false;
        }
      } else{
        this.ObjCrateTransfer.From_Godown_Id = undefined;
        this.fromstockdisableflag = false;
      }

    });
  }
  getToOutlet(){
    this.GetToOutletList = [];
    this.HeaderGetToOutletList = [];
    this.BackupGetToOutletList = [];
    const obj = {
      "SP_String": "SP_BL_Txn_K4C_Crate_IN_OUT",
      "Report_Name_String": "Get Cost Center Name"
     }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      this.GetToOutletList = data;
      this.HeaderGetToOutletList = Object.keys(data[0]);
      this.BackupGetToOutletList = data;
      this.GetDistinct();
    });
  }
  // DISTINCT & FILTER
  GetDistinct() {
    let DBrandName:any = [];
    this.DistBrandName = [];
    this.SelectedDistBrandName =[];
    this.SearchFields =[];
    this.GetToOutletList.forEach((item) => {
   if (DBrandName.indexOf(item.Brand_ID) === -1) {
    DBrandName.push(item.Brand_ID);
   this.DistBrandName.push({ label: item.Brand_INI, value: item.Brand_ID });
   }
  });
     this.BackupGetToOutletList = [...this.GetToOutletList];
  }
  FilterDist() {
    let DBrandName:any = [];
    this.SearchFields =[];
  if (this.SelectedDistBrandName.length) {
    this.SearchFields.push('Brand_ID');
    DBrandName = this.SelectedDistBrandName;
  }
  this.GetToOutletList = [];
  if (this.SearchFields.length) {
    let LeadArr = this.BackupGetToOutletList.filter(function (e) {
      return (DBrandName.length ? DBrandName.includes(e['Brand_ID']) : true)
    });
  this.GetToOutletList = LeadArr.length ? LeadArr : [];
  } else {
  this.GetToOutletList = [...this.BackupGetToOutletList] ;
  }
  }
  SaveCrate(valid){
    this.ObjCrateTransferFormSubmitted = true;
    this.Spinner = true;
    this.ngxService.start();
    if(valid && this.checkLockDate(this.DateService.dateConvert(new Date(this.todayDate)))){
    this.compacctToast.clear();
    this.compacctToast.add({
    key: "c",
    sticky: true,
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
  onConfirm(){
      if(this.GetToOutletList.length){
        let CrateTransferList:any = [];
        this.GetToOutletList.forEach(element => {
          if(Number(element.Crate)){
          const tempObj = {
            Doc_No : this.buttonname != "Save" ? this.EditDocNo : 'A',
            Doc_Date : this.DateService.dateConvert(new Date(this.currentdate)),
            F_Cost_Cen_ID : this.$CompacctAPI.CompacctCookies.Cost_Cen_ID,
            F_Godown_ID : this.ObjCrateTransfer.From_Godown_Id,
            To_Cost_Cen_ID : element.Cost_Cen_ID,
            To_Cost_Cen_Name : element.Cost_Cen_Name,
            To_Godown_ID : 0,
            Transaction_Date : this.DateService.dateConvert(new Date(this.todayDate)),
            Crate_IN : Number(element.Crate),
            User_ID : this.$CompacctAPI.CompacctCookies.User_ID,
            Accepted_Crate : this.buttonname != "Save" ? Number(element.Accepted_Crate) : 0
          }
            CrateTransferList.push(tempObj);
          }
        });
      
      const obj = {
        "SP_String": "SP_BL_Txn_K4C_Crate_IN_OUT",
        "Report_Name_String": "Create_BL_Txn_K4C_Crate_IN_OUT",
        "Json_Param_String": JSON.stringify(CrateTransferList)
      }
      this.GlobalAPI.getData(obj).subscribe((data:any)=>{
        //console.log(data);
        var tempID = data[0].Column1;
        if(data[0].Column1){
          this.ngxService.stop();
          this.compacctToast.clear();
          const mgs = this.buttonname === 'Save' ? "Saved" : "Updated";
          this.compacctToast.add({
           key: "compacct-toast",
           severity: "success",
           summary: "Return_ID  " + tempID,
           detail: "Succesfully " + mgs
         });
        //  this.crateFormSubmitted = false;
        //  this.Spinner = false;
         if (this.buttonname != "Save") {
           this.clearData();
           this.tabIndexToView = 0;
           this.GetSearchedList(true);
         }
         else {
         this.clearData();
         this.getToOutlet();
         this.GetSearchedList(true);
         }
    
        } else{
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
      })
    
      }
      else {
        this.ngxService.stop();
        this.Spinner = false;
      }
    
  }
  onReject(){
    this.compacctToast.clear("c");
    this.ngxService.stop();
    this.Spinner = false;
    this.compacctToast.clear("d");
  }
  AcceptChallan(accptcrate){
    this.AcceptList = [];
    this.clearData();
    if(accptcrate.Doc_No){
    if(this.checkLockDate(accptcrate.Transaction_Date)){
      const ObjTemp = {
        Doc_No : accptcrate.Doc_No,
        To_Cost_Cen_ID : accptcrate.To_Cost_Cen_ID
      }
     const obj = {
       "SP_String": "SP_BL_Txn_K4C_Crate_IN_OUT",
       "Report_Name_String": "Get_accept_details",
       "Json_Param_String": JSON.stringify([ObjTemp])
     }
     this.GlobalAPI.getData(obj).subscribe((data:any)=>{
       this.AcceptList = data;
       this.acceptchallanpopup = true;
       this.DocNO = data[0].Doc_No;
       this.docdate = new Date(data[0].Transaction_Date);
       this.fromoutletid = data[0].F_Cost_Cen_ID;
       this.FromOutlet = data[0].F_Cost_Cen_Name;
       console.log("this.FromOutlet==",this.FromOutlet)
       this.FromStokePointid = data[0].F_Godown_ID;
       this.FromStokePoint = data[0].F_Godown_Name;
       this.tooutletid = data[0].To_Cost_Cen_ID;
       this.ToOutlet = data[0].To_Cost_Cen_Name;
       this.toStokePointid = data[0].To_Godown_ID;
       this.toStokePoint = data[0].To_Godown_Name;
       this.date = new Date(data[0].Transaction_Date);
       this.Txnid = data[0].Txn_ID;
       //this.acceptcrate = data[0].Crate_IN;
       if (data[0].Crate_IN == 0) {
        this.acceptcrate = data[0].Crate_Out;
        this.cratein = data[0].Crate_Out;
       }
       if (data[0].Crate_Out == 0) {
        this.acceptcrate = data[0].Crate_IN;
        this.cratein = data[0].Crate_IN;
       }
       //  console.log("AcceptList",this.AcceptList);
     })
    }
    }
  }
  SaveAccept(){
    this.crateAcceptFormSubmitted = true;
    const Objtemp = {
        Doc_No : this.DocNO,
        Doc_Date : this.DateService.dateConvert(new Date(this.docdate)), 
        F_Cost_Cen_ID : this.fromoutletid,
        F_Godown_ID : this.FromStokePointid,
        To_Cost_Cen_ID : this.tooutletid,
        To_Godown_ID : this.toStokePointid,
        Transaction_Date : this.DateService.dateConvert(new Date(this.date)),
        Crate_IN : Number(this.cratein),
        Crate_Out : 0,
        User_ID : this.$CompacctAPI.CompacctCookies.User_ID,
        Txn_ID : this.Txnid,
        Accepted_Crate : Number(this.acceptcrate)
    }
    if(this.acceptcrate){
      const obj = {
        "SP_String": "SP_BL_Txn_K4C_Crate_IN_OUT",
        "Report_Name_String": "Update_BL_Txn_K4C_Crate_IN_OUT",
        "Json_Param_String": JSON.stringify([Objtemp])
      }
      this.GlobalAPI.getData(obj).subscribe((data:any)=>{
        //console.log(data);
       // var tempID = data[0].Column1;
        if(data[0].Column1){
         // this.ngxService.stop();
          this.compacctToast.clear();
         // const mgs = this.buttonname === 'Save' ? "Saved" : "updated";
          this.compacctToast.add({
           key: "compacct-toast",
           severity: "success",
           summary: "",//"Return_ID  " + tempID,
           detail: "Succesfully updated "
         });
          this.crateAcceptFormSubmitted = false;
          this.acceptchallanpopup = false;
          this.GetSearchedList(true);
        //  this.Spinner = false;
        //  this.clearData();
        //  this.tabIndexToView = 0;
    
        } else{
         // this.ngxService.stop();
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
  }
  Delete(del){
    this.deldocno = undefined ;
    this.delfcostcen = undefined;
    this.delfgodown = undefined;
    if(del.Doc_No){
    if(this.checkLockDate(del.Transaction_Date)){
    this.deldocno = del.Doc_No;
    this.delfcostcen = del.F_Cost_Cen_ID;
    this.delfgodown = del.F_Godown_ID;
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
  }
  onConfirmdelete(){
    const Tempobj = {
      Doc_No : this.deldocno,
      F_Cost_Cen_ID : this.delfcostcen,
      F_Godown_ID : this.delfgodown
    }
    const obj = {
      "SP_String" : "SP_BL_Txn_K4C_Crate_IN_OUT",
      "Report_Name_String" : "Delete_BL_Txn_K4C_Crate_IN_OUT",
      "Json_Param_String" : JSON.stringify([Tempobj])
    }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
     // console.log(data);
      if(data[0].Column1 === "Done") {
        this.compacctToast.clear();
        this.compacctToast.add({
          key: "compacct-toast",
          severity: "success",
          summary: "Return_ID : " + this.deldocno,
          detail:  "Succesfully Delete"
        });
        this.GetSearchedList(true);
      } else{
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
  View(view){
    this.ViewList = [];
    this.clearData();
    if(view.Doc_No){
      const ObjTemp = {
        Doc_No : view.Doc_No,
        F_Cost_Cen_ID : view.F_Cost_Cen_ID,
        F_Godown_ID : view.F_Godown_ID
      }
     const obj = {
       "SP_String": "SP_BL_Txn_K4C_Crate_IN_OUT",
       "Report_Name_String": "Get_BL_Txn_K4C_Crate_IN_OUT_Data",
       "Json_Param_String": JSON.stringify([ObjTemp])
     }
     this.GlobalAPI.getData(obj).subscribe((data:any)=>{
       this.ViewList = data;
       this.viewpopup = true;
       this.viewDocNO = data[0].Doc_No;
       this.vfromoutlet = data[0].F_Cost_Cen_Name;
       this.vFromStokePoint = data[0].F_Godown_Name;
       this.vtooutlet = data[0].To_Cost_Cen_Name;
       this.viewdate = new Date(data[0].Doc_Date);
       for(let i = 0; i < this.ViewList.length ; i++){
       if (this.ViewList[i].Crate_IN == 0) {
        this.ViewList[i].Accepted_Crate = this.ViewList[i].Crate_Out;
       }
       if (this.ViewList[i].Crate_Out == 0) {
        this.ViewList[i].Accepted_Crate = this.ViewList[i].Crate_IN;
       }
       }
     })
   
    }
  }
  Edit(edit){
    this.EditList = [];
    //this.clearData();
    this.getToOutlet();
    this.EditDocNo = undefined;
    this.todayDate = new Date();
    if(edit.Doc_No){
    if(this.checkLockDate(edit.Transaction_Date)){
      this.EditDocNo = edit.Doc_No;
      this.todayDate = new Date(edit.Transaction_Date)
      this.tabIndexToView = 1;
      this.items = ["BROWSE", "UPDATE"];
      this.buttonname = "Update";
      const ObjT = {
        Doc_No : edit.Doc_No,
        F_Cost_Cen_ID : edit.F_Cost_Cen_ID,
        F_Godown_ID : edit.F_Godown_ID
      }
     const obj = {
       "SP_String": "SP_BL_Txn_K4C_Crate_IN_OUT",
       "Report_Name_String": "Get_BL_Txn_K4C_Crate_IN_OUT_Data",
       "Json_Param_String": JSON.stringify([ObjT])
     }
     this.GlobalAPI.getData(obj).subscribe((data:any)=>{
       this.EditList = data;
        setTimeout(() => {
          this.BackupGetToOutletList.forEach(ele => {
          const ARR = this.EditList.filter(item => (Number(item.To_Cost_Cen_ID) == Number(ele.Cost_Cen_ID)))
          // console.log("ARR",ARR)
          if (ARR.length) {
            ele['Crate'] = ARR[0].Crate_Out
            ele['cratedisabled'] = (Number(ARR[0].Accepted_Crate) === Number(ARR[0].Crate_Out)) ? true : false
            ele['Accepted_Crate'] = ARR[0].Accepted_Crate
          }
          this.GetToOutletList = [...this.BackupGetToOutletList];
        });
      }, 600)
     })
    }
    }
  }

}
class Browse {
  start_date : Date ;
  end_date : Date;
  From_Cost_Cen_ID : any;
  From_Godown_Id : any;
}
class CrateTransfer {
  From_Cost_Cen_ID : any;
  From_Godown_Id : any;
}
