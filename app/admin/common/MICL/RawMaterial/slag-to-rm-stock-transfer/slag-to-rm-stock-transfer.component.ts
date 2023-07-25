import { Component, OnInit, ViewEncapsulation, ViewChild } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { MessageService } from "primeng/api";
import { FileUpload } from "primeng/primeng";
declare var $: any;
import { IfStmt, THIS_EXPR, ThrowStmt } from "@angular/compiler/src/output/output_ast";
import { NgxUiLoaderService } from "ngx-ui-loader";
import * as XLSX from 'xlsx';
import { CompacctCommonApi } from "../../../../shared/compacct.services/common.api.service";
import { CompacctGlobalApiService } from "../../../../shared/compacct.services/compacct.global.api.service";
import { CompacctHeader } from "../../../../shared/compacct.services/common.header.service";
import { DateTimeConvertService } from "../../../../shared/compacct.global/dateTime.service";
import { CompacctProjectComponent } from "../../../../shared/compacct.components/compacct.forms/compacct-project/compacct-project.component";
import { ActivatedRoute } from "@angular/router";

@Component({
  selector: 'app-slag-to-rm-stock-transfer',
  templateUrl: './slag-to-rm-stock-transfer.component.html',
  styleUrls: ['./slag-to-rm-stock-transfer.component.css'],
  providers: [MessageService],
  encapsulation: ViewEncapsulation.None
})
export class SlagToRmStockTransferComponent implements OnInit {
  tabIndexToView = 0;
  items:any = [];
  Spinner:boolean = false;
  seachSpinner:boolean = false;
  buttonname = "Create";
  initDate:any = [];
  ObjSlagtToRM : SlagtToRM = new SlagtToRM();
  SlagtToRMFormSubmitted:boolean = false;
  DocDate = new Date();
  FromCostCenterList:any = [];
  FromGodownlist:any = [];
  ToCostCenterList:any = [];
  ToGodownlist:any = [];
  FromProductList:any = [];
  ToProductList:any = [];
  BatchNolist:any = [];
  AddProductList:any = [];
  SerarchSearchSlagtoRMList:any = [];
  SerarchSearchSlagtoRMListHeader:any = [];
  start_date: any;
  end_date: any;
  View_Doc_no: any;
  View_Doc_date: any;
  View_F_Cost_Cen_ID: any;
  View_F_Godown_ID: any;
  View_To_Cost_Cen_ID: any;
  View_To_Godown_ID: any;
  ViewList:any = [];
  ViewPoppup:boolean = false;
  ObjMIS : MIS = new MIS()
  MISreportFormSubmit = false;
  ReportNameList:any = [];
  MISSpinner = false;
  misReportList:any = [];
  DynamicHeaderMISreport:any = [];
  BackupMisReport:any = [];

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
  ) { }

  ngOnInit() {
    this.items = ["BROWSE", "CREATE", "MIS"];
    this.Header.pushHeader({
      Header: "Slag To RM Stock Transfer",
      Link: "Material Management -> Production -> Slag To RM Stock Transfer"
    });
    this.Finyear();
    this.GetFromCostcenter();
    this.GetToCostcenter();
    this.GetToProduct();
  }
  TabClick(e) {
    this.tabIndexToView = e.index;
    this.items = ["BROWSE", "CREATE", "MIS"];
    this.buttonname = "Create";
    this.Spinner = false;
  }
  Finyear() {
    this.$http
      .get("Common/Get_Fin_Year_Date?Fin_Year_ID=" + this.$CompacctAPI.CompacctCookies.Fin_Year_ID)
      .subscribe((res: any) => {
        let data = JSON.parse(res)
        // this.vouchermaxDate = new Date(data[0].Fin_Year_End);
        // this.voucherminDate = new Date(data[0].Fin_Year_Start);
        // this.voucherdata = new Date().getMonth() > new Date(data[0].Fin_Year_End).getMonth() ? new Date() : new Date(data[0].Fin_Year_End)
        this.initDate = [new Date(data[0].Fin_Year_Start), new Date(data[0].Fin_Year_End)]
      });
  }
  GetFromCostcenter() {
    this.FromCostCenterList = [];
    const obj = {
      "SP_String": "SP_BL_Txn_Slag_To_RM_Stock_Transfer",
      "Report_Name_String": "Get_From_Cost_Center",
    }
    this.GlobalAPI.getData(obj).subscribe((data: any) => {
      this.FromCostCenterList = data;
      // console.log("this.CostCenterList222222", this.GetFromCostcenter)
    })
  }
  GetFromGodown() {
    this.FromGodownlist = [];
    if (this.ObjSlagtToRM.F_Cost_Cen_ID) {
      const TempObj = {
        Cost_Cen_ID: this.ObjSlagtToRM.F_Cost_Cen_ID
      }
      const obj = {
        "SP_String": "SP_BL_Txn_Slag_To_RM_Stock_Transfer",
        "Report_Name_String": "Get_From_Stock_Point",
        "Json_Param_String": JSON.stringify([TempObj])
      }
      this.GlobalAPI.getData(obj).subscribe((data: any) => {
        console.log("GodownList  ===", data);
        this.FromGodownlist = data;
      })
    }
   
  }
  GetToCostcenter() {
    this.ToCostCenterList = [];
    const obj = {
      "SP_String": "SP_BL_Txn_Slag_To_RM_Stock_Transfer",
      "Report_Name_String": "Get_To_Cost_Center",
    }
    this.GlobalAPI.getData(obj).subscribe((data: any) => {
      this.ToCostCenterList = data;
      // console.log("this.CostCenterList222222", this.GetFromCostcenter)
    })
  }
  GetToGodown() {
    this.ToGodownlist = [];
    if (this.ObjSlagtToRM.To_Cost_Cen_ID) {
      const TempObj = {
        Cost_Cen_ID: this.ObjSlagtToRM.To_Cost_Cen_ID
      }
      const obj = {
        "SP_String": "SP_BL_Txn_Slag_To_RM_Stock_Transfer",
        "Report_Name_String": "Get_To_Stock_Point",
        "Json_Param_String": JSON.stringify([TempObj])
      }
      this.GlobalAPI.getData(obj).subscribe((data: any) => {
        console.log("GodownList  ===", data);
        this.ToGodownlist = data;
      })
    }
   
  }
  GetFromProduct(){
    this.FromProductList = [];
    const Obj = {
      Cost_Cen_ID: this.ObjSlagtToRM.F_Cost_Cen_ID,
      Godown_ID: this.ObjSlagtToRM.F_Godown_ID
    }
      const obj = {
        "SP_String": "SP_BL_Txn_Slag_To_RM_Stock_Transfer",
        "Report_Name_String": "Get_From_Product",
        "Json_Param_String": JSON.stringify([Obj])
      }
      this.GlobalAPI.getData(obj).subscribe((data: any) => {
        if(data.length) {
            data.forEach(element => {
              element['label'] = element.Product_Description,
              element['value'] = element.Product_ID
            });
            this.FromProductList = data;
          } else {
            this.FromProductList = [];
          }
      })
  }
  GetToProduct(){
    this.ToProductList = [];
      const obj = {
        "SP_String": "SP_BL_Txn_Slag_To_RM_Stock_Transfer",
        "Report_Name_String": "Get_To_Product",
      }
      this.GlobalAPI.getData(obj).subscribe((data: any) => {
        if(data.length) {
            data.forEach(element => {
              element['label'] = element.Product_Description,
              element['value'] = element.Product_ID
            });
            this.ToProductList = data;
          } else {
            this.ToProductList = [];
          }
      })
  }
  GetBatchNo() {
    // if (this.ObjProductInfo.Product_Specification) {
    //  this.getUom(); 
    // }
    this.BatchNolist = []
    //if (this.ObjSlagtToRM.Cost_Cen_ID && this.ObjSlagtToRM.Product_Specification && this.ObjSlagtToRM.godown_id) {
      const TempObj = {
        Cost_Cen_ID: this.ObjSlagtToRM.F_Cost_Cen_ID,
        Godown_ID: this.ObjSlagtToRM.F_Godown_ID,
        Product_ID: this.ObjSlagtToRM.F_Product_ID,
      }
      const obj = {
        "SP_String": "SP_BL_Txn_Slag_To_RM_Stock_Transfer",
        "Report_Name_String": "Get_Batch",
        "Json_Param_String": JSON.stringify([TempObj])
      }
      this.GlobalAPI.getData(obj).subscribe((data: any) => {
        console.log("LotNolist  ===", data);
        this.BatchNolist = data;
        this.ObjSlagtToRM.Batch_No = this.BatchNolist.length ? this.BatchNolist[0].Batch_No : undefined;
      })
  }
  GetTaxAmt() {
    if (this.ObjSlagtToRM.Qty && this.ObjSlagtToRM.Rate) {
      this.ObjSlagtToRM.Amount = (this.ObjSlagtToRM.Qty * this.ObjSlagtToRM.Rate).toFixed(2);
    }
    else {
      this.ObjSlagtToRM.Amount = undefined;
    }
  }
  GetSelectedBatchqty () {
    // const sameproductwithbatch = this.productSubmit.filter(item=> item.Batch_No === this.ObjaddbillForm.Batch_No && item.Product_ID === this.ObjaddbillForm.Product_ID );
    // if(sameproductwithbatch.length) {
    //   this.compacctToast.clear();
    //       this.compacctToast.add({
    //         key: "compacct-toast",
    //         severity: "error",
    //         summary: "Warn Message",
    //         detail: "Product with same batch no. detected."
    //       });
    //   return false;
    // }
    const baychqtyarr = this.BatchNolist.filter(item=> item.Batch_No === this.ObjSlagtToRM.Batch_No);
      if(baychqtyarr.length) {
        if(this.ObjSlagtToRM.Qty <=  baychqtyarr[0].Batch_Qty) {
          return true;
        } else {
          this.compacctToast.clear();
          this.compacctToast.add({
            key: "compacct-toast",
            severity: "error",
            summary: "Warn Message",
            detail: "Quantity can't be more than in batch available quantity "
          });
          return false;
        }
      } else {
        return true;
      }
    }
  AddProduct(valid: any) {
    this.SlagtToRMFormSubmitted = true;
    if (valid && this.GetSelectedBatchqty()) {
      // const CostMatch: any = this.CenterList.filter((el: any) => Number(el.Cost_Cen_ID) === Number(this.ObjProductInfo.Cost_Cen_ID));
      const fromProductDArry: any = this.FromProductList.filter((el: any) => Number(el.Product_ID) === Number(this.ObjSlagtToRM.F_Product_ID));
      const toProductDArry: any = this.ToProductList.filter((el: any) => Number(el.Product_ID) === Number(this.ObjSlagtToRM.To_Product_ID));
      const LotNoArry: any = this.BatchNolist.filter((el: any) => el.Batch_No == this.ObjSlagtToRM.Batch_No);
      // const TaxCatArry: any = this.TaxCategoryList.filter((el: any) => Number(el.Cat_ID) === Number(this.Tax_Category));
      // this.ObjProductInfo.Cost_Cen_State = CostMatch[0].Cost_Cen_State;
      // this.ObjProductInfo.CGST_Rate = ProductDArry[0].CGST_Rate;
      // this.ObjProductInfo.SGST_Rate = ProductDArry[0].SGST_Rate;
      // this.ObjProductInfo.IGST_Rate = ProductDArry[0].IGST_Rate;
      // var gstper = Number(TaxCatArry[0].GST_Tax_Per / 2).toFixed(2);
      // this.ObjProductInfo.CGST_Rate = Number(gstper);
      // this.ObjProductInfo.SGST_Rate = Number(gstper);
      // this.ObjProductInfo.IGST_Rate = Number(TaxCatArry[0].GST_Tax_Per);
      // const SubLedgerState = this.ObjPurChaseBill.Sub_Ledger_State_2
      //   ? this.ObjPurChaseBill.Sub_Ledger_State_2.toUpperCase()
      //   : undefined;
      // const CostCenterState = this.ObjPurChaseBill.Cost_Cen_State
      //   ? this.ObjPurChaseBill.Cost_Cen_State.toUpperCase()
      //   : undefined;
      // if (SubLedgerState && CostCenterState) {
      //   if (SubLedgerState === CostCenterState) {
      //     this.ObjProductInfo.CGST_Amount = Number(((this.ObjProductInfo.Taxable_Amount * this.ObjProductInfo.CGST_Rate) / 100).toFixed(2));
      //     this.ObjProductInfo.SGST_Amount = Number(((this.ObjProductInfo.Taxable_Amount * this.ObjProductInfo.SGST_Rate) / 100).toFixed(2));
      //     this.ObjProductInfo.Net_Amt = Number(Number(this.ObjProductInfo.Taxable_Amount) + Number(this.ObjProductInfo.CGST_Amount) + Number(this.ObjProductInfo.SGST_Amount)).toFixed(2);
      //     this.ObjProductInfo.IGST_Amount = 0;
      //     this.ObjProductInfo.IGST_Rate = 0;
          
      //   }
      //   else {
      //     this.ObjProductInfo.IGST_Amount = Number(((this.ObjProductInfo.Taxable_Amount * this.ObjProductInfo.IGST_Rate) / 100).toFixed(2));
      //     this.ObjProductInfo.Net_Amt = Number(Number(this.ObjProductInfo.Taxable_Amount) + Number(this.ObjProductInfo.IGST_Amount)).toFixed(2);
      //     this.ObjProductInfo.CGST_Amount = 0;
      //     this.ObjProductInfo.CGST_Rate = 0;
      //     this.ObjProductInfo.SGST_Amount = 0;
      //     this.ObjProductInfo.SGST_Rate = 0;
      //   }
      // }
      // const GdwonArry: any = this.Godownlist.filter((el: any) => Number(el.godown_id) === Number(this.ObjProductInfo.godown_id));
      // const ProductArry: any = this.ProductType.filter((el: any) => Number(el.Product_Type_ID) === Number(this.ObjProductInfo.Product_Type_ID));
      // const ProductSubArry: any = this.ProductSub.filter((el: any) => Number(el.Product_Sub_Type_ID) === Number(this.ObjProductInfo.Product_Sub_Type_ID));
      const TemopArry = {
        F_Product_ID :this.ObjSlagtToRM.F_Product_ID,
        F_Product_Description: fromProductDArry.length ? fromProductDArry[0].Product_Description : undefined,
        To_Product_ID :this.ObjSlagtToRM.To_Product_ID,
        To_Product_Description: toProductDArry.length ? toProductDArry[0].Product_Description : undefined,
        Batch_No : this.ObjSlagtToRM.Batch_No,
        Batch_No_Show: LotNoArry.length ? LotNoArry[0].Batch_No_Show : undefined,
        Qty: this.ObjSlagtToRM.Qty,
        UOM: fromProductDArry[0].UOM,
        Rate: this.ObjSlagtToRM.Rate,
        Amount: Number(this.ObjSlagtToRM.Amount).toFixed(2),
      };
      this.AddProductList.push(TemopArry)
      // this.TotalCalculation();
      console.log("this.AddProdList", this.AddProductList)
      this.SlagtToRMFormSubmitted = false;
      this.ObjSlagtToRM.F_Product_ID = undefined;
      this.ObjSlagtToRM.To_Product_ID = undefined;
      this.ObjSlagtToRM.Batch_No = undefined;
      this.ObjSlagtToRM.Qty = undefined;
      this.ObjSlagtToRM.Rate = undefined;
      this.ObjSlagtToRM.Amount = undefined;
      
    }
  }
  DeleteProductList(index){
    this.AddProductList.splice(index,1);
  }
  SaveSlagToRM(){
    if (this.AddProductList.length) {
      this.compacctToast.clear();
     this.compacctToast.add({
       key: "s",
       sticky: true,
       severity: "warn",
       summary: "Are you sure?",
       detail: "Confirm to proceed"
     });
    }
  }
  onConfirmSave() {
    // this.SaveLowerData = [];
    // this.PurchaseBillFormSubmitted = true;
    // if (valid && this.AddProdList.length) {
        let SaveData:any = [];
      this.AddProductList.forEach(element => {
        const sendobj = {
          Doc_No : "A",
          Doc_Date : this.DateService.dateConvert(new Date(this.DocDate)),
          F_Cost_Cen_ID : this.ObjSlagtToRM.F_Cost_Cen_ID,
          F_Godown_ID : this.ObjSlagtToRM.F_Godown_ID,
          To_Cost_Cen_ID : this.ObjSlagtToRM.To_Cost_Cen_ID,
          To_Godown_ID : this.ObjSlagtToRM.To_Godown_ID,
          F_Product_ID : element.F_Product_ID,
          To_Product_ID : element.To_Product_ID,
          Batch_No : element.Batch_No,
          Qty : Number(element.Qty),
          UOM : element.UOM,
          Rate : Number(element.Rate),
          Amount : Number(element.Amount),
          Remarks : this.ObjSlagtToRM.Remarks,
          Created_By : this.$CompacctAPI.CompacctCookies.User_ID,
          Created_On : this.DateService.dateConvert(new Date())
        }
        SaveData.push(sendobj);
      });
      const obj = {
        "SP_String": "SP_BL_Txn_Slag_To_RM_Stock_Transfer",
        "Report_Name_String": "Insert_Data",
        "Json_Param_String": JSON.stringify(SaveData)
      }
      this.GlobalAPI.getData(obj).subscribe((data: any) => {
        var tempID = data[0].Column1;
        if (data[0].Column1) {
          this.compacctToast.clear();
          this.compacctToast.add({
            key: "compacct-toast",
            severity: "success",
            summary: tempID,
            detail: "successfully Create ",
          });
          this.ObjSlagtToRM = new SlagtToRM();
          this.AddProductList = [];
          this.DocDate = new Date();
          this.Spinner = false;
          this.seachSpinner = false;
          this.SlagtToRMFormSubmitted = false;
          this.FromGodownlist = [];
          this.ToGodownlist = [];
          this.FromProductList = [];
          this.BatchNolist = [];
          if(this.buttonname === "Update"){
            this.tabIndexToView = 0;
            this.items = ["BROWSE", "CREATE", "MIS"];
            this.buttonname = "Create";
          }
        }
        else {
          this.Spinner = false;
          this.seachSpinner = false;
          this.compacctToast.clear();
          this.compacctToast.add({
            key: "compacct-toast",
            severity: "error",
            summary: "Warn Message",
            detail: "Error Occured "
          });
        }
      }); 
     
    // }
  }
  
  onConfirm(){}
  onReject() {
    this.compacctToast.clear("c");
    this.compacctToast.clear("s");
  }
  getDateRange(dateRangeObj) {
    if (dateRangeObj.length) {
      this.start_date = dateRangeObj[0];
      this.end_date = dateRangeObj[1];
    }
  }
  GetSerarchBrowse() {
    const start = this.start_date
      ? this.DateService.dateConvert(new Date(this.start_date))
      : this.DateService.dateConvert(new Date());
    const end = this.end_date
      ? this.DateService.dateConvert(new Date(this.end_date))
      : this.DateService.dateConvert(new Date());
      
    this.seachSpinner = true;
    if (start && end) {
    const tempobj = {
      From_Date: start,
      To_Date: end
    }
      const obj = {
        "SP_String": "SP_BL_Txn_Slag_To_RM_Stock_Transfer",
        "Report_Name_String": "Browse_Data",
        "Json_Param_String": JSON.stringify([tempobj])
      }
      this.GlobalAPI.getData(obj).subscribe((data: any) => {
        console.log("SerarchOwterBillList", data)
        this.SerarchSearchSlagtoRMList = data;
        this.SerarchSearchSlagtoRMListHeader = data.length ? Object.keys(data[0]): [];
        this.seachSpinner = false;
      });
    }
  }
  View(viewobj){
    this.View_Doc_no = undefined;
    this.View_Doc_date = undefined;
    this.View_F_Cost_Cen_ID = undefined;
    this.View_F_Godown_ID = undefined;
    this.View_To_Cost_Cen_ID = undefined;
    this.View_To_Godown_ID = undefined;
    if(viewobj.Doc_No){
     this.View_Doc_no = viewobj.Doc_No;
     this.View_Doc_date = viewobj.Doc_Date;
     this.View_F_Cost_Cen_ID = viewobj.F_Cost_Cen_Name;
     this.View_F_Godown_ID = viewobj.F_Godown_Name;
     this.View_To_Cost_Cen_ID = viewobj.To_Cost_Cen_Name;
     this.View_To_Godown_ID = viewobj.To_Godown_Name;
     this.ViewData(viewobj.Doc_No)
    }
   }
  ViewData(Doc_No){
    const objj = {
      "SP_String": "SP_BL_Txn_Slag_To_RM_Stock_Transfer",
      "Report_Name_String": "View_Data",
      "Json_Param_String": JSON.stringify([{Doc_No : Doc_No}])
    }
    this.GlobalAPI.getData(objj).subscribe((data:any)=>{
      console.log("data",data);
      this.ViewList = data;
        this.ViewPoppup = true;
    })
  }

  //MIS
