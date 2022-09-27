import { filter } from 'rxjs/operators';
import { MessageService } from 'primeng/api';
import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CompacctCommonApi } from '../../../shared/compacct.services/common.api.service';
import { CompacctGlobalApiService } from '../../../shared/compacct.services/compacct.global.api.service';
import { CompacctHeader } from '../../../shared/compacct.services/common.header.service';
import { DateTimeConvertService } from '../../../shared/compacct.global/dateTime.service';
import { ActivatedRoute } from '@angular/router';
import { CompacctProjectComponent } from '../../../shared/compacct.components/compacct.forms/compacct-project/compacct-project.component';
import { NgxUiLoaderService } from 'ngx-ui-loader';

@Component({
  selector: 'app-po-authorization-harbauer',
  templateUrl: './po-authorization-harbauer.component.html',
  styleUrls: ['./po-authorization-harbauer.component.css'],
  providers: [MessageService],
  encapsulation: ViewEncapsulation.None
})
export class POAuthorizationHarbauerComponent implements OnInit {
  items :any =[];
  tabIndexToView = 0;
  //OBjAuthorized :Authorized = new Authorized();
  //OBjNOTAuthorized :NOTAuthorized = new NOTAuthorized();
  initDate :any =[];
  initDate2 :any =[];
  DynamicHeaderPanding:any = [];
  DynamicHeaderAuthorized:any = [];
  DynamicHeaderNOTAuthorized:any = [];
  SearchedlistPanding :any =[];
  ApprovedSearchedlist :any =[];
  NotApprovedSearchedlist :any =[];
  openProject = "N";
  masterApproveId =undefined;
  MasterdisApproveId =undefined;
  DisapproveReason = undefined;
  backUPSearchedlistPanding:any=[];
  backUPSearchedlistAuthor : any =[];
  backUPSearchedlistNotAutho : any =[];
  DistProject:any = [];
  SelectedDistProject:any = [];
  DistSite:any = [];
  SelectedDistSite:any = [];
  SelectedAuthProject :any =[];
  SelectedAuthSite :any =[];
  AuthProject :any =[];
  AuthSite :any=[];
  SelectedNAuthProject :any =[];
  SelectedNauthSite :any =[];
  NotAuthProject:any =[];
  NotAuthSite:any =[];
  ObjCol:any= {} ;
  ObjColApproved :any ={};
  ObjColNApproved :any ={};
  constructor(
    private $http: HttpClient,
    private GlobalAPI: CompacctGlobalApiService,
    private Header: CompacctHeader,
    private route: ActivatedRoute,
    private DateService: DateTimeConvertService,
    public $CompacctAPI: CompacctCommonApi,
    private compacctToast: MessageService,
    private ngxService: NgxUiLoaderService 
  ) {  this.route.queryParams.subscribe(params => {
    this.openProject = params['proj'];
     // console.log("openProject",this.openProject);
   })}

ngOnInit() {
    this.items = ["Pending Authorization", "Authorized PO","Not Authorized PO"];
    this.Header.pushHeader({
      Header: "PO Authorization",
      Link: "Harbauer -> PO Authorization-harbauer"
    });
    this.getListPandingAuth();
}
TabClick(e){
  this.tabIndexToView = e.index;
  this.items = ["Pending Authorization", "Authorized PO","Not Authorized PO"];
  //this.clearData(); 
  this.getListPandingAuth(); 
  this.AuthorizationSearchButton();
  this.NotAuthorizationSearchButton();
}
onReject(){
  this.compacctToast.clear('c');
  this.compacctToast.clear('d');
}
// Panding Authorization List 
getListPandingAuth(){
  this.ngxService.start();
  const tempobj = {
    User_ID: this.$CompacctAPI.CompacctCookies.User_ID,
    proj :this.openProject ? this.openProject : "N",
  }
  const obj = {
  "SP_String": "SP_PO_Authorization_Harbauer",
  "Report_Name_String": "PO_Browse_Pending",
  "Json_Param_String": JSON.stringify([tempobj])
  }
  this.GlobalAPI.getData(obj).subscribe((data:any)=>{
   this.SearchedlistPanding = data;
   if (this.SearchedlistPanding.length){
    this.ngxService.stop();
    this.DynamicHeaderPanding = Object.keys(data[0]);
    this.backUPSearchedlistPanding = data;
     this.GetDistinct()
   }
  else {
    this.DynamicHeaderPanding = [];
    this.ngxService.stop();
  }
   //console.log('SearchedlistPanding=====',this.SearchedlistPanding)
  })
}
// Authorized PO Serch Button fn
AuthorizationSearchButton(){
  this.ngxService.start();
  this.ApprovedSearchedlist = [];
  const tempobj = {
    proj :this.openProject ? this.openProject : "N",
    User_ID : this.$CompacctAPI.CompacctCookies.User_ID
  }
  const obj = {
  "SP_String": "SP_PO_Authorization_Harbauer",
  "Report_Name_String": "PO_Browse_Approved",
  "Json_Param_String": JSON.stringify([tempobj])
  }
  this.GlobalAPI.getData(obj).subscribe((data:any)=>{
   this.ApprovedSearchedlist = data;
   //console.log('ApprovedSearchedlist=====',this.ApprovedSearchedlist)
   if (this.ApprovedSearchedlist.length){
    this.ngxService.stop();
    this.DynamicHeaderAuthorized = Object.keys(data[0]);
    this.backUPSearchedlistAuthor = data;
    this.GetDistinctAuth();
   }
  else {
    this.DynamicHeaderAuthorized = [];
    this.ngxService.stop();
  } 
  })
}
// NOt Authorized PO Serch Button fn
NotAuthorizationSearchButton(){
  this.NotApprovedSearchedlist = [];
  const tempobj = {
    proj :this.openProject ? this.openProject : "N",
    User_ID : this.$CompacctAPI.CompacctCookies.User_ID
  }
  const obj = {
  "SP_String": "SP_PO_Authorization_Harbauer",
  "Report_Name_String": "PO_Browse_Disapproved",
  "Json_Param_String": JSON.stringify([tempobj])
  }
  this.GlobalAPI.getData(obj).subscribe((data:any)=>{
   this.NotApprovedSearchedlist = data;
 //console.log('NotApprovedSearchedlist=====',this.NotApprovedSearchedlist)
   if (this.NotApprovedSearchedlist.length){
    this.DynamicHeaderNOTAuthorized = Object.keys(data[0]);
    this.backUPSearchedlistNotAutho =data;
    this.GetDistinctNotAuth();
   }
   else {
    this.DynamicHeaderNOTAuthorized = [];
   }
  })
}
// Pop For Approved Po
ApprovedPo(master:any){
  this.masterApproveId =undefined;
  if(master.Doc_No){
    this.masterApproveId = master.Doc_No;
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
      "SP_String": "SP_PO_Authorization_Harbauer",
      "Report_Name_String": "Update_PO_Authorization",
      "Json_Param_String": JSON.stringify([tempobj])
    }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      // console.log("del Data===", data[0].Column1)
      if (data[0].Column1){
        this.onReject();
        this.getListPandingAuth();
        this.compacctToast.clear();
        this.compacctToast.add({
          key: "compacct-toast",
          severity: "success",
          summary: " PO No " + this.masterApproveId ,
          detail: "Succesfully Approved "
        });
        this.masterApproveId = undefined ;
       }
    })
  }
}
// Pop For DisApproved Po
 DisapprovedPo(masterDisAproved:any){
  this.MasterdisApproveId =undefined;
  if(masterDisAproved.Doc_No){
    this.MasterdisApproveId = masterDisAproved.Doc_No ;
    this.compacctToast.clear();
    this.compacctToast.add({
      key: "d",
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
     Status : "DISAPPROVE",
     Disapprove_Reason:this.DisapproveReason,
    }
    const obj = {
      "SP_String": "SP_PO_Authorization_Harbauer",
      "Report_Name_String": "Update_PO_Authorization",
      "Json_Param_String": JSON.stringify([tempobj])
    }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
       //console.log("del Data===", data[0].Column1)
      if (data[0].Column1){
        this.onReject();
        this.getListPandingAuth();
        this.compacctToast.clear();
        this.compacctToast.add({
          key: "compacct-toast",
          severity: "success",
          summary: " PO No " + this.MasterdisApproveId ,
          detail: "Succesfully DisApproved"
        });
         this.MasterdisApproveId = undefined ;
         this.DisapproveReason =undefined;
       }
    })
  }
}
//filter pending
GetDistinct() {
  let Project:any = [];
  let Site:any = [];
  this.DistProject = [];
  this.SelectedDistProject = [];
  this.DistSite = [];
  this.SelectedDistSite = [];
 
  this.SearchedlistPanding.forEach((item) => {
 if (Project.indexOf(item.Project_Description) === -1) {
  Project.push(item.Project_Description);
 this.DistProject.push({ label: item.Project_Description, value: item.Project_Description });
 }
if (Site.indexOf(item.Site_Description) === -1) {
  Site.push(item.Site_Description);
  this.DistSite.push({ label: item.Site_Description, value: item.Site_Description });
  }

});
   this.backUPSearchedlistPanding = [...this.SearchedlistPanding];
}
FilterDist() {
  let Project:any = [];
  let Site:any = [];
  let SearchFields:any =[]; 
if (this.SelectedDistProject.length) {
   SearchFields.push('Project_Description');
   Project = this.SelectedDistProject;
}
if (this.SelectedDistSite.length) {
  SearchFields.push('Site_Description');
  Site = this.SelectedDistSite;
}

this.SearchedlistPanding = [];
if (SearchFields.length) {
  let LeadArr = this.backUPSearchedlistPanding.filter(function (e) {
    return (Project.length ? Project.includes(e['Project_Description']) : true)
    && (Site.length ? Site.includes(e['Site_Description']) : true)  
  });
this.SearchedlistPanding = LeadArr.length ? LeadArr : [];
} else {
this.SearchedlistPanding = [...this.backUPSearchedlistPanding] ;
}
}
//filter Authorized
GetDistinctAuth() {
  let Project:any = [];
  let Site:any = [];
  this.AuthProject = [];
  this.SelectedAuthProject = [];
  this.AuthSite = [];
  this.SelectedAuthSite = [];
 
  this.ApprovedSearchedlist.forEach((item) => {
 if (Project.indexOf(item.Project_Description) === -1) {
  Project.push(item.Project_Description);
 this.AuthProject.push({ label: item.Project_Description, value: item.Project_Description });
 }
if (Site.indexOf(item.Site_Description) === -1) {
  Site.push(item.Site_Description);
  this.AuthSite.push({ label: item.Site_Description, value: item.Site_Description });
  }

});
   this.backUPSearchedlistAuthor = [...this.ApprovedSearchedlist];
}
FilterDistAuth() {
  let Project:any = [];
  let Site:any = [];
  let SearchFieldsAuth:any =[]; 
if (this.SelectedAuthProject.length) {
  SearchFieldsAuth.push('Project_Description');
   Project = this.SelectedAuthProject;
}
if (this.SelectedAuthSite.length) {
  SearchFieldsAuth.push('Site_Description');
  Site = this.SelectedAuthSite;
}

this.ApprovedSearchedlist = [];
if (SearchFieldsAuth.length) {
  let LeadArr = this.backUPSearchedlistAuthor.filter(function (e) {
    return (Project.length ? Project.includes(e['Project_Description']) : true)
    && (Site.length ? Site.includes(e['Site_Description']) : true)  
  });
this.ApprovedSearchedlist = LeadArr.length ? LeadArr : [];
} else {
this.ApprovedSearchedlist = [...this.backUPSearchedlistAuthor] ;
}
}
//filter NotAuthorized
GetDistinctNotAuth() {
  let Project:any = [];
  let Site:any = [];
  this.NotAuthProject = [];
  this.SelectedNAuthProject = [];
  this.NotAuthSite = [];
  this.SelectedNauthSite = [];
 
  this.NotApprovedSearchedlist.forEach((item) => {
 if (Project.indexOf(item.Project_Description) === -1) {
  Project.push(item.Project_Description);
 this.NotAuthProject.push({ label: item.Project_Description, value: item.Project_Description });
 }
if (Site.indexOf(item.Site_Description) === -1) {
  Site.push(item.Site_Description);
  this.NotAuthSite.push({ label: item.Site_Description, value: item.Site_Description });
  }

});
   this.backUPSearchedlistNotAutho = [...this.NotApprovedSearchedlist];
}
FilterDistNotAuth() {
  let Project:any = [];
  let Site:any = [];
  let SearchFieldsNAuth:any =[]; 
if (this.SelectedNAuthProject.length) {
  SearchFieldsNAuth.push('Project_Description');
   Project = this.SelectedNAuthProject;
}
if (this.SelectedNauthSite.length) {
  SearchFieldsNAuth.push('Site_Description');
  Site = this.SelectedNauthSite;
}

this.NotApprovedSearchedlist = [];
if (SearchFieldsNAuth.length) {
  let LeadArr = this.backUPSearchedlistNotAutho.filter(function (e) {
    return (Project.length ? Project.includes(e['Project_Description']) : true)
    && (Site.length ? Site.includes(e['Site_Description']) : true)  
  });
this.NotApprovedSearchedlist = LeadArr.length ? LeadArr : [];
} else {
this.NotApprovedSearchedlist = [...this.backUPSearchedlistNotAutho] ;
}
}
//Panding Auth Print/View
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
      window.open(printlink+"?Doc_No=" + DocAuth.Doc_No, 'mywindow', 'fullscreen=yes, scrollbars=auto,width=950,height=500');
      //console.log("DocAuth===",DocAuth.Doc_No)
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
//Pending work detels pop
selectWork(event,col, overlaypanel) {
//console.log("col",col)
this.ObjCol = {}
this.ObjCol = col
overlaypanel.toggle(event);
 
}
//Pending work detels pop
selectWorkAproved(event,col, overlaypanel) {
  //console.log("col",col)
  this.ObjColApproved = {}
  this.ObjCol = col
  overlaypanel.toggle(event);  
}
  //Pending work detels pop
