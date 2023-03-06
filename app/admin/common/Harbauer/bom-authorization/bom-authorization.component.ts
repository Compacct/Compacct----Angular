import { MessageService } from 'primeng/api';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CompacctCommonApi } from '../../../shared/compacct.services/common.api.service';
import { CompacctGlobalApiService } from '../../../shared/compacct.services/compacct.global.api.service';
import { CompacctHeader } from '../../../shared/compacct.services/common.header.service';
import { DateTimeConvertService } from '../../../shared/compacct.global/dateTime.service';

@Component({
  selector: 'app-bom-authorization',
  templateUrl: './bom-authorization.component.html',
  styleUrls: ['./bom-authorization.component.css'],
  providers: [MessageService],
  encapsulation: ViewEncapsulation.None
})
export class BOMAuthorizationComponent implements OnInit {
  items :any =[];
  tabIndexToView = 0;
  AuthorizedForm :boolean = false;
  NoTAuthorizedForm :boolean =false;
  OBjAuthorized :Authorized = new Authorized();
  OBjNOTAuthorized :NOTAuthorized = new NOTAuthorized();
  initDate :any =[];
  initDate2 :any =[];
  DynamicHeaderPanding:any = [];
  DynamicHeaderAuthorized:any = [];
  DynamicHeaderNOTAuthorized:any = [];
  AuthorizedCostList :any =[];
  notAuthorizedCostList :any =[];
  SearchedlistPanding :any =[];
  ApprovedSearchedlist :any =[];
  NotApprovedSearchedlist :any =[];
  masterApproveId =undefined;
  Approved :boolean = false;
  DisApproved :boolean = false;
  MasterdisApproveId = undefined;
  ViewProTypeModal: boolean = false;
  ViewPopList:any =[];
  AmountTotal : number =0;
  tempArr : any ={};
  constructor(
    private $http: HttpClient,
    private commonApi: CompacctCommonApi,
    private GlobalAPI: CompacctGlobalApiService,
    private Header: CompacctHeader,
    private DateService: DateTimeConvertService,
    public $CompacctAPI: CompacctCommonApi,
    private compacctToast: MessageService,
  ){}

ngOnInit() {
    this.items = ["Pending Authorization", "Authorized BOM","Not Authorized BOM"];
    this.Header.pushHeader({
      Header: "BOM Authorization",
      Link: "Harbauer -> BOM Authorization"
    });
    this.getListPandingAuth();
    this.Finyear();
    //this.getCostCenter();
    //this.getCostCenterNotAuth();
}
TabClick(e){
    this.tabIndexToView = e.index;
    this.items = ["Pending Authorization", "Authorized BOM","Not Authorized BOM"]; 
    this.getListPandingAuth();
    this.AuthorizationListButton(); 
    this.NotAuthorizationListButton();

}

//Dynamic Header filtter
GetSlicedArr () {
  let TempArr:any = [];
  this.DynamicHeaderPanding.forEach((item:any)=>{
    if(item ==="Tender_Organization" || item === "Site_Description"|| item ==="Work_Name"){
      TempArr.push(item)
    }
  })
  //console.log(TempArr)
  return TempArr ;
}
//Dynamic Header filtter approve
GetSlicedApr () {
  let TempArrAprv:any = [];
  this.DynamicHeaderAuthorized.forEach((item:any)=>{
    if(item ==="Tender_Organization" || item === "Site_Description"|| item ==="Work_Name"){
      TempArrAprv.push(item)
    }
  })
  //console.log(TempArr)
  return TempArrAprv ;
}
//Dynamic Header filtter Not approve
GetSlicedNapr () {
  let TempArrNApr:any = [];
  this.DynamicHeaderNOTAuthorized.forEach((item:any)=>{
    if(item ==="Tender_Organization" || item === "Site_Description"|| item ==="Work_Name"){
      TempArrNApr.push(item)
    }
  })
  //console.log(TempArr)
  return TempArrNApr ;
}
// Panding Authorization List 
getListPandingAuth(){
  const tempobj = {
    User_ID: this.$CompacctAPI.CompacctCookies.User_ID,
    Browse_Type : "PENDING APPROVAL",
  }
  const obj = {
  "SP_String": "SP_BOM_Approve",
  "Report_Name_String": "Approve_Browse",
  "Json_Param_String": JSON.stringify([tempobj])
  }
  this.GlobalAPI.getData(obj).subscribe((data:any)=>{
   this.SearchedlistPanding = data;
   if (this.SearchedlistPanding.length){
    this.DynamicHeaderPanding = Object.keys(data[0]);
    this.tempArr = this.SearchedlistPanding[0]
   }
  else {
    this.DynamicHeaderPanding = [];
  }
   //this.SearchedlistPanding = data;
  // console.log('DynamicHeaderPanding=====',this.DynamicHeaderPanding)
   //console.log('SearchedlistPanding=====',this.SearchedlistPanding)
  })
}
// Authorized BOM Serch Button fn
AuthorizationListButton(){
  this.ApprovedSearchedlist = [];
  const tempobj = {
    User_ID : this.$CompacctAPI.CompacctCookies.User_ID,
    Browse_Type : "APPROVED",
  }
  const obj = {
  "SP_String": "SP_BOM_Approve",
  "Report_Name_String": "Approve_Browse",
  "Json_Param_String": JSON.stringify([tempobj])
  }
  this.GlobalAPI.getData(obj).subscribe((data:any)=>{
   this.ApprovedSearchedlist = data;
   //console.log('ApprovedSearchedlist=====',this.ApprovedSearchedlist)
  //  this.DynamicHeaderAuthorized = Object.keys(data[0]) ? Object.keys(data[0]) :undefined;
   if (this.ApprovedSearchedlist.length){
    this.DynamicHeaderAuthorized = Object.keys(data[0]);
   }
  else {
    this.DynamicHeaderAuthorized = [];
  }
  //  this.ApprovedSearchedlist = data;
  
  })
}
// NOt Authorized BOM Serch Button fn
NotAuthorizationListButton(){
  this.NotApprovedSearchedlist = [];
 
  const tempobj = {
    User_ID : this.$CompacctAPI.CompacctCookies.User_ID,
    Browse_Type : "DISAPPROVED"
  }
  const obj = {
  "SP_String": "SP_BOM_Approve",
  "Report_Name_String": "Approve_Browse",
  "Json_Param_String": JSON.stringify([tempobj])
  }
  this.GlobalAPI.getData(obj).subscribe((data:any)=>{
   this.NotApprovedSearchedlist = data;
   //console.log('NotApprovedSearchedlist=====',this.NotApprovedSearchedlist)
  //  this.DynamicHeaderNOTAuthorized = Object.keys(data[0]) ? Object.keys(data[0]) :undefined;
   //this.NotApprovedSearchedlist = data;
   if (this.NotApprovedSearchedlist.length){
    this.DynamicHeaderNOTAuthorized = Object.keys(data[0]);
   }
   else {
    this.DynamicHeaderNOTAuthorized = [];
   }
   
  })
}
getDateRange(dateRangeObj:any){
  if(dateRangeObj.length){
    this.OBjAuthorized.From_Date = dateRangeObj[0];
    this.OBjAuthorized.To_Date = dateRangeObj[1];
  }
 else if(dateRangeObj.length){
    this.OBjNOTAuthorized.From_Date = dateRangeObj[0];
    this.OBjNOTAuthorized.To_Date = dateRangeObj[1];
  }
}
Finyear(){
  this.$http
    .get("Common/Get_Fin_Year_Date?Fin_Year_ID=" + this.$CompacctAPI.CompacctCookies.Fin_Year_ID)
    .subscribe((res: any) => {
    let data = JSON.parse(res)
  //  this.MBDatemaxDate = new Date(data[0].Fin_Year_End);
  //  this.MBDateminDate = new Date(data[0].Fin_Year_Start);
  //  this.Projecteddata = new Date().getMonth() > new Date(data[0].Fin_Year_End).getMonth() ? new Date() : new Date(data[0].Fin_Year_End);
   this.initDate =  [new Date(data[0].Fin_Year_Start) , new Date(data[0].Fin_Year_End)]
   this.initDate2 =  [new Date(data[0].Fin_Year_Start) , new Date(data[0].Fin_Year_End)]
    });
}
onReject() {
  this.compacctToast.clear('c');
}
// Pop For Approved BOM
ApprovedBOM(){
  this.Approved = false
  this.DisApproved = true
  if(this.tempArr.Site_ID){
    this.Approved = true
    this.DisApproved = false
    this.masterApproveId =undefined;
    this.masterApproveId = this.tempArr.Site_ID;
    this.compacctToast.clear();
    this.compacctToast.add({
      key: "c",
      sticky: true,
      severity: "warn",
      summary: "Are you sure To Approved This BOM",
      detail: "Confirm to proceed"
    });
}
}
  // Pop For Approved BOM Button
 onConfirm(){ 
  if(this.masterApproveId){
    const tempobj = {
      Site_ID : this.masterApproveId,
      User_ID :this.$CompacctAPI.CompacctCookies.User_ID,
      Status : "APPROVE",
      Project_ID :this.tempArr.Project_ID,
    }
    const obj = {
      "SP_String": "SP_BOM_Approve",
      "Report_Name_String": "Update_BOM_Status",
      "Json_Param_String": JSON.stringify([tempobj])
    }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      // console.log("del Data===", data[0].Column1)
      if (data[0].Column1){
        this.onReject();
        this.getListPandingAuth();
        this.Approved = false;
        this.DisApproved = true;
        this.compacctToast.clear();
        this.compacctToast.add({
          key: "compacct-toast",
          severity: "success",
          summary: " BOM No " + this.masterApproveId ,
          detail: "Succesfully Approved "
        });
        this.masterApproveId = undefined ;
        this.ViewProTypeModal = false;
       }
    })
  }
}
 // Pop For DisApproved BOM
 DisapprovedBOM(){
  this.Approved = true;
  this.DisApproved = false;
  if(this.tempArr.Site_ID){
    this.Approved = false;
    this.DisApproved = true;
    this.MasterdisApproveId =undefined;
    this.MasterdisApproveId = this.tempArr.Site_ID ;
    this.compacctToast.clear();
    this.compacctToast.add({
      key: "c",
      sticky: true,
      severity: "warn",
      summary: "Are you sure To Dis-Approved This BOM",
      detail: "Confirm to proceed"
    });
}
}
  // Pop For DisApproved BOM Button
