import { Component, OnInit, ViewEncapsulation, ViewChild } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { CompacctGlobalUrlService } from "../../../../../shared/compacct.global/global.service.service";
import { CompacctHeader } from "../../../../../shared/compacct.services/common.header.service";
import { DateTimeConvertService } from "../../../../../shared/compacct.global/dateTime.service";
import { CompacctCommonApi } from "../../../../../shared/compacct.services/common.api.service";
import { MessageService } from "primeng/api";
import { FileUpload } from "primeng/primeng";

declare var $: any;
import * as moment from "moment";
import { CompacctAccountJournal } from "../../../../../shared/compacct.services/compacct.mainstreamApi/cmpacct.account-journal";
import { forkJoin } from "rxjs";

@Component({
  selector: "app-compacct.purchasebill-gst",
  templateUrl: "./compacct.purchasebill-gst.component.html",
  styleUrls: ["./compacct.purchasebill-gst.component.css"],
  providers: [MessageService],
  encapsulation: ViewEncapsulation.None
})
export class CompacctPurchasebillGstComponent implements OnInit {
  buttonname = "Create";
  url = window["config"];
  tabIndexToView = 0;
  seachSpinner = false;
  saveSpinner = false;
  items = [];
  cols = [];
  menuList = [];
  frozenCols = [];
  hideTerm = false;
  BillSearchhFormSubmitted = false;
  PurchaseBillFormSubmitted = false;
  ProductInfoSubmitted = false;
  ProductInfoRequired = false;
  TermFormSubmitted = false;
  TruckBillFormSubmitted = false;
  TermSubmitted = false;
  GodownRequire = false;
  godownVisible = false;
  productExpiryDateVisiable = false;
  productExpiryDateRequire = false;
  displayBillUploadModal = false;
  displayTruckUploadModal = false;

  CostCenterList = [];
  ProjectList = [];
  NativeVendorList = [];
  VendorList = [];
  SelectedVentor = undefined;
  Broker: any;
  NativeBrokerList = [];
  BrokerList = [];
  VendorAddressLists = [];
  NativeProductList = [];
  ProductsList = [];
  SelectedProduct: any;
  PurchaseBillList = [];
  NativePurChaseOrderList = [];
  PurChaseOrderList = [];
  BatchLists = [];
  BatchNoLists = [];
  SerialList = [];
  SelectedSerialNo: any;
  GodownLists = [];
  CurrencyList = [];
  StateLists = [];

  ProductInfoListView = [];
  ProductInfoList = [];
  ProductInfoListProto = [];
  patNetAmount: number;
  igstDisable = false;
  cgstDisable = false;
  sgstDisable = false;
  // LDGER
  CatidwithAmount = [];
  termWithOutputLedgerID = [];
  NativeRoundoffID: any;
  // TERN
  TermList = [];
  TermTableLists = [];
  ObjBillSearch = new BillSearch();
  ObjCostCenter = new CostCenter();
  ObjSubLedger = new SubLedger();
  ObjDocDetails = new DocDetails();
  ObjBillDetails = new PurchaseBillDetails();
  ObjProductInfo = new ProductInfo();
  ObjTerm = new Term();
  ObjVoucherCommon: VoucherCommon = new VoucherCommon();
  ObjVoucherTopper: VoucherTopper = new VoucherTopper();
  ObjTruckVoucherCommon: VoucherCommon = new VoucherCommon();
  ObjTruckVoucherTopper: VoucherTopper = new VoucherTopper();
  ObjTruck = new Truck();
  //  DELETE
  billDocNo: string;
  BatchShow = true;
  Batchdropdown = false;
  Batchdisabled = false;
  SerialShow = false;
  Qtydisable = true;

  Pur_Order_No: any;
  DocDate = new Date();
  CNDate: any;
  WbillDate: any;
  SupBillDate: any;
  PurOrderDate: any;
  expiryDate: any;
  TruckbillDate = new Date();
  //  EDIT FLAG
  PurchaseBilEditFlag = false;
  GRNEditFlag = false;
  GRNFormChangeObj = {
    BillNo: undefined,
    CreateEdit: undefined
  };
  QCFormChangeObj = {
    BillNo: undefined,
    CreateEdit: undefined
  };
  DebitNoteFormChangeObj = {
    BillNo: undefined,
    CreateEdit: undefined
  };
  QCEditFlag = false;
  returnGRNNo: string;
  // form flag
  PurchaseBillDisable = false;
  // Upload
  BillPDFFile = {};
  docNoUpload: string;
  DocType: string;

  LedgerForY: string;
  LedgerForN: string;
  @ViewChild("fileInput", { static: false }) fileInput: FileUpload;
  constructor(
    private $http: HttpClient,
    private urlService: CompacctGlobalUrlService,
    private Header: CompacctHeader,
    private DateService: DateTimeConvertService,
    private $CompacctAPI: CompacctCommonApi,
    private compacctToast: MessageService,
    private AccountJornal: CompacctAccountJournal
  ) {}

