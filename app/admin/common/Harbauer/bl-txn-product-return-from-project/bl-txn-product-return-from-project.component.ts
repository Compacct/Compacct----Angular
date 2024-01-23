import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MessageService } from 'primeng/api';
import { CompacctCommonApi } from '../../../shared/compacct.services/common.api.service';
import { CompacctGlobalApiService } from '../../../shared/compacct.services/compacct.global.api.service';
import { CompacctHeader } from '../../../shared/compacct.services/common.header.service';
import { DateTimeConvertService } from '../../../shared/compacct.global/dateTime.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';

@Component({
  selector: 'app-bl-txn-product-return-from-project',
  templateUrl: './bl-txn-product-return-from-project.component.html',
  styleUrls: ['./bl-txn-product-return-from-project.component.css'],
  providers: [MessageService],
  encapsulation: ViewEncapsulation.None
})
export class BLTxnProductReturnFromProjectComponent implements OnInit {
  items: any = [];
  tabIndexToView: number = 0;
  buttonname: string = "Save";
  ProjectList: any = [];
  SiteList:any =[];
  groupList:any =[];
  subGorupList:any =[];
  workList:any =[];
  InflowFormSubmitted: boolean = false;
  ObjProj: Proj = new Proj();
  Objproject: project = new project();
  addList: any = [];
  costCenterList :any =[];
  Stocklist: any = [];
  DOC_Date: Date = new Date();
  projectFromSubmit: boolean = false;
  ObjCol: any = {};
  Disabled: boolean = false;
  productList: any = [];
  VAlidation: boolean = false;
  Stocklist1: any = [];
  costCenterList1: any = [];
  ObjBrowse:Browse = new Browse();
  initDate2: any = [];
  BrowseFromSubmit: boolean = false;
  SearchedlistBrowse: any = [];
  DynamicHeader2: any = [];
  constructor(
    public $http: HttpClient,
    public commonApi: CompacctCommonApi,
    private GlobalAPI:CompacctGlobalApiService,
    public Header: CompacctHeader,
    public DateService: DateTimeConvertService,
    public compacctToast: MessageService,
    public $CompacctAPI: CompacctCommonApi,
    private ngxService: NgxUiLoaderService 
  ) { }

