import { HttpClient } from "@angular/common/http";
import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { NgxUiLoaderService } from "ngx-ui-loader";
import { MessageService } from "primeng/api";
import { DateTimeConvertService } from "../../../../../shared/compacct.global/dateTime.service";
import { CompacctCommonApi } from "../../../../../shared/compacct.services/common.api.service";
import { CompacctHeader } from "../../../../../shared/compacct.services/common.header.service";
import { CompacctGlobalApiService } from "../../../../../shared/compacct.services/compacct.global.api.service";
import { CommonUserActivityService } from "../../../../../shared/compacct.services/common-user-activity.service";
import { HttpParams } from "@angular/common/http";
import { error } from "console";
window;

@Component({
  selector: "app-bl-txn-purchase-bill-from-grn",
  templateUrl: "./bl-txn-purchase-bill-from-grn.component.html",
  styleUrls: ["./bl-txn-purchase-bill-from-grn.component.css"],
  providers: [MessageService],
  encapsulation: ViewEncapsulation.None,
})
export class BLTxnPurchaseBillFromGRNComponent implements OnInit {
  url = window["config"];
  items: any = ["BROWSE", "CREATE"];
  menuList: any = [];
  Spinner = false;
  seachSpinner = false;
  tabIndexToView = 0;
  buttonname = "Create";
  docNumber: any;
  SearchSaleBillNewFormSubmitted = false;
  CostCenterList: any = [];
  initDate: any = [];
  ObjBrowseSearch: BrowseSearch = new BrowseSearch();
  getAllDataList = [];
  getAllDataListHeaders: any = [];
  Permission: any;

  putchaseBillCumgrnFormSubmitted = false;
  ObjSubLedger: SubLedger = new SubLedger();
  ObjCostCenter: CostCenter = new CostCenter();
  ObjOther: Other = new Other();
  ObjOthersInfo: OthersInfo = new OthersInfo();
  ObjVoucherTopper: VoucherTopper = new VoucherTopper();
  ObjVoucherCommon: VoucherCommon = new VoucherCommon();
  ObjPurchaseBill: PurchaseBill = new PurchaseBill();
  ObjTerm: Term = new Term();
  ShipCostCenter: any = undefined;
  SubLedgerList: any = [];
  SubLedgerAddressLists: any = [];
  compositeGST: any;
  OtherInfoTableLists: any = [];
  states: any = [];
  DocDate = new Date();
  cnnDate = new Date();
  SupplierBillDate = new Date();
  ProjectList: any = [];
  CurrencyList: any = [];
  purchaseChallanList: any = [];
  backuppurchaseChallanList:any = []
  termFormSubmitted = false;
  termList: any = [];
  TermTableLists: any = [];
  CatidwithAmount: any = [];
  RoundoffID: any = undefined;
  termWithOutputLedgerID: any = [];
  accountJournalCreateUpdateApi: any;
  termCreateUpdateApi: any;
  purchaseBillNo: any;
  constructor(
    private Header: CompacctHeader,
    private router: Router,
    private $http: HttpClient,
    private GlobalAPI: CompacctGlobalApiService,
    private DateService: DateTimeConvertService,
    public $CompacctAPI: CompacctCommonApi,
    private compacctToast: MessageService,
    private ngxService: NgxUiLoaderService,
    private route: ActivatedRoute,
    private CommonUserActivity: CommonUserActivityService
  ) {}

  ngOnInit() {
    this.Header.pushHeader({
      Header: "Purchase Bill from Purchase GRN",
      Link: " Financial Management -> Purchase -> Purchase Bill from Purchase GRN",
    });

    this.Permission = this.$CompacctAPI.CompacctCookies.Del_Right;
    this.GetCostCenter();
    this.GetSubLedger();
    this.GetState();
    this.GetProject();
    this.GetCurrency();
    this.getTerms();
    this.GetRoundoffID();
  }
  TabClick(e) {
    this.tabIndexToView = e.index;
    this.items = ["BROWSE", "CREATE"];
    this.buttonname = "Create";
    this.Spinner = false;
    this.clearData();
  }
  clearData() {
    this.docNumber = undefined;
    this.DocDate = new Date();
    this.cnnDate = new Date();
    this.SupplierBillDate = new Date();
    this.ShipCostCenter = undefined;
    this.putchaseBillCumgrnFormSubmitted = false;
    this.ObjSubLedger = new SubLedger();
    this.ObjCostCenter = new CostCenter();
    this.ObjOther = new Other();
    this.ObjOthersInfo = new OthersInfo();
    this.ObjVoucherTopper = new VoucherTopper();
    this.ObjVoucherCommon = new VoucherCommon();
    this.ObjPurchaseBill = new PurchaseBill();
    this.ObjTerm = new Term();
    this.purchaseChallanList = [];
    this.backuppurchaseChallanList = []
    this.Spinner = false
    this.termList = [];
    this.termFormSubmitted = false;
    this.TermTableLists = [];
    this.ObjCostCenter.Cost_Cen_ID = this.ObjCostCenter.Cost_Cen_ID ? this.ObjCostCenter.Cost_Cen_ID : this.$CompacctAPI.CompacctCookies.Cost_Cen_ID;
    this.CostCenterChange(this.ObjCostCenter.Cost_Cen_ID)
    this.GetCurrency();
  }

  GetCostCenter() {
    this.CostCenterList = [];
    this.$http.get(this.url.apiGetCostCenter).subscribe((data: any) => {
      this.CostCenterList = data ? JSON.parse(data) : [];
      console.log(this.CostCenterList)
     
    });
  }

