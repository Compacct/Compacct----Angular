import { Component, OnInit, ViewEncapsulation, ViewChild } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { MessageService } from "primeng/api";
import { FileUpload } from "primeng/primeng";
import { data } from "jquery";
import { Console } from "console";
import { ActivatedRoute } from "@angular/router";
import { takeUntil } from "rxjs/operators";
import { CompacctCommonApi } from "../../../shared/compacct.services/common.api.service";
import { CompacctHeader } from "../../../shared/compacct.services/common.header.service";
import { CompacctGlobalApiService } from "../../../shared/compacct.services/compacct.global.api.service";
import { DateTimeConvertService } from "../../../shared/compacct.global/dateTime.service";
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-consumption',
  templateUrl: './consumption.component.html',
  styleUrls: ['./consumption.component.css'],
  providers:[MessageService],
  encapsulation: ViewEncapsulation.None
})
export class ConsumptionComponent implements OnInit {

  tabIndexToView : any = 0;
  items : any = [];
  buttonname  : any = 'Create';
  AllData : any = [];
  seachSpinner : any= false;
  Spinner : any = false;
  initDate : any = [];
  ObjBrowse : Browse = new Browse();  
  ConsumptionFormSubmitted : any = false;
  BrowseFormSubmitted : any = false;
  Searchedlist : any = [];
  ToBcostcenlist : any = [];
  ToBGodownList : any = [];
  Entry_Date = new Date();
  flag : boolean = false;
  Save : boolean = false;
  Del : boolean = false;
  Browselist : any = [];
  ViewListobj : any = {};
  ViewListobj2 : any = {};
  ViewList : any = [];
  ViewList2 : any = [];
  ViewProTypeModal2 : any = false;
  ViewProTypeModal3 : any = false;
  Productid : any;
  DocNo : any;
  Batchno : any;
  f : any;
  objAllData : AllData = new AllData();
  Del_Right : string = "";

  seachSpinnerPendUtil = false;
  PendUtil_start_date: Date;
  PendUtil_end_date: Date;
  PendUtilList:any = [];
  DynamicHeaderforPendUtilList:any = [];
  allTotalObj:any = {}
  BackupPendUtilList:any = [];
  BackupPendUtilListFilter:any = []
  SelectedDistDepartmentPendUtil:any = [];
  SelectedDistCostCen:any = [];
  DistDepartmentPendUtil:any = [];
  DistCostCen:any = [];
  DistStockPoint:any =[];
  SelectedDistStockPoint:any = [];
  

  constructor(
    private $http : HttpClient,
    private commonApi : CompacctCommonApi,
    private Header : CompacctHeader,
    private GlobalAPI : CompacctGlobalApiService,
    private route : ActivatedRoute,
    private compacctToast : MessageService,
    private DateService : DateTimeConvertService,
    private $CompacctAPI: CompacctCommonApi
  ) { }

  ngOnInit() {
    this.items = ["BROWSE", "CREATE", "PENDING UTILIZATION"];
    this.Header.pushHeader({
      Header:  " Consumption/Utilization " ,
      Link: "Consumption/Utilization " 
    });
    // this.initDate = [new Date(),new Date()];
    this.getCostcenter();
    this.Finyear();
    //this.Getsearchlist2();
    
  }

  onReject(){
    this.compacctToast.clear("c");
  }
  TabClick(e) {
    this.tabIndexToView = e.index;
    this.items = ["BROWSE", "CREATE", "PENDING UTILIZATION"];
    this.buttonname = "Save";
    this.clearData();
    //this.Editdisable = false;
  }
  Finyear() {
    this.$http
      .get("Common/Get_Fin_Year_Date?Fin_Year_ID=" + this.$CompacctAPI.CompacctCookies.Fin_Year_ID)
      .subscribe((res: any) => {
      let data = JSON.parse(res)
      // this.vouchermaxDate = new Date(data[0].Fin_Year_End);
      // this.voucherminDate = new Date(data[0].Fin_Year_Start);
      // this.voucherdata = new Date().getMonth() > new Date(data[0].Fin_Year_End).getMonth() ? new Date() : new Date(data[0].Fin_Year_End)
     this.initDate =  [new Date(data[0].Fin_Year_Start) , new Date(data[0].Fin_Year_End)]
      });
  }