  ngOnInit() {
    this.cols = [
      { field: "Doc_No", header: "Doc No" },
      { field: "Doc_Date", header: "Doc Date" },
      { field: "Supplier_Bill_No", header: "Supplier Bill No" },
      { field: "Supplier_Bill_Date", header: "Supplier Bill Date" },
      { field: "Vendor_Name", header: "Vendor" },
      { field: "Broker_Name", header: "Broker" },
      { field: "Cost_Cen_Name", header: "Cost Center" },
      { field: "Bill_Status", header: "Status" },
      { field: "Lot_Nos", header: "Lot No" },
      { field: "Taxable_Amt", header: "Total Taxable Amt." },
      { field: "CGST_Amt", header: "Total CGST" },
      { field: "SGST_Amt", header: "Total SGST" },
      { field: "IGST_Amt", header: "Total IGST" },
      { field: "Net_Amt", header: "Total Net Amt" },
      { field: "Truck_No", header: "Truck No" },
      { field: "Truck_Amt", header: "Truck Amount" },
      { field: "Truck_Payment_Status", header: "Truck Payment Status" },
      { field: "Purchase_Bill_Upload", header: "Purchase Bill Document" },
      { field: "Invoice_Upload", header: "Invoice Document" },
      { field: "Waybill_Upload", header: "Waybill Document" },
      { field: "Transport_Document_Upload", header: "Transport Document" },
      { field: "Weight_Slip_Upload", header: "Weight Slip Document" }
    ];
    this.items = ["BROWSE", "CREATE"];
    this.menuList = [
      { label: "Edit", icon: "pi pi-fw pi-user-edit" },
      { label: "Delete", icon: "fa fa-fw fa-trash" }
    ];
    this.frozenCols = [{ field: "Doc No", header: "Doc_No" }];
    this.Header.pushHeader({
      Header: "Purchase Bill and GRN",
      Link: " Financial Management -> Purchase -> Purchase Bill and GRN"
    });
    this.GetCostCenter();
    this.GetSubLedger();
    this.GetRoundoffID();
    this.GetBroker();
    this.GetProject();
    this.GetState();
    this.GetDocDateWiseFinancialYearId();
    this.getTruckLedger();
  }
  TabClick(e) {
    this.tabIndexToView = e.index;
    this.items = ["BROWSE", "CREATE"];
    this.buttonname = "Create";
    this.ClearData();
  }
  ClearData() {
    this.ObjBillSearch = new BillSearch();
    this.ObjCostCenter = new CostCenter();
    this.ObjSubLedger = new SubLedger();
    this.ObjDocDetails = new DocDetails();
    this.ObjBillDetails = new PurchaseBillDetails();
    this.ObjProductInfo = new ProductInfo();
    this.ObjTerm = new Term();
    this.ObjVoucherCommon = new VoucherCommon();
    this.ObjVoucherTopper = new VoucherTopper();

    this.SelectedProduct = undefined;
    this.GodownLists = [];
    this.igstDisable = false;
    this.cgstDisable = false;
    this.sgstDisable = false;
    //  PURCHASE BILL
    this.NativePurChaseOrderList = [];
    this.PurChaseOrderList = [];
    //  this.SelectedSerialNo = [];
    this.SerialList = [];
    this.BatchLists = [];
    this.ProductInfoListView = [];
    this.ProductInfoList = [];
    this.ProductInfoListProto = [];
    // LDGER
    this.CatidwithAmount = [];
    this.termWithOutputLedgerID = [];
    //  TERM
    this.TermList = [];
    this.TermTableLists = [];
    // FORM
    this.BillSearchhFormSubmitted = false;
    this.PurchaseBillFormSubmitted = false;
    this.ProductInfoSubmitted = false;
    this.ProductInfoRequired = false;
    this.TermFormSubmitted = false;
    this.TermSubmitted = false;
    this.GodownRequire = false;
    this.godownVisible = false;
    this.productExpiryDateVisiable = false;
    this.productExpiryDateRequire = false;
    // this.ProductInfoRequired = false;
    //  this.saveSpinner = false;
    this.billDocNo = undefined;
    this.seachSpinner = false;
    this.saveSpinner = false;
    this.CostCenterChange(this.$CompacctAPI.CompacctCookies.Cost_Cen_ID);
    this.GetCurrency();
    this.GetDocDateWiseFinancialYearId();
    this.GRNFormChangeObj = {
      BillNo: undefined,
      CreateEdit: undefined
    };
    this.QCFormChangeObj = {
      BillNo: undefined,
      CreateEdit: undefined
    };
    this.DebitNoteFormChangeObj = {
      BillNo: undefined,
      CreateEdit: undefined
    };
    this.returnGRNNo = undefined;
    this.PurchaseBillDisable = false;

    this.DocDate = new Date();
    this.CNDate = undefined;
    this.SupBillDate = undefined;
    this.WbillDate = undefined;
    this.BillPDFFile = {};
    this.docNoUpload = undefined;
  }
  //  INITIAL DATA
  GetRoundoffID() {
    this.$http.get(this.url.apiGetRoundOffId).subscribe((data: any) => {
      this.NativeRoundoffID = data;
    });
  }
  GetCostCenter() {
    this.$CompacctAPI.getCostCenter().subscribe((data: any) => {
      this.CostCenterList = data ? JSON.parse(data) : [];
      const cookiesCostCenter = this.$CompacctAPI.CompacctCookies.Cost_Cen_ID;
      this.ObjBillSearch.Cost_Cen_ID = cookiesCostCenter;
      this.CostCenterChange(cookiesCostCenter);
      this.GetProduct();
    });
  }
  GetSubLedger() {
    const para = new HttpParams().set("Subledger_Type", "Vendor");
    this.$http
      .get("/Common/Get_SubLedger_SC_with_Type", { params: para })
      .subscribe((data: any) => {
        this.NativeVendorList = data ? JSON.parse(data) : [];
        this.NativeVendorList.forEach(el => {
          this.VendorList.push({
            label: el.Sub_Ledger_Name,
            value: el.Sub_Ledger_ID
          });
        });
      });
  }
  GetBroker() {
    const para = new HttpParams().set("Subledger_Type", "Broker");
    this.$http
      .get("/Common/Get_SubLedger_SC_with_Type", { params: para })
      .subscribe((data: any) => {
        this.NativeBrokerList = data ? JSON.parse(data) : [];
        this.NativeBrokerList.forEach(el => {
          this.BrokerList.push({
            label: el.Sub_Ledger_Name,
            value: el.Sub_Ledger_ID
          });
        });
      });
  }
  GetProduct() {
    const params = {
      Pur_Doc_No: this.ObjProductInfo.Pur_Order_No
        ? this.ObjProductInfo.Pur_Order_No
        : "0",
      Doc_Date: this.DateService.dateConvert(new Date()),
      Material_Type: "Raw Material"
    };
    // const PurchaseOrd = this.ObjProductInfo.Pur_Order_No ? this.ObjProductInfo.Pur_Order_No : 0;
    this.$http
      .get("/Common/Get_Product_Purchaseable_Bill_with_GST_Tax_Material_Type", {
        params
      })
      .subscribe((data: any) => {
        this.NativeProductList = data ? JSON.parse(data) : [];
        this.NativeProductList.forEach(el => {
          this.ProductsList.push({
            label: el.Product_Name,
            value: el.Product_ID
          });
        });
      });
  }
  GetProject() {
    this.$http.get(this.url.apiGetProject).subscribe((data: any) => {
      this.ProjectList = data ? JSON.parse(data) : [];
    });
  }
  GetCurrency() {
    this.$http.get(this.url.apiGetCurrency).subscribe((data: any) => {
      this.CurrencyList = data ? data : [];
      this.ObjDocDetails.Currency_ID = data[0].Currency_ID;
      this.ObjDocDetails.Currency_Symbol = data[0].Currency_Symbol;
    });
  }
  GetState() {
    this.$http.get(this.url.apiGetState).subscribe((data: any) => {
      this.StateLists = data;
    });
  }
  // CHANGE EVENTS
  getDateRange(dateRangeObj) {
    if (dateRangeObj.length) {
      this.ObjBillSearch.from_date = dateRangeObj[0];
      this.ObjBillSearch.to_date = dateRangeObj[1];
    }
  }
  GetDocdate(docDate) {
    if (docDate) {
      this.ObjDocDetails.Doc_Date = this.DateService.dateConvert(
        moment(docDate, "YYYY-MM-DD")["_d"]
      );
      this.GetDocDateWiseFinancialYearId();
    }
  }
  GetCNdate(cnDate) {
    if (cnDate) {
      this.ObjDocDetails.CN_Date = this.DateService.dateConvert(
        moment(cnDate, "YYYY-MM-DD")["_d"]
      );
    }
  }
  GetSupBillDate(cnDate) {
    if (cnDate) {
      this.ObjBillDetails.Supplier_Bill_Date = this.DateService.dateConvert(
        moment(cnDate, "YYYY-MM-DD")["_d"]
      );
    }
  }
  GetWbilldate(cnDate) {
    if (cnDate) {
      this.ObjBillDetails.Way_Bill_Date = this.DateService.dateConvert(
        moment(cnDate, "YYYY-MM-DD")["_d"]
      );
    }
  }
  GetExpiryDate(exDate) {
    if (exDate) {
      this.ObjProductInfo.Expiry_Date = this.DateService.dateConvert(
        moment(exDate, "YYYY-MM-DD")["_d"]
      );
    }
  }
  GetTruckbillDate(exDate) {
    if (exDate) {
      this.ObjTruck.Truck_Date = this.DateService.dateConvert(
        moment(exDate, "YYYY-MM-DD")["_d"]
      );
    }
  }
  GetPurOrderDate(purDate) {
    if (purDate) {
      this.ObjProductInfo.Pur_Order_Date = this.DateService.dateConvert(
        moment(purDate, "YYYY-MM-DD")["_d"]
      );
    }
  }
  CostCenterChange(costId) {
    this.ObjCostCenter = new CostCenter();
    const List = this.CostCenterList.map(x => Object.assign({}, x));
    if (costId) {
      const Obj = $.grep(List, function(value) {
        return value.Cost_Cen_ID === Number(costId);
      })[0];
      this.ObjCostCenter.Cost_Cen_ID = costId;
      this.ObjCostCenter = Obj;
      this.ObjBillDetails.Cost_Cen_ID = costId;
      this.ObjVoucherCommon.Cost_Cen_ID_Trn = costId;
      this.GetGodown(costId);
    }
    if (this.ObjProductInfo.Product_ID) {
      this.CalculateTaxandNet();
    }
  }
  SubledgerChange(subLedID) {
    this.ObjSubLedger = new SubLedger();
    this.ObjBillDetails.PAN_No = undefined;
    this.ObjBillDetails.Sub_Ledger_GST = undefined;
    this.VendorAddressLists = [];
    const List = this.NativeVendorList.map(x => Object.assign({}, x));
    if (subLedID) {
      this.ObjSubLedger.Sub_Ledger_ID = subLedID;
      const Obj = $.grep(List, function(value) {
        return value.Sub_Ledger_ID === Number(subLedID);
      })[0];
      // ctrl.Address_Caption = undefined;
      this.ObjSubLedger = Obj;
      this.ObjBillDetails.PAN_No = this.ObjSubLedger.Sub_Ledger_PAN_No;
      this.GetVendorAddressDetails(this.ObjSubLedger.Sub_Ledger_ID);
      this.GetPurchaseOrder(this.ObjSubLedger.Sub_Ledger_ID);
      this.ObjVoucherTopper.Sub_Ledger_ID = Obj.Sub_Ledger_ID;
      this.ObjVoucherTopper.Ledger_ID = Obj.Ledger_ID;
      this.ObjSubLedger.Address_Caption = undefined;
      this.ObjSubLedger.Sub_Ledger_Address_1 = "";
      this.ObjSubLedger.Sub_Ledger_Land_Mark = "";
      this.ObjSubLedger.Sub_Ledger_Pin = undefined;
      this.ObjSubLedger.Sub_Ledger_District = "";
      this.ObjSubLedger.Sub_Ledger_State = "";
      this.ObjSubLedger.Sub_Ledger_Country = "";
      this.ObjSubLedger.Sub_Ledger_GST_No = "";
    }
    if (this.ObjProductInfo.Product_ID) {
      this.CalculateTaxandNet();
    }
  }
  ChangeSubLedgerAddress(captionName) {
    // ctrl.statedisable = false;
    this.ObjSubLedger.Sub_Ledger_Address_1 = "";
    this.ObjSubLedger.Sub_Ledger_Land_Mark = "";
    this.ObjSubLedger.Sub_Ledger_Pin = undefined;
    this.ObjBillDetails.Sub_Ledger_GST = undefined;
    this.ObjSubLedger.Sub_Ledger_District = "";
    this.ObjSubLedger.Sub_Ledger_State = "";
    this.ObjSubLedger.Sub_Ledger_Country = "";
    this.ObjSubLedger.Sub_Ledger_GST_No = "";
    const List = this.VendorAddressLists.map(x => Object.assign({}, x));
    if (captionName) {
      const obj = $.grep(List, function(value) {
        return value.Address_Caption === captionName;
      })[0];
      this.ObjSubLedger.Sub_Ledger_Address_1 = obj.Address_1
        ? obj.Address_1
        : "";
      this.ObjSubLedger.Sub_Ledger_Land_Mark = obj.Land_Mark;
      this.ObjSubLedger.Sub_Ledger_Pin = obj.Pin;
      this.ObjSubLedger.Sub_Ledger_District = obj.District;
      this.ObjSubLedger.Sub_Ledger_State = obj.State;
      this.ObjSubLedger.Sub_Ledger_Country = obj.Country;
      this.ObjSubLedger.Sub_Ledger_GST_No = obj.Sub_Ledger_GST_No;
      this.ObjBillDetails.Sub_Ledger_GST = obj.Sub_Ledger_GST_No;
    }
  }
  ChangePurchaseOrder(purchaseOrderNo) {
    this.ObjProductInfo.Rate = undefined;
    // ctrl.productSelect = undefined;
    this.ProductsList = [];
    //  ctrl.PurOrderDate = undefined;
    this.BatchLists = [];
    this.BatchShow = false;
    this.SerialShow = false;
    this.Batchdropdown = false;
    if (purchaseOrderNo) {
      const para = new HttpParams().set("PO_NO", purchaseOrderNo);
      this.ObjProductInfo.Pur_Order_No = purchaseOrderNo;
      const List = this.NativePurChaseOrderList.map(x => Object.assign({}, x));

      const obj = $.grep(List, function(value) {
        return value.Pur_Order_No === purchaseOrderNo;
      })[0];
      // this.PurOrderDate = new Date(obj.Doc_Date);
      this.GetProduct();
      this.$http
        .get("/Common/Get_Product_Purchaseable_according_PO", { params: para })
        .subscribe((data: any) => {
          this.BatchLists = JSON.parse(data);
        });
    }
  }
  ChangeCurrency(currencyId) {
    const List = this.CurrencyList.map(x => Object.assign({}, x));
    const obj = $.grep(List, function(value) {
      return value.Currency_ID === currencyId;
    })[0];
    this.ObjDocDetails.Currency_Symbol = obj.Currency_Symbol;
  }
  ProductChange(productID) {
    this.ObjProductInfo = new ProductInfo();
    this.BatchLists = [];
    this.productExpiryDateVisiable = false;
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
        if (this.ObjProductInfo.Pur_Order_No) {
          const ListBatch = this.BatchLists.map(x => Object.assign({}, x));
          this.BatchNoLists = $.grep(ListBatch, function(value) {
            return value.Product_ID === obj.Product_ID;
          });
          this.Batchdropdown = true;
          this.BatchShow = false;
          this.SerialShow = false;
        } else {
          this.Batchdropdown = false;
          this.ObjProductInfo.Qty = undefined;
          this.BatchShow = true;
          this.SerialShow = false;
          this.Qtydisable = false;
        }
        // if (obj.Rate !== 0) {
        //     this.ObjOthersInfo.Rate = obj.Rate;
        //     this.fixedRate = obj.Rate;
        //     this.rateDisable = true;
        //     this.CalculateAmount();
        // } else {
        //     this.ObjOthersInfo.Rate = undefined;
        //     this.rateDisable = false;
        //     this.fixedRate = 0;
        // }

        this.ObjProductInfo.Product_Expiry = obj.Product_Expiry;
        this.expiryDate = undefined;
        if (obj.Product_Expiry === true) {
          this.productExpiryDateVisiable = true;
          this.productExpiryDateRequire = true;
        } else {
          this.productExpiryDateVisiable = false;
          this.productExpiryDateRequire = false;
        }
      } else {
        this.SelectedProduct = "";
        this.compacctToast.add({
          key: "compacct-toast",
          severity: "error",
          summary: "Warn Message",
          detail: "Please Select From Cost Center."
        });
      }
    }
  }
  GetGodown(CostCenID) {
    this.GodownLists = [];
    if (CostCenID) {
      this.$http
        .get(this.url.apiGetAllGodownList + CostCenID)
        .subscribe((data: any) => {
          this.GodownLists = data ? JSON.parse(data) : [];
        });
    }
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
      const GW = (
        Number(this.ObjProductInfo.Qty) / Number(this.ObjProductInfo.No_Of_Bag)
      ).toFixed(2);
      this.ObjProductInfo.Gross_Wt = Number(GW);
    } else {
      this.ObjProductInfo.Amount = 0;
      this.ObjProductInfo.Gross_Wt = 0;
      this.ObjProductInfo.Taxable_Amount = this.ObjProductInfo.Amount;
    }
    this.CalculateTaxandNet();
  }
  GetBatch(ProductID, godwonID) {
    if (this.ObjCostCenter.Cost_Cen_ID && this.BatchShow) {
      const obj = new HttpParams()
        .set("Report_type", "STOCK WITH BATCH")
        .set("ProductID", ProductID)
        .set("CostCenID", this.ObjCostCenter.Cost_Cen_ID.toString())
        .set("GodownID", godwonID ? godwonID.toString() : "0");
      this.$http
        .get("/Common/Get_Stock_Qty", { params: obj })
        .subscribe((data: any) => {
          if (data) {
            this.BatchShow = true;
            this.BatchLists = JSON.parse(data);
          } else {
            this.BatchLists = [];
          }
        });
    }
  }
  GodownChange(godwonID) {
    this.ObjProductInfo.godown_name = undefined;
    if (godwonID) {
      const List = this.GodownLists.map(x => Object.assign({}, x));
      const obj = $.grep(List, function(value) {
        return value.godown_id === Number(godwonID);
      })[0];
      this.ObjProductInfo.godown_name = obj.godown_name;
    }
  }
  // FUNCTION
  GetVendorAddressDetails(SubLedgerID) {
    if (SubLedgerID) {
      const obj = new HttpParams().set("Sub_Ledger_ID", SubLedgerID);
      this.$http
        .get(this.url.apiGetSubledgerAddressDetails_, { params: obj })
        .subscribe((data: any) => {
          this.VendorAddressLists = data ? JSON.parse(data) : [];
        });
    }
  }
  GetPurchaseOrder(SubLedgerID) {
    this.PurChaseOrderList = [];
    this.NativePurChaseOrderList = [];
    // this.PurChaseOrderNo = undefined;
    this.ProductsList = [];
    // ctrl.productSelect = undefined;
    this.BatchLists = [];
    //  ctrl.ObjOthersInfo.Pur_Order_No = undefined;
    if (SubLedgerID) {
      const obj = new HttpParams().set("Sub_Ledger_ID", SubLedgerID);
      this.$http
        .get(this.url.apiGetPurchaseOrderListSubledgerWise, { params: obj })
        .subscribe((data: any) => {
          if (data) {
            this.NativePurChaseOrderList = data ? JSON.parse(data) : [];
            this.NativePurChaseOrderList.forEach(el => {
              this.PurChaseOrderList.push({
                label: el.DOC_Text,
                value: el.Pur_Order_No
              });
            });
          } else {
            this.GetProduct();
          }
        });
    }
  }
  getSumOfQtyWithSameProduct(productID) {
    if (this.ProductInfoList.length) {
      let totalQty = 0;
      const List = this.ProductInfoList.map(x => Object.assign({}, x));
      const tempProduct = $.grep(List, function(value) {
        return value.Product_ID === parseFloat(productID);
      });
      for (let init = 0; init < tempProduct.length; init++) {
        totalQty = totalQty + parseInt(tempProduct[init].Qty, 10);
      }
      return totalQty;
    } else {
      return 0;
    }
  }
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
        this.ObjTruckVoucherCommon.Fin_Year_ID = this.ObjVoucherCommon.Fin_Year_ID;
      });
  }
  //  DOC ENABLE
  EnableFlag(e) {
    if (e.Doc_TYPE === "GRN") {
      this.PurchaseBillDisable = e.Doc_No !== 0 ? true : false;
      this.returnGRNNo = e.Doc_No !== 0 ? e.Doc_No : undefined;
    } else if (e.Doc_TYPE === "QC") {
      this.PurchaseBillDisable = true;
    }
  }

  // PRODUCT / TERM
  CalculateProductWiswGrossAmount(obj) {
    return (
      obj.Taxable_Amount +
      obj.CGST_Amount +
      obj.SGST_Amount +
      obj.IGST_Amount
    ).toFixed(2);
  }
  CalculateTotalAmount() {
    this.ObjBillDetails.Total_Amount = 0;
    let totalAmount = 0;
    this.ProductInfoListView.forEach(elem => {
      totalAmount = totalAmount + Number(elem.Amount);
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
  calculateTermAmount() {
    let termamount = 0;
    //    console.log(ctrl.ObjPurchaseBill.Taxable_Amt);
    for (let i = 0; i < this.TermList.length; i++) {
      termamount = Number(termamount) + Number(this.TermList[i].Term_Amount);
    }
    this.ObjBillDetails.Term_Amt = termamount.toFixed(2);
    this.ObjBillDetails.Taxable_Amt = (
      Number(this.ObjBillDetails.Taxable_Amt) + Number(termamount)
    ).toFixed(2);
    if (this.TermList.length === 0) {
      this.ObjBillDetails.Term_Amt = undefined;
    }
  }
  calculateTermCGSTAmount() {
    let TermcgstAmount = 0;
    for (let i = 0; i < this.TermList.length; i++) {
      TermcgstAmount =
        Number(TermcgstAmount) + Number(this.TermList[i].CGST_Amount);
    }
    //  console.log(TermcgstAmount);
    this.ObjBillDetails.CGST_Amt = (
      Number(TermcgstAmount) + Number(this.ObjBillDetails.CGST_Amt)
    ).toFixed(2);
    if (this.TermList.length === 0) {
      // ctrl.ObjSaleBill.CGST_Amt = undefined;
    }
  }
  calculateTermSGSTAmount() {
    let TermsgstAmount = 0;
    for (let i = 0; i < this.TermList.length; i++) {
      TermsgstAmount =
        Number(TermsgstAmount) + Number(this.TermList[i].SGST_Amount);
    }
    //   console.log(TermsgstAmount);
    this.ObjBillDetails.SGST_Amt = (
      Number(TermsgstAmount) + Number(this.ObjBillDetails.SGST_Amt)
    ).toFixed(2);
    if (this.TermList.length === 0) {
      //    ctrl.ObjSaleBill.SGST_Amt = undefined;
    }
  }
  calculateTermIGST() {
    let TermigstAmount = 0;
    for (let i = 0; i < this.ProductInfoListView.length; i++) {
      TermigstAmount =
        Number(TermigstAmount) +
        Number(this.ProductInfoListView[i].IGST_Amount);
    }
    // console.log(TermigstAmount);
    //   ctrl.ObjSaleBill.IGST_Amt = (TermigstAmount).toFixed(2);
    this.ObjBillDetails.IGST_Amt = (
      Number(TermigstAmount) + Number(this.ObjBillDetails.IGST_Amt)
    ).toFixed(2);
    if (this.TermList.length === 0) {
      // ctrl.ObjSaleBill.IGST_Amt = undefined;
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
    this.ObjBillDetails.Net_Amt = Math.round(this.ObjBillDetails.Gross_Amt);
    this.ObjVoucherTopper.CR_Amt = this.ObjBillDetails.Net_Amt;
  }
  CalculateRoundedOff() {
    this.ObjBillDetails.ROUNDED_OFF = (
      this.ObjBillDetails.Net_Amt - this.ObjBillDetails.Gross_Amt
    ).toFixed(2);
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

  //  ADD delete PRODUCT / TERM
  AddProductInfo(valid) {
    this.ProductInfoSubmitted = true;
    this.ProductInfoRequired = true;
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
        this.ProductInfoListProto.push(this.ObjProductInfo);
        this.ProductInfoListView = this.ProductInfoListProto;
        this.ProductInfoSubmitted = false;
        this.ProductInfoRequired = false;
        this.BatchShow = true;
        this.Batchdisabled = true;
        this.SerialShow = false;
        this.patNetAmount = 0;
        // this.GodownRequire = false;
        this.Batchdropdown = false;
        this.BatchLists = [];
        this.SelectedProduct = "";
        this.productExpiryDateVisiable = false;

        this.CalculateTotalAmount();
        this.CalculateTaxableAmount();
        this.CalculateIGST();
        this.CalculateSGSTAmount();
        this.CalculateCGSTAmount();
        if (this.TermList.length) {
          this.calculateTermAmount();
          this.calculateTermCGSTAmount();
          this.calculateTermSGSTAmount();
          this.calculateTermIGST();
        }
        this.CalculateGrossAmount();
        this.CalculateNetAmount();
        this.CalculateRoundedOff();
        this.AddCatIDAmountLedgerID();

        this.ObjProductInfo = new ProductInfo();
        this.ObjProductInfo.godown_id = 0;
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
    if (this.TermList.length) {
      this.calculateTermAmount();
      this.calculateTermCGSTAmount();
      this.calculateTermSGSTAmount();
      this.calculateTermIGST();
    }
    this.CalculateGrossAmount();
    this.CalculateNetAmount();
    this.CalculateRoundedOff();
    this.AddCatIDAmountLedgerID();
  }
  AddTerm(valid) {
    this.TermSubmitted = true;
    const List = this.TermList.map(x => Object.assign({}, x));
    const termDublicateCheck = $.grep(List, function(value) {
      return value.Term_ID === this.ObjTerm.Term_ID;
    });
    if (termDublicateCheck.length) {
      //  notif({msg: "Term Name Exist", type: "error"});
      this.compacctToast.clear();
      this.compacctToast.add({
        key: "compacct-toast",
        severity: "error",
        summary: "Warn Message",
        detail: "Term Name Exist"
      });
    }
    if (valid && termDublicateCheck.length === 0) {
      if (
        this.ObjSubLedger.Sub_Ledger_State &&
        this.ObjCostCenter.Cost_Cen_State
      ) {
        // ctrl.compositeGST == "No"
        const SubLedgerState = this.ObjSubLedger.Sub_Ledger_State.toUpperCase();
        const CostCenterState = this.ObjCostCenter.Cost_Cen_State.toUpperCase();
        if (true) {
          if (SubLedgerState === CostCenterState) {
            this.ObjTerm.CGST_Amount = Number(
              (
                (this.ObjTerm.Term_Amount * this.ObjTerm.CGST_Rate) /
                100
              ).toFixed(2)
            );
            this.ObjTerm.SGST_Amount = Number(
              (
                (this.ObjTerm.Term_Amount * this.ObjTerm.SGST_Rate) /
                100
              ).toFixed(2)
            );
            this.ObjTerm.IGST_Amount = 0;
            this.ObjTerm.IGST_Rate = 0;
          } else {
            this.ObjTerm.IGST_Amount = Number(
              (
                (this.ObjTerm.Term_Amount * this.ObjTerm.IGST_Rate) /
                100
              ).toFixed(2)
            );
            this.ObjTerm.CGST_Amount = 0;
            this.ObjTerm.CGST_Rate = 0;
            this.ObjTerm.SGST_Amount = 0;
            this.ObjTerm.SGST_Rate = 0;
          }
        } else {
          this.ObjTerm.CGST_Amount = 0;
          this.ObjTerm.CGST_Rate = 0;
          this.ObjTerm.SGST_Amount = 0;
          this.ObjTerm.SGST_Rate = 0;
          this.ObjTerm.IGST_Amount = 0;
          this.ObjTerm.IGST_Rate = 0;
        }
        this.TermList.push(this.ObjTerm);
        this.TermTableLists = this.TermList;
        this.ObjTerm = new Term();
        this.TermSubmitted = false;
        //  this.ermrequired = false;

        this.CalculateTotalAmount();
        this.CalculateTaxableAmount();
        this.CalculateIGST();
        this.CalculateSGSTAmount();
        this.CalculateCGSTAmount();

        this.calculateTermAmount();
        this.calculateTermCGSTAmount();
        this.calculateTermSGSTAmount();
        this.calculateTermIGST();

        this.CalculateGrossAmount();
        this.CalculateNetAmount();
        this.CalculateRoundedOff();

        this.addtermWithOutputLedgerID();
      } else {
        // notif({ msg: "Please choose Subledger/Costcenter State", type: "error" });
      }
    }
  }
  addtermWithOutputLedgerID() {
    this.termWithOutputLedgerID = [];
    for (let i = 0; i < this.TermList.length; i++) {
      this.termWithOutputLedgerID.push({
        CGST_Input_Ledger_ID: this.TermList[i].CGST_Input_Ledger_ID,
        SGST_Input_Ledger_Id: this.TermList[i].SGST_Input_Ledger_Id,
        IGST_Input_Ledger_ID: this.TermList[i].IGST_Input_Ledger_ID,
        Purchase_Ac_Ledger: this.TermList[i].Purchase_Ac_Ledger,
        CGST_Amount: this.TermList[i].CGST_Amount,
        SGST_Amount: this.TermList[i].SGST_Amount,
        IGST_Amount: this.TermList[i].IGST_Amount,
        Term_Amount: this.TermList[i].Term_Amount
      });
    }
  }
  DeteteTerm(termArrayIndex) {
    this.TermList.splice(termArrayIndex, 1);
    this.TermTableLists = this.TermList;

    this.CalculateTotalAmount();
    this.CalculateTaxableAmount();

    this.CalculateIGST();
    this.CalculateSGSTAmount();
    this.CalculateCGSTAmount();

    this.calculateTermAmount();
    this.calculateTermCGSTAmount();
    this.calculateTermSGSTAmount();
    this.calculateTermIGST();

    this.CalculateGrossAmount();
    this.CalculateNetAmount();
    this.CalculateRoundedOff();

    this.addtermWithOutputLedgerID();
  }
  //  MODAL
  UploadModal(Obj) {
    this.displayBillUploadModal = false;
    this.docNoUpload = undefined;
    this.BillPDFFile = {};
    this.DocType = undefined;
    this.fileInput.clear();
    if (Obj.Doc_No) {
      this.displayBillUploadModal = true;
      this.docNoUpload = Obj.Doc_No;
    }
  }
  CloseUploadModal() {
    this.displayBillUploadModal = false;
  }

  FetchPDFFile(event) {
    // this.PDFFlag = false;
    this.BillPDFFile = {};
    if (event) {
      this.BillPDFFile = event.files[0];
      // this.PDFFlag = true;
    }
  }
  onUploadSaved() {
    if (this.BillPDFFile !== {} && this.docNoUpload && this.DocType) {
      this.InsetDocToDocument();
    }
  }
  UploadConfirm(filedata, billNo) {
    const endpoint = "/BL_Txn_Purchase_Bill_Complete/Upload_Pic";
    const formData: FormData = new FormData();
    formData.append("anint", billNo);
    formData.append("aFile", filedata);
    this.$http.post(endpoint, formData).subscribe((data: any) => {
      if (data.success === true) {
        this.compacctToast.clear();
        this.compacctToast.add({
          key: "compacct-toast",
          severity: "success",
          summary: billNo,
          detail: "Document Succesfully Uploaded"
        });
        this.SearchBill(true);
        this.fileInput.clear();
      } else {
        this.compacctToast.clear();
        this.compacctToast.add({
          key: "compacct-toast",
          severity: "error",
          summary: "Warn Message",
          detail: "Error Occured "
        });
      }
      this.displayBillUploadModal = false;
      console.log(data);
    });
  }
  InsetDocToDocument() {
    if (this.BillPDFFile["type"]) {
      if (this.DocType && this.docNoUpload) {
        const obj = new HttpParams()
          .set("Doc_No_Import", this.docNoUpload)
          .set("Document_Folder", this.DocType);
        const obj1 = {
          Doc_No_Import: this.docNoUpload,
          Document_Folder: this.DocType
        };
        this.$http
          .post("/BL_Txn_Purchase_Bill_Complete/Push_Document_data", obj1)
          .subscribe((data: any) => {
            if (data.success) {
              this.UploadConfirm(this.BillPDFFile, this.docNoUpload);
            } else {
            }
          });
      }
    } else {
      this.compacctToast.clear();
      this.compacctToast.add({
        key: "compacct-toast",
        severity: "error",
        summary: "Warn Message",
        detail: "Add Image "
      });
    }
  }

  // POST ALL DATA
  SavePurchaseBill(valid) {
    this.PurchaseBillFormSubmitted = true;
    if (valid) {
      const purBill = this.GetPurchaseBillData();
      const purChallan = this.GetInwardData();
      const dataObj = this.GetAccountJopurnalData();
      if (dataObj.valid) {
        this.saveSpinner = true;
        const obj = {
          json_Purchase_Bill: purBill,
          json_Purchase_Challan: purChallan,
          json_Account_Journal: dataObj.Data
        };
        // const a = this.AccountJornal.GetInitilizaData( this.ObjVoucherCommon , this.ObjVoucherTopper ,
        //   this.ObjCostCenter , this.ObjBillDetails , this.CatidwithAmount , this.TermList , this.termWithOutputLedgerID)
        // console.log(a);
        this.$http
          .post(
            "/BL_Txn_Purchase_Bill_Complete/Insert_Txn_Purchase_Bill_Complete",
            { _Txn_Purchase: obj }
          )
          .subscribe((data: any) => {
            if (data.success === true) {
              console.group("Compacct V2");
              console.log("%c  Purcahse Bill Sucess:", "color:green;");
              console.log(
                "/BL_Txn_Purchase_Bill_Complete/Insert_Txn_Purchase_Bill_Complete"
              );
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
              this.ClearData();
              this.SearchBill(true);
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
      } else {
        this.compacctToast.clear();
        this.compacctToast.add({
          key: "compacct-toast",
          severity: "error",
          summary: "Warn Message",
          detail: "Debit Amount is Not Equal To Credit Amount"
        });
      }
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
  //  GET  JOURNAL DATA
  GetAccountJopurnalData() {
    const VoucherDataList = [];
    //  this.ObjVoucherCommon.Voucher_No = Doc_No;
    this.ObjVoucherCommon.Voucher_Date = this.ObjBillDetails.Doc_Date
      ? this.ObjBillDetails.Doc_Date
      : this.DateService.dateConvert(new Date());

    this.ObjVoucherCommon.Cost_Cen_ID = this.ObjCostCenter.Cost_Cen_ID;
    this.ObjVoucherCommon.User_ID = this.$CompacctAPI.CompacctCookies.User_ID;
    this.ObjVoucherCommon.Posted_On = this.DateService.dateConvert(new Date());
    //  this.getFinancialYear();
    const TopperData = Object.assign(
      this.ObjVoucherTopper,
      this.ObjVoucherCommon
    );
    VoucherDataList.push(TopperData);

    // product
    const voucherproduct = [];
    const holder = {};
    this.CatidwithAmount.forEach(function(d) {
      if (holder.hasOwnProperty(d.Ledger_ID)) {
        holder[d.Ledger_ID] = holder[d.Ledger_ID] + parseFloat(d.Amount);
      } else {
        holder[d.Ledger_ID] = parseFloat(d.Amount);
      }
    });

    for (const prop in holder) {
      if (true) {
        voucherproduct.push({
          Ledger_ID: Number(prop),
          CR_Amt: 0,
          Sub_Ledger_ID: 0,
          DR_Amt: holder[prop].toFixed(2),
          Is_Topper: "N"
        });
      }
    }

    for (let i = 0; i < voucherproduct.length; i++) {
      const tempproduct = Object.assign(
        voucherproduct[i],
        this.ObjVoucherCommon
      );
      VoucherDataList.push(tempproduct);
    }
    // CGST_Input_Ledger_ID
    const voucherCGST = [];
    const holderCGST = {};
    this.CatidwithAmount.forEach(function(d) {
      if (holderCGST.hasOwnProperty(d.CGST_Input_Ledger_ID)) {
        holderCGST[d.CGST_Input_Ledger_ID] =
          holderCGST[d.CGST_Input_Ledger_ID] + parseFloat(d.CGST_Amount);
      } else {
        holderCGST[d.CGST_Input_Ledger_ID] = parseFloat(d.CGST_Amount);
      }
    });

    for (const prop in holderCGST) {
      if (!!Number(this.ObjBillDetails.CGST_Amt)) {
        voucherCGST.push({
          Ledger_ID: Number(prop),
          CR_Amt: 0,
          Sub_Ledger_ID: 0,
          DR_Amt: holderCGST[prop].toFixed(2),
          Is_Topper: "N"
        });
      }
    }

    for (let i = 0; i < voucherCGST.length; i++) {
      if (voucherCGST[i].Ledger_ID !== 0) {
        const tempCGST = Object.assign(voucherCGST[i], this.ObjVoucherCommon);
        VoucherDataList.push(tempCGST);
      }
    }

    // SGST_Input_Ledger_Id
    const voucherSGST = [];
    const holderSGST = {};
    this.CatidwithAmount.forEach(function(d) {
      if (holderSGST.hasOwnProperty(d.SGST_Input_Ledger_Id)) {
        holderSGST[d.SGST_Input_Ledger_Id] =
          holderSGST[d.SGST_Input_Ledger_Id] + parseFloat(d.SGST_Amount);
      } else {
        holderSGST[d.SGST_Input_Ledger_Id] = parseFloat(d.SGST_Amount);
      }
    });

    for (const prop in holderSGST) {
      if (!!Number(this.ObjBillDetails.SGST_Amt)) {
        voucherSGST.push({
          Ledger_ID: Number(prop),
          CR_Amt: 0,
          Sub_Ledger_ID: 0,
          DR_Amt: holderSGST[prop].toFixed(2),
          Is_Topper: "N"
        });
      }
    }

    for (let i = 0; i < voucherSGST.length; i++) {
      if (voucherSGST[i].Ledger_ID !== 0) {
        const tempSGST = Object.assign(voucherSGST[i], this.ObjVoucherCommon);
        VoucherDataList.push(tempSGST);
      }
    }
    // IGST_Input_Ledger_ID
    const voucherIGST = [];
    const holderIGST = {};
    this.CatidwithAmount.forEach(function(d) {
      if (holderIGST.hasOwnProperty(d.IGST_Input_Ledger_ID)) {
        holderIGST[d.IGST_Input_Ledger_ID] =
          holderIGST[d.IGST_Input_Ledger_ID] + parseFloat(d.IGST_Amount);
      } else {
        holderIGST[d.IGST_Input_Ledger_ID] = parseFloat(d.IGST_Amount);
      }
    });

    for (const prop in holderIGST) {
      if (!!Number(this.ObjBillDetails.IGST_Amt)) {
        voucherIGST.push({
          Ledger_ID: Number(prop),
          CR_Amt: 0,
          Sub_Ledger_ID: 0,
          DR_Amt: holderIGST[prop].toFixed(2),
          Is_Topper: "N"
        });
      }
    }

    for (let i = 0; i < voucherIGST.length; i++) {
      if (voucherIGST[i].Ledger_ID !== 0) {
        const tempIGST = Object.assign(voucherIGST[i], this.ObjVoucherCommon);
        VoucherDataList.push(tempIGST);
      }
    }

    //   Round_off_ID
    const RoundoffID = [];
    // console.log(ctrl.RoundoffID);
    if (!!Number(this.ObjBillDetails.ROUNDED_OFF)) {
      if (parseFloat(this.ObjBillDetails.ROUNDED_OFF) > 0) {
        const roundaedOf = Math.abs(this.ObjBillDetails.ROUNDED_OFF);
        RoundoffID.push({
          Ledger_ID: Number(this.NativeRoundoffID),
          DR_Amt: parseFloat(roundaedOf.toString()),
          Sub_Ledger_ID: 0,
          CR_Amt: 0,
          Is_Topper: "N"
        });
      } else {
        const roundaedOf1 = Math.abs(this.ObjBillDetails.ROUNDED_OFF);
        RoundoffID.push({
          Ledger_ID: Number(this.NativeRoundoffID),
          DR_Amt: 0,
          Sub_Ledger_ID: 0,
          CR_Amt: parseFloat(roundaedOf1.toString()).toFixed(2),
          Is_Topper: "N"
        });
      }
    }
    for (let i = 0; i < RoundoffID.length; i++) {
      if (RoundoffID[i].Ledger_ID !== 0) {
        const tempRoundOff = Object.assign(
          RoundoffID[i],
          this.ObjVoucherCommon
        );
        VoucherDataList.push(tempRoundOff);
      }
    }
    // Term List
    if (this.TermList.length !== 0) {
      // SGST_Input_Ledger_Id
      const termSGST = [];
      const TermholderSGST = {};
      this.termWithOutputLedgerID.forEach(function(d) {
        if (TermholderSGST.hasOwnProperty(d.SGST_Input_Ledger_Id)) {
          TermholderSGST[d.SGST_Input_Ledger_Id] =
            TermholderSGST[d.SGST_Input_Ledger_Id] + parseFloat(d.SGST_Amount);
        } else {
          TermholderSGST[d.SGST_Input_Ledger_Id] = parseFloat(d.SGST_Amount);
        }
      });
      for (const prop in TermholderSGST) {
        if (true) {
          termSGST.push({
            Ledger_ID: Number(prop),
            CR_Amt: 0,
            Sub_Ledger_ID: 0,
            DR_Amt: TermholderSGST[prop].toFixed(2),
            Is_Topper: "N"
          });
        }
      }
      for (let i = 0; i < termSGST.length; i++) {
        if (termSGST[i].Ledger_ID !== 0) {
          const tempSGST = Object.assign(termSGST[i], this.ObjVoucherCommon);
          VoucherDataList.push(tempSGST);
        }
      }
      // CGST_Input_Ledger_ID
      const termCGST = [];
      const TermholderCGST = {};
      this.termWithOutputLedgerID.forEach(function(d) {
        if (TermholderCGST.hasOwnProperty(d.CGST_Input_Ledger_ID)) {
          TermholderCGST[d.CGST_Input_Ledger_ID] =
            TermholderCGST[d.CGST_Input_Ledger_ID] + parseFloat(d.CGST_Amount);
        } else {
          TermholderCGST[d.CGST_Input_Ledger_ID] = parseFloat(d.CGST_Amount);
        }
      });
      for (const prop in TermholderCGST) {
        if (true) {
          termCGST.push({
            Ledger_ID: Number(prop),
            CR_Amt: 0,
            Sub_Ledger_ID: 0,
            DR_Amt: TermholderSGST[prop].toFixed(2),
            Is_Topper: "N"
          });
        }
      }
      for (let i = 0; i < termCGST.length; i++) {
        if (termCGST[i].Ledger_ID !== 0) {
          const tempCGST = Object.assign(termCGST[i], this.ObjVoucherCommon);
          VoucherDataList.push(tempCGST);
        }
      }
      // IGST_Input_Ledger_ID
      const termIGST = [];
      const TermholderIGST = {};
      this.termWithOutputLedgerID.forEach(function(d) {
        if (TermholderIGST.hasOwnProperty(d.IGST_Input_Ledger_ID)) {
          TermholderIGST[d.IGST_Input_Ledger_ID] =
            TermholderIGST[d.IGST_Input_Ledger_ID] + parseFloat(d.IGST_Amount);
        } else {
          TermholderIGST[d.IGST_Input_Ledger_ID] = parseFloat(d.IGST_Amount);
        }
      });
      for (const prop in TermholderIGST) {
        if (true) {
          termIGST.push({
            Ledger_ID: Number(prop),
            CR_Amt: 0,
            Sub_Ledger_ID: 0,
            DR_Amt: TermholderIGST[prop].toFixed(2),
            Is_Topper: "N"
          });
        }
      }
      for (let i = 0; i < termIGST.length; i++) {
        if (termIGST[i].Ledger_ID !== 0) {
          const tempCGST = Object.assign(termIGST[i], this.ObjVoucherCommon);
          VoucherDataList.push(tempCGST);
        }
      }
      // Purchase_Ac_Ledger
      const termSalesAc = [];
      const holderSalesAc = {};
      this.termWithOutputLedgerID.forEach(function(d) {
        if (holderSalesAc.hasOwnProperty(d.Purchase_Ac_Ledger)) {
          holderSalesAc[d.Purchase_Ac_Ledger] =
            holderSalesAc[d.Purchase_Ac_Ledger] + parseFloat(d.Term_Amount);
        } else {
          holderSalesAc[d.Purchase_Ac_Ledger] = parseFloat(d.Term_Amount);
        }
      });
      for (const prop in holderSalesAc) {
        if (true) {
          termSalesAc.push({
            Ledger_ID: Number(prop),
            CR_Amt: 0,
            Sub_Ledger_ID: 0,
            DR_Amt: holderSalesAc[prop].toFixed(2),
            Is_Topper: "N"
          });
        }
      }
      for (let i = 0; i < termSalesAc.length; i++) {
        if (termSalesAc[i].Ledger_ID !== 0) {
          const tempCGST = Object.assign(termSalesAc[i], this.ObjVoucherCommon);
          VoucherDataList.push(tempCGST);
        }
      }
    }

    let totaldr = 0;
    let totalcr = 0;
    for (let i = 0; i < VoucherDataList.length; i++) {
      totaldr = totaldr + parseFloat(VoucherDataList[i].DR_Amt);
      totalcr = totalcr + parseFloat(VoucherDataList[i].CR_Amt);
    }
    console.log(
      "DR :" + totaldr.toFixed(2) + " && " + "CR:" + totalcr.toFixed(2)
    );
    const dataObj = {
      Data: JSON.stringify(VoucherDataList),
      valid: totaldr.toFixed(2) === totalcr.toFixed(2) ? true : false
    };
    return dataObj;
  }
  // SEARCH
  SearchBill(valid) {
    this.BillSearchhFormSubmitted = true;
    this.PurchaseBillList = [];
    if (valid) {
      this.seachSpinner = true;
      const start = this.ObjBillSearch.from_date
        ? this.DateService.dateConvert(new Date(this.ObjBillSearch.from_date))
        : this.DateService.dateConvert(new Date());
      const end = this.ObjBillSearch.to_date
        ? this.DateService.dateConvert(new Date(this.ObjBillSearch.to_date))
        : this.DateService.dateConvert(new Date());
      const obj = new HttpParams()
        .set("from_date", start)
        .set("to_date", end)
        .set("User_ID", this.$CompacctAPI.CompacctCookies.User_ID)
        .set(
          "Cost_Cen_ID",
          this.ObjBillSearch.Cost_Cen_ID ? this.ObjBillSearch.Cost_Cen_ID : "0"
        );
      this.$http
        .get("/BL_Txn_Purchase_Bill_Complete/GetAllData", { params: obj })
        .subscribe((data: any) => {
          this.PurchaseBillList = data ? JSON.parse(data) : [];
          this.seachSpinner = false;
          this.BillSearchhFormSubmitted = false;
        });
    }
  }

  //  DELETE
  onConfirm() {
    if (this.billDocNo) {
      this.$http
        .post("/BL_Txn_Purchase_Bill_Complete/Delete", {
          Doc_No: this.billDocNo
        })
        .subscribe((data: any) => {
          if (data.success === true) {
            this.SearchBill(true);
            this.onReject();
            this.compacctToast.clear();
            this.compacctToast.add({
              key: "compacct-toast",
              severity: "success",
              summary: this.billDocNo,
              detail: "Succesfully Deleted"
            });
          }
        });
    }
  }
  onReject() {
    this.compacctToast.clear("c");
  }
  DeleteBill(obj) {
    this.billDocNo = undefined;
    if (obj.Doc_No) {
      this.billDocNo = obj.Doc_No;
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
  // PDF
  GetPDF(obj) {
    if (obj.Doc_No) {
      window.open(
        "/Report/Crystal_Files/Finance/Purchase/BL_Txn_Purchase_Bill_Complete_Print.aspx?Doc_No=" +
          obj.Doc_No,
        "mywindow",
        "fullscreen=yes, scrollbars=auto,width=950,height=500"
      );
    }
  }

  // EDIT
  EditBill(obj, flag) {
    if (obj.Doc_No) {
      this.$CompacctAPI.compacctSpinnerShow();
      this.tabIndexToView = 1;
      this.items = ["BROWSE", "UPDATE"];
      this.buttonname = "Update";
      this.PurchaseBillDisable = false;
      this.ClearData();
      this.GetPurchaseBillEditData(obj.Doc_No);
      if (obj.Bill_Status === "Purchase Done") {
        if (flag === "create") {
          this.PurchaseBillDisable = false;
          this.GRNFormChangeObj.BillNo = obj.Doc_No;
          this.GRNFormChangeObj.CreateEdit = "HIDE";
        } else {
          this.PurchaseBillDisable = true;
          this.GRNFormChangeObj.BillNo = obj.Doc_No;
          this.GRNFormChangeObj.CreateEdit = "SHOW";
        }
      } else if (obj.Bill_Status === "GRN DONE") {
        this.PurchaseBillDisable = true;
        if (flag === "create") {
          this.GRNFormChangeObj.BillNo = obj.Doc_No;
          this.GRNFormChangeObj.CreateEdit = "SHOW";
          this.QCFormChangeObj.BillNo = obj.Doc_No;
          this.QCFormChangeObj.CreateEdit = "HIDE";
        } else {
          this.GRNFormChangeObj.BillNo = obj.Doc_No;
          this.GRNFormChangeObj.CreateEdit = "HIDE";
          this.QCFormChangeObj.BillNo = obj.Doc_No;
          this.QCFormChangeObj.CreateEdit = "SHOW";
        }
      } else if (obj.Bill_Status === "QC DONE") {
        this.PurchaseBillDisable = true;
        if (flag === "create") {
          this.GRNFormChangeObj.BillNo = obj.Doc_No;
          this.GRNFormChangeObj.CreateEdit = "HIDE";
          this.QCFormChangeObj.BillNo = obj.Doc_No;
          this.QCFormChangeObj.CreateEdit = "SHOW";
          this.DebitNoteFormChangeObj.BillNo = obj.Doc_No;
          this.DebitNoteFormChangeObj.CreateEdit = "HIDE";
        } else {
          this.GRNFormChangeObj.BillNo = obj.Doc_No;
          this.GRNFormChangeObj.CreateEdit = "HIDE";
          this.QCFormChangeObj.BillNo = obj.Doc_No;
          this.QCFormChangeObj.CreateEdit = "HIDE";
          this.DebitNoteFormChangeObj.BillNo = obj.Doc_No;
          this.DebitNoteFormChangeObj.CreateEdit = "SHOW";
        }
      } else if (obj.Bill_Status === "DEBIT NOTE DONE") {
        this.PurchaseBillDisable = true;
        this.GRNFormChangeObj.BillNo = obj.Doc_No;
        this.GRNFormChangeObj.CreateEdit = "HIDE";
        this.QCFormChangeObj.BillNo = obj.Doc_No;
        this.QCFormChangeObj.CreateEdit = "HIDE";
        this.DebitNoteFormChangeObj.BillNo = obj.Doc_No;
        this.DebitNoteFormChangeObj.CreateEdit = "SHOW";
      }
    }
  }

  GetPurchaseBillEditData(BillNo) {
    if (BillNo) {
      const obj = new HttpParams().set("Doc_No", BillNo);
      this.$http
        .get("/BL_Txn_Purchase_Bill_Complete/GetEditData", { params: obj })
        .subscribe((data: any) => {
          const Obj = JSON.parse(data)[0];
          this.SubledgerChange(Obj.Sub_Ledger_ID);
          this.ObjCostCenter.Cost_Cen_ID = Obj.Cost_Cen_ID;
          this.ObjSubLedger.Sub_Ledger_ID = Obj.Sub_Ledger_ID;
          this.CostCenterChange(Obj.Cost_Cen_ID);
          this.ObjBillDetails = Obj;
          this.DocDate = Obj.Doc_Date
            ? moment(Obj.Doc_Date, "YYYY-MM-DD")["_d"]
            : new Date();
          this.CNDate =
            Obj.CN_Date && Obj.CN_Date !== "0001-01-01"
              ? moment(Obj.CN_Date, "YYYY-MM-DD")
              : undefined;
          this.SupBillDate =
            Obj.Supplier_Bill_Date && Obj.Supplier_Bill_Date !== "0001-01-01"
              ? moment(Obj.Supplier_Bill_Date, "YYYY-MM-DD")
              : undefined;
          this.WbillDate =
            Obj.Way_Bill_Date && Obj.Way_Bill_Date !== "0001-01-01"
              ? moment(Obj.Way_Bill_Date, "YYYY-MM-DD")
              : undefined;
          this.GetPurchaseBillProductData(BillNo);
          setTimeout(() => {
            this.ObjSubLedger.Address_Caption = Obj.Address_Caption;
            this.ChangeSubLedgerAddress(Obj.Address_Caption);
            this.$CompacctAPI.compacctSpinnerHide();
          }, 1000);
        });
    }
  }
  GetPurchaseBillProductData(BillNo) {
    if (BillNo) {
      const params = new HttpParams().set("Bill_No", BillNo);
      this.$http
        .get(
          "/BL_Txn_Purchase_Bill_Complete/Get_GRN_With_Bill_No_Product_Details",
          { params }
        )
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
          if (this.TermList.length) {
            this.calculateTermAmount();
            this.calculateTermCGSTAmount();
            this.calculateTermSGSTAmount();
            this.calculateTermIGST();
          }
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

  // TRUCK PAYMENT
  getTruckLedger() {
    const LedgerCashINHandY = this.$http.get(
      "/BL_Txn_Purchase_Bill_Complete/Get_Cash_In_Hand_Ledger"
    );
    const LedgerCarriageINHandN = this.$http.get(
      "BL_Txn_Purchase_Bill_Complete/Get_Carriage_Inwards_Ledger"
    );
    forkJoin([LedgerCashINHandY, LedgerCarriageINHandN]).subscribe(
      (result: any) => {
        this.LedgerForY = result[0];
        this.LedgerForN = result[1];
      }
    );
  }
  UpdateTruck(obj) {
    if (obj.Doc_No) {
      this.ObjTruck = new Truck();
      this.ObjTruck.Truck_No = obj.Truck_No;
      this.ObjTruckVoucherCommon.Prev_doc_no = obj.Doc_No;
      this.ObjTruckVoucherCommon.Naration =
        " PAID TO " +
        obj.Truck_No +
        " AGAINST SUPPLIER BILL NO " +
        obj.Supplier_Bill_No +
        " DATE " +
        this.DateService.dateConvert(new Date(obj.Supplier_Bill_Date)) +
        " AND " +
        obj.Doc_No;
      this.displayTruckUploadModal = true;
    }
  }
  MergeTruckData() {
    this.ObjTruckVoucherCommon.Posted_On = this.DateService.dateConvert(
      new Date()
    );
    this.ObjTruckVoucherCommon.Voucher_Type_ID = 2;
    this.ObjTruckVoucherCommon.Voucher_No = "A";
    this.ObjTruckVoucherCommon.Voucher_Date = this.ObjTruck.Truck_Date
      ? this.ObjTruck.Truck_Date
      : this.DateService.dateConvert(new Date());
    this.ObjTruckVoucherCommon.Cost_Cen_ID = this.$CompacctAPI.CompacctCookies.Cost_Cen_ID;
    this.ObjTruckVoucherCommon.Cost_Cen_ID_Trn = this.$CompacctAPI.CompacctCookies.Cost_Cen_ID;
    this.ObjTruckVoucherCommon.Bank_Txn_Type = "CASH";

    this.ObjTruckVoucherTopper.Ledger_ID = this.LedgerForY;
    this.ObjTruckVoucherTopper.DR_Amt = 0;
    this.ObjTruckVoucherTopper.CR_Amt = this.ObjTruck.Rate;
    this.ObjTruckVoucherTopper.Is_Topper = "Y";
    const VoucherList = [];
    const Topper = Object.assign(
      this.ObjTruckVoucherTopper,
      this.ObjTruckVoucherCommon
    );
    VoucherList.push(Topper);
    this.ObjTruckVoucherTopper = new VoucherTopper();
    this.ObjTruckVoucherTopper.Ledger_ID = this.LedgerForN;
    this.ObjTruckVoucherTopper.DR_Amt = this.ObjTruck.Rate;
    this.ObjTruckVoucherTopper.CR_Amt = 0;
    this.ObjTruckVoucherTopper.Is_Topper = "N";
    const TopperN = Object.assign(
      this.ObjTruckVoucherTopper,
      this.ObjTruckVoucherCommon
    );
    VoucherList.push(TopperN);
    return JSON.stringify(VoucherList);
  }
  onTruckPaymentSaved(valid) {
    this.TruckBillFormSubmitted = true;
    if (valid) {
      const obj = {
        json_Account_Journal_Payment_Truck: this.MergeTruckData()
      };
      this.$http
        .post(
          "/BL_Txn_Purchase_Bill_Complete/Purchase_Bill_Payment_Truck_Update",
          { _Txn_Purchase: obj }
        )
        .subscribe((data: any) => {
          if (data.success === true) {
            console.group("Compacct V2");
            console.log("%c  Truck Payment  Bill Sucess:", "color:green;");
            console.log(
              "/BL_Txn_Purchase_Bill_Complete/Purchase_Bill_Payment_Truck_Update"
            );
            this.compacctToast.clear();
            this.compacctToast.add({
              key: "compacct-toast",
              severity: "success",
              summary: "Succesfully Created Truck Payment"
            });
            this.CloseTruckModal();
            this.SearchBill(true);
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
  CloseTruckModal() {
    this.ObjTruckVoucherTopper = new VoucherTopper();
    this.ObjTruck = new Truck();
    this.ObjTruckVoucherCommon.Voucher_Date = undefined;
    this.ObjTruckVoucherCommon.Prev_doc_no = undefined;
    this.ObjTruckVoucherCommon.Naration = undefined;
    this.ObjTruckVoucherCommon.Posted_On = undefined;
    this.ObjTruckVoucherCommon.Voucher_Type_ID = 2;
    this.ObjTruckVoucherCommon.Voucher_No = "A";
    this.ObjTruckVoucherCommon.Cost_Cen_ID = undefined;
    this.ObjTruckVoucherCommon.Cost_Cen_ID_Trn = undefined;
    this.ObjTruckVoucherCommon.Bank_Txn_Type = "CASH";
    this.TruckBillFormSubmitted = false;
    this.displayTruckUploadModal = false;
  }
  PrintTruck(obj) {
    window.open(
      "/Report/Crystal_Files/Finance/Voucher/report_voucher_print.aspx?Doc_No=" +
        obj.Truck_Doc_No,
      "mywindow",
      "fullscreen=yes, scrollbars=auto,width=950,height=500"
    );
  }
}
class Truck {
  Truck_No: string;
  Rate: number;
  Truck_Date: string;
}
class BillSearch {
  from_date: string;
  to_date: string;
  Cost_Cen_ID: string;
}
class CostCenter {
  Cost_Cen_ID: number;
  Cost_Cen_Name: string;
  Cost_Cen_Address1: string;
  Cost_Cen_Address2: string;
  Cost_Cen_Location: string;
  Cost_Cen_District: string;
  Cost_Cen_State: string;
  Cost_Cen_Country: string;
  Cost_Cen_PIN: number;
  Cost_Cen_Mobile: number;
  Cost_Cen_Phone: number;
  Cost_Cen_Email: string; // CHANGED
  Cost_Cen_VAT_CST: number;
  Cost_Cen_CST_NO: number;
  Cost_Cen_SRV_TAX_NO: number;
  Cost_Cen_GST_No: string;
}
class SubLedger {
  Sub_Ledger_ID: number;
  Sub_Ledger_Name: string;
  Sub_Ledger_Billing_Name: string;
  Sub_Ledger_Mailing_Name: string; //
  Sub_Ledger_Address_1: string; //
  Sub_Ledger_Mailing_Address_1: string; //
  Sub_Ledger_Address_2: string;
  Sub_Ledger_Mailing_Address_2: string;
  Sub_Ledger_Address_3: string;
  Sub_Ledger_Land_Mark: string;
  Sub_Ledger_Pin: number;
  Sub_Ledger_District: string;
  Sub_Ledger_State: string;
  Sub_Ledger_Country: string;
  Sub_Ledger_Email: string;
  Sub_Ledger_Mobile_No: number;
  Sub_Ledger_PAN_No: string;
  Sub_Ledger_TIN_No: string;
  Sub_Ledger_CST_No: string;
  Sub_Ledger_SERV_REG_NO: string;
  Sub_Ledger_UID_NO: string;
  Sub_Ledger_EXID_NO: string;
  Sub_Ledger_GST_No: string;
  Address_Caption: string;
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
}
class Term {
  Txn_ID: string;
  DOC_No: string;
  Sale_Pur = 0;
  Term_ID: number;
  Term_Name: number;
  Term_Amount: number;
  SGST_Rate: number;
  SGST_Amount: number;
  CGST_Rate: number;
  CGST_Amount: number;
  IGST_Rate: number;
  IGST_Amount: number;

  CGST_Input_Ledger_ID: number;
  SGST_Input_Ledger_Id: number;
  IGST_Input_Ledger_ID: number;
  Purchase_Ac_Ledger: number;
  HSN_No: number;
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
