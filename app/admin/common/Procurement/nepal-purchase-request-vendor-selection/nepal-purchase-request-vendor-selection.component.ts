import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { DateTimeConvertService } from '../../../shared/compacct.global/dateTime.service';
import { CompacctCommonApi } from '../../../shared/compacct.services/common.api.service';
import { CompacctHeader } from '../../../shared/compacct.services/common.header.service';
import { CompacctGlobalApiService } from '../../../shared/compacct.services/compacct.global.api.service';
import { NgxUiLoaderService } from "ngx-ui-loader";
import { DateNepalConvertService } from "../../../shared/compacct.global/dateNepal.service"
import { map } from 'rxjs/operators';
import { ThrowStmt } from '@angular/compiler/src/output/output_ast';
@Component({
  selector: 'app-nepal-purchase-request-vendor-selection',
  templateUrl: './nepal-purchase-request-vendor-selection.component.html',
  styleUrls: ['./nepal-purchase-request-vendor-selection.component.css'],
  providers: [MessageService],
  encapsulation: ViewEncapsulation.None
})
export class NepalPurchaseRequestVendorSelectionComponent implements OnInit {
  items:any = []
  tabIndexToView:number = 0
  buttonname = "Save"
  objvendorSelection:vendorSelection = new vendorSelection()
  poRequestList:any = []
  vendorSelectionFormSubmit:boolean = false
  PoDate:any
  Searchedlist:any = []
  prList:any = []
  Venderlist:any = []
  VenderSelect:any = undefined
  SaveSpinner:boolean = false
  seachSpinner:boolean = false
  BrowseStartDate:any = {}
  BrowseEndDate:any = {}
  SearchFormSubmit:boolean = false
  constructor(
    private $http: HttpClient,
    private commonApi: CompacctCommonApi,
    private GlobalAPI: CompacctGlobalApiService,
    private Header: CompacctHeader,
    private DateService: DateTimeConvertService,
    private DateNepalConvertService : DateNepalConvertService,
    public $CompacctAPI: CompacctCommonApi,
    private compacctToast: MessageService,
    private route: ActivatedRoute,
    private ngxService: NgxUiLoaderService
  ) { }

