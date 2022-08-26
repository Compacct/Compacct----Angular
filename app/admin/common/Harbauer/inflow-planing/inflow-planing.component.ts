import { filter } from 'rxjs/operators';
import { DateTimeConvertService } from './../../../shared/compacct.global/dateTime.service';
import { CompacctHeader } from './../../../shared/compacct.services/common.header.service';
import { CompacctGlobalApiService } from './../../../shared/compacct.services/compacct.global.api.service';
import { CompacctCommonApi } from './../../../shared/compacct.services/common.api.service';
import { HttpClient } from '@angular/common/http';
import { MessageService } from 'primeng/api';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { NgxUiLoaderService } from 'ngx-ui-loader';

@Component({
  selector: 'app-inflow-planing',
  templateUrl: './inflow-planing.component.html',
  styleUrls: ['./inflow-planing.component.css'],
  providers: [MessageService],
  encapsulation: ViewEncapsulation.None
})
export class InflowPlaningComponent implements OnInit {
  items = [];
  menuList =[];
  tabIndexToView= 0;
  AllData =[];
  buttonname = "Create";
  Objplaning : planing = new planing(); 
  ObjBrowse : Browse = new Browse();
  SearchedlistBrowse:any=[];
  ProjectedmaxDate = new Date();
  ProjectedminDate = new Date();
  Projecteddata = new Date();
  Projected_Date = new Date();
  InflowFormSubmitted = false
  InflowFormBrowse = false;
  InflowPopFormSubmitted = false
  MBDatemaxDate = new Date();
  MBDateminDate = new Date();
  MBDate = new Date();
  MB_Date = new Date();
  MB_DateDis = false;
  Spinner = false;
  initDate:any = [];
  ProjectList = [];
  workList = [];
  subGorupList = [];
  groupList = [];
  SiteList = [];
  SearchedListBrowseProj = [];
  SearchedListBrowse =[];
  masterPlaingId : number;
  ViewMBDateTypeModal = false;
  ViewMBProjModal =false;
  ViewProTypeModal = false;
  ViewList:any = [];
  inflowid : any;


