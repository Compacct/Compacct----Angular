import {
  Component,
  OnInit,
  Input,
  ViewEncapsulation,
  Output,
  EventEmitter
} from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { DateTimeConvertService } from "../../../../../../shared/compacct.global/dateTime.service";
import { CompacctCommonApi } from "../../../../../../shared/compacct.services/common.api.service";
import { MessageService } from "primeng/api";
import * as moment from "moment";
declare var $: any;

@Component({
  selector: "app-compacct-debit",
  templateUrl: "./compacct.debit.component.html",
  styleUrls: ["./compacct.debit.component.css"],
  encapsulation: ViewEncapsulation.None
})
export class CompacctDebitComponent implements OnInit {
  buttonname = "Create";
  url = window["config"];
  displayDebitModal = false;
  DebitFormSubmitted = false;
  DebitProductFormSubmitted = false;
  DebitInfoSubmitted = false;
  saveSpinner = false;
  weightFlag1 = false;
  weightFlag2 = false;
  weightFlag3 = false;
  DebitViewCols = [];
  DebitEditCols = [];
  frozenCols = [];

  CostCenterList = [];
  GodownLists = [];

  DebitProductList = [];
  DebitEditProto = new Debit();
  CatidwithAmount = [];
  NativeRoundoffID: any;
  ProtoDebitObj = new Debit();
  ObjDebitCommon = new DebitCommon();
  ObjDebitinfo = new Debit();
  ObjVoucherCommon: VoucherCommon = new VoucherCommon();
  ObjVoucherTopper: VoucherTopper = new VoucherTopper();
  private _Bill: {};
  DebitDocDate: any;
  DebitDoc_No: any;
  Weight: number;
  Arr = [];
  DebitAval = {};
  overLayFlag = false;
  nativeBag: any;
  // UPDATE FLAG
  DebitUpdateFlag = false;
  DebitModalFlag = true;
  @Input() set BillNo(value: {}) {
    this._Bill = value;
    if (this._Bill["CreateEdit"] === "HIDE") {
      this.overLayFlag = true;
    } else {
      this.overLayFlag = false;
    }
    this.GetDebitProductList(this._Bill["BillNo"]);
  }
  @Output() DebitEnable = new EventEmitter<{}>();
  constructor(
    private $http: HttpClient,
    private DateService: DateTimeConvertService,
    private $CompacctAPI: CompacctCommonApi,
    private compacctToast: MessageService
  ) {}

