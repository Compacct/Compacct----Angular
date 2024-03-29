import { MessageService } from 'primeng/api';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CompacctCommonApi } from '../../../shared/compacct.services/common.api.service';
import { CompacctGlobalApiService } from '../../../shared/compacct.services/compacct.global.api.service';
import { CompacctHeader } from '../../../shared/compacct.services/common.header.service';
import { DateTimeConvertService } from '../../../shared/compacct.global/dateTime.service';

@Component({
  selector: 'app-po-authorization',
  templateUrl: './po-authorization.component.html',
  styleUrls: ['./po-authorization.component.css'],
  providers: [MessageService],
  encapsulation: ViewEncapsulation.None
})
export class POAuthorizationComponent implements OnInit {
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
  masterPopview = undefined;
  TElementobj:any = {};
  DetailsArrList:any = [];
  TermsArrList:any = [];
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
    this.items = ["Pending Authorization", "Authorized PO","Not Authorized PO"];
    this.Header.pushHeader({
      Header: "PO Authorization",
      Link: "MICL -> PO Authorization"
    });
    this.getListPandingAuth();
    this.Finyear();
    //this.getCostCenter();
    //this.getCostCenterNotAuth();
}
TabClick(e){
    this.tabIndexToView = e.index;
    this.items = ["Pending Authorization", "Authorized PO","Not Authorized PO"];
    this.clearData();   
}
clearData(){
 this.ApprovedSearchedlist =[];
 this.NotApprovedSearchedlist = [];
 this.DetailsArrList =[];
 this.TermsArrList =[];
 this.TElementobj ={};
}
// Panding Authorization List 
getListPandingAuth(){
  const tempobj = {
    User_ID: this.$CompacctAPI.CompacctCookies.User_ID,
    Company_ID : 1,
  }
  const obj = {
  "SP_String": "SP_PO_Authorization",
  "Report_Name_String": "PO_Browse_Pending",
  "Json_Param_String": JSON.stringify([tempobj])
  }
  this.GlobalAPI.getData(obj).subscribe((data:any)=>{
   this.SearchedlistPanding = data;
  //  this.DynamicHeaderPanding = Object.keys(data[0]) ? Object.keys(data[0]) :undefined;
   if (this.SearchedlistPanding.length){
    this.DynamicHeaderPanding = Object.keys(data[0]);
   }
  else {
    this.DynamicHeaderPanding = [];
  }
   //this.SearchedlistPanding = data;
   //console.log('DynamicHeaderPanding=====',this.DynamicHeaderPanding)
  })
}
// Authorized PO Serch Button fn
AuthorizationSearchButton(){
  this.ApprovedSearchedlist = [];
  const start = this.OBjAuthorized.From_Date
  ? this.DateService.dateConvert(new Date(this.OBjAuthorized.From_Date))
  : this.DateService.dateConvert(new Date());
  const end = this.OBjAuthorized.To_Date
  ? this.DateService.dateConvert(new Date(this.OBjAuthorized.To_Date))
  : this.DateService.dateConvert(new Date());
  const tempobj = {
    Start_Date : start,
    End_Date : end,
    Company_ID : 1,
    User_ID : this.$CompacctAPI.CompacctCookies.User_ID
  }
  const obj = {
  "SP_String": "SP_PO_Authorization",
  "Report_Name_String": "PO_Browse_Approved",
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
// NOt Authorized PO Serch Button fn
NotAuthorizationSearchButton(){
  this.NotApprovedSearchedlist = [];
  const start = this.OBjAuthorized.From_Date
  ? this.DateService.dateConvert(new Date(this.OBjAuthorized.From_Date))
  : this.DateService.dateConvert(new Date());
  const end = this.OBjAuthorized.To_Date
  ? this.DateService.dateConvert(new Date(this.OBjAuthorized.To_Date))
  : this.DateService.dateConvert(new Date());
  const tempobj = {
    Start_Date : start,
    End_Date : end,
    Company_ID : 1,
    User_ID : this.$CompacctAPI.CompacctCookies.User_ID
  }
  const obj = {
  "SP_String": "SP_PO_Authorization",
  "Report_Name_String": "PO_Browse_Disapproved",
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
// Pop For Approved Po
ApprovedPo(master:any){
  //console.log("master==",master)
  this.Approved = false
  this.DisApproved = true
  this.masterApproveId =undefined;
  if(master){
    this.Approved = true
    this.DisApproved = false
    this.masterApproveId = master;
    this.compacctToast.clear();
    this.compacctToast.add({
      key: "c",
      sticky: true,
      severity: "warn",
      summary: "Are you sure To Approved This Po",
      detail: "Confirm to proceed"
    });
}
}
  // Pop For Approved Po Button
 onConfirm(){ 
  if(this.masterApproveId){
    const tempobj = {
     Doc_No : this.masterApproveId,
     User_ID :this.$CompacctAPI.CompacctCookies.User_ID,
     Status : "APPROVE"
    }
    const obj = {
      "SP_String": "SP_PO_Authorization",
      "Report_Name_String": "Update_PO_Approve",
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
          summary: " PO No " + this.masterApproveId ,
          detail: "Succesfully Approved "
        });
        this.masterApproveId = undefined ;
        this.ViewProTypeModal = false;
       }
    })
  }
}
 // Pop For DisApproved Po
 DisapprovedPo(masterDisAproved:any){
  this.Approved = true;
  this.DisApproved = false;
  this.MasterdisApproveId =undefined;
  if(masterDisAproved){
    this.Approved = false;
    this.DisApproved = true;
    this.MasterdisApproveId = masterDisAproved ;
    this.compacctToast.clear();
    this.compacctToast.add({
      key: "c",
      sticky: true,
      severity: "warn",
      summary: "Are you sure To Dis-Approved This Po",
      detail: "Confirm to proceed"
    });
}
}
  // Pop For DisApproved Po Button
