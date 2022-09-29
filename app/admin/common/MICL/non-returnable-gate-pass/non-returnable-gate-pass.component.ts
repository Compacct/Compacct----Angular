import { Component, OnInit, ViewEncapsulation, ViewChild } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { CompacctCommonApi } from "../../../shared/compacct.services/common.api.service";
import { CompacctHeader } from "../../../shared/compacct.services/common.header.service";
import { CompacctGlobalApiService } from "../../../shared/compacct.services/compacct.global.api.service";
import { MessageService } from "primeng/api";
import { DateTimeConvertService } from "../../../shared/compacct.global/dateTime.service";

@Component({
  selector: 'app-non-returnable-gate-pass',
  templateUrl: './non-returnable-gate-pass.component.html',
  styleUrls: ['./non-returnable-gate-pass.component.css'],
  providers: [MessageService],
  encapsulation: ViewEncapsulation.None
})
export class NonReturnableGatePassComponent implements OnInit {
  tabIndexToView : any = 0;
  buttonname : any= "Create";
  Spinner : any = false;
  seachSpinner : any = false;
  TabSpinner : any = false;
  can_popup : any = false;
  Del =false;
  Save = false;
  items : any= [];
  objNonReturnable : NonReturnable = new NonReturnable();
  objsearch : NonReturnableSearch = new NonReturnableSearch();
  Ref_Doc_Date  = new Date();
  Doc_Date = new Date();
  ReturnableListAdd : any = [];
  nonReturnableSearchFormSubmit : any = false;
  nonReturnableFormSubmit : any = false;
  AllnonReturnableData : any = [];
  subLedgerList : any = [];
  AllsubLedgerList :any = [];
  UOMDataList : any = [];
  initDate : any = [];
  Allreturnabledata : any = [];
  DocNo : any;
  SaveData : any = [];

  constructor(
    private $http : HttpClient,
    private commonApi : CompacctCommonApi,
    private Header : CompacctHeader,
    private GlobalAPI : CompacctGlobalApiService,
    private compacctToast : MessageService,
    private DateService : DateTimeConvertService
  ) { }

  ngOnInit() {
    this.items = ["BROWSE", "CREATE"];
    this.Header.pushHeader({
      Header: "Non Returnable Gate Pass",
      Link: " MICL --> non returnable gate pass"
    });
    this.getSubLedger();
    this.getUom();
    this.Finyear();
  }

  TabClick(e) {
    this.tabIndexToView = e.index;
    this.items = ["BROWSE", "CREATE"];
    this.buttonname = "Create";
    
    this.clearData();
  }

