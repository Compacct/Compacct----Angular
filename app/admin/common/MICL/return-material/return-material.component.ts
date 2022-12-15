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
  selector: 'app-return-material',
  templateUrl: './return-material.component.html',
  styleUrls: ['./return-material.component.css'],
  providers:[MessageService],
  encapsulation: ViewEncapsulation.None
})
export class ReturnMaterialComponent implements OnInit {
  tabIndexToView : any = 0;
  items : any = [];
  buttonname  : any = 'Create';
  Spinner : any = false;
  initDate : any = [];
  ObjBrowse : Browse = new Browse();
  ToBcostcenlist:any = [];
  ToBGodownList:any = [];
  BrowseFormSubmitted:boolean = false;
  Browselist:any = [];
  Entry_Date = new Date();
  ObjReturnMat : ReturnMat = new ReturnMat();
  ReturnMaterialFormSubmitted:boolean = false;
  seachSpinner : any= false;
  Searchedlist:any = [];
  flag:boolean = false;
  Productid: any;
  DocNo: any;
  Batchno: any;
  ViewList:any = [];
  ViewListobj2 : any = {};
  ViewModal:boolean = false;
  EditList:any = [];
  EditListobj : any = {};
  EditModal:boolean = false;

  Del_Right : string = "";
  Pendreturn_start_date: Date;
  Pendreturn_end_date: Date;
  seachSpinnerPendReturn = false;
  PendReturnList:any = [];
  BackupPendReturnList:any = [];
  BackupPendReturnListFilter:any = [];