onConfirm2(){ 
  if(this.MasterdisApproveId){
    const tempobj = {
     Site_ID : this.MasterdisApproveId,
     User_ID :this.$CompacctAPI.CompacctCookies.User_ID,
     Status : "DISAPPROVE",
     Project_ID :this.tempArr.Project_ID,
    }
    const obj = {
      "SP_String": "SP_BOM_Approve",
      "Report_Name_String": "Update_BOM_Status",
      "Json_Param_String": JSON.stringify([tempobj])
    }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
       //console.log("del Data===", data[0].Column1)
      if (data[0].Column1){
        this.onReject();
        this.getListPandingAuth();
        this.Approved = false;
        this.DisApproved = true;
        this.compacctToast.clear();
        this.compacctToast.add({
          key: "compacct-toast",
          severity: "success",
          summary: " BOM No " + this.MasterdisApproveId ,
          detail: "Succesfully DisApproved"
        });
         this.MasterdisApproveId = undefined ;
         this.ViewProTypeModal = false;
       }
    })
  }
}
//View Pop Panding 
showApproved(col:any){
   this.ViewPopList = [];
   if(col.Site_ID && col.Tender_Doc_ID){
     const tempobj = {
       Tender_Doc_ID :col.Tender_Doc_ID,
        Site_ID : col.Site_ID
     }
    const obj = {
      "SP_String": "SP_BL_CRM_Txn_Enq_Tender_Harbauer_Bill_Planning",
      "Report_Name_String": "Project_Planning_Retrieve",
       "Json_Param_String": JSON.stringify([tempobj])
    }
     this.GlobalAPI.getData(obj).subscribe((data:any)=>{
     this.ViewPopList = data;
    
    //console.log("ViewPopList",this.ViewPopList)
    
       })
     setTimeout(() => {
      this.ViewProTypeModal = true;
     }, 300);
  }
}
//total Amount Culct
GetTotalAmount(){
  let flg:Number = 0
  this.ViewPopList.forEach((ele:any) => {
    (flg) = Number(ele.Amount) + Number(flg)
  });
  this.AmountTotal = Number(Number(flg).toFixed())
  return this.AmountTotal
}
//Panding Auth Print
// Print(DocNo:any) {
//   //console.log("DocNo",DocNo)
//   if(DocNo) {
//   const objtemp = {
//     "SP_String": "Sp_Purchase_Order",
//     "Report_Name_String": "Purchase_Order_Print"
//     }
//   this.GlobalAPI.getData(objtemp).subscribe((data:any)=>{
//     var printlink = data[0].Column1;
//     window.open(printlink+"?Doc_No=" + DocNo.Doc_No, 'mywindow', 'fullscreen=yes, scrollbars=auto,width=950,height=500');
//     // console.log("doc===",DocNo.Doc_No)
//   })
//   }
// }
//Auth Print
// PrintAuthorized(DocAuth:any) {
//     if(DocAuth) {
//     const objtemp = {
//       "SP_String": "Sp_Purchase_Order",
//       "Report_Name_String": "Purchase_Order_Print"
//       }
//     this.GlobalAPI.getData(objtemp).subscribe((data:any)=>{
//       var printlink = data[0].Column1;
//       window.open(printlink+"?Doc_No=" + DocAuth.Doc_No, 'mywindow', 'fullscreen=yes, scrollbars=auto,width=950,height=500');
//       //console.log("DocAuth===",DocAuth.Doc_No)
//     })
// }
// }
//Not Auth Print
// PrintNotAuthorized(DocNot:any) {
//       if(DocNot) {
//       const objtemp = {
//         "SP_String": "Sp_Purchase_Order",
//         "Report_Name_String": "Purchase_Order_Print"
//         }
//       this.GlobalAPI.getData(objtemp).subscribe((data:any)=>{
//         var printlink = data[0].Column1;
//         window.open(printlink+"?Doc_No=" + DocNot.Doc_No, 'mywindow', 'fullscreen=yes, scrollbars=auto,width=950,height=500');
//         // console.log("DocNot===",DocNot.Doc_No)
//       })
//     }
// }

