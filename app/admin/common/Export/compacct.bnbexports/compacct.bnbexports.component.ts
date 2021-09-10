import {
  Component,
  OnInit,
  ViewEncapsulation,
  ViewChildren,
  ViewChild,
  HostListener
} from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { CompacctGlobalUrlService } from "../../../shared/compacct.global/global.service.service";
import { DateTimeConvertService } from "../../../shared/compacct.global/dateTime.service";
import { CompacctHeader } from "../../../shared/compacct.services/common.header.service";
import { CompacctCommonApi } from "../../../shared/compacct.services/common.api.service";
import { MessageService } from "primeng/api";
import { CompacctAccountJournal } from "../../../shared/compacct.services/compacct.mainstreamApi/cmpacct.account-journal";

declare var $: any;
import * as moment from "moment";
import { AnyARecord } from "dns";
import { CompacctVendorComponent } from "../../../shared/compacct.components/compacct.forms/compacct.vendor/compacct.vendor.component";
import { CompacctCostcenterComponent } from "../../../shared/compacct.components/compacct.forms/compacct.costcenter/compacct.costcenter.component";

@Component({
  selector: "app-compacct.bnbexports",
  templateUrl: "./compacct.bnbexports.component.html",
  styleUrls: ["./compacct.bnbexports.component.css"],
  providers: [MessageService],
  encapsulation: ViewEncapsulation.None
})
export class CompacctBnbexportsComponent implements OnInit {
  buttonname = "Create";
  titleText = "Create Export Charge";
  url = window["config"];
  DisplayBnbExportChargesModal = false;
  BnbExportChargesFormSubmitted = false;
  BnbExportChargesroductFormSubmitted = false;
  BnbExportChargesInfoSubmitted = false;
  saveSpinner = false;
  seachSpinner = false;

  igstDisable = false;
  cgstDisable = false;
  sgstDisable = false;
  closeDialog = false;

  DocDate = new Date();
  BLDate: any;
  SBDate: any;
  SupBillDate: any;
  DebitNoteDate: any;
  ObjSubLedger: any;
  ObjCostCenter: any;

  BNBExportChargesList = [];
  NativeProductList = [];
  ProductsList = [];
  ProductInfoListView = [];
  ProductInfoListProto = [];
  CatidwithAmount = [];
  SelectedProduct = undefined;
  ObjSearch = {
    Start_Date: "",
    End_Date: ""
  };
  ObjDocDetails = new DocDetails();
  ObjProductInfo = new ProductInfo();

  ObjBillDetails = new PurchaseBillDetails();

  ObjVoucherCommon: VoucherCommon = new VoucherCommon();
  ObjVoucherTopper: VoucherTopper = new VoucherTopper();
  @ViewChild("Vendor", { static: false })
  VendorInput: CompacctVendorComponent;
  @ViewChild("CostCenter", { static: false })
  CostCenterInput: CompacctCostcenterComponent;
  @HostListener("document:keydown.escape", ["$event"]) onKeydownHandler(
    event: KeyboardEvent
  ) {
    this.DisplayBnbExportChargesModal = false;
  }
  constructor(
    private $http: HttpClient,
    private urlService: CompacctGlobalUrlService,
    private Header: CompacctHeader,
    private DateService: DateTimeConvertService,
    private $CompacctAPI: CompacctCommonApi,
    private compacctToast: MessageService,
    private AccountJornal: CompacctAccountJournal
  ) {
    this.ObjSearch.Start_Date = this.DateService.dateConvert(new Date());
    this.ObjSearch.End_Date = this.DateService.dateConvert(new Date());
  }

  ngOnInit() {
    this.Header.pushHeader({
      Header: "Export Charges",
      Link: " Exports -> Exports Charges "
    });
  }

  getCostCenterData(e) {
    this.ObjCostCenter = undefined;
    this.ObjBillDetails.Cost_Cen_ID = undefined;
    this.ObjVoucherCommon.Cost_Cen_ID_Trn = undefined;
    if (e.Cost_Cen_State) {
      this.ObjCostCenter = e;
      this.ObjBillDetails.Cost_Cen_ID = e.Cost_Cen_ID;
      this.ObjVoucherCommon.Cost_Cen_ID_Trn = e.Cost_Cen_ID;
    }
  }
  getSubLedgerData(e) {
    this.ObjSubLedger = undefined;
    this.ObjVoucherTopper.Sub_Ledger_ID = undefined;
    this.ObjVoucherTopper.Ledger_ID = undefined;
    if (e.Sub_Ledger_State) {
      this.ObjSubLedger = e;
      this.ObjVoucherTopper.Sub_Ledger_ID = e.Sub_Ledger_ID;
      this.ObjVoucherTopper.Ledger_ID = e.Ledger_ID;
    }
  }

