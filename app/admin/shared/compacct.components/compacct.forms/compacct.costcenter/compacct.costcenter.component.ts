import { Component, OnInit, Output, EventEmitter, Input } from "@angular/core";
import { CompacctCommonApi } from "../../../compacct.services/common.api.service";
declare var $: any;
@Component({
  selector: "app-compacct-costcenter",
  templateUrl: "./compacct.costcenter.component.html",
  styleUrls: ["./compacct.costcenter.component.css"]
})
export class CompacctCostcenterComponent implements OnInit {
  ObjCostCenter = new CostCenter();
  CostCenterList = [];
  CostCenterFormSubmitted = false;
  private _required: boolean;

  @Output() CostcenterObj = new EventEmitter<CostCenter>();
  @Input() set required(value: boolean) {
    this._required = value;
    if (this._required) {
      this.CostCenterFormSubmitted = this.ObjCostCenter.Cost_Cen_ID
        ? true
        : false;
    } else {
      this.CostCenterFormSubmitted = this.ObjCostCenter.Cost_Cen_ID
        ? true
        : false;
    }
  }
  constructor(private $CompacctAPI: CompacctCommonApi) {}

  ngOnInit() {
    this.GetCostCenter();
  }
  GetCostCenter() {
    this.$CompacctAPI.getCostCenter().subscribe((data: any) => {
      this.CostCenterList = data ? JSON.parse(data) : [];
      const cookiesCostCenter = this.$CompacctAPI.CompacctCookies.Cost_Cen_ID;
      this.CostCenterChange(cookiesCostCenter);
    });
  }
  CostCenterChange(costId) {
    const costList = this.CostCenterList.map(x => Object.assign({}, x));
    this.ObjCostCenter = new CostCenter();
    if (costId && costId !== "undefined") {
      this.ObjCostCenter.Cost_Cen_ID = costId;
      const Obj = $.grep(costList, function(value) {
        return value.Cost_Cen_ID === Number(costId);
      })[0];
      this.ObjCostCenter = Obj;
      this.EmitOnDataInit();
    }
    this.CostCenterFormSubmitted = this.ObjCostCenter.Cost_Cen_ID
      ? false
      : true;
  }
  EmitOnDataInit() {
    this.CostcenterObj.emit(this.ObjCostCenter);
  }
  init() {
    const cookiesCostCenter = this.$CompacctAPI.CompacctCookies.Cost_Cen_ID;
    this.CostCenterChange(cookiesCostCenter);
    this.EmitOnDataInit();
  }
  clear() {
    this.ObjCostCenter = new CostCenter();
  }
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