  constructor(
    public $http: HttpClient,
    public commonApi: CompacctCommonApi,
    private GlobalAPI:CompacctGlobalApiService,
    public Header: CompacctHeader,
    public DateService: DateTimeConvertService,
    public compacctToast: MessageService,
    public $CompacctAPI: CompacctCommonApi,
    private ngxService: NgxUiLoaderService 
  ) {}

ngOnInit(){
    this.items = ["BROWSE", "CREATE"];

    this.Header.pushHeader({
      Header: "Inflow Planing",
      Link: "Project Management -> Inflow Planing"
    })
    this.Finyear();
    this.getProject();
}
TabClick(e) {
  this.tabIndexToView = e.index;
  this.items = ["BROWSE", "CREATE"];
  this.buttonname = "Create";
  this.clearData();
}
clearData(){
  this.Objplaning = new planing();
  this.initDate = []; 
  this.Projected_Date = this.Projecteddata;
  this.MB_Date = this.MBDate;
  this.getDisable();
  this.ObjBrowse = new Browse();
  this.SearchedListBrowse =[];
  this.SearchedListBrowseProj = [];
  this.InflowFormBrowse = false;
  this.InflowFormSubmitted = false;
}
getProject(){
  this.ProjectList = [];
    const obj = {
      "SP_String": "SP_BL_CRM_TXN_Project_Doc",
      "Report_Name_String": "Get_Project",
     }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      // console.log(data);
      this.ProjectList = data;
      // this.getGroup(this.objproject.Budget_Group_ID);
      // this.getSubGroup(this.objproject.Budget_Sub_Group_ID)
      // this.getWork(this.objproject.Work_Details_ID)
      //console.log("ProjectList",this.ProjectList);
      
    // this.EmitOnDataInit()
    })
}
getSite(projectID){
    if(projectID){
   // this.EmitOnDataInit()
    this.SiteList = [];
    this.groupList = [];
    this.subGorupList = [];
    this.workList = [];
    let projectFilter:any = []
    setTimeout(() => {
      projectFilter = this.ProjectList.filter((el:any)=> Number(el.Project_ID) === Number(projectID))
      //console.log("projectFilter",projectFilter)
      const obj = {
        "SP_String": "SP_Tender_Management_All",
        "Report_Name_String": "Get_Site_For_Project_Planning",
        "Json_Param_String": JSON.stringify([{Project_ID : Number(projectID),Tender_Doc_ID : projectFilter[0].Tender_Doc_ID}]) 
       }
      this.GlobalAPI.getData(obj).subscribe((data:any)=>{
        this.SiteList = data;
        this.getWork(this.Objplaning.Work_Details_ID)
        
       // console.log("SiteList",this.SiteList);
      })
    }, 100);
     
 
  }

}
getGroup(id?){
  if(this.Objplaning.Project_ID && this.Objplaning.Site_ID){
    //this.EmitOnDataInit()
  this.groupList = [];
  this.subGorupList = [];
  this.workList = [];
     const obj = {
      "SP_String": "SP_BL_CRM_TXN_Project_Doc",
      "Report_Name_String": "Get_Budget_Group",
      "Json_Param_String": JSON.stringify([{Project_ID : Number(this.Objplaning.Project_ID) , Site_ID : Number(this.Objplaning.Site_ID)}]) 
     }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
       //console.log("getGroup",data);
      this.groupList = data;
      setTimeout(() => {
        this.Objplaning.Budget_Group_ID = id ? id : undefined
        this.getSubGroup(this.Objplaning.Budget_Sub_Group_ID);
        this.getWork(this.Objplaning.Work_Details_ID)
      }, 1000);
     //console.log("groupList",this.groupList);
    })
  }
 else {
  this.groupList = [];
  this.subGorupList = [];
  this.workList = [];

 }
}
getSubGroup(id?){
  if(this.Objplaning.Project_ID && this.Objplaning.Site_ID && this.Objplaning.Budget_Group_ID){
    //this.EmitOnDataInit()
    this.subGorupList = [];
     const tampObj = {
      Project_ID : Number(this.Objplaning.Project_ID),
      Site_ID : Number(this.Objplaning.Site_ID),
      Budget_Group_ID : Number(this.Objplaning.Budget_Group_ID)
    }
    const obj = {
      "SP_String": "SP_BL_CRM_TXN_Project_Doc",
      "Report_Name_String": "Get_Budget_Sub_Group",
      "Json_Param_String": JSON.stringify([tampObj]) 
     }
     this.GlobalAPI.getData(obj).subscribe((data:any)=>{
        this.subGorupList = data;
        this.Objplaning.Budget_Sub_Group_ID = id ? id : undefined
        //this.EmitOnDataInit()
       //console.log("subGorupList",this.subGorupList);
     })
  }
  else {
    this.subGorupList = [];
   
  }
}
getWork(id?){
  this.workList = []
  if(this.Objplaning.Project_ID && this.Objplaning.Site_ID){
   // this.EmitOnDataInit()
    const obj = {
      "SP_String": "SP_BL_CRM_TXN_Project_Doc",
      "Report_Name_String": "Get_Work_Details",
      "Json_Param_String": JSON.stringify([{Project_ID : Number(this.Objplaning.Project_ID) , Site_ID : Number(this.Objplaning.Site_ID)}]) 
     }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      data.forEach(el => {
        el['label'] = el.Work_Details;
        el['value'] = el.Work_Details_ID;
      });
    this.workList = data
    this.Objplaning.Work_Details_ID = id ? id : undefined
     //this.EmitOnDataInit()
    // console.log("workList",this.workList);
    })
  }
}
Finyear(){
  this.$http
    .get("Common/Get_Fin_Year_Date?Fin_Year_ID=" + this.$CompacctAPI.CompacctCookies.Fin_Year_ID)
    .subscribe((res: any) => {
    let data = JSON.parse(res)
   this.ProjectedmaxDate = new Date(data[0].Fin_Year_End);
   this.ProjectedminDate = new Date(data[0].Fin_Year_Start);
   this.MBDatemaxDate = new Date(data[0].Fin_Year_End);
   this.MBDateminDate = new Date(data[0].Fin_Year_Start);
   this.Projecteddata = new Date().getMonth() > new Date(data[0].Fin_Year_End).getMonth() ? new Date() : new Date(data[0].Fin_Year_End);
   this.MBDate = new Date().getMonth() > new Date(data[0].Fin_Year_End).getMonth() ? new Date() : new Date(data[0].Fin_Year_End)
   this.initDate =  [new Date(data[0].Fin_Year_Start) , new Date(data[0].Fin_Year_End)]
    });
}
getDisable(){
  this.MB_DateDis = false;
  if(this.Objplaning.MB_Done ==="Y"){
    this.MB_DateDis = true
    }
}
saveData(valid:any){
  this.InflowFormSubmitted = true;
  let tempDataSave:any = [];
  if(valid){
    tempDataSave = {
      Projected_Date: this.DateService.dateConvert(new Date(this.Projected_Date)),
      MB_Date: this.Objplaning.MB_Done == "Y" ? this.DateService.dateConvert(new Date(this.MB_Date)) : null,
      MB_Done : this.Objplaning.MB_Done,
      User_ID: this.$CompacctAPI.CompacctCookies.User_ID ,
      Amount : this.Objplaning.Amount,	
      Project_ID: Number(this.Objplaning.Project_ID),
      Site_ID: Number(this.Objplaning.Site_ID),
      Budget_Group_ID: Number(this.Objplaning.Budget_Group_ID),
      Budget_Sub_Group_ID: Number(this.Objplaning.Budget_Sub_Group_ID),
      Work_Details_ID	: Number(this.Objplaning.Work_Details_ID),  
    }
    const obj = {
      "SP_String": "SP_Inflow_Planning",
      "Report_Name_String": 'Create_Inflow',
      "Json_Param_String": JSON.stringify([tempDataSave])
     }
     this.GlobalAPI.getData(obj)
     .subscribe((data:any)=>{
      //console.log("Final save data ==",data);
      if (data[0].Column1){
        this.compacctToast.clear();
        this.compacctToast.add({
          key: "compacct-toast",
          severity: "success",
          summary: "Succesfully Planing Create " ,
          detail: "Succesfully "
        });
        this.Spinner = false;
        this.tabIndexToView = 0;
        this.InflowFormSubmitted = false;
        this.Objplaning = new planing();
        }
        else {
          this.Spinner = false;
          this.compacctToast.clear();
          this.compacctToast.add({
            key: "compacct-toast",
            severity: "error",
            summary: "Warn Message ",
            detail:"Planing Not Create "
          });
        }
  });
}
}
GetSearchedListBrowseProj(valid:any){
  this.InflowFormBrowse = true
    this.SearchedListBrowseProj = [];
    if(valid){
    const tempobj = {
      Project_ID : this.ObjBrowse.Project_ID
    }
    //console.log("tempobj==",tempobj)
    const obj = {
    "SP_String": "SP_Inflow_Planning",
    "Report_Name_String": "Get_Inflow_With_Project",
    "Json_Param_String": JSON.stringify([tempobj])
    }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      if(data.length){
        this.InflowFormBrowse = false
        this.SearchedListBrowseProj = data;
       // this.DynamicHeader = Object.keys(data[0]);
      }
   
    // console.log('SearchedListBrowseProj===',this.SearchedListBrowseProj)
    })
  }
  }
