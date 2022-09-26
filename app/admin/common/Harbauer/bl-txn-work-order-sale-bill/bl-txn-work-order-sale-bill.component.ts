import { Component, OnInit, ViewEncapsulation, ViewChild } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { CompacctCommonApi } from "../../../shared/compacct.services/common.api.service";
import { CompacctHeader } from "../../../shared/compacct.services/common.header.service";
import { CompacctGlobalApiService } from "../../../shared/compacct.services/compacct.global.api.service";
import { MessageService } from "primeng/api";
import { DateTimeConvertService } from "../../../shared/compacct.global/dateTime.service";


@Component({
  selector: 'app-bl-txn-work-order-sale-bill',
  templateUrl: './bl-txn-work-order-sale-bill.component.html',
  styleUrls: ['./bl-txn-work-order-sale-bill.component.css'],
  providers: [MessageService],
  encapsulation: ViewEncapsulation.None
})
export class BLTxnWorkOrderSaleBillComponent implements OnInit {
  tabIndexToView : any = 0;
  buttonname : any= "Create";
  Spinner : any = false;
  seachSpinner : any = false;
  can_popup : any = false;
  Del =false;
  Save = false;
  items : any= [];
  objWorkOrder : WorkOrder = new WorkOrder();
  objsearch : Search = new Search();
  WorkFormSubmit : any = false;
  WorkOrderAdd : any = [];
  initDate : any = [];
  AllWorkOrderData : any = [];
  AllprojectList : any = [];
  projectList : any = [];
  WorkDetailsList : any = [];
  Amount : any;
  SaveData : any = [];
  Doc_Date = new Date();
  DocNo : any;

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
      Header: "WORK ORDER",
      Link: " Harbauer --> bl txn work order sale bill"
    });
    this.getProject();
  }

  TabClick(e) {
    this.tabIndexToView = e.index;
    this.items = ["BROWSE", "CREATE"];
    this.buttonname = "Create";
    this.WorkOrderAdd = [];
    this.clearData();
  }

  onReject(){
    this.compacctToast.clear("c");
  }

  getProject(){
    this.projectList = [];
    this.AllprojectList = [];
    const obj = {
      "SP_String": "SP_Task_Management_Tender",
      "Report_Name_String": "Get_Project_All",
    }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      // console.log(data);
      this.AllprojectList = data ;
      console.log("AllprojectList=",this.AllprojectList);
      this.AllprojectList.forEach(el => {
        this.projectList.push({
          label: el.Project_Description,
          value: el.Project_ID
        });
       
      });
     })
  }
  projectChange(){
    if(this.objWorkOrder.Project_ID){
      this.getWorkDetails()
      this.getWorkOrder(this.objWorkOrder.Project_ID)
    }
    
  }
  getWorkDetails(){
    console.log('data2')
    if(this.objWorkOrder.Project_ID){
     let Tempdata = {
      Project_ID : this.objWorkOrder.Project_ID
     }
    const obj = {
      "SP_String": "SP_Work_Order_Sale_Bill",
      "Report_Name_String": "Get_Work_Details",
      "Json_Param_String": JSON.stringify([Tempdata])      
    }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      // console.log(data);
      this.WorkDetailsList = data;
     
      console.log("WorkDetailsList",this.WorkDetailsList);
      
       
    });
    
   
 }
  else{
    this.WorkDetailsList = [];
    this.objWorkOrder.Work_Details_ID = undefined;
  }

  }
  
  validcheck(){
    return this.WorkDetailsList.length ? true : false
  }
  getToFix(number){
    if(number){
     return Number(Number(number).toFixed(2))
    }
   }

  AddWorkOrder(valid){
    this.WorkFormSubmit = true;

    if(valid){
      this.Amount = 0;
      this.Amount = Number(this.objWorkOrder.Qty) * Number(this.objWorkOrder.Rate);

      this.objWorkOrder.User_ID = this.commonApi.CompacctCookies.User_ID;
      this.objWorkOrder.Doc_Date = this.DateService.dateConvert(this.Doc_Date);
      this.objWorkOrder.FinYearid = this.commonApi.CompacctCookies.Fin_Year_ID;
      const workFilter = this.WorkDetailsList.filter((el :any)=> Number(el.Work_Details_ID)=== Number(this.objWorkOrder.Work_Details_ID));
      this.WorkOrderAdd.push({
        Doc_No : this.DocNo? this.DocNo : 'A',
        Doc_Date : this.DateService.dateConvert(this.objWorkOrder.Doc_Date),
        Project_ID : this.objWorkOrder.Project_ID,
        User_ID : this.objWorkOrder.User_ID,
        Work_Details_ID : this.objWorkOrder.Work_Details_ID ? this.objWorkOrder.Work_Details_ID : 0,
        SL_NO : this.WorkOrderAdd.length + 1,
        Work_Details : workFilter.length? workFilter[0].Work_Details : "",
        Qty : this.objWorkOrder.Qty,
        UOM : this.objWorkOrder.UOM,
        Rate : this.objWorkOrder.Rate,
        Amount : Number(Number(this.Amount).toFixed(2)),
        Fin_Year_ID : this.objWorkOrder.FinYearid
      })
      console.log('this.WorkOrderAdd=',this.WorkOrderAdd);
      this.objWorkOrder = new WorkOrder();
      this.WorkFormSubmit = false;
      this.Retrivedata();

    }


  }
  Retrivedata(){
    if(this.WorkOrderAdd.length){
      this.objWorkOrder.Project_ID = this.WorkOrderAdd.length? this.WorkOrderAdd[0].Project_ID : 0;
      
    }
    else{
      this.objWorkOrder.Project_ID = undefined;
      
    }
  }

  WorkOrderSave(){
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
    console.log(this.DocNo);
    this.WorkOrderAdd.forEach(el=>{
      this.SaveData.push({
        Project_ID : el.Project_ID,
        Work_Details_ID : el.Work_Details_ID,
        Qty : el.Qty,
        UOM : el.UOM,
        Rate : el.Rate,
        Amount : el.Amount,
        Doc_No : el.Doc_No,
        Doc_Date : el.Doc_Date?this.DateService.dateConvert(el.Doc_Date): null,
        User_ID : el.User_ID,
        Fin_Year_ID : el.Fin_Year_ID
      })
    });
    console.log(this.SaveData);
    const obj = {
      "SP_String": "SP_Work_Order_Sale_Bill",
      "Report_Name_String":"Work_Order_Sale_Bill_Create_Update",
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
       this.WorkOrderAdd = [];
       this.SaveData = [];
      
      this.Spinner = false;
      this.tabIndexToView = 0;
       this.items = ["BROWSE", "CREATE"];
       this.ShowSearchData();
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

  

  EditJournal(Col){
    if(Col.Project_ID){
    this.DocNo = Col.Doc_No;
    this.tabIndexToView = 1;
    this.items = ["BROWSE", "UPDATE"];
    this.buttonname = "Update";
    this.getWorkOrder(Col.Project_ID);
    }

  }

  getWorkOrder(Project_ID){
    if(Project_ID){
    const obj = {
      "SP_String": "SP_Work_Order_Sale_Bill",
      "Report_Name_String":"Work_Order_Sale_Bill_Get_Details",
      "Json_Param_String": JSON.stringify([{ Project_ID: Project_ID}]) 
      }
      this.GlobalAPI.getData(obj).subscribe((data:any)=>{
        console.log('Data=',data);
        this.WorkOrderAdd = data;
        //this.SaveData = data;
       
        
        this.objWorkOrder.Project_ID = data[0].Project_ID;
        
         
         this.DocNo = data[0].Doc_No;
        this.getWorkDetails();
        
        
       

      });
      
    }
  }

  DeleteWorkOrder(index){
    this.WorkOrderAdd.splice(index,1);
      
      this.WorkOrderAdd.forEach((el:any, ind) => {
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

  ShowSearchData(){
    this.objsearch.Start_Date = this.objsearch.Start_Date
    ? this.DateService.dateConvert(new Date(this.objsearch.Start_Date))
    : this.DateService.dateConvert(new Date());
    this.objsearch.End_Date = this.objsearch.End_Date
    ? this.DateService.dateConvert(new Date(this.objsearch.End_Date))
    : this.DateService.dateConvert(new Date());
    let TempData = {
      
      //Cost_Cen_ID: Number(this.objsearch.Cost_Cen_ID),
      Start_Date: this.objsearch.Start_Date,
      End_Date: this.objsearch.End_Date
     
    }
    const obj = {
      "SP_String": "SP_Work_Order_Sale_Bill",
      "Report_Name_String": "Work_Order_Sale_Bill_Browse",
      "Json_Param_String" : JSON.stringify([TempData])
    }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
     console.log("all Data",data);
     this.AllWorkOrderData = data;
      
     })

  }

  
 
  onConfirm2(){

  }
  clearData(){
    this.objWorkOrder = new WorkOrder();
    this.Doc_Date = new Date();
    this.SaveData = [];
    this.buttonname="Create";
    this.DocNo = undefined;
    this.WorkFormSubmit = false;
    this.WorkDetailsList = [];
  }

}

class WorkOrder{
  Project_ID : any;
  Work_Details_ID : any;
  Qty : any;
  UOM : any;
  Rate : any;
  User_ID : any;
  Doc_Date : any;
  FinYearid : any;
}

class Search{
  Start_Date : any;
  End_Date : any;
}