  GetProduct(materialSubType) {
    const params = {
      Pur_Doc_No: this.ObjProductInfo.Pur_Order_No
        ? this.ObjProductInfo.Pur_Order_No
        : "0",
      Doc_Date: this.DateService.dateConvert(new Date()),
      Material_Type: "EXPORT CHARGES"
    };
    // const PurchaseOrd = this.ObjProductInfo.Pur_Order_No ? this.ObjProductInfo.Pur_Order_No : 0;
    this.$http
      .get("/Common/Get_Product_Purchaseable_Bill_with_GST_Tax_Material_Type", {
        params
      })
      .subscribe((data: any) => {
        this.NativeProductList = data ? JSON.parse(data) : [];
        this.NativeProductList.forEach(el => {
          if (el.Material_Sub_Type === materialSubType) {
            this.ProductsList.push({
              label: el.Product_Name,
              value: el.Product_ID
            });
          }
        });
      });
  }

  // FUNCTION
  GetDocDateWiseFinancialYearId() {
    const finDateFetch = this.ObjDocDetails.Doc_Date
      ? this.ObjDocDetails.Doc_Date
      : this.DateService.dateConvert(new Date());
    const obj = new HttpParams().set("DocDate", finDateFetch);
    this.$http
      .get(this.url.apiGetDocDateWiseFinancialYearId, { params: obj })
      .subscribe((data: any) => {
        this.ObjVoucherCommon.Fin_Year_ID = JSON.parse(data)[0].Fin_Year_ID;
        this.ObjDocDetails.Fin_Year_ID = this.ObjVoucherCommon.Fin_Year_ID;
      });
  }
  CalculateRateInr() {
    if (this.ObjProductInfo.Rate_Actual && this.ObjProductInfo.Conversion) {
      const rateInr = (
        Number(this.ObjProductInfo.Rate_Actual) *
        Number(this.ObjProductInfo.Conversion)
      ).toFixed(2);
      this.ObjProductInfo.Rate = Number(rateInr);
    } else {
      this.ObjProductInfo.Rate = 0;
    }
    this.CalculateAmount();
  }
  CalculateQty() {
    if (this.ObjProductInfo.No_Of_Bag && this.ObjProductInfo.Qty) {
      const GW = (
        Number(this.ObjProductInfo.Qty) / Number(this.ObjProductInfo.No_Of_Bag)
      ).toFixed(2);
      this.ObjProductInfo.Gross_Wt = Number(GW);
    } else {
      this.ObjProductInfo.Gross_Wt = 0;
    }
    this.CalculateAmount();
  }
  CalculateAmount() {
    if (this.ObjProductInfo.Rate && this.ObjProductInfo.Qty) {
      this.ObjProductInfo.Amount =
        Number(this.ObjProductInfo.Rate) * Number(this.ObjProductInfo.Qty);
      this.ObjProductInfo.Taxable_Amount = this.ObjProductInfo.Amount;
    } else {
      this.ObjProductInfo.Amount = 0;
      this.ObjProductInfo.Taxable_Amount = this.ObjProductInfo.Amount;
    }
    this.CalculateTaxandNet();
  }
  CalculateTaxandNet() {
    this.ObjProductInfo.Total = 0;
    this.igstDisable = false;
    this.cgstDisable = false;
    this.sgstDisable = false;
    const SubLedgerState = this.ObjSubLedger.Sub_Ledger_State
      ? this.ObjSubLedger.Sub_Ledger_State.toUpperCase()
      : undefined;
    const CostCenterState = this.ObjCostCenter.Cost_Cen_State
      ? this.ObjCostCenter.Cost_Cen_State.toUpperCase()
      : undefined;
    this.ObjProductInfo.Taxable_Amount = Number(
      this.ObjProductInfo.Amount ? this.ObjProductInfo.Amount : 0
    );
    if (SubLedgerState && CostCenterState) {
      if (!!this.ObjProductInfo.Qty && !!this.ObjProductInfo.Rate) {
        if (SubLedgerState === CostCenterState) {
          this.ObjProductInfo.CGST_Amount = Number(
            (
              (this.ObjProductInfo.Taxable_Amount *
                this.ObjProductInfo.CGST_Rate) /
              100
            ).toFixed(2)
          );
          this.ObjProductInfo.SGST_Amount = Number(
            (
              (this.ObjProductInfo.Taxable_Amount *
                this.ObjProductInfo.SGST_Rate) /
              100
            ).toFixed(2)
          );
          this.ObjProductInfo.IGST_Amount = 0;
          this.ObjProductInfo.IGST_Rate = 0;
          this.igstDisable = true;
          this.cgstDisable = false;
          this.sgstDisable = false;
        } else {
          this.ObjProductInfo.IGST_Amount = Number(
            (
              (this.ObjProductInfo.Taxable_Amount *
                this.ObjProductInfo.IGST_Rate) /
              100
            ).toFixed(2)
          );
          this.ObjProductInfo.CGST_Amount = 0;
          this.ObjProductInfo.CGST_Rate = 0;
          this.ObjProductInfo.SGST_Amount = 0;
          this.ObjProductInfo.SGST_Rate = 0;
          this.igstDisable = false;
          this.cgstDisable = true;
          this.sgstDisable = true;
        }
        this.ObjProductInfo.Total =
          this.ObjProductInfo.CGST_Amount +
          this.ObjProductInfo.IGST_Amount +
          this.ObjProductInfo.SGST_Amount +
          this.ObjProductInfo.Taxable_Amount;
      }
    } else {
      this.compacctToast.clear();
      this.compacctToast.add({
        key: "compacct-toast",
        severity: "error",
        summary: "Warn Message",
        detail: "Please Choose  Cost Center or Subledger State"
      });
    }
  }

