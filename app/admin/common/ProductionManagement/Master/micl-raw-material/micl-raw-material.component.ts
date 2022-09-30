import { Component, OnInit, ViewEncapsulation, ElementRef, ViewChild, asNativeElements } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from "@angular/common/http";
import { MessageService } from "primeng/api";
import { CompacctCommonApi } from '../../../../shared/compacct.services/common.api.service';
import { CompacctHeader } from '../../../../shared/compacct.services/common.header.service';
import { DateTimeConvertService } from "../../../../shared/compacct.global/dateTime.service";
import {CompacctGetDistinctService } from "../../../../shared/compacct.services/compacct-get-distinct.service"
import * as moment from "moment";

declare var $:any;
import * as XLSX from 'xlsx';
import { FileUpload } from "primeng/primeng";
import { CompacctGlobalApiService } from '../../../../shared/compacct.services/compacct.global.api.service';
import { ActivatedRoute } from '@angular/router';
import { Console } from 'console';
import { CompacctProductDetailsComponent } from '../../../../shared/compacct.components/compacct.forms/compacct-product-details/compacct-product-details.component';
import { CompacctgstandcustomdutyComponent } from '../../../../shared/compacct.components/compacct.forms/compacctgstandcustomduty/compacctgstandcustomduty.component';
import { CompacctFinancialDetailsComponent } from '../../../../shared/compacct.components/compacct.forms/compacct.financial-details/compacct.financial-details.component';

@Component({
  selector: 'app-micl-raw-material',
  templateUrl: './micl-raw-material.component.html',
  styleUrls: ['./micl-raw-material.component.css'],
  providers: [MessageService],
  encapsulation: ViewEncapsulation.None
})
export class MiclRawMaterialComponent implements OnInit {
  tabIndexToView = 0;
  items = ["BROWSE","CREATE"];
  url = window["config"];
  buttonname = "Create";
  Spinner = false;
  MasterRawMaterialFormSubmitted = false;
  ObjMasterRawMaterial = new MasterRawMaterial();
  ObjFinancialComponentData = new Financial();
  MakeList:any = [];

  BrowseList:any = [];
  editList:any = [];
  productid: any;

  ObjproductDetails : any;
  ObjGstandCustonDuty : any;
  ObjFinancial: any;
  headerData = ""
  makedisabled = false;

  UomDataList:any = [];
  UOMTypeFormSubmitted = false;
  UOMTypeName = undefined;
  UOMTypeModal = false;
  mettypeid = undefined;
  Uomid = undefined;
  AllUOMData:any = [];
  AllUomDataList:any = [];

  is_Active = false;
  Is_View = false;
  Browseproid = undefined;
  isvisible = undefined;
  LAbelName = 'HSN Code';
  objCheckFinamcial:any = {};
  objGst:any = {};
  objProductrequ:any = {};
  // objproduct : product = new product()
  @ViewChild("Product", { static: false })
  ProductDetailsInput: CompacctProductDetailsComponent;
  @ViewChild("GstAndCustomDuty", { static: false })
  GstAndCustDutyInput: CompacctgstandcustomdutyComponent;
  @ViewChild("FinacialDetails", { static: false })
  FinacialDetailsInput: CompacctFinancialDetailsComponent;

 // ObjSearch = new Search();

  @ViewChild("location", { static: false }) locationInput: ElementRef;

  @ViewChild("fileInput", { static: false }) fileInput: FileUpload;

  AllMaterialData:any = [];
  MaterialTypeFormSubmitted = false;
  MaterialTypeName: any;
  MatTypeModal = false;
  ViewMetTypeModal = false;
  EXCELSpinner:boolean = false
  DescriptionCheck: any;

  constructor(
    private $http: HttpClient,
    private commonApi: CompacctCommonApi,
    private Header: CompacctHeader,
    private route : ActivatedRoute,
    private DateService: DateTimeConvertService,
    private GlobalAPI: CompacctGlobalApiService,
    private compacctToast: MessageService,
    private GetDistinctItems :CompacctGetDistinctService
  ) { }

