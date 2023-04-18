import { Component, OnInit, ViewEncapsulation, ViewChild } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { MessageService } from "primeng/api";
import { FileUpload } from "primeng/primeng";
declare var $: any;
import { IfStmt, THIS_EXPR, ThrowStmt } from "@angular/compiler/src/output/output_ast";

import { NgxUiLoaderService } from "ngx-ui-loader";
import * as XLSX from 'xlsx';
import { ActivatedRoute } from "@angular/router";
import { CompacctCommonApi } from "../../../shared/compacct.services/common.api.service";
import { CompacctGlobalApiService } from "../../../shared/compacct.services/compacct.global.api.service";
import { CompacctHeader } from "../../../shared/compacct.services/common.header.service";
import { DateTimeConvertService } from "../../../shared/compacct.global/dateTime.service";
import { CompacctProjectComponent } from "../../../shared/compacct.components/compacct.forms/compacct-project/compacct-project.component";

@Component({
  selector: 'app-harb-txn-requisition',
  templateUrl: './harb-txn-requisition.component.html',
  styleUrls: ['./harb-txn-requisition.component.css'],
  providers: [MessageService],
  encapsulation: ViewEncapsulation.None
})
export class HarbTxnRequisitionComponent implements OnInit {
  buttonname = "Create";
  Spinner = false;
  SpinnerShow = false;
  itemList:any =[];
  items:any = [];
  tabIndexToView = 0;
  menuList:any = [];
  requi_Date = new Date();
  reqiFormSubmitted = false;
  objreqi:reqi = new reqi();
  DepartmentList:any = [];
  objmaterial:material = new material()
  objproject : project = new project()
  AddMaterialsList:any = []
  requisitionmaterialFormSubmit = false;
  allRequDataList:any = [];
  allRequDataListHeader:any = [];
  costcenterList:any = [];
  GodownList:any = [];
  GodownBrowseList:any =[]
  productListview:any = []
  productList:any = []
  ReqNo = undefined;
  can_popup = false;
  act_popup = false;
  initDate:any = [];
  ObjBrowseData : BrowseData = new BrowseData ();
  RequistionSearchFormSubmit = false;
  seachSpinner = false;
  productTypeList:any = [];
  objProjectRequi:any = {};
  userType = "";
  docno : any;
  openProject = "N";
  minFromDate = new Date();
  projectDisable = false;
  projectMand = "N";
  toCostCenter:number
  headerText:string
  productFilterObj:any = {};
  validatation = {
    required : false,
    projectMand : 'N'
  }
  reqValid = false
  deleteError = false
  @ViewChild("project", { static: false })
  ProjectInput: CompacctProjectComponent;
  Save = false;
  Del = false;
  ProductCatList:any = [];
  hrYeatList:any = [];
  HR_Year_ID: any;
  ReqTypeList:any = [];
  MaterialTypeList:any = [];
  ReqType : any;
  Requisition_ID :any;
  Material_Type_ID :any;

  ObjReqStatusData : ReqStatusData = new ReqStatusData ();
  reqstatusSpinner = false;
  ReqStatusDataList:any = [];
  DynamicReqStatusDataListHeader:any = [];
  GodownReqStatusList:any = [];
  currentstocklist:any = [];
  Current_Stock:any;
  backUpReqStatusDataList:any = [];
  SelectedDistDepartment:any = [];
  SelectedDistProductType:any = [];
  DistDepartment:any = [];
  DistProductType:any = [];
  mrodisabled = false;
  reqDocNo: any;
  projectEditData:any = [];
  companyname="";

  seachSpinnerMis = false;
  MIS_start_date: Date;
  MIS_end_date: Date;
  MISList:any = [];
  DynamicHeaderforMISList:any = [];
  allTotalObj:any = {}
  BackupMISList:any = [];
  BackupMISListFilter:any = []
  SelectedDistDepartmentmis:any = [];
  SelectedDistCostCen:any = [];
  DistDepartmentmis:any = [];
  DistCostCen:any = [];
  DistStockPoint:any =[];
  SelectedDistStockPoint:any = [];

  ParameterList:any = [];
  paramlist:any = [];
  addparamlist:any = [];
  paramarr:any = [];
  objPoText:any = {}
  potextFormSubmit:boolean = false

  // Project
  projectFromSubmit:boolean = false
  ProjectList:any = []
  SiteList = [];
  groupList = [];
  subGorupList = [];
  workList = [];
  ObjCol:any = {}
  constructor(
    private $http: HttpClient,
    private commonApi: CompacctCommonApi,
    private GlobalAPI: CompacctGlobalApiService,
    private Header: CompacctHeader,
    private DateService: DateTimeConvertService,
    public $CompacctAPI: CompacctCommonApi,
    private compacctToast: MessageService,
    private route: ActivatedRoute,
    private ngxService: NgxUiLoaderService
  ) { 
    this.route.queryParams.subscribe(params => {
      //console.log(params);
      this.openProject = params['proj'];
      this.validatation.projectMand = params['mand'];
      this.projectMand = params['mand'];
      this.toCostCenter = Number(params['CostCenID']);
      this.headerText = params['Caption'];
      this.ReqType = params['ReqType'];
      
     })
  }

