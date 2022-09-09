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
   this.DynamicHeaderPanding = this.SearchedlistPanding.length ?  Object.keys(data[0]) : [];
   //this.SearchedlistPanding = data;
   //console.log('Search list=====',this.SearchedlistPanding)
  })
}
// Authorized PO Serch Button fn
AuthorizationSearchButton(valid?){
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
   console.log('ApprovedSearchedlist=====',this.ApprovedSearchedlist)
   this.DynamicHeaderAuthorized = Object.keys(data[0]);
   //this.ApprovedSearchedlist = data;
  
  })
}
// NOt Authorized PO Serch Button fn
NotAuthorizationSearchButton(valid?){
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
   console.log('NotApprovedSearchedlist=====',this.NotApprovedSearchedlist)
   this.DynamicHeaderNOTAuthorized = Object.keys(data[0]);
   //this.NotApprovedSearchedlist = data;
   
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
ApprovedPo(master:any): void{
  this.Approved = false
  this.DisApproved = true
  this.masterApproveId =undefined;
  if(master.Doc_No){
    this.Approved = true
    this.DisApproved = false
    this.masterApproveId = master.Doc_No ;
    this.compacctToast.clear();
    this.compacctToast.add({
      key: "c",
      sticky: true,
      severity: "warn",
      summary: "Are you sure Approved Po",
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
       console.log("del Data===", data[0].Column1)
      if (data[0].Column1){
        this.onReject();
        this.getListPandingAuth();
        this.masterApproveId = undefined ;
        this.Approved = false;
        this.DisApproved = true;
        this.compacctToast.clear();
        this.compacctToast.add({
          key: "compacct-toast",
          severity: "success",
          summary: " PO No " + this.masterApproveId ,
          detail: "Succesfully Approved "
        });
       }
    })
  }
}
 // Pop For DisApproved Po
 DisapprovedPo(masterDisAproved:any): void{
  this.Approved = false
  this.DisApproved = true
  this.masterApproveId =undefined;
  if(masterDisAproved.Doc_No){
    this.Approved = true
    this.DisApproved = false
    this.masterApproveId = masterDisAproved.Doc_No ;
    this.compacctToast.clear();
    this.compacctToast.add({
      key: "c",
      sticky: true,
      severity: "warn",
      summary: "Are you sure DisApproved Po",
      detail: "Confirm to proceed"
    });
}
}
  // Pop For DisApproved Po Button
onConfirm2(){ 
  if(this.masterApproveId){
    const tempobj = {
     Doc_No : this.masterApproveId,
     User_ID :this.$CompacctAPI.CompacctCookies.User_ID,
     Status : "DISAPPROVE"
    }
    const obj = {
      "SP_String": "SP_PO_Authorization",
      "Report_Name_String": "Update_PO_Approve",
      "Json_Param_String": JSON.stringify([tempobj])
    }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
       console.log("del Data===", data[0].Column1)
      if (data[0].Column1){
        this.onReject();
        this.getListPandingAuth();
        this.masterApproveId = undefined ;
        this.Approved = false;
        this.DisApproved = true;
        this.compacctToast.clear();
        this.compacctToast.add({
          key: "compacct-toast",
          severity: "success",
          summary: " PO No " + this.masterApproveId ,
          detail: "Succesfully DisApproved"
        });
       }
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
  Cost_Cen_ID :any;
  From_Date :any;
  To_Date  : any;
}
class NOTAuthorized{
  Cost_Cen_ID :any; 
  From_Date :any;
  To_Date : any;
}