  DynamicHeaderforPendReturnList:any = [];
  allTotalObj:any = {}
  SelectedDistDepartmentPendReturn:any = [];
  SelectedDistCostCen:any = [];
  DistDepartmentPendReturn:any = [];
  DistCostCen:any = [];
  DistStockPoint:any =[];
  SelectedDistStockPoint:any = [];
  TotalQty: any;
  TotalAccptQty: any;

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
    this.items = ["BROWSE", "CREATE", "PENDING RETURN"];
    this.Header.pushHeader({
      Header:  "Return Material " ,
      Link: "Return Material " 
    });
    // this.initDate = [new Date(),new Date()];
    this.getCostcenter();
    this.Finyear();
    //this.Getsearchlist2();
    this.Del_Right = this.$CompacctAPI.CompacctCookies.Del_Right;
    
  }
  TabClick(e) {
    this.tabIndexToView = e.index;
    this.items = ["BROWSE", "CREATE", "PENDING RETURN"];
    this.buttonname = "Create";
    this.clearData();
    //this.Editdisable = false;
    this.Searchedlist = this.tabIndexToView ? this.Searchedlist : [];
    this.ObjReturnMat = this.tabIndexToView ? this.ObjReturnMat : new ReturnMat();
    this.Entry_Date = this.tabIndexToView ? this.Entry_Date : new Date();
    this.ObjReturnMat.Cost_Cen_ID = this.tabIndexToView ? this.ObjReturnMat.Cost_Cen_ID : this.getCostcenter();
  }
  clearData(){
    // this.ObjBrowse = new Browse();
    // this.ObjReturnMat = new ReturnMat();
    this.ReturnMaterialFormSubmitted = false;
    this.BrowseFormSubmitted = false;
    // this.Searchedlist = [];
    this.Browselist=[];
    // this.Entry_Date = new Date();
    // this.initDate = [new Date(),new Date()]
    this.Finyear();
    
    // this.getCostcenter();
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
  getCostcenter(){
    const obj = {
      "SP_String": "Sp_Return_Material_Module",
      "Report_Name_String": "Get_Cost_Center"
      
    }
     this.GlobalAPI.getData(obj).subscribe((data:any)=>{
       this.ToBcostcenlist = data;
       this.ObjBrowse.Cost_Cen_ID = this.$CompacctAPI.CompacctCookies.Cost_Cen_ID;
       this.ObjReturnMat.Cost_Cen_ID = this.$CompacctAPI.CompacctCookies.Cost_Cen_ID;
       console.log('ToBcostcenlist=====',this.ToBcostcenlist)
       this.GetGodown();
     })

  }
  GetGodown(){
    const tempobj={
      Cost_Cen_ID : this.ObjReturnMat.Cost_Cen_ID
    }
    const obj = {
      "SP_String": "Sp_Return_Material_Module",
      "Report_Name_String": "Get_Godown_Name",
      "Json_Param_String": JSON.stringify([tempobj])
      
    }
     this.GlobalAPI.getData(obj).subscribe((data:any)=>{
       this.ToBGodownList = data;
       this.ObjReturnMat.godown_id = this.ToBGodownList.length ? data[0].godown_id : undefined;
       console.log('ToBGodownList=====',this.ToBGodownList)
       
     })

  }
  getDateRange(dateRangeObj){
    if (dateRangeObj.length) {
      this.ObjBrowse.Start_Date = dateRangeObj[0];
      this.ObjBrowse.End_Date = dateRangeObj[1];
    }
  }

  Getsearchlist(valid : any){
    this.BrowseFormSubmitted = true;
    this.seachSpinner = true;
    this.Browselist = [];
    if(valid){
      const start = this.ObjBrowse.Start_Date
      ? this.DateService.dateConvert(new Date(this.ObjBrowse.Start_Date))
      : this.DateService.dateConvert(new Date());
      const end = this.ObjBrowse.End_Date
      ? this.DateService.dateConvert(new Date(this.ObjBrowse.End_Date))
      : this.DateService.dateConvert(new Date());
      // this.Del_Right = this.$CompacctAPI.CompacctCookies.Del_Right;
      // console.log('Del_Right==',this.Del_Right);
      const tempobj = {
        from_Date : start,
        to_date : end,
        Cost_Cen_ID : this.ObjBrowse.Cost_Cen_ID ? this.ObjBrowse.Cost_Cen_ID : 0,
        User_ID : this.$CompacctAPI.CompacctCookies.User_ID
        }

      const obj = {
        "SP_String": "Sp_Return_Material_Module",
        "Report_Name_String": "Txn_Return_Material_Browse",
        "Json_Param_String": JSON.stringify([tempobj])
      }
       this.GlobalAPI.getData(obj).subscribe((data:any)=>{
         this.Browselist = data;
         console.log('Search list=====',this.Browselist)
         this.seachSpinner = false;
         this.BrowseFormSubmitted = false;
       })

    }
    else {
      this.seachSpinner = false;
    }
  }

  // Create
  CreateSearchedList(valid :any){
    this.ReturnMaterialFormSubmitted = true;
    this.seachSpinner = true;
    this.Searchedlist = [];
    const Entry_Date =  this.DateService.dateConvert(new Date(this.Entry_Date))
    if(valid) {
    const tempobj = {
      Entry_Date : Entry_Date,
      Cost_Cen_ID : this.ObjReturnMat.Cost_Cen_ID ? this.ObjReturnMat.Cost_Cen_ID : 0,
      Godown_ID : this.ObjReturnMat.godown_id ? this.ObjReturnMat.godown_id : 0,
      User_ID : this.$CompacctAPI.CompacctCookies.User_ID
    }
    const obj = {
      "SP_String": "Sp_Return_Material_Module",
      "Report_Name_String": "Txn_Return_Material_Balance",
      "Json_Param_String": JSON.stringify([tempobj])
    }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      this.Searchedlist = data;
      console.log('Search list=====',this.Searchedlist)
      this.seachSpinner = false;
      this.ReturnMaterialFormSubmitted = false;
      this.totalqty();
    })
    }
    else {
      this.seachSpinner = false;
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
      this.totalqty();
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
  totalqty(){
    this.TotalQty = undefined;
    // this.TotalAccptQty = undefined;
    let count = 0;
    let count1 = 0;
    this.Searchedlist.forEach(item => {
      // count = count + Number(item.Balance_Qty);
      if(item.Issue_Qty) {
      count1 = count1 + Number(item.Issue_Qty);
      }
    });
    this.TotalQty = (count1).toFixed(2);
    console.log('this.TotalQty ====',this.TotalQty)
    // this.TotalAccptQty = (count1).toFixed(2);
    // console.log('this.TotalAccptQty ====',this.TotalAccptQty)
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
     this.Spinner = true;
     this.compacctToast.clear();
     this.compacctToast.add({
       key: "s",
       sticky: true,
       closable: false,
       severity: "warn",
       summary: "Are you sure?",
       detail: "Confirm to proceed"
     })
    }
    //  this.Spinner = false;

 }
  onConfirmSave(){
    let temparr:any = [];
    this.Searchedlist.forEach((item : any)=>
    {
      if(item.Issue_Qty && Number(item.Issue_Qty) != 0)
      {
      const tenpobj = {
        // Cost_Cen_ID : this.ObjReturnMat.Cost_Cen_ID,
        // godown_id : this.ObjReturnMat.godown_id,
        // Issue_Qty : item.Issue_Qty,
        // Remarks : item.Remarks,
        // User_ID : this.commonApi.CompacctCookies.User_ID, 
        // Serial_No: item.Serial_No,
        // Product_ID : item.Product_ID,
        // Batch_No : item.Batch_No,
        // UOM : item.uom,

        Doc_No : "A",
        Doc_Date : this.DateService.dateConvert(new Date(this.Entry_Date)),
        Cost_Cen_ID : Number(this.ObjReturnMat.Cost_Cen_ID),
        godown_id : Number(this.ObjReturnMat.godown_id),
        Product_ID : Number(item.Product_ID),
        Qty : Number(item.Issue_Qty),
        Accepted_Qty : 0,
        Rate : 0,
				UOM : item.uom,
        Batch_No : item.Batch_No,
        Serial_No : item.Serial_No,
        User_ID : this.commonApi.CompacctCookies.User_ID,
        Entry_Date : this.DateService.dateConvert(new Date()),
        Status : 'NA',
        Remarks : item.Remarks ? item.Remarks : 'NA',
        Total_Qty :	Number(this.TotalQty),
        Total_Accepted_Qty : 0
        
      }
      temparr.push(tenpobj);
    }
      
    }) 
    const obj = {
      "SP_String": "Sp_Return_Material_Module",
      "Report_Name_String":"Txn_Return_Material_Create",
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
      this.Getsearchlist(true);
      this.getCostcenter();
      this.Spinner = false;
      this.tabIndexToView = 0;
      this.ObjReturnMat = new ReturnMat();
      this.ReturnMaterialFormSubmitted = false;
      this.Searchedlist = [];
      this.Entry_Date = new Date();
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
Edit(Doc_No) {
  console.log('Doc_No', Doc_No);
  const obj = {
    "SP_String": "Sp_Return_Material_Module",
    "Report_Name_String": "Txn_Return_Material_Get",
    "Json_Param_String": JSON.stringify([{Doc_No:Doc_No}])
  }
  this.GlobalAPI.getData(obj).subscribe((data:any)=>{
    console.log("Edit",data);
    this.EditList = data;
    this.EditListobj = data[0];
    console.log('ViewListobj=',this.EditListobj);
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
    this.EditModal = true;
  }, 200);

}
Delete(col){
  this.Productid = undefined;
  this.DocNo = undefined;
  this.Batchno = undefined;
  if (col.Doc_No) {
  this.Productid = col.Product_ID;
  this.DocNo = col.Doc_No;
  this.Batchno = col.Batch_No;
  console.log(this.Productid);
      // this.Spinner = true;
     this.compacctToast.clear();
     this.compacctToast.add({
       key: "c",
       sticky: true,
       closable: false,
       severity: "warn",
       summary: "Are you sure?",
       detail: "Confirm to proceed"
     })
    //  this.Spinner = false;
  }
  
}
onConfirm(){
  const tempobj={
    Doc_No : this.DocNo,
    Product_ID : this.Productid,
    Batch_No	 : this.Batchno
  }
  const obj = {
    "SP_String": "Sp_Return_Material_Module",
    "Report_Name_String": "Txn_Return_Material_Delete",
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
     summary: "Return Material",
     detail: "Succesfully Deleted"
   });
  //  this.Delete(this.DocNo);
  this.Edit(this.DocNo);
   this.Getsearchlist(true);
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
  onReject(){
    this.compacctToast.clear("c");
    this.compacctToast.clear("s");
    this.Spinner = false;
  }
  View(Doc_No){
    console.log('Doc_No', Doc_No);
    const obj = {
      "SP_String": "Sp_Return_Material_Module",
      "Report_Name_String": "Txn_Return_Material_Get",
      "Json_Param_String": JSON.stringify([{Doc_No:Doc_No}])
    }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      console.log("Edit",data);
      this.ViewList = data;
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
      this.ViewModal = true;
    }, 200);


  }

  // Pending Utilization