onConfirm2(){ 
  if(this.MasterdisApproveId){
    const tempobj = {
     Doc_No : this.MasterdisApproveId,
     User_ID :this.$CompacctAPI.CompacctCookies.User_ID,
     Status : "DISAPPROVE"
    }
    const obj = {
      "SP_String": "SP_PO_Authorization",
      "Report_Name_String": "Update_PO_Approve",
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
          summary: " PO No " + this.MasterdisApproveId ,
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
  this.masterPopview = undefined 
  if(col.Doc_No){
    this.masterPopview = col.Doc_No
    const tempobj = {
      Doc_No  : this.masterPopview
    }
    const obj = {
      "SP_String": "SP_PO_Authorization",
      "Report_Name_String": "PO_approval_view",
      "Json_Param_String": JSON.stringify([tempobj])
    }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
    this.ViewPopList = JSON.parse(data[0].T_element)
    this.TElementobj = this.ViewPopList[0];
    this.masterPopview = undefined;
    this.DetailsArrList = this.ViewPopList[0].pod_Element ? this.ViewPopList[0].pod_Element :undefined;
    this.TermsArrList = this.ViewPopList[0].term_Element ? this.ViewPopList[0].term_Element :undefined;
   // console.log("TElementobj",this.TElementobj)
    //console.log("DetailsArrList",this.DetailsArrList)
   // console.log("TermsArrList",this.TermsArrList)
       //console.log(this.TElementobj.Doc_NO);
      })
    setTimeout(() => {
      this.ViewProTypeModal = true;
    }, 300);
  }
}
//Panding Auth Print
Print(DocNo:any) {
  //console.log("DocNo",DocNo)
  if(DocNo) {
  const objtemp = {
    "SP_String": "Sp_Purchase_Order",
    "Report_Name_String": "Purchase_Order_Print"
    }
  this.GlobalAPI.getData(objtemp).subscribe((data:any)=>{
    var printlink = data[0].Column1;
    window.open(printlink+"?Doc_No=" + DocNo.Doc_No, 'mywindow', 'fullscreen=yes, scrollbars=auto,width=950,height=500');
    // console.log("doc===",DocNo.Doc_No)
  })
  }
}
//Auth Print
PrintAuthorized(DocAuth:any) {
    if(DocAuth) {
    const objtemp = {
      "SP_String": "Sp_Purchase_Order",
      "Report_Name_String": "Purchase_Order_Print"
      }
    this.GlobalAPI.getData(objtemp).subscribe((data:any)=>{
      var printlink = data[0].Column1;
      window.open(printlink+"?Doc_No=" + DocAuth, 'mywindow', 'fullscreen=yes, scrollbars=auto,width=950,height=500');
      //console.log("DocAuth===",DocAuth.Doc_No)
    })
}
}
PrintAuthorizedWO(DocNo:any) {
  if(DocNo) {
    const objtemp = {
      "SP_String": "Sp_Purchase_Order",
      "Report_Name_String": "Work_Order_Print"
      }
    this.GlobalAPI.getData(objtemp).subscribe((data:any)=>{
      var printlink = data[0].Column1;
      window.open(printlink+"?Doc_No=" + DocNo, 'mywindow', 'fullscreen=yes, scrollbars=auto,width=950,height=500');
    })
    }
}
//Not Auth Print
PrintNotAuthorized(DocNot:any) {
      if(DocNot) {
      const objtemp = {
        "SP_String": "Sp_Purchase_Order",
        "Report_Name_String": "Purchase_Order_Print"
        }
      this.GlobalAPI.getData(objtemp).subscribe((data:any)=>{
        var printlink = data[0].Column1;
        window.open(printlink+"?Doc_No=" + DocNot.Doc_No, 'mywindow', 'fullscreen=yes, scrollbars=auto,width=950,height=500');
        // console.log("DocNot===",DocNot.Doc_No)
      })
    }
}

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