  ngOnInit() {
    this.items =  ["BROWSE", "CREATE"];
    this.Header.pushHeader({
     Header: "Purchase Request Vendor Selection",
     Link: "Procurement -> Purchase Request Vendor Selection"
   });
   this.BrowseStartDate =this.DateNepalConvertService.GetNepaliCurrentDateNew();
   this.BrowseEndDate = this.DateNepalConvertService.GetNepaliCurrentDateNew();
   this.tabIndexToView = 0
   this.getPRno()
   this.GetVender()
  }
  TabClick(e) {
    this.tabIndexToView = e.index;
    this.items = ["BROWSE", "CREATE"];
    this.buttonname = "Save";
    this.clearData();
  }
  clearData(){
  this.objvendorSelection = new vendorSelection()
  this.vendorSelectionFormSubmit = false
  this.PoDate = undefined
  this.prList = []
  this.SaveSpinner = false
  }
  onReject(){
    this.compacctToast.clear("c");
   }
   onConfirm(){

   }
   getPRno(){
    const obj = {
      "SP_String": "sp_Bl_Txn_Purchase_Request",
      "Report_Name_String": "Get_Purchase_Request_Doc_No"
    }
    this.GlobalAPI.getData(obj)
    .subscribe((data: any) => {
      console.log("data",data)
      if(data.length) {
        data.forEach(element => {
          element['label'] = element.Purchase_Request_No,
          element['value'] = element.Purchase_Request_No
        });
       this.poRequestList = data;
     // console.log("Requlist======",this.Requlist);
      }
       else {
        this.poRequestList = [];
  
      }
      console.log("poRequestList",this.poRequestList)
    })
   }
   purchaseRequestChange(){
    if(this.objvendorSelection.Purchase_Request_No){
      this.getPr()
      const poRequestListFilter = this.poRequestList.filter((y:any)=> y.Purchase_Request_No == this.objvendorSelection.Purchase_Request_No)[0]
      if(poRequestListFilter){
        this.PoDate = this.DateNepalConvertService.convertNewEngToNepaliDateObj(poRequestListFilter.Purchase_Request_Date)
      }
    }
    else{
      this.prList = []
      this.VenderSelect = undefined
    }
  
  }
   getPr(){
   const obj = {
        "SP_String": "sp_Bl_Txn_Purchase_Request",
        "Report_Name_String": "Get_Data_From_Purchase_Request",
        "Json_Param_String": JSON.stringify([{ Purchase_Request_No :this.objvendorSelection.Purchase_Request_No}])
       }
      this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      console.log("prList",data)
      this.prList = data
      })
     }
  GetVender() {
  this.$http
    .get("Common/Get_Subledger_DR_for_Nepal_with_User_ID?user_id=4")
    .pipe(map((data:any) => data ? JSON.parse(data) : []))
    .subscribe((data: any) => {
      if(data.length) {
        data.forEach(element => {
          element['label'] = element.Sub_Ledger_Name,
          element['value'] = element.Sub_Ledger_ID
        });
       this.Venderlist = data;
      }
       else {
        this.Venderlist = [];
  
      }
    });
  }
  SavevendorSeletction(){
    if(this.VenderSelect && this.objvendorSelection.Purchase_Request_No){
      this.ngxService.start();
      this.SaveSpinner = true
      const obj = {
        "SP_String": "sp_Bl_Txn_Purchase_Request",
        "Report_Name_String": "Update_Purchase_Request_Sub_Ledger_ID",
        "Json_Param_String": JSON.stringify([
          { 
            Purchase_Request_No :this.objvendorSelection.Purchase_Request_No,
            Sub_Ledger_ID: this.VenderSelect
          }
          ])
       }
      this.GlobalAPI.getData(obj).subscribe((data:any)=>{
        console.log("data Save",data)
        if(data[0].Column1 == "Done"){
          this.compacctToast.clear();
          this.compacctToast.add({
           key: "compacct-toast",
           severity: "success",
           detail: "Vendor Succesfully Save"
         });
         this.prList = []
        this.VenderSelect = undefined
        this.objvendorSelection = new vendorSelection()
        this.ngxService.stop();
        this.SaveSpinner = false
        this.PoDate = undefined
        this.items = ["BROWSE", "CREATE"];
        this.buttonname = "Save";
        this.GetSearchedList(true)
        }
        else {
          this.compacctToast.clear();
          this.compacctToast.add({
            key: "compacct-toast",
            severity: "error",
            summary: "Warn Message",
            detail: "Something Wrong"
          });
          this.ngxService.stop();
          this.SaveSpinner = false
        }
      })
    }
  }
  GetSearchedList(valid:any){
    this.SearchFormSubmit = true
    if(valid){
      this.seachSpinner = true
      this.Searchedlist = []
      const tempobj = {
        From_Date : this.DateService.dateConvert(this.DateNepalConvertService.convertNepaliDateToEngDate(this.BrowseStartDate)),
        To_Date  : this.DateService.dateConvert(this.DateNepalConvertService.convertNepaliDateToEngDate(this.BrowseEndDate)),
      }
      const obj = {
        "SP_String": "sp_Bl_Txn_Purchase_Request",
        "Report_Name_String": "Browse_Purchase_Request_For_Vendor",
        "Json_Param_String": JSON.stringify([tempobj])
      }
      this.GlobalAPI.getData(obj).subscribe((data: any) => {
        console.log("search Data",data)
        if(data.length){
         data.forEach((y:any) => {
          y.Date = this.DateNepalConvertService.convertEngToNepaliFormatDateObj(y.Date);
          });
         this.Searchedlist = data
         console.log("Searchedlist",this.Searchedlist)
        }
        this.seachSpinner = false
      })
    }
  }
  EditVender(col:any){
  if(col.Purchase_Request_No){
    this.items = ["BROWSE", "UPDATE"];
    this.tabIndexToView = 1
    this.buttonname = "Update"
    this.objvendorSelection.Purchase_Request_No = col.Purchase_Request_No
    this.purchaseRequestChange()
    this.VenderSelect = col.Sub_Ledger_ID
    
  }
  }
}
class vendorSelection{
  Purchase_Request_No:any
  Purchase_Request_Date:any
}