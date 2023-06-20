import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MessageService } from "primeng/api";
import {CompacctHeader} from "../../../shared/compacct.services/common.header.service"
import { HttpClient, HttpParams } from '@angular/common/http';
import { CompacctGlobalApiService } from '../../../shared/compacct.services/compacct.global.api.service';
import { DateTimeConvertService } from '../../../shared/compacct.global/dateTime.service';
import { CompacctCommonApi } from '../../../shared/compacct.services/common.api.service';
import { Dropdown } from "primeng/components/dropdown/dropdown";
import { Router } from '@angular/router';
import { NgxUiLoaderService } from "ngx-ui-loader";

@Component({
  selector: 'app-branch-requisition',
  templateUrl: './branch-requisition.component.html',
  styleUrls: ['./branch-requisition.component.css'],
  providers: [MessageService],
  encapsulation: ViewEncapsulation.None
})
export class BranchRequisitionComponent implements OnInit {
  tabIndexToView:number = 0;
  items:any = [];
  buttonname:string = "Create";
  ObjbranchREQ:branchREQ = new branchREQ();
  costCenterList:any = [];
  Productlist:any = [];
  Spinner:boolean = false;
  seachSpinner:boolean = false;
  AddBranchReqList:any = [];
  BranchRequisitionFormSubmit:boolean = false;
  objBrowseData:BrowseData = new BrowseData();
  initDate:any = [];
  userType:string = "";
  SPString:string = "SP_BL_Txn_Branch_Requisition";
  DocDate:Date = new Date();
  getAllDataList:any = [];
  DynamicHeader:any =[];
  SaveSpinner:boolean = false;
  DOCNo:any = undefined;
  ViewProTypeModal :boolean =false;
  BranchRequisitionBrowseFormSubmit:boolean = false
  DeliveryRemarksObj: any = { Status: undefined, DOC_No: undefined ,Remarks_From_HO :undefined}
  ViewPoTypeModal: boolean = false;
  POD_Date :Date = new Date();
  Recieve_Date: Date = new Date();
  Courier_Name: any = undefined;
  POD_No: any = undefined;
  ReciveCheck: boolean = false;
  POPform: boolean = false;
  NewDoc: any = undefined;
  constructor( private Header: CompacctHeader,
    private router : Router,
    private $http : HttpClient,
    private GlobalAPI: CompacctGlobalApiService,
    private DateService: DateTimeConvertService,
    public $CompacctAPI: CompacctCommonApi,
    private compacctToast: MessageService,
    private ngxService: NgxUiLoaderService) { }