getDateRangePenReturn(dateRangeObj) {
  if (dateRangeObj.length) {
    this.Pendreturn_start_date = dateRangeObj[0];
    this.Pendreturn_end_date = dateRangeObj[1];
  }
}
GetPenReturn(){
    // this.PendingIndentFormSubmitted = true;
    this.seachSpinnerPendReturn = true;
    const start = this.Pendreturn_start_date
    ? this.DateService.dateConvert(new Date(this.Pendreturn_start_date))
    : this.DateService.dateConvert(new Date());
    const end = this.Pendreturn_end_date
    ? this.DateService.dateConvert(new Date(this.Pendreturn_end_date))
    : this.DateService.dateConvert(new Date());
    if (start && end) {
    const tempobj = {
      From_Date : start,
      To_Date  : end,
      User_ID : this.$CompacctAPI.CompacctCookies.User_ID 
    //  To_Cost_Cen_ID : this.ObjPendingIndent.Cost_Cen_ID,
    //  proj : "N"
    }
    // if (valid) {
    const obj = {
      "SP_String": "Sp_Return_Material_Module",
      "Report_Name_String": "Pending_Return_Material",
      "Json_Param_String": JSON.stringify([tempobj])
      }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      this.PendReturnList = data;
      this.BackupPendReturnList = data;
      this.BackupPendReturnListFilter = data;
      // this.GetDistinctPenUtil();
      this.GetDeptDist()
      this.GetCostCenterDist()
      this.getStockPoint()
      if(this.PendReturnList.length){
        this.DynamicHeaderforPendReturnList = Object.keys(data[0]);
      }
      else {
        this. DynamicHeaderforPendReturnList = [];
      }
      this.seachSpinnerPendReturn = false;
      this.TotalValue(this.PendReturnList);
      // console.log("DynamicHeaderforPendReturnList",this.DynamicHeaderforPendReturnList);
    })
    }
    else {
      this.seachSpinnerPendReturn = false;
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
FilterDistPenReturn(v:any) {
  let department:any = [];
  let costcen:any = [];
  let stockpoint:any = [];
  let SearchFieldsPenUtil:any =[];
if (this.SelectedDistDepartmentPendReturn.length) {
  SearchFieldsPenUtil.push('Dept_Name');
  department = this.SelectedDistDepartmentPendReturn;
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
this.PendReturnList = [];
console.log("SearchFieldsPenUtil",SearchFieldsPenUtil)
console.log("BackupPendUtilList",this.BackupPendReturnList)
if (SearchFieldsPenUtil.length) {
  let LeadArr = this.BackupPendReturnList.filter(function (e) {
    return (department.length ? department.includes(e['Dept_Name']) : true)
    && (costcen.length ? costcen.includes(e['Cost_Cen_Name']) : true)
    && (stockpoint.length ? stockpoint.includes(e['Stock_Point']) : true)
  });
  console.log("LeadArr",LeadArr)
this.PendReturnList = LeadArr.length ? LeadArr : [];

} else {
this.PendReturnList = [...this.BackupPendReturnList] ;
}
this.TotalValue(this.PendReturnList);
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
if(!this.SelectedDistDepartmentPendReturn.length && !this.SelectedDistCostCen.length && !this.SelectedDistStockPoint.length){
  this.GetDeptDist()
  this.getStockPoint()
  this.GetCostCenterDist()
}
}
GetDistinctPenUtil() {
  //let department:any = [];
  let costcen:any = [];
  let stockpoint:any = [];
  // this.DistDepartmentPendReturn =[];
  // this.SelectedDistDepartmentPendReturn =[];
  // this.DistCostCen =[];
  // this.SelectedDistCostCen =[];
  this.DistStockPoint =[];
  this.SelectedDistStockPoint = [];
  this.PendReturnList.forEach((item) => {
// if (department.indexOf(item.Dept_Name) === -1) {
//   department.push(item.Dept_Name);
//   this.DistDepartmentPendReturn.push({ label: item.Dept_Name, value: item.Dept_Name });
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
   this.BackupPendReturnList = [...this.PendReturnList];
}

GetDeptDist(){
  let department:any = [];
  this.DistDepartmentPendReturn =[];
  this.SelectedDistDepartmentPendReturn =[];
  this.PendReturnList.forEach((item) => {
    if (department.indexOf(item.Dept_Name) === -1) {
      department.push(item.Dept_Name);
      this.DistDepartmentPendReturn.push({ label: item.Dept_Name, value: item.Dept_Name });
      }
      this.BackupPendReturnList = [...this.BackupPendReturnListFilter];
  })
}
GetCostCenterDist(){
  let costcen:any = [];
  this.DistCostCen =[];
  this.SelectedDistCostCen =[];
  console.log("Pend Util List",this.PendReturnList)
  this.PendReturnList.forEach((item) => {
    if (costcen.indexOf(item.Cost_Cen_Name) === -1) {
      costcen.push(item.Cost_Cen_Name);
     this.DistCostCen.push({ label: item.Cost_Cen_Name, value: item.Cost_Cen_Name });
     }
      this.BackupPendReturnList = [...this.BackupPendReturnListFilter];
  })
}
getStockPoint(){
  let stockpoint:any = [];
  this.DistStockPoint =[];
  this.SelectedDistStockPoint = [];
  this.PendReturnList.forEach((item) => {
    if (stockpoint.indexOf(item.Stock_Point) === -1) {
      stockpoint.push(item.Stock_Point);
     this.DistStockPoint.push({ label: item.Stock_Point, value: item.Stock_Point });
     }
      this.BackupPendReturnList = [...this.BackupPendReturnListFilter];
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
  Start_Date : any;
  End_Date  : any;
  Cost_Cen_ID : any
}
class ReturnMat{
  Entry_Date : any;
  Cost_Cen_ID : any;
  godown_id : any
}
