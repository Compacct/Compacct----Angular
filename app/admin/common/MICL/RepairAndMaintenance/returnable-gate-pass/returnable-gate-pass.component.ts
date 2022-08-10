import { Browser } from '@syncfusion/ej2-base';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MessageService } from 'primeng/api';
import { DateTimeConvertService } from '../../../../shared/compacct.global/dateTime.service';
import { CompacctCommonApi } from '../../../../shared/compacct.services/common.api.service';
import { CompacctHeader } from '../../../../shared/compacct.services/common.header.service';
import { CompacctGlobalApiService } from '../../../../shared/compacct.services/compacct.global.api.service';
import { NgxUiLoaderService } from "ngx-ui-loader";

@Component({
  selector: 'app-returnable-gate-pass',
  templateUrl: './returnable-gate-pass.component.html',
  styleUrls: ['./returnable-gate-pass.component.css'],
  providers: [MessageService] ,
  encapsulation: ViewEncapsulation.None
})
export class ReturnableGatePassComponent implements OnInit {
items:any = [];
menuList:any =[];
tabIndexToView= 0;
AllData =[];
buttonname = "Save";
objProjectRequi:any = {};
costCenterList :any = [];
godownList :any =[];
ProTypeList:any = [];
productList:any = [];
SearchedlistPanding :any =[];
SearchedlistBrowse :any =[];
backUPSearchedlistBrowse : any =[];
ObjGatePass :GatePass = new GatePass();
ObjBrowse :Browse = new Browse();
ObjPanding :Panding = new Panding();
gatePassFromSubmit = false;
gatePassFromSubmited = false
initDate:any = [];
initDate2:any =[];
DynamicHeader:any = [];
DynamicHeader2:any = [];
vouchermaxDate = new Date();
voucherminDate = new Date();
voucherdata = new Date();
Docdata = new Date();
Expected_Return_Date = new Date();
Doc_Date = new Date();
DocmaxDate = new Date();
DocminDate = new Date();
showTost = true;
Spinner = false;
DocNoId:any =[];
createListObj:any={};
lowerAddList:any = [];
SelectedDistVendor:any = [];
SelectedDistCost:any = [];
SelectedDistGdown:any = [];
DistVendor:any = [];
DistCostCenter:any = [];
DistGodown:any = [];

deleteError:boolean = false;
Save = false;
Del = false;

constructor(
    private header:CompacctHeader,
    private $http: HttpClient,
    private GlobalAPI:CompacctGlobalApiService,
    private compacctToast:MessageService,
    private DateService: DateTimeConvertService,
    private route: ActivatedRoute,
    public $CompacctAPI: CompacctCommonApi,
    private ngxService: NgxUiLoaderService,
    
){}

ngOnInit() {
this.items = ["BROWSE", "CREATE","PENDING WORK ORDER"];

this.header.pushHeader({
      Header: "Returnable Gate Pass",
      Link: "Material Management -> Repair & Maintenance -> Returnable Gate Pass"
  })
  this.Finyear();
  this.GetNumberOfdays();
}
TabClick(e) {
  this.tabIndexToView = e.index;
  this.items = ["BROWSE", "CREATE","PENDING WORK ORDER"];
  this.buttonname = "Save";
  this.clearData();
}
clearData(){
  this.Expected_Return_Date = this.voucherdata;
  this.ObjGatePass = new GatePass();
  this.initDate = [];
  this.initDate2 = [];
  this.showTost = true;
  this.Expected_Return_Date = this.voucherdata;
  this.Doc_Date =this.Docdata;
  this.createListObj = {};
  this.SearchedlistPanding =[];
  this.SearchedlistBrowse =[];
  this.lowerAddList = [];
  this.gatePassFromSubmit = false;
  this.gatePassFromSubmited = false;
  this.GetNumberOfdays();
  this.SelectedDistVendor = [];
  this.SelectedDistCost = [];
  this.SelectedDistGdown = [];
  this.DistVendor= [];
  this.DistCostCenter = [];
  this.DistGodown = [];
  this.backUPSearchedlistBrowse = []
}
getDateRange(dateRangeObj:any){
  if(dateRangeObj.length) {
   this.ObjPanding.From_Date = dateRangeObj[0];
   this.ObjPanding.To_Date = dateRangeObj[1];
  }
  // else if(dateRangeObj.length) {
  //   this.ObjBrowse.From_Date = dateRangeObj[0];
  //   this.ObjBrowse.To_Date = dateRangeObj[1];
  // }
}
getDateRangeBrowse(dateRangeObj:any){
  if(dateRangeObj.length) {
    this.ObjBrowse.From_Date = dateRangeObj[0];
    this.ObjBrowse.To_Date = dateRangeObj[1];
  }
}
GetNumberOfdays(){
  if(this.Doc_Date && this.Expected_Return_Date){
    this.DocminDate = this.Expected_Return_Date
  }
}
Finyear(){
  this.$http
    .get("Common/Get_Fin_Year_Date?Fin_Year_ID=" + this.$CompacctAPI.CompacctCookies.Fin_Year_ID)
    .subscribe((res: any) => {
    let data = JSON.parse(res)
   this.vouchermaxDate = new Date(data[0].Fin_Year_End);
   this.voucherminDate = new Date(data[0].Fin_Year_Start);
   this.DocmaxDate = new Date(data[0].Fin_Year_End);
   this.DocminDate = new Date(data[0].Fin_Year_Start);
   this.voucherdata = new Date().getMonth() > new Date(data[0].Fin_Year_End).getMonth() ? new Date() : new Date(data[0].Fin_Year_End);
   this.Docdata = new Date().getMonth() > new Date(data[0].Fin_Year_End).getMonth() ? new Date() : new Date(data[0].Fin_Year_End)
   this.initDate =  [new Date(data[0].Fin_Year_Start) , new Date(data[0].Fin_Year_End)];
   this.initDate2 = [new Date(data[0].Fin_Year_Start) , new Date(data[0].Fin_Year_End)]
    });
}
getCostCenter(){
  const obj = {
   "SP_String": "Sp_Returnable_Gate_Pass",
   "Report_Name_String" : "Get_Cost_Center"
 }
 this.GlobalAPI.getData(obj).subscribe((data:any)=>{
  //console.log("LedgerList======",data);
   if(data.length) {
     data.forEach(element => {
       element['label'] = element.Cost_Cen_Name,
       element['value'] = element.Cost_Cen_ID								
     });
     this.costCenterList = data;
     this.ObjGatePass.Cost_Cen_ID = this.$CompacctAPI.CompacctCookies.Cost_Cen_ID;
     if(this.ObjGatePass.Cost_Cen_ID){
      this.getGodown()
     }
    } 
   else {
     this.costCenterList = [];
   }
 console.log("costCenterList======",this.costCenterList);
 });
}
getGodown(){
this.godownList = [];
 const tempObj ={
  Cost_Cen_ID : this.ObjGatePass.Cost_Cen_ID
 }
  const obj = {
  "SP_String": "Sp_Returnable_Gate_Pass",
  "Report_Name_String": "Get_Godown",
  "Json_Param_String": JSON.stringify([tempObj])
  }
  this.GlobalAPI.getData(obj).subscribe((data:any)=>{
    if(data.length) {
      data.forEach(element => {
        element['label'] = element.Godown_Name,
        element['value'] = element.Godown_ID	});
        this.godownList = data;
        console.log('godownList=====',this.godownList)
        this.ObjGatePass.Godown_ID = this.godownList.length ? this.godownList[0].Godown_ID : undefined
    }
    else{
      this.godownList = []; 
    }
  }) 
}
getProTyp(){
  this.ProTypeList = [];
    const obj = {
    "SP_String": "Sp_Returnable_Gate_Pass",
    "Report_Name_String": "Get_product_Type",
    }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      //console.log('ProTypeList=====',data)
      if(data.length) {
        data.forEach(element => {
          element['label'] = element.Product_Type,
          element['value'] = element.Product_Type_ID	});
          this.ProTypeList = data;
          console.log('ProTypeList=====',this.ProTypeList)
      }
      else{
        this.ProTypeList = []; 
      }
    }) 
}
getProduct(){
  this.productList = [];
   const tempObj ={
    Product_Type_ID : this.ObjGatePass.Product_Type_ID
   }
    const obj = {
    "SP_String": "Sp_Returnable_Gate_Pass",
    "Report_Name_String": "Get_Products",
    "Json_Param_String": JSON.stringify([tempObj])
    }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      //console.log('productList=====',data)
      if(data.length) {
        data.forEach(element => {
          element['label'] = element.Product_Description,
          element['value'] = element.Product_ID	});
          this.productList = data;
          console.log('productList=====',this.productList)
      }
      else{
        this.productList = []; 
      }
    }) 
}
getUOM(){
  this.ObjGatePass.UOM = undefined;
  if(this.ObjGatePass.Product_ID) {
    const ctrl = this;
    const productObj = $.grep(ctrl.productList,function(item:any) {return Number(item.Product_ID) === Number(ctrl.ObjGatePass.Product_ID)})[0];
    console.log(productObj);
    this.ObjGatePass.UOM = productObj.UOM;
  
  }
}
GetPandingSearch(){
  this.SearchedlistPanding = [];
  const start = this.ObjPanding.From_Date
  ? this.DateService.dateConvert(new Date(this.ObjPanding.From_Date))
  : this.DateService.dateConvert(new Date());
  const end = this.ObjPanding.To_Date
  ? this.DateService.dateConvert(new Date(this.ObjPanding.To_Date))
  : this.DateService.dateConvert(new Date());
  const tempobj = {
    From_Date : start,
    To_Date : end,
  }
  //console.log("tempobj==",tempobj)
  const obj = {
  "SP_String": "Sp_Returnable_Gate_Pass",
  "Report_Name_String": "PENDING_WORK_ORDER_BROWSE",
  "Json_Param_String": JSON.stringify([tempobj])
  }
  this.GlobalAPI.getData(obj).subscribe((data:any)=>{
    if(data.length){
      this.SearchedlistPanding = data;
      this.DynamicHeader = Object.keys(data[0]);
    
    }
 
   console.log('SearchedlistPanding===',this.SearchedlistPanding)
  })
}
GetBrowseSearch(){
  this.SearchedlistBrowse = [];
  const start = this.ObjBrowse.From_Date
  ? this.DateService.dateConvert(new Date(this.ObjBrowse.From_Date))
  : this.DateService.dateConvert(new Date());
  const end = this.ObjBrowse.To_Date
  ? this.DateService.dateConvert(new Date(this.ObjBrowse.To_Date))
  : this.DateService.dateConvert(new Date());
  const tempobj = {
    From_Date : start,
    To_Date : end,
  }
  //console.log("tempobj==",tempobj)
  const obj = {
  "SP_String": "Sp_Returnable_Gate_Pass",
  "Report_Name_String": "Browse_BL_Txn_Returnable_Gate_Pass",
  "Json_Param_String": JSON.stringify([tempobj])
  }
  this.GlobalAPI.getData(obj).subscribe((data:any)=>{
    if(data.length){
      this.SearchedlistBrowse = data;
      this.DynamicHeader2 = Object.keys(data[0]);
      this.backUPSearchedlistBrowse = data;
      this.GetDistinct()
    }
 
   console.log('SearchedlistBrowse===',this.SearchedlistBrowse)
  }) 
}
GetDistinct(){
  let vendor:any = [];
  let CostCenter:any = [];
  let GoDown:any = [];
  this.DistVendor = [];
  this.SelectedDistVendor = [];
  this.DistCostCenter = [];
  this.SelectedDistCost =[];
  this.DistGodown =[];
  this.SelectedDistGdown =[];
  this.SearchedlistBrowse.forEach((item) => {
    if (vendor.indexOf(item.Vendor_name) === -1) {
      vendor.push(item.Vendor_name);
    this.DistVendor.push({ label: item.Vendor_name, value: item.Vendor_name });
    }
   if (CostCenter.indexOf(item.Cost_Cen_Name) === -1) {
    CostCenter.push(item.Cost_Cen_Name);
     this.DistCostCenter.push({ label: item.Cost_Cen_Name, value: item.Cost_Cen_Name });
     }
   if (GoDown.indexOf(item.Godown_Name) === -1) {
    GoDown.push(item.Godown_Name);
     this.DistGodown.push({ label: item.Godown_Name, value: item.Godown_Name });
     }
    });
    this.backUPSearchedlistBrowse = [...this.SearchedlistBrowse]; 
}
FilterDist(){
  let vendor:any = [];
  let CostCenter:any = [];
  let GoDown:any = [];
  let SearchFields:any =[];
if (this.SelectedDistVendor.length) {
   SearchFields.push('Vendor_name');
   vendor = this.SelectedDistVendor;
}
if (this.SelectedDistCost.length) {
  SearchFields.push('Cost_Cen_Name');
  CostCenter = this.SelectedDistCost;
}
if (this.SelectedDistGdown.length) {
  SearchFields.push('Godown_Name');
  GoDown = this.SelectedDistGdown;
}
this.SearchedlistBrowse = [];
if (SearchFields.length) {
  let LeadArr = this.backUPSearchedlistBrowse.filter(function (e) {
    return (vendor.length ? vendor.includes(e['Vendor_name']) : true)
    && (CostCenter.length ? CostCenter.includes(e['Cost_Cen_Name']) : true)
    && (GoDown.length ? GoDown.includes(e['Godown_Name']) : true)
  });
this.SearchedlistBrowse = LeadArr.length ? LeadArr : [];
} else {
this.SearchedlistBrowse = [...this.backUPSearchedlistBrowse] ;
}
}
createIssue(DocnoObj:any){
  this.DocNoId= undefined
  if (DocnoObj.Doc_No) {
    this.DocNoId= undefined;
    this.tabIndexToView = 1;
    this.items = ["BROWSE", "CREATE","PENDING WORK ORDER"];
    this.buttonname = "Save";
    this.clearData();
    this.DocNoId = DocnoObj.Doc_No;
    this.createListObj = {};
   this.GetcreateIssueMaster();
   this.getCostCenter();
   this.getProTyp();
   }    
}
GetcreateIssueMaster(){
const tempobj = {
  Doc_No : this.DocNoId,
}
const obj = {
  "SP_String": "Sp_Returnable_Gate_Pass",
  "Report_Name_String":"Get_Data_For_Create_Returnable_Gate_Pass",
  "Json_Param_String": JSON.stringify([tempobj]) 
 }
 this.GlobalAPI.getData(obj).subscribe((res:any)=>{
  console.log("CreatForm==>>",res)
  //let data = JSON.parse(res[0].topper);
 //this.createList= data
 if(res.length){
  this.createListObj = res[0]
  //this.objproject = data[0];
  this.SearchedlistPanding.Doc_No = res[0].Doc_No;
 }

  
  //this.lowerAddList = data[0].bottom
 // console.log("create==",this.createListObj)
 })
}
Delete(index){
  this.lowerAddList.splice(index, 1);
}
AddData(valid:any){
  this.gatePassFromSubmit = true;
  if(valid){
    this.gatePassFromSubmit = false
    this.showTost = true;
    const ProductTypFilter:any = this.ProTypeList.filter((el:any)=> Number(el.value) === Number(this.ObjGatePass.Product_Type_ID	))[0]
    const ProductFilter:any = this.productList.filter((el:any)=> Number(el.value) === Number(this.ObjGatePass.Product_ID))[0]
    const addTempObj = {
      Product_Type: ProductTypFilter.label,
      Product_Description : ProductFilter.label,
      Product_Type_ID : Number(this.ObjGatePass.Product_Type_ID),
      Product_ID: Number(this.ObjGatePass.Product_ID),
      Work_Details: this.ObjGatePass.Work_Details,
      Qty : this.ObjGatePass.Qty,
      UOM : this.ObjGatePass.UOM,
      Expected_Return_Date : this.DateService.dateConvert(new Date(this.Expected_Return_Date)),
      Remarks : this.ObjGatePass.Remarks,
    }
    this.lowerAddList.push(addTempObj);
    let backUPobj = {...this.ObjGatePass};
    this.ObjGatePass = new GatePass()
    this.ObjGatePass.Cost_Cen_ID=  backUPobj.Cost_Cen_ID,
    this.ObjGatePass.Godown_ID = backUPobj.Godown_ID,
    this.ObjGatePass.Sub_Ledger_Name = this.createListObj.Sub_Ledger_Name,
    this.ObjGatePass.Doc_No = this.createListObj .Doc_No
    }
    console.log("AddData....>>",this.ObjGatePass,this.lowerAddList)
}
saveData(valid:any){
  console.log("valid",valid)
  this.gatePassFromSubmited = true;
  // let ArrData:any =[];
  this.Save = false;
  this.Del = false;
  if(valid){
    this.Save = true;
    this.Del = false;
    this.Spinner = true;
    this.ngxService.start();
   this.compacctToast.clear();
   this.compacctToast.add({
     key: "c",
     sticky: true,
     closable: false,
     severity: "warn",
     summary: "Are you sure?",
     detail: "Confirm to proceed"
   });
  //   if (this.lowerAddList.length) {
  //   this.lowerAddList.forEach(element => {
  //     const Data ={
  //     Product_Type: element.Product_Type,
  //     Product_Description : element.Product_Description,
  //     Product_Type_ID : Number(element.Product_Type_ID),
  //     Product_ID: Number(element.Product_ID),
  //     Work_Details: element.Work_Details,
  //     Qty : element.Qty,
  //     UOM : element.UOM,
  //     Expected_Return_Date : this.DateService.dateConvert(new Date(element.Expected_Return_Date)),
  //     Remarks : element.Remarks, 
  //     Doc_Date :this.DateService.dateConvert(new Date(this.Doc_Date)),
  //     Cost_Cen_ID : Number(this.ObjGatePass.Cost_Cen_ID),
  //     Godown_ID :Number(this.ObjGatePass.Godown_ID),
  //     Sub_Ledger_ID :this.createListObj.Sub_Ledger_ID,
  //     Work_Order_No :this.createListObj.Doc_No,
  //     Created_By :this.$CompacctAPI.CompacctCookies.User_ID,
  //   }
  //     ArrData.push(Data)
  //   });
  //   const obj = {
  //     "SP_String": "Sp_Returnable_Gate_Pass",
  //     "Report_Name_String": 'Create_BL_Txn_Returnable_Gate_Pass',
  //     "Json_Param_String": JSON.stringify(ArrData)
  //    }
  //    this.GlobalAPI.getData(obj)
  //    .subscribe((data:any)=>{
  //     console.log("Final save data ==",data);
  //     if (data[0].Column1){
  //       this.compacctToast.clear();
  //       this.compacctToast.add({
  //         key: "compacct-toast",
  //         severity: "success",
  //         summary: "Succesfully Create ",
  //         detail: "Succesfully "
  //       });
  //       this.Spinner = false;
  //       this.tabIndexToView = 0;
  //       this.gatePassFromSubmited = false;
  //       this.ObjGatePass.Cost_Cen_ID = this.$CompacctAPI.CompacctCookies.Cost_Cen_ID
  //       this.ObjGatePass =new GatePass();
  //       this.Expected_Return_Date = new Date();
  //       this.Doc_Date = new Date();
  //       this.lowerAddList = [];
  //       }
  //       else {
  //         this.Spinner = false; 
  //         this.gatePassFromSubmited = false;
  //         this.compacctToast.clear();
  //         this.compacctToast.add({
  //           key: "compacct-toast",
  //           severity: "error",
  //           summary: "Warn Message ",
  //           detail: data[0].Msg
  //         });
  //       } 
  //     });
  // }
  }
}
onConfirmSave(){
  let ArrData:any =[];
  if (this.lowerAddList.length) {
    this.lowerAddList.forEach(element => {
      const Data ={
      Product_Type: element.Product_Type,
      Product_Description : element.Product_Description,
      Product_Type_ID : Number(element.Product_Type_ID),
      Product_ID: Number(element.Product_ID),
      Work_Details: element.Work_Details,
      Qty : element.Qty,
      UOM : element.UOM,
      Expected_Return_Date : this.DateService.dateConvert(new Date(element.Expected_Return_Date)),
      Remarks : element.Remarks, 
      Doc_Date :this.DateService.dateConvert(new Date(this.Doc_Date)),
      Cost_Cen_ID : Number(this.ObjGatePass.Cost_Cen_ID),
      Godown_ID :Number(this.ObjGatePass.Godown_ID),
      Sub_Ledger_ID :this.createListObj.Sub_Ledger_ID,
      Work_Order_No :this.createListObj.Doc_No,
      Created_By :this.$CompacctAPI.CompacctCookies.User_ID,
    }
      ArrData.push(Data)
    });
    const obj = {
      "SP_String": "Sp_Returnable_Gate_Pass",
      "Report_Name_String": 'Create_BL_Txn_Returnable_Gate_Pass',
      "Json_Param_String": JSON.stringify(ArrData)
     }
     this.GlobalAPI.getData(obj)
     .subscribe((data:any)=>{
      console.log("Final save data ==",data);
      if (data[0].Column1){
        this.ngxService.stop();
        this.compacctToast.clear();
        this.compacctToast.add({
          key: "compacct-toast",
          severity: "success",
          summary: "Succesfully Create ",
          detail: "Succesfully "
        });
        this.Spinner = false;
        this.tabIndexToView = 0;
        this.gatePassFromSubmited = false;
        this.ObjGatePass.Cost_Cen_ID = this.$CompacctAPI.CompacctCookies.Cost_Cen_ID
        this.ObjGatePass =new GatePass();
        this.Expected_Return_Date = new Date();
        this.Doc_Date = new Date();
        this.lowerAddList = [];
        }
        else {
          this.Spinner = false; 
          this.gatePassFromSubmited = false;
          this.ngxService.stop();
          this.compacctToast.clear();
          this.compacctToast.add({
            key: "compacct-toast",
            severity: "error",
            summary: "Warn Message ",
            detail: data[0].Msg
          });
        } 
      });
  }
}
onConfirmDel(){}
onReject(){
  this.ngxService.stop();
  this.compacctToast.clear("c");
  this.Spinner = false;
  this.deleteError = false;
}
}
class GatePass{
  Cost_Cen_ID:any;
  Godown_ID:any;
  Product_Type_ID:any;
  Product_ID:any;
  Doc_Date:any;			
  Sub_Ledger_ID:any;
  Sub_Ledger_Name :any;
  Work_Details:any;
  Qty:any;
  UOM:any;
  Expected_Return_Date:any;
  Work_Order_No:any;
  Remarks:any;
  Created_By:any;
  Doc_No:any;
  bottom:any;
}
class Browse{
  From_Date:any;
  To_Date :any
}
class Panding{
  From_Date:any;
  To_Date :any
}