  ngOnInit() {
 
    $(document).prop('title', this.headerText ? this.headerText : $('title').text());
    this.items =  ["BROWSE", "CREATE", "STOCK", "STATUS", "MIS"];
    this.menuList = [
      { label: "Edit", icon: "pi pi-fw pi-user-edit" },
      { label: "Delete", icon: "fa fa-fw fa-trash" }
    ];
    this.Header.pushHeader({
      Header: this.headerText,
      Link: this.headerText
    });
    this.Finyear();
    this.ServerDate();
    this.AllowedEntryDays();
    this.getCostcenter();
    this.getRequisitionType();
    this.getMaterialType();
    this.getProductCategory();
    this.GetProductsDetalis();
    this.getProject()
    this.userType = this.$CompacctAPI.CompacctCookies.User_Type
    this.companyname = this.$CompacctAPI.CompacctCookies.Company_Name
    if(this.openProject !== "Y"){
      this.getProductType()
    }
    
  }
  TabClick(e) {
   
    this.tabIndexToView = e.index;
    this.items = ["BROWSE", "CREATE", "STOCK", "STATUS", "MIS"];
    this.buttonname = "Save";
    this.clearData();
    this.Current_Stock = undefined;
  }
  clearData(){
   this.requisitionmaterialFormSubmit = false;
    this.objmaterial = new material()
    this.objproject = new project()
    this.objreqi = new reqi();
    this.objreqi.Cost_Cen_ID = this.$CompacctAPI.CompacctCookies.Cost_Cen_ID;
    this.Getgodown(this.objreqi.Cost_Cen_ID);
    this.reqiFormSubmitted = false;
    this.AddMaterialsList = [];
    this.ReqNo = undefined;
    this.can_popup = false;
    this.act_popup = false;
    this.productListview = [];
    this.productList = [];
    this.requi_Date = new Date();
    this.validatation.required = false;
    this.projectDisable = false;
    this.reqValid = false;
    this.deleteError = false;
    this.ProductCatList = [];
    this.productTypeList = [];
    this.Requisition_ID = undefined;
    if (this.headerText === "Maintenance Indent") {
      this.Material_Type_ID = "M.R.O";
      this.mrodisabled = true;
      this.getProductCategory();
     } 
     else {
      this.Material_Type_ID = undefined;
      this.mrodisabled = false;
     }
     this.projectFromSubmit =false
     this.SiteList = [];
     this.groupList = [];
     this.subGorupList = [];
     this.workList = [];
  }
  
 
  genPoText(ParameterID?:any){
    const RequiredValue = (op:any)=>{
      if((op.Min_Value && op.Max_Value && op.Min_Value != "0" && op.Max_Value != "0")){
        if(Number(op.Min_Value) == Number(op.Max_Value)){
          return `${op.Min_Value?op.Min_Value:""} ${op.UOM}`
        }
        else {
          return `${op.Min_Value?op.Min_Value:''} to ${op.Max_Value?op.Max_Value:''} ${op.UOM}`
        }
       
      }
      if(op.Min_Value && op.Min_Value != "0"){
        return `${op.Min_Value} ${op.UOM}`
      }
      if(op.Max_Value && op.Max_Value != "0"){
        return `${op.Max_Value} ${op.UOM}`
      }
      return ''
    }
    const ToleranceLevel = (op:any)=>{
      if(op.Max_Tolerance_Level || op.Min_Tolerance_Level){
        if(op.Max_Tolerance_Level == op.Min_Tolerance_Level){
          return ` ${op.Max_Tolerance_Level && op.Max_Tolerance_Level != '0'? '(+/-'+op.Max_Tolerance_Level+')' : ""} `
         }
         else {
           return `(${op.Min_Tolerance_Level && op.Min_Tolerance_Level != '0'? '+'+op.Min_Tolerance_Level+'% ' : ''} ${op.Max_Tolerance_Level && op.Max_Tolerance_Level != '0' ? '-'+op.Max_Tolerance_Level+'% ': ''})`
         }
        
      }
      else {
          return ""
      }
       
      }
      if(ParameterID){
        this.ParameterList.forEach((xy:any) => {
          if(ParameterID == xy.Parameter_ID){
            xy['PO_Text'] = `${xy.Parameter_Name} - ${RequiredValue(xy)} ${ToleranceLevel(xy)}`
          }
         });
      }
      else{
        this.ParameterList.forEach((xy:any) => {
         xy['PO_Text'] = `${xy.Parameter_Name} - ${RequiredValue(xy)} ${ToleranceLevel(xy)}`
        });
      }
    
  }
  editpotext(obj:any){
   if(Object.keys(obj).length != 0){
    this.objPoText = {...obj}
    this.compacctToast.clear();
    this.compacctToast.add({
      key: "potext",
      sticky: true,
      severity: "info",
      summary: "Are you sure?",
      detail: "Confirm to proceed"
    });
   }
  }
  
  potextEdit(valid:any){
    this.potextFormSubmit = true
    if(valid){
      this.ParameterList.forEach((yx:any) => {
        if(Number(yx.Parameter_ID) == Number(this.objPoText.Parameter_ID)){
          yx['PO_Text'] = this.objPoText.PO_Text
        }
     });
     this.potextFormSubmit = false
     this.compacctToast.clear("potext");
    }
  
  }