  ngOnInit() {
    this.Header.pushHeader({
      Header: "Raw Material",
      Link: " Production Management -> Master -> Raw Material " //+this.headerData
    });
    
    //  this.GetProductType();
     //this.GetProductSubType();
     this.GetMaterialTyp();
     this.GetUOM();
     this.GetBrowseList();
  }
  TabClick(e) {
    this.tabIndexToView = e.index;
    this.items = ["BROWSE","CREATE"];
    this.buttonname = "Create";
    this.destroyChild();
    this.clearData();
    // this.productid = undefined;
  }
  clearData() {
    this.Spinner = false;
   // this.TenderSearchForm = false;
    this.ObjMasterRawMaterial = new MasterRawMaterial();
    this.MasterRawMaterialFormSubmitted = false;
    this.GetBrowseList();
 
 }
  destroyChild() {
    if (this.ProductDetailsInput) {
      this.ProductDetailsInput.clear();
    }
    if (this.GstAndCustDutyInput) {
      this.GstAndCustDutyInput.clear();
    }
    if (this.FinacialDetailsInput) {
      this.FinacialDetailsInput.clear();
    }
  }
  GetMaterialTyp(){ 
     this.AllMaterialData = [];
        const obj = {
         "SP_String": "SP_Production_Management_Master_Raw_Material",
         "Report_Name_String":"Get_Material_Type",
        }
        this.GlobalAPI.getData(obj).subscribe((data:any)=>{
          if(data.length) {
            data.forEach(element => {
              element['label'] = element.Material_Type,
              element['value'] = element.Material_ID
            });
            this.AllMaterialData = data;
          } else {
            this.AllMaterialData = [];
          }
       })
  }
  FinancialDetailsData(e) {
    console.log(e)
    this.ObjMasterRawMaterial.Can_Purchase = undefined;
    this.ObjMasterRawMaterial.Billable = undefined;
    this.ObjFinancial = undefined;
    // this.PurchaseACFlag = undefined;
    this.ObjMasterRawMaterial.Purchase_Ac_Ledger = undefined;
    // this.SalesACFlag = undefined;
    this.ObjMasterRawMaterial.Sales_Ac_Ledger = undefined;
    this.ObjMasterRawMaterial.Purchase_Return_Ledger_ID = undefined;
    this.ObjMasterRawMaterial.Sales_Return_Ledger_ID = undefined;
    this.ObjMasterRawMaterial.Discount_Receive_Ledger_ID = undefined;
    this.ObjMasterRawMaterial.Discount_Given_Ledger_ID = undefined;
    if (e.Purchase_Ac_Ledger) {
      this.ObjFinancial = e;
      this.ObjMasterRawMaterial.Can_Purchase = e.Can_Purchase;
      this.ObjMasterRawMaterial.Billable = e.Billable;
      // this.PurchaseACFlag = e.PurchaseACFlag;
      this.ObjMasterRawMaterial.Purchase_Ac_Ledger = e.Purchase_Ac_Ledger;
      // this.SalesACFlag = e.SalesACFlag;
      this.ObjMasterRawMaterial.Sales_Ac_Ledger = e.Sales_Ac_Ledger;
      this.ObjMasterRawMaterial.Purchase_Return_Ledger_ID = e.Purchase_Return_Ledger_ID;
      this.ObjMasterRawMaterial.Sales_Return_Ledger_ID = e.Sales_Return_Ledger_ID;
      this.ObjMasterRawMaterial.Discount_Receive_Ledger_ID = e.Discount_Receive_Ledger_ID;
      this.ObjMasterRawMaterial.Discount_Given_Ledger_ID = e.Discount_Given_Ledger_ID;
      this.ObjMasterRawMaterial.Input_RCM_Ledger_ID = e.Input_RCM_Ledger_ID;
      this.ObjMasterRawMaterial.Output_RCM_Ledger_ID = e.Output_RCM_Ledger_ID;
      this.ObjMasterRawMaterial.Input_CGST_RCM_Ledger_ID = e.Input_CGST_RCM_Ledger_ID;	
      this.ObjMasterRawMaterial.Input_SGST_RCM_Ledger_ID = e.Input_SGST_RCM_Ledger_ID;
      this.ObjMasterRawMaterial.Input_IGST_RCM_Ledger_ID = e.Input_IGST_RCM_Ledger_ID;
      this.ObjMasterRawMaterial.Output_CGST_RCM_Ledger_ID = e.Output_CGST_RCM_Ledger_ID;
      this.ObjMasterRawMaterial.Output_SGST_RCM_Ledger_ID = e.Output_SGST_RCM_Ledger_ID;
      this.ObjMasterRawMaterial.Output_IGST_RCM_Ledger_ID = e.Output_IGST_RCM_Ledger_ID;
      this.objCheckFinamcial.Purchase_Ac_Ledger = e.Purchase_Ac_Ledger;
      this.objCheckFinamcial.Sales_Ac_Ledger = e.Sales_Ac_Ledger;
      this.objCheckFinamcial.Purchase_Return_Ledger_ID = e.Purchase_Return_Ledger_ID;
      this.objCheckFinamcial.Sales_Return_Ledger_ID = e.Sales_Return_Ledger_ID;
      this.objCheckFinamcial.Discount_Receive_Ledger_ID = e.Discount_Receive_Ledger_ID;
      this.objCheckFinamcial.Discount_Given_Ledger_ID = e.Discount_Given_Ledger_ID;
    }
  }
  getGstAndCustDutyData(e) {
    console.log(e)
    this.ObjGstandCustonDuty = undefined;
    this.ObjMasterRawMaterial.Cat_ID = undefined;
    this.ObjMasterRawMaterial.HSN_NO = undefined;
    this.ObjMasterRawMaterial.Custom_Duty = undefined;
    this.ObjMasterRawMaterial.Remarks = undefined;
    if (e.Cat_ID) {
      this.ObjGstandCustonDuty = e;
      this.ObjMasterRawMaterial.Cat_ID = e.Cat_ID;
      this.ObjMasterRawMaterial.HSN_NO = e.HSN_NO;
      this.ObjMasterRawMaterial.Custom_Duty = e.Custom_Duty;
      this.ObjMasterRawMaterial.Remarks = e.Remarks;
      this.ObjMasterRawMaterial.RCM_Per = Number(e.RCM_Per)
      this.objGst.Cat_ID = e.Cat_ID;
      this.objGst.HSN_NO = e.HSN_NO;
    }
  }
  GetUOM(){
      this.UomDataList = [];
        const obj = {
          "SP_String": "SP_Master_Product_New",
          "Report_Name_String":"Get_Master_UOM_Data",
        }
        this.GlobalAPI.getData(obj).subscribe((data:any)=>{
          if(data.length) {
            data.forEach(element => {
              element['label'] = element.UOM,
              element['value'] = element.UOM
            });
            this.UomDataList = data;
          } else {
            this.UomDataList = [];
          }
        })
    }
    checkrequ(financial?,Gst?,product?){
      let falg = false
      if(financial){
        let getArrValue = Object.values(financial);
        if(getArrValue.length === 6){
          falg = true
        }
        else {
          falg = false
          return falg
        }
    
      }
     if(Gst){
      let getArrValue = Object.values(Gst);
      let tempHSN = this.objGst.HSN_NO
      console.log("tempHSN",tempHSN.toString());
      let tempHSNString = tempHSN.toString()
      if(getArrValue.length === 2 && tempHSNString.length === 6){
        falg = true
        
      }
      else {
        falg = false
        return falg
      }
     }
    return falg
    }
    SaveMasterEawMaterial(valid){
      //if(this.Product_Mfg_Comp_ID.length) {
        if (this.productid) {
          this.Spinner = true;
          this.MasterRawMaterialFormSubmitted = true;
        if(valid && this.checkrequ(this.objCheckFinamcial,this.objGst)) {
           const obj = {
             "SP_String": "SP_Production_Management_Master_Raw_Material",
             "Report_Name_String" : "Master_Raw_Material_Update",
             "Json_Param_String": JSON.stringify(this.ObjMasterRawMaterial)
         
           }
           this.GlobalAPI.postData(obj).subscribe((data:any)=>{
             console.log(data);
             var tempID = data[0].Column1;
             if(data[0].Column1){
              this.compacctToast.clear();
              //const mgs = this.buttonname === 'Save & Print Bill' ? "Created" : "updated";
              this.compacctToast.add({
               key: "compacct-toast",
               severity: "success",
               summary: "Product_ID  " + tempID,
               detail: "Succesfully Update" //+ mgs
             });
             this.clearData();
             this.destroyChild();
             this.productid = undefined;
             this.tabIndexToView = 0;
             this.items = ["BROWSE", "CREATE"];
            //  this.buttonname = "Save";
              // this.testchips =[];
         
             } else{
              // this.ngxService.stop();
               this.compacctToast.clear();
               this.compacctToast.add({
                 key: "compacct-toast",
                 severity: "error",
                 summary: "Warn Message",
                 detail: "Error Occured "
               });
             }
           })
         // }
        
        
      
    }
     else {
        this.Spinner = false;
       // this.destroyChild();
          this.compacctToast.clear();
          this.compacctToast.add({
            key: "compacct-toast",
            severity: "error",
            summary: "Warn Message",
            // detail: "No Docs Selected"
            detail: "Error Occured "
          });
        }
       }
          else {
        this.Spinner = true;
        this.MasterRawMaterialFormSubmitted = true;
        // const Obj = {
        //   Product_Code : this.ObjMachineMaster.Product_Model,
        //   Product_Description : this.ObjMachineMaster.Product_Description,
        //   Product_Mfg_Comp_ID : this.ObjMachineMaster.Manufacturer
        // }
        if(valid) {
          var mattype = this.AllMaterialData.filter(el=> Number(el.Material_ID) === Number(this.ObjMasterRawMaterial.Material_ID))
          this.ObjMasterRawMaterial.Material_Type = mattype[0].Material_Type;
           const obj = {
             "SP_String": "SP_Production_Management_Master_Raw_Material",
             "Report_Name_String" : "Master_Raw_Material_Create",
             "Json_Param_String": JSON.stringify(this.ObjMasterRawMaterial)
         
           }
           this.GlobalAPI.postData(obj).subscribe((data:any)=>{
             console.log(data);
             var tempID = data[0].Column1;
             if(data[0].Column1){
              this.compacctToast.clear();
              //const mgs = this.buttonname === 'Save & Print Bill' ? "Created" : "updated";
              this.compacctToast.add({
               key: "compacct-toast",
               severity: "success",
               summary: "Product_ID  " + tempID,
               detail: "Succesfully create" //+ mgs
             });
             this.Spinner = false;
             this.clearData();
              //this.testchips =[];
         
             } else{
              // this.ngxService.stop();
               this.Spinner = false;
               this.compacctToast.clear();
               this.compacctToast.add({
                 key: "compacct-toast",
                 severity: "error",
                 summary: "Warn Message",
                 detail: "Error Occured "
               });
             }
           })
      
      }
      else {
            this.Spinner = false;
            this.compacctToast.clear();
            this.compacctToast.add({
              key: "compacct-toast",
              severity: "error",
              summary: "Warn Message",
              detail: "Error Occured "
            });
        }
    }
    }
    GetBrowseList(){
      const obj = {
        "SP_String": "SP_Production_Management_Master_Raw_Material",
        "Report_Name_String": "Browse_Master_Raw_Material"
       }
      this.GlobalAPI.getData(obj).subscribe((data:any)=>{
       this.BrowseList = data;
       console.log('BrowseList ==', this.BrowseList)
    
      });
    } 
    Edit(editobj){
      this.clearData();
      this.productid = undefined;
      if (editobj.Product_ID) {
        this.productid = editobj.Product_ID;
        this.items = ["BROWSE", "UPDATE"];
        this.buttonname = "Update";
        this.tabIndexToView = 1;
        this.GetEdit();
      }
    }
    GetEdit(){
      this.editList = [];
      //this.ProductionFormSubmitted = false;
      const temobj = {
        Product_ID  : this.productid
      }
      const obj = {
        "SP_String": "SP_Production_Management_Master_Raw_Material",
        "Report_Name_String": "Get_Master_Raw_Material",
        "Json_Param_String": JSON.stringify(temobj)
    
      }
      this.GlobalAPI.getData(obj).subscribe((data:any)=>{
        this.editList = data;
        this.ObjMasterRawMaterial = data[0];
        this.ObjFinancialComponentData = data[0];
        // this.FinacialDetailsInput.EditFinalcial(JSON.stringify(data))
        this.GstAndCustDutyInput.GetEdit(JSON.stringify(data))
         //this.myDate = data[0].Date;
        //  this.ObjMasterProductel.Product_Description = data[0].Product_Description;
        //  this.ObjMasterProductel.Remarks = data[0].Remarks ? data[0].Remarks : undefined;
        //  this.ObjMasterProductel.HSN_NO = data[0].HSN_NO;
        //  this.ObjMasterProductel.GST_Percentage = data[0].GST_Percentage;
        //  this.ObjMasterProductel.UOM = data[0].UOM;
        console.log("this.editList  ===",this.editList);
    
    })
    }
    onConfirm(){}
    onReject(){}

}
class MasterRawMaterial{
  Material_ID:number;
  Material_Type:any;
  PLC_Code:any;
  Product_Type_ID:number;
  Product_Sub_Type_ID:number;
  Cat_ID : number;
  Product_Description:string;
  Grade:string;
  MOC_ID:number;
  Capacity_Size_ID:number;
  Additional_Feature_ID_1 :number;
  Additional_Feature_ID_2 :number;
  Additional_Feature_ID_3 :number;
  Additional_Feature_ID_4 :number;
  Product_ID:number;
  Grade_ID	:number;
  Remarks	:any;
  HSN_NO:any;
  GST_Percentage:number;
  UOM:string;
  Product_Mfg_Comp_ID:any;
  Product_Image:any;