  CalculateTotalAmount() {
    this.ObjBillDetails.Total_Amount = 0;
    let totalAmount = 0;
    this.ProductInfoListView.forEach(elem => {
      totalAmount = totalAmount + Number(elem.Total);
    });
    this.ObjBillDetails.Total_Amount = Number(totalAmount).toFixed(2);
    if (this.ProductInfoListView.length == null) {
      this.ObjBillDetails.Total_Amount = undefined;
    }
  }
  CalculateTaxableAmount() {
    this.ObjBillDetails.Taxable_Amt = 0;
    let taxableAmount = 0;
    this.ProductInfoListView.forEach(elem => {
      taxableAmount = taxableAmount + Number(elem.Taxable_Amount);
    });
    this.ObjBillDetails.Taxable_Amt = Number(taxableAmount).toFixed(2);
    if (this.ProductInfoListView.length == null) {
      this.ObjBillDetails.Taxable_Amt = undefined;
    }
  }
  CalculateCGSTAmount() {
    this.ObjBillDetails.CGST_Amt = 0;
    let cgstAmount = 0;
    this.ProductInfoListView.forEach(elem => {
      cgstAmount = cgstAmount + Number(elem.CGST_Amount);
    });
    this.ObjBillDetails.CGST_Amt = Number(cgstAmount).toFixed(2);
    if (this.ProductInfoListView.length == null) {
      this.ObjBillDetails.CGST_Amt = undefined;
    }
  }
  CalculateSGSTAmount() {
    this.ObjBillDetails.SGST_Amt = 0;
    let sgstAmount = 0;
    this.ProductInfoListView.forEach(elem => {
      sgstAmount = sgstAmount + Number(elem.SGST_Amount);
    });
    this.ObjBillDetails.SGST_Amt = Number(sgstAmount).toFixed(2);
    if (this.ProductInfoListView.length == null) {
      this.ObjBillDetails.SGST_Amt = undefined;
    }
  }
  CalculateIGST() {
    this.ObjBillDetails.IGST_Amt = 0;
    let igstAmount = 0;
    this.ProductInfoListView.forEach(elem => {
      igstAmount = igstAmount + Number(elem.IGST_Amount);
    });
    this.ObjBillDetails.IGST_Amt = Number(igstAmount).toFixed(2);
    if (this.ProductInfoListView.length == null) {
      this.ObjBillDetails.IGST_Amt = undefined;
    }
  }
  CalculateGrossAmount() {
    let grossAmount = 0;
    for (let i = 0; i < this.ProductInfoListView.length; i++) {
      grossAmount =
        Number(grossAmount) + Number(this.ProductInfoListView[i].Total);
    }
    this.ObjBillDetails.Gross_Amt = Number(grossAmount).toFixed(2);
    // this.ObjBillDetails.Gross_Amt = (parseFloat(this.ObjBillDetails.Taxable_Amt)
    //                             + parseFloat(this.ObjBillDetails.Total)
    //                             + parseFloat(this.ObjBillDetails.SGST_Amt)
    //                             + parseFloat(this.ObjBillDetails.IGST_Amt)).toFixed(2);
    //   +parseFloat(ctrl.ObjSaleBill.Term_Amt || 0)
  }
  CalculateNetAmount() {
    this.ObjBillDetails.Net_Amt = Math.round(this.ObjBillDetails.Total_Amount);
    this.ObjVoucherTopper.CR_Amt = this.ObjBillDetails.Net_Amt;
  }
  CalculateRoundedOff() {
    this.ObjBillDetails.ROUNDED_OFF = (
      this.ObjBillDetails.Net_Amt - this.ObjBillDetails.Total_Amount
    ).toFixed(2);
  }
  //  OPEN / EDIT BNB CHARGES MODAL
  ExportChargeModalOpen(obj, materialSubType) {
    if (obj.Com_Inv_No) {
      this.titleText = "Create Export Charge";
      this.buttonname = "Create";
      this.CloseBnbExportsCharges();
      this.GetProduct(materialSubType);
      this.ObjBillDetails.Com_Inv_No = obj.Com_Inv_No;
      this.ObjBillDetails.Export_Charge_Type = materialSubType;
      this.DisplayBnbExportChargesModal = !this.DisplayBnbExportChargesModal;
    }
  }
  ExportChargeEditModalOpen(obj, materialSubType) {
    if (obj.Com_Inv_No) {
      // this.$CompacctAPI.compacctSpinnerShow();
      this.buttonname = "Update";
      this.titleText =
        "Update ( " +
        materialSubType +
        "  Bill -" +
        obj[materialSubType] +
        " )";
      this.CloseBnbExportsCharges();
      this.GetProduct(materialSubType);
      this.GetPurchaseBillEditData(obj[materialSubType]);
      this.ObjBillDetails.Com_Inv_No = obj.Com_Inv_No;
      this.ObjBillDetails.Export_Charge_Type = materialSubType;
      this.DisplayBnbExportChargesModal = !this.DisplayBnbExportChargesModal;
    }
  }
  // CHANGE EVENTS
  getDateRange(dateRangeObj) {
    if (dateRangeObj.length) {
      this.ObjSearch.Start_Date = this.DateService.dateConvert(dateRangeObj[0]);
      this.ObjSearch.End_Date = this.DateService.dateConvert(dateRangeObj[1]);
    }
  }
  GetDocdate(docDate) {
    if (docDate) {
      this.ObjDocDetails.Doc_Date = this.DateService.dateConvert(
        moment(docDate, "YYYY-MM-DD")["_d"]
      );
      // this.GetDocDateWiseFinancialYearId();
    }
  }
  GetBLdate(cnDate) {
    this.ObjBillDetails.BL_Date = undefined;
    if (cnDate) {
      this.ObjBillDetails.BL_Date = this.DateService.dateConvert(
        moment(cnDate, "YYYY-MM-DD")["_d"]
      );
    }
  }
  GetSBdate(cnDate) {
    this.ObjBillDetails.SB_Date = undefined;
    if (cnDate) {
      this.ObjBillDetails.SB_Date = this.DateService.dateConvert(
        moment(cnDate, "YYYY-MM-DD")["_d"]
      );
    }
  }
  GetSupBillDate(cnDate) {
    this.ObjBillDetails.Supplier_Bill_Date = undefined;
    if (cnDate) {
      this.ObjBillDetails.Supplier_Bill_Date = this.DateService.dateConvert(
        moment(cnDate, "YYYY-MM-DD")["_d"]
      );
    }
  }
  GetDebitNoteDate(cnDate) {
    if (cnDate) {
      this.ObjBillDetails.Debit_Note_Date = this.DateService.dateConvert(
        moment(cnDate, "YYYY-MM-DD")["_d"]
      );
    }
  }