  addMaterials(valid,validProject){
  //console.log("valid",valid);
  this.requisitionmaterialFormSubmit = true;
  this.projectFromSubmit =true
  this.reqValid = true
  if(valid && validProject && this.GetSameProduct()){
     if(this.projectMand == 'Y' && (Number(this.productFilterObj.Can_Be_Used_Qty)< Number(this.objmaterial.Req_Qty) || 0 == Number(this.objmaterial.Req_Qty))){
      this.reqValid = true
      return
     }
     else{
      this.reqValid = false
     }
     
    const productFilter:any = this.productListview.filter((el:any)=>Number(el.Product_ID) === Number(this.objmaterial.Product_ID));
    const productTypeFilter:any = this.productTypeList.filter((el:any)=> Number(el.Product_Type_ID) === Number(this.objmaterial.Product_Type_ID));
    const SiteListFilter:any = this.SiteList.filter((el:any)=>Number(el.Site_ID) === Number(this.objproject.SITE_ID));
    const groupListFilter:any = this.groupList.filter((el:any)=>Number(el.Budget_Group_ID) === Number(this.objproject.Budget_Group_ID));
    const subGorupListFilter:any = this.subGorupList.filter((el:any)=>Number(el.Budget_Sub_Group_ID) === Number(this.objproject.Budget_Sub_Group_ID));
    const workListFilter:any = this.workList.filter((el:any)=>Number(el.Work_Details_ID) === Number(this.objproject.Work_Details_ID));
    this.paramarr = [];
    if(productFilter.length){
      this.AddMaterialsList.push({
        Product_ID: this.objmaterial.Product_ID,
        Product_Description: productFilter[0].Product_Description,
        Product_Code: productFilter[0].Product_Code,
        Req_Qty: this.objmaterial.Req_Qty,
        UOM: this.objmaterial.UOM,
        Purpose: this.objmaterial.Purpose,
        Created_By: this.$CompacctAPI.CompacctCookies.User_ID,
        Product_Type_ID : this.objmaterial.Product_Type_ID,
        Product_Type : productTypeFilter[0].Product_Type,
        Product_Category : this.objmaterial.Product_Category,
        Challan_No : null,
        PROJECT_ID: this.objproject.PROJECT_ID,
        SITE_ID: this.objproject.SITE_ID,
        Site_Description : SiteListFilter.length ? SiteListFilter[0].Site_Description : "",			
        Budget_Group_ID: this.objproject.Budget_Group_ID,
        Budget_Group_Name: groupListFilter.length ? groupListFilter[0].Budget_Group_Name : "",
        Budget_Sub_Group_ID: this.objproject.Budget_Sub_Group_ID,
        Budget_Sub_Group_Name : subGorupListFilter.length ? subGorupListFilter[0].Budget_Sub_Group_Name : "",
        Work_Details_ID	: this.objproject.Work_Details_ID,
        Work_Details: workListFilter.length ? workListFilter[0].Work_Details : ""

      })
      this.requisitionmaterialFormSubmit = false;
      this.objmaterial = new material();
      this.Current_Stock = undefined;
      this.productList = [];
      this.productListview = [];
      this.projectDisable = true;
      this.reqValid = false
      this.productFilterObj = {};
      this.projectFromSubmit = false
      console.log("AddMaterialsList",this.AddMaterialsList)
    }
  
  }
  }
  GetSameProduct () {
    const sameproduct = this.AddMaterialsList.filter(item=> Number(item.Product_ID) === Number(this.objmaterial.Product_ID) );
    if(sameproduct.length) {
      this.compacctToast.clear();
          this.compacctToast.add({
            key: "compacct-toast",
            severity: "error",
            summary: "Warn Message",
            detail: "Same Product Can't be Added."
          });
      return false;
    } else {
      return true;
    }
  }
  SaveRequi(valid){ 
  this.reqiFormSubmitted = true;
   this.validatation.required = true;
    console.log("Valid",valid)
   this.Save = false;
   this.Del = false;
   if(valid){
     if(this.AddMaterialsList.length){
      this.Save = true;
      this.Del = false;
      this.Spinner = true;
      this.ngxService.start();
     this.compacctToast.clear();
     this.compacctToast.add({
       key: "c",
       sticky: true,
       closable: false,
       severity: "warn",
       summary: "Are you sure?",
       detail: "Confirm to proceed"
     });
      }
     else{
      this.Spinner = false;
      this.ngxService.stop();
      this.compacctToast.add({
        key: "compacct-toast",
        severity: "error",
        summary: "Warn Message",
        detail: "Error Occured "
      });
     }
   }
  }
  onConfirmSave(){
      let saveData:any = [];
       const consCenterFilter:any = this.costcenterList.filter((el:any)=> Number(el.Cost_Cen_ID) === Number(this.objreqi.Cost_Cen_ID))
        this.AddMaterialsList.forEach((el:any)=>{
        let save = {
         Req_No: this.reqDocNo ? this.reqDocNo : "A",
         Req_Date: this.requi_Date ? this.DateService.dateConvert(new Date(this.requi_Date)) : new Date(),
         Cost_Cen_ID: Number(this.objreqi.Cost_Cen_ID),
         Cost_Cen_Name: consCenterFilter[0].Cost_Cen_Name,
         Product_ID: Number(el.Product_ID),
         Product_Description: el.Product_Description,
         Req_Qty: Number(el.Req_Qty),
         UOM: el.UOM,
         Purpose: el.Purpose,
         Created_By: el.Created_By ? el.Created_By : this.$CompacctAPI.CompacctCookies.User_ID,
         Godown_ID: this.objreqi.Godown_ID,
         Product_Type_ID : Number(el.Product_Type_ID),
         Product_Type : el.Product_Type,
         Type_Of_Product : el.Product_Category,
         To_Cost_Cen_ID : Number(this.toCostCenter),
         Remarks : this.objreqi.Remarks,
         Requisiton_Type : this.Requisition_ID,
         Material_Type : this.Material_Type_ID,
         Challan_No : el.Challan_No,
         Parameter_Details : el.Parameter_Details,
         PROJECT_ID	:el.PROJECT_ID,
         SITE_ID:el.SITE_ID,
         Budget_Group_ID:el.Budget_Group_ID,
         Budget_Sub_Group_ID:el.Budget_Sub_Group_ID,
         Work_Details_ID:el.Work_Details_ID
        }
        saveData.push(save)
        })
     
        const obj = {
         "SP_String": "SP_Txn_Requisition",
         "Report_Name_String": "Create_Requisition",
         "Json_Param_String": JSON.stringify(saveData),
        }
       this.GlobalAPI.getData(obj).subscribe(async (data:any)=>{
        this.docno = data[0].Column1;
         if(data[0].Column1){
          var mgs = this.buttonname === "Save" ? "Save" : "Update"
             this.ngxService.stop();
            this.compacctToast.clear();
             this.compacctToast.add({
             key: "compacct-toast",
             severity: "success",
             summary: "Requisition No: " +data[0].Column1,
             detail: "Succesfully " + mgs
           });
           this.Print(data[0].Column1)
            this.clearData();
            this.Requisition_ID = undefined;
            this.Material_Type_ID = undefined;
            this.Spinner = false;
            this.searchData(true);
            this.tabIndexToView = 0;
            this.items = ["BROWSE", "CREATE", "STOCK", "STATUS", "MIS"];
            this.buttonname = "Save";
            this.reqDocNo = undefined;
            } else{
              this.Spinner = false;
              this.ngxService.stop();
              this.compacctToast.add({
              key: "compacct-toast",
              severity: "error",
              summary: "Warn Message",
              detail: "Something Wrong"
            });
         }
       })
  
     
  }
 
