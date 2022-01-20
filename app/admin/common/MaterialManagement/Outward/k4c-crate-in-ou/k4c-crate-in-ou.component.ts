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
  selector: 'app-k4c-crate-in-ou',
  templateUrl: './k4c-crate-in-ou.component.html',
  styleUrls: ['./k4c-crate-in-ou.component.css'],
  providers: [MessageService],
  encapsulation: ViewEncapsulation.None
})
export class K4cCrateInOuComponent implements OnInit {
  items = [];
  Spinner = false;
  seachSpinner = false;
  tabIndexToView = 0;
  buttonname = "Save"
  Objcrate : crate = new crate ();
  todayDate : Date;
  currentdate = new Date();
  crateFormSubmitted = false;
  fromoutletdisableflag = false;
  fromstockdisableflag = false;
  tooutletdisableflag = false;
  tostockdisableflag = false;
  FromOutletList = [];
  FromGodownList = [];
  ToOutletList = [];
  ToGodownList = [];

  ObjBrowse : Browse  = new Browse();
  SearchFormSubmitted = false;
  Bfromoutletdisableflag = false;
  Bfromstockdisableflag = false;
  Searchedlist = [];
  BFromOutletList = [];
  BFromGodownList = [];
  editList = [];
  AcceptList = [];
  crateinout = undefined;

  acceptchallanpopup = false;
  DocNO = undefined;
  docdate: Date;
  FromStokePoint = undefined;
  toStokePoint = undefined;
  date: Date;
  acceptcrate = undefined;
  FromOutlet = undefined;
  ToOutlet = undefined;
  crateAcceptFormSubmitted = false;
  fromoutletid = undefined;
  FromStokePointid = undefined;
  tooutletid = undefined;
  toStokePointid = undefined;
  Txnid = undefined;
  cratein = undefined;

  viewpopup = false;
  ViewList = undefined;
  viewDocNO = undefined;
  vfromoutlet = undefined;
  vFromStokePoint = undefined;
  vtooutlet = undefined;
  vtoStokePoint = undefined;
  vdate: Date;
  vacceptcrate = undefined;