  ProductChange(productID) {
    this.ObjProductInfo = new ProductInfo();
    this.ObjProductInfo.Batch_Number = undefined;
    // this.Godowndisable = false;
    if (productID) {
      if (this.ObjCostCenter.Cost_Cen_ID) {
        const List = this.NativeProductList.map(x => Object.assign({}, x));
        const obj = $.grep(List, function(value) {
          return value.Product_ID === parseFloat(productID);
        })[0];
        this.ObjProductInfo.Product_ID = obj.Product_ID;
        this.ObjProductInfo.Product_Name = obj.Product_Name;
        this.ObjProductInfo.UOM = obj.UOM;
        // this.AltUOM = obj.Alt_UOM;
        // this.UOM = obj.UOM;
        this.ObjProductInfo.HSL_No = obj.HSN_No;
        this.ObjProductInfo.Product_Specification = obj.Product_Spec;
        this.ObjProductInfo.CGST_Rate = obj.CGST_Rate;
        this.ObjProductInfo.SGST_Rate = obj.SGST_Rate;
        this.ObjProductInfo.IGST_Rate = obj.IGST_Rate;
        // this.ObjProductInfo.Is_Service = obj.Is_Service;
        this.ObjProductInfo.Discount_Ledger_ID = obj.Discount_Ledger_ID;
        this.ObjProductInfo.Product_Name = obj.Product_Name;
        this.ObjProductInfo.Ledger_ID = obj.Ledger_ID;
        this.ObjProductInfo.Cat_ID = obj.Cat_ID;
        this.ObjProductInfo.Cat_Name = obj.Cat_Name;
        this.ObjProductInfo.CGST_Rate = obj.CGST_Rate;
        this.ObjProductInfo.SGST_Rate = obj.SGST_Rate;
        this.ObjProductInfo.IGST_Rate = obj.IGST_Rate;
        this.ObjProductInfo.CGST_Input_Ledger_ID = obj.CGST_Input_Ledger_ID;
        this.ObjProductInfo.SGST_Input_Ledger_Id = obj.SGST_Input_Ledger_Id;
        this.ObjProductInfo.IGST_Input_Ledger_ID = obj.IGST_Input_Ledger_ID;
        this.ObjProductInfo.Discount_Ledger_ID = obj.Discount_Ledger_ID;
        // ctrl.UOM = obj.UOM;
        this.ObjProductInfo.MRP = 0;
        this.ObjProductInfo.Rate = 0;
        this.ObjProductInfo.Amount = 0;
        this.ObjProductInfo.Taxable_Amount = 0;
        this.ObjProductInfo.Serial_No = undefined;

        this.ObjProductInfo.Product_Expiry = obj.Product_Expiry;
      } else {
        this.SelectedProduct = undefined;
        this.compacctToast.add({
          key: "compacct-toast",
          severity: "error",
          summary: "Warn Message",
          detail: "Please Select From Cost Center."
        });
      }
    }
  }

