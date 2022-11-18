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

  // Del_Right : string = "";

  // seachSpinnerPendUtil = false;
  // PendUtil_start_date: Date;
  // PendUtil_end_date: Date;
  // PendUtilList:any = [];
  // DynamicHeaderforPendUtilList:any = [];
  // allTotalObj:any = {}
  // BackupPendUtilList:any = [];
  // BackupPendUtilListFilter:any = []
  // SelectedDistDepartmentPendUtil:any = [];
  // SelectedDistCostCen:any = [];
  // DistDepartmentPendUtil:any = [];
  // DistCostCen:any = [];
  // DistStockPoint:any =[];
  // SelectedDistStockPoint:any = [];

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
      Header:  "Return Material " ,
      Link: "Return Material " 
    });
    // this.initDate = [new Date(),new Date()];
    this.getCostcenter();
    this.Finyear();
    //this.Getsearchlist2();
    
  }
  TabClick(e) {
    this.tabIndexToView = e.index;
    this.items = ["BROWSE", "CREATE"];
    this.buttonname = "Create";
    this.clearData();
    //this.Editdisable = false;
  }
  clearData(){
    this.ObjBrowse = new Browse();
    this.ObjReturnMat = new ReturnMat();
    this.ReturnMaterialFormSubmitted = false;
    this.BrowseFormSubmitted = false;
    this.Searchedlist = [];
    this.Browselist=[];
    this.Entry_Date = new Date();
    // this.initDate = [new Date(),new Date()]
    this.Finyear();
    
    this.getCostcenter();
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
      "SP_String": "Sp_Consumption_Module",
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
      Cost_Cen_ID : this.ObjBrowse.Cost_Cen_ID
    }
    const obj = {
      "SP_String": "Sp_Consumption_Module",
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
        Cost_Cen_ID : this.ObjBrowse.Cost_Cen_ID ? this.ObjBrowse.Cost_Cen_ID : 0
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
      "SP_String": "Sp_Consumption_Module",
      "Report_Name_String": "Txn_Consumption_Balance",
      "Json_Param_String": JSON.stringify([tempobj])
    }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      this.Searchedlist = data;
      console.log('Search list=====',this.Searchedlist)
      this.seachSpinner = false;
      this.ReturnMaterialFormSubmitted = false;
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
        Cost_Cen_ID : this.ObjReturnMat.Cost_Cen_ID,
        godown_id : this.ObjReturnMat.godown_id,
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
  onReject(){
    this.compacctToast.clear("c");
    this.compacctToast.clear("s");
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
