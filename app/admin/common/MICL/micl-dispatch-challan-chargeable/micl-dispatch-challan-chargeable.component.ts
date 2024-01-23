import { MessageService } from 'primeng/api';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CompacctCommonApi } from '../../../shared/compacct.services/common.api.service';
import { CompacctGlobalApiService } from '../../../shared/compacct.services/compacct.global.api.service';
import { CompacctHeader } from '../../../shared/compacct.services/common.header.service';
import { DateTimeConvertService } from '../../../shared/compacct.global/dateTime.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';

@Component({
  selector: 'app-micl-dispatch-challan-chargeable',
  templateUrl: './micl-dispatch-challan-chargeable.component.html',
  styleUrls: ['./micl-dispatch-challan-chargeable.component.css'],
  providers: [MessageService],
  encapsulation: ViewEncapsulation.None
})
export class MICLDispatchChallanChargeableComponent implements OnInit {
  items:any = [];
  buttonname = "Create";
  tabIndexToView = 0;
  ObjChargeable :Chargeable = new Chargeable();
  ObjBorwseCharge :BorwseCharge = new BorwseCharge();
  ObjOther :Other = new Other();
  DispatchChargebleFormSubmit:boolean =false;
  DispatchSearchFormSubmit:boolean =false;
  DispatchFormSubmit:boolean =false;
  FromCostCenterList :any =[];
  FromGodownList :any =[];
  FromGodownListBrowse :any =[];
  BrowseCostCenterList :any =[];
  initDate:any = [];
  Projecteddata = new Date();
  MBDatemaxDate = new Date();
  MBDateminDate = new Date();
  Doc_Date = new Date();
  VendorList :any =[];
  ProductTypeList :any =[];
  ProductList :any=[];
  BatchList :any =[];
  buttonList :any = [];
  Searchedlist :any =[];
  showTost:boolean = true;
  Spinner :boolean = false;
  AddOne :boolean = false;
  lowerAddList:any = [];
  SelectedDistVendor:any = [];
  backUPSearchedlistPanding :any =[];
  DistVendor:any = [];
  EditList :any =[];
  VenderCode = undefined;
  masterDispatchId =undefined;
  Del : boolean = false;
  seachSpinner = false;
  constructor(
    private $http: HttpClient,
    private commonApi: CompacctCommonApi,
    private GlobalAPI: CompacctGlobalApiService,
    private Header: CompacctHeader,
    private DateService: DateTimeConvertService,
    public $CompacctAPI: CompacctCommonApi,
    private compacctToast: MessageService,
    private ngxService: NgxUiLoaderService
  ) {}

ngOnInit(){
    this.items = ["BROWSE", "CREATE"];
    this.Header.pushHeader({
      Header: "Issue Material Chargeable",
      Link: "Material Management -> Outward -> Issue Material Chargeable"
    });
    this.GetFromCostcenter();
    this.Finyear();
    this.GetCostcenterBrowse();
    this.getVendor();
    this.getProductTyp();

}
TabClick(e){
    this.tabIndexToView = e.index;
    this.items = ["BROWSE", "CREATE"];
    this.buttonname = "Save";
    this.clearData();   
}
clearData(){
  this.ObjChargeable = new Chargeable();
  this.ObjOther = new Other()
  this.GetCostcenterBrowse();
  this.GetFromCostcenter();
  this.Doc_Date = this.Projecteddata;
  this.DispatchChargebleFormSubmit = false;
  this.DispatchSearchFormSubmit = false;
  this.DispatchFormSubmit =false;
  this.initDate = [];
  this.lowerAddList = [];
  this.Searchedlist =[];
}
getDateRange(dateRangeObj:any){
  if(dateRangeObj.length){
    this.ObjBorwseCharge.From_Date = dateRangeObj[0];
    this.ObjBorwseCharge.To_Date = dateRangeObj[1];
  }
}
Finyear(){
  this.$http
    .get("Common/Get_Fin_Year_Date?Fin_Year_ID=" + this.$CompacctAPI.CompacctCookies.Fin_Year_ID)
    .subscribe((res: any) => {
    let data = JSON.parse(res)
   this.MBDatemaxDate = new Date(data[0].Fin_Year_End);
   this.MBDateminDate = new Date(data[0].Fin_Year_Start);
   this.Projecteddata = new Date().getMonth() > new Date(data[0].Fin_Year_End).getMonth() ? new Date() : new Date(data[0].Fin_Year_End);
   this.initDate =  [new Date(data[0].Fin_Year_Start) , new Date(data[0].Fin_Year_End)]
    });
}
GetCostcenterBrowse(){
  this.BrowseCostCenterList =[];
  const obj = {
    "SP_String": "SP_MICL_Dispatch_Challan_Chargeable",
    "Report_Name_String": "Get_Cost_Center",
  }
  this.GlobalAPI.getData(obj).subscribe((data:any)=>{
    if(data.length){
   // console.log("costcenterList  ===",data);
    this.BrowseCostCenterList = data;
    this.ObjBorwseCharge.Cost_Cen_ID = this.BrowseCostCenterList.length ? this.BrowseCostCenterList[0].Cost_Cen_ID : undefined;
      this.getStockPointBrowse();
    
  }
  else{
this.FromCostCenterList =[];
  }
 });
}
getStockPointBrowse(){
  var savedata ={}
  this.FromGodownListBrowse = [];
if(this.ObjBorwseCharge.Cost_Cen_ID){
   savedata ={
    Cost_Cen_ID: Number(this.ObjBorwseCharge.Cost_Cen_ID),
  }
}
const obj = {
"SP_String": "SP_MICL_Dispatch_Challan_Chargeable",
"Report_Name_String": "Get_Cost_Center_Godown",
"Json_Param_String": JSON.stringify([savedata])
}
this.GlobalAPI.getData(obj).subscribe((data:any)=>{
  if(data.length){
      this.FromGodownListBrowse = data;
      //console.log('FromGodownListBrowse=====',this.FromGodownListBrowse)
      this.ObjBorwseCharge.Godown_Id = this.FromGodownListBrowse.length ? this.FromGodownListBrowse[0].Godown_ID : undefined;
      this.BrowseSearched();
      }
  else{
    this.FromGodownListBrowse = []; 
  }
})
}
GetFromCostcenter(){
  this.FromCostCenterList =[];
  const obj = {
    "SP_String": "SP_MICL_Dispatch_Challan_Chargeable",
    "Report_Name_String": "Get_Cost_Center",
  }
  this.GlobalAPI.getData(obj).subscribe((data:any)=>{
    if(data.length){
    //console.log("costcenterList  ===",data);
    this.FromCostCenterList = data;
    this.ObjChargeable.F_Cost_Cen_ID = this.FromCostCenterList.length ? this.FromCostCenterList[0].Cost_Cen_ID : undefined;
      this.getStockPoint();
      this.GetBatch();
    
  }
  else{
this.FromCostCenterList =[];
  }
 });
}
getStockPoint(){
  var savedata ={}
  this.FromGodownList = [];
if(this.ObjChargeable.F_Cost_Cen_ID){
   savedata ={
    Cost_Cen_ID: Number(this.ObjChargeable.F_Cost_Cen_ID),
  }
}
const obj = {
"SP_String": "SP_MICL_Dispatch_Challan_Chargeable",
"Report_Name_String": "Get_Cost_Center_Godown",
"Json_Param_String": JSON.stringify([savedata])
}
this.GlobalAPI.getData(obj).subscribe((data:any)=>{
  if(data.length){
      this.FromGodownList = data;
      //console.log('FromGodownList=====',this.FromGodownList)
      this.ObjChargeable .F_Godown_ID = this.FromGodownList.length ? this.FromGodownList[0].Godown_ID :undefined;
      this.GetBatch();
      }
  else{
    this.FromGodownList = []; 
  }
})
} 
getVendor(){
  this.VendorList =[];
  const obj = {
    "SP_String": "SP_MICL_Dispatch_Challan_Chargeable",
    "Report_Name_String" : "Get_Subledger_SC"
  }
  this.GlobalAPI.getData(obj).subscribe((data:any)=>{
   //console.log("VendorList======",data);
    if(data.length) {
      data.forEach(element => {
        element['label'] = element.Sub_Ledger_Billing_Name,
        element['value'] = element.Sub_Ledger_ID								
      });
      this.VendorList = data;      
     } 
  });
} 
getProductTyp(){
  this.ProductTypeList =[];
  const obj = {
    "SP_String": "SP_MICL_Dispatch_Challan_Chargeable",
    "Report_Name_String": "Get_Product_Type",
  }
  this.GlobalAPI.getData(obj).subscribe((data:any)=>{
    if(data.length){
    //console.log("ProductTypeList  ===",data);
    this.ProductTypeList = data;  
  }
  else{
    this.ProductTypeList =[];
  }
 });
}
getProduct(){
  this.ProductList =[];
  const ProdObj ={
    Product_Type_ID : this.ObjOther.Product_Type_ID
  }
  const obj = {
    "SP_String": "SP_MICL_Dispatch_Challan_Chargeable",
    "Report_Name_String": "Get_Product",
    "Json_Param_String": JSON.stringify([ProdObj])
  }
  this.GlobalAPI.getData(obj).subscribe((data:any)=>{
    if(data.length){
      data.forEach(element => {
        element['label'] = element.Product_Description,
        element['value'] = element.Product_ID								
      });
    //console.log("ProductList  ===",data);
    this.ProductList = data;  
  }
  else{
    this.ProductList =[];
  }
 });
}
GetBatch(){
  this.BatchList =[];
  const ObjBatch ={
    Cost_Cen_ID : this.ObjChargeable.F_Cost_Cen_ID ,
    Product_ID : this.ObjOther.Product_ID,
    Godown_Id : this.ObjChargeable.F_Godown_ID
  }
  const obj = {
    "SP_String": "SP_MICL_Dispatch_Challan_Chargeable",
    "Report_Name_String": "Get_Batch_No_Product_Wise",
    "Json_Param_String": JSON.stringify([ObjBatch])
  }
  this.GlobalAPI.getData(obj).subscribe((data:any)=>{
    if(data.length){
    //console.log("BatchList  ===",data);
    this.BatchList = data; 
    this.ObjOther.Batch_No = this.BatchList.length ? this.BatchList[0].Batch_No : undefined; 
  }
  else{
    this.BatchList =[];
  }
 }); 
}
bottomData(valid:any){
  this.DispatchFormSubmit =true;
  if(valid){
     const Filter:any = this.BatchList.filter((el:any)=> el.Batch_No === this.ObjOther.Batch_No)[0];
    if( Filter.Bal_Qty < this.ObjOther.Qty){
     this.showTost = false
     this.compacctToast.clear();
      this.compacctToast.add({
        key: "c",
        sticky: true,
        severity: "error",
        summary: "Issue QTY not More Then Batch QTY",
       // detail: "Confirm to proceed"
      });
      return
    }
    else{
      this.showTost = true;
      //this.AddOne = true;
    const ProductTypFilter:any = this.ProductTypeList.filter((el:any)=> Number(el.Product_Type_ID) === Number(this.ObjOther.Product_Type_ID	))[0];
    const ProductFilter:any = this.ProductList.filter((el:any)=> Number(el.value) === Number(this.ObjOther.Product_ID))[0];
    const BatchFilter:any = this.BatchList.filter((el:any)=> el.Batch_No === this.ObjOther.Batch_No)[0];
    const Filter:any = this.ProductList.filter((el:any)=> Number(el.Product_ID )=== Number(this.ObjOther.Product_ID))[0];
    const addTempObj = {
      Product_Type : ProductTypFilter.Product_Type,
      Product_Description : ProductFilter.label,
      Batch_No_Show	:  BatchFilter.Batch_No_Show,
      Qty : Number(this.ObjOther.Qty),
      Purpose: this.ObjOther.propose,
      Product_Type_ID : this.ObjOther.Product_Type_ID,
      Product_ID: this.ObjOther.Product_ID,
      Batch_No : this.ObjOther.Batch_No,
      propose :this.ObjOther.propose
    }
    this.lowerAddList.push(addTempObj);
  //console.log("lowerAddList===",this.lowerAddList);
  let backUPobj = {...this.ObjOther}	;
this.ObjOther = new Other();
this.ObjOther.Product_ID = backUPobj.Product_ID,
this.ObjOther.Batch_No = backUPobj.Batch_No,
this.ObjOther.Qty = backUPobj.Qty,
this.ObjOther.UOM = Filter.UOM
}	
this.DispatchFormSubmit = false;
}
}
SaveForm(vaild:any){
  console.log("valid===",vaild)
  this.DispatchChargebleFormSubmit =true;
  //this.DispatchFormSubmit =false;
  if(vaild && this.lowerAddList.length){
    this.Spinner = true;
    // this.DispatchChargebleFormSubmit = true;
    // this.DispatchFormSubmit =true;
    this.ngxService.start();
      const TempoOBj ={	
        Doc_No :this.buttonname == "Update" ? this.VenderCode : "A",
        Doc_Date :this.DateService.dateConvert(new Date(this.Projecteddata)),
        F_Cost_Cen_ID:this.ObjChargeable.F_Cost_Cen_ID,
        F_Godown_ID:this.ObjChargeable.F_Godown_ID,	
        Sub_Ledger_ID	:this.ObjChargeable.Sub_Ledger_ID,
        Product_ID:this.ObjOther.Product_ID,
        Batch_No:this.ObjOther.Batch_No,
        Qty	:Number(this.ObjOther.Qty),
        UOM	:this.ObjOther.UOM,
        Received_By	:this.ObjChargeable.Received_By,
        Remarks	:this.ObjChargeable.Remarks,
        Created_By: this.$CompacctAPI.CompacctCookies.User_ID,
      }
    const obj = {
      "SP_String": "SP_MICL_Dispatch_Challan_Chargeable",
      "Report_Name_String" : "Create_MICL_Dispatch_Challan_Chargeable",
     "Json_Param_String": JSON.stringify([TempoOBj]) 
    }
    this.GlobalAPI.postData(obj).subscribe((data:any)=>{
      console.log("savedata===",data);
      //var tempID = data[0].Column1;
      if(data[0].Column1){
        this.compacctToast.clear();
        this.compacctToast.add({
         key: "compacct-toast",
         severity: "success",
         summary: "Dispatch Challan " + this.buttonname,
         detail: "Succesfully Saved" //+ mgs
       });
       this.ObjChargeable = new Chargeable();
       this.DispatchChargebleFormSubmit = false;
       this.tabIndexToView = 0;
       this.BrowseSearched();
       //this.DispatchFormSubmit =false;     
       this.Spinner = false;
       this.ngxService.stop();
       this.ObjChargeable.F_Cost_Cen_ID = this.FromCostCenterList.length ? this.FromCostCenterList[0].Cost_Cen_ID : undefined;
       this.ObjBorwseCharge.Cost_Cen_ID = this.BrowseCostCenterList.length ? this.BrowseCostCenterList[0].Cost_Cen_ID : undefined;
       this.getStockPoint();
       this.getStockPointBrowse();
      } 
      else{
        this.Spinner = false;
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
}
BrowseSearched(valid?){
  this.DispatchSearchFormSubmit = true;
  this.Searchedlist = [];
  this.backUPSearchedlistPanding = [];
const start = this.ObjBorwseCharge.From_Date
? this.DateService.dateConvert(new Date(this.ObjBorwseCharge.From_Date))
: this.DateService.dateConvert(new Date());
const end = this.ObjBorwseCharge.To_Date
? this.DateService.dateConvert(new Date(this.ObjBorwseCharge.To_Date))
: this.DateService.dateConvert(new Date());
const tempobj = {
  From_Date : start,
  To_Date : end,
  Cost_Cen_ID: Number(this.ObjBorwseCharge.Cost_Cen_ID),
  Godown_ID : Number(this.ObjBorwseCharge.Godown_Id),
}
const obj = {
"SP_String": "SP_MICL_Dispatch_Challan_Chargeable",
"Report_Name_String": "Browse_MICL_Dispatch_Challan_Chargeable",
"Json_Param_String": JSON.stringify([tempobj])
}
this.GlobalAPI.getData(obj).subscribe((data:any)=>{
 this.Searchedlist = data;
 //this.DynamicHeader = Object.keys(data[0]);
 this.Searchedlist = data;
 this.backUPSearchedlistPanding = data;
 this.GetDistinct();
// console.log('Search list=====',this.Searchedlist)
})
}
Delete(index:any){
  this.lowerAddList.splice(index, 1);
}
onReject() {
  this.compacctToast.clear('c');
  this.AddOne =true;
}
FilterVendor(){
    let Vendor:any = [];
    let SearchFields:any =[];
  if (this.SelectedDistVendor.length) {
     SearchFields.push('Sub_Ledger_Name');
     Vendor = this.SelectedDistVendor;
  }
  this.Searchedlist = [];
  if (SearchFields.length) {
    let LeadArr = this.backUPSearchedlistPanding.filter(function (e) {
      return (Vendor.length ? Vendor.includes(e['Sub_Ledger_Name']) : true)
    });
  this.Searchedlist = LeadArr.length ? LeadArr : [];
  } else {
  this.Searchedlist = [...this.backUPSearchedlistPanding] ;
  }
  
}
GetDistinct(){
  let Vendor:any = [];
  this.DistVendor = [];
  this.SelectedDistVendor = [];
  this.Searchedlist.forEach((item) => {
 if (Vendor.indexOf(item.Sub_Ledger_Name) === -1) {
  Vendor.push(item.Sub_Ledger_Name);
 this.DistVendor.push({ label: item.Sub_Ledger_Name, value: item.Sub_Ledger_Name });
 }

});
   this.backUPSearchedlistPanding = [...this.Searchedlist];
}
editDispatch(Valid:any){
  this.EditList = [];
  if (Valid.Doc_No) {
    this.VenderCode = undefined;
    this.tabIndexToView = 1;
    this.items = ["BROWSE", "UPDATE"];
    this.buttonname = "Update";
    this.clearData();
    this.VenderCode = Valid.Doc_No
    this.GetEditDispatch(Valid.Doc_No)
   }    
}
GetEditDispatch(Uid){
  if(this.$CompacctAPI.CompacctCookies.User_Type === "A") {
  const obj = {
    "SP_String": "SP_MICL_Dispatch_Challan_Chargeable",
    "Report_Name_String":"Get_Dispatch_Challan_Chargeable_Data",
    "Json_Param_String": JSON.stringify([{Doc_No : Uid}]) 
   }
   this.GlobalAPI.getData(obj).subscribe((data:any)=>{
     console.log("data",data);
     this.EditList = [];
    this.ObjChargeable = data[0];
    this.lowerAddList = data;
    this.Projecteddata= new Date(data[0].Doc_Date);
    this.ObjChargeable.F_Cost_Cen_ID = data[0].F_Cost_Cen_ID;
    this.ObjChargeable.F_Godown_ID = data[0].F_Godown_ID;
    this.ObjChargeable.Sub_Ledger_ID = data[0].Sub_Ledger_ID;
    this.ObjChargeable.Received_By = data[0].Received_By;
    this.ObjChargeable.Remarks = data[0].Remarks;
    this.lowerAddList.Product_Type = data[0].Product_Type;
    this.lowerAddList.Product_Description = data[0].Product_Description;
    this.lowerAddList.Batch_No_Show = data[0].Batch_No_Show;
    this.lowerAddList.Qty = data[0].Qty;

   })
  }
}
deleteDispatch(masterDelete:any): void{
 this.masterDispatchId =undefined;
 this.Del =false
 if(this.$CompacctAPI.CompacctCookies.User_Type === "A"){
 if(masterDelete.Doc_No){
  this.Del =true
   this.masterDispatchId = masterDelete.Doc_No ;
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
}
onConfirm2(){ 
//console.log("onconform==",this.Objleave)
 if(this.masterDispatchId){
   const tempobj = {
    Doc_No : this.masterDispatchId,
    Created_By :this.$CompacctAPI.CompacctCookies.User_ID,
   }
   const obj = {
     "SP_String": "SP_MICL_Dispatch_Challan_Chargeable",
     "Report_Name_String": "Delete_Dispatch_Challan_Chargeable",
     "Json_Param_String": JSON.stringify([tempobj])
   }
   this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      console.log("del Data===", data[0].Column1)
     if (data[0].Column1){
       this.onReject();
       this.BrowseSearched();
       this.masterDispatchId = undefined ;
     //  this.can_popup = false;
       this.compacctToast.clear();
       this.compacctToast.add({
         key: "compacct-toast",
         severity: "success",
         summary: "User ",
         detail: "Succesfully Deleted"
       });
      }
   })
 }
}
Print(objj:any){
  //console.log("printData",objj)
  if(objj) {
    const objtemp = {
      "SP_String": "SP_MICL_Dispatch_Challan_Chargeable",
      "Report_Name_String": "Print_Dispatch_Challan_Chargeable"
      }
    this.GlobalAPI.getData(objtemp).subscribe((data:any)=>{
      var printlink = data[0].Column1;
      window.open(printlink+"?Doc_No=" + objj.Doc_No, 'mywindow', 'fullscreen=yes, scrollbars=auto,width=950,height=500');
      //console.log("doc===",objj.Doc_No)
    })
    }
}
}
class Chargeable{
Txn_ID  :any;
Doc_No :any;	
Doc_Date :any;	
F_Cost_Cen_ID	 :any;
F_Godown_ID :any;	
Sub_Ledger_ID	 :any;

Received_By	 :any;
Remarks	 :any;
Created_On :any;	
Created_By :any;
}
class Other{
Product_ID	 :any;
Batch_No :any;	
Qty :any;	
UOM	 :any;
propose :any;
Product_Type_ID :any;
}
class BorwseCharge{
Cost_Cen_ID: any;
Godown_Id :any;
From_Date :any;
To_Date :any ;
}