  CostCenterChange(CostCenID) {
    this.ObjPurchaseBill.Cost_Cen_ID = CostCenID;
    const selectCostCenter = this.CostCenterList.filter((el: any) => el.Cost_Cen_ID == CostCenID
    )[0];
    
    this.ObjCostCenter.Cost_Cen_Name =  selectCostCenter.Cost_Cen_Name
    this.ObjCostCenter.Cost_Cen_Address1  = selectCostCenter.Cost_Cen_Address1
    this.ObjCostCenter.Cost_Cen_Address2  = selectCostCenter.Cost_Cen_Address2
    this.ObjCostCenter.Cost_Cen_Location  = selectCostCenter.Cost_Cen_Location
    this.ObjCostCenter.Cost_Cen_District  = selectCostCenter.Cost_Cen_District
    this.ObjCostCenter.Cost_Cen_State  = selectCostCenter.Cost_Cen_State
    this.ObjCostCenter.Cost_Cen_Country  = selectCostCenter.Cost_Cen_Country
    this.ObjCostCenter.Cost_Cen_PIN  = selectCostCenter.Cost_Cen_PIN
    this.ObjCostCenter.Cost_Cen_Mobile  = selectCostCenter.Cost_Cen_Mobile
    this.ObjCostCenter.Cost_Cen_Phone  = selectCostCenter.Cost_Cen_Phone
    this.ObjCostCenter.Cost_Cen_Email1  = selectCostCenter.Cost_Cen_Email1
    this.ObjCostCenter.Cost_Cen_VAT_CST  = selectCostCenter.Cost_Cen_VAT_CST
    this.ObjCostCenter.Cost_Cen_CST_NO  = selectCostCenter.Cost_Cen_CST_NO
    this.ObjCostCenter.Cost_Cen_SRV_TAX_NO  = selectCostCenter.Cost_Cen_SRV_TAX_NO
    this.ObjCostCenter.Cost_Cen_GST_No  = selectCostCenter.Cost_Cen_GST_No

  }

  GetSubLedger() {
    this.$http.get(this.url.apiGetSubledgerCr).subscribe((data: any) => {
      this.SubLedgerList = data ? JSON.parse(data) : [];
      if (this.SubLedgerList.length) {
        this.SubLedgerList.forEach((el: any) => {
          el.label = el.Sub_Ledger_Name;
          el.value = el.Sub_Ledger_ID;
        });
      }
    });
  }

  SubledgerChange(SubLedgerID) {
    console.log(SubLedgerID);
    const obj = this.SubLedgerList.filter(
      (el: any) => el.Sub_Ledger_ID == SubLedgerID
    )[0];

    this.ObjSubLedger.Sub_Ledger_Billing_Name = obj.Sub_Ledger_Billing_Name;
    this.ObjSubLedger.Sub_Ledger_CST_No = obj.Sub_Ledger_CST_No;
    this.ObjSubLedger.Sub_Ledger_EXID_NO = obj.Sub_Ledger_EXID_NO;
    this.ObjSubLedger.Sub_Ledger_Email = obj.Sub_Ledger_Email;
    this.ObjSubLedger.Sub_Ledger_ID = obj.Sub_Ledger_ID;
    this.ObjSubLedger.Sub_Ledger_Mobile_No = obj.Sub_Ledger_Mobile_No;
    this.ObjSubLedger.Sub_Ledger_Name = obj.Sub_Ledger_Name;
    this.ObjSubLedger.Sub_Ledger_PAN_No = obj.Sub_Ledger_PAN_No;
    this.ObjSubLedger.Sub_Ledger_SERV_REG_NO = obj.Sub_Ledger_SERV_REG_NO;
    this.ObjSubLedger.Sub_Ledger_TIN_No = obj.Sub_Ledger_TIN_No;
    this.ObjSubLedger.Sub_Ledger_UID_NO = obj.Sub_Ledger_UID_NO;

    this.compositeGST = obj.Composite_GST;

    this.ObjSubLedger.address_caption = undefined;
    this.ObjSubLedger.Sub_Ledger_Address_1 = "";
    this.ObjSubLedger.Sub_Ledger_Land_Mark = "";
    this.ObjSubLedger.Sub_Ledger_Pin = "";
    this.ObjSubLedger.Sub_Ledger_District = "";
    this.ObjSubLedger.Sub_Ledger_State = "";
    this.ObjSubLedger.Sub_Ledger_Country = "";
    this.ObjSubLedger.Sub_Ledger_GST_No = "";

    this.GetSubLedgerAddressDetails(this.ObjSubLedger.Sub_Ledger_ID);

    this.ObjVoucherTopper.Sub_Ledger_ID = obj.Sub_Ledger_ID;
    this.ObjVoucherTopper.Ledger_ID = obj.Ledger_ID;
    this.ShipCostCenterChange();
  }

  ChangeSubLedgerAddress(captionName) {
    this.OtherInfoTableLists = [];
    if (captionName) {
      const obj = this.SubLedgerAddressLists.filter(
        (el: any) => el.Address_Caption == captionName
      )[0];
      this.ObjSubLedger.Sub_Ledger_Address_1 = obj.Address_1;
      this.ObjSubLedger.Sub_Ledger_Mailing_Address_1 = obj.Address_1;
      this.ObjSubLedger.Sub_Ledger_Land_Mark = obj.Land_Mark;
      this.ObjSubLedger.Sub_Ledger_Pin = obj.Pin;
      this.ObjSubLedger.Sub_Ledger_District = obj.District;
      this.ObjSubLedger.Sub_Ledger_State = obj.State;
      this.ObjSubLedger.Sub_Ledger_Country = obj.Country;
      this.ObjSubLedger.Sub_Ledger_GST_No = obj.Sub_Ledger_GST_No;
    }
  }

  uniqueArray(list) {
    return list.filter(
      (doc, index, self) =>
        index === self.findIndex((d) => d.Doc_No === doc.Doc_No)
    );
  }

  GetSubLedgerAddressDetails(SubLedgerID) {
    this.SubLedgerAddressLists = [];
    const httpParams = new HttpParams().set("Sub_Ledger_ID", SubLedgerID);
    this.$http
      .get(this.url.apiGetSubledgerAddressDetails_, { params: httpParams })
      .subscribe((data: any) => {
        this.SubLedgerAddressLists = data ? JSON.parse(data) : [];
        this.ObjSubLedger.address_caption =
          this.SubLedgerAddressLists.length == 1
            ? this.SubLedgerAddressLists[0].Address_Caption
            : undefined;
        this.ChangeSubLedgerAddress(this.ObjSubLedger.address_caption);
      });
  }

  GetState() {
    this.states = [];
    this.$http.get(this.url.apiGetState).subscribe((data: any) => {
      this.states = data;
    });
  }

  GetProject() {
    this.$http.get(this.url.apiGetProject).subscribe((data: any) => {
      this.ProjectList = data ? data : [];
    });
  }

  GetCurrency() {
    this.$http.get(this.url.apiGetCurrency).subscribe((data: any) => {
      this.CurrencyList = data ? data : [];
      this.ObjOther.Currency_ID = this.CurrencyList.length
        ? this.CurrencyList[0].Currency_ID
        : undefined;
      this.ObjOther.Currency_Symbol = this.CurrencyList.length
        ? this.CurrencyList[0].Currency_Symbol
        : undefined;
    });
  }