getDateRange(dateRangeObj:any){
    if(dateRangeObj.length){
      this.ObjBrowse.From_Date = dateRangeObj[0];
      this.ObjBrowse.To_Date = dateRangeObj[1];
    }
}
GetSearchedListBrowse(valid){
  this.SearchedListBrowse = [];
  this.SearchedListBrowseProj = [];
  const start = this.ObjBrowse.From_Date
  ? this.DateService.dateConvert(new Date(this.ObjBrowse.From_Date))
  : this.DateService.dateConvert(new Date());
  const end = this.ObjBrowse.To_Date
  ? this.DateService.dateConvert(new Date(this.ObjBrowse.To_Date))
  : this.DateService.dateConvert(new Date());
  const tempobj = {
    From_Date : start,
    To_Date : end,
  }
 // console.log("tempobj DAte ====",tempobj)
  const obj = {
  "SP_String": "SP_Inflow_Planning",
  "Report_Name_String": "Get_Inflow_With_Projected_Date",
  "Json_Param_String": JSON.stringify([tempobj])
  }
  this.GlobalAPI.getData(obj).subscribe((data:any)=>{
    if(data.length){
      this.SearchedListBrowse = data;
      this.SearchedListBrowseProj = data
      //this.DynamicHeader = Object.keys(data[0]);
    }
 
   //console.log('SearchedListBrowse===',this.SearchedListBrowse)
  })
}
DeleteInflow(masterPlaning):void{
 this.masterPlaingId = undefined ;
 
 if(masterPlaning.Inflow_ID){
  this.masterPlaingId = masterPlaning.Inflow_ID ;
   this.compacctToast.clear();
   this.compacctToast.add({
     key: "c",
     sticky: true,
     severity: "warn",
     summary: "Are you sure?",
     detail: "Confirm to proceed"
   });
 }
}
onConfirm(){ 
//console.log("onconform==",this.Objplaning)
 if(this.masterPlaingId){
   const tempobj = {
    
    Inflow_ID: this.masterPlaingId,
    User_ID : this.$CompacctAPI.CompacctCookies.User_ID

   }
   const obj = {
     "SP_String": "SP_Inflow_Planning",
     "Report_Name_String": "Delete_Inflow_Planning",
     "Json_Param_String": JSON.stringify([tempobj])
   }
   this.GlobalAPI.getData(obj).subscribe((data:any)=>{
     // console.log("del Data===", data[0].Column1)
     if (data[0].Column1 === "Done"){
        this.onReject();
       this.masterPlaingId = undefined;
       if(this.ObjBrowse.Project_ID){
        this.GetSearchedListBrowseProj(true)
       }
       else {
        this.GetSearchedListBrowse(true)
       }
      //console.log("SearchedListBrowseProj",this.SearchedListBrowseProj.length)
     //  this.can_popup = false;
       this.compacctToast.clear();
       this.compacctToast.add({
         key: "compacct-toast",
         severity: "success",
         summary: "Planing ",
         detail: "Succesfully Deleted"
       });
      }
   })
 }
}
viewInflowMB(col:any){
  if(col){
  this.inflowid = col.Inflow_ID;
  this.Objplaning.MB_Done;
  this.Objplaning.MB_Date
  this.ViewMBDateTypeModal = false;
  setTimeout(() => {
  this.ViewMBDateTypeModal = true;
  }, 300);
  this.Objplaning.MB_Done = col.MB_Done;
  this.Objplaning.MB_Date = new Date(this.MB_Date)
}
}
viewInflowproj(col:any){
  if(col){
  this.inflowid = col.Inflow_ID;
  this.Objplaning.Project_ID;
  this.Objplaning.Projected_Date
  this.ViewMBProjModal = false;
  setTimeout(() => {
  this.ViewMBProjModal = true;
  }, 300);
  this.Objplaning.Amount = col.Amount;
  this.Projected_Date = new Date(this.Projected_Date)
  }
 
}
showInflow(col:any){
  this.ViewList = [];
  this.masterPlaingId = undefined 
  if(col.Inflow_ID){
    this.masterPlaingId = col.Inflow_ID
    const tempobj = {
      Inflow_ID  : this.masterPlaingId
    }
    const obj = {
      "SP_String": "SP_Inflow_Planning",
      "Report_Name_String": "Show_Log",
      "Json_Param_String": JSON.stringify([tempobj])
    }
     this.GlobalAPI.getData(obj).subscribe((data:any)=>{
       this.ViewList = data;
       this.masterPlaingId = undefined
       //console.log('ViewList=====',this.ViewList);
      })
    setTimeout(() => {
      this.ViewProTypeModal = true;
    }, 300);
  }
}
UpdateAmount(Amount:any){
  //console.log("Amount",Amount)
  this.InflowFormSubmitted = true;
  if(Amount){
  const tempobj = {
     Inflow_ID  :this.inflowid,
     Projected_Date :this.DateService.dateConvert(new Date(this.Projected_Date)),
     User_ID : this.$CompacctAPI.CompacctCookies.User_ID ,
     Amount : this.Objplaning.Amount
    }
    const obj = {
      "SP_String": "SP_Inflow_Planning",
      "Report_Name_String": "Update_Projected_Date",
      "Json_Param_String": JSON.stringify([tempobj])
      }
     this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      //console.log('data=',data[0].Column1);
      if(data[0].Column1)
         {
          this.compacctToast.clear();
          this.compacctToast.add({
          key: "compacct-toast",
          severity: "success",
          detail: "Plaing Succesfully Updated"
        });
        this.Spinner = false;
        this.ViewMBProjModal = false;
       // this.masterPlaingId = undefined 
       
        this.GetSearchedListBrowse(true);
      }
    })
    }     
}  
UpdateMB(Update:any){
  //console.log("mb valide",Update)
  this.InflowPopFormSubmitted = true;
  if(Update){
  const tempobj = {
     Inflow_ID  : this.inflowid,
     User_ID : this.$CompacctAPI.CompacctCookies.User_ID ,
     MB_Done : this.Objplaning.MB_Done,
     MB_Date: this.DateService.dateConvert(new Date(this.MB_Date)),
    }
    const obj = {
      "SP_String": "SP_Inflow_Planning",
      "Report_Name_String": "Update_MB",
      "Json_Param_String": JSON.stringify([tempobj])
      }
     this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      //console.log('data=',data[0].Column1);
      if(data[0].Column1)
         {
          this.compacctToast.clear();
          this.compacctToast.add({
          key: "compacct-toast",
          severity: "success",
          detail: "Plaing Succesfully Updated"
        });
        this.Spinner = false;
        this.ViewMBDateTypeModal = false;
        this.GetSearchedListBrowse(true);
      }
    })
    }     
}
ProjectedAmountTotal(){
  let flg = 0
  this.SearchedListBrowseProj.forEach((x:any)=>{
    flg = Number(flg) + Number(x.Amount)
  })
  return flg
}	
onReject(){
  this.compacctToast.clear("c");
}
}
class planing{
  Project_ID:any;
  Site_ID:any;
  Budget_Group_ID:any;
  Budget_Sub_Group_ID:any;
  Work_Details_ID:any;
  Projected_Date :any;				
  MB_Done	:any;		        			
  MB_Date	:any;			       
  User_ID	:any;
  Amount:any			      
}
class Browse{
  Project_ID:any; 
  From_Date:any;
  To_Date : any;
}