  EditList = [];
  EditDocNo = undefined;
  deldocno = undefined;
  delfcostcen = undefined;
  delfgodown = undefined;
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
    this.getFromOutlet();
    this.getToOutlet();
    this.getBFromOutlet();
  }
  TabClick(e) {
    this.tabIndexToView = e.index;
    this.items = ["BROWSE", "CREATE"];
    this.buttonname = "Save";
    //this.todayDate = new Date();
    this.clearData();
  }
  getFromOutlet(){
    const obj = {
      "SP_String": "SP_Controller_Master",
      "Report_Name_String": "Get - Cost Center Name All",
      "Json_Param_String": JSON.stringify([{User_ID:this.$CompacctAPI.CompacctCookies.User_ID}])
      //"Json_Param_String": JSON.stringify([{User_ID : 61}])
     }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
     this.FromOutletList = data;
     //this.Objcrate.From_Cost_Cen_ID = this.$CompacctAPI.CompacctCookies.Cost_Cen_ID;
    // this.fromoutletdisableflag = true;
    // this.getFromGodown();
     //this.Objcrate.From_Cost_Cen_ID = this.FromOutlet.length === 1 ? this.FromOutlet[0].Cost_Cen_ID : undefined;
    //  if(this.FromOutlet.length === 1) {
    //   this.Objcrate.From_Cost_Cen_ID = this.FromOutlet[0].Cost_Cen_ID;
    //  } 
    //  else {
    //   this.Objcrate.From_Cost_Cen_ID = undefined;
    //  }
    //  console.log("this.FromOutletList ======",this.FromOutletList);
      
      // if(this.$CompacctAPI.CompacctCookies.User_Type != 'A'){
      //   //this.ObjBrowseStockView.Outlet = this.Outletid.length === 1 ? this.Outletid[0].Cost_Cen_ID : undefined;
      //   this.Objcrate.From_Cost_Cen_ID = this.$CompacctAPI.CompacctCookies.Cost_Cen_ID;
      //   this.fromoutletdisableflag = true;
      //   this.getFromGodown();
      //   } else {
          this.Objcrate.From_Cost_Cen_ID = this.$CompacctAPI.CompacctCookies.Cost_Cen_ID;
          this.fromoutletdisableflag = true;
          this.getFromGodown();
       // }

    });
  }
  getFromGodown(){
    const obj = {
      "SP_String": "SP_Production_Voucher",
      "Report_Name_String": "Get - Godown",
      "Json_Param_String": JSON.stringify([{Cost_Cen_ID:this.Objcrate.From_Cost_Cen_ID}])
      //"Json_Param_String": JSON.stringify([{User_ID : 61}])
     }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
     this.FromGodownList = data;
     //this.Objcrate.From_Godown_Id = this.FromGodownList.length === 1 ? this.FromGodownList[0].godown_id : undefined;
     if(this.FromGodownList.length === 1){
      this.Objcrate.From_Godown_Id = this.FromGodownList[0].godown_id;
      this.fromstockdisableflag = true;
     }else{
       this.Objcrate.From_Godown_Id = undefined;
       this.fromstockdisableflag = false;
     }
     // console.log("this.FromGodownList ======",this.FromGodownList);

    });
  }
  getToOutlet(){
    const obj = {
      "SP_String": "SP_Controller_Master",
      "Report_Name_String": "Get - Cost Center Name All",
      "Json_Param_String": JSON.stringify([{User_ID:this.$CompacctAPI.CompacctCookies.User_ID}])
      //"Json_Param_String": JSON.stringify([{User_ID : 61}])
     }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
     this.ToOutletList = data;
     //this.Objcrate.To_Cost_Cen_ID = this.$CompacctAPI.CompacctCookies.Cost_Cen_ID;
     //this.getToGodown();
     if (this.$CompacctAPI.CompacctCookies.Cost_Cen_ID != 2) {
      this.Objcrate.To_Cost_Cen_ID = 2;
      this.tooutletdisableflag = true;
      this.getToGodown();
     }
    //  console.log("this.ToOutletList ======",this.ToOutletList);

    });
  }
  getToGodown(){
    const obj = {
      "SP_String": "SP_Production_Voucher",
      "Report_Name_String": "Get - Godown",
      "Json_Param_String": JSON.stringify([{Cost_Cen_ID:this.Objcrate.To_Cost_Cen_ID}])
      //"Json_Param_String": JSON.stringify([{User_ID : 61}])
     }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
     this.ToGodownList = data;
     //this.Objcrate.From_Godown_Id = this.FromGodownList.length === 1 ? this.FromGodownList[0].godown_id : undefined;
     if (this.buttonname != "Update") {
     if(this.ToGodownList.length === 1){
      this.Objcrate.To_Godown_Id = this.ToGodownList[0].godown_id;
       this.tostockdisableflag = true;
     }else{
       this.Objcrate.To_Godown_Id = undefined;
       this.tostockdisableflag = false;
     }
    // } else {
    //   if(this.ToGodownList.length === 1){
    //     this.Objcrate.To_Godown_Id = this.ToGodownList[0].godown_id;
    //      this.tostockdisableflag = true;
    //    }else{
    //      this.Objcrate.To_Godown_Id = undefined;
    //      this.tostockdisableflag = false;
    //    }
    }
    //  console.log("this.ToGodownList ======",this.ToGodownList);

    });
  }
  SaveCrate(valid){
    this.crateFormSubmitted = true;
    //this.Spinner = true;
    this.ngxService.start();
    const tempObj = {
      Doc_No : this.buttonname != "Save" ? this.EditDocNo : 'A',
      Doc_Date : this.DateService.dateConvert(new Date(this.currentdate)),
      F_Cost_Cen_ID : this.$CompacctAPI.CompacctCookies.Cost_Cen_ID,
      F_Godown_ID : this.Objcrate.From_Godown_Id,
      To_Cost_Cen_ID : this.Objcrate.To_Cost_Cen_ID,
      To_Godown_ID : this.Objcrate.To_Godown_Id,
      Transaction_Date : this.DateService.dateConvert(new Date(this.todayDate)),
      Crate_IN : Number(this.Objcrate.Crate),
     // Crate_Out : Number(this.Objcrate.Crate),
      User_ID : this.$CompacctAPI.CompacctCookies.User_ID,
      Accepted_Crate : this.buttonname != "Save" ? Number(this.editcrate) : 0
    }
    // const Objtemp = {
    //   Doc_No : 'A',
    //     Doc_Date : this.DateService.dateConvert(new Date(this.currentdate)), 
    //     F_Cost_Cen_ID : 0,
    //     F_Godown_ID : 0,
    //     To_Cost_Cen_ID : this.Objcrate.To_Cost_Cen_ID,
    //     To_Godown_ID : this.Objcrate.To_Godown_Id,
    //     Transaction_Date : this.DateService.dateConvert(new Date(this.todayDate)),
    //     Crate_IN : Number(this.Objcrate.Crate),
    //     Crate_Out : 0,
    //     User_ID : this.$CompacctAPI.CompacctCookies.User_ID,
    // }
    if(valid){
      const obj = {
        "SP_String": "SP_BL_Txn_K4C_Crate_IN_OUT",
        "Report_Name_String": "Create_BL_Txn_K4C_Crate_IN_OUT",
        "Json_Param_String": JSON.stringify([tempObj])
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
         }
        //  this.GetSearchedList(true);
    
        } else{
          this.ngxService.stop();
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
    else{
      this.ngxService.stop();
      this.compacctToast.clear();
      this.compacctToast.add({
        key: "compacct-toast",
        severity: "error",
        summary: "Warn Message",
        detail: "Error Occured "
      });
    }
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
      //"Json_Param_String": JSON.stringify([{User_ID : 61}])
     }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
     this.BFromOutletList = data;
     //this.Objcrate.From_Cost_Cen_ID = this.$CompacctAPI.CompacctCookies.Cost_Cen_ID;
    // this.fromoutletdisableflag = true;
    // this.getFromGodown();
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
      //"Json_Param_String": JSON.stringify([{User_ID : 61}])
     }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
     this.BFromGodownList = data;
     //this.Objcrate.From_Godown_Id = this.FromGodownList.length === 1 ? this.FromGodownList[0].godown_id : undefined;
     if(this.BFromGodownList.length === 1){
      this.ObjBrowse.From_Godown_Id = this.BFromGodownList[0].godown_id;
      this.Bfromstockdisableflag = true;
     }else{
       this.ObjBrowse.From_Godown_Id = undefined;
       this.Bfromstockdisableflag = false;
     }
     // console.log("this.BFromGodownList ======",this.BFromGodownList);

    });
  }
  GetSearchedList(valid){
    //console.log(valid)
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
  "Report_Name_String": "Browse_BL_Txn_K4C_Crate_IN_OUT",
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
  //  this.Searchedlist.forEach(el =>{
  //  if (el.Crate_IN == 0) {
  //   this.crateinout = el.Crate_Out;
  //  }
  //  if (el.Crate_Out == 0) {
  //   this.crateinout = el.Crate_IN;
  //  }
  // })
  // console.log('Search list=====',this.Searchedlist)
   this.seachSpinner = false;
   this.SearchFormSubmitted = false;
  })
  }
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
       this.vtoStokePoint = data[0].To_Godown_Name;
       this.vdate = new Date(data[0].Transaction_Date);
       //this.vacceptcrate = data[0].Crate_Out;
       if (data[0].Crate_IN == 0) {
        this.vacceptcrate = data[0].Crate_Out;
       }
       if (data[0].Crate_Out == 0) {
        this.vacceptcrate = data[0].Crate_IN;
       }
      //  this.AcceptList.forEach(el =>{
      //   if(!el.Accepted_Qty){
      //     el.Accepted_Qty = el.Qty;
      //   }
      // })
       //  console.log("ViewList",this.ViewList);
     })
   
    }
   }
  AcceptChallan(accptcrate){
    this.AcceptList = [];
    this.clearData();
    if(accptcrate.Doc_No){
      const ObjTemp = {
        Doc_No : accptcrate.Doc_No,
        F_Cost_Cen_ID : accptcrate.F_Cost_Cen_ID,
        F_Godown_ID : accptcrate.F_Godown_ID
      }
     const obj = {
       "SP_String": "SP_BL_Txn_K4C_Crate_IN_OUT",
       "Report_Name_String": "Get_BL_Txn_K4C_Crate_IN_OUT_Data",
       "Json_Param_String": JSON.stringify([ObjTemp])
     }
     this.GlobalAPI.getData(obj).subscribe((data:any)=>{
       this.AcceptList = data;
       this.acceptchallanpopup = true;
       this.DocNO = data[0].Doc_No;
       this.docdate = new Date(data[0].Doc_Date);
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
      //  this.AcceptList.forEach(el =>{
      //   if(!el.Accepted_Qty){
      //     el.Accepted_Qty = el.Qty;
      //   }
      // })
       //  console.log("AcceptList",this.AcceptList);
     })
   
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
  Edit(edit){
    this.EditList = [];
    //this.clearData();
    if(edit.Doc_No){
      this.EditDocNo = edit.Doc_No;
      this.editcrate = edit.Accepted_Crate;
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
       this.todayDate = new Date(data[0].Transaction_Date);
       this.Objcrate.From_Cost_Cen_ID = data[0].F_Cost_Cen_ID;
       this.Objcrate.From_Godown_Id = data[0].F_Godown_ID;
       //this.getFromGodown();
       this.Objcrate.To_Cost_Cen_ID = data[0].To_Cost_Cen_ID;
       this.getToGodown();
       this.Objcrate.To_Godown_Id = data[0].To_Godown_ID;
       //this.Txnid = data[0].Txn_ID;
       if (data[0].Crate_IN == 0) {
        this.Objcrate.Crate = data[0].Crate_Out;
       }
       if (data[0].Crate_Out == 0) {
        this.Objcrate.Crate = data[0].Crate_IN;
       }
       //  console.log("EditList",this.EditList);
     })
   
    }
  }
  Delete(del){
    this.deldocno = undefined ;
    this.delfcostcen = undefined;
    this.delfgodown = undefined;
    if(del.Doc_No){
    this.deldocno = del.Doc_No;
    this.delfcostcen = del.F_Cost_Cen_ID;
    this.delfgodown = del.F_Godown_ID;
    this.compacctToast.clear();
    this.compacctToast.add({
    key: "c",
    sticky: true,
    severity: "warn",
    summary: "Are you sure?",
    detail: "Confirm to proceed"
    });
    }
  }
  onConfirm(){
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
  onReject(){
    this.compacctToast.clear("c");
  }
  clearData(){
    this.todayDate = new Date();
    this.Objcrate.Crate = undefined;
    // this.Objcrate.From_Cost_Cen_ID = this.$CompacctAPI.CompacctCookies.Cost_Cen_ID;
    // this.Objcrate.From_Godown_Id = undefined;
    // this.fromstockdisableflag = false;  
    //this.Objcrate.To_Cost_Cen_ID = undefined;
    if (this.$CompacctAPI.CompacctCookies.Cost_Cen_ID != 2) {
      this.Objcrate.To_Cost_Cen_ID = 2;
      this.tooutletdisableflag = true;
      this.getToGodown();
     }
    this.getToGodown();
    //this.Objcrate.To_Godown_Id = undefined;
    //this.tostockdisableflag = false;
    // if(this.$CompacctAPI.CompacctCookies.User_Type != 'A'){
    //   this.Objcrate.From_Cost_Cen_ID = this.$CompacctAPI.CompacctCookies.Cost_Cen_ID;
    //   this.fromoutletdisableflag = true;
    //   this.getFromGodown();
    //   } else {
        this.Objcrate.From_Cost_Cen_ID = this.$CompacctAPI.CompacctCookies.Cost_Cen_ID;
        this.fromoutletdisableflag = true;
        this.getFromGodown();
    //  }
    
    // if(this.ToGodownList.length === 1){
    //   this.Objcrate.To_Godown_Id = this.ToGodownList[0].godown_id;
    //    this.tostockdisableflag = true;
    //  }else{
    //    this.Objcrate.To_Godown_Id = undefined;
    //    this.tostockdisableflag = false;
    //  }

      if(this.$CompacctAPI.CompacctCookies.User_Type != 'A'){
        this.ObjBrowse.From_Cost_Cen_ID = this.$CompacctAPI.CompacctCookies.Cost_Cen_ID;
        this.Bfromoutletdisableflag = true;
        this.getBFromGodown();
        } else {
          this.ObjBrowse.From_Cost_Cen_ID = this.$CompacctAPI.CompacctCookies.Cost_Cen_ID;
          this.Bfromoutletdisableflag = false;
          this.getBFromGodown();
        }

    this.crateFormSubmitted = false;
    this.Spinner = false;
    this.ngxService.stop();
    this.EditList = [];
  }

}
  class crate {
    From_Cost_Cen_ID : any;
    From_Godown_Id : any;
    To_Cost_Cen_ID : any;
    To_Godown_Id : any;
    Crate : number;
    //Crate_Out : number
  }
  class Browse {
    start_date : Date ;
    end_date : Date;
    From_Cost_Cen_ID : any;
    From_Godown_Id : any;
  }