  // ADD PRODUCT
  AddProductInfo(valid) {
    this.BnbExportChargesInfoSubmitted = true;
    this.BnbExportChargesroductFormSubmitted = true;
    const valid2 =
      (
        Number(this.ObjProductInfo.Taxable_Amount) +
        Number(this.ObjProductInfo.CGST_Amount) +
        Number(this.ObjProductInfo.IGST_Amount) +
        Number(this.ObjProductInfo.SGST_Amount)
      ).toFixed(2) === Number(this.ObjProductInfo.Total).toFixed(2)
        ? true
        : false;
    console.log(
      Number(this.ObjProductInfo.Total) +
        "==" +
        Number(this.ObjProductInfo.Taxable_Amount) +
        "+" +
        Number(this.ObjProductInfo.CGST_Amount) +
        "+" +
        Number(this.ObjProductInfo.IGST_Amount) +
        "+" +
        Number(this.ObjProductInfo.SGST_Amount)
    );
    if (valid && valid2) {
      const SubLedgerState = this.ObjSubLedger.Sub_Ledger_State
        ? this.ObjSubLedger.Sub_Ledger_State.toUpperCase()
        : undefined;
      const CostCenterState = this.ObjCostCenter.Cost_Cen_State
        ? this.ObjCostCenter.Cost_Cen_State.toUpperCase()
        : undefined;
      if (SubLedgerState && CostCenterState) {
        this.ObjProductInfo.godown_id = 0;
        this.ProductInfoListProto.push(this.ObjProductInfo);
        this.ProductInfoListView = this.ProductInfoListProto;
        this.BnbExportChargesInfoSubmitted = false;
        this.BnbExportChargesroductFormSubmitted = false;

        this.SelectedProduct = undefined;

        this.CalculateTotalAmount();
        this.CalculateTaxableAmount();
        this.CalculateIGST();
        this.CalculateSGSTAmount();
        this.CalculateCGSTAmount();

        this.CalculateGrossAmount();
        this.CalculateNetAmount();
        this.CalculateRoundedOff();
        this.AddCatIDAmountLedgerID();

        this.ObjProductInfo = new ProductInfo();
      } else {
        this.compacctToast.clear();
        this.compacctToast.add({
          key: "compacct-toast",
          severity: "error",
          summary: "Warn Message",
          detail: "Please choose  Cost Center or Subledger State"
        });
      }
    } else if (!valid2) {
      this.compacctToast.clear();
      this.compacctToast.add({
        key: "compacct-toast",
        severity: "error",
        summary: "Warn Message",
        detail: "Sum of Tax Amount and Product is Not Equivalent To Net Amount "
      });
    }
  }
  AddCatIDAmountLedgerID() {
    this.CatidwithAmount = [];
    for (let i = 0; i < this.ProductInfoListProto.length; i++) {
      this.CatidwithAmount.push({
        Cat_ID: this.ProductInfoListProto[i].Cat_ID,
        Amount: this.ProductInfoListProto[i].Amount,
        Ledger_ID: this.ProductInfoListProto[i].Ledger_ID,
        CGST_Input_Ledger_ID: this.ProductInfoListProto[i].CGST_Input_Ledger_ID,
        SGST_Input_Ledger_Id: this.ProductInfoListProto[i].SGST_Input_Ledger_Id,
        IGST_Input_Ledger_ID: this.ProductInfoListProto[i].IGST_Input_Ledger_ID,
        Discount_Ledger_ID: this.ProductInfoListProto[i].Discount_Ledger_ID,
        CGST_Amount: this.ProductInfoListProto[i].CGST_Amount,
        SGST_Amount: this.ProductInfoListProto[i].SGST_Amount,
        IGST_Amount: this.ProductInfoListProto[i].IGST_Amount,
        Discount_Type_Amount: this.ProductInfoListProto[i].Discount_Type_Amount
      });
    }
  }
  DeleteOtherInfo(productArrayIndex) {
    this.ProductInfoListView.splice(productArrayIndex, 1);
    this.ProductInfoListProto = this.ProductInfoListView;
    this.CalculateTotalAmount();
    this.CalculateTaxableAmount();
    this.CalculateIGST();
    this.CalculateSGSTAmount();
    this.CalculateCGSTAmount();

    this.CalculateGrossAmount();
    this.CalculateNetAmount();
    this.CalculateRoundedOff();
    this.AddCatIDAmountLedgerID();
  }
  //  SEARCH
  SearchBNBCharge(valid) {
    this.BNBExportChargesList = [];
    if (valid) {
      this.seachSpinner = true;

      this.$http
        .get("/Export_Charges/Get_Export_Charges_Browse", {
          params: this.ObjSearch
        })
        .subscribe((data: any) => {
          this.BNBExportChargesList = data ? JSON.parse(data) : [];
          this.seachSpinner = false;
        });
    }
  }

