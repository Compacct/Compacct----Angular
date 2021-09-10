import { Component, OnInit, EventEmitter, Output, Input } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { DateTimeConvertService } from "../../../../../../shared/compacct.global/dateTime.service";
import { CompacctCommonApi } from "../../../../../../shared/compacct.services/common.api.service";
import { MessageService } from "primeng/api";
import * as moment from "moment";

@Component({
  selector: "app-compacct-bill-qc",
  templateUrl: "./compacct.bill.qc.component.html",
  styleUrls: ["./compacct.bill.qc.component.css"]
})
export class CompacctBillQcComponent implements OnInit {
  buttonname = "Update";
  url = window["config"];
  displayQCModal = false;
  QCFormSubmitted = false;
  QCInfoFormSubmitted = false;
  saveSpinner = false;
  QCUpdateFlag = false;
  QCViewCols = [];
  QCEditCols = [];
  frozenCols = [];

  ObjQC = new QC();
  CostCenterList = [];
  QCProductList = [];
  ProtoQCObj = new QCInfo();
  ProtoQCArray = [];
  QCDocDate: any;
  QCDoc_No: string;
  _Bill: {};
  overLayFlag = false;
  Arr = [];
  @Input() set BillNo(value: {}) {
    this._Bill = value;
    if (this._Bill["CreateEdit"] === "HIDE") {
      this.overLayFlag = true;
    } else {
      this.overLayFlag = false;
    }
    this.GetQCProductList(this._Bill["BillNo"]);
  }
  @Output() QCEnable = new EventEmitter<boolean>();
  constructor(
    private $http: HttpClient,
    private DateService: DateTimeConvertService,
    private $CompacctAPI: CompacctCommonApi,
    private compacctToast: MessageService
  ) {}

  ngOnInit() {
    this.QCViewCols = [
      { field: "Batch_Number", header: "Lot No." },
      { field: "QC_FFA", header: "FFA" },
      { field: "QC_Moisture", header: "Moisture" },
      { field: "QC_Oil_Content", header: "Oil Content" },
      { field: "QC_Impurity", header: "Impurity" },
      { field: "Dust", header: "Dust" },
      { field: "Husk", header: "Husk" },
      { field: "QC_Remarks", header: "Remarks" }
    ];
    this.frozenCols = [{ field: "Product_Name", header: "Product Detail" }];
    this.QCDocDate = new Date();
  }

  GetQCProductList(doc_no) {
    this.QCDoc_No = undefined;
    if (doc_no) {
      const obj = new HttpParams().set("Bill_No", doc_no);
      this.$http
        .get("/BL_Txn_Purchase_Bill_Complete/Get_QC_With_Bill_No", {
          params: obj
        })
        .subscribe((data: any) => {
          this.QCProductList = data ? JSON.parse(data) : [];
          this.GetCostCenter();
        });
    }
  }
  GetCostCenter() {
    this.$CompacctAPI.getCostCenter().subscribe((data: any) => {
      this.CostCenterList = data ? JSON.parse(data) : [];
      const cookiesCostCenter = this.$CompacctAPI.CompacctCookies.Cost_Cen_ID;
      this.ObjQC.QC_Cost_Cent_ID = cookiesCostCenter;
      // this.ChangeCostCenter(cookiesCostCenter);
      if (this.QCProductList.length) {
        this.FetchEditData(this.QCProductList[0]);
      }
    });
  }