  ngOnInit() {
      this.items = ["BROWSE","CREATE"];
       this.Header.pushHeader({
      Header: "Product Return From project",
      Link: " Project Management ->Product Return From project"
       });
    this.getCostCenter();
    this.getProject();
    this.getCostCenterBrowse();
    this.Finyear();
  }
  onReject(){}
  getButtomData(){}
  TabClick(e:any) {
    this.tabIndexToView = e.index;
    this.items = ["BROWSE","CREATE"];
    this.buttonname = "Save";
    this.InflowFormSubmitted = false;
    this.projectFromSubmit = false;
    this.Disabled = false;
    this.addList = [];
    this.ObjCol = {};
    this.Objproject.Project_ID = undefined;
    this.Objproject.Remarks = undefined;
  }
  getProject(){
  this.ProjectList = [];
    const obj = {
      "SP_String": "SP_BL_CRM_TXN_Project_Doc",
      "Report_Name_String": "Get_Project",
     }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      data.forEach(el => {
        el['label'] = el.Project_Description;
        el['value'] = el.Project_ID;
      });
      this.ProjectList = data;
      //console.log("ProjectList",this.ProjectList);
      
   
    })
  }
  getSite(){
  this.SiteList = [];
  this.groupList = [];
  this.subGorupList = [];
  this.ObjProj.Site_ID = undefined;
  this.ObjProj.Budget_Group_ID = undefined;
  this.ObjProj.Budget_Sub_Group_ID = undefined;
  this.ObjProj.Work_Details_ID = undefined;
  this.workList = [];
  if(this.Objproject.Project_ID){
   let projectFilter:any = []
  projectFilter = this.ProjectList.filter((el:any)=> Number(el.Project_ID) === Number(this.Objproject.Project_ID))
    const obj = {
      "SP_String": "SP_Tender_Management_All",
      "Report_Name_String": "Get_Site_For_Project_Planning",
      "Json_Param_String": JSON.stringify([{Project_ID : Number(this.Objproject.Project_ID),Tender_Doc_ID : projectFilter[0].Tender_Doc_ID}]) 
     }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      data.forEach(el => {
        el['label'] = el.Site_Description;
        el['value'] = el.Site_ID;
      });
      this.SiteList = data;
    })
  }
  }
  getGroup(){
  this.groupList = [];
  this.subGorupList = [];
  this.workList = [];
  this.ObjProj.Budget_Group_ID = undefined;
  this.ObjProj.Budget_Sub_Group_ID = undefined;
  if(this.Objproject.Project_ID && this.ObjProj.Site_ID){
  this.getWork()
     const obj = {
      "SP_String": "SP_BL_CRM_TXN_Project_Doc",
      "Report_Name_String": "Get_Budget_Group",
      "Json_Param_String": JSON.stringify([{Project_ID : Number(this.Objproject.Project_ID) , Site_ID : Number(this.ObjProj.Site_ID)}]) 
     }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      data.forEach(el => {
        el['label'] = el.Budget_Group_Name;
        el['value'] = el.Budget_Group_ID;
      });
      this.groupList = data;
      })
    }
  }
  getSubGroup(){
    this.subGorupList = [];
    this.ObjProj.Budget_Sub_Group_ID = undefined;
     if(this.Objproject.Project_ID && this.ObjProj.Site_ID && this.ObjProj.Budget_Group_ID){
   const tampObj = {
      Project_ID : Number(this.Objproject.Project_ID),
      Site_ID : Number(this.ObjProj.Site_ID),
      Budget_Group_ID : Number(this.ObjProj.Budget_Group_ID)
    }
    const obj = {
      "SP_String": "SP_BL_CRM_TXN_Project_Doc",
      "Report_Name_String": "Get_Budget_Sub_Group",
      "Json_Param_String": JSON.stringify([tampObj]) 
     }
     this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      data.forEach(el => {
        el['label'] = el.Budget_Sub_Group_Name;
        el['value'] = el.Budget_Sub_Group_ID;
           });
        this.subGorupList = data;
        })
     }
  }
  getWork(){
    this.workList = []
    this.ObjProj.Work_Details_ID = undefined;
  if(this.Objproject.Project_ID && this.ObjProj.Site_ID){

    const obj = {
      "SP_String": "SP_BL_CRM_TXN_Project_Doc",
      "Report_Name_String": "Get_Work_Details",
      "Json_Param_String": JSON.stringify([{Project_ID : Number(this.Objproject.Project_ID) , Site_ID : Number(this.ObjProj.Site_ID)}]) 
     }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      data.forEach(el => {
        el['label'] = el.Work_Details;
        el['value'] = el.Work_Details_ID;
      });
    this.workList = data
    })
  }
  }
  getProdoct(){
    this.productList = [];
    this.ObjProj.Product_ID = undefined;
     if(this.Objproject.Project_ID && this.ObjProj.Site_ID && this.ObjProj.Budget_Group_ID &&this.ObjProj.Budget_Sub_Group_ID &&this.ObjProj.Work_Details_ID){
   const tampObj = {
    PROJECT_ID :  Number(this.Objproject.Project_ID),				
    SITE_ID : Number(this.ObjProj.Site_ID),                             
    Budget_Group_ID : Number(this.ObjProj.Budget_Group_ID),                    
    Budget_Sub_Group_ID : Number(this.ObjProj.Budget_Sub_Group_ID),          
    Work_Details_ID : Number(this.ObjProj.Work_Details_ID)              
    }
    const obj = {
      "SP_String": "Sp_BL_Txn_Product_Return_From_Project",
      "Report_Name_String": "Get_Product_For_Return",
      "Json_Param_String": JSON.stringify([tampObj]) 
     }
       this.GlobalAPI.getData(obj).subscribe((data: any) => {
      data.forEach(el => {
        el['label'] = el.Product_Description;
        el['value'] = el.Product_ID;
           });
        this.productList = data;
        })
     }
  }
  getCostCenter(){
    const obj = {
     "SP_String": "sp_Comm_Controller",
     "Report_Name_String" : "Get_Master_Cost_Center_Dropdown"
   }
   this.GlobalAPI.getData(obj).subscribe((data:any)=>{
     if(data.length) {
       data.forEach(element => {
         element['label'] = element.Cost_Cen_Name,
         element['value'] = element.Cost_Cen_ID								
       });
       this.costCenterList = data;
       this.Objproject.Cost_Cen_ID = this.costCenterList.length ? this.costCenterList[0].Cost_Cen_ID : undefined;
       if(this.Objproject.Cost_Cen_ID){
        this.getStockPoint()
       }
      } 
     else {
       this.costCenterList = [];
     }
   });
  } 
  getStockPoint(){
      this.Stocklist = [];
    const obj = {
    "SP_String": "SP_Txn_Requisition",
    "Report_Name_String": "Get_Cost_Center_Godown",
    "Json_Param_String": JSON.stringify([{Cost_Cen_ID: Number(this.Objproject.Cost_Cen_ID)}])
    }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      if(data.length) {
        data.forEach(element => {
          element['label'] = element.godown_name,
          element['value'] = element.Godown_ID	});
          this.Stocklist = data;
        this.Objproject.Godown_ID = this.Stocklist.length ? this.Stocklist[0].Godown_ID : undefined;
      }
      else{
        this.Stocklist = []; 
      }
    })
  }
  getCostCenterBrowse(){
    const obj = {
     "SP_String": "sp_Comm_Controller",
     "Report_Name_String" : "Get_Master_Cost_Center_Dropdown"
   }
   this.GlobalAPI.getData(obj).subscribe((data:any)=>{
     if(data.length) {
       data.forEach(element => {
         element['label'] = element.Cost_Cen_Name,
         element['value'] = element.Cost_Cen_ID								
       });
       this.costCenterList1 = data;
       this.ObjBrowse.Cost_Cen_ID = this.costCenterList1.length ? this.costCenterList1[0].Cost_Cen_ID : undefined;
       if(this.ObjBrowse.Cost_Cen_ID){
        this.getStockPointBrowse()
       }
      } 
     else {
       this.costCenterList1 = [];
     }
   });
  } 
  getStockPointBrowse(){
      this.Stocklist = [];
    const obj = {
    "SP_String": "SP_Txn_Requisition",
    "Report_Name_String": "Get_Cost_Center_Godown",
    "Json_Param_String": JSON.stringify([{Cost_Cen_ID: Number(this.Objproject.Cost_Cen_ID)}])
    }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      if(data.length) {
        data.forEach(element => {
          element['label'] = element.godown_name,
          element['value'] = element.Godown_ID	});
          this.Stocklist1 = data;
        this.ObjBrowse.Godown_ID = this.Stocklist1.length ? this.Stocklist1[0].Godown_ID : undefined;
      }
      else{
        this.Stocklist1 = []; 
      }
    })
  }
  AddData(valid:any) {
    this.InflowFormSubmitted = true;
    if (valid) {
      let Site = this.SiteList.filter((Ele: any) => Ele.Site_ID === this.ObjProj.Site_ID);
      let Grop = this.groupList.filter((el: any) => el.Budget_Group_ID === this.ObjProj.Budget_Group_ID);
      let SubGrop = this.subGorupList.filter((ele: any) => ele.Budget_Sub_Group_ID === this.ObjProj.Budget_Sub_Group_ID);
      let Work = this.workList.filter((EL: any) => EL.Work_Details_ID === this.ObjProj.Work_Details_ID);
      let pord = this.productList.filter((ELE:any)=> ELE.Product_ID === this.ObjProj.Product_ID)
      this.addList.push({
       Site_Description : Site[0].Site_Description,
       Budget_Group_Name : Grop[0].Budget_Group_Name,
       Budget_Sub_Group_Name : SubGrop[0].Budget_Sub_Group_Name,
       Work_Details: Work[0].Work_Details,
       Product_ID :this.ObjProj.Product_ID,
       Product_Description: pord[0].Product_Description,
       Issue_Qty: pord[0].Qty,
       Batch_No : pord[0].Batch_No,
       Rcv_Qty: pord[0].Qty,
       UOM: pord[0].UOM,															     											    						 
       SITE_ID: this.ObjProj.Site_ID,                          
       Budget_Group_ID : this.ObjProj.Budget_Group_ID,                
       Budget_Sub_Group_ID: this.ObjProj.Budget_Sub_Group_ID,              
       Work_Details_ID : this.ObjProj.Work_Details_ID  
      })
      this.Disabled = true;
      this.InflowFormSubmitted = false;
      this.ObjProj = new Proj();
    }
  }
  getChange(i:any) {
    if (Number(this.addList[i].Rcv_Qty) <= Number(this.addList[i].Issue_Qty) ) {
     this.addList[i].Rcv_Qty = (Number(this.addList[i].Rcv_Qty))  
    }
    else {
       this.addList[i].Rcv_Qty = 0
       this.compacctToast.clear();
          this.compacctToast.add({
            key: "compacct-toast",
            severity: "error",
            summary: "Invalid Typing",
            detail: "Qty Not More Than Issue QTY"
          });
    }  
  }
  saveData(Valid1: any) {
    this.projectFromSubmit = true;
    if (Valid1 && this.addList.length) {
      this.addList.forEach((element:any )=> {
        if (!element.Rcv_Qty||element.Rcv_Qty > element.Issue_Qty) {
          this.VAlidation = true;
          return
        } else {
         this.VAlidation = false;  
        }
      });
      if (!this.VAlidation) {
        let CostFilter = this.costCenterList.filter((el: any) => el.Cost_Cen_ID === this.Objproject.Cost_Cen_ID)
        const Tempobj = {
          DOC_No: "NA",
          DOC_Date: this.DOC_Date,
          Cost_Cen_ID: this.Objproject.Cost_Cen_ID,
          Cost_Cen_Name: CostFilter[0].Cost_Cen_Name,
          Godown_ID: this.Objproject.Godown_ID,
          Inv_Type_ID: 85,
          User_ID: this.$CompacctAPI.CompacctCookies.User_ID,
          Created_On: new Date(),
          DOC_TYPE: 'PRODUCT RETURN',
          PROJECT_ID: this.Objproject.Project_ID,
          Remarks: this.Objproject.Remarks,
          bottom: this.addList,
        }
        const obj = {
          "SP_String": "Sp_BL_Txn_Product_Return_From_Project",
          "Report_Name_String": "Bl_Txn_Return_Create",
          "Json_Param_String": JSON.stringify(Tempobj)
        }
        this.GlobalAPI.postData(obj).subscribe((data: any) => {
          if (data[0].Column1) {
            this.compacctToast.clear();
            this.compacctToast.add({
              key: "compacct-toast",
              severity: "success",
              summary: "Product Return From project ",
              detail: "Succesfully Save",
            });
            this.tabIndexToView = 0;
            this.Objproject = new project();
            this.projectFromSubmit = false;
            this.VAlidation = false;
            this.addList = [];
          }
        })
      }
    }
  }
  stringShort(str,wh) {
    let retuObj:any = {}
    if (str.length > 30) {
      retuObj = {
        field: str.substring(0, 30) + " ...",
        cssClass : "txt"
      }
    }
    else {
       retuObj = {
        field: str,
        cssClass : ""
      }
    }
return wh == "css" ? retuObj.cssClass : retuObj.field
  }
  selectWork(event,col, overlaypanel) {
    this.ObjCol = {}
    this.ObjCol = col
    overlaypanel.toggle(event); 
  }
  Delete(i: any) {
    this.addList.splice(i, 1);
    if (this.addList.length < 1) {
      this.Disabled = false;
    }
  }
  getDateRange(dateRangeObj:any) {
    if(dateRangeObj.length){
      this.ObjBrowse.From_Date = dateRangeObj[0];
      this.ObjBrowse.To_Date = dateRangeObj[1];
    }
  }
  Finyear() {
  this.$http
    .get("Common/Get_Fin_Year_Date?Fin_Year_ID=" + this.$CompacctAPI.CompacctCookies.Fin_Year_ID)
    .subscribe((res: any) => {
    let data = JSON.parse(res)
   this.initDate2 = [new Date(data[0].Fin_Year_Start) , new Date(data[0].Fin_Year_End)]
    });
  }
  GetSearchedListBrowse(valid:any){
  this.BrowseFromSubmit = true;
  if(valid){
  this.SearchedlistBrowse = [];
  const start = this.ObjBrowse.From_Date
  ? this.DateService.dateConvert(new Date(this.ObjBrowse.From_Date))
  : this.DateService.dateConvert(new Date());
  const end = this.ObjBrowse.To_Date
  ? this.DateService.dateConvert(new Date(this.ObjBrowse.To_Date))
  : this.DateService.dateConvert(new Date());
  const tempobj = {
    From_Date : start,
    To_Date : end,
    Cost_Cen_ID: this.ObjBrowse.Cost_Cen_ID,
    Godown_ID : this.ObjBrowse.Godown_ID,
  }
  const obj = {
  "SP_String": "Sp_BL_Txn_Product_Return_From_Project",
  "Report_Name_String": "Bl_Bl_Txn_Return_Browse",
  "Json_Param_String": JSON.stringify([tempobj])
  }
  this.GlobalAPI.getData(obj).subscribe((data:any)=>{
    if(data.length){
      this.SearchedlistBrowse = data;
      this.DynamicHeader2 = Object.keys(data[0]);
    }
   //console.log('SearchedlistBrowse===',this.SearchedlistBrowse)
  })
}
  }
}
class Proj{
  Site_ID: any;
  Budget_Group_ID: any;
  Budget_Sub_Group_ID: any;
  Work_Details_ID: any;
  Product_ID: any;
}
class project {
  Project_ID: any;
  Cost_Cen_ID :any;
  Godown_ID: any;
  Remarks: any;
}
class Browse{
  Cost_Cen_ID:any;
  From_Date: any;
  To_Date	:any;
  Godown_ID:any;
}