  //  SAVE
  onSavedBNBExportsCharges(valid) {
    if (valid && this.ProductInfoListView.length) {
      const purBill = this.GetPurchaseBillData();
      const purChallan = this.GetInwardData();
      const journalData = this.AccountJornal.GetInitilizaData(
        this.ObjVoucherCommon,
        this.ObjVoucherTopper,
        this.ObjCostCenter,
        this.ObjBillDetails,
        this.CatidwithAmount,
        [],
        []
      );
      this.saveSpinner = true;
      const obj = {
        json_Purchase_Bill: purBill,
        json_Purchase_Challan: purChallan,
        json_Account_Journal: JSON.stringify(journalData)
      };
      this.$http
        .post("/Export_Charges/Insert_Export_Charges_Purchase_Bill", {
          _Txn_Purchase: obj
        })
        .subscribe((data: any) => {
          if (data.success === true) {
            console.group("Compacct V2");
            console.log(
              "%c  Purcahse Bill Export Charges Sucess:",
              "color:green;"
            );
            console.log("/Export_Charges/Insert_Export_Charges_Purchase_Bill");
            this.compacctToast.clear();
            this.compacctToast.add({
              key: "compacct-toast",
              severity: "success",
              summary:
                this.ObjBillDetails.Doc_No === "A"
                  ? ""
                  : this.ObjBillDetails.Doc_No,
              detail:
                this.ObjBillDetails.Doc_No !== "A"
                  ? "Succesfully Updated Purchase Bill"
                  : "Succesfully Created Purchase Bill"
            });
            this.CloseBnbExportsCharges();
            this.SearchBNBCharge(true);
            this.saveSpinner = false;
          } else {
            this.compacctToast.clear();
            this.compacctToast.add({
              key: "compacct-toast",
              severity: "error",
              summary: "Warn Message",
              detail: "Error Occured "
            });
          }
        });
    }
  }

  //  GET PURCHASE BILL DATA
  GetPurchaseBillData() {
    this.ObjBillDetails.Doc_Date = this.ObjDocDetails.Doc_Date
      ? this.ObjDocDetails.Doc_Date
      : this.DateService.dateConvert(new Date());
    this.ObjBillDetails.User_ID = this.$CompacctAPI.CompacctCookies.User_ID;
    this.ObjBillDetails.Posted_ON = this.DateService.dateConvert(new Date());
    const Purchase = Object.assign(this.ObjSubLedger, this.ObjBillDetails);
    return JSON.stringify([Purchase]);
  }
  // GET INWARD DATA
  GetInwardData() {
    this.ObjDocDetails.Doc_Date = this.ObjDocDetails.Doc_Date
      ? this.ObjDocDetails.Doc_Date
      : this.DateService.dateConvert(new Date());
    this.ObjDocDetails.Bill_Gross_Amt = this.ObjBillDetails.Gross_Amt;
    this.ObjDocDetails.Bill_Net_Amt = this.ObjBillDetails.Net_Amt;
    this.ObjDocDetails.User_ID = this.$CompacctAPI.CompacctCookies.User_ID;
    this.ObjDocDetails.Entry_Date = this.DateService.dateConvert(new Date());
    const ParamString = [];
    for (let i = 0; i < this.ProductInfoListProto.length; i++) {
      let Paramobj = {};
      Paramobj = Object.assign(
        this.ProductInfoListProto[i],
        this.ObjSubLedger,
        this.ObjCostCenter,
        this.ObjDocDetails
      );
      ParamString.push(Paramobj);
    }
    return JSON.stringify(ParamString);
  }

