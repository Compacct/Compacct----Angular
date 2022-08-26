import { Component, OnInit, ViewEncapsulation, ViewChild } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { MessageService } from "primeng/api";
import { FileUpload } from "primeng/primeng";
import { data } from "jquery";
import { Console } from "console";
import { CompacctCommonApi } from "../../../../../shared/compacct.services/common.api.service";
import { CompacctHeader } from "../../../../../shared/compacct.services/common.header.service";
import { CompacctGlobalApiService } from "../../../../../shared/compacct.services/compacct.global.api.service";
import { ActivatedRoute } from "@angular/router";
import { DateTimeConvertService } from "../../../../../shared/compacct.global/dateTime.service";
import { takeUntil } from "rxjs/operators";

@Component({
  selector: 'app-hipl-payment-requisition',
  templateUrl: './hipl-payment-requisition.component.html',
  styleUrls: ['./hipl-payment-requisition.component.css'],
  providers:[MessageService],
  encapsulation: ViewEncapsulation.None
})
export class HIPLPaymentRequisitionComponent implements OnInit {

  tabIndexToView : any = 0;
  items : any = [];
  can_popup : any = false;
  act_popup : any = false;
  PaymentFormSubmit : any = false;
  RequiredAmountValid:boolean = false
  objPayment : Payment = new Payment();
  Spinner : any = false;
  buttonname : any = "Create";
  ProjectList : any = [];
  SiteList : any = [];
  AllVendorList : any = [];
  VendorList : any = [];
  AllTenderList : any = [];
  Purchaseckeck = false;
  progmgURL = ""
  checkreq = false
  flag = false;
  Amountdetails : any = [];
  AllPurchaseList : any = [];
  PurchaseList : any = []; 
  selectedPurchase : any = [];
  seachSpinner : boolean = false;
  objPending : Pending = new Pending();
  Searchedlist : any = [];
  Searchedlist2 : any = [];
  Searchedlist3 : any = [];
  initDate : any = [];
  objApprove : Approved = new Approved();
  objDisapprove : Disapproved = new Disapproved();
  ViewProTypeModal : boolean = false;
  ViewListObj : any = {};
  ApproveListobj : any = {};
  ViewProTypeModal2 : boolean = false;
  ViewProTypeModal3 : boolean = false;
  ViewProTypeModal4 : boolean = false;
  GridList : any = [];
  PaymentRequisitionObj:any = {};
  PaymentRequisitionActionPOPUP:boolean = false;
  RequiredAmount:any = undefined;
  RequiredAmountSubmitted:boolean = false;
  PrePaymentList : any = [];
  popupTitle : String = "";
  Save : boolean = false;
  Approvecon : boolean = false;
  Reasonsubmitted = false;
  Reason : String = "";
  EmployeeList : any = [];
  //Payment_Requisition_ID : any

  constructor(
    private $http : HttpClient,
    private commonApi : CompacctCommonApi,
    private Header : CompacctHeader,
    private GlobalAPI : CompacctGlobalApiService,
    private route: ActivatedRoute,
    private compacctToast : MessageService,
    private DateService : DateTimeConvertService
  ) { 
    this.route.queryParams.subscribe(params => {
      this.progmgURL = params['progmg'];
      console.log("params",this.progmgURL)
    })
  }

  ngOnInit() {
    this.items = ["CREATE", "PENDING APPROVAL", "APPROVED", "DISAPPROVED"];
    this.Header.pushHeader({
      Header: "Payment Requisition",
      Link: ""
    });
    this.GetAllProject();
    //this.GetAllSite();
    this.getAllVendor();
    this.GetEmployee();
   
  }

  TabClick(e) {
    this.tabIndexToView = e.index;
    this.items = ["CREATE", "PENDING APPROVAL", "APPROVED", "DISAPPROVED"];
    this.clearData();
  }

  onReject() {
    this.compacctToast.clear("c");
  }
  GetAllProject(){
    const obj = {
      "SP_String": "SP_BL_CRM_TXN_Project_Doc",
      "Report_Name_String":"Get_Project",
     }
     this.GlobalAPI.getData(obj)
      .subscribe((data: any) => {
        this.ProjectList = data;
       // this.getAmount();
        console.log("AllProductList=",this.ProjectList);
      });
   }

