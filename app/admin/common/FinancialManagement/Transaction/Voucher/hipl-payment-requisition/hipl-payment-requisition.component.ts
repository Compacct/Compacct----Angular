import { Component, OnInit, ViewEncapsulation, ViewChild } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { MessageService } from "primeng/api";
import { FileUpload } from "primeng/primeng";
import { data } from "jquery";
import { Console } from "console";
import { CompacctCommonApi } from "../../../../../shared/compacct.services/common.api.service";
import { CompacctHeader } from "../../../../../shared/compacct.services/common.header.service";
import { CompacctGlobalApiService } from "../../../../../shared/compacct.services/compacct.global.api.service";

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
  objPayment : Payment = new Payment();
  Spinner : any = false;
  buttonname : any = "Create";
  ProjectList : any = [];
  SiteList : any = [];
  AllVendorList : any = [];
  VendorList : any = [];

  constructor(
    private $http : HttpClient,
    private commonApi : CompacctCommonApi,
    private Header : CompacctHeader,
    private GlobalAPI : CompacctGlobalApiService, 
    private compacctToast : MessageService
  ) { }

  ngOnInit() {
    this.items = ["CREATE", "PENDING APPROVAL", "APPROVED"];
    this.GetAllProject();
    //this.GetAllSite();
    this.getAllVendor();
  }

  TabClick(e) {
    this.tabIndexToView = e.index;
    this.items = ["CREATE", "PENDING APPROVAL", "APPROVED"];
    
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
          console.log("AllSiteList=",this.SiteList);
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
          label: el.Ledger_Name,
          value: el.Ledger_ID
        });
      });
      
  
    })
   }

  SavePaymentMaster(valid){

  }

  onConfirm(){

  }

  onConfirm2(){

  }

  clearData(){

  }

}

class Payment{
  Project_ID : any;
  Site_ID : any;

}