  // View(col){
  //   if(col.Doc_No){
  //   this.tabIndexToView = 1;
  //  this.Searchedlist = [];
  //  //this.BackupIndentList = [];
  //  this.items = ["BROWSE", "UPDATE"];
  //  this.buttonname = "Update";
  //  this.geteditmaster(col.Doc_No)
  //   }

  // }

  Delete(Doc_No)
  {
    console.log('Doc_No', Doc_No);
    const obj = {
      "SP_String": "Sp_Consumption_Module",
    "Report_Name_String": "Txn_Consumption_Get",
      "Json_Param_String": JSON.stringify([{Doc_No:Doc_No}])
    }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      console.log("Edit",data);
      this.ViewList = data;
      this.ViewListobj = data[0];
      console.log('ViewListobj=',this.ViewListobj);
      //this.todayDate = new Date(data[0].Doc_Date);
      //this.ObjRawMateriali = data[0];
      // TempData.forEach(element => {
      //   this.Searchedlist.push({
      //     Cost_Cen_ID:element.Cost_Cen_ID,
      //     godown_id:element.godown_id,
      //     Issue_Qty:element.Issue_Qty,
      //     Remarks:element.Remarks,
      //     Serial_No:element.Serial_No,
      //     Product_ID:element.Product_ID,
      //     Batch_No:element.Batch_No,
      //     uom : element.UOM	
          
      //   })
      //  });
       //this.BackupIndentList = this.ProductList;
       //this.GetProductType();
    })
    setTimeout(() => {
      this.ViewProTypeModal2 = true;
    }, 200);

  }

  View(Doc_No){
    console.log('Doc_No', Doc_No);
    const obj = {
      "SP_String": "Sp_Consumption_Module",
    "Report_Name_String": "Txn_Consumption_Get",
      "Json_Param_String": JSON.stringify([{Doc_No:Doc_No}])
    }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      console.log("Edit",data);
      this.ViewList2 = data;
      this.ViewListobj2 = data[0];
      console.log('ViewListobj2=',this.ViewListobj2);
      //this.todayDate = new Date(data[0].Doc_Date);
      //this.ObjRawMateriali = data[0];
      // TempData.forEach(element => {
      //   this.Searchedlist.push({
      //     Cost_Cen_ID:element.Cost_Cen_ID,
      //     godown_id:element.godown_id,
      //     Issue_Qty:element.Issue_Qty,
      //     Remarks:element.Remarks,
      //     Serial_No:element.Serial_No,
      //     Product_ID:element.Product_ID,
      //     Batch_No:element.Batch_No,
      //     uom : element.UOM	
          
      //   })
      //  });
       //this.BackupIndentList = this.ProductList;
       //this.GetProductType();
    })
    setTimeout(() => {
      this.ViewProTypeModal3 = true;
    }, 200);


  }

  getCostcenter(){
    const obj = {
      "SP_String": "Sp_Consumption_Module",
      "Report_Name_String": "Get_Cost_Center"
      
    }
     this.GlobalAPI.getData(obj).subscribe((data:any)=>{
       this.ToBcostcenlist = data;
       this.ObjBrowse.Cost_Cen_ID = this.$CompacctAPI.CompacctCookies.Cost_Cen_ID;
       this.objAllData.Cost_Cen_ID = this.$CompacctAPI.CompacctCookies.Cost_Cen_ID;
       console.log('ToBcostcenlist=====',this.ToBcostcenlist)
       this.GetGodown();
     })

  }

  GetGodown(){
    const tempobj={
      Cost_Cen_ID : this.ObjBrowse.Cost_Cen_ID
    }
    const obj = {
      "SP_String": "Sp_Consumption_Module",
      "Report_Name_String": "Get_Godown_Name",
      "Json_Param_String": JSON.stringify([tempobj])
      
    }
     this.GlobalAPI.getData(obj).subscribe((data:any)=>{
       this.ToBGodownList = data;
       this.ObjBrowse.godown_id = data[0].godown_id;
       console.log('ToBGodownList=====',this.ToBGodownList)
       
     })

  }

  GetSearchedList(valid :any){
    this.ConsumptionFormSubmitted = true;
    if(valid)
    {
      
 
     this.seachSpinner = true;
    this.Searchedlist = [];
  const Entry_Date =  this.DateService.dateConvert(new Date(this.Entry_Date))
  
 
 const tempobj = {
  Entry_Date : Entry_Date,
  Cost_Cen_ID : this.ObjBrowse.Cost_Cen_ID ? this.ObjBrowse.Cost_Cen_ID : 0,
  Godown_ID : this.ObjBrowse.godown_id ? this.ObjBrowse.godown_id : 0,
  User_ID : this.$CompacctAPI.CompacctCookies.User_ID

}
const obj = {
  "SP_String": "Sp_Consumption_Module",
  "Report_Name_String": "Txn_Consumption_Balance",
  "Json_Param_String": JSON.stringify([tempobj])
}
 this.GlobalAPI.getData(obj).subscribe((data:any)=>{
   this.Searchedlist = data;
   console.log('Search list=====',this.Searchedlist)
   this.seachSpinner = false;
   this.ConsumptionFormSubmitted = false;
 })
}

  }

  getDateRange(dateRangeObj){
    if (dateRangeObj.length) {
      this.objAllData.Start_Date = dateRangeObj[0];
      this.objAllData.End_Date = dateRangeObj[1];
    }
  }

  Getsearchlist2(valid : any){
    this.BrowseFormSubmitted = true;
    if(valid){
      this.seachSpinner = true;
      this.Browselist = [];
      const start = this.objAllData.Start_Date
  ? this.DateService.dateConvert(new Date(this.objAllData.Start_Date))
  : this.DateService.dateConvert(new Date());
  const end = this.objAllData.End_Date
  ? this.DateService.dateConvert(new Date(this.objAllData.End_Date))
  : this.DateService.dateConvert(new Date());
 this.Del_Right = this.$CompacctAPI.CompacctCookies.Del_Right;
 console.log('Del_Right==',this.Del_Right);
const tempobj = {
  from_Date : start,
  to_date : end,
  Cost_Cen_ID : this.objAllData.Cost_Cen_ID ? this.objAllData.Cost_Cen_ID : 0
  }

  const obj = {
    "SP_String": "Sp_Consumption_Module",
    "Report_Name_String": "Txn_Consumption_Browse",
    "Json_Param_String": JSON.stringify([tempobj])
  }
   this.GlobalAPI.getData(obj).subscribe((data:any)=>{
     this.Browselist = data;
     console.log('Search list=====',this.Browselist)
     this.seachSpinner = false;
     this.BrowseFormSubmitted = false;
   })

  }

}
  qtycheck(col){
    this.flag = false;
    for(let i = 0; i < this.Searchedlist.length ; i++){
      if(this.Searchedlist[i].Issue_Qty){
        if(this.Searchedlist[i].Issue_Qty <= this.Searchedlist[i].Balance_Qty)
        {
          this.flag = false;
        }
        else{
          this.flag = true;
          this.compacctToast.clear();
               this.compacctToast.add({
                   key: "compacct-toast",
                   severity: "error",
                   summary: "Warn Message",
                   detail: "Quantity can't be more than in batch available quantity "
                 });
                 return;
        }
       
      }
    }
   
  }
  saveqty(){
    let Flag = true;
    
   for(let i = 0; i < this.Searchedlist.length ; i++){
     
    if(Number(this.Searchedlist[i].Balance_Qty) <  Number(this.Searchedlist[i].Issue_Qty)){
    Flag = false;
    return
    }
    else {
    Flag = true;

    }

 
}
  return Flag;
}
saveqtyChk(){
  let Flag = false;
  for(let i = 0; i < this.Searchedlist.length ; i++){
    if(this.Searchedlist[i].Issue_Qty ){
      Flag = true;
      return Flag
    }
  }
}
 SaveAllowance(){
     console.log("saveqty",this.saveqty())
     console.log("saveqtyChk",this.saveqtyChk())
    if(this.saveqty() && this.saveqtyChk()) {
    this.Save = true;
    this.Del = false;
     this.Spinner = true;
     this.compacctToast.clear();
     this.compacctToast.add({
       key: "c",
       sticky: true,
       closable: false,
       severity: "warn",
       summary: "Are you sure?",
       detail: "Confirm to proceed"
     })
    }
     this.Spinner = false;

  }
  onConfirm(){
    let temparr = [];
    this.Searchedlist.forEach((item : any)=>
    {
      if(item.Issue_Qty && Number(item.Issue_Qty) != 0)
      {
      const tenpobj = {
        Cost_Cen_ID : this.ObjBrowse.Cost_Cen_ID,
        godown_id : this.ObjBrowse.godown_id,
        Issue_Qty : item.Issue_Qty,
        Remarks : item.Remarks,
        User_ID : this.commonApi.CompacctCookies.User_ID, 
        Serial_No: item.Serial_No,
        Product_ID : item.Product_ID,
        Batch_No : item.Batch_No,
        UOM : item.uom
        
      }
      temparr.push(tenpobj);
    }
      
    }) 
    const obj = {
      "SP_String": "Sp_Consumption_Module",
      "Report_Name_String":"Txn_Consumption_Issue_Create",
      "Json_Param_String": JSON.stringify(temparr) 
     }
     this.GlobalAPI.getData(obj).subscribe((data : any)=>
     {
       console.log('data=',data[0].Column1);
       //if (data[0].Sub_Ledger_ID)
       if(data[0].Column1)
       {
         //this.SubLedgerID = data[0].Column1
        this.compacctToast.clear();
        this.compacctToast.add({
        key: "compacct-toast",
        severity: "success",
        summary: "Consumption Create Succesfully ",
        detail: "Succesfully Created"
      });
      //this.getAllList();
      
      this.clearData();
      
      this.Spinner = false;
      this.tabIndexToView = 0;
      }
      else{
        this.compacctToast.clear();
        this.compacctToast.add({
        key: "compacct-toast",
        severity: "error",
        summary: "Error",
        detail: "Something Wrong"
      });
      this.clearData();
      this.Spinner = false;
      }
     });
    
}