  // Change
  GetDocdate(docDate) {
    if (docDate) {
      this.ObjQC.QC_Date = this.DateService.dateConvert(
        moment(docDate, "YYYY-MM-DD")["_d"]
      );
    }
  }
  //  FUNCTION
  FetchEditData(QCcommon) {
    if (QCcommon.Challan_Line_No) {
      this.QCDoc_No = this.QCProductList[0].GRN_Doc_No;
      this.QCDocDate = this.QCProductList[0].QC_Date
        ? moment(this.QCProductList[0].QC_Date, "YYYY-MM-DD")["_d"]
        : new Date();
      this.ObjQC.QC_Cost_Cent_ID = this.QCProductList[0].QC_Cost_Cent_ID
        ? this.QCProductList[0].QC_Cost_Cent_ID
        : this.$CompacctAPI.CompacctCookies.Cost_Cen_ID;
      // this.GrnUpdateFlag = true;
    }
  }
  // MODAL
  QCModal(Obj) {
    this.displayQCModal = false;
    this.ProtoQCObj = new QCInfo();
    if (Obj.Product_ID) {
      this.displayQCModal = true;
      const constObj = JSON.parse(JSON.stringify(Obj));
      this.ProtoQCObj.Challan_Line_No = constObj.Challan_Line_No;
      this.ProtoQCObj.QC_FFA = constObj.QC_FFA;
      this.ProtoQCObj.QC_Moisture = constObj.QC_Moisture;
      this.ProtoQCObj.QC_Oil_Content = constObj.QC_Oil_Content;
      this.ProtoQCObj.QC_Impurity = constObj.QC_Impurity;
      this.ProtoQCObj.Dust = constObj.Dust;
      this.ProtoQCObj.Husk = constObj.Husk;
      this.ProtoQCObj.QC_Remarks = constObj.QC_Remarks;
    }
  }
  CloseModal() {
    for (let i = 0; i < this.QCProductList.length; i++) {
      if (
        this.QCProductList[i]["Challan_Line_No"] ===
        this.ProtoQCObj["Challan_Line_No"]
      ) {
        this.QCProductList[i]["QC_FFA"] = this.QCProductList[i]["QC_FFA"];
        this.QCProductList[i]["QC_Moisture"] = this.QCProductList[i][
          "QC_Moisture"
        ];
        this.QCProductList[i]["QC_Oil_Content"] = this.QCProductList[i][
          "QC_Oil_Content"
        ];
        this.QCProductList[i]["QC_ImpurityQC_Impurity"] = this.QCProductList[i][
          "QC_ImpurityQC_Impurity"
        ];
        this.QCProductList[i]["Dust"] = this.QCProductList[i]["Dust"];
        this.QCProductList[i]["Husk"] = this.QCProductList[i]["Husk"];
        this.QCProductList[i]["QC_Remarks"] = this.QCProductList[i][
          "QC_Remarks"
        ];
        this.QCUpdateFlag = true;
      }
    }
    this.displayQCModal = false;
  }
  onProductConfirm(valid) {
    this.QCInfoFormSubmitted = true;
    this.QCUpdateFlag = true;
    if (valid) {
      for (let i = 0; i < this.QCProductList.length; i++) {
        if (
          this.QCProductList[i]["Challan_Line_No"] ===
          this.ProtoQCObj["Challan_Line_No"]
        ) {
          this.QCProductList[i]["QC_FFA"] = this.ProtoQCObj.QC_FFA;
          this.QCProductList[i]["QC_Moisture"] = this.ProtoQCObj.QC_Moisture;
          this.QCProductList[i][
            "QC_Oil_Content"
          ] = this.ProtoQCObj.QC_Oil_Content;
          this.QCProductList[i]["QC_Impurity"] = this.ProtoQCObj.QC_Impurity;
          this.QCProductList[i]["Dust"] = this.ProtoQCObj.Dust;
          this.QCProductList[i]["Husk"] = this.ProtoQCObj.Husk;
          this.QCProductList[i]["QC_Remarks"] = this.ProtoQCObj.QC_Remarks;
          this.ProtoQCArray.push(this.ProtoQCObj);
          this.QCUpdateFlag = false;
        }
      }
      this.displayQCModal = false;
    }
  }
  //  SAVE & ADD
  MergeData() {
    this.ObjQC.QC_Date = this.ObjQC.QC_Date
      ? this.ObjQC.QC_Date
      : this.DateService.dateConvert(new Date());
    this.ObjQC.QC_User_ID = this.$CompacctAPI.CompacctCookies.User_ID;
    this.ObjQC.Bill_No = this._Bill["BillNo"];
    this.Arr = [];
    console.log(this.ObjQC);
    for (let i = 0; i < this.ProtoQCArray.length; i++) {
      let obj = {};
      obj = Object.assign(this.ObjQC, this.ProtoQCArray[i]);
      const ProductObj = {
        Challan_Line_No: this.ProtoQCArray[i].Challan_Line_No,
        QC_FFA: this.ProtoQCArray[i].QC_FFA,
        QC_Moisture: this.ProtoQCArray[i].QC_Moisture,
        QC_Oil_Content: this.ProtoQCArray[i].QC_Oil_Content,
        QC_Impurity: this.ProtoQCArray[i].QC_Impurity,
        Dust: this.ProtoQCArray[i].Dust,
        Husk: this.ProtoQCArray[i].Husk,
        QC_Remarks: this.ProtoQCArray[i].QC_Remarks
      };
      obj = {
        ...this.ObjQC,
        ...ProductObj
      };
      this.Arr.push(obj);
    }
    console.log(this.Arr);
    return JSON.stringify(this.Arr);
  }
  SaveQC(valid) {
    this.QCFormSubmitted = true;
    if (valid && !this.QCUpdateFlag) {
      this.saveSpinner = true;
      const obj = {
        json_Purchase_QC: this.MergeData()
      };
      this.$http
        .post(
          "/BL_Txn_Purchase_Bill_Complete/Insert_Txn_Purchase_Bill_QC_Add_Update",
          { _Txn_Purchase: obj }
        )
        .subscribe((data: any) => {
          if (data.success === true) {
            console.group("Compacct V2");
            console.log("%c  QC UPDATED / ADDED", "color:green;");
            console.log(
              "/BL_Txn_Purchase_Bill_Complete/Insert_Txn_Purchase_Bill_QC_Add_Update"
            );
            this.compacctToast.clear();
            this.compacctToast.add({
              key: "compacct-toast",
              severity: "success",
              summary: "",
              detail: "Succesfully Added QC"
            });
            this.GetQCProductList(this.ObjQC.Bill_No);
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
    }
  }
}
class QC {
  QC_Date: any;
  QC_User_ID: number;
  QC_Cost_Cent_ID: number;
  Bill_No: string;
}
class QCInfo {
  Challan_Line_No: number;
  QC_FFA: string;
  QC_Moisture: string;
  QC_Oil_Content: string;
  QC_Impurity: string;
  Dust: string;
  Husk: string;
  QC_Remarks: string;
}