getDateRangeMIS(dateRangeObj) {
  if (dateRangeObj.length) {
    this.ObjMIS.From_Date = dateRangeObj[0];
    this.ObjMIS.To_Date = dateRangeObj[1];
  }
  }
  GetMISreport(valid){
    this.misReportList = [];
    this.BackupMisReport = [];
    this.DynamicHeaderMISreport = [];
    this.MISreportFormSubmit = true;
    this.MISSpinner = true;
  const start = this.ObjMIS.From_Date
  ? this.DateService.dateConvert(new Date(this.ObjMIS.From_Date))
  : this.DateService.dateConvert(new Date());
  const end = this.ObjMIS.To_Date
  ? this.DateService.dateConvert(new Date(this.ObjMIS.To_Date))
  : this.DateService.dateConvert(new Date());
  const tempobj = {
    From_Date : start,
    To_Date : end,
    // Company_ID : this.ObjMIS.Company_ID,
  }
  // console.log("valid",valid)
  if (valid) {
    const obj = {
      "SP_String": "SP_BL_Txn_Slag_To_RM_Stock_Transfer",
      "Report_Name_String": "MIS_Tab_Data",
      "Json_Param_String": JSON.stringify([tempobj])
      }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      this.misReportList = data;
      this.BackupMisReport = data;
      if(this.misReportList.length){
        this.DynamicHeaderMISreport = Object.keys(data[0]);
      }
      this.MISSpinner = false
      this.MISreportFormSubmit = false;
    })
    }
    else {
      this.MISSpinner = false;
    }
  }
  exportoexcel(Arr,fileName): void {
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(Arr);
    const workbook: XLSX.WorkBook = {Sheets: {'data': worksheet}, SheetNames: ['data']};
    XLSX.writeFile(workbook, fileName+'.xlsx');
  }

}
class SlagtToRM {
  Doc_No : any;
  Doc_Date : any;
  F_Cost_Cen_ID : any;
  F_Godown_ID : any;
  To_Cost_Cen_ID : any;
  To_Godown_ID : any;
  F_Product_ID : any;
  From_Product_Description : any;
  To_Product_ID : any;
  To_Product_Description : any;
  Batch_No : any;
  Qty : any;
  UOM : any;
  Rate : any;
  Amount : any;
  Remarks : any;
  Created_By : any;
  Created_On : any;
}
class MIS {
  From_Date : Date;
  To_Date : Date;
}
