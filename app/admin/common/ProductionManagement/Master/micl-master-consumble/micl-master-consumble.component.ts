import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { Console } from 'console';
import { MessageService } from 'primeng/api';
import { CompacctFinancialDetailsComponent } from '../../../../shared/compacct.components/compacct.forms/compacct.financial-details/compacct.financial-details.component';
import { CompacctgstandcustomdutyComponent } from '../../../../shared/compacct.components/compacct.forms/compacctgstandcustomduty/compacctgstandcustomduty.component';
import { CompacctCommonApi } from '../../../../shared/compacct.services/common.api.service';
import { CompacctHeader } from '../../../../shared/compacct.services/common.header.service';
import { CompacctGlobalApiService } from '../../../../shared/compacct.services/compacct.global.api.service';

@Component({
  selector: 'app-micl-master-consumble',
  templateUrl: './micl-master-consumble.component.html',
  styleUrls: ['./micl-master-consumble.component.css'],
  providers: [MessageService],
  encapsulation: ViewEncapsulation.None
})
export class MICLMasterConsumbleComponent implements OnInit {
  tabIndexToView = 0;
  items = ["BROWSE", "CREATE"];
  buttonname = "Create";
  Spinner = false;
  MasterConsumbleFormSubmitted = false;
  ObjMaster: Master = new Master();
  LAbelName = 'HSN Code';
  BrowseList: any = [];
  AllMaterialData: any = [];
  UomDataList: any = [];
  ObjFinancial: any;
  objCheckFinacial: any = {};
  ObjGstandCustonDuty: any;
  objGst: any = {};
  ObjFinancialComponentData = new Financial();
  productid: any;
  editList: any = [];
  @ViewChild("GstAndCustomDuty", { static: false })
  GstAndCustDutyInput: CompacctgstandcustomdutyComponent;
  @ViewChild("FinacialDetails", { static: false })
  FinacialDetailsInput: CompacctFinancialDetailsComponent;
  constructor(
    private $http: HttpClient,
    private commonApi: CompacctCommonApi,
    private Header: CompacctHeader,
    private GlobalAPI: CompacctGlobalApiService,
    private compacctToast: MessageService,
  ) { }