   checkreq(){
    let flg = false
    if(this.openProject === "Y" && this.projectMand === "Y"){
      let getArrValue = Object.values(this.objProjectRequi);
     if(getArrValue.indexOf(undefined) == -1){
        if(getArrValue.length === 5 || getArrValue.length > 5){
          flg = true
        }
        else {
          flg = false
        }
      }
      else {
        flg = false
      }
    }
    else {
      flg = true
    }
    return flg
   }
  SaveNPrintBill() {
    if (this.docno) {
      window.open("/Report/Crystal_Files/MICL/Txn_Requisition_Print.aspx?DocNo=" + this.docno, 'mywindow', 'fullscreen=yes, scrollbars=auto,width=950,height=500'
  
      );
    }
    // console.log('Doc_No ==', this.Objcustomerdetail.Bill_No)
  }
  delete(i){
    this.AddMaterialsList.splice(i,1);
    this.projectDisable = this.AddMaterialsList.length ? true : false
  }
  onReject(){
    this.compacctToast.clear("c");
    this.Spinner = false;
    this.ngxService.stop();
    this.deleteError = false;
  }
  getCostcenter(){
   const obj = {
      "SP_String": "SP_Txn_Requisition",
      "Report_Name_String": "Get_Cost_Center",
    }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      //console.log("costcenterList  ===",data);
     this.costcenterList = data;
     this.objreqi.Cost_Cen_ID = this.costcenterList.length ? this.$CompacctAPI.CompacctCookies.Cost_Cen_ID : undefined;
     this.ObjBrowseData.Cost_Cen_ID = this.costcenterList.length ? this.$CompacctAPI.CompacctCookies.Cost_Cen_ID : undefined;
     this.ObjReqStatusData.Cost_Cen_ID = this.costcenterList.length ? this.$CompacctAPI.CompacctCookies.Cost_Cen_ID : undefined;
      this.Getgodown(this.objreqi.Cost_Cen_ID);
     this.GetgodownBrowse(this.ObjBrowseData.Cost_Cen_ID);
     this.GetgodownReqStatus(this.ObjReqStatusData.Cost_Cen_ID);
     this.searchData()
  })
  }
  Getgodown(CostID,edit?){
    this.GodownList = [];
    if(CostID){
      const obj = {
        "SP_String": "SP_Txn_Requisition",
        "Report_Name_String": "Get_Cost_Center_Godown",
        "Json_Param_String": JSON.stringify([{Cost_Cen_ID : CostID}])
      }
      this.GlobalAPI.getData(obj).subscribe((data:any)=>{
        this.GodownList = data;
        if(edit){
          this.objreqi.Godown_ID = edit;
        }
        else{
          this.objreqi.Godown_ID = this.GodownList.length === 1 ? this.GodownList[0].Godown_ID : undefined;
        }
        
        //console.log("this.toGodownList",this.GodownList);
        })
    }
    else{
      // this.GodownList = [];
      this.objreqi.Godown_ID =undefined;
    }

   
  }
  GetgodownBrowse(CostID){
    if(CostID){
      this.GodownBrowseList = [];
      const obj = {
        "SP_String": "SP_Txn_Requisition",
        "Report_Name_String": "Get_Cost_Center_Godown",
        "Json_Param_String": JSON.stringify([{Cost_Cen_ID : CostID}])
  
      }
      this.GlobalAPI.getData(obj).subscribe((data:any)=>{
        this.GodownBrowseList = data;
        //console.log("this.GodownBrowseList",this.GodownBrowseList);
        // if(this.headerText === "Purchase Indent") {
        this.ObjBrowseData.Godown_ID = this.GodownBrowseList.length ? this.GodownBrowseList[0].Godown_ID : undefined
        this.searchData()
        // }
        })
    }
    else{
      this.GodownBrowseList = [];
      this.ObjBrowseData.Godown_ID = undefined;
    }

   
  }
  GetgodownReqStatus(CostID){
    if(CostID){
      this.GodownReqStatusList = [];
      const obj = {
        "SP_String": "SP_Txn_Requisition",
        "Report_Name_String": "Get_Cost_Center_Godown",
        "Json_Param_String": JSON.stringify([{Cost_Cen_ID : CostID}])
  
      }
      this.GlobalAPI.getData(obj).subscribe((data:any)=>{
        this.GodownReqStatusList = data;
        //console.log("this.GodownReqStatusList",this.GodownReqStatusList);
        // if(this.headerText === "Purchase Indent") {
        this.ObjReqStatusData.Godown_ID = this.GodownReqStatusList.length ? this.GodownReqStatusList[0].Godown_ID : undefined
        this.searchData()
        // }
        })
    }
    else{
      this.GodownBrowseList = [];
      this.ObjBrowseData.Godown_ID = undefined;
    }

   
  }
  getRequisitionType(){
    const obj = {
      "SP_String": "SP_Txn_Requisition",
      "Report_Name_String": "Get_Requisiton_Type"
    }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      this.ReqTypeList = data;
     //console.log("ReqTypeList",this.ReqTypeList);
     })
  }
  getMaterialType(){
    const obj = {
      "SP_String": "SP_Txn_Requisition",
      "Report_Name_String": "Get_Material_Type"
    }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
       var materiallist = data;
       if (this.headerText === "Maintenance Indent") {
        this.MaterialTypeList = materiallist;
        this.Material_Type_ID = "M.R.O";
        this.mrodisabled = true;
        this.getProductCategory();
     } 
     else {
      var matdata = materiallist.filter(function(value){
        return value.Material_Type != "M.R.O";
      });
      this.MaterialTypeList = matdata;
      this.Material_Type_ID = undefined;
      this.mrodisabled = false;
     }
     })
  }
  getProductCategory(){
    this.ProductCatList = [];
    const obj = {
      "SP_String": "SP_Txn_Requisition",
      "Report_Name_String": "Get_Type_Of_Product",
      "Json_Param_String": JSON.stringify([{Material_Type : this.Material_Type_ID}])
    }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      this.ProductCatList = data;
     //console.log("ProductCatList",this.ProductCatList);
     })
  }
  getProductType(){
    this.productTypeList = [];
    this.productListview = [];
    this.productList = [];
   const tempobj = {...this.objmaterial}
   this.objmaterial = new material()
   this.objmaterial.Product_Type_ID = tempobj.Product_Type_ID
  this.objmaterial.Product_Category = tempobj.Product_Category
    if(Object.keys(this.objproject).length == 5 && this.objmaterial.Product_Category){
      const materialtype = {
        Type_Of_Product : this.objmaterial.Product_Category
      }
      const obj = {
        "SP_String": "SP_Txn_Requisition",
        "Report_Name_String": "Get_product_Type_Details",
        "Json_Param_String": JSON.stringify({...this.objproject,...materialtype}) 
                             
      }
      this.GlobalAPI.getData(obj).subscribe((data:any)=>{
        data.forEach(el => {
          el['label'] = el.Product_Type
          el['value'] = el.Product_Type_ID
        });
         
        this.productTypeList = data;
       })
    }
  
  }

  GetProductsDetalis(){
    this.productListview = [];
    this.productList = [];
    const tempobj = {...this.objmaterial}
    this.objmaterial = new material()
    this.objmaterial.Product_Type_ID = tempobj.Product_Type_ID
    this.objmaterial.Product_ID = tempobj.Product_ID
    this.objmaterial.Product_Category = tempobj.Product_Category
    if(this.objmaterial.Product_Type_ID && Object.keys(this.objproject).length == 5){
      let reportname = '';
      if(this.headerText === "Maintenance Indent") {
        reportname = "Get_product_Details_MRO";
      }
      else {
        reportname = "Get_product_Details";
      }
      const obj = {
        "SP_String": "SP_Txn_Requisition",
        "Report_Name_String": reportname,
        "Json_Param_String":  JSON.stringify([{...this.objproject,...{Product_Type_ID : Number(this.objmaterial.Product_Type_ID)}}])
      }
      this.GlobalAPI.getData(obj).subscribe((data:any)=>{
        this.productListview = data;
        console.log("productListview",data)
        this.productListview.forEach(el => {
          this.productList.push({
            label: el.Product_Description,
            value: el.Product_ID
          });
        });
      })
    }
    else {
      this.productListview = [];
      this.productList = [];
      this.objmaterial.Product_ID = undefined;
    }
 
  }
  getUOM(){
    if(this.objmaterial.Product_ID){
      const ProductFilter = this.productListview.filter((el:any)=> Number(el.Product_ID) === Number(this.objmaterial.Product_ID))
       this.productFilterObj = ProductFilter[0];
       console.log("productFilterObj",this.productFilterObj)
       this.objmaterial.UOM = ProductFilter[0].UOM
     }
    else {
      this.productFilterObj = {}
    }
  }
 
  reqiValid(id:any){
   if(id || Number(id) == 0){
    if(this.projectMand == 'Y' && (Number(this.productFilterObj.Can_Be_Used_Qty)< Number(this.objmaterial.Req_Qty) || 0 == Number(this.objmaterial.Req_Qty))){
      this.reqValid = true
    }
    else{
      this.reqValid = false
    }
   }
   else{
    this.reqValid = true
   }
  }
  getConfirmDateRange(dateRangeObj) {
    if (dateRangeObj.length) {
      this.ObjBrowseData.From_Date = dateRangeObj[0];
      this.ObjBrowseData.To_Date = dateRangeObj[1];
    }
  }
  searchData(valid?){
    this.RequistionSearchFormSubmit = true;
    this.seachSpinner = true
      const tempDate = {
        From_Date :this.ObjBrowseData.From_Date
        ? this.DateService.dateConvert(new Date(this.ObjBrowseData.From_Date))
        : this.DateService.dateConvert(new Date()),
        To_Date :this.ObjBrowseData.To_Date
        ? this.DateService.dateConvert(new Date(this.ObjBrowseData.To_Date))
        : this.DateService.dateConvert(new Date()),
        Cost_Cen_ID :this.ObjBrowseData.Cost_Cen_ID ? this.ObjBrowseData.Cost_Cen_ID : 0,
        Godown_ID : this.ObjBrowseData.Godown_ID ? this.ObjBrowseData.Godown_ID : 0,
        proj : this.openProject ? this.openProject : "N",
        To_Cost_Cen_ID : this.toCostCenter,
        Material_Type : this.headerText === "Maintenance Indent" ? 'MRO' : '',
        Created_By : this.$CompacctAPI.CompacctCookies.User_ID
      }
      const obj = {
        "SP_String": "SP_Txn_Requisition",
        "Report_Name_String": "Browse_Requisition",
        "Json_Param_String": JSON.stringify([tempDate])
      }
      this.GlobalAPI.getData(obj).subscribe((data:any)=>{
        this.allRequDataList = data;
        if(this.allRequDataList.length){
          this.allRequDataListHeader= Object.keys(data[0])
        }
        this.RequistionSearchFormSubmit = false;
        this.seachSpinner = false
        //console.log("this.allRequDataList",this.allRequDataList);
      })
  
 
  }
  headerChange(header:any){
  return header === "Req_No" ? this.headerText+" No" : header.replaceAll('_',' ')
  }
  Active(col){
    //console.log("col",col);
    this.can_popup = false;
    this.Del = false;
    this.Save = false;
     if(col.Req_No){
      this.act_popup = true;
      this.ReqNo = undefined;
      this.Del = true;
      this.Save = false;
       this.ReqNo = col.Req_No;
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

  onConfirm2(){
   if(this.ReqNo){
     const obj = {
          "SP_String": "SP_Txn_Requisition",
          "Report_Name_String": "Cancel_Requisition",
          "Json_Param_String": JSON.stringify([{Req_No : this.ReqNo,Created_By : this.$CompacctAPI.CompacctCookies.User_ID}])
        }
        this.GlobalAPI.getData(obj).subscribe((data:any)=>{
        if (data[0].Column1 === "Done"){
           this.onReject();
           this.act_popup = false;
            this.compacctToast.clear();
            this.compacctToast.add({
              key: "compacct-toast",
              severity: "success",
              summary: "Requisition No: " + this.ReqNo.toString(),
              detail: "Succesfully Deleted"
            });
           this.ReqNo = undefined;
           this.searchData(true)
          }
          else {
            this.onReject();
            this.deleteError = true;
            this.compacctToast.clear();
            this.compacctToast.add({
              key: "c", 
              sticky: true,
              closable: false,
              severity: "warn", // "info",
              summary: data[0].Column1,
              // detail: data[0].Column1
            });
           this.ReqNo = undefined;
           this.searchData(true)
          }
        })
      }
      //this.ParamFlaghtml = undefined;
  }
 
  getPrint(obj) {  
    if (obj.Req_No) { 
    window.open('/Report/Crystal_Files/MICL/Txn_Requisition_Print.aspx?DocNo=' + obj.Req_No,
      'mywindow', 'fullscreen=yes, scrollbars=auto,width=950,height=500');   
}
  }
  getProjectData(e){
    //console.log("e",e)
    this.objproject = e
    this.objproject.Budget_Group_ID = Number(e.Budget_Group_ID)
    this.objproject.Budget_Sub_Group_ID = Number(e.Budget_Sub_Group_ID)
    this.objProjectRequi = e
    let temparr = Object.keys(this.objProjectRequi)
    if(temparr.indexOf("PROJECT_ID") != -1 && temparr.indexOf("Budget_Group_ID") != -1 && temparr.indexOf("Budget_Sub_Group_ID") != -1 && temparr.indexOf("SITE_ID") != -1 && temparr.indexOf("Work_Details_ID") != -1){
      this.getProductType();
     }
     else{
      this.objmaterial.Product_Type_ID = undefined;
      this.objmaterial.Product_ID = undefined;
      this.productTypeList = [];
      this.productList = [];
     }
  }
  whateverCopy(obj) {
    return JSON.parse(JSON.stringify(obj))
  }
  showTost(msg,summary){
    this.compacctToast.clear();
    this.compacctToast.add({
      key: "compacct-toast",
      severity: "success",
      summary: summary,
      detail: "Succesfully "+msg
    });
  }
  async SaveProject(docNo){
    if(docNo){
    this.objproject.DOC_NO = docNo,
    this.objproject.DOC_TYPE = "REQUISITION",
    this.objproject.DOC_DATE = this.DateService.dateConvert(this.requi_Date)
    }
    const obj = {
    "SP_String": "SP_BL_CRM_TXN_Project_Doc",
    "Report_Name_String": "Create_BL_CRM_TXN_Project_Doc",
    "Json_Param_String": JSON.stringify([this.objproject]) 
    }
    const projectData = await  this.GlobalAPI.getData(obj).toPromise();
    //console.log("projectData",projectData);
    return projectData
  }
  //Edit
  Edit(col){
    this.clearData();
    this.reqDocNo = undefined;
    if(col.Req_No){
      this.reqDocNo = col.Req_No;
      this.tabIndexToView = 1;
      this.items = ["BROWSE", "UPDATE", "STOCK", "STATUS", "MIS"];
      this.buttonname = "Update";
      this.geteditmaster(col.Req_No);
      if(this.openProject === "Y"){
        this.getEditProject(col.Req_No);
      }
     
     }
  }
  geteditmaster(Dno){
    const obj = {
      "SP_String": "SP_Txn_Requisition",
      "Report_Name_String": "Get_Requistion_Details_For_Edit",
      "Json_Param_String": JSON.stringify([{Req_No : Dno}])
   }
    this.GlobalAPI.getData(obj).subscribe((res:any)=>{
      let data = JSON.parse(res[0].Column1)
      //console.log("Edit data",data);
      this.requi_Date = new Date(data[0].Req_Date);
      this.objreqi = data[0];
      this.Getgodown(data[0].Cost_Cen_ID,data[0].Godown_ID);
      // this.objreqi.Godown_ID = data[0].Godown_ID;
      this.Requisition_ID = data[0].Requisiton_Type;
      this.Material_Type_ID = data[0].Material_Type;
      // this.objmaterial = data[0];
      this.getProductCategory();
      // this.objmaterial.Product_Category = data[0].Type_Of_Product;
      this.getProductType();
      // this.objmaterial.Product_Type_ID = data[0].Product_Type_ID;
      this.GetProductsDetalis();
      // this.objmaterial.Product_ID = data[0].Product_ID;
      this.getUOM();
      this.Current_Stock = data[0].Current_Stock;
      // this.getreq();
      // this.AddMaterialsList = data[0];
      data.forEach(element => {
        const  productObj = {
           //ID : element.ID,
           Product_Category : element.Type_Of_Product,
           Product_Type : element.Product_Type,
           Product_ID : element.Product_ID,
           Product_Description : element.Product_Description,
           Product_Code :  element.Product_Code,
           Req_Qty : Number(element.Req_Qty),
           UOM :  element.UOM,
           Purpose : element.Purpose,
           Challan_No : element.Challan_No,
           Parameter_Details : element.Parameter_Details
         };
          this.AddMaterialsList.push(productObj);
        });
      // this.AddTermList = data[0].Term_element ? data[0].Term_element : [] ;
      // console.log("addPurchaseList",this.addPurchaseList)
    })
  }
  getEditProject(DocNo){
    if(DocNo){
      const obj = {
        "SP_String": "SP_BL_CRM_TXN_Project_Doc",
        "Report_Name_String": "Get_BL_CRM_TXN_Project_Doc",
        "Json_Param_String": JSON.stringify([{DOC_NO : DocNo}]) 
       }
       this.GlobalAPI.getData(obj).subscribe((data:any)=>{
         this.projectEditData = data
         // console.log("this.projectEditData",this.projectEditData);
         
          this.ProjectInput.ProjectEdit(this.projectEditData)
         
          })
    }
  }

  ServerDate(){
    this.$http
    .get("/common/Get_Server_Date")
    .subscribe((data: any) => {
     //console.log("ServerDate",data)
     this.requi_Date  = new Date(data)
     
    })
  }
  AllowedEntryDays(){
    this.$http
    .get("/Common/Get_Allowed_Entry_Days?User_ID=" + this.$CompacctAPI.CompacctCookies.User_ID)
    .subscribe((rec: any) => {
      //console.log("AllowedEntryDays",rec)
     let data = JSON.parse(rec)
      let days = Number(data[0].Allowed_Entry_Day)
      //console.log("days",days)
     this.minFromDate = new Date(this.requi_Date.getTime()-(days*24*60*60*1000));
     //console.log("minFromDate",this.minFromDate)
      
    })
  }
  Print(DocNo) {
    if(DocNo) {
    const objtemp = {
      "SP_String": "SP_Txn_Requisition",
      "Report_Name_String": "Requisition_Print"
      }
    this.GlobalAPI.getData(objtemp).subscribe((data:any)=>{
      var printlink = data[0].Column1;
      window.open(printlink+"?Doc_No=" + DocNo, 'mywindow', 'fullscreen=yes, scrollbars=auto,width=950,height=500');
    })
    }
  }
   Finyear() {
      this.$http
        .get("Common/Get_Fin_Year_Date?Fin_Year_ID=" + this.$CompacctAPI.CompacctCookies.Fin_Year_ID)
        .subscribe((res: any) => {
        let data = JSON.parse(res)
        // this.vouchermaxDate = new Date(data[0].Fin_Year_End);
        // this.voucherminDate = new Date(data[0].Fin_Year_Start);
        // this.voucherdata = new Date().getMonth() > new Date(data[0].Fin_Year_End).getMonth() ? new Date() : new Date(data[0].Fin_Year_End)
       this.initDate =  [new Date(data[0].Fin_Year_Start) , new Date(data[0].Fin_Year_End)]
        });
    }
    getReStatsuDateRange(dateRangeObj) {
      if (dateRangeObj.length) {
        this.ObjReqStatusData.From_Date = dateRangeObj[0];
        this.ObjReqStatusData.To_Date = dateRangeObj[1];
      }
    }
    GetRequisitionStatusData(){
      // this.RequistionSearchFormSubmit = true;
      this.reqstatusSpinner = true
        const tempDate = {
          From_Date :this.ObjReqStatusData.From_Date
          ? this.DateService.dateConvert(new Date(this.ObjReqStatusData.From_Date))
          : this.DateService.dateConvert(new Date()),
          To_Date :this.ObjReqStatusData.To_Date
          ? this.DateService.dateConvert(new Date(this.ObjReqStatusData.To_Date))
          : this.DateService.dateConvert(new Date()),
          // Cost_Cen_ID :this.ObjReqStatusData.Cost_Cen_ID ? this.ObjReqStatusData.Cost_Cen_ID : 0,
          // Godown_ID : this.ObjReqStatusData.Godown_ID ? this.ObjReqStatusData.Godown_ID : 0,
          proj : this.openProject ? this.openProject : "N",
          To_Cost_Cen_ID : this.toCostCenter
        }
        let ReportName = "";
        if (this.headerText === "Purchase Indent") {
          ReportName = "Get_Purchase_Indent_Status";
        }
        else if (this.headerText === "Issue Requisition") {
          ReportName = "Get_Issue_Requisition_Status";
        }
        else {
          ReportName = "Get_MRO_Indent_Status";
        }
        const obj = {
          "SP_String": "SP_Txn_Requisition",
          "Report_Name_String": ReportName,
          "Json_Param_String": JSON.stringify([tempDate])
        }
        this.GlobalAPI.getData(obj).subscribe((data:any)=>{
          this.ReqStatusDataList = data;
          if(this.ReqStatusDataList.length){
            this.DynamicReqStatusDataListHeader= Object.keys(data[0])
          }
          // this.RequistionSearchFormSubmit = false;
          this.backUpReqStatusDataList = data;
          this.GetDistinctStatus();
          this.reqstatusSpinner = false
          //console.log("this.ReqStatusDataList",this.ReqStatusDataList);
        })
    
   
    }
    exportexcel(Arr,fileName): void {
      const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(Arr);
      const workbook: XLSX.WorkBook = {Sheets: {'data': worksheet}, SheetNames: ['data']};
      XLSX.writeFile(workbook, fileName+'.xlsx');
    }
    FilterDistStatus() {
      let department:any = [];
      let producttype:any = [];
      let SearchFieldsStatus:any =[];
    if (this.SelectedDistDepartment.length) {
      SearchFieldsStatus.push('Dept_Name');
      department = this.SelectedDistDepartment;
    }
    if (this.SelectedDistProductType.length) {
      SearchFieldsStatus.push('Product_Type');
      producttype = this.SelectedDistProductType;
    }
    this.ReqStatusDataList = [];
    if (SearchFieldsStatus.length) {
      let LeadArr = this.backUpReqStatusDataList.filter(function (e) {
        return (department.length ? department.includes(e['Dept_Name']) : true)
        && (producttype.length ? producttype.includes(e['Product_Type']) : true)
      });
    this.ReqStatusDataList = LeadArr.length ? LeadArr : [];
    } else {
    this.ReqStatusDataList = [...this.backUpReqStatusDataList] ;
    }
    }
    GetDistinctStatus() {
      let department:any = [];
      let producttype:any = [];
      this.DistDepartment =[];
      this.SelectedDistDepartment =[];
      this.DistProductType =[];
      this.SelectedDistProductType =[];
      this.ReqStatusDataList.forEach((item) => {
    if (department.indexOf(item.Dept_Name) === -1) {
      department.push(item.Dept_Name);
      this.DistDepartment.push({ label: item.Dept_Name, value: item.Dept_Name });
      }
     if (producttype.indexOf(item.Product_Type) === -1) {
      producttype.push(item.Product_Type);
     this.DistProductType.push({ label: item.Product_Type, value: item.Product_Type });
     }
    });
       this.backUpReqStatusDataList = [...this.ReqStatusDataList];
    }

    // PENDING INDENT
getDateRangeMis(dateRangeObj) {
  if (dateRangeObj.length) {
    this.MIS_start_date = dateRangeObj[0];
    this.MIS_end_date = dateRangeObj[1];
  }
}
GetMIS(){
    // this.PendingIndentFormSubmitted = true;
    this.seachSpinnerMis = true;
    const start = this.MIS_start_date
    ? this.DateService.dateConvert(new Date(this.MIS_start_date))
    : this.DateService.dateConvert(new Date());
    const end = this.MIS_end_date
    ? this.DateService.dateConvert(new Date(this.MIS_end_date))
    : this.DateService.dateConvert(new Date());
    if (start && end) {
    const tempobj = {
     From_Date : start,
     To_Date : end,
    //  To_Cost_Cen_ID : this.ObjPendingIndent.Cost_Cen_ID,
    //  proj : "N"
    }
    // if (valid) {
    const obj = {
      "SP_String": "SP_MICL_Dispatch_Challan",
      "Report_Name_String": "Dispatch_MIS",
      "Json_Param_String": JSON.stringify([tempobj])
      }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      this.MISList = data;
      this.BackupMISList = data;
      this.BackupMISListFilter = data;
      // this.GetDistinctMis();
      this.GetDeptDist()
      this.GetCostCenterDist()
      this.getStockPoint()
      if(this.MISList.length){
        this.DynamicHeaderforMISList = Object.keys(data[0]);
      }
      else {
        this.DynamicHeaderforMISList = [];
      }
      this.seachSpinnerMis = false;
      this.TotalValue(this.MISList);
      // console.log("DynamicHeaderforMISList",this.DynamicHeaderforMISList);
    })
    }
    else {
      this.seachSpinnerMis = false;
      // this.ngxService.stop();
      this.compacctToast.clear();
        this.compacctToast.add({
          key: "compacct-toast",
          severity: "error",
          summary: "Warn Message",
          detail: "Something Wrong"
        });
    }
}
exportexcelmis(Arr,fileName): void {
  const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(Arr);
  const workbook: XLSX.WorkBook = {Sheets: {'data': worksheet}, SheetNames: ['data']};
  XLSX.writeFile(workbook, fileName+'.xlsx');
}
FilterDistMis(v:any) {
  let department:any = [];
  let costcen:any = [];
  let stockpoint:any = [];
  let SearchFieldsMis:any =[];
if (this.SelectedDistDepartmentmis.length) {
  SearchFieldsMis.push('Dept_Name');
  department = this.SelectedDistDepartmentmis;
  console.log("department",department)
}
if (this.SelectedDistCostCen.length) {
  SearchFieldsMis.push('Cost_Cen_Name');
  costcen = this.SelectedDistCostCen;
}
if (this.SelectedDistStockPoint.length) {
  SearchFieldsMis.push('Stock_Point');
  stockpoint = this.SelectedDistStockPoint;
}
this.MISList = [];
console.log("SearchFieldsMis",SearchFieldsMis)
console.log("BackupMISList",this.BackupMISList)
if (SearchFieldsMis.length) {
  let LeadArr = this.BackupMISList.filter(function (e) {
    return (department.length ? department.includes(e['Dept_Name']) : true)
    && (costcen.length ? costcen.includes(e['Cost_Cen_Name']) : true)
    && (stockpoint.length ? stockpoint.includes(e['Stock_Point']) : true)
  });
  console.log("LeadArr",LeadArr)
this.MISList = LeadArr.length ? LeadArr : [];

} else {
this.MISList = [...this.BackupMISList] ;
}
this.TotalValue(this.MISList);
if(v === "Dept_Name"){
  this.getStockPoint()
  this.GetCostCenterDist()
  
}
if(v === "Cost_Cen_Name"){
  this.getStockPoint()
}
if(v != "Stock_Point"){
 // this.getStockPoint()
}
if(!this.SelectedDistDepartmentmis.length && !this.SelectedDistCostCen.length && !this.SelectedDistStockPoint.length){
  this.GetDeptDist()
  this.getStockPoint()
  this.GetCostCenterDist()
}
}
GetDistinctMis() {
  //let department:any = [];
  let costcen:any = [];
  let stockpoint:any = [];
  // this.DistDepartmentmis =[];
  // this.SelectedDistDepartmentmis =[];
  // this.DistCostCen =[];
  // this.SelectedDistCostCen =[];
  this.DistStockPoint =[];
  this.SelectedDistStockPoint = [];
  this.MISList.forEach((item) => {
// if (department.indexOf(item.Dept_Name) === -1) {
//   department.push(item.Dept_Name);
//   this.DistDepartmentmis.push({ label: item.Dept_Name, value: item.Dept_Name });
//   }
//  if (costcen.indexOf(item.Cost_Cen_Name) === -1) {
//   costcen.push(item.Cost_Cen_Name);
//  this.DistCostCen.push({ label: item.Cost_Cen_Name, value: item.Cost_Cen_Name });
//  }
 if (stockpoint.indexOf(item.Stock_Point) === -1) {
  stockpoint.push(item.Stock_Point);
 this.DistStockPoint.push({ label: item.Stock_Point, value: item.Stock_Point });
 }
});
   this.BackupMISList = [...this.MISList];
}

