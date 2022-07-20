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
  Searchedlist : any = [];
  ToBcostcenlist : any = [];
  ToBGodownList : any = [];
  Entry_Date = new Date();
  flag : boolean = false;
  Save : boolean = false;
  Del : boolean = false;
  Browselist : any = [];
  ViewListobj : any = {};
  ViewList : any = [];
  ViewProTypeModal2 : any = false;
  Productid : any;
  DocNo : any;
  Batchno : any;
  f : any;

  constructor(
    private $http : HttpClient,
    private commonApi : CompacctCommonApi,
    private Header : CompacctHeader,
    private GlobalAPI : CompacctGlobalApiService,
    private route : ActivatedRoute,
    private compacctToast : MessageService,
    private DateService : DateTimeConvertService
  ) { }

  ngOnInit() {
    this.items = ["BROWSE", "CREATE"];
    this.Header.pushHeader({
      Header:  "  " ,
      Link: " " 
    });
    this.getCostcenter();
    this.getAllList();
    
  }

  onReject(){
    this.compacctToast.clear("c");
  }
  TabClick(e) {
    this.tabIndexToView = e.index;
    this.items = ["BROWSE", "CREATE"];
    this.buttonname = "Save";
    this.clearData();
    //this.Editdisable = false;
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

  View(Doc_No)
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

  

  getCostcenter(){
    const obj = {
      "SP_String": "Sp_Consumption_Module",
      "Report_Name_String": "Get_Cost_Center"
      
    }
     this.GlobalAPI.getData(obj).subscribe((data:any)=>{
       this.ToBcostcenlist = data;
       console.log('ToBcostcenlist=====',this.ToBcostcenlist)
       
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
  Godown_ID : this.ObjBrowse.godown_id ? this.ObjBrowse.godown_id : 0

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
      this.getAllList();
      
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

getAllList(){
  const obj = {
    "SP_String": "Sp_Consumption_Module",
    "Report_Name_String": "Txn_Consumption_Browse"
  }
   this.GlobalAPI.getData(obj).subscribe((data:any)=>{
     this.Browselist = data;
     console.log('Browselist=====',this.Browselist)
     
   })

}

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
   this.View(this.DocNo);
   this.getAllList();
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
    this.ConsumptionFormSubmitted = false;
    this.Searchedlist = [];
    this.Entry_Date = new Date();
}

}

class Browse{
  Cost_Cen_ID : any;
  
  Entry_Date : any;
  
  godown_id : any
}