  // EDIT

  GetPurchaseBillEditData(BillNo) {
    if (BillNo) {
      const obj = new HttpParams().set("_Doc_No", BillNo);
      this.$http
        .get("/Export_Charges/RetrieveOne_JSON", { params: obj })
        .subscribe((data: any) => {
          const Obj = JSON.parse(data)[0];
          this.VendorInput.SubledgerChange(Obj.Sub_Ledger_ID);
          this.CostCenterInput.CostCenterChange(Obj.Cost_Cen_ID);

          this.ObjBillDetails = Obj;

          this.DocDate = Obj.Doc_Date
            ? moment(Obj.Doc_Date, "YYYY-MM-DD")["_d"]
            : new Date();
          this.BLDate =
            Obj.BL_Date && Obj.BL_Date !== "0001-01-01"
              ? moment(Obj.BL_Date, "YYYY-MM-DD")
              : undefined;
          this.SBDate =
            Obj.SB_Date && Obj.SB_Date !== "0001-01-01"
              ? moment(Obj.SB_Date, "YYYY-MM-DD")
              : undefined;
          this.DebitNoteDate =
            Obj.Debit_Note_Date && Obj.Debit_Note_Date !== "0001-01-01"
              ? moment(Obj.Debit_Note_Date, "YYYY-MM-DD")
              : undefined;
          this.SupBillDate =
            Obj.Supplier_Bill_Date && Obj.Supplier_Bill_Date !== "0001-01-01"
              ? moment(Obj.Supplier_Bill_Date, "YYYY-MM-DD")
              : undefined;

          this.GetPurchaseBillProductData(BillNo);
          setTimeout(() => {
            this.VendorInput.setAddress(Obj.Address_Caption);
            this.VendorInput.ChangeSubLedgerAddress(Obj.Address_Caption);
            this.$CompacctAPI.compacctSpinnerHide();
          }, 1000);
        });
    }
  }
  GetPurchaseBillProductData(BillNo) {
    if (BillNo) {
      const params = new HttpParams().set("_Doc_No", BillNo);
      this.$http
        .get("/Export_Charges/RetrieveOne_JSON_Product_Details", { params })
        .subscribe((data: any) => {
          const Obj = JSON.parse(data);
          this.ObjDocDetails.Doc_No = Obj[0].Doc_No;
          this.ProductInfoListProto = Obj;
          this.ProductInfoListView = this.ProductInfoListProto;
          this.CalculateTotalAmount();
          this.CalculateTaxableAmount();
          this.CalculateIGST();
          this.CalculateSGSTAmount();
          this.CalculateCGSTAmount();
          this.CalculateGrossAmount();
          this.CalculateNetAmount();
          this.CalculateRoundedOff();
          this.AddCatIDAmountLedgerID();
          setTimeout(() => {
            // this.$CompacctAPI.compacctSpinnerHide();
          }, 1000);
        });
    }
  }

  // CLOSE
  ClearForModalOpen() {
    this.VendorInput.clear();
    this.CostCenterInput.init();
    this.ObjDocDetails = new DocDetails();
    this.ObjProductInfo = new ProductInfo();
    this.ObjBillDetails = new PurchaseBillDetails();

    this.BLDate = undefined;
    this.SupBillDate = undefined;
    this.SBDate = undefined;
    this.DebitNoteDate = undefined;

    this.NativeProductList = [];
    this.ProductsList = [];
    this.ProductInfoListView = [];
    this.ProductInfoListProto = [];
    this.SelectedProduct = undefined;

    this.DisplayBnbExportChargesModal = false;
    this.BnbExportChargesFormSubmitted = false;
    this.BnbExportChargesroductFormSubmitted = false;
    this.BnbExportChargesInfoSubmitted = false;
    this.saveSpinner = false;
    this.seachSpinner = false;
    this.igstDisable = false;
    this.cgstDisable = false;
    this.sgstDisable = false;
    this.GetDocDateWiseFinancialYearId();
  }
  CloseBnbExportsCharges() {
    this.VendorInput.clear();
    this.ObjDocDetails = new DocDetails();
    this.ObjProductInfo = new ProductInfo();
    this.ObjBillDetails = new PurchaseBillDetails();
    this.CostCenterInput.init();

    this.BLDate = undefined;
    this.SupBillDate = undefined;
    this.SBDate = undefined;
    this.DebitNoteDate = undefined;

    this.NativeProductList = [];
    this.ProductsList = [];
    this.ProductInfoListView = [];
    this.ProductInfoListProto = [];
    this.SelectedProduct = undefined;

    this.DisplayBnbExportChargesModal = false;
    this.BnbExportChargesFormSubmitted = false;
    this.BnbExportChargesroductFormSubmitted = false;
    this.BnbExportChargesInfoSubmitted = false;
    this.saveSpinner = false;
    this.seachSpinner = false;
    this.igstDisable = false;
    this.cgstDisable = false;
    this.sgstDisable = false;
    this.GetDocDateWiseFinancialYearId();
  }
}
class DocDetails {
  Doc_No = "A";
  Doc_Date: string;
  Project_ID: string;
  Supplier_Ref_No: string;
  Supplier_Ref_Date: string;
  CN_No: string;
  CN_Date: string;
  Order_No: string;
  Order_Date: string;