  onConfirm() {
    if (this.docNumber) {
      const httpParams = new HttpParams().set("id", this.docNumber);
      this.$http
        .post("/BL_Txn_Purchase_Bill_from_Challan/Delete",{}, {
          params: httpParams,
        })
        .subscribe((data: any) => {
          if (data.success == true) {
            this.compacctToast.clear();
            this.compacctToast.add({
              key: "compacct-toast",
              severity: "success",
              detail: "Succesfully Deleted",
            });
            this.docNumber = undefined;
            this.getSerarch(true);
          }
        });
    }
  }
  onReject() {
    this.compacctToast.clear("c");
  }
  getDateRange(dateRangeObj) {
    if (dateRangeObj.length) {
      this.ObjBrowseSearch.from_date = dateRangeObj[0];
      this.ObjBrowseSearch.to_date = dateRangeObj[1];
    }
  }
  getSerarch(valid) {
    this.SearchSaleBillNewFormSubmitted = true;
    this.getAllDataList = [];
    this.getAllDataListHeaders = [];
    if (valid) {
      this.seachSpinner = true;

      const httpParams = new HttpParams()
        .set(
          "from_date",
          this.ObjBrowseSearch.from_date
            ? this.DateService.dateConvert(
                new Date(this.ObjBrowseSearch.from_date)
              )
            : this.DateService.dateConvert(new Date())
        )
        .set(
          "to_date",
          this.ObjBrowseSearch.to_date
            ? this.DateService.dateConvert(
                new Date(this.ObjBrowseSearch.to_date)
              )
            : this.DateService.dateConvert(new Date())
        )
        .set("Cost_Cen_ID", this.ObjBrowseSearch.Cost_Cen_ID ? this.ObjBrowseSearch.Cost_Cen_ID : 0);

      this.$http
        .get(this.url.apiGetAllDataPurchaseBill, { params: httpParams })
        .subscribe(
          (data: any) => {
            this.seachSpinner = false;
            this.SearchSaleBillNewFormSubmitted = false;

            this.getAllDataList = data;
            console.log(this.getAllDataList);
            if (this.getAllDataList.length) {
              this.getAllDataListHeaders = this.getAllDataList.length
                ? Object.keys(this.getAllDataList[0])
                : [];
            }
          },
          (error) => {
            this.seachSpinner = false;
            this.SearchSaleBillNewFormSubmitted = false;
           }
        );
    }
  }

  PdfGenerate(docNo) {
    window.open(
      "/Report/Crystal_Files/Finance/Purchase/Purchase_Bill_GST_Print.aspx?Doc_No=" +
        docNo,
      "mywindow",
      "fullscreen=yes, scrollbars=auto,width=950,height=500"
    );
  }

  purchaseBillDelete(docNo) {
    if (docNo) {
      this.docNumber = docNo;
      this.compacctToast.clear();
      this.compacctToast.add({
        key: "c",
        sticky: true,
        severity: "warn",
        summary: "Are you sure?",
        detail: "Confirm to proceed",
      });
    }
  }
  GetCurrencySymbol(CurrencyID) {
    this.ObjOther.Currency_Symbol = this.CurrencyList.filter(
      (el: any) => el.Currency_ID == CurrencyID
    )[0].Currency_Symbol;
  }
  ShipCostCenterChange() {
    this.purchaseChallanList = [];
    this.backuppurchaseChallanList = []
    if (this.ShipCostCenter && this.ObjSubLedger.Sub_Ledger_ID) {
      const httpParams = new HttpParams()
        .set("Cost_Cen_ID", this.ShipCostCenter)
        .set("Sub_Ledger_ID", this.ObjSubLedger.Sub_Ledger_ID);
      this.$http
        .get(
          "/BL_Txn_Purchase_Bill_from_Challan/Get_Purchase_Challan_with_No_Bill_for_GRN",
          { params: httpParams }
        )
        .subscribe((data: any) => {
          this.purchaseChallanList = data ? JSON.parse(data) : [];
          this.purchaseChallanList = this.purchaseChallanList.map(
            (el: any) => ({ ...el, ...{ checked: false , purchaseChecked:true} })
          );
          this.backuppurchaseChallanList = JSON.parse(JSON.stringify(this.purchaseChallanList))
        });
    }
  }

  CheckBoxChange(row) {
    if(!row.checked){
        this.backuppurchaseChallanList.forEach((ele,i) => {
            if(ele.Doc_No == row.Doc_No){
              this.purchaseChallanList[i] = {...ele}
            }
        });
    }
    this.purchaseChallanList.forEach((el,i) => {
      if (row.Doc_No == el.Doc_No) {
        el.checked = row.checked;
      }
      if (!el.checked) {
        el.purchaseChecked = true
      }
    });
  }

  GetRoundoffID() {
    this.$http.get(this.url.apiGetRoundOffId).subscribe((data: any) => {
      this.RoundoffID = data;
    });
  }

  selectTableData() {
    const filterChecked = this.purchaseChallanList.filter(
      (el: any) => el.checked
    );

    const filterNotChecked = this.purchaseChallanList.filter(
      (el: any) => !el.checked
    );
    if (filterChecked.length) {
      filterChecked.forEach((el) => {
        el.Discount_Type = el.Discount_Type || "";
        el.Amount = el.Rate * el.Qty;
        el.Discount_Type_Amount = el.Discount_Type_Amount || 0;
        if (el.Discount_Type == "%") {
          el.Discount_Type_Amount = Number(
            ((el.Amount * (el.Discount || 0)) / 100).toFixed(2)
          );
        }
        el.Discount_Type_Amount =
          el.Discount_Type == "%" ? el.Discount_Type_Amount : el.Discount;
        el.Taxable_Amount = el.Discount_Type_Amount
          ? el.Amount - el.Discount_Type_Amount
          : el.Amount;
        if (
          this.ObjSubLedger.Sub_Ledger_State ==
          this.ObjCostCenter.Cost_Cen_State
        ) {
          el.IGST_Rate = 0;
          el.CGST_Amount = Number(
            ((el.Taxable_Amount * el.CGST_Rate) / 100).toFixed(2)
          );
          el.SGST_Amount = Number(
            ((el.Taxable_Amount * el.SGST_Rate) / 100).toFixed(2)
          );
          el.IGST_Amount = 0;
        } else {
          el.CGST_Rate = 0;
          el.SGST_Rate = 0;
          el.CGST_Amount = 0;
          el.SGST_Amount = 0;
          el.IGST_Amount = Number(
            ((el.Taxable_Amount * el.IGST_Rate) / 100).toFixed(2)
          );
        }
      });
    }

    if (filterNotChecked.length) {
      filterNotChecked.forEach((el) => {
        el.Discount_Type = "";
        el.Discount_Type_Amount = 0;
        el.Taxable_Amount = 0;
        el.Amount = 0;
        el.Rate = el.Rate || 0;
        el.CGST_Amount = 0;
        el.SGST_Amount = 0;
        el.IGST_Amount = 0;
        el.Discount = 0;
      });
    }
    this.ListofTotalAmount();
    return filterChecked;
  }

