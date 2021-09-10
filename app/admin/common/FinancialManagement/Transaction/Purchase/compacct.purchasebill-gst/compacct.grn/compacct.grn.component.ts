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
  selector: "app-compacct-grn",
  templateUrl: "./compacct.grn.component.html",
  styleUrls: ["./compacct.grn.component.css"]
})
export class CompacctGrnComponent implements OnInit {
  buttonname = "Create";
  url = window["config"];
  displayGRNModal = false;
  GRNFormSubmitted = false;
  GRNProductFormSubmitted = false;
  GRNInfoSubmitted = false;
  saveSpinner = false;

  CostCenterList = [];
  GodownLists = [];

  GRNProductList = [];
  ProductInfoListView = [];
  ObjGRNCommon = new GRNCommon();
  private _Bill: {};
  GRNDocDate: any;
  GRNDoc_No: any;
  Arr = [];
  GRNAval = {};
  overLayFlag = false;
  nativeBag: any;
  // UPDATE FLAG
  GRNUpdateFlag = false;
  GRNModalFlag = true;
  @Input() set BillNo(value: {}) {
    this._Bill = value;
    if (this._Bill["CreateEdit"] === "HIDE") {
      this.overLayFlag = true;
    } else {
      this.overLayFlag = false;
    }
    this.GetGRNProductList(this._Bill["BillNo"]);
    this.GetPurchaseBillProductData(this._Bill["BillNo"]);
  }
  @Output() GRNEnable = new EventEmitter<{}>();
  constructor(
    private $http: HttpClient,
    private DateService: DateTimeConvertService,
    private $CompacctAPI: CompacctCommonApi,
    private compacctToast: MessageService
  ) {}

  ngOnInit() {}

  GetGRNProductList(doc_no) {
    if (doc_no) {
      const obj = new HttpParams().set("Bill_No", doc_no);
      this.$http
        .get("/BL_Txn_Purchase_Bill_Complete/Get_GRN_With_Bill_No", {
          params: obj
        })
        .subscribe((data: any) => {
          this.GRNProductList = data ? JSON.parse(data) : [];
          this.GetCostCenter();
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
          this.ProductInfoListView = Obj;
        });
    }
  }
  GetCostCenter() {
    this.$CompacctAPI.getCostCenter().subscribe((data: any) => {
      this.CostCenterList = data ? JSON.parse(data) : [];
      const cookiesCostCenter = this.$CompacctAPI.CompacctCookies.Cost_Cen_ID;
      this.ObjGRNCommon.Cost_Cen_ID = cookiesCostCenter;
      this.ChangeCostCenter(cookiesCostCenter);
      if (this.GRNProductList.length) {
        this.FetchEditData(this.GRNProductList[0]);
      }
    });
  }
  ChangeCostCenter(CostCenID) {
    this.ObjGRNCommon.Cost_Cen_Name = undefined;
    this.ObjGRNCommon.Cost_Cen_Address1 = undefined;
    this.ObjGRNCommon.Cost_Cen_Address2 = undefined;
    this.ObjGRNCommon.Cost_Cen_Location = undefined;
    this.ObjGRNCommon.Cost_Cen_District = undefined;
    this.ObjGRNCommon.Cost_Cen_State = undefined;
    this.ObjGRNCommon.Cost_Cen_Country = undefined;
    this.ObjGRNCommon.Cost_Cen_PIN = undefined;
    this.ObjGRNCommon.Cost_Cen_Mobile = undefined;
    this.ObjGRNCommon.Cost_Cen_Phone = undefined;
    this.ObjGRNCommon.Cost_Cen_Email = undefined;
    this.ObjGRNCommon.Cost_Cen_VAT_CST = undefined;
    this.ObjGRNCommon.Cost_Cen_CST_NO = undefined;
    this.ObjGRNCommon.Cost_Cen_SRV_TAX_NO = undefined;
    this.ObjGRNCommon.Cost_Cen_GST_No = undefined;
    const List = this.CostCenterList.map(x => Object.assign({}, x));
    if (CostCenID) {
      const obj = $.grep(List, function(value) {
        return value.Cost_Cen_ID === Number(CostCenID);
      })[0];
      this.ObjGRNCommon.Cost_Cen_Name = obj.Cost_Cen_Name;
      this.ObjGRNCommon.Cost_Cen_Address1 = obj.Cost_Cen_Address1
        ? obj.Cost_Cen_Address1
        : "";
      this.ObjGRNCommon.Cost_Cen_Address2 = obj.Cost_Cen_Address2
        ? obj.Cost_Cen_Address2
        : "";
      this.ObjGRNCommon.Cost_Cen_Location = obj.Cost_Cen_Location;
      this.ObjGRNCommon.Cost_Cen_District = obj.Cost_Cen_District;
      this.ObjGRNCommon.Cost_Cen_State = obj.Cost_Cen_State;
      this.ObjGRNCommon.Cost_Cen_Country = obj.Cost_Cen_Country;
      this.ObjGRNCommon.Cost_Cen_PIN = obj.Cost_Cen_PIN;
      this.ObjGRNCommon.Cost_Cen_Mobile = obj.Cost_Cen_Mobile;
      this.ObjGRNCommon.Cost_Cen_Phone = obj.Cost_Cen_Phone;
      this.ObjGRNCommon.Cost_Cen_Email = obj.Cost_Cen_Email1;
      this.ObjGRNCommon.Cost_Cen_VAT_CST = obj.Cost_Cen_VAT_CST;
      this.ObjGRNCommon.Cost_Cen_CST_NO = obj.Cost_Cen_CST_NO;
      this.ObjGRNCommon.Cost_Cen_SRV_TAX_NO = obj.Cost_Cen_SRV_TAX_NO;
      this.ObjGRNCommon.Cost_Cen_GST_No = obj.Cost_Cen_GST_No;
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
      this.ObjGRNCommon.GRN_Date = this.DateService.dateConvert(
        moment(docDate, "YYYY-MM-DD")["_d"]
      );
    }
  }