  ngOnInit() {
    this.DebitViewCols = [
      { field: "Batch_Number", header: "Lot No." },
      { field: "Final_No_Of_Bag", header: "No. of Bags" },
      { field: "Qty", header: "Total Qty" },
      { field: "Rate", header: "Rate" },
      { field: "Taxable_Amount", header: "Total Amount" },
      { field: "GRN_Less_Total_Bag", header: "Bag Less Qty" },
      { field: "GRN_Less_Total_Bag_Amt", header: "Bag Less Amt" },
      { field: "GRN_Less_Total_Dust", header: "Dust Less Qty" },
      { field: "GRN_Less_Total_Dust_Amt", header: "Dust Less Amt" },
      { field: "GRN_Less_Total_Unloading_Amt", header: "Unloading" },
      { field: "GRN_Less_Total_FFA_Amt", header: "FFA" },
      { field: "GRN_Less_Total_Other_Amt", header: "Others" },
      { field: "GRN_Total_Less_Qty", header: "Total Less Qty" },
      { field: "GRN_Total_Gross_Less_Amt", header: "Total Less Amt" },
      { field: "GRN_CGST_Amount", header: "CGST" },
      { field: "GRN_SGST_Amount", header: "SGST" },
      { field: "GRN_IGST_Amount", header: "IGST" },
      { field: "GRN_Total_Net_Less_Amt", header: "Net Amt" }
    ];
    this.frozenCols = [{ field: "Product_Name", header: "Product Detail" }];
    this.DebitDocDate = new Date();
    this.GetRoundoffID();
  }
  GetRoundoffID() {
    this.$http.get(this.url.apiGetRoundOffId).subscribe((data: any) => {
      this.NativeRoundoffID = data;
    });
  }
  GetDebitProductList(doc_no) {
    this.Weight = 0;
    if (doc_no) {
      const obj = new HttpParams().set("Bill_No", doc_no);
      this.$http
        .get(
          "/BL_Txn_Purchase_Bill_Complete/Get_Debit_Note_Data_With_Bill_No",
          {
            params: obj
          }
        )
        .subscribe((data: any) => {
          this.DebitProductList = data ? JSON.parse(data) : [];
          this.GetCostCenter();
        });
    }
  }
  GetCostCenter() {
    this.$CompacctAPI.getCostCenter().subscribe((data: any) => {
      this.CostCenterList = data ? JSON.parse(data) : [];
      const cookiesCostCenter = this.$CompacctAPI.CompacctCookies.Cost_Cen_ID;
      this.ChangeCostCenter(cookiesCostCenter);
      if (this.DebitProductList.length) {
        this.FetchEditData(this.DebitProductList[0]);
      }
    });
  }
  ChangeCostCenter(CostCenID) {
    this.ObjDebitCommon.Cost_Cen_Name = undefined;
    this.ObjDebitCommon.Cost_Cen_Address1 = undefined;
    this.ObjDebitCommon.Cost_Cen_Address2 = undefined;
    this.ObjDebitCommon.Cost_Cen_Location = undefined;
    this.ObjDebitCommon.Cost_Cen_District = undefined;
    this.ObjDebitCommon.Cost_Cen_State = undefined;
    this.ObjDebitCommon.Cost_Cen_Country = undefined;
    this.ObjDebitCommon.Cost_Cen_PIN = undefined;
    this.ObjDebitCommon.Cost_Cen_Mobile = undefined;
    this.ObjDebitCommon.Cost_Cen_Phone = undefined;
    this.ObjDebitCommon.Cost_Cen_Email = undefined;
    this.ObjDebitCommon.Cost_Cen_VAT_CST = undefined;
    this.ObjDebitCommon.Cost_Cen_CST_NO = undefined;
    this.ObjDebitCommon.Cost_Cen_SRV_TAX_NO = undefined;
    this.ObjDebitCommon.Cost_Cen_GST_No = undefined;
    const List = this.CostCenterList.map(x => Object.assign({}, x));
    if (CostCenID) {
      const obj = $.grep(List, function(value) {
        return value.Cost_Cen_ID === Number(CostCenID);
      })[0];
      this.ObjDebitCommon.Cost_Cen_Name = obj.Cost_Cen_Name;
      this.ObjDebitCommon.Cost_Cen_Address1 = obj.Cost_Cen_Address1
        ? obj.Cost_Cen_Address1
        : "";
      this.ObjDebitCommon.Cost_Cen_Address2 = obj.Cost_Cen_Address2
        ? obj.Cost_Cen_Address2
        : "";
      this.ObjDebitCommon.Cost_Cen_Location = obj.Cost_Cen_Location;
      this.ObjDebitCommon.Cost_Cen_District = obj.Cost_Cen_District;
      this.ObjDebitCommon.Cost_Cen_State = obj.Cost_Cen_State;
      this.ObjDebitCommon.Cost_Cen_Country = obj.Cost_Cen_Country;
      this.ObjDebitCommon.Cost_Cen_PIN = obj.Cost_Cen_PIN;
      this.ObjDebitCommon.Cost_Cen_Mobile = obj.Cost_Cen_Mobile;
      this.ObjDebitCommon.Cost_Cen_Phone = obj.Cost_Cen_Phone;
      this.ObjDebitCommon.Cost_Cen_Email = obj.Cost_Cen_Email;
      this.ObjDebitCommon.Cost_Cen_VAT_CST = obj.Cost_Cen_VAT_CST;
      this.ObjDebitCommon.Cost_Cen_CST_NO = obj.Cost_Cen_CST_NO;
      this.ObjDebitCommon.Cost_Cen_SRV_TAX_NO = obj.Cost_Cen_SRV_TAX_NO;
      this.ObjDebitCommon.Cost_Cen_GST_No = obj.Cost_Cen_GST_No;
      this.GetGodown(CostCenID);
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
  GetDocdate(docDate) {
    if (docDate) {
      this.ObjDebitCommon.Debit_Note_GRN_Date = this.DateService.dateConvert(
        moment(docDate, "YYYY-MM-DD")["_d"]
      );
    }
  }
  // FUNCTION
  FetchEditData(Debitcommon) {
    if (Debitcommon.Challan_Line_No) {
      this.ObjDebitCommon.GRN_Doc_No = Debitcommon.GRN_Doc_No
        ? Debitcommon.GRN_Doc_No_No
        : "A";
      this.DebitDoc_No = Debitcommon.GRN_Doc_No ? Debitcommon.GRN_Doc_No : "";
      this.DebitAval = {
        Doc_No: this.DebitDoc_No ? this.DebitDoc_No : 0,
        Doc_TYPE: "Debit"
      };
      this.buttonname = this.DebitDoc_No ? "Update" : "Create";
      this.DebitDocDate = Debitcommon.Debit_Note_GRN_Date
        ? moment(Debitcommon.Debit_Note_GRN_Date, "YYYY-MM-DD")["_d"]
        : new Date();
      this.ObjDebitCommon.Cost_Cen_ID = Debitcommon.Cost_Cen_ID
        ? Debitcommon.Cost_Cen_ID
        : 0;
      if (!!Debitcommon.Cost_Cen_ID) {
        this.ChangeCostCenter(this.ObjDebitCommon.Cost_Cen_ID);
        this.DebitEnable.emit(this.DebitAval);
      }
      this.DebitUpdateFlag = true;
      this.ObjDebitCommon.godown_id = Debitcommon.godown_id
        ? Debitcommon.godown_id
        : 0;
    }
  }
  AddCatIDAmountLedgerID() {
    this.CatidwithAmount = [];
    for (let i = 0; i < this.DebitProductList.length; i++) {
      this.CatidwithAmount.push({
        Cat_ID: this.DebitProductList[i].Cat_ID,
        Amount: this.DebitProductList[i].Amount,
        Ledger_ID: this.DebitProductList[i].Ledger_ID,
        CGST_Input_Ledger_ID: this.DebitProductList[i].CGST_Input_Ledger_ID,
        SGST_Input_Ledger_Id: this.DebitProductList[i].SGST_Input_Ledger_Id,
        IGST_Input_Ledger_ID: this.DebitProductList[i].IGST_Input_Ledger_ID,
        Discount_Ledger_ID: this.DebitProductList[i].Discount_Ledger_ID,
        CGST_Amount: this.DebitProductList[i].CGST_Amount,
        SGST_Amount: this.DebitProductList[i].SGST_Amount,
        IGST_Amount: this.DebitProductList[i].IGST_Amount,
        Discount_Type_Amount: this.DebitProductList[i].Discount_Type_Amount
      });
    }
  }
  GetDocDateWiseFinancialYearId() {
    const finDateFetch = this.ObjDebitCommon.Debit_Note_GRN_Date
      ? this.ObjDebitCommon.Debit_Note_GRN_Date
      : this.DateService.dateConvert(new Date());
    const obj = new HttpParams().set("DocDate", finDateFetch);
    this.$http
      .get(this.url.apiGetDocDateWiseFinancialYearId, { params: obj })
      .subscribe((data: any) => {
        this.ObjVoucherCommon.Fin_Year_ID = JSON.parse(data)[0].Fin_Year_ID;
        // this.ObjDocDetails.Fin_Year_ID = this.ObjVoucherCommon.Fin_Year_ID;
      });
  }
  ChangeLessBagCalculate(value) {
    if (value) {
      const Weight = Number(this.ProtoDebitObj.Gross_Wt);
      this.ProtoDebitObj.GRN_Less_Bags_Quantity_Qty = Weight * Number(value);
      this.ProtoDebitObj.GRN_Less_Bags_Quantity_Amt =
        Number(this.ProtoDebitObj.GRN_Less_Bags_Quantity_Qty) *
        Number(this.ProtoDebitObj.GRN_Less_Bags_Quantity_Rate);
      this.ProtoDebitObj.Final_No_Of_Bag =
        Number(this.nativeBag) - Number(value);
    } else {
      this.ProtoDebitObj.GRN_Less_Bags_Quantity_Qty = 0;
      this.ProtoDebitObj.GRN_Less_Bags_Quantity_Amt = 0;
      this.ProtoDebitObj.Final_No_Of_Bag = this.nativeBag;
    }
    this.Calculate();
  }
  ChangeBagCalculate(value) {
    if (value) {
      const val = Number(value);
      this.weightFlag1 =
        val < Number(this.ProtoDebitObj.Gross_Wt) ? true : false;
      if (this.weightFlag1 === false) {
        this.compacctToast.clear();
        this.compacctToast.add({
          key: "compacct-toast",
          severity: "error",
          summary: "Validation Error",
          detail: "Quantiy Must Be Less Then Gross Weight"
        });
      }
      this.Calculate();
    }
  }
  ChangeDuskCalculate(value) {
    if (value) {
      const val = Number(value);
      this.weightFlag2 =
        val < Number(this.ProtoDebitObj.Gross_Wt) ? true : false;
      if (this.weightFlag2 === false) {
        this.compacctToast.clear();
        this.compacctToast.add({
          key: "compacct-toast",
          severity: "error",
          summary: "Validation Error",
          detail: "Quantiy Must Be Less Then Gross Weight"
        });
      }
      this.Calculate();
    }
  }

  Calculate() {
    const Bag = Number(this.ProtoDebitObj.Final_No_Of_Bag);
    const Rate = Number(this.ProtoDebitObj.Rate);
    const Weight = Number(this.ProtoDebitObj.Gross_Wt);

    if (this.weightFlag1) {
      this.ProtoDebitObj.GRN_Less_Total_Bag =
        Bag * Number(this.ProtoDebitObj.GRN_Less_Bag_Per_Bag);
      this.ProtoDebitObj.GRN_Less_Total_Bag_Amt =
        Number(this.ProtoDebitObj.GRN_Less_Total_Bag) * Rate;
    } else {
      this.ProtoDebitObj.GRN_Less_Bag_Per_Bag = 0;
      this.ProtoDebitObj.GRN_Less_Total_Bag = 0;
      this.ProtoDebitObj.GRN_Less_Total_Bag_Amt = 0;
    }
    if (this.weightFlag2) {
      this.ProtoDebitObj.GRN_Less_Total_Dust =
        Bag * Number(this.ProtoDebitObj.GRN_Less_Dust_Per_Bag);
      this.ProtoDebitObj.GRN_Less_Total_Dust_Amt =
        Number(this.ProtoDebitObj.GRN_Less_Total_Dust) * Rate;
    } else {
      this.ProtoDebitObj.GRN_Less_Dust_Per_Bag = 0;
      this.ProtoDebitObj.GRN_Less_Total_Dust = 0;
      this.ProtoDebitObj.GRN_Less_Total_Dust_Amt = 0;
    }
    this.ProtoDebitObj.GRN_Less_Total_Unloading_Amt =
      Bag * Number(this.ProtoDebitObj.GRN_Less_Unloading_Per_Bag);
    if (!!this.ProtoDebitObj.GRN_Less_Total_FFA_Persentage) {
      this.ProtoDebitObj.GRN_Less_Total_FFA_Amt = Number(
        (
          (this.ProtoDebitObj.Taxable_Amount *
            this.ProtoDebitObj.GRN_Less_Total_FFA_Persentage) /
          100
        ).toFixed(2)
      );
    } else {
      this.ProtoDebitObj.GRN_Less_Total_FFA_Persentage = 0;
      this.ProtoDebitObj.GRN_Less_Total_FFA_Amt = 0;
    }
    if (this.weightFlag1 || this.weightFlag2) {
      const sum =
        Number(this.ProtoDebitObj.GRN_Less_Bag_Per_Bag) +
        Number(this.ProtoDebitObj.GRN_Less_Dust_Per_Bag);
      const notGreaterThenGrosswt =
        sum < Number(this.ProtoDebitObj.Gross_Wt) ? true : false;
      if (notGreaterThenGrosswt) {
        this.ProtoDebitObj.GRN_Total_Less_Qty =
          this.ProtoDebitObj.GRN_Less_Total_Bag +
          this.ProtoDebitObj.GRN_Less_Total_Dust;
        if (
          this.ProtoDebitObj.GRN_Less_Total_FFA_Amt ||
          this.ProtoDebitObj.GRN_Less_Total_Other_Amt
        ) {
          const FFA = Number(this.ProtoDebitObj.GRN_Less_Total_FFA_Amt);
          const Other = Number(this.ProtoDebitObj.GRN_Less_Total_Other_Amt);
          this.ProtoDebitObj.GRN_Total_Gross_Less_Amt =
            FFA +
            Other +
            this.ProtoDebitObj.GRN_Less_Total_Bag_Amt +
            this.ProtoDebitObj.GRN_Less_Total_Dust_Amt +
            this.ProtoDebitObj.GRN_Less_Total_Unloading_Amt;
        } else {
          this.ProtoDebitObj.GRN_Total_Gross_Less_Amt =
            this.ProtoDebitObj.GRN_Less_Total_Bag_Amt +
            this.ProtoDebitObj.GRN_Less_Total_Dust_Amt +
            this.ProtoDebitObj.GRN_Less_Total_Unloading_Amt;
        }
        this.CalculateAdjustment();
      } else {
        this.ProtoDebitObj.GRN_Total_Gross_Less_Amt = 0;
        this.ProtoDebitObj.GRN_Less_Dust_Per_Bag = 0;
        this.ProtoDebitObj.GRN_Less_Total_Dust = 0;
        this.ProtoDebitObj.GRN_Less_Total_Dust_Amt = 0;
        this.ProtoDebitObj.GRN_Less_Bag_Per_Bag = 0;
        this.ProtoDebitObj.GRN_Less_Total_Bag = 0;
        this.ProtoDebitObj.GRN_Less_Total_Bag_Amt = 0;
        this.compacctToast.clear();
        this.compacctToast.add({
          key: "compacct-toast",
          severity: "error",
          summary: "Validation Error",
          detail: "Total Quantiy Must Be Less Then Gross Weight"
        });
      }
    } else {
      this.ProtoDebitObj.GRN_Total_Less_Qty = 0;
      this.ProtoDebitObj.GRN_Total_Gross_Less_Amt = 0;
    }
  }
  CalculateALLTotal() {
    const IGST_Rate = Number(this.ProtoDebitObj.IGST_Rate);
    const SGST_Rate = Number(this.ProtoDebitObj.SGST_Rate);
    const CGST_Rate = Number(this.ProtoDebitObj.CGST_Rate);
    if (!!this.ProtoDebitObj.GRN_Total_Gross_Less_Amt) {
      this.ProtoDebitObj.GRN_SGST_Amount = Number(
        (
          (this.ProtoDebitObj.GRN_Total_Gross_Less_Amt * SGST_Rate) /
          100
        ).toFixed(2)
      );
      this.ProtoDebitObj.GRN_CGST_Amount = Number(
        (
          (this.ProtoDebitObj.GRN_Total_Gross_Less_Amt * CGST_Rate) /
          100
        ).toFixed(2)
      );
      this.ProtoDebitObj.GRN_IGST_Amount = Number(
        (
          (this.ProtoDebitObj.GRN_Total_Gross_Less_Amt * IGST_Rate) /
          100
        ).toFixed(2)
      );
      this.ProtoDebitObj.GRN_Total_Net_Less_Amt =
        this.ProtoDebitObj.GRN_SGST_Amount +
        this.ProtoDebitObj.GRN_CGST_Amount +
        this.ProtoDebitObj.GRN_IGST_Amount +
        this.ProtoDebitObj.GRN_Total_Gross_Less_Amt;
    }
  }
  CalculateAdjustment() {
    if (this.ProtoDebitObj.Adjustment && this.ProtoDebitObj.Plus_Minus) {
      this.ProtoDebitObj.GRN_Total_Gross_Less_Amt =
        this.ProtoDebitObj.Plus_Minus === "PLUS"
          ? Number(this.ProtoDebitObj.GRN_Total_Gross_Less_Amt) +
            Number(this.ProtoDebitObj.Adjustment)
          : Number(this.ProtoDebitObj.GRN_Total_Gross_Less_Amt) -
            Number(this.ProtoDebitObj.Adjustment);
    }
    this.CalculateALLTotal();
  }
  CalculateNetAmt() {
    let Total = 0,
      SGST = 0,
      CGST = 0,
      IGST = 0,
      NET = 0;
    for (let i = 0; i < this.DebitProductList.length; i++) {
      Total = Total + this.DebitProductList[i].GRN_Total_Gross_Less_Amt;
      CGST = CGST + this.DebitProductList[i].GRN_CGST_Amount;
      SGST = SGST + this.DebitProductList[i].GRN_SGST_Amount;
      IGST = IGST + this.DebitProductList[i].GRN_IGST_Amount;
      NET = NET + this.DebitProductList[i].GRN_Total_Net_Less_Amt;
    }
    this.ObjDebitCommon.GRN_Total_Gross_Less_Amt_INV = Total;
    this.ObjDebitCommon.GRN_CGST_Amount_INV = CGST;
    this.ObjDebitCommon.GRN_SGST_Amount_INV = SGST;
    this.ObjDebitCommon.GRN_IGST_Amount_INV = IGST;
    const roundNet = Math.round(NET);
    this.ObjDebitCommon.GRN_Total_Net_Less_Amt_INV = roundNet; // problem
    this.ObjVoucherTopper.DR_Amt = this.ObjDebitCommon.GRN_Total_Net_Less_Amt_INV;
    this.ObjVoucherTopper.Sub_Ledger_ID = this.DebitProductList[0].Sub_Ledger_ID;
    this.ObjVoucherTopper.Ledger_ID = this.DebitProductList[0].Ledger_ID;
    this.ObjDebitCommon.GRN_ROUNDED_OFF = (
      NET - this.ObjDebitCommon.GRN_Total_Net_Less_Amt_INV
    ).toFixed(2);
  }
  Debitmerge() {
    const DebitArr = this.DebitProductList;
    this.Arr = [];
    this.CatidwithAmount = [];
    for (let i = 0; i < DebitArr.length; i++) {
      // let obj = {};
      this.ObjDebitCommon.Debit_Note_GRN_Date = this.ObjDebitCommon
        .Debit_Note_GRN_Date
        ? this.ObjDebitCommon.Debit_Note_GRN_Date
        : this.DateService.dateConvert(new Date());
      this.ObjDebitCommon.GRN_Doc_No = this.ObjDebitCommon.GRN_Doc_No
        ? this.ObjDebitCommon.GRN_Doc_No
        : "A";
      this.ObjDebitCommon.GRN_User_ID = this.$CompacctAPI.CompacctCookies.User_ID;
      this.ObjDebitCommon.Bill_No = this._Bill["BillNo"];
      this.CatidwithAmount.push({
        Cat_ID: this.DebitProductList[i].Cat_ID,
        Ledger_ID: this.DebitProductList[i].Purchase_Ledger_ID,
        Amount: this.DebitProductList[i].GRN_Total_Gross_Less_Amt,
        CGST_Input_Ledger_ID: this.DebitProductList[i].CGST_Input_Ledger_ID,
        SGST_Input_Ledger_Id: this.DebitProductList[i].SGST_Input_Ledger_Id,
        IGST_Input_Ledger_ID: this.DebitProductList[i].IGST_Input_Ledger_ID,
        GRN_CGST_Amount: this.DebitProductList[i].GRN_CGST_Amount,
        GRN_SGST_Amount: this.DebitProductList[i].GRN_SGST_Amount,
        GRN_IGST_Amount: this.DebitProductList[i].GRN_IGST_Amount
      });
      // obj =  Object.assign(this.ObjDebitCommon, DebitArr[i]);
      const a = {
        ...DebitArr[i],
        ...this.ObjDebitCommon
      };
      this.Arr.push(a);
    }
  }
  //  LESS CONFIRM
  onLessConfirm() {
    this.DebitModalFlag = !this.DebitModalFlag;
  }

  //  MODAL
  DebitModal(Obj) {
    this.displayDebitModal = false;
    this.Weight = 0;
    this.weightFlag1 = false;
    this.weightFlag2 = false;
    this.weightFlag3 = false;
    this.nativeBag = 0;
    this.DebitEditProto = new Debit();
    this.DebitModalFlag = true;
    if (Obj.Product_ID) {
      this.nativeBag = Obj.No_Of_Bag;
      Obj.Debit_Less_Bags_Quantity_Rate = Obj.Rate;
      //  Obj.No_Of_Bag = Obj.Final_No_Of_Bag;
      this.displayDebitModal = true;
      this.ProtoDebitObj = Obj;
      this.DebitEditProto = JSON.parse(JSON.stringify(Obj));
      this.Weight = Obj.Gross_Wt;
      this.GetDocDateWiseFinancialYearId();
      this.weightFlag1 =
        this.ProtoDebitObj.GRN_Less_Bag_Per_Bag <
        Number(this.ProtoDebitObj.Gross_Wt)
          ? true
          : false;
      this.weightFlag2 =
        this.ProtoDebitObj.GRN_Less_Dust_Per_Bag <
        Number(this.ProtoDebitObj.Gross_Wt)
          ? true
          : false;
    }
  }
  CloseModal(reset) {
    for (let i = 0; i < this.DebitProductList.length; i++) {
      if (
        this.DebitProductList[i]["Challan_Line_No"] ===
        this.ProtoDebitObj["Challan_Line_No"]
      ) {
        this.DebitProductList.splice(i, 1, this.DebitEditProto);
        this.DebitUpdateFlag = true;
      }
    }
    this.displayDebitModal = reset ? true : false;
    this.CalculateNetAmt();
    this.DebitEditProto = new Debit();
  }
  onProductConfirm(valid) {
    this.DebitProductFormSubmitted = true;
    this.DebitUpdateFlag = true;
    if (valid && this.weightFlag1 && this.weightFlag2) {
      for (let i = 0; i < this.DebitProductList.length; i++) {
        if (
          this.DebitProductList[i]["Challan_Line_No"] ===
          this.ProtoDebitObj.Challan_Line_No
        ) {
          this.DebitProductList[
            i
          ].Debit_CGST_Rate = this.ProtoDebitObj.CGST_Rate;
          this.DebitProductList[
            i
          ].Debit_SGST_Rate = this.ProtoDebitObj.SGST_Rate;
          this.DebitProductList[
            i
          ].Debit_IGST_Rate = this.ProtoDebitObj.IGST_Rate;
          this.DebitProductList[i].Debit_Actutal_Qty =
            this.ProtoDebitObj.Qty - this.ProtoDebitObj.GRN_Total_Less_Qty;
          // this.DebitProductList[i].Final_No_Of_Bag = this.ProtoDebitObj.No_Of_Bag;
          this.DebitProductList.splice(i, 1, this.ProtoDebitObj);
          this.DebitUpdateFlag = false;
          // this.DebitProductList[i] = ;
        }
      }
      this.displayDebitModal = false;
      this.CalculateNetAmt();
    }
  }
  //  SAVE & ADD
  SaveDebit(valid) {
    this.DebitFormSubmitted = true;
    if (valid && !this.DebitUpdateFlag) {
      this.Debitmerge();
      const dataObj = this.GetAccountJopurnalData();
      if (dataObj.valid) {
        this.saveSpinner = true;
        const obj = {
          json_Purchase_Debit: JSON.stringify(this.Arr),
          json_Account_Journal: dataObj.Data
        };
        this.$http
          .post(
            "/BL_Txn_Purchase_Bill_Complete/Insert_Txn_Purchase_Bill_Debit_Note_Add_Update",
            { _Txn_Purchase: obj }
          )
          .subscribe((data: any) => {
            if (data.success === true) {
              console.group("Compacct V2");
              console.log("%c  Debit UPDATED / ADDED", "color:green;");
              console.log(
                "/BL_Txn_Purchase_Bill_Complete/Insert_Txn_Purchase_Bill_Debit_Add_Update"
              );
              this.compacctToast.clear();
              this.compacctToast.add({
                key: "compacct-toast",
                severity: "success",
                summary:
                  this.ObjDebitCommon.GRN_Doc_No === "A"
                    ? ""
                    : this.ObjDebitCommon.GRN_Doc_No,
                detail:
                  this.ObjDebitCommon.GRN_Doc_No !== "A"
                    ? "Succesfully Updated Debit"
                    : "Succesfully Added Debit"
              });
              this.GetDebitProductList(this.ObjDebitCommon.Bill_No);
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
  //  GET  JOURNAL DATA
  GetAccountJopurnalData() {
    const VoucherDataList = [];
    //  this.ObjVoucherCommon.Voucher_No = Doc_No;
    this.ObjVoucherCommon.Voucher_Date = this.ObjDebitCommon.Debit_Note_GRN_Date
      ? this.DateService.dateConvert(
          new Date(this.ObjDebitCommon.Debit_Note_GRN_Date)
        )
      : this.DateService.dateConvert(new Date());
    this.ObjVoucherCommon.Cost_Cen_ID = this.ObjDebitCommon.Cost_Cen_ID;
    this.ObjVoucherCommon.Cost_Cen_ID_Trn = this.ObjDebitCommon.Cost_Cen_ID;
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
          DR_Amt: 0,
          Sub_Ledger_ID: 0,
          CR_Amt: holder[prop].toFixed(2),
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
          holderCGST[d.CGST_Input_Ledger_ID] + parseFloat(d.GRN_CGST_Amount);
      } else {
        holderCGST[d.CGST_Input_Ledger_ID] = parseFloat(d.GRN_CGST_Amount);
      }
    });

    for (const prop in holderCGST) {
      if (!!Number(this.ObjDebitCommon.GRN_CGST_Amount_INV)) {
        voucherCGST.push({
          Ledger_ID: Number(prop),
          DR_Amt: 0,
          Sub_Ledger_ID: 0,
          CR_Amt: holderCGST[prop].toFixed(2),
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
          holderSGST[d.SGST_Input_Ledger_Id] + parseFloat(d.GRN_SGST_Amount);
      } else {
        holderSGST[d.SGST_Input_Ledger_Id] = parseFloat(d.GRN_SGST_Amount);
      }
    });

    for (const prop in holderSGST) {
      if (!!Number(this.ObjDebitCommon.GRN_SGST_Amount_INV)) {
        voucherSGST.push({
          Ledger_ID: Number(prop),
          CR_Amt: holderSGST[prop].toFixed(2),
          Sub_Ledger_ID: 0,
          DR_Amt: 0,
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
          holderIGST[d.IGST_Input_Ledger_ID] + parseFloat(d.GRN_IGST_Amount);
      } else {
        holderIGST[d.IGST_Input_Ledger_ID] = parseFloat(d.GRN_IGST_Amount);
      }
    });

    for (const prop in holderIGST) {
      if (!!Number(this.ObjDebitCommon.GRN_IGST_Amount_INV)) {
        voucherIGST.push({
          Ledger_ID: Number(prop),
          DR_Amt: 0,
          Sub_Ledger_ID: 0,
          CR_Amt: holderIGST[prop].toFixed(2),
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
    if (!!Number(this.ObjDebitCommon.GRN_ROUNDED_OFF)) {
      console.log(parseFloat(this.ObjDebitCommon.GRN_ROUNDED_OFF));
      if (parseFloat(this.ObjDebitCommon.GRN_ROUNDED_OFF) > 0) {
        const roundaedOf1 = Math.abs(this.ObjDebitCommon.GRN_ROUNDED_OFF);
        RoundoffID.push({
          Ledger_ID: Number(this.NativeRoundoffID),
          CR_Amt: 0,
          Sub_Ledger_ID: 0,
          DR_Amt: parseFloat(roundaedOf1.toString()),
          Is_Topper: "N"
        });
      } else {
        const roundaedOf = Math.abs(this.ObjDebitCommon.GRN_ROUNDED_OFF);
        RoundoffID.push({
          Ledger_ID: Number(this.NativeRoundoffID),
          CR_Amt: parseFloat(roundaedOf.toString()),
          Sub_Ledger_ID: 0,
          DR_Amt: 0,
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
}
class DebitCommon {
  Debit_Note_GRN_Date: string;
  GRN_Doc_No = "A";
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
  godown_id: number;
  Bill_No: string;
  GRN_Total_Gross_Less_Amt_INV: number;
  GRN_CGST_Amount_INV: number;
  GRN_SGST_Amount_INV: number;
  GRN_IGST_Amount_INV: number;
  GRN_Total_Net_Less_Amt_INV: number;
  GRN_ROUNDED_OFF: any;
  GRN_User_ID: number;
}
class Debit {
  Amount: number;
  Batch_Number: string;
  Cost_Cen_ID: number;
  GRN_Actutal_Qty: number;
  GRN_CGST_Amount: number;
  GRN_CGST_Rate: number;

  GRN_Total_Gross_Less_Amt_INV: number;
  GRN_CGST_Amount_INV: number;
  GRN_SGST_Amount_INV: number;
  GRN_IGST_Amount_INV: number;
  GRN_Total_Net_Less_Amt_INV: number;
  GRN_IGST_Amount: number;
  GRN_IGST_Rate: number;
  GRN_Less_Bag_Per_Bag: number;
  GRN_Less_Dust_Per_Bag: number;
  GRN_Less_Total_Bag: number;
  GRN_Less_Total_Bag_Amt: number;
  GRN_Less_Total_Dust_Amt: number;
  GRN_Less_Total_FFA_Amt: number;
  GRN_Less_Total_Other_Amt: number;
  GRN_Less_Total_Unloading_Amt: number;
  GRN_Less_Unloading_Per_Bag: number;
  GRN_SGST_Amount: number;
  GRN_SGST_Rate: number;
  GRN_Total_Gross_Less_Amt: number;
  GRN_Total_Less_Qty: number;
  GRN_Total_Net_Less_Amt: number;
  GRN_Less_Total_Dust: number;
  Gross_Wt: number;
  CGST_Rate: number;
  SGST_Rate: number;
  IGST_Rate: number;
  No_Of_Bag: number;
  Product_ID: number;
  Product_Name: string;
  Qty: number;
  Rate: number;
  Taxable_Amount: number;
  Challan_Line_No: string;

  Doc_No: string;
  UOM: string;
  Project_ID: any;
  Product_Expiry: any;
  Expiry_Date: any;
  Purchase_Challan_Doc_No: string;
  GRN_Less_Total_FFA_Persentage: number;

  GRN_Less_Bags_Quantity_Bag: number;
  GRN_Less_Bags_Quantity_Rate: number;
  GRN_Less_Bags_Quantity_Qty: number;
  GRN_Less_Bags_Quantity_Amt: number;

  Final_No_Of_Bag: number;
  Plus_Minus: string;
  Adjustment: Number;
}
class VoucherCommon {
  Voucher_Type_ID = 7;
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