  getSubLedger(){
    this.subLedgerList = [];
    this.AllsubLedgerList = [];
    const obj = {
      "SP_String": "SP_BL_Txn_Non_Returnable_Gate_Pass",
      "Report_Name_String": "Get_Sub_Ledger_Dropdown",
    }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      // console.log(data);
      this.AllsubLedgerList = data ;
      console.log("AllsubLedgerList=",this.AllsubLedgerList);
      this.AllsubLedgerList.forEach(el => {
        this.subLedgerList.push({
          label: el.Sub_Ledger_Name,
          value: el.Sub_Ledger_ID
        });
       
      });
     })
  }

  getUom(){
    const obj = {
      "SP_String": "SP_BL_Txn_Non_Returnable_Gate_Pass",
      "Report_Name_String": "Get_UOM_Dropdown",
     }
     this.GlobalAPI.getData(obj).subscribe((data:any)=>{
       console.log("UOMDataList ==>",data);
       this.UOMDataList = data;
     })
  }

  Finyear(){
    this.$http
      .get("Common/Get_Fin_Year_Date?Fin_Year_ID=" + this.commonApi.CompacctCookies.Fin_Year_ID)
      .subscribe((res: any) => {
      let data = JSON.parse(res)
    //  this.MBDatemaxDate = new Date(data[0].Fin_Year_End);
    //  this.MBDateminDate = new Date(data[0].Fin_Year_Start);
    //  this.Projecteddata = new Date().getMonth() > new Date(data[0].Fin_Year_End).getMonth() ? new Date() : new Date(data[0].Fin_Year_End);
     this.initDate =  [new Date(data[0].Fin_Year_Start) , new Date(data[0].Fin_Year_End)]
     //this.initDate2 =  [new Date(data[0].Fin_Year_Start) , new Date(data[0].Fin_Year_End)]
      });
  }


  AddnonReturnable(valid){
    this.nonReturnableFormSubmit = true;
    if(valid){
      this.objNonReturnable.Created_By = this.commonApi.CompacctCookies.User_ID; 
      this.objNonReturnable.Fin_Year_ID = this.commonApi.CompacctCookies.Fin_Year_ID;
      this.objNonReturnable.Doc_Date = this.DateService.dateConvert(this.Doc_Date);
      this.ReturnableListAdd.push({
        Doc_No : this.DocNo? this.DocNo : 'A',
        Doc_Date : this.DateService.dateConvert(this.objNonReturnable.Doc_Date),
        Sub_Ledger_ID : this.objNonReturnable.Sub_Ledger_ID,
        Created_By : this.objNonReturnable.Created_By,
        SL_NO : this.ReturnableListAdd.length + 1,
        Product_Description : this.objNonReturnable.Product_Description,
        UOM : this.objNonReturnable.UOM,
        Qty : this.objNonReturnable.Qty,
        Remarks : this.objNonReturnable.Remarks,
        Fin_Year_ID : this.objNonReturnable.Fin_Year_ID
      })
      console.log(this.ReturnableListAdd);
      this.nonReturnableFormSubmit = false;
      this.objNonReturnable = new NonReturnable();
      this.Retrivedata();
    }

  }

  Retrivedata(){
    if(this.ReturnableListAdd.length){
      this.objNonReturnable.Sub_Ledger_ID = this.ReturnableListAdd.length? this.ReturnableListAdd[0].Sub_Ledger_ID : 0;
      
    }
    else{
      this.objNonReturnable.Sub_Ledger_ID = undefined;
      
    }
  }

  NonReturnableSave(){
    this.Del =false;
    this.Save = true;
   //this.DelVoucherNo = col.Voucher_No ;
   this.compacctToast.clear();
   this.compacctToast.add({
     key: "c",
     sticky: true,
     severity: "warn",
     summary: "Are you sure?",
     detail: "Confirm to proceed"
   });

  }

  onConfirm(){
    if(this.DocNo){
      this.ReturnableListAdd.forEach(el=>{
        this.SaveData.push({
          Sub_Ledger_ID : el.Sub_Ledger_ID,
          Created_By : this.commonApi.CompacctCookies.User_ID,
          Qty : el.Qty,
          UOM : el.UOM,
          Product_Description : el.Product_Description,
          Remarks : el.Remarks,
          Doc_No : el.Doc_No,
          Doc_Date : el.Doc_Date?this.DateService.dateConvert(el.Doc_Date): null,
          Fin_Year_ID : this.commonApi.CompacctCookies.Fin_Year_ID
        })
      });
      console.log(this.SaveData);
      const obj = {
        "SP_String": "SP_BL_Txn_Non_Returnable_Gate_Pass",
        "Report_Name_String":"Non_Returnable_Gate_Pass_Update",
        "Json_Param_String": JSON.stringify(this.SaveData) 
       }
       this.GlobalAPI.getData(obj).subscribe((data : any)=>
       {
         console.log('data=',data);
         
         if(data[0].Response == 'Done')
         {
           
          this.compacctToast.clear();
          this.compacctToast.add({
          key: "compacct-toast",
          severity: "success",
          summary: "Journal Voucher Updated Succesfully ",
          detail: "Succesfully Updated"
        });
        //this.getList();
       // this.PaymentRequisitionActionPOPUP = false;
        this.clearData();
        // this.ShowSearchData(true);
         this.ReturnableListAdd = [];
         this.SaveData = [];
        
        this.Spinner = false;
        this.tabIndexToView = 0;
         this.items = ["BROWSE", "CREATE"];
         this.ShowSearchData(true);
        }
        else{
          this.compacctToast.clear();
          this.compacctToast.add({
          key: "compacct-toast",
          severity: "error",
          summary: "Error",
          detail: "Something Wrong"
        });
        
        this.Spinner = false;
        this.SaveData = [];
        }
       });


    }
    else{
    this.ReturnableListAdd.forEach(el=>{
      this.SaveData.push({
        Sub_Ledger_ID : el.Sub_Ledger_ID,
        Created_By : el.Created_By,
        Qty : el.Qty,
        UOM : el.UOM,
        Product_Description : el.Product_Description,
        Remarks : el.Remarks,
        Doc_No : el.Doc_No,
        Doc_Date : el.Doc_Date?this.DateService.dateConvert(el.Doc_Date): null,
        Fin_Year_ID : el.Fin_Year_ID
      })
    });
    console.log(this.SaveData);
    const obj = {
      "SP_String": "SP_BL_Txn_Non_Returnable_Gate_Pass",
      "Report_Name_String":"Non_Returnable_Gate_Pass_Create",
      "Json_Param_String": JSON.stringify(this.SaveData) 
     }
     this.GlobalAPI.getData(obj).subscribe((data : any)=>
     {
       console.log('data=',data);
       
       if(data[0].Response == 'Done')
       {
         
        this.compacctToast.clear();
        this.compacctToast.add({
        key: "compacct-toast",
        severity: "success",
        summary: "Journal Voucher Create Succesfully ",
        detail: "Succesfully Created"
      });
      //this.getList();
     // this.PaymentRequisitionActionPOPUP = false;
      this.clearData();
      // this.ShowSearchData(true);
       this.ReturnableListAdd = [];
       this.SaveData = [];
      
      this.Spinner = false;
      this.tabIndexToView = 0;
       this.items = ["BROWSE", "CREATE"];
       this.ShowSearchData(true);
      }
      else{
        this.compacctToast.clear();
        this.compacctToast.add({
        key: "compacct-toast",
        severity: "error",
        summary: "Error",
        detail: "Something Wrong"
      });
      
      this.Spinner = false;
      this.SaveData = [];
      }
     });
    }

  }

  DeleteNonReturnable(index){
    this.ReturnableListAdd.splice(index,1);
      
      this.ReturnableListAdd.forEach((el:any, ind) => {
        el.SL_NO = ind + 1
      });

  }

  getDateRange(dateRangeObj){
    if (dateRangeObj.length) {
      console.log("dateRangeObj",dateRangeObj);
      this.objsearch.Start_Date = dateRangeObj[0];
      this.objsearch.End_Date = dateRangeObj[1];
    }
  }

  ShowSearchData(valid){
    this.nonReturnableSearchFormSubmit = true;
    if(valid){
      this.objsearch.Start_Date = this.objsearch.Start_Date
    ? this.DateService.dateConvert(new Date(this.objsearch.Start_Date))
    : this.DateService.dateConvert(new Date());
    this.objsearch.End_Date = this.objsearch.End_Date
    ? this.DateService.dateConvert(new Date(this.objsearch.End_Date))
    : this.DateService.dateConvert(new Date());
    let TempData = {
      
      //Cost_Cen_ID: Number(this.objsearch.Cost_Cen_ID),
      Start_Date: this.objsearch.Start_Date,
      End_Date: this.objsearch.End_Date,
      Sub_Ledger_ID : Number(this.objsearch.Sub_Ledger_ID)
     
    }
    const obj = {
      "SP_String": "SP_BL_Txn_Non_Returnable_Gate_Pass",
      "Report_Name_String": "Non_Returnable_Gate_Pass_Browse",
      "Json_Param_String" : JSON.stringify([TempData])
    }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
     console.log("all Data",data);
     this.Allreturnabledata = data;
      
     })
     this.nonReturnableSearchFormSubmit = false;

    }

  }

  EditnonReturnable(col){
    if(col.Doc_No){
      this.DocNo = col.Doc_No;
      this.tabIndexToView = 1;
      this.items = ["BROWSE", "UPDATE"];
      this.buttonname = "Update";
      this.getNonReturnable(col.Doc_No);
      }
  }

  getNonReturnable(DocNo){
    const obj = {
      "SP_String": "SP_BL_Txn_Non_Returnable_Gate_Pass",
      "Report_Name_String":"Non_Returnable_Gate_Pass_Get",
      "Json_Param_String": JSON.stringify([{ Doc_No: DocNo}]) 
      }
      this.GlobalAPI.getData(obj).subscribe((data:any)=>{
        console.log('Data=',data);
        this.ReturnableListAdd = data;
        //this.SaveData = data;
         this.objNonReturnable.Sub_Ledger_ID = data[0].Sub_Ledger_ID;
        

  });
}

  clearData(){
    this.DocNo = undefined;
    this.ReturnableListAdd = [];
    this.SaveData = [];
    this.objNonReturnable = new NonReturnable();
    this.Doc_Date = new Date();
    this.nonReturnableSearchFormSubmit  = false;
    this.nonReturnableFormSubmit  = false;
  }

  onReject(){
    this.compacctToast.clear("c");
  }

 

  

 

  onConfirm2(){

  }

}
class NonReturnable{
  Sub_Ledger_ID : any;
  Product_Description : any;
  UOM : any;
  Qty : any;
  Remarks : any;
  Created_By : any;
  Fin_Year_ID : any;
  Doc_Date : any;
}
class NonReturnableSearch{
  Sub_Ledger_ID : any;
  Start_Date : any;
  End_Date : any;
}