  // FUNCTION
  FetchEditData(GRNcommon) {
    this.GRNUpdateFlag = true;
    if (GRNcommon.Challan_Line_No) {
      if (GRNcommon.godown_id) {
        this.ObjGRNCommon.Cost_Cen_ID = GRNcommon.Cost_Cen_ID;
        this.ChangeCostCenter(GRNcommon.Cost_Cen_ID);
        this.GetGodown(GRNcommon.Cost_Cen_ID);
      }
      this.GRNAval = {
        Doc_No: 123,
        Doc_TYPE: "GRN"
      };
      this.buttonname = GRNcommon.godown_id ? "Update" : "Create";
      this.GRNDocDate = GRNcommon.GRN_Date
        ? moment(GRNcommon.GRN_Date, "YYYY-MM-DD")["_d"]
        : new Date();
      this.ObjGRNCommon.Sub_Ledger_ID = GRNcommon.Sub_Ledger_ID;
      this.ObjGRNCommon.Ledger_ID = GRNcommon.Ledger_ID;
      this.ObjGRNCommon.Purchase_Challan_Doc_No =
        GRNcommon.Purchase_Challan_Doc_No;
      this.ObjGRNCommon.Project_ID = GRNcommon.Project_ID;

      const ctrl = this;
      setTimeout(function() {
        ctrl.ObjGRNCommon.godown_id = GRNcommon.godown_id
          ? GRNcommon.godown_id
          : undefined;
        ctrl.GRNUpdateFlag = false;
      }, 1000);
      if (!!GRNcommon.godown_id) {
        this.GRNEnable.emit(this.GRNAval);
      }
    }
  }
  GRNmerge() {
    const GRNArr = this.GRNProductList;
    this.Arr = [];
    this.ObjGRNCommon.GRN_Date = this.ObjGRNCommon.GRN_Date
      ? this.ObjGRNCommon.GRN_Date
      : this.DateService.dateConvert(new Date());

    this.ObjGRNCommon.GRN_User_ID = this.$CompacctAPI.CompacctCookies.User_ID;
    this.ObjGRNCommon.Bill_No = this._Bill["BillNo"];
    for (let i = 0; i < GRNArr.length; i++) {
      let obj = {};
      obj = {
        Product_ID: GRNArr[i].Product_ID,
        UOM: GRNArr[i].UOM,
        Product_Expiry: GRNArr[i].Product_Expiry,
        Expiry_Date: GRNArr[i].Expiry_Date,
        Qty: GRNArr[i].Qty,
        Rate: GRNArr[i].Rate,
        Batch_Number: GRNArr[i].Batch_Number,
        No_Of_Bag: GRNArr[i].No_Of_Bag,
        Challan_Line_No: GRNArr[i].Challan_Line_No
      };
      const a = {
        ...this.ObjGRNCommon,
        ...obj
      };
      this.Arr.push(a);
    }
    return JSON.stringify(this.Arr);
  }

  //  SAVE & ADD
  SaveGRN(valid) {
    this.GRNFormSubmitted = true;
    if (valid) {
      this.GRNmerge();
      const obj = {
        json_Purchase_GRN: this.GRNmerge()
      };
      this.$http
        .post(
          "/BL_Txn_Purchase_Bill_Complete/Insert_Txn_Purchase_Bill_GRN_Add_Update",
          { _Txn_Purchase: obj }
        )
        .subscribe((data: any) => {
          if (data.success === true) {
            console.group("Compacct V2");
            console.log("%c  GRN UPDATED / ADDED", "color:green;");
            console.log(
              "/BL_Txn_Purchase_Bill_Complete/Insert_Txn_Purchase_Bill_GRN_Add_Update"
            );
            this.compacctToast.clear();
            this.compacctToast.add({
              key: "compacct-toast",
              severity: "success",
              summary: "Succesfully Updated GRN"
            });
            this.GetGRNProductList(this.ObjGRNCommon.Bill_No);
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
}
class GRNCommon {
  GRN_Date: string;
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
  Cost_Cen_Email: string;
  Cost_Cen_VAT_CST: number;
  Cost_Cen_CST_NO: number;
  Cost_Cen_SRV_TAX_NO: number;
  Cost_Cen_GST_No: string;
  godown_id: number;
  Bill_No: string;
  Sub_Ledger_ID: number;
  Ledger_ID: number;
  Purchase_Challan_Doc_No: string;
  Project_ID: string;
  GRN_User_ID: number;
}