  ngOnInit() {
    this.Header.pushHeader({
      Header: "Master Consumable",
      Link: " Production Management -> Master -> Master Consumable"
    });
    this.GetBrowseList();
    this.GetMaterialTyp();
    this.GetUOM();
  }
TabClick(e) {
    this.tabIndexToView = e.index;
    this.items = ["BROWSE", "CREATE"];
    this.buttonname = "Create";
    this.destroyChild();
    this.clearData();
    this.productid = undefined;
}
onReject(){}
clearData() {
    this.Spinner = false;
    this.ObjMaster = new Master();
    this.MasterConsumbleFormSubmitted = false;
    this.GetBrowseList();
}
destroyChild() {
    if (this.GstAndCustDutyInput) {
      this.GstAndCustDutyInput.clear();
    }
    if (this.FinacialDetailsInput) {
      this.FinacialDetailsInput.clear();
    }
}
GetBrowseList() {
    const obj = {
      "SP_String": "SP_Production_Management_Master_Consumable",
      "Report_Name_String": "Browse_Master_Master_Consumable"
    }
    this.GlobalAPI.getData(obj).subscribe((data: any) => {
      this.BrowseList = data;
      //console.log('BrowseList ==', this.BrowseList)
    });
}
GetMaterialTyp() {
    this.AllMaterialData = [];
    const obj = {
      "SP_String": "SP_Production_Management_Master_Consumable",
      "Report_Name_String": "Get_Material_Type",
    }
    this.GlobalAPI.getData(obj).subscribe((data: any) => {
      if (data.length) {
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
GetUOM() {
    this.UomDataList = [];
    const obj = {
      "SP_String": "SP_Master_Product_New",
      "Report_Name_String": "Get_Master_UOM_Data",
    }
    this.GlobalAPI.getData(obj).subscribe((data: any) => {
      if (data.length) {
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
FinancialDetailsData(e) {
    this.ObjFinancial = undefined;
    if (e.Purchase_Ac_Ledger) {
      this.ObjFinancial = e;
      this.ObjMaster.Can_Purchase = e.Can_Purchase;
      this.ObjMaster.Billable = e.Billable;
      // this.PurchaseACFlag = e.PurchaseACFlag;
      this.ObjMaster.Purchase_Ac_Ledger = e.Purchase_Ac_Ledger;
      // this.SalesACFlag = e.SalesACFlag;
      this.ObjMaster.Sales_Ac_Ledger = e.Sales_Ac_Ledger;
      this.ObjMaster.Purchase_Return_Ledger_ID = e.Purchase_Return_Ledger_ID;
      this.ObjMaster.Sales_Return_Ledger_ID = e.Sales_Return_Ledger_ID;
      this.ObjMaster.Discount_Receive_Ledger_ID = e.Discount_Receive_Ledger_ID;
      this.ObjMaster.Discount_Given_Ledger_ID = e.Discount_Given_Ledger_ID;
      this.ObjMaster.Input_RCM_Ledger_ID = e.Input_RCM_Ledger_ID;
      this.ObjMaster.Output_RCM_Ledger_ID = e.Output_RCM_Ledger_ID;
      this.ObjMaster.Input_CGST_RCM_Ledger_ID = e.Input_CGST_RCM_Ledger_ID;
      this.ObjMaster.Input_SGST_RCM_Ledger_ID = e.Input_SGST_RCM_Ledger_ID;
      this.ObjMaster.Input_IGST_RCM_Ledger_ID = e.Input_IGST_RCM_Ledger_ID;
      this.ObjMaster.Output_CGST_RCM_Ledger_ID = e.Output_CGST_RCM_Ledger_ID;
      this.ObjMaster.Output_SGST_RCM_Ledger_ID = e.Output_SGST_RCM_Ledger_ID;
      this.ObjMaster.Output_IGST_RCM_Ledger_ID = e.Output_IGST_RCM_Ledger_ID;
      this.objCheckFinacial.Purchase_Ac_Ledger = e.Purchase_Ac_Ledger;
      this.objCheckFinacial.Sales_Ac_Ledger = e.Sales_Ac_Ledger;
      this.objCheckFinacial.Purchase_Return_Ledger_ID = e.Purchase_Return_Ledger_ID;
      this.objCheckFinacial.Sales_Return_Ledger_ID = e.Sales_Return_Ledger_ID;
      this.objCheckFinacial.Discount_Receive_Ledger_ID = e.Discount_Receive_Ledger_ID;
      this.objCheckFinacial.Discount_Given_Ledger_ID = e.Discount_Given_Ledger_ID;
    }
}
getGstAndCustDutyData(e) {
     this.ObjGstandCustonDuty = undefined;
    this.ObjMaster.Cat_ID = undefined;
    this.ObjMaster.HSN_Code = undefined;
    this.ObjMaster.Custom_Duty = undefined;
    this.ObjMaster.Remarks = undefined;
    if (e.Cat_ID) {
      this.ObjGstandCustonDuty = e;
      this.ObjMaster.Cat_ID = e.Cat_ID;
      this.ObjMaster.HSN_NO = e.HSN_NO;
      this.ObjMaster.Custom_Duty = e.Custom_Duty;
      this.ObjMaster.Remarks = e.Remarks;
      this.ObjMaster.RCM_Per = Number(e.RCM_Per);
      // this.objProductrequ.Product_Type_ID = e.Product_Type_ID;
      // this.objProductrequ.Product_Sub_Type_ID = e.Product_Sub_Type_ID;
      // this.objProductrequ.Product_Description = e.Product_Description;
      this.objGst.Cat_ID = e.Cat_ID;
      this.objGst.HSN_NO = e.HSN_NO;
    }
}
checkrequ(financial?, Gst?) {
    //console.log("cke-financial >>", financial)
   // console.log("cke-Gst >>",Gst)
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
    if(getArrValue.length === 2 && this.objGst.HSN_NO.length === 6){
      falg = true
    }
    else {
      falg = false
      return falg
    }
   }
  return falg
}
SaveMasterConsumble(valid: any) {
    if (this.productid) {
      this.MasterConsumbleFormSubmitted = true;
      //console.log("checkrequ", this.checkrequ(this.objCheckFinacial, this.objGst))
      //console.log("valid",valid)
      if (valid && this.checkrequ(this.objCheckFinacial, this.objGst)) {
        var mattype = this.AllMaterialData.filter(el=> Number(el.Material_ID) === Number(this.ObjMaster.Material_ID))
       this.ObjMaster.Material_Type = mattype[0].Material_Type;  
        let UpdateArr = []
        const Obj = {
          Product_ID: this.productid,
        }
        UpdateArr.push({ ...Obj, ...this.ObjMaster })
       // console.log("Update =", UpdateArr)
        const obj = {
          "SP_String": "SP_Production_Management_Master_Consumable",
          "Report_Name_String": "Master_Master_Consumable_Update",
          "Json_Param_String": JSON.stringify(UpdateArr)
        }
        this.GlobalAPI.postData(obj).subscribe((data: any) => {
          var tempID = data[0].Column1;
          if (data[0].Column1) {
            this.compacctToast.clear();
            this.compacctToast.add({
              key: "compacct-toast",
              severity: "success",
              summary: "Product_ID  " + tempID,
              detail: "Succesfully Update"
            });
            this.Spinner = false;
            this.productid = undefined;
            this.tabIndexToView = 0;
            this.items = ["BROWSE", "CREATE"];
            this.clearData();
          }
          else {
            this.Spinner = false;
            this.compacctToast.clear();
            this.compacctToast.add({
              key: "compacct-toast",
              severity: "error",
              summary: "Warn Message",
              detail: "Error Occured inside up dtae "
            });
          }
        })
      }
       else{
        this.Spinner = false;
       // this.destroyChild();
          this.compacctToast.clear();
          this.compacctToast.add({
            key: "compacct-toast",
            severity: "error",
            summary: "Warn Message",
            detail: "Error Occured "
          });
        }
    }
    else {
      this.MasterConsumbleFormSubmitted = true;
      if (valid && this.checkrequ(this.objCheckFinacial, this.objGst)){
         var mattype = this.AllMaterialData.filter(el=> Number(el.Material_ID) === Number(this.ObjMaster.Material_ID))
          this.ObjMaster.Material_Type = mattype[0].Material_Type;
        const obj = {
          "SP_String": "SP_Production_Management_Master_Consumable",
          "Report_Name_String": "Master_Master_Consumable_Create",
          "Json_Param_String": JSON.stringify(this.ObjMaster)
        }
        this.GlobalAPI.postData(obj).subscribe((data: any) => {
          var tempID = data[0].Column1;
          if (data[0].Column1) {
            this.compacctToast.clear();
            this.compacctToast.add({
              key: "compacct-toast",
              severity: "success",
              summary: "Product_ID  " + tempID,
              detail: "Succesfully Create"
            });
            this.Spinner = false;
            this.tabIndexToView = 0;
            this.items = ["BROWSE", "CREATE"];
            this.clearData();
          }
          else {
            this.Spinner = false;
            this.compacctToast.clear();
            this.compacctToast.add({
              key: "compacct-toast",
              severity: "error",
              summary: "Warn Message",
              detail: "Error Occured"
            });
          }
        })
      }
      else{
            this.Spinner = false;
            this.compacctToast.clear();
            this.compacctToast.add({
              key: "compacct-toast",
              severity: "error",
              summary: "Warn Message",
              detail: "Error Occured  "
            });
        }
    }
}
Edit(masterConsumble){
  this.productid = undefined;
  if (masterConsumble.Product_ID) {
    this.productid = masterConsumble.Product_ID;
    this.items = ["BROWSE", "UPDATE"];
    this.buttonname = "Update";
    this.tabIndexToView = 1;
    this.GetEdit();
  }
}
GetEdit(){
  this.editList = [];
  const temobj = {
    Product_ID  : this.productid,   
  }
  const obj = {
    "SP_String": "SP_Production_Management_Master_Consumable",
    "Report_Name_String": "Get_Master_Master_Consumable",
    "Json_Param_String": JSON.stringify(temobj)
  }
  this.GlobalAPI.getData(obj).subscribe((data:any)=>{
    this.editList = data;
      this.ObjFinancialComponentData = data[0];
      this.FinacialDetailsInput.EditFinalcial(JSON.stringify(data[0]))
      this.GstAndCustDutyInput.GetEdit(JSON.stringify(data))
      this.ObjMaster.Product_Description = data[0].Product_Description;
      this.ObjMaster.Material_ID = data[0].Material_ID;
      this.ObjMaster.Product_Code = data[0].Product_Code;
      this.ObjMaster.UOM = data[0].UOM;
    //console.log("this.editList  ===",this.editList);
    })
}
}
class Master{
  Material_ID:number;
  Material_Type:any;
  PLC_Code:any;
  Cat_ID : number;
  MOC_ID:number;
  Product_ID:number;
  Grade_ID	:number;
  Remarks	:any;
  HSN_NO:any;
  GST_Percentage:number;
  UOM:string;
  Product_Description:string;
  
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