  ngOnInit() {
    this.items = ["BROWSE", "CREATE"];
    this.Header.pushHeader({
      Header: "Branch Requisition",
      Link: "Branch Requisition"
    });
    this.userType = this.$CompacctAPI.CompacctCookies.User_Type;
    this.objBrowseData.Cost_Cent_ID = this.$CompacctAPI.CompacctCookies.Cost_Cen_ID
    this.getCostCenter()
    this.getProduct()
    this.searchData(true)
    //console.log(this.objBrowseData.Cost_Cent_ID)
  }
  TabClick(e:any) {
    this.tabIndexToView = e.index;
    this.items = ["BROWSE", "CREATE"];
    this.buttonname = "Create";
    this.clearData();
  }
  clearData(){
    this.ObjbranchREQ = new branchREQ()
    this.ObjbranchREQ.Cost_Cent_ID = this.$CompacctAPI.CompacctCookies.Cost_Cen_ID
    this.DocDate = new Date()
    this.AddBranchReqList = []
    this.BranchRequisitionFormSubmit = false
    this.SaveSpinner = false
    this.seachSpinner = false
    this.Spinner = false
    this.DOCNo = undefined
    this.items = ["BROWSE", "CREATE"];
    this.buttonname = "Create";
    this.DeliveryRemarksObj = {Status: undefined , DOC_No:undefined, Remarks_From_HO :undefined}
    this.ViewProTypeModal = false;
    this.BranchRequisitionBrowseFormSubmit = false
  }
  getCostCenter(){
    const obj = {
      "SP_String": this.SPString,
      "Report_Name_String": "DropDown_for_Cost_Center"
    }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
     this.costCenterList = data
     
     //console.log("costCenterList",this.costCenterList)
    })
  }
  getProduct(){
    const obj = {
      "SP_String": this.SPString,
      "Report_Name_String": "DropDown_for_Product"
    }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      //console.log(data)
      if(data.length){
        data.forEach(ele => {
          ele['label'] = ele.Product_Description,
          ele['value'] = ele.Product_ID
        });
      }
      this.Productlist = data
    })
  }
  AddBranchReq(valid:any){
  this.BranchRequisitionFormSubmit = true
  if(valid){
     const ProductlistFilter = this.Productlist.filter((el:any)=> Number(el.Product_ID) == Number(this.ObjbranchREQ.Product_ID))
     this.ObjbranchREQ.Product_Description = ProductlistFilter.length ? ProductlistFilter[0].Product_Description : ""
     this.ObjbranchREQ.Status = "Pending"
     this.ObjbranchREQ.DOC_Date = this.DateService.dateConvert(new Date(this.DocDate))
     this.ObjbranchREQ.Created_By = this.$CompacctAPI.CompacctCookies.User_ID
     this.ObjbranchREQ.Qty = Number(this.ObjbranchREQ.Qty)
     this.ObjbranchREQ.Delivery_Remarks = ""
     this.ObjbranchREQ.DOC_No = this.DOCNo ? this.DOCNo : ""
     this.ObjbranchREQ.Cost_Cent_ID = Number(this.ObjbranchREQ.Cost_Cent_ID)
    this.ObjbranchREQ.Fin_Year_ID = this.$CompacctAPI.CompacctCookies.Fin_Year_ID,
    this.ObjbranchREQ.Reffered_By = this.ObjbranchREQ.Reffered_By ? this.ObjbranchREQ.Reffered_By : '',
    this.ObjbranchREQ.Remarks = this.ObjbranchREQ.Remarks ? this.ObjbranchREQ.Remarks : '',
    this.AddBranchReqList.push(this.ObjbranchREQ)
     const temoObj = {...this.ObjbranchREQ}
     this.ObjbranchREQ = new branchREQ()
     this.ObjbranchREQ.Cost_Cent_ID = temoObj.Cost_Cent_ID
     this.BranchRequisitionFormSubmit = false
    // //console.log("AddBranchReqList",this.AddBranchReqList)
  }
  }
  DeleteAddBranchReq(index:any){
    this.AddBranchReqList.splice(index,1);
  }
  getConfirmDateRange(dateRangeObj) {
    if (dateRangeObj.length) {
      this.objBrowseData.From_Date = dateRangeObj[0];
      this.objBrowseData.To_Date = dateRangeObj[1];
    }
  }
  searchData(valid: any) {
    this.getAllDataList = [];
    this.BranchRequisitionBrowseFormSubmit = true
    if(valid){
      const start = this.objBrowseData.From_Date
    ? this.DateService.dateConvert(new Date(this.objBrowseData.From_Date))
    : this.DateService.dateConvert(new Date());
    const end = this.objBrowseData.To_Date
    ? this.DateService.dateConvert(new Date(this.objBrowseData.To_Date))
    : this.DateService.dateConvert(new Date());
    const tempobj = {
      Start_Date : start,
      End_Date	 : end,
      Cost_Cent_ID : this.objBrowseData.Cost_Cent_ID ? this.objBrowseData.Cost_Cent_ID : 0,
      }
      const obj = {
      "SP_String": this.SPString,
      "Report_Name_String": "BL_Txn_Branch_Browse",
      "Json_Param_String": JSON.stringify([tempobj])
      }
      this.GlobalAPI.getData(obj).subscribe((data:any)=>{
       //console.log(data)
       this.BranchRequisitionBrowseFormSubmit = false
       if(data.length){
        this.DynamicHeader = Object.keys(data[0])
        this.getAllDataList = data
       }

      })
    }
   
  }
  SaveBranchReq(){
    if(this.AddBranchReqList.length){
      this.SaveSpinner = true
      this.AddBranchReqList.forEach(ele => {
        ele.Delivery_Remarks = ""
        ele.Fin_Year_ID = this.$CompacctAPI.CompacctCookies.Fin_Year_ID
        ele.Product_Remarks = ele.Product_Remarks ? ele.Product_Remarks : "NA"
      });
      const obj = {
        "SP_String": this.SPString,
        "Report_Name_String": this.DOCNo ?"BL_Txn_Branch_Edit": "BL_Txn_Branch_Create",
        "Json_Param_String": JSON.stringify(this.AddBranchReqList)
        }
        this.GlobalAPI.getData(obj).subscribe((data:any)=>{
          //console.log(data)
          if(data[0].Response == "Done"){
            this.compacctToast.clear();
            this.compacctToast.add({
              key: "compacct-toast",
              severity: "success",
              summary: 'DOC No : ' + this.DOCNo,
              detail: this.DOCNo ? "Succesfully Update." : "Succesfully Create."
            });
            this.clearData();
            this.searchData(true)
            this.SaveSpinner = false;
            this.tabIndexToView =0;
          }
        })
    }
  }
  EditBranchReq(col:any){
   if(col.DOC_No){
    this.DOCNo = undefined
    this.DOCNo = col.DOC_No
    this.buttonname = "Update"
    this.items = ["BROWSE","UPDATE"];
    this.tabIndexToView = 1
    this.getEditData(col.DOC_No)

   }
  }
  getEditData(doc:any){
    const obj = {
      "SP_String": this.SPString,
      "Report_Name_String": "BL_Txn_Branch_Get",
      "Json_Param_String": JSON.stringify([{DOC_No : doc}])
      }
      this.GlobalAPI.getData(obj).subscribe((data:any)=>{
       if(data.length){
          this.ObjbranchREQ.Cost_Cent_ID = data[0].Cost_Cen_ID
          this.DocDate = new Date(data[0].DOC_Date)
          this.AddBranchReqList = data
       }
      })
  }
  DeleteBranchReq(col:any){
   if(col.DOC_No){
    this.DOCNo = undefined
    this.DOCNo = col.DOC_No
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
    if(this.DOCNo){
      const obj = {
        "SP_String": this.SPString,
        "Report_Name_String": "BL_Txn_Branch_Delete",
        "Json_Param_String": JSON.stringify([{DOC_No : this.DOCNo}])
        }
        this.GlobalAPI.getData(obj).subscribe((data:any)=>{
          if (data[0].Response === "Done"){
            this.onReject();
           this.compacctToast.clear();
           this.compacctToast.add({
             key: "compacct-toast",
             severity: "success",
             summary: "DOC No :" + this.DOCNo,
             detail: "Succesfully Deleted"
           });
           this.searchData(true);
          }
        })
    }
  }
  onReject() {
    this.compacctToast.clear('c');
  }
  UpdateBotton(col){
    //console.log("col",col)
   if(col.DOC_No){
    this.DeliveryRemarksObj = {Status: undefined , DOC_No:undefined, Remarks_From_HO:undefined}
    this.DeliveryRemarksObj = {Status: undefined , DOC_No: col.DOC_No,Remarks_From_HO:undefined}
    this.ViewProTypeModal = true
   }
  
  }
  UpdateData(){
    if(this.DeliveryRemarksObj.Status && this.DeliveryRemarksObj.DOC_No){
      const obj = {
        "SP_String": this.SPString,
        "Report_Name_String": "BL_Txn_Branch_Status_Update",
        "Json_Param_String": JSON.stringify([this.DeliveryRemarksObj])
        }
        this.GlobalAPI.getData(obj).subscribe((data:any)=>{
          if (data[0].Response === "Done"){
           this.compacctToast.clear();
           this.compacctToast.add({
             key: "compacct-toast",
             severity: "success",
             summary: "DOC No :" + this.DeliveryRemarksObj.DOC_No,
             detail: "Succesfully Update"
           });
            
           this.clearData()
           this.searchData(true)
          }
        })
    }
  }
  PodUpdate(Cool: any) {
    this.NewDoc = Cool.DOC_No;
    this.Courier_Name = Cool.Courier_Name;
    this.POD_No = Cool.POD_No;
    this.POD_Date = Cool.POD_Date;
    this.Recieve_Date = Cool.Received_On;
    this.ReciveCheck = Cool.Is_Received === "Y" ? true : false;
    this.POPform = false;
    this.ViewPoTypeModal = true; 
  }
  UpdatePOP(valid:any) {
    this.POPform = true;
    if (valid) {
      const ctobj = {
        Doc_No : this.NewDoc,
        POD_No: this.POD_No,
        POD_No_HO: this.POD_No,
        POD_Date: this.POD_Date ? this.DateService.dateConvert(this.POD_Date): null ,
        Courier_Name: this.Courier_Name,
        Is_Received: this.ReciveCheck === true ? "Y": "N",
        Received_On: this.Recieve_Date ? this.DateService.dateConvert(this.Recieve_Date) : null
      }
      this.$http.post("BL_Txn_Branch_Requisition/Update_POD", ctobj).subscribe((data: any) => {
       if(data.success == true){
            this.compacctToast.clear();
            this.compacctToast.add({
              key: "compacct-toast",
              severity: "success",
              summary: 'POD No : ' + this.POD_No,
              detail:"Succesfully Update." 
            });
         this.POPform = false;
         this.ViewPoTypeModal = false;
         this.POD_No = undefined;
         this.Courier_Name = undefined;
         this.ReciveCheck = false;
         this.Recieve_Date = new Date();
         this.POD_Date = new Date();
         this.searchData(true);
          }
      })
    }
  }
  browsePrint() {
    window.open("/Report/Crystal_Files/CRM/joh_form/Branch_Requisition.aspx", 'mywindow', 'fullscreen=yes, scrollbars=auto,width=950,height=500');
  }
}

class branchREQ{
  Cost_Cent_ID:any
    DOC_No:any
    DOC_Date:any
    Product_ID:any
    Product_Description:any
    Qty:any
    Product_Remarks:any
    Status:any
    Delivery_Remarks:any
    Created_By:any
  Fin_Year_ID: any
  Reffered_By: any
  Remarks:any
}
class BrowseData {
  From_Date: string;
  To_Date: string;
  Cost_Cent_ID : any;
  }