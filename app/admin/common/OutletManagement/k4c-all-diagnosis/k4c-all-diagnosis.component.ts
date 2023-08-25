import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MessageService } from 'primeng/api';
import { DateTimeConvertService } from '../../../shared/compacct.global/dateTime.service';
import { CompacctCommonApi } from '../../../shared/compacct.services/common.api.service';
import { CompacctHeader } from '../../../shared/compacct.services/common.header.service';
import { CompacctGlobalApiService } from '../../../shared/compacct.services/compacct.global.api.service';
import { ExportExcelService } from '../../../shared/compacct.services/export-excel.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-k4c-all-diagnosis',
  templateUrl: './k4c-all-diagnosis.component.html',
  styleUrls: ['./k4c-all-diagnosis.component.css'],
  providers: [MessageService],
  encapsulation: ViewEncapsulation.None
})
export class K4cAllDiagnosisComponent implements OnInit {
  items:any = [];
  tabIndexToView = 0;
  seachSpinner = false;
  From_Date: Date = new Date();
  To_Date: Date = new Date();
  GridList:any = [];
  GridListHeader:any = [];
  GetDataList: any = [];

  constructor(
    private Header: CompacctHeader,
    private CompacctToast: MessageService,
    private GlobalAPI: CompacctGlobalApiService,
    private $CompacctAPI: CompacctCommonApi,
    private DateService: DateTimeConvertService,
    private ngxService: NgxUiLoaderService,
    private ExportExcelService: ExportExcelService,
  ) { }

  ngOnInit() {
    this.Header.pushHeader({
      Header: "Diagnosis",
      Link: "Diagnosis"
    });
  }
  //K4C DIAGNOSIS
  getDateRangediagnosis(dateRangeObj: any) {
    if (dateRangeObj.length) {
      this.From_Date = dateRangeObj[0];
      this.To_Date = dateRangeObj[1];
    }
  }
  GetGridData(){
    this.GridList = [];
    this.GridListHeader = [];
    this.seachSpinner = true;
    const start = this.From_Date
    ? this.DateService.dateConvert(new Date(this.From_Date))
    : this.DateService.dateConvert(new Date());
    const end = this.To_Date
    ? this.DateService.dateConvert(new Date(this.To_Date))
    : this.DateService.dateConvert(new Date());
    const senddata = {
      From_Date : start,
      To_Date : end
    }
    const obj = {
      "SP_String": "SP_Add_ON",
      "Report_Name_String": "Get_K4C_Diagnosis_Adv_Order_Del_To_Franchise",
      "Json_Param_String": JSON.stringify([senddata])
    }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      this.GridList = data;
      this.GridListHeader = data.length ? Object.keys(data[0]): []
      this.seachSpinner = false;
      //  console.log("GridList ===",this.GridList);
    })
  } 
  // editdiagnosismaster(eROW){
  //   //console.log("editmaster",eROW);
  //     this.clearData();
  //     this.canbilldate = "";
  //     this.rowCostcenter = "";
  //     this.Created_By = undefined;
  //     if(eROW.Bill_No){
  //       this.ngxService.start();
  //     this.Objcustomerdetail.Bill_No = eROW.Bill_No;
  //     this.canbilldate = new Date(eROW.Bill_Date);
  //     // this.rowCostcenter = eROW.Cost_Cent_ID;
  //     // this.ObjaddbillForm.selectitem = this.rowCostcenter;
  //     // this.autoaFranchiseBill();
  //     // this.CustumerName = eROW.Customer_Name;
  //     //this.Browsetab = false;
  //     this.items = ["BROWSE","UPDATE","DIAGNOSIS"];
  //     this.buttonname = "Update";
  //      //console.log("this.EditDoc_No ", this.Objcustomerdetail.Bill_No );
  //     // this.GetProductTypeFilterList();
  //     // this.getselectitem();
  //     // if (this.CustumerName == "SWIGGY" || this.CustumerName == "ZOMATO") {
  //     //   this.getonlinewalletlist();
  //     // } else {
  //     //   this.getwalletamount();
  //     // }
  //     this.geteditdiagnosismaster(this.Objcustomerdetail.Bill_No);
  //     //this.getadvorderdetails(this.Objcustomerdetail.Bill_No);
  //     }
  // }
  // geteditdiagnosismaster(Bill_No){
  //   //console.log("Doc_No",Bill_No);
  //   const obj = {
  //     "SP_String": "SP_Controller_Master",
  //     "Report_Name_String": "Get Outlet Bill Details For Edit",
  //     "Json_Param_String": JSON.stringify([{Doc_No : this.Objcustomerdetail.Bill_No}])
  
  //   }
  //   this.GlobalAPI.getData(obj).subscribe((data:any)=>{
  //     this.editList = data;
  //     this.rowCostcenter = data[0].Cost_Cent_ID;
  //     this.ObjaddbillForm.selectitem = data[0].Cost_Cent_ID;
  //     this.autoaFranchiseBill();
  //     this.GetProductTypeFilterList();
  //     this.getselectitem();
  //     this.CustumerName = data[0].Wallet_Ac;
  //     if(this.CustumerName === "SWIGGY" || this.CustumerName === "ZOMATO") {
  //       this.getonlinewalletlist();
  //     } else {
  //       this.getwalletamount();
  //     }
  //     this.ObjaddbillForm.Advance = data[0].Online_Order_No ? data[0].Online_Order_No : data[0].Adv_Order_No;
  //     this.Online_Order_No = data[0].Online_Order_No;
  //     this.Online_Order_Date = data[0].Online_Order_Date ? new Date(data[0].Online_Order_Date) : null;
  //     this.Objcustomerdetail.Costomer_Mobile = data[0].Costomer_Mobile;
  //     this.Objcustomerdetail.Customer_Name= data[0].Customer_Name;
  //     // this.Objcustomerdetail.Customer_DOB = data[0].Customer_DOB;
  //     // this.Objcustomerdetail.Customer_Anni= data[0].Customer_Anni;
  //     this.Objcustomerdetail.Customer_DOB = data[0].Customer_DOB ? this.DateService.dateConvert(data[0].Customer_DOB) : undefined;
  //     this.Objcustomerdetail.Customer_Anni= data[0].Customer_Anni ? this.DateService.dateConvert(data[0].Customer_Anni) : undefined;
  //     this.Objcustomerdetail.Customer_GST = data[0].Customer_GST;
  //     this.Objcustomerdetail.Bill_Remarks = data[0].Bill_Remarks;
  //     this.Objcustomerdetail.Cuppon_No = data[0].Cuppon_No;
  //     this.Objcustomerdetail.Cuppon_OTP = data[0].Cuppon_OTP;
  //     this.Created_By = data[0].Created_By;
  
  //     data.forEach(element => {
  //     const  productObj = {
  //         Product_ID : element.Product_ID,
  //         Product_Description : element.Product_Description,
  //         Modifier : element.Product_Modifier,
  //         product_type : element.Product_Type,
  //         is_service : element.Is_Service,
  //         Net_Price : Number(element.Rate),
  //         Delivery_Charge : Number(element.Delivery_Charge),
  //         Batch_No : element.Batch_No,
  //         Stock_Qty :  Number(element.Qty),
  //         Amount : Number(element.Amount).toFixed(2),
  //         Amount_berore_Tax : Number(element.Taxable).toFixed(2),
  //         Max_Discount : Number(element.Discount_Per),
  //         Dis_Amount : Number(element.Discount_Amt).toFixed(2),
  //         Taxable : Number(Number(element.Taxable) - Number(element.Discount_Amt)).toFixed(2),
  //         Gross_Amount : Number(element.Taxable).toFixed(2),
  //         SGST_Per : Number(element.SGST_Per).toFixed(2),
  //         SGST_Amount : Number(element.SGST_Amt).toFixed(2),
  //         CGST_Per : Number(element.CGST_Per).toFixed(2),
  //         CGST_Amount : Number(element.CGST_Amt).toFixed(2),
  //         GST_Tax_Per : Number(element.IGST_Per),
  //         GST_Tax_Per_forcalcu : Number(element.IGST_Per),
  //         GST_Tax_Per_Amt : element.IGST_Amt,
  //         Net_Amount : Number(element.Net_Amount).toFixed(2),
  //         Taxable_Amount : Number(element.Taxable),
  //         CGST_Output_Ledger_ID : Number(element.CGST_Output_Ledger_ID),
  //         SGST_Output_Ledger_ID : Number(element.SGST_Output_Ledger_ID),
  //         IGST_Output_Ledger_ID : Number(element.IGST_Output_Ledger_ID),
  //       };
  
  //       this.productSubmit.push(productObj);
  //     });
  //     //this.QueryStringObj && this.QueryStringObj.Txn_ID
  //     // if(data[0].Txn_ID){
  //     //   this.getwalletamount();
  //     //   // this.ObjcashForm.Wallet_Ac_ID = data[0].Wallet_Ac_ID ? data[0].Wallet_Ac_ID : undefined;
  //     //   // this.ObjcashForm.Wallet_Ac = data[0].Wallet_Ac ? data[0].Wallet_Ac : undefined;
  //     //   this.ObjcashForm.Wallet_Amount = data[0].Wallet_Amount ? data[0].Wallet_Amount : "";
  //     //   this.ObjcashForm.Credit_To_Ac_ID = data[0].Credit_To_Ac_ID ? data[0].Credit_To_Ac_ID : undefined;
  //     //   this.ObjcashForm.Credit_To_Ac = data[0].Credit_To_Ac ? data[0].Credit_To_Ac : undefined;
  //     //   this.ObjcashForm.Credit_To_Amount = data[0].Credit_To_Amount ? data[0].Credit_To_Amount : "";
  //     // } else {
  //       if (data[0].Credit_To_Ac_ID) {
  //         this.ObjcashForm.Credit_To_Ac_ID = data[0].Credit_To_Ac_ID;
  //         this.ObjcashForm.Credit_To_Ac = data[0].Credit_To_Ac;
  //         this.ObjcashForm.Credit_To_Amount = data[0].Credit_To_Amount;
  //         this.creditdisabled = false;
  //       } else {
  //         this.ObjcashForm.Credit_To_Ac_ID = undefined;
  //         this.ObjcashForm.Credit_To_Ac = undefined;
  //         this.ObjcashForm.Credit_To_Amount = "";
  //         this.creditdisabled = false;
  //       }
  //     // this.ObjcashForm.Credit_To_Ac_ID = data[0].Credit_To_Ac_ID ? data[0].Credit_To_Ac_ID : undefined;
  //     // this.ObjcashForm.Credit_To_Ac = data[0].Credit_To_Ac ? data[0].Credit_To_Ac : undefined;
  //     // this.ObjcashForm.Credit_To_Amount = data[0].Credit_To_Amount ? data[0].Credit_To_Amount : "";
  //     if (data[0].Wallet_Ac_ID) {
  //       this.ObjcashForm.Wallet_Ac_ID = data[0].Wallet_Ac_ID;
  //       this.ObjcashForm.Wallet_Ac = data[0].Wallet_Ac;
  //       this.ObjcashForm.Wallet_Amount = data[0].Wallet_Amount;
  //       // if (this.CustumerName == "SWIGGY" || this.CustumerName == "ZOMATO") {
  //       this.walletdisabled = false;
  //       // } else {
  //         // this.walletdisabled = true;
  //       // }
  //     } else {
  //       this.ObjcashForm.Wallet_Ac_ID = undefined;
  //       this.ObjcashForm.Wallet_Ac = undefined;
  //       this.ObjcashForm.Wallet_Amount = "";
  //       this.walletdisabled = false;
  //     }
  //     // this.ObjcashForm.Wallet_Ac_ID = data[0].Wallet_Ac_ID ? data[0].Wallet_Ac_ID : undefined;
  //     // this.ObjcashForm.Wallet_Ac = data[0].Wallet_Ac ? data[0].Wallet_Ac : undefined;
  //     // this.ObjcashForm.Wallet_Amount = data[0].Wallet_Amount ? data[0].Wallet_Amount : "";
  //     this.ObjcashForm.Cash_Amount = data[0].Cash_Amount ? data[0].Cash_Amount : "";
  //     this.ObjcashForm.Card_Amount = data[0].Card_Amount ? data[0].Card_Amount : "";
  //     this.ObjcashForm.Total_Paid = data[0].Total_Paid;
  //     this.ObjcashForm.Refund_Amount = data[0].Refund_Amount;
  //     this.ObjcashForm.Due_Amount = data[0].Due_Amount;
  
  //     this.Objcustomerdetail.Foot_Fall_ID = data[0].Foot_Fall_ID;
  //     this.Objcustomerdetail.Cost_Cen_ID = data[0].Cost_Cen_ID;
  //     //this.ObjaddbillForm.Doc_Date = data[0].Order_Date;
  //     this.Objcustomerdetail.Bill_No = data[0].Bill_No;
  //     this.myDate = data[0].Bill_Date;
  //     this.Total = data[0].Net_Amount;
  //     this.Amount_Payable = data[0].Amount_Payable;
  //     this.Adv = data[0].Advance;
  //     this.Round_Off = data[0].Rounded_Off;
  
  //     this.CalculateTotalAmt();
  //     this.listofamount();
  //     setTimeout(()=>{
  //     this.tabIndexToView = 1;
  //     this.ngxService.stop();
  //     },800)
  //   //console.log("this.editList  ===",data);
  //  //this.myDate =  new Date(data[0].Column1);
  //   // on save use this
  //  // this.ObjRequistion.Req_Date = this.DateService.dateTimeConvert(new Date(this.myDate));
  
  // })
  // }

}