  Product_Code:any;
  Rack_NO :any;
  HSN_Code:any;	
  Custom_Duty:any;
  Billable:boolean;			
  Can_Purchase:boolean;
  Purchase_Ac_Ledger:any;
  Sales_Ac_Ledger:any;	
  Purchase_Return_Ledger_ID:number;
  Discount_Receive_Ledger_ID:number;	
  Discount_Given_Ledger_ID:number;	
  Sales_Return_Ledger_ID:number;	
  RCM_Per:any;
  Input_RCM_Ledger_ID:any;
  Output_RCM_Ledger_ID:any;
  Input_CGST_RCM_Ledger_ID:any;	
  Input_SGST_RCM_Ledger_ID:any;
  Input_IGST_RCM_Ledger_ID:any;
  Output_CGST_RCM_Ledger_ID:any;
  Output_SGST_RCM_Ledger_ID:any;
  Output_IGST_RCM_Ledger_ID:any;
}
class Financial{
 Can_Purchase : boolean;
 Billable : boolean;
 Purchase_Ac_Ledger:any;
 Sales_Ac_Ledger:any;
 Purchase_Return_Ledger_ID:any;
 Sales_Return_Ledger_ID:any;
 Discount_Receive_Ledger_ID:any;
 Discount_Given_Ledger_ID:any;
 Input_RCM_Ledger_ID:any;
 Output_RCM_Ledger_ID:any;
 Input_CGST_RCM_Ledger_ID:any;	
 Input_SGST_RCM_Ledger_ID:any;
 Input_IGST_RCM_Ledger_ID:any;
 Output_CGST_RCM_Ledger_ID:any;
 Output_SGST_RCM_Ledger_ID:any;
 Output_IGST_RCM_Ledger_ID:any;
}