// getAllList(){
//   const obj = {
//     "SP_String": "Sp_Consumption_Module",
//     "Report_Name_String": "Txn_Consumption_Browse"
//   }
//    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
//      this.Browselist = data;
//      console.log('Browselist=====',this.Browselist)
     
//    })

// }

DeleteConsumption(col){
  this.Del = true;
  this.Save = false;
  this.Productid = col.Product_ID;
  this.DocNo = col.Doc_No;
  this.Batchno = col.Batch_No;
  console.log(this.Productid);
     
      this.Spinner = true;
      
     this.compacctToast.clear();
     this.compacctToast.add({
       key: "c",
       sticky: true,
       closable: false,
       severity: "warn",
       summary: "Are you sure?",
       detail: "Confirm to proceed"
     })
     this.Spinner = false;
  
}
onConfirm2(){
  const tempobj={
    Doc_No : this.DocNo,
    Product_ID : this.Productid,
    Batch_No	 : this.Batchno
  }
  const obj = {
    "SP_String": "Sp_Consumption_Module",
    "Report_Name_String": "Txn_Consumption_Delete",
    "Json_Param_String": JSON.stringify([tempobj])
    
  }
   this.GlobalAPI.getData(obj).subscribe((data:any)=>{
    console.log('data=',data[0].Column1);
    //if (data[0].Sub_Ledger_ID)
    if(data[0].Column1)
    {
      //this.SubLedgerID = data[0].Column1
     this.compacctToast.clear();
     this.compacctToast.add({
     key: "compacct-toast",
     severity: "success",
     summary: "Consumption Delete Succesfully ",
     detail: "Succesfully Deleted"
   });
   this.Delete(this.DocNo);
   this.Getsearchlist2(true);
  }
  else{
    this.compacctToast.clear();
    this.compacctToast.add({
    key: "compacct-toast",
    severity: "error",
    summary: "Error",
    detail: "Something Wrong"
  });
}
     
   })

}


  clearData(){
    this.ObjBrowse = new Browse();
    this.objAllData = new AllData();
    this.ConsumptionFormSubmitted = false;
    this.BrowseFormSubmitted = false;
    this.Searchedlist = [];
    this.Browselist=[];
    this.Entry_Date = new Date();
    // this.initDate = [new Date(),new Date()]
    this.Finyear();
    
    this.getCostcenter();
}