// // Authorized Cost Center
// getCostCenter(){
//   this.AuthorizedCostList =[];
//   const obj = {
//     "SP_String": "SP_MICL_Dispatch_Challan_Chargeable",
//     "Report_Name_String": "Get_Cost_Center",
//   }
//   this.GlobalAPI.getData(obj).subscribe((data:any)=>{
//    // console.log("AuthorizedCostList======",data);
//      if(data.length) {
//        data.forEach(element => {
//          element['label'] = element.Cost_Cen_Name,
//          element['value'] = element.Cost_Cen_ID								
//        });
//        this.AuthorizedCostList = data;   
//        this.OBjAuthorized.Cost_Cen_ID = this.$CompacctAPI.CompacctCookies.Cost_Cen_ID ? this.$CompacctAPI.CompacctCookies.Cost_Cen_ID :undefined;     
//       } 
//    });
// }
// // NotAuthorized Cost Center
// getCostCenterNotAuth(){
//   this.notAuthorizedCostList =[];
//   const obj = {
//     "SP_String": "SP_MICL_Dispatch_Challan_Chargeable",
//     "Report_Name_String": "Get_Cost_Center",
//   }
//   this.GlobalAPI.getData(obj).subscribe((data:any)=>{
//     //console.log("notAuthorizedCostList======",data);
//      if(data.length) {
//        data.forEach(element => {
//          element['label'] = element.Cost_Cen_Name,
//          element['value'] = element.Cost_Cen_ID								
//        });
//        this.notAuthorizedCostList = data; 
//        this.OBjNOTAuthorized.Cost_Cen_ID = this.$CompacctAPI.CompacctCookies.Cost_Cen_ID ? this.$CompacctAPI.CompacctCookies.Cost_Cen_ID :undefined;       
//       } 
//    });
// }
}
class Authorized{
 // Cost_Cen_ID :any;
  From_Date :any;
  To_Date  : any;
}
class NOTAuthorized{
 // Cost_Cen_ID :any; 
  From_Date :any;
  To_Date : any;
}