  Bill_Gross_Amt: number;
  Bill_Net_Amt: number;
  Billed = "Y";
  Bill_No = undefined;
  Bill_Date = undefined;

  User_ID: string;
  Entry_Date: string;
  Type_ID = 1;
  Fin_Year_ID: string;
  Prev_doc_no = "";
  Currency_ID: string;
  Currency_Symbol: string;
  Warranty_Terms: string;
  Remarks: string;
}
class ProductInfo {
  Pur_Order_No: string;
  Pur_Order_Date: string;
  Product_ID: number;
  Product_Name: string;
  Product_Specification: string;
  Batch_Number: string;
  Serial_No: string;
  HSL_No: string;
  No_Of_Bag: number;
  Gross_Wt: number; // new field
  Qty: number;
  UOM: string;
  Rate: number;
  MRP = 0;
  Amount: number;
  Discount_Type = undefined;
  Discount = undefined;
  Discount_Type_Amount = undefined;
  Taxable_Amount: number;

  CGST_Rate: number;
  CGST_Amount: number;
  SGST_Rate: number;
  SGST_Amount: number;
  IGST_Rate: number;
  IGST_Amount: number;
  Total: number;

  Cat_ID: string;
  Cat_Name: string;
  godown_id = 0;
  godown_name: string;
  Ledger_ID: string;
  Excise_Tax: string;
  Excise_Tax_Percentage: string;

  CGST_Input_Ledger_ID: number;
  SGST_Input_Ledger_Id: number;
  IGST_Input_Ledger_ID: number;
  Discount_Ledger_ID: number;

  Product_Expiry: string;
  Expiry_Date: string;
  Rate_Actual: number;
  Conversion: number;
}

class PurchaseBillDetails {
  Doc_No = "A";
  Doc_Date: string;
  Purchase_Challan_No: string;
  Supplier_Bill_No: string;
  Supplier_Bill_Date: string;

  Tax_Amt = 0;
  Term_Amt: any;
  Total_Amount: any;
  Taxable_Amt: any;
  CGST_Amt: any;
  SGST_Amt: any;
  IGST_Amt: any;
  Gross_Amt: any;
  ROUNDED_OFF: any;
  Net_Amt: any;
  User_ID: number;
  Posted_ON: string;
  Cost_Cen_ID: number;
  Project_ID: number;

  Bill_Type: number;
  For_Use_Of: string;
  Pur_From: string;
  Tax_Applicable: string;
  Against_C_Form: string;

  PAN_No: string;
  TAN_No: string;
  C_Form_No: string;
  Status = "A";
  CST_No: string;
  CN_No: string;
  CN_Date: string;
  Billing_To: number;
  Sub_Ledger_GST: string;
  Remarks: string;
  Bill_Status = "Purchase Done";
  Broker_ID: number;

  Way_Bill_No: string;
  Way_Bill_Date: string;
  Truck_No: string;

  Export_Charge_Type: string;
  Com_Inv_No: string;
  BL_No: string;
  BL_Date: string;
  SB_No: string;
  SB_Date: string;
  Debit_Note_Date: string;
  Debit_Note_No: string;
}

class VoucherCommon {
  Voucher_Type_ID = 6;
  Voucher_No: string; // return value
  Voucher_Date: string; // doc date
  Reconsil_Date = 1 + "/" + "Jan" + "/" + 1900;
  Reconsil_Tag = "N";
  Fin_Year_ID: string;
  Naration = "";
  Cost_Cen_ID: number;
  Cost_Cen_ID_Trn: number; // Revenue Cost Center
  Project_ID: string;
  Auto_Posted = "N";
  Posted_On: string;
  User_ID: string;
  Status = "A";
  Prev_doc_no = "";
  Foot_Fall_ID = 0;
  Cost_Head_ID = 0;
  Cheque_No = "";
  Cheque_Date = 1 + "/" + "Jan" + "/" + 1900;
  Bank_Name = "";
  Bank_Txn_Type = "";
  Bank_Branch_Name = "";
}
class VoucherTopper {
  Ledger_ID: string;
  Sub_Ledger_ID: string;
  DR_Amt = 0; // net amount
  CR_Amt = 0;
  Is_Topper = "Y";
}