  getTerms() {
    this.termList = [];
    this.$http.get(this.url.apiGetTermForPurchase).subscribe((data: any) => {
      this.termList = data ? JSON.parse(data) : [];
    });
  }
  addTerm(valid) {
    this.termFormSubmitted = true;
    if (valid) {
      let termDublicateCheck = this.TermTableLists.filter(
        (el: any) => el.Term_ID == this.ObjTerm.Term_ID
      );
      if (termDublicateCheck.length) {
        this.compacctToast.clear("c");
        this.compacctToast.add({
          key: "c",
          severity: "warn",
          summary: "Warn Message",
          detail: "Term Already Added",
        });
        return;
      }
      if (
        this.ObjSubLedger.Sub_Ledger_State &&
        this.ObjCostCenter.Cost_Cen_State
      ) {
        if (this.ObjSubLedger.Sub_Ledger_GST_No || this.compositeGST == "No") {
          if (
            this.ObjSubLedger.Sub_Ledger_State ==
            this.ObjCostCenter.Cost_Cen_State
          ) {
            this.ObjTerm.CGST_Amount = (
              (this.ObjTerm.Term_Amount * this.ObjTerm.CGST_Rate) /
              100
            ).toFixed(2);
            this.ObjTerm.SGST_Amount = (
              (this.ObjTerm.Term_Amount * this.ObjTerm.SGST_Rate) /
              100
            ).toFixed(2);
            this.ObjTerm.IGST_Amount = 0;
            this.ObjTerm.IGST_Rate = 0;
          } else {
            this.ObjTerm.IGST_Amount = (
              (this.ObjTerm.Term_Amount * this.ObjTerm.IGST_Rate) /
              100
            ).toFixed(2);
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
      }

      this.TermTableLists.push(this.ObjTerm);
      this.termFormSubmitted = false;
      this.ObjTerm = new Term();
    }
  }
  DeteteTerm(index) {
    this.TermTableLists.splice(index, 1);
  }
  SavePurchaseBill(valid) {
    this.putchaseBillCumgrnFormSubmitted = true;
    if (valid) {
      this.Spinner = true;
      this.ObjPurchaseBill.Posted_ON = this.DateService.dateConvert(new Date());
      this.ObjVoucherCommon.Posted_On = this.DateService.dateConvert(
        new Date()
      );
      this.ObjOther.Doc_Date = this.DateService.dateConvert(
        new Date(this.DocDate)
      );
      this.ObjPurchaseBill.Doc_Date = this.DateService.dateConvert(
        new Date(this.DocDate)
      );
      this.ObjVoucherCommon.Voucher_Date = this.DateService.dateConvert(
        new Date(this.DocDate)
      );
      this.ObjOther.CN_Date = this.DateService.dateConvert(
        new Date(this.cnnDate)
      );
      this.ObjPurchaseBill.Supplier_Bill_Date = this.DateService.dateConvert(
        new Date(this.SupplierBillDate)
      );

      this.ObjPurchaseBill.Project_ID = this.ObjOther.Project_ID;
      this.ObjPurchaseBill.User_ID = this.$CompacctAPI.CompacctCookies.User_ID;
      this.ObjPurchaseBill.PAN_No = this.ObjSubLedger.Sub_Ledger_PAN_No;
      this.ObjPurchaseBill.Sub_Ledger_GST = this.ObjSubLedger.Sub_Ledger_GST_No;

      this.accountJournalCreateUpdateApi = this.ObjOther.Doc_No
        ? this.url.apiUpdateSaleBillAccountJournal
        : '/ACC_Txn_Acc_Journal/Create_ACC_Txn_Acc_Journal_WO_NO_Ajax_pbill_only';
      this.termCreateUpdateApi = this.ObjOther.Doc_No
        ? this.url.apiUpdateTerm
        : this.url.apiCreateTerm;

      console.log(this.ObjPurchaseBill);
      this.$http
        .post(this.url.apiCreatePurchaseBillFromChallan, [
          { ...this.ObjSubLedger, ...this.ObjPurchaseBill },
        ])
        .subscribe((data: any) => {
          if (data.success) {
            this.CommonUserActivity.GetUserActivity( this.buttonname, "Purchase Bill", data.Doc_No, 0);
            this.SavePurchaseChallan(data.Doc_No);
            this.purchaseBillNo = data.Doc_No;
          }
        });
    }
  }

  SavePurchaseChallan(billNo) {
    this.ObjOther.User_ID = this.$CompacctAPI.CompacctCookies.User_ID;
    this.$http
      .post(this.url.apiUpdatePurchaseChallanWithBillNo, {
        Purchase_Challan_Bill: JSON.stringify(this.mergeOthers(billNo)),
      })
      .subscribe((data: any) => {
        if (data.success) {
          this.SaveVoucher(this.purchaseBillNo);
        }
      });
  }
  mergeOthers(billNo) {
    let purchaseBillGST: any = [];
    var obj = {};
    const filterChecked = this.purchaseChallanList.filter(
      (el: any) => el.checked && el.purchaseChecked
    );
    for (let i = 0; i < filterChecked.length; i++) {
      filterChecked[i].Bill_Gross_Amt = this.ObjPurchaseBill.Gross_Amt;
      filterChecked[i].Bill_Net_Amt = this.ObjPurchaseBill.Net_Amt;
      filterChecked[i].Bill_No = billNo;
      filterChecked[i].Bill_Date = this.ObjPurchaseBill.Doc_Date;
      obj = {};
      purchaseBillGST.push({
        ...filterChecked[i],
        ...this.ObjSubLedger,
        ...this.ObjCostCenter,
        ...this.ObjOther,
      });
    }
    return purchaseBillGST;
  }
  termChange(termID) {
    this.ObjTerm.Term_Amount = undefined;
    this.ObjTerm.HSN_No = undefined;
    if (termID) {
      let obj = this.termList.filter((el: any) => el.Term_ID == termID)[0];
      this.ObjTerm.Term_Name = obj.Term_Name;
      this.ObjTerm.HSN_No = obj.HSN_No;
      this.ObjTerm.SGST_Rate = obj.SGST_Tax_Per;
      this.ObjTerm.CGST_Rate = obj.CGST_Tax_Per;
      this.ObjTerm.IGST_Rate = obj.IGST_Tax_Per;
      this.ObjTerm.CGST_Input_Ledger_ID = obj.CGST_Input_Ledger_ID;
      this.ObjTerm.SGST_Input_Ledger_Id = obj.SGST_Input_Ledger_Id;
      this.ObjTerm.IGST_Input_Ledger_ID = obj.IGST_Input_Ledger_ID;
      this.ObjTerm.Purchase_Ac_Ledger = obj.Purchase_Ac_Ledger;
    }
  }
  ListofTotalAmount() {
    this.ObjPurchaseBill.Total_Amount = 0;
    this.ObjPurchaseBill.Taxable_Amt = 0;
    this.ObjPurchaseBill.Tax_Amt = 0;
    this.ObjPurchaseBill.Net_Amt = 0;
    this.ObjPurchaseBill.Gross_Amt = 0;
    this.ObjPurchaseBill.CGST_Amt = 0;
    this.ObjPurchaseBill.SGST_Amt = 0;
    this.ObjPurchaseBill.IGST_Amt = 0;
    this.ObjPurchaseBill.ROUNDED_OFF = 0;
    this.ObjPurchaseBill.Discount_Amount = 0;
    const filterChecked = this.purchaseChallanList.filter(
      (el: any) => el.checked && el.purchaseChecked 
    );
    this.ObjPurchaseBill.Total_Amount = filterChecked
      .reduce((acc, curr) => acc + curr.Amount, 0)
      .toFixed(2);
    this.ObjPurchaseBill.Discount_Amount = filterChecked
      .reduce((acc, curr) => acc + Number(curr.Discount_Type_Amount || 0), 0)
      .toFixed(2);
    this.ObjPurchaseBill.Taxable_Amt = filterChecked
      .reduce((acc, curr) => acc + curr.Taxable_Amount, 0)
      .toFixed(2);
    this.ObjPurchaseBill.CGST_Amt = filterChecked
      .reduce((acc, curr) => acc + curr.CGST_Amount, 0)
      .toFixed(2);
    this.ObjPurchaseBill.SGST_Amt = filterChecked
      .reduce((acc, curr) => acc + curr.SGST_Amount, 0)
      .toFixed(2);
    this.ObjPurchaseBill.IGST_Amt = filterChecked
      .reduce((acc, curr) => acc + curr.IGST_Amount, 0)
      .toFixed(2);
    this.ObjPurchaseBill.Term_Amt = this.TermTableLists.reduce(
      (acc, curr) => acc + curr.Term_Amount,
      0
    ).toFixed(2);
    this.ObjPurchaseBill.Gross_Amt = (
      Number(this.ObjPurchaseBill.Taxable_Amt) +
      Number(this.ObjPurchaseBill.CGST_Amt) +
      Number(this.ObjPurchaseBill.SGST_Amt) +
      Number(this.ObjPurchaseBill.IGST_Amt)
    ).toFixed(2);
    this.ObjPurchaseBill.Net_Amt = Math.round(this.ObjPurchaseBill.Gross_Amt);
    this.ObjPurchaseBill.ROUNDED_OFF = (
      Number(this.ObjPurchaseBill.Net_Amt) -
      Number(this.ObjPurchaseBill.Gross_Amt)
    ).toFixed(2);
    this.ObjVoucherTopper.CR_Amt = this.ObjPurchaseBill.Net_Amt;
    this.AddCatIDAmountLedgerID();
  }

  getDocDateWiseFinancialYearId() {
    const httpParams = new HttpParams().set(
      "DocDate",
      this.DateService.dateConvert(new Date(this.DocDate))
    );

    this.$http
      .get(this.url.apiGetDocDateWiseFinancialYearId, { params: httpParams })
      .subscribe((data: any) => {
        if (data) {
          var obj = JSON.parse(data)[0];
          this.ObjVoucherCommon.Fin_Year_ID = obj.Fin_Year_ID;
        }
      });
  }


  checkLength(){
   const filterChecked = this.purchaseChallanList.filter(
      (el: any) => el.purchaseChecked
    );
    return filterChecked.length
  }

  AddCatIDAmountLedgerID = function () {
    this.CatidwithAmount = [];
    const filterChecked = this.purchaseChallanList.filter(
      (el: any) => el.checked && el.purchaseChecked
    );
    for (var i = 0; i < filterChecked.length; i++) {
      filterChecked;
      this.CatidwithAmount.push({
        Cat_ID: filterChecked[i].Cat_ID,
        Amount: filterChecked[i].Amount,
        Ledger_ID: filterChecked[i].Ledger_ID,
        CGST_Input_Ledger_ID: filterChecked[i].CGST_Input_Ledger_ID,
        SGST_Input_Ledger_Id: filterChecked[i].SGST_Input_Ledger_Id,
        IGST_Input_Ledger_ID: filterChecked[i].IGST_Input_Ledger_ID,
        Discount_Ledger_ID: filterChecked[i].Discount_Ledger_ID,
        CGST_Amount: filterChecked[i].CGST_Amount,
        SGST_Amount: filterChecked[i].SGST_Amount,
        IGST_Amount: filterChecked[i].IGST_Amount,
        Discount_Type_Amount: filterChecked[i].Discount_Type_Amount,
      });
    }
  };

  addtermWithOutputLedgerID = function () {
    this.termWithOutputLedgerID = [];
    for (var i = 0; i < this.termList.length; i++) {
      this.termWithOutputLedgerID.push({
        CGST_Input_Ledger_ID: this.termList[i].CGST_Input_Ledger_ID,
        SGST_Input_Ledger_Id: this.termList[i].SGST_Input_Ledger_Id,
        IGST_Input_Ledger_ID: this.termList[i].IGST_Input_Ledger_ID,
        Purchase_Ac_Ledger: this.termList[i].Purchase_Ac_Ledger,
        CGST_Amount: this.termList[i].CGST_Amount,
        SGST_Amount: this.termList[i].SGST_Amount,
        IGST_Amount: this.termList[i].IGST_Amount,
        Term_Amount: this.termList[i].Term_Amount,
      });
    }
  };
  SaveVoucher(Doc_No) {
    let VoucherDataList: any = [];
    //topper data
    this.ObjVoucherCommon.Voucher_No = Doc_No;
    this.ObjVoucherCommon.Cost_Cen_ID =
      this.$CompacctAPI.CompacctCookies.Cost_Cen_ID;
    this.ObjVoucherCommon.User_ID = this.$CompacctAPI.CompacctCookies.User_ID;
    // ctrl.ObjVoucherCommon.Fin_Year_ID = ctrl.userdata.Fin_Year_ID;
    this.getDocDateWiseFinancialYearId();

    var TopperData = { ...this.ObjVoucherTopper, ...this.ObjVoucherCommon };
    VoucherDataList.push(TopperData);

    //product
    var voucherproduct: any = [];
    var holder = {};
    this.CatidwithAmount.forEach(function (d) {
      if (holder.hasOwnProperty(d.Ledger_ID)) {
        holder[d.Ledger_ID] = holder[d.Ledger_ID] + Number(d.Amount);
      } else {
        holder[d.Ledger_ID] = Number(d.Amount);
      }
    });

    for (var prop in holder) {
      voucherproduct.push({
        Ledger_ID: Number(prop),
        CR_Amt: 0,
        Sub_Ledger_ID: 0,
        DR_Amt: holder[prop].toFixed(2),
        Is_Topper: "N",
      });
    }

    for (var i = 0; i < voucherproduct.length; i++) {
      var tempproduct = { ...voucherproduct[i], ...this.ObjVoucherCommon };
      VoucherDataList.push(tempproduct);
    }
    // CGST_Input_Ledger_ID
    var voucherCGST: any = [];
    var holderCGST = {};
    this.CatidwithAmount.forEach(function (d) {
      if (holderCGST.hasOwnProperty(d.CGST_Input_Ledger_ID)) {
        holderCGST[d.CGST_Input_Ledger_ID] =
          holderCGST[d.CGST_Input_Ledger_ID] + Number(d.CGST_Amount);
      } else {
        holderCGST[d.CGST_Input_Ledger_ID] = Number(d.CGST_Amount);
      }
    });

    for (var prop in holderCGST) {
      voucherCGST.push({
        Ledger_ID: Number(prop),
        CR_Amt: 0,
        Sub_Ledger_ID: 0,
        DR_Amt: holderCGST[prop].toFixed(2),
        Is_Topper: "N",
      });
    }

    for (var i = 0; i < voucherCGST.length; i++) {
      if (voucherCGST[i].Ledger_ID != 0) {
        var tempCGST = { ...voucherCGST[i], ...this.ObjVoucherCommon };
        VoucherDataList.push(tempCGST);
      }
    }

    // SGST_Input_Ledger_Id
    var voucherSGST: any = [];
    var holderSGST = {};
    this.CatidwithAmount.forEach(function (d) {
      if (holderSGST.hasOwnProperty(d.SGST_Input_Ledger_Id)) {
        holderSGST[d.SGST_Input_Ledger_Id] =
          holderSGST[d.SGST_Input_Ledger_Id] + Number(d.SGST_Amount);
      } else {
        holderSGST[d.SGST_Input_Ledger_Id] = Number(d.SGST_Amount);
      }
    });

    for (var prop in holderSGST) {
      voucherSGST.push({
        Ledger_ID: Number(prop),
        CR_Amt: 0,
        Sub_Ledger_ID: 0,
        DR_Amt: holderSGST[prop].toFixed(2),
        Is_Topper: "N",
      });
    }

    for (var i = 0; i < voucherSGST.length; i++) {
      if (voucherSGST[i].Ledger_ID != 0) {
        var tempSGST = { ...voucherSGST[i], ...this.ObjVoucherCommon };
        VoucherDataList.push(tempSGST);
      }
    }
    // IGST_Input_Ledger_ID
    var voucherIGST: any = [];
    var holderIGST = {};
    this.CatidwithAmount.forEach(function (d) {
      if (holderIGST.hasOwnProperty(d.IGST_Input_Ledger_ID)) {
        holderIGST[d.IGST_Input_Ledger_ID] =
          holderIGST[d.IGST_Input_Ledger_ID] + Number(d.IGST_Amount);
      } else {
        holderIGST[d.IGST_Input_Ledger_ID] = Number(d.IGST_Amount);
      }
    });

    for (var prop in holderIGST) {
      voucherIGST.push({
        Ledger_ID: Number(prop),
        CR_Amt: 0,
        Sub_Ledger_ID: 0,
        DR_Amt: holderIGST[prop].toFixed(2),
        Is_Topper: "N",
      });
    }

    for (var i = 0; i < voucherIGST.length; i++) {
      if (voucherIGST[i].Ledger_ID != 0) {
        var tempIGST = { ...voucherIGST[i], ...this.ObjVoucherCommon };
        VoucherDataList.push(tempIGST);
      }
    }

    // Discount_Ledger_ID
    var voucherDiscount: any = [];
    var holderDiscount = {};
    this.CatidwithAmount.forEach(function (d) {
      if (holderDiscount.hasOwnProperty(d.Discount_Ledger_ID)) {
        holderDiscount[d.Discount_Ledger_ID] =
          holderDiscount[d.Discount_Ledger_ID] + Number(d.Discount_Type_Amount);
      } else {
        holderDiscount[d.Discount_Ledger_ID] = Number(d.Discount_Type_Amount);
      }
    });

    for (var prop in holderDiscount) {
      voucherDiscount.push({
        Ledger_ID: Number(prop),
        DR_Amt: 0,
        Sub_Ledger_ID: 0,
        CR_Amt: holderDiscount[prop].toFixed(2),
        Is_Topper: "N",
      });
    }

    for (var i = 0; i < voucherDiscount.length; i++) {
      if (voucherDiscount[i].Ledger_ID != 0) {
        var tempIGST = { ...voucherDiscount[i], ...this.ObjVoucherCommon };
        VoucherDataList.push(tempIGST);
      }
    }

    //   Round_off_ID
    var RoundoffID: any = [];
    // console.log(ctrl.RoundoffID);
    if (Number(this.ObjPurchaseBill.ROUNDED_OFF) > 0) {
      var roundaedOf = Math.abs(this.ObjPurchaseBill.ROUNDED_OFF);
      RoundoffID.push({
        Ledger_ID: Number(RoundoffID),
        DR_Amt: Number(roundaedOf),
        Sub_Ledger_ID: 0,
        CR_Amt: 0,
        Is_Topper: "N",
      });
    } else {
      var roundaedOf = Math.abs(this.ObjPurchaseBill.ROUNDED_OFF);
      RoundoffID.push({
        Ledger_ID: Number(this.RoundoffID),
        DR_Amt: 0,
        Sub_Ledger_ID: 0,
        CR_Amt: Number(roundaedOf).toFixed(2),
        Is_Topper: "N",
      });
    }
    for (var i = 0; i < RoundoffID.length; i++) {
      if (RoundoffID[i].Ledger_ID != 0) {
        var tempRoundOff = { ...RoundoffID[i], ...this.ObjVoucherCommon };
        VoucherDataList.push(tempRoundOff);
      }
    }
    // Term List
    if (this.termList.length != 0) {
      //SGST_Input_Ledger_Id
      var termSGST: any = [];
      var holderSGST = {};
      this.termWithOutputLedgerID.forEach(function (d) {
        if (holderSGST.hasOwnProperty(d.SGST_Input_Ledger_Id)) {
          holderSGST[d.SGST_Input_Ledger_Id] =
            holderSGST[d.SGST_Input_Ledger_Id] + Number(d.SGST_Amount);
        } else {
          holderSGST[d.SGST_Input_Ledger_Id] = Number(d.SGST_Amount);
        }
      });
      for (var prop in holderSGST) {
        termSGST.push({
          Ledger_ID: Number(prop),
          CR_Amt: 0,
          Sub_Ledger_ID: 0,
          DR_Amt: holderSGST[prop].toFixed(2),
          Is_Topper: "N",
        });
      }
      for (var i = 0; i < termSGST.length; i++) {
        if (termSGST[i].Ledger_ID != 0) {
          var tempSGST = { ...termSGST[i], ...this.ObjVoucherCommon };
          VoucherDataList.push(tempSGST);
        }
      }
      //CGST_Input_Ledger_ID
      var termCGST: any = [];
      var holderCGST = {};
      this.termWithOutputLedgerID.forEach(function (d) {
        if (holderCGST.hasOwnProperty(d.CGST_Input_Ledger_ID)) {
          holderCGST[d.CGST_Input_Ledger_ID] =
            holderCGST[d.CGST_Input_Ledger_ID] + Number(d.CGST_Amount);
        } else {
          holderCGST[d.CGST_Input_Ledger_ID] = Number(d.CGST_Amount);
        }
      });
      for (var prop in holderCGST) {
        termCGST.push({
          Ledger_ID: Number(prop),
          CR_Amt: 0,
          Sub_Ledger_ID: 0,
          DR_Amt: holderCGST[prop].toFixed(2),
          Is_Topper: "N",
        });
      }
      for (var i = 0; i < termCGST.length; i++) {
        if (termCGST[i].Ledger_ID != 0) {
          var tempCGST = { ...termCGST[i], ...this.ObjVoucherCommon };
          VoucherDataList.push(tempCGST);
        }
      }
      //IGST_Input_Ledger_ID
      var termIGST: any = [];
      var holderIGST = {};
      this.termWithOutputLedgerID.forEach(function (d) {
        if (holderIGST.hasOwnProperty(d.IGST_Input_Ledger_ID)) {
          holderIGST[d.IGST_Input_Ledger_ID] =
            holderIGST[d.IGST_Input_Ledger_ID] + Number(d.IGST_Amount);
        } else {
          holderIGST[d.IGST_Input_Ledger_ID] = Number(d.IGST_Amount);
        }
      });
      for (var prop in holderIGST) {
        termIGST.push({
          Ledger_ID: Number(prop),
          CR_Amt: 0,
          Sub_Ledger_ID: 0,
          DR_Amt: holderIGST[prop].toFixed(2),
          Is_Topper: "N",
        });
      }
      for (var i = 0; i < termIGST.length; i++) {
        if (termIGST[i].Ledger_ID != 0) {
          var tempCGST = { ...termIGST[i], ...this.ObjVoucherCommon };
          VoucherDataList.push(tempCGST);
        }
      }
      //Purchase_Ac_Ledger
      var termSalesAc: any = [];
      var holderSalesAc = {};
      this.termWithOutputLedgerID.forEach(function (d) {
        if (holderSalesAc.hasOwnProperty(d.Purchase_Ac_Ledger)) {
          holderSalesAc[d.Purchase_Ac_Ledger] =
            holderSalesAc[d.Purchase_Ac_Ledger] + Number(d.Term_Amount);
        } else {
          holderSalesAc[d.Purchase_Ac_Ledger] = Number(d.Term_Amount);
        }
      });
      for (var prop in holderSalesAc) {
        termSalesAc.push({
          Ledger_ID: Number(prop),
          CR_Amt: 0,
          Sub_Ledger_ID: 0,
          DR_Amt: holderSalesAc[prop].toFixed(2),
          Is_Topper: "N",
        });
      }
      for (var i = 0; i < termSalesAc.length; i++) {
        if (termSalesAc[i].Ledger_ID != 0) {
          var tempCGST = { ...termSalesAc[i], ...this.ObjVoucherCommon };
          VoucherDataList.push(tempCGST);
        }
      }
    }

    var totaldr = 0;
    var totalcr = 0;
    for (i = 0; i < VoucherDataList.length; i++) {
      totaldr = totaldr + Number(VoucherDataList[i].DR_Amt);
      totalcr = totalcr + Number(VoucherDataList[i].CR_Amt);
    }

    this.$http
      .post(this.accountJournalCreateUpdateApi, VoucherDataList)
      .subscribe((data: any) => {
        if (data.success) {
          if (this.TermTableLists.length) {
            this.SaveTerm(this.ObjVoucherCommon.Voucher_No);
          }
          else{
            this.compacctToast.clear();
            this.compacctToast.add({
              key: "compacct-toast",
              severity: "success",
              summary: "Succesfully Created",
              detail: "Doc No : " + Doc_No,
            });

           const backUpsub = JSON.parse( JSON.stringify(this.ObjSubLedger))
           this.clearData()
           this.ObjSubLedger.Sub_Ledger_ID = backUpsub.Sub_Ledger_ID
           this.SubledgerChange(this.ObjSubLedger.Sub_Ledger_ID)
          }
        }
      });
  }

  SaveTerm(docNo) {
    for (let i = 0; i < this.termList.length; i++) {
      this.termList[i].DOC_No = docNo;
    }
    this.$http
      .post(this.termCreateUpdateApi, this.termList)
      .subscribe((data: any) => {
        if (data.success) {
           this.compacctToast.clear();
            this.compacctToast.add({
              key: "compacct-toast",
              severity: "success",
              summary: "Succesfully Created",
              detail: "Doc No : " + docNo,
            });
          const backUpsub = JSON.parse( JSON.stringify(this.ObjSubLedger))
           this.clearData()
           this.ObjSubLedger.Sub_Ledger_ID = backUpsub.Sub_Ledger_ID
           this.SubledgerChange(this.ObjSubLedger.Sub_Ledger_ID)
        }
      });
  }
}

class BrowseSearch {
  from_date: any;
  to_date: any;
  Cost_Cen_ID: any;
}

class SubLedger {
  Sub_Ledger_ID: any;
  Sub_Ledger_Name: any;
  Sub_Ledger_Billing_Name: any;
  Sub_Ledger_Address_1: any;
  Sub_Ledger_Mailing_Address_1: any;
  Sub_Ledger_Address_2: any;
  Sub_Ledger_Address_3: any;
  Sub_Ledger_Land_Mark: any;
  Sub_Ledger_Pin: any;
  Sub_Ledger_District: any;
  Sub_Ledger_State: any;
  Sub_Ledger_Country: any;
  Sub_Ledger_Email: any;
  Sub_Ledger_Mobile_No: any;
  Sub_Ledger_PAN_No: any;
  Sub_Ledger_TIN_No: any;
  Sub_Ledger_CST_No: any;
  Sub_Ledger_SERV_REG_NO: any;
  Sub_Ledger_UID_NO: any;
  Sub_Ledger_EXID_NO: any;
  Sub_Ledger_GST_No: any;
  address_caption: any;
}

class CostCenter {
  Cost_Cen_ID: any;
  Cost_Cen_Name: any;
  Cost_Cen_Address1: any;
  Cost_Cen_Address2: any;
  Cost_Cen_Location: any;
  Cost_Cen_District: any;
  Cost_Cen_State: any;
  Cost_Cen_Country: any;
  Cost_Cen_PIN: any;
  Cost_Cen_Mobile: any;
  Cost_Cen_Phone: any;
  Cost_Cen_Email1: any;
  Cost_Cen_VAT_CST: any;
  Cost_Cen_CST_NO: any;
  Cost_Cen_SRV_TAX_NO: any;
  Cost_Cen_GST_No: any;
}

class Other {
  Doc_No: any;
  Doc_Date: any;
  Project_ID: any;
  Order_No: any;
  Order_Date: any;
  CN_No: any;
  CN_Date: any;
  User_ID: any;
  Entry_Date: any;
  Currency_ID: any;
  Currency_Symbol: any;
  Warranty_Terms: any;
  Billed = "Y";
}

class OthersInfo {
  Pur_Order_No: any;
  Pur_Order_Date: any;
  Product_ID: any;
  Product_Name: any;
  Batch_Number: any;
  Serial_No: any;
  HSL_No: any;
  Qty: any;
  UOM: any;
  Rate: any;
  MRP: any;
  Amount: any;
  Discount_Type: any;
  Discount: any;
  Discount_Type_Amount: any;
  Taxable_Amount: any;
  CGST_Rate: any;
  CGST_Amount: any;
  SGST_Rate: any;
  SGST_Amount: any;
  IGST_Rate: any;
  IGST_Amount: any;
  Cat_ID: any;
  Cat_Name: any;
  godown_id: any;
  godown_name: any;
  Ledger_ID: any;
  Excise_Tax: any;
  Excise_Tax_Percentage: any;
  CGST_Input_Ledger_ID: any;
  SGST_Input_Ledger_Id: any;
  IGST_Input_Ledger_ID: any;
  Discount_Ledger_ID: any;
  Product_Expiry: any;
  Expiry_Date: any;
  purchaseChallan: any;
  Bill_Gross_Amt: any;
  Bill_Net_Amt: any;
  Billed: any;
  Bill_No: any;
  Bill_Date: any;
  Challan_Line_No: any;
}

class VoucherTopper {
  Ledger_ID: any;
  Sub_Ledger_ID: any;
  DR_Amt: any;
  CR_Amt: any;
  Is_Topper: any = "Y";
}

class VoucherCommon {
  Voucher_Type_ID = 6;
  Voucher_No: any;
  Voucher_Date: any;
  Reconsil_Date = 1 + "/" + "Jan" + "/" + 1900;
  Reconsil_Tag = "N";
  Fin_Year_ID: any;
  Naration = "";
  Cost_Cen_ID: any;
  Cost_Cen_ID_Trn: any = undefined;
  Project_ID: any;
  Auto_Posted = "N";
  Posted_On: any;
  User_ID: any;
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

class PurchaseBill {
  Doc_No: any; //
  Doc_Date: any; //
  Purchase_Challan_No: any;
  Supplier_Bill_No: any;
  Supplier_Bill_Date: any;
  Total_Amount: any;
  Discount_Amount: any;
  Taxable_Amt: any;
  Net_Amt: any;
  Tax_Amt = 0;
  Term_Amt: any;
  CGST_Amt: any;
  SGST_Amt: any;
  IGST_Amt: any;
  Gross_Amt: any;
  ROUNDED_OFF: any;
  User_ID: any;
  Posted_ON: any;
  Cost_Cen_ID: any;
  Project_ID: any;
  Bill_Type: any;
  For_Use_Of: any;
  Pur_From: any;
  Tax_Applicable: any;
  Against_C_Form: any;
  PAN_No: any;
  TAN_No: any;
  C_Form_No: any;
  Status: any = "A";
  CST_No: any;
  Sub_Ledger_GST: any;
  Remarks: any;
}

class Term {
  Txn_ID: any;
  DOC_No: any;
  Sale_Pur = 0;
  Term_ID: any;
  Term_Name: any;
  Term_Amount: any;
  SGST_Rate: any;
  SGST_Amount: any;
  CGST_Rate: any;
  CGST_Amount: any;
  IGST_Rate: any;
  IGST_Amount: any;
  CGST_Input_Ledger_ID: any;
  SGST_Input_Ledger_Id: any;
  IGST_Input_Ledger_ID: any;
  Purchase_Ac_Ledger: any;
  HSN_No: any;
}