// Pending Utilization
getDateRangePenUtil(dateRangeObj) {
  if (dateRangeObj.length) {
    this.PendUtil_start_date = dateRangeObj[0];
    this.PendUtil_end_date = dateRangeObj[1];
  }
}
GetPenUtil(){
    // this.PendingIndentFormSubmitted = true;
    this.seachSpinnerPendUtil = true;
    const start = this.PendUtil_start_date
    ? this.DateService.dateConvert(new Date(this.PendUtil_start_date))
    : this.DateService.dateConvert(new Date());
    const end = this.PendUtil_end_date
    ? this.DateService.dateConvert(new Date(this.PendUtil_end_date))
    : this.DateService.dateConvert(new Date());
    if (start && end) {
    const tempobj = {
      From_Date : start,
      To_Date  : end,
    //  To_Cost_Cen_ID : this.ObjPendingIndent.Cost_Cen_ID,
    //  proj : "N"
    }
    // if (valid) {
    const obj = {
      "SP_String": "SP_MICL_Dispatch_Challan",
      "Report_Name_String": "Pending_Utilization",
      "Json_Param_String": JSON.stringify([tempobj])
      }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      this.PendUtilList = data;
      this.BackupPendUtilList = data;
      this.BackupPendUtilListFilter = data;
      // this.GetDistinctPenUtil();
      this.GetDeptDist()
      this.GetCostCenterDist()
      this.getStockPoint()
      if(this.PendUtilList.length){
        this.DynamicHeaderforPendUtilList = Object.keys(data[0]);
      }
      else {
        this.DynamicHeaderforPendUtilList = [];
      }
      this.seachSpinnerPendUtil = false;
      this.TotalValue(this.PendUtilList);
      // console.log("DynamicHeaderforPendUtilList",this.DynamicHeaderforPendUtilList);
    })
    }
    else {
      this.seachSpinnerPendUtil = false;
      // this.ngxService.stop();
      this.compacctToast.clear();
        this.compacctToast.add({
          key: "compacct-toast",
          severity: "error",
          summary: "Warn Message",
          detail: "Something Wrong"
        });
    }
}
exportexcelPenUtil(Arr,fileName): void {
  const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(Arr);
  const workbook: XLSX.WorkBook = {Sheets: {'data': worksheet}, SheetNames: ['data']};
  XLSX.writeFile(workbook, fileName+'.xlsx');
}
FilterDistPenUtil(v:any) {
  let department:any = [];
  let costcen:any = [];
  let stockpoint:any = [];
  let SearchFieldsPenUtil:any =[];
if (this.SelectedDistDepartmentPendUtil.length) {
  SearchFieldsPenUtil.push('Dept_Name');
  department = this.SelectedDistDepartmentPendUtil;
  console.log("department",department)
}
if (this.SelectedDistCostCen.length) {
  SearchFieldsPenUtil.push('Cost_Cen_Name');
  costcen = this.SelectedDistCostCen;
}
if (this.SelectedDistStockPoint.length) {
  SearchFieldsPenUtil.push('Stock_Point');
  stockpoint = this.SelectedDistStockPoint;
}
this.PendUtilList = [];
console.log("SearchFieldsPenUtil",SearchFieldsPenUtil)
console.log("BackupPendUtilList",this.BackupPendUtilList)
if (SearchFieldsPenUtil.length) {
  let LeadArr = this.BackupPendUtilList.filter(function (e) {
    return (department.length ? department.includes(e['Dept_Name']) : true)
    && (costcen.length ? costcen.includes(e['Cost_Cen_Name']) : true)
    && (stockpoint.length ? stockpoint.includes(e['Stock_Point']) : true)
  });
  console.log("LeadArr",LeadArr)
this.PendUtilList = LeadArr.length ? LeadArr : [];

} else {
this.PendUtilList = [...this.BackupPendUtilList] ;
}
this.TotalValue(this.PendUtilList);
if(v === "Dept_Name"){
  this.getStockPoint()
  this.GetCostCenterDist()
  
}
if(v === "Cost_Cen_Name"){
  this.getStockPoint()
}
if(v != "Stock_Point"){
 // this.getStockPoint()
}
if(!this.SelectedDistDepartmentPendUtil.length && !this.SelectedDistCostCen.length && !this.SelectedDistStockPoint.length){
  this.GetDeptDist()
  this.getStockPoint()
  this.GetCostCenterDist()
}
}
GetDistinctPenUtil() {
  //let department:any = [];
  let costcen:any = [];
  let stockpoint:any = [];
  // this.DistDepartmentPendUtil =[];
  // this.SelectedDistDepartmentPendUtil =[];
  // this.DistCostCen =[];
  // this.SelectedDistCostCen =[];
  this.DistStockPoint =[];
  this.SelectedDistStockPoint = [];
  this.PendUtilList.forEach((item) => {
// if (department.indexOf(item.Dept_Name) === -1) {
//   department.push(item.Dept_Name);
//   this.DistDepartmentPendUtil.push({ label: item.Dept_Name, value: item.Dept_Name });
//   }
//  if (costcen.indexOf(item.Cost_Cen_Name) === -1) {
//   costcen.push(item.Cost_Cen_Name);
//  this.DistCostCen.push({ label: item.Cost_Cen_Name, value: item.Cost_Cen_Name });
//  }
 if (stockpoint.indexOf(item.Stock_Point) === -1) {
  stockpoint.push(item.Stock_Point);
 this.DistStockPoint.push({ label: item.Stock_Point, value: item.Stock_Point });
 }
});
   this.BackupPendUtilList = [...this.PendUtilList];
}