GetDeptDist(){
  let department:any = [];
  this.DistDepartmentmis =[];
  this.SelectedDistDepartmentmis =[];
  this.MISList.forEach((item) => {
    if (department.indexOf(item.Dept_Name) === -1) {
      department.push(item.Dept_Name);
      this.DistDepartmentmis.push({ label: item.Dept_Name, value: item.Dept_Name });
      }
      this.BackupMISList = [...this.BackupMISListFilter];
  })
}
GetCostCenterDist(){
  let costcen:any = [];
  this.DistCostCen =[];
  this.SelectedDistCostCen =[];
  console.log("MISList",this.MISList)
  this.MISList.forEach((item) => {
    if (costcen.indexOf(item.Cost_Cen_Name) === -1) {
      costcen.push(item.Cost_Cen_Name);
     this.DistCostCen.push({ label: item.Cost_Cen_Name, value: item.Cost_Cen_Name });
     }
      this.BackupMISList = [...this.BackupMISListFilter];
  })
}
getStockPoint(){
  let stockpoint:any = [];
  this.DistStockPoint =[];
  this.SelectedDistStockPoint = [];
  this.MISList.forEach((item) => {
    if (stockpoint.indexOf(item.Stock_Point) === -1) {
      stockpoint.push(item.Stock_Point);
     this.DistStockPoint.push({ label: item.Stock_Point, value: item.Stock_Point });
     }
      this.BackupMISList = [...this.BackupMISListFilter];
  })
}
TotalValue(arrList:any){
  if(arrList.length){
    this.allTotalObj.Value =0
    arrList.forEach(ele => {
      this.allTotalObj.Value = Number(Number(ele.Value) + Number(this.allTotalObj.Value)).toFixed(2)
    });
  }
  console.log(this.allTotalObj)
}
// Project 
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
      console.log("ProjectList",this.ProjectList);
      
   
    })
  }