   GetAllSite(Project_ID){
    if(Project_ID){
    const projectFilter = this.ProjectList.filter((el:any) => Number(el.Project_ID) === Number(this.objPayment.Project_ID))[0]
      
      const obj = {
        "SP_String": "SP_Tender_Management_All",
        "Report_Name_String":"Get_Site_For_Project_Planning",
        "Json_Param_String": JSON.stringify([{Project_ID: Project_ID,Tender_Doc_ID:projectFilter.Tender_Doc_ID}])
       }
       this.GlobalAPI.getData(obj)
        .subscribe((data: any) => {
          this.SiteList = data;
          this.getAllTender();
          this.getAmount();
         // this.getPuschaseOrder();
          console.log("AllSiteList=",this.SiteList);
        });
    }
   
   }

   getAllTender(){
    if(this.objPayment.Site_ID && this.objPayment.Project_ID){

      const obj = {
        "SP_String": "SP_BL_CRM_TXN_Project_Doc",
        "Report_Name_String":"Get_Budget_Group",
        "Json_Param_String": JSON.stringify([{Site_ID:Number(this.objPayment.Site_ID),Project_ID:Number(this.objPayment.Project_ID)}])
       }
       this.GlobalAPI.getData(obj)
        .subscribe((data: any) => {
          this.AllTenderList = data;
          this.getAmount();
          //this.getPuschaseOrder();
          console.log("AllTenderList=",this.AllTenderList);
        });
    }


   }

   getAllVendor(){
    this.AllVendorList=[]; 
  this.VendorList = [];
 
    const obj = {
      "SP_String": "sp_Comm_Controller",
      "Report_Name_String":"Get_Sub_Ledger_Dropdown",
     }
     this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      this.AllVendorList = data;
     console.log("this.AllVendorList",this.AllVendorList);
      this.AllVendorList.forEach((el:any) => {
        this.VendorList.push({
          label: el.Sub_Ledger_Name,
          value: el.Sub_Ledger_ID
        });
      });
      
  
    })
   }

   getAmount(){
    if(this.objPayment.Project_ID && this.objPayment.Site_ID && this.objPayment.Budget_Group_ID){
      const obj = {
        "SP_String": "SP_Payment_Requisition",
        "Report_Name_String":"Get_Pending_Amounts",
        "Json_Param_String": JSON.stringify([{SITE_ID:Number(this.objPayment.Site_ID), PROJECT_ID:Number(this.objPayment.Project_ID), Budget_Group_ID :Number(this.objPayment.Budget_Group_ID)}])
       }
       this.GlobalAPI.getData(obj)
        .subscribe((data: any) => {
          //this.Amountdetails = data;
          this.objPayment.Pending_Amount = Number(data[0].Pending_Amount);
          this.objPayment.Total_BOM_Amount = Number(data[0].Total_BOM_Amount);
          this.objPayment.Total_Used_Amount = Number(data[0].Total_Used_Amount);
          this.AmountCheck()
          console.log("Amountdetails=",this.Amountdetails);
          this.getPuschaseOrder();
          
        });
        

    }
   }

   getPuschaseOrder(){
    if((this.objPayment.Sub_Ledger_ID && this.progmgURL === 'n') || (this.objPayment.Project_ID && this.objPayment.Site_ID && this.objPayment.Budget_Group_ID && this.objPayment.Sub_Ledger_ID && this.progmgURL === 'y')){
      this.AllPurchaseList = [];
      this.PurchaseList = [];
      this.selectedPurchase = [];
      let tempObj ={SITE_ID:this.objPayment.Site_ID ? Number(this.objPayment.Site_ID) : 0, 
                    PROJECT_ID: this.objPayment.Project_ID? Number(this.objPayment.Project_ID) : 0,
                     Budget_Group_ID : this.objPayment.Budget_Group_ID ? Number(this.objPayment.Budget_Group_ID) : 0,
                     Sub_Ledger_ID: Number(this.objPayment.Sub_Ledger_ID)}
      const obj = {
        "SP_String": "SP_Payment_Requisition",
        "Report_Name_String":"Get_Purchase_Order_For_Payment_Requisition",
        "Json_Param_String": JSON.stringify([tempObj])
       }
       this.GlobalAPI.getData(obj).subscribe((data:any)=>{
        this.AllPurchaseList = data;
       console.log("this.AllPurchaseList",this.AllPurchaseList);
        this.AllPurchaseList.forEach((el:any) => {
          this.PurchaseList.push({
            label: el.DOC_NO,
            value: el.DOC_NO
          });
        });
        
    
      })
   
    
  }
  this.getList();
    }

    GetEmployee(){
      const obj = {
        "SP_String": "SP_Payment_Requisition",
        "Report_Name_String":"Get_Employee_Advance",
       }
       this.GlobalAPI.getData(obj)
        .subscribe((data: any) => {
          this.EmployeeList = data;
         // this.getAmount();
          console.log("AllEmployeeList=",this.EmployeeList);
        });
     }
  

  getList(){
    if((this.objPayment.Sub_Ledger_ID && this.progmgURL === 'n') || (this.objPayment.Project_ID && this.objPayment.Site_ID && this.objPayment.Budget_Group_ID && this.objPayment.Sub_Ledger_ID && this.progmgURL === 'y')){
      let tempObj ={SITE_ID:this.objPayment.Site_ID ? Number(this.objPayment.Site_ID) : 0, 
        PROJECT_ID: this.objPayment.Project_ID? Number(this.objPayment.Project_ID) : 0,
        Budget_Group_ID : this.objPayment.Budget_Group_ID ? Number(this.objPayment.Budget_Group_ID) : 0,
        Sub_Ledger_ID: Number(this.objPayment.Sub_Ledger_ID)}

        const obj = {
          "SP_String": "SP_Payment_Requisition",
          "Report_Name_String":"Get_PO_Grid",
          "Json_Param_String": JSON.stringify([tempObj])
        }
        this.GlobalAPI.getData(obj)
        .subscribe((data: any) => {
          this.GridList = data;
          // this.getAmount();
          console.log("GridList=",this.GridList);
        });
    }

  }
  
  ReqCheck(){
    if(Number(this.objPayment.Pending_Amount) < Number(this.objPayment.Required_Amount) && Number(this.PaymentRequisitionObj.Current_Due) < Number(this.objPayment.Required_Amount)){
      this.RequiredAmountSubmitted = true
    }
    else {
      this.RequiredAmountSubmitted = false
    }
  }
  saveReqPopUP(ReqValue:any){
   if(ReqValue){
    this.RequiredAmountSubmitted = false
     this.objPayment.Required_Amount = Number(ReqValue)
     if(Number(this.objPayment.Pending_Amount) >= Number(this.objPayment.Required_Amount) && Number(this.PaymentRequisitionObj.Current_Due) >= Number(this.objPayment.Required_Amount)){
      this.RequiredAmountSubmitted = false
      this.SavePaymentMaster(true)
     }
     else {
      this.RequiredAmountSubmitted = true
     }

   }
   else {
    this.RequiredAmountSubmitted = true
   }
  }
 
  SavePaymentMaster(valid){
    this.PaymentFormSubmit = true;
    if(valid && !this.RequiredAmountValid )
    {
      
      this.Spinner = true;

      this.Save = true;
      this.Approvecon = false;
      //this.Del = false;
     // this.Spinner = true;
      //this.ngxService.start();
     this.compacctToast.clear();
     this.compacctToast.add({
       key: "c",
       sticky: true,
       closable: false,
       severity: "warn",
       summary: "Are you sure?",
       detail: "Confirm to proceed"
     });
     this.Spinner = false;
     this.PaymentRequisitionActionPOPUP = false;

    //   console.log("Save Data")
    //   let purchasedoc:any = [];
    //   console.log("selectedPurchase=", this.selectedPurchase);
    //   let saveData = {}
    //   this.objPayment.Project_ID = this.objPayment.Project_ID? this.objPayment.Project_ID : 0;
    //   this.objPayment.Site_ID = this.objPayment.Site_ID? this.objPayment.Site_ID : 0;
    //   this.objPayment.Budget_Group_ID = this.objPayment.Budget_Group_ID? this.objPayment.Budget_Group_ID : 0;
    //   this.objPayment.Pending_Amount = this.objPayment.Pending_Amount? this.objPayment.Pending_Amount : 0;
    //   this.objPayment.Total_BOM_Amount = this.objPayment.Total_BOM_Amount? this.objPayment.Total_BOM_Amount : 0;
    //   this.objPayment.Total_Used_Amount = this.objPayment.Total_Used_Amount? this.objPayment.Total_Used_Amount : 0;
    //   this.objPayment.Created_By = this.commonApi.CompacctCookies.User_ID;
    //   this.PaymentRequisitionObj.PO_Value = this.PaymentRequisitionObj.Value;
    //   if(!this.Purchaseckeck){
   
    //     purchasedoc.push({PO_DOC_NO : this.PaymentRequisitionObj.PO_NO})
    //     this.objPayment.L_element = purchasedoc;
    //     saveData = {...this.objPayment,...this.PaymentRequisitionObj}
    //   }
    //   else{
    //     purchasedoc.push({PO_DOC_NO : "Local Purchase"})
    //     this.objPayment.L_element = purchasedoc;
    //     saveData = {...this.objPayment}
        
    //   }
    //  console.log(JSON.stringify(saveData))
    //  if(!this.Purchaseckeck)
    //  {
    //   const obj = {
    //     "SP_String": "SP_Payment_Requisition",
    //     "Report_Name_String":"Payment_Requisition_Create",
    //     "Json_Param_String": JSON.stringify([saveData]) 
    //    }
    //    this.GlobalAPI.getData(obj).subscribe((data : any)=>
    //    {
    //      console.log('data=',data[0].Column1);
    //      //if (data[0].Sub_Ledger_ID)
    //      if(data[0].Column1)
    //      {
    //        //this.SubLedgerID = data[0].Column1
    //       this.compacctToast.clear();
    //       this.compacctToast.add({
    //       key: "compacct-toast",
    //       severity: "success",
    //       summary: "Payment Requisition Create Succesfully ",
    //       detail: "Succesfully Created"
    //     });
    //     this.getList();
    //     this.PaymentRequisitionActionPOPUP = false;
    //     //this.clearData();
        
    //     this.Spinner = false;
    //     }
    //     else{
    //       this.compacctToast.clear();
    //       this.compacctToast.add({
    //       key: "compacct-toast",
    //       severity: "error",
    //       summary: "Error",
    //       detail: "Something Wrong"
    //     });
    //     this.clearData();
    //     this.Spinner = false;
    //     }
    //    });
    //   }
    //   else if(this.Purchaseckeck){
    //     const obj = {
    //       "SP_String": "SP_Payment_Requisition",
    //       "Report_Name_String":"Payment_Requisition_Create",
    //       "Json_Param_String": JSON.stringify([saveData]) 
    //      }
    //      this.GlobalAPI.getData(obj).subscribe((data : any)=>
    //      {
    //        console.log('data=',data[0].Column1);
    //        //if (data[0].Sub_Ledger_ID)
    //        if(data[0].Column1)
    //        {
    //          //this.SubLedgerID = data[0].Column1
    //         this.compacctToast.clear();
    //         this.compacctToast.add({
    //         key: "compacct-toast",
    //         severity: "success",
    //         summary: "Payment Requisition Create Succesfully ",
    //         detail: "Succesfully Created"
    //       });
    //       //this.getList();
    //      // this.PaymentRequisitionActionPOPUP = false;
    //       this.clearData();
          
    //       this.Spinner = false;
    //       }
    //       else{
    //         this.compacctToast.clear();
    //         this.compacctToast.add({
    //         key: "compacct-toast",
    //         severity: "error",
    //         summary: "Error",
    //         detail: "Something Wrong"
    //       });
    //       this.clearData();
    //       this.Spinner = false;
    //       }
    //      });
    //   }

    }
  

  }

  

  AmountCheck(){
    this.flag = false;
    
    if(this.objPayment.Required_Amount && this.progmgURL === 'y')
    {
      if(this.objPayment.Required_Amount <= this.objPayment.Pending_Amount)
      {
        // this.flag = false;
        // return true;
        this.flag = false;
        this.RequiredAmountValid = false
      }
      else{
        this.flag = true;
        this.RequiredAmountValid = true
        this.compacctToast.clear();
        this.compacctToast.add({
          key: "compacct-toast",
          severity: "error",
          summary: "Warn Message",
          detail: "Required amount can't be more than Available Balance"
        });
      }
    }

  }

  onConfirm(){
    console.log("Save Data")
      let purchasedoc:any = [];
      console.log("selectedPurchase=", this.selectedPurchase);
      let saveData = {}
      this.objPayment.Project_ID = this.objPayment.Project_ID? this.objPayment.Project_ID : 0;
      this.objPayment.Site_ID = this.objPayment.Site_ID? this.objPayment.Site_ID : 0;
      this.objPayment.Budget_Group_ID = this.objPayment.Budget_Group_ID? this.objPayment.Budget_Group_ID : 0;
      this.objPayment.Pending_Amount = this.objPayment.Pending_Amount? this.objPayment.Pending_Amount : 0;
      this.objPayment.Total_BOM_Amount = this.objPayment.Total_BOM_Amount? this.objPayment.Total_BOM_Amount : 0;
      this.objPayment.Total_Used_Amount = this.objPayment.Total_Used_Amount? this.objPayment.Total_Used_Amount : 0;
      this.objPayment.Responsible_Emp_ID = this.objPayment.Responsible_Emp_ID ? this.objPayment.Responsible_Emp_ID : 0;
      this.objPayment.Created_By = this.commonApi.CompacctCookies.User_ID;
      this.PaymentRequisitionObj.PO_Value = this.PaymentRequisitionObj.Value;
      if(!this.Purchaseckeck){
   
        purchasedoc.push({PO_DOC_NO : this.PaymentRequisitionObj.PO_NO})
        this.objPayment.L_element = purchasedoc;
        saveData = {...this.objPayment,...this.PaymentRequisitionObj}
      }
      else{
        purchasedoc.push({PO_DOC_NO : "Local Purchase"})
        this.objPayment.L_element = purchasedoc;
        saveData = {...this.objPayment}
        
      }
     console.log(JSON.stringify(saveData))
     if(!this.Purchaseckeck)
     {
      const obj = {
        "SP_String": "SP_Payment_Requisition",
        "Report_Name_String":"Payment_Requisition_Create",
        "Json_Param_String": JSON.stringify([saveData]) 
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
          summary: "Payment Requisition Create Succesfully ",
          detail: "Succesfully Created"
        });
        //this.getList();
        this.PaymentRequisitionActionPOPUP = false;
        this.clearData();
        
        this.Spinner = false;
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
      else if(this.Purchaseckeck){
        const obj = {
          "SP_String": "SP_Payment_Requisition",
          "Report_Name_String":"Payment_Requisition_Create",
          "Json_Param_String": JSON.stringify([saveData]) 
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
            summary: "Payment Requisition Create Succesfully ",
            detail: "Succesfully Created"
          });
          //this.getList();
         // this.PaymentRequisitionActionPOPUP = false;
          this.clearData();
          
          this.Spinner = false;
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


  }

  onConfirm2(){
    this.Spinner = true;
    const tempObj = {
      Payment_Requisition_ID : this.ApproveListobj.Payment_Requisition_ID,
      User_ID : this.commonApi.CompacctCookies.User_ID,
      Status : 'APPROVE'
    }
    const obj = {
      "SP_String": "SP_Payment_Requisition",
      "Report_Name_String": "Update_Requisition_Status",
      "Json_Param_String": JSON.stringify([tempObj])
    }
     this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      console.log('data=',data[0].Column1);
      if(data[0].Column1 == 'Updated Successfully')
         {
           //this.SubLedgerID = data[0].Column1
          this.compacctToast.clear();
          this.compacctToast.add({
          key: "compacct-toast",
          severity: "success",
          summary: "Payment Requisition Approve Succesfully ",
          detail: "Succesfully Approved"
        });
        this.Spinner = false;
        this.ViewProTypeModal2 = false
        this.GetPendingSearchedList("PENDING APPROVAL");
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
      this.ViewProTypeModal2 = false
      }
       
     })
     

  }
  // checkboxChange(){
  //    this.selectedPurchase = []
  // }

  getDateRange(dateRangeObj,type) {
    if (dateRangeObj.length) {
      if(type == 'PENDING APPROVAL'){
        this.objPending.Start_date = dateRangeObj[0];
        this.objPending.End_date = dateRangeObj[1];
      }
      else if(type == 'APPROVED'){
        this.objApprove.Start_date = dateRangeObj[0];
        this.objApprove.End_date = dateRangeObj[1];
      }
      else if(type == 'DISAPPROVED'){
        this.objDisapprove.Start_date = dateRangeObj[0];
        this.objDisapprove.End_date = dateRangeObj[1];
      }
     
    }
  }


  GetPendingSearchedList(type:any){
    this.Searchedlist = [];
    this.seachSpinner = true;
  const start = this.objPending.Start_date
  ? this.DateService.dateConvert(new Date(this.objPending.Start_date))
  : this.DateService.dateConvert(new Date());
  const end = this.objPending.End_date
  ? this.DateService.dateConvert(new Date(this.objPending.End_date))
  : this.DateService.dateConvert(new Date());
  this.objPending.User_ID =  this.commonApi.CompacctCookies.User_ID;
  this.objPending.Browse_Type = type;

const tempobj = {
  Start_date : start,
  End_date : end,
  User_ID : this.objPending.User_ID,
  Browse_Type : this.objPending.Browse_Type
  

}
const obj = {
  "SP_String": "SP_Payment_Requisition",
  "Report_Name_String": "Payment_Requisition_Browse",
  "Json_Param_String": JSON.stringify([tempobj])
}
 this.GlobalAPI.getData(obj).subscribe((data:any)=>{
   this.Searchedlist = data;
  
   
   console.log('Search list=====',this.Searchedlist)
   this.seachSpinner = false;
   
 })


  }
  GetApproveSearchedList(type:any){
    this.Searchedlist2 = [];
    this.seachSpinner = true;
  const start = this.objApprove.Start_date
  ? this.DateService.dateConvert(new Date(this.objApprove.Start_date))
  : this.DateService.dateConvert(new Date());
  const end = this.objApprove.End_date
  ? this.DateService.dateConvert(new Date(this.objApprove.End_date))
  : this.DateService.dateConvert(new Date());
  this.objApprove.User_ID =  this.commonApi.CompacctCookies.User_ID;
  this.objApprove.Browse_Type = type;

const tempobj = {
  Start_date : start,
  End_date : end,
  User_ID : this.objApprove.User_ID,
  Browse_Type : this.objApprove.Browse_Type
  

}
const obj = {
  "SP_String": "SP_Payment_Requisition",
  "Report_Name_String": "Payment_Requisition_Browse",
  "Json_Param_String": JSON.stringify([tempobj])
}
 this.GlobalAPI.getData(obj).subscribe((data:any)=>{
   this.Searchedlist2 = data;
  
   
   console.log('Searchedlist2=====',this.Searchedlist2)
   this.seachSpinner = false;
   
 })



  }
  GetDisapproveSearchedList(type:any){
     this.Searchedlist3 = [];
     this.seachSpinner = true;
     const start = this.objDisapprove.Start_date
     ? this.DateService.dateConvert(new Date(this.objDisapprove.Start_date))
     : this.DateService.dateConvert(new Date());
     const end = this.objDisapprove.End_date
     ? this.DateService.dateConvert(new Date(this.objDisapprove.End_date))
     : this.DateService.dateConvert(new Date());
     this.objDisapprove.User_ID = this.commonApi.CompacctCookies.User_ID;
     this.objDisapprove.Browse_Type = type;
   
   const tempobj = {
     Start_date : start,
     End_date : end,
     User_ID : this.objDisapprove.User_ID,
     Browse_Type : this.objDisapprove.Browse_Type
     
   
   }
   const obj = {
     "SP_String": "SP_Payment_Requisition",
     "Report_Name_String": "Payment_Requisition_Browse",
     "Json_Param_String": JSON.stringify([tempobj])
   }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      this.Searchedlist3 = data;
     
      
      console.log('Searchedlist3=====',this.Searchedlist3)
      this.seachSpinner = false;
      
    })
   
   
  }
  clearData(){
   this.RequiredAmountValid = false;
   this.objPayment = new Payment();
   this.PaymentFormSubmit = false;
   this.selectedPurchase = [];
   this.Purchaseckeck = false;
   this.selectedPurchase = [];
   this.PurchaseList = [];
   this.GridList = [];
   this.Spinner = false;
   this.PaymentRequisitionObj = {}
   this.PaymentRequisitionActionPOPUP = false
   this.popupTitle = "";
  }
  view(col:any){
    const tempobj = {
      Payment_Requisition_ID : col.Payment_Requisition_ID
    }
    const obj = {
      "SP_String": "SP_Payment_Requisition",
      "Report_Name_String": "Get_Payment_Requisition_Details",
      "Json_Param_String": JSON.stringify([tempobj])
    }
     this.GlobalAPI.getData(obj).subscribe((data:any)=>{
       this.ViewListObj = data[0];
       console.log('ViewList=====',this.ViewListObj);
       console.log(this.ViewListObj.PO_Value);
      })

    setTimeout(() => {
      this.ViewProTypeModal = true;
    }, 300);
  
  }
  Approve(col:any){
    const tempobj = {
      Payment_Requisition_ID : col.Payment_Requisition_ID
    }
    const obj = {
      "SP_String": "SP_Payment_Requisition",
      "Report_Name_String": "Get_Payment_Requisition_Details",
      "Json_Param_String": JSON.stringify([tempobj])
    }
     this.GlobalAPI.getData(obj).subscribe((data:any)=>{
       this.ApproveListobj = data[0];
      
       
       console.log('ApproveList=====',this.ApproveListobj)
      
       
     })

    setTimeout(() => {
      this.ViewProTypeModal2 = true;
    }, 200);

  }

  GetApprove(){
    
      
      this.Spinner = true;

      this.Save = false;
      this.Approvecon = true;
      //this.Del = false;
     // this.Spinner = true;
      //this.ngxService.start();
     this.compacctToast.clear();
     this.compacctToast.add({
       key: "c",
       sticky: true,
       closable: false,
       severity: "warn",
       summary: "Are you sure?",
       detail: "Confirm to proceed"
     });
     this.Spinner = false;
     this.ViewProTypeModal2=false;
     //this.PaymentRequisitionActionPOPUP = false;
    }
  

  // GetApprove(){
  //   this.Spinner = true;
  //   const tempObj = {
  //     Payment_Requisition_ID : this.ApproveListobj.Payment_Requisition_ID,
  //     User_ID : this.commonApi.CompacctCookies.User_ID,
  //     Status : 'APPROVE'
  //   }
  //   const obj = {
  //     "SP_String": "SP_Payment_Requisition",
  //     "Report_Name_String": "Update_Requisition_Status",
  //     "Json_Param_String": JSON.stringify([tempObj])
  //   }
  //    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
  //     console.log('data=',data[0].Column1);
  //     if(data[0].Column1 == 'Updated Successfully')
  //        {
  //          //this.SubLedgerID = data[0].Column1
  //         this.compacctToast.clear();
  //         this.compacctToast.add({
  //         key: "compacct-toast",
  //         severity: "success",
  //         summary: "Payment Requisition Approve Succesfully ",
  //         detail: "Succesfully Approved"
  //       });
  //       this.Spinner = false;
  //       this.ViewProTypeModal2 = false
  //       this.GetPendingSearchedList("PENDING APPROVAL");
  //     }
  //     else{
  //       this.compacctToast.clear();
  //       this.compacctToast.add({
  //       key: "compacct-toast",
  //       severity: "error",
  //       summary: "Error",
  //       detail: "Something Wrong"
  //     });
  //     this.Spinner = false;
  //     this.ViewProTypeModal2 = false
  //     }
       
  //    })
     
     

  // }

  DisApprovePopup(){
    this.Reason = "";
    this.Reasonsubmitted = false;
    setTimeout(() => {
      this.ViewProTypeModal4 = true;
    }, 200);

  }

  GetDisApprove(Reasons : any){
    this.Reasonsubmitted = true;
    if(Reasons){
    this.Spinner = true;
    
    console.log(Reasons);
    const tempObj = {
      Payment_Requisition_ID : this.ApproveListobj.Payment_Requisition_ID,
      User_ID : this.commonApi.CompacctCookies.User_ID,
      Status : 'DISAPPROVE',
      Disapprove_Reason : Reasons
    }
    const obj = {
      "SP_String": "SP_Payment_Requisition",
      "Report_Name_String": "Update_Requisition_Status",
      "Json_Param_String": JSON.stringify([tempObj])
    }
     this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      console.log('data=',data[0].Column1);
      if(data[0].Column1 == 'Updated Successfully')
         {
          this.GetPendingSearchedList("PENDING APPROVAL");
           //this.SubLedgerID = data[0].Column1
          this.compacctToast.clear();
          this.compacctToast.add({
          key: "compacct-toast",
          severity: "success",
          summary: "Payment Requisition Disapprove Succesfully ",
          detail: "Succesfully Disapproved"
        });
        this.Spinner = false;
        this.ViewProTypeModal4 = false;
        this.ViewProTypeModal2 = false;
        this.Reasonsubmitted = false;
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
      this.ViewProTypeModal2 = false
      }
       
     })
    }
    
  }

  PrePayment(col, type){
    console.log(type);
    this.popupTitle = '';
    const tempobj = {
      PO_NO : col.PO_NO,
      Subject : type
    }
    const obj = {
      "SP_String": "SP_Payment_Requisition",
      "Report_Name_String": "Get_Sub_Popup_Data",
      "Json_Param_String": JSON.stringify([tempobj])
    }
     this.GlobalAPI.getData(obj).subscribe((data:any)=>{
       this.PrePaymentList = data;
       this.popupTitle = type.replaceAll('_',' ')
       if(this.PrePaymentList.length )
       {
       setTimeout(() => {
        this.ViewProTypeModal3 = true;
      }, 200);
    }
       console.log('PrePaymentList=====',this.PrePaymentList);
      })

  
    
  }
  PaymentRequisitionAction(col:any){
    this.PaymentRequisitionObj = {}
    if(col.PO_NO){
      this.RequiredAmount = undefined;
      this.RequiredAmountSubmitted = false
       this.PaymentRequisitionObj = col
       setTimeout(() => {
        this.PaymentRequisitionActionPOPUP = true
       }, 200);
       console.log("PaymentRequisitionObj",this.PaymentRequisitionObj)
    }
  }

}

class Payment{
  Project_ID : any;
  Site_ID : any;
  Sub_Ledger_ID : any;
  Budget_Group_ID : any;
  Previous_Status : any;
  Present_Status : any;
  Required_Amount	: any;
  Payment_Product_Description : any;
  Pending_Amount : any;
  PO_DOC_NO : any;
  L_element:any;
  Total_BOM_Amount : any;
  Total_Required_Amount : any;
  Total_Used_Amount : any;
  Created_By : any;
  PO_Value : any;
  Responsible_Emp_ID : any
}

class Pending{
  Start_date : any;
  End_date : any;
  User_ID : any;
  Browse_Type : any;

}

class Approved{
  Start_date : any;
  End_date : any;
  User_ID : any;
  Browse_Type : any;

}

class Disapproved{
  Start_date : any;
  End_date : any;
  User_ID : any;
  Browse_Type : any;
}