GetDeptDist(){
  let department:any = [];
  this.DistDepartmentPendUtil =[];
  this.SelectedDistDepartmentPendUtil =[];
  this.PendUtilList.forEach((item) => {
    if (department.indexOf(item.Dept_Name) === -1) {
      department.push(item.Dept_Name);
      this.DistDepartmentPendUtil.push({ label: item.Dept_Name, value: item.Dept_Name });
      }
      this.BackupPendUtilList = [...this.BackupPendUtilListFilter];
  })
}
GetCostCenterDist(){
  let costcen:any = [];
  this.DistCostCen =[];
  this.SelectedDistCostCen =[];
  console.log("Pend Util List",this.PendUtilList)
  this.PendUtilList.forEach((item) => {
    if (costcen.indexOf(item.Cost_Cen_Name) === -1) {
      costcen.push(item.Cost_Cen_Name);
     this.DistCostCen.push({ label: item.Cost_Cen_Name, value: item.Cost_Cen_Name });
     }
      this.BackupPendUtilList = [...this.BackupPendUtilListFilter];
  })
}
getStockPoint(){
  let stockpoint:any = [];
  this.DistStockPoint =[];
  this.SelectedDistStockPoint = [];
  this.PendUtilList.forEach((item) => {
    if (stockpoint.indexOf(item.Stock_Point) === -1) {
      stockpoint.push(item.Stock_Point);
     this.DistStockPoint.push({ label: item.Stock_Point, value: item.Stock_Point });
     }
      this.BackupPendUtilList = [...this.BackupPendUtilListFilter];
  })
}
TotalValue(arrList:any){
  if(arrList.length){
    this.allTotalObj.Value =0
    arrList.forEach(ele => {
      this.allTotalObj.Value = Number(Number(ele.Value) + Number(this.allTotalObj.Value)).toFixed(2)
    });
  }
  console.log(this.allTotalObj)
}

}

class Browse{
  Cost_Cen_ID : any;
  
  Entry_Date : any;
  
  godown_id : any
}

class AllData{
  Start_Date : any;
  End_Date  : any;
  Cost_Cen_ID : any
}