getSite(){
  let TempObj = {...this.objproject}
  this.objproject = new project()
  this.objproject.PROJECT_ID = TempObj.PROJECT_ID
  this.SiteList = [];
  this.groupList = [];
  this.subGorupList = [];
  this.workList = [];
  if(this.objproject.PROJECT_ID){
   let projectFilter:any = []
  this.getWork()
  projectFilter = this.ProjectList.filter((el:any)=> Number(el.Project_ID) === Number(this.objproject.PROJECT_ID))
    console.log("projectFilter",projectFilter)
    const obj = {
      "SP_String": "SP_Tender_Management_All",
      "Report_Name_String": "Get_Site_For_Project_Planning",
      "Json_Param_String": JSON.stringify([{Project_ID : Number(this.objproject.PROJECT_ID),Tender_Doc_ID : projectFilter[0].Tender_Doc_ID}]) 
     }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      data.forEach(el => {
        el['label'] = el.Site_Description;
        el['value'] = el.Site_ID;
      });
      this.SiteList = data;
      this.getProductType()
      this.GetProductsDetalis()
       console.log("SiteList",this.SiteList);
    })
  }

}
getGroup(){
  let TempObj = {...this.objproject}
  this.objproject = new project()
  this.objproject.PROJECT_ID = TempObj.PROJECT_ID
  this.objproject.SITE_ID = TempObj.SITE_ID
  this.groupList = [];
  this.subGorupList = [];
  this.workList = [];
  if(this.objproject.PROJECT_ID && this.objproject.SITE_ID){
   
  
  this.getWork()
     const obj = {
      "SP_String": "SP_BL_CRM_TXN_Project_Doc",
      "Report_Name_String": "Get_Budget_Group",
      "Json_Param_String": JSON.stringify([{Project_ID : Number(this.objproject.PROJECT_ID) , Site_ID : Number(this.objproject.SITE_ID)}]) 
     }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      data.forEach(el => {
        el['label'] = el.Budget_Group_Name;
        el['value'] = el.Budget_Group_ID;
      });
      this.getProductType()
      this.GetProductsDetalis()
      this.groupList = data;
    })
  }
}
getSubGroup(){
  let TempObj = {...this.objproject}
   this.objproject = new project()
   this.objproject.PROJECT_ID = TempObj.PROJECT_ID
   this.objproject.SITE_ID = TempObj.SITE_ID
   this.objproject.Budget_Group_ID = TempObj.Budget_Group_ID
   this.subGorupList = [];
  if(this.objproject.PROJECT_ID && this.objproject.SITE_ID && this.objproject.Budget_Group_ID){
   const tampObj = {
      Project_ID : Number(this.objproject.PROJECT_ID),
      Site_ID : Number(this.objproject.SITE_ID),
      Budget_Group_ID : Number(this.objproject.Budget_Group_ID)
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
      this.getProductType()
      this.GetProductsDetalis()
        this.subGorupList = data;
     })
  }

}
getWork(){
  this.workList = []
  if(this.objproject.PROJECT_ID && this.objproject.SITE_ID){

    const obj = {
      "SP_String": "SP_BL_CRM_TXN_Project_Doc",
      "Report_Name_String": "Get_Work_Details",
      "Json_Param_String": JSON.stringify([{Project_ID : Number(this.objproject.PROJECT_ID) , Site_ID : Number(this.objproject.SITE_ID)}]) 
     }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      data.forEach(el => {
        el['label'] = el.Work_Details;
        el['value'] = el.Work_Details_ID;
      });
      this.getProductType()
      this.GetProductsDetalis()
    this.workList = data
    })
  }
}
workChange(){
  this.getProductType()
  this.GetProductsDetalis()
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
  //console.log("col",col)
  this.ObjCol = {}
  this.ObjCol = col
  overlaypanel.toggle(event); 
  }
}
class reqi{
  Req_No:any;
  Req_Date:any;
  Cost_Cen_ID:any;
  Cost_Cen_Name:any;
  Godown_ID:any;
  Remarks:any;
 }

class material{
Product_Category:any;
Product_ID:any;
Product_Description:any;
Req_Qty:any;
UOM:any;
Purpose:any;
Remarks:any;
Created_By:any;
Product_Type_ID:any;
Material_Type_ID:any;
}

class BrowseData {
From_Date: string;
To_Date: string;
Cost_Cen_ID : any;
Godown_ID : any;
To_Cost_Cen_ID :any
}
class project{
DOC_NO:any
DOC_DATE:any
DOC_TYPE:any
PROJECT_ID:any
SITE_ID:any
Budget_Group_ID:any
Budget_Sub_Group_ID:any
Work_Details_ID:any
}
class ReqStatusData {
From_Date: string;
To_Date: string;
Cost_Cen_ID : any;
Godown_ID : any;
To_Cost_Cen_ID :any
}
