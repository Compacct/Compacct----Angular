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
DocNoId:any;
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
validatation = false;
PandingFormSubmitted = false;
seachBroSpinner = false;
seachPendSpinner = false;
SubLedgerList:any = [];
SubLedgerDataList:any = [];
Requlist:any = [];
deldocno: undefined;
editdocno: any;
addReturnGatePassInputField:any = {};
addPurchaseListInput:boolean = false

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
this.items = ["BROWSE", "CREATE", "PENDING MAINTENANCE INDENT"];
this.header.pushHeader({
      Header: "Returnable Gate Pass",
      Link: "Material Management -> Repair & Maintenance -> Returnable Gate Pass"
  })
  this.Finyear();
  this.GetNumberOfdays();
  this.getCostCenter();
  this.getsubLedger();
}
TabClick(e) {
  this.tabIndexToView = e.index;
  this.items = ["BROWSE", "CREATE", "PENDING MAINTENANCE INDENT"];
  this.buttonname = "Save";
  this.clearData();
  this.addPurchaseListInput = false;
  this.DocNoId = undefined;
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
  // this.SearchedlistPanding =[];
  // this.SearchedlistBrowse =[];
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
  this.backUPSearchedlistBrowse = [];
  this.getCostCenter();
}
getsubLedger(){
  this.SubLedgerList = [];
    const obj = {
      "SP_String": "sp_Comm_Controller",
      "Report_Name_String": "Get_Sub_Ledger_Dropdown",
     }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      // console.log(data);
      this.SubLedgerDataList = data;
     
      console.log("SubLedgerDataList",this.SubLedgerDataList);
      this.SubLedgerDataList.forEach(el => {
        this.SubLedgerList.push({
            label: el.Sub_Ledger_Name,
            value: el.Sub_Ledger_ID
          });
         });
      })
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
  // if(this.Doc_Date && this.Expected_Return_Date){
  //   this.DocminDate = this.Expected_Return_Date
  // }
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
     this.ObjBrowse.Cost_Cen_ID = this.$CompacctAPI.CompacctCookies.Cost_Cen_ID;
     this.ObjPanding.Cost_Cen_ID = this.$CompacctAPI.CompacctCookies.Cost_Cen_ID;
     if(this.ObjGatePass.Cost_Cen_ID){
      this.Getgodown();
      this.GetMainIndentNo();
     }
    } 
   else {
     this.costCenterList = [];
   }
 console.log("costCenterList======",this.costCenterList);
 });
}
Getgodown(){
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
        if (this.buttonname != "Update"){
        this.ObjGatePass.Godown_ID = this.godownList.length ? this.godownList[0].Godown_ID : undefined
        }
    }
    else{
      this.godownList = []; 
    }
  }) 
}
GetMainIndentNo(){
  const obj = {
    "SP_String": "Sp_Returnable_Gate_Pass",
    "Report_Name_String": "Get_Pending_Maintenance_Indent_No",
    "Json_Param_String": JSON.stringify([{To_Cost_Cen_ID : this.ObjGatePass.Cost_Cen_ID}])
    }
  this.GlobalAPI.getData(obj).subscribe((data:any)=>{
    // console.log("data",data)
    // this.Requlist = data
    if(data.length) {
      data.forEach(element => {
        element['label'] = element.Indent_No,
        element['value'] = element.Indent_No
      });
     this.Requlist = data;
   // console.log("Requlist======",this.Requlist);
    }
     else {
      this.Requlist = [];

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
    Req_No : this.ObjGatePass.Req_No
   }
    const obj = {
    "SP_String": "Sp_Returnable_Gate_Pass",
    "Report_Name_String": "Get_Product_Against_Requisition_No",
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
    this.ObjGatePass.Qty = productObj.Qty;
    this.ObjGatePass.UOM = productObj.UOM;
  
  }
}
GetPandingSearch(valid){
  this.SearchedlistPanding = [];
  this.PandingFormSubmitted = true;
  this.seachPendSpinner = true;
  const start = this.ObjPanding.From_Date
  ? this.DateService.dateConvert(new Date(this.ObjPanding.From_Date))
  : this.DateService.dateConvert(new Date());
  const end = this.ObjPanding.To_Date
  ? this.DateService.dateConvert(new Date(this.ObjPanding.To_Date))
  : this.DateService.dateConvert(new Date());
  if (valid){
  const tempobj = {
    To_Cost_Cen_ID : this.ObjPanding.Cost_Cen_ID,
    From_Date : start,
    To_Date : end,
  }
  //console.log("tempobj==",tempobj)
  const obj = {
  "SP_String": "Sp_Returnable_Gate_Pass",
  "Report_Name_String": "Browse_Pending_Maintenance_Indent",
  "Json_Param_String": JSON.stringify([tempobj])
  }
  this.GlobalAPI.getData(obj).subscribe((data:any)=>{
    if(data.length){
      this.SearchedlistPanding = data;
      this.DynamicHeader = Object.keys(data[0]);
    }
    this.PandingFormSubmitted = false;
    this.seachPendSpinner = false;
   console.log('SearchedlistPanding===',this.SearchedlistPanding)
  })
  }
}
Print(DocNo) {
  if(DocNo) {
  const objtemp = {
    "SP_String": "SP_Txn_Requisition",
    "Report_Name_String": "Requisition_Print"
    }
  this.GlobalAPI.getData(objtemp).subscribe((data:any)=>{
    var printlink = data[0].Column1;
    window.open(printlink+"?Doc_No=" + DocNo, 'mywindow', 'fullscreen=yes, scrollbars=auto,width=950,height=500');
  })
  }
}
GetBrowseSearch(valid){
  this.SearchedlistBrowse = [];
  this.validatation = true;
  this.seachBroSpinner = true;
  const start = this.ObjBrowse.From_Date
  ? this.DateService.dateConvert(new Date(this.ObjBrowse.From_Date))
  : this.DateService.dateConvert(new Date());
  const end = this.ObjBrowse.To_Date
  ? this.DateService.dateConvert(new Date(this.ObjBrowse.To_Date))
  : this.DateService.dateConvert(new Date());
  if(valid){
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
    this.validatation = false;
    this.seachBroSpinner = false;
   console.log('SearchedlistBrowse===',this.SearchedlistBrowse)
  }) 
  }
}
PrintRGP(obj) {
  if (obj.Doc_No) {
    window.open("/Report/Crystal_Files/MICL/Returnable_Gate_Pass.aspx?DocNo=" + obj.Doc_No, 'mywindow', 'fullscreen=yes, scrollbars=auto,width=950,height=500'

    );
  }
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
  // this.clearData();
  if (DocnoObj.Doc_No) {
    this.tabIndexToView = 1;
    this.items = ["BROWSE", "CREATE", "PENDING MAINTENANCE INDENT"];
    this.buttonname = "Save";
    this.DocNoId = DocnoObj.Doc_No;
    // var costcenid = this.costCenterList.filter(item=> item.Cost_Cen_Name === DocnoObj.Cost_Cen_Name);
    // this.ObjGatePass.Cost_Cen_ID = costcenid[0].Cost_Cen_ID;
    // this.Getgodown();
    // var godownid = this.godownList.filter(item=> item.Godown_Name === DocnoObj.Stock_Point);
    // this.ObjGatePass.Godown_ID = godownid[0].Godown_ID;
    this.ObjGatePass.Req_No = DocnoObj.Doc_No;
    this.getProduct();
    // this.createListObj = {};
   // this.GetcreateIssueMaster();
  //  this.getCostCenter();
  //  this.getProTyp();
   }    
}
// GetcreateIssueMaster(){
// const tempobj = {
//   Doc_No : this.DocNoId,
// }
// const obj = {
//   "SP_String": "Sp_Returnable_Gate_Pass",
//   "Report_Name_String":"Get_Data_For_Create_Returnable_Gate_Pass",
//   "Json_Param_String": JSON.stringify([tempobj]) 
//  }
//  this.GlobalAPI.getData(obj).subscribe((res:any)=>{
//   console.log("CreatForm==>>",res)
//   //let data = JSON.parse(res[0].topper);
//  //this.createList= data
//  if(res.length){
//   this.createListObj = res[0]
//   //this.objproject = data[0];
//   this.SearchedlistPanding.Doc_No = res[0].Doc_No;
//  }

  
//   //this.lowerAddList = data[0].bottom
//  // console.log("create==",this.createListObj)
//  })
// }
Delete(index){
  this.lowerAddList.splice(index, 1);
}
AddData(valid:any){
  this.gatePassFromSubmited = true;
  if(valid){
    // const ProductTypFilter:any = this.ProTypeList.filter((el:any)=> Number(el.value) === Number(this.ObjGatePass.Product_Type_ID	))[0]
    const ProductFilter:any = this.productList.filter((el:any)=> Number(el.value) === Number(this.ObjGatePass.Product_ID))[0]
    const addTempObj = {
      Req_No : this.ObjGatePass.Req_No,
      Product_Description : this.addPurchaseListInput ? this.addReturnGatePassInputField.Product_Description : ProductFilter.label,
      // Product_Type_ID : Number(this.ObjGatePass.Product_Type_ID),
      Product_ID: Number(this.ObjGatePass.Product_ID),
      Qty : this.ObjGatePass.Qty,
      UOM : this.ObjGatePass.UOM,
      Expected_Return_Date : //this.addPurchaseListInput ? 
                             //this.DateService.dateConvert(new Date(this.addReturnGatePassInputField.Expected_Return_Date)) :
                             this.DateService.dateConvert(new Date(this.Expected_Return_Date)),
      Purpose : this.ObjGatePass.Purpose,
    }
    
    if(this.lowerAddList.length && this.addPurchaseListInput){
      this.lowerAddList.forEach((xz:any,i) => {
        // console.log(i)
        if( xz.Req_No == this.ObjGatePass.Req_No && xz.Product_ID == this.ObjGatePass.Product_ID){
          this.lowerAddList[i] = {...this.ObjGatePass}
          this.lowerAddList[i].Product_Description = this.addReturnGatePassInputField.Product_Description
          this.lowerAddList[i].Expected_Return_Date = this.DateService.dateConvert(new Date(this.Expected_Return_Date))
        }
       });
     }
     else{
      this.gatePassFromSubmited = false;
      this.showTost = true;
      this.lowerAddList.push(addTempObj);
      let backUPobj = {...this.ObjGatePass};
      this.ObjGatePass = new GatePass()
      this.ObjGatePass.Sub_Ledger_ID=  backUPobj.Sub_Ledger_ID;
      this.ObjGatePass.Cost_Cen_ID=  backUPobj.Cost_Cen_ID;
      this.ObjGatePass.Godown_ID = backUPobj.Godown_ID;
      // this.ObjGatePass.Sub_Ledger_Name = this.createListObj.Sub_Ledger_Name;
      // this.ObjGatePass.Doc_No = this.createListObj .Doc_No;
      this.Expected_Return_Date = new Date();
      this.ObjGatePass.Req_No = backUPobj.Req_No;
      this.ObjGatePass.Mode_Of_Transport = backUPobj.Mode_Of_Transport;
      this.ObjGatePass.Vehicle_No = backUPobj.Vehicle_No;
      this.ObjGatePass.By_Order = backUPobj.By_Order;
     }
    
    // this.gatePassFromSubmited = false;
    // this.showTost = true;
    // this.lowerAddList.push(addTempObj);
    // let backUPobj = {...this.ObjGatePass};
    // this.ObjGatePass = new GatePass()
    // this.ObjGatePass.Sub_Ledger_ID=  backUPobj.Sub_Ledger_ID;
    // this.ObjGatePass.Cost_Cen_ID=  backUPobj.Cost_Cen_ID;
    // this.ObjGatePass.Godown_ID = backUPobj.Godown_ID;
    // // this.ObjGatePass.Sub_Ledger_Name = this.createListObj.Sub_Ledger_Name;
    // // this.ObjGatePass.Doc_No = this.createListObj .Doc_No;
    // this.Expected_Return_Date = new Date();
    // this.ObjGatePass.Req_No = backUPobj.Req_No;
    }
    console.log("AddData....>>",this.ObjGatePass,this.lowerAddList)
}
saveData(){
  // console.log("valid",valid)
  // this.gatePassFromSubmited = true;
  // let ArrData:any =[];
  this.Save = false;
  this.Del = false;
  if(this.lowerAddList.length){
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
        Doc_No: this.editdocno ? this.editdocno : "A",
        Sub_Ledger_ID :this.ObjGatePass.Sub_Ledger_ID,
        Doc_Date :this.DateService.dateConvert(new Date(this.Doc_Date)),
        Cost_Cen_ID : Number(this.ObjGatePass.Cost_Cen_ID),
        Godown_ID :Number(this.ObjGatePass.Godown_ID),
        Mode_Of_Transport : this.ObjGatePass.Mode_Of_Transport,
        Vehicle_No : this.ObjGatePass.Vehicle_No,
        By_Order : this.ObjGatePass.By_Order,

        Req_No: element.Req_No,
        Product_ID: Number(element.Product_ID),
        Product_Description : element.Product_Description,
        Qty : element.Qty,
        UOM : element.UOM,
        Expected_Return_Date : this.DateService.dateConvert(new Date(element.Expected_Return_Date)),
        Purpose: element.Purpose,
      // Work_Order_No :this.createListObj.Doc_No,

        Remarks : this.ObjGatePass.Remarks, 
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
          summary: "Returnable Gate Pass No " + data[0].Column1,
          detail: this.buttonname === "Update" ? "Succesfully Update " : "Succesfully Create "
        });
        this.Spinner = false;
        // this.tabIndexToView = 0;
        this.gatePassFromSubmited = false;
        this.getCostCenter();
        this.ObjGatePass =new GatePass();
        this.Expected_Return_Date = new Date();
        this.Doc_Date = new Date();
        this.lowerAddList = [];
        this.DocNoId = undefined;
        this.GetBrowseSearch(true);
        this.GetPandingSearch(true);
        this.editdocno = undefined;
        this.addPurchaseListInput = false;
        if(this.buttonname === "Update") {
          this.tabIndexToView = 0;
          this.items = ["BROWSE", "CREATE", "PENDING MAINTENANCE INDENT"];
        }
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
DeleteRGP(obj){
  this.deldocno = undefined;
  if(obj.Doc_No){
    this.deldocno = obj.Doc_No;
    this.ngxService.start();
   this.compacctToast.clear();
   this.compacctToast.add({
     key: "s",
     sticky: true,
     closable: false,
     severity: "warn",
     summary: "Are you sure?",
     detail: "Confirm to proceed"
   });
  }
}
onConfirmDel(){
  const objdel = {
    Doc_No: this.deldocno,
    Created_By: this.$CompacctAPI.CompacctCookies.User_ID
  }
  const obj = {
    "SP_String": "Sp_Returnable_Gate_Pass",
    "Report_Name_String": 'Delete_Returnable_Gate_Pass',
    "Json_Param_String": JSON.stringify(objdel)
   }
   this.GlobalAPI.getData(obj)
   .subscribe((data:any)=>{
    if (data[0].Column1 === "Done"){
      this.ngxService.stop();
      this.compacctToast.clear();
      this.compacctToast.add({
        key: "compacct-toast",
        severity: "success",
        summary: "Message ",
        detail: "Succesfully Deleted "
      });
      this.deldocno = undefined;
      this.GetBrowseSearch(true);
      this.GetPandingSearch(true);
      }
      else {
        this.deldocno = undefined; 
        this.ngxService.stop();
        this.compacctToast.clear();
        this.compacctToast.add({
          key: "compacct-toast",
          severity: "error",
          summary: "Warn Message ",
          detail: "Something Wrong"
        });
      } 
    });
}
onReject(){
  this.ngxService.stop();
  this.compacctToast.clear("c");
  this.deldocno = undefined;
  this.compacctToast.clear("s");
  this.Spinner = false;
  this.deleteError = false;
}
// Edit
Edit(col){
  this.clearData();
  this.editdocno = undefined;
  if(col.Doc_No){
    this.editdocno = col.Doc_No;
    this.tabIndexToView = 1;
    this.items = ["BROWSE", "UPDATE", "PENDING MAINTENANCE INDENT"];
    this.buttonname = "Update";
    this.geteditmaster();
   
   }
 }
 geteditmaster(){
  const obj = {
    "SP_String": "Sp_Returnable_Gate_Pass",
    "Report_Name_String": "Get_Data_For_Returnable_Gate_Pass",
    "Json_Param_String": JSON.stringify([{Doc_No : this.editdocno}])
 }
  this.GlobalAPI.getData(obj).subscribe((data:any)=>{
    // let data = JSON.parse(res[0].Column1)
    console.log("Edit data",data);
    this.ObjGatePass.Sub_Ledger_ID = data[0].Sub_Ledger_ID;
    this.Doc_Date = new Date(data[0].Doc_Date);
    this.ObjGatePass.Cost_Cen_ID = data[0].Cost_Cen_ID;
    this.GetMainIndentNo();
    this.Getgodown();
    this.ObjGatePass.Godown_ID = data[0].Godown_ID;
    // this.ObjGatePass.Req_No = data[0].Req_No;
    this.ObjGatePass.Mode_Of_Transport = data[0].Mode_Of_Transport;
    this.ObjGatePass.Vehicle_No = data[0].Vehicle_No;
    this.ObjGatePass.By_Order = data[0].By_Order;
    this.Expected_Return_Date = new Date(data[0].Expected_Return_Date);
    this.ObjGatePass.Remarks = data[0].Remarks;
    // console.log("addPurchaseList",this.addPurchaseList)
    data.forEach(element => {
      const  productObj = {
       Req_No : element.Req_No,
       Product_ID: element.Product_ID,
       Product_Description : element.Product_Description,
       Qty : element.Qty,
       UOM : element.UOM,
       Expected_Return_Date : new Date(element.Expected_Return_Date),
       Purpose : element.Purpose,
     };
      this.lowerAddList.push(productObj);
    });
  })
 }
 // Edit Add RG 
 EditReturnGatePass(inx:any){
  // console.log(this.addPurchaseList[inx])
  this.ObjGatePass.Req_No = this.lowerAddList[inx].Req_No;
  this.addReturnGatePassInputField = this.lowerAddList[inx];
  setTimeout(() => {
    this.getProduct();
  }, 300);
   this.ObjGatePass.Product_ID = this.lowerAddList[inx].Product_ID;
  //  this.ObjGatePass = {...this.lowerAddList[inx]}
   this.ObjGatePass.UOM = this.lowerAddList[inx].UOM;
   this.ObjGatePass.Qty = this.lowerAddList[inx].Qty;
   this.Expected_Return_Date = new Date(this.lowerAddList[inx].Expected_Return_Date);
   this.ObjGatePass.Purpose = this.lowerAddList[inx].Purpose;
  //  this.ObjGatePass.Product_ID = this.lowerAddList[inx].Product_Description
   this.addPurchaseListInput = true;
  //  this.disable = false
}
}
class GatePass{
  Req_No:any;
  Cost_Cen_ID:any;
  Godown_ID:any;
  Product_Type_ID:any;
  Product_ID:any;
  Doc_Date:any;			
  Sub_Ledger_ID:any;
  Sub_Ledger_Name :any;
  Purpose:any;
  Qty:any;
  UOM:any;
  Expected_Return_Date:any;
  Work_Order_No:any;
  Remarks:any;
  Created_By:any;
  Doc_No:any;
  bottom:any;
  Mode_Of_Transport:any;
  Vehicle_No:any;
  By_Order:any;
}
class Browse{
  Cost_Cen_ID:any;
  From_Date:any;
  To_Date :any
}
class Panding{
  Cost_Cen_ID:any;
  From_Date:any;
  To_Date :any
}