selectWorkNapproved(event,col, overlaypanel) {
  //console.log("col",col)
  this.ObjCol = {}
  this.ObjColNApproved = col
  overlaypanel.toggle(event); 
}
//dynamic heder filter
GetSlicedArr () {
  let TempArr:any = [];
  this.DynamicHeaderPanding.forEach((item:any)=>{
    if(item ==="PO No" || 
    item === "PO_Date"|| 
    item ==="Req_No" || 
    item === "Vendor_Name"|| 
    item === "Cost_Cen_Name"|| 
    item === "Gross Amount"|| 
    item === "Product_Taxable"|| 
    item === "Term Amount"|| 
    item === "Total Taxable"|| 
    item === "Total GST"|| 
    item === "Rounded_Off"|| 
    item === "Net Amount"|| 
    item === "Project_Description"|| 
    item === "Site_Description"|| 
    item === "Budget_Group_Name"|| 
    item === "Work_Details"){
      TempArr.push(item)
    }
  })
  //console.log(TempArr)
  return TempArr ;
}
// Dyn Aroved filter
GetSlicedArrAproved () {
  let TempArr:any = [];
  this.DynamicHeaderAuthorized.forEach((item:any)=>{
    if(item ==="PO No" || 
    item === "PO_Date"|| 
    item ==="Req_No" || 
    item === "Vendor_Name"|| 
    item === "Cost_Cen_Name"|| 
    item === "Gross Amount"|| 
    item === "Product_Taxable"|| 
    item === "Term Amount"|| 
    item === "Total Taxable"|| 
    item === "Total GST"|| 
    item === "Rounded_Off"|| 
    item === "Net Amount"|| 
    item === "Project_Description"|| 
    item === "Site_Description"|| 
    item === "Budget_Group_Name"|| 
    item === "Work_Details"){
      TempArr.push(item)
    }
  })
  //console.log(TempArr)
  return TempArr ;
}
// Dyn Not Approved Filter
GetSlicedArrNotAproved () {
  let TempArr:any = [];
  this.DynamicHeaderNOTAuthorized.forEach((item:any)=>{
    if(item ==="PO No" || 
    item === "PO_Date"|| 
    item ==="Req_No" || 
    item === "Vendor_Name"|| 
    item === "Cost_Cen_Name"|| 
    item === "Gross Amount"|| 
    item === "Product_Taxable"|| 
    item === "Term Amount"|| 
    item === "Total Taxable"|| 
    item === "Total GST"|| 
    item === "Rounded_Off"|| 
    item === "Net Amount"|| 
    item === "Project_Description"|| 
    item === "Site_Description"|| 
    item === "Budget_Group_Name"|| 
    item === "Work_Details"){
      TempArr.push(item)
    }
  })
  //console.log(TempArr)
  return TempArr ;
}
}

// class Authorized{
// From_Date:any;
// To_Date:any;
// }
// class NOTAuthorized{
// From_Date:any;
// To_Date:any;
// }