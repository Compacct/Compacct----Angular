import { Component, OnInit, ViewEncapsulation, ViewChild } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { MessageService } from "primeng/api";
import { FileUpload } from "primeng/primeng";
declare var $: any;
import { THIS_EXPR } from "@angular/compiler/src/output/output_ast";
import { CompacctCommonApi } from "../../../shared/compacct.services/common.api.service";
import { CompacctHeader } from "../../../shared/compacct.services/common.header.service";
import { CompacctGlobalApiService } from "../../../shared/compacct.services/compacct.global.api.service";
import { DateTimeConvertService } from "../../../shared/compacct.global/dateTime.service"

@Component({
  selector: 'app-k4c-factory-indent-advance',
  templateUrl: './k4c-factory-indent-advance.component.html',
  styleUrls: ['./k4c-factory-indent-advance.component.css'],
  providers: [MessageService],
  encapsulation: ViewEncapsulation.None
})
export class K4cFactoryIndentAdvanceComponent implements OnInit {
  tabIndexToView = 0;
  seachSpinner = false;
  can_popup = false;
  act_popup = false;
  getAllDataList = [];
  BackupgetAllDataList = [];
  brandList = [];
  indentFormSubmit = false;
  SelectedTimeRange: any;
  TimerangeFilter = [];
  SelectedOutlet: any;
  OutletFilter = [];
  DocNo = undefined;
  viewpopUp = false;
  viewData:any = {};
  viewNo = undefined;
  ObjBrowseData: BrowseData = new BrowseData();
  Search_By = "Delivery Date";
  constructor(
    private $http: HttpClient,
    private commonApi: CompacctCommonApi,
    private GlobalAPI: CompacctGlobalApiService,
    private Header: CompacctHeader,
    private DateService: DateTimeConvertService,
    public $CompacctAPI: CompacctCommonApi,
    private compacctToast: MessageService
  ) { }

  ngOnInit() {
    this.Header.pushHeader({
      Header: "Browse Advance Order Indent",
      Link: " Material Management -> Indent Adv Order"
    });
    this.getBrand();
  }

  TabClick(e) {
    this.tabIndexToView = e.index;
  }


  onReject() {
    this.compacctToast.clear("c");
  }
  getConfirmDateRange(dateRangeObj) {
    if (dateRangeObj.length) {
      this.ObjBrowseData.req_date_B = dateRangeObj[0];
      this.ObjBrowseData.req_date2 = dateRangeObj[1];
    }
  }
  getBrand() {
    const obj = {
      "SP_String": "SP_Controller_Master",
      "Report_Name_String": "Get - Brand INI",

    }
    this.GlobalAPI.getData(obj).subscribe((data: any) => {
      //console.log("brandList  ===",data);
      this.brandList = data;
    })
  }
  GetAllData(valid) {
    console.log(valid);
    this.indentFormSubmit = true;
    if (valid) {
      this.seachSpinner = true;
      const start = this.ObjBrowseData.req_date_B
        ? this.DateService.dateConvert(new Date(this.ObjBrowseData.req_date_B))
        : this.DateService.dateConvert(new Date());
      const end = this.ObjBrowseData.req_date2
        ? this.DateService.dateConvert(new Date(this.ObjBrowseData.req_date2))
        : this.DateService.dateConvert(new Date());
      const tempDate = {
        From_Date: start,
        To_Date: end,
        Brand_ID: this.ObjBrowseData.Brand_ID,
        Search_By : this.Search_By
      }
      const objj = {
        "SP_String": "SP_Production_Voucher",
        "Report_Name_String": "Get Custom Order details using del Date",
        "Json_Param_String": JSON.stringify([tempDate])
      }
      this.GlobalAPI.getData(objj).subscribe((data: any) => {
        this.getAllDataList = data;
        this.BackupgetAllDataList = data;
        this.seachSpinner = false;
      console.log("getAllDataList", this.getAllDataList);
      this.GetOrderOutlet();
      this.GetDateRange();
      })
    }
  }
  GetOrderOutlet() {
    let DOrderBy = [];
    this.OutletFilter = [];
    //this.SelectedDistOrderBy1 = [];
    this.BackupgetAllDataList.forEach((item) => {
      if (DOrderBy.indexOf(item.critical) === -1) {
        DOrderBy.push(item.critical);
        this.OutletFilter.push({ label: item.critical==="Y"?"Critical" : "Normal", value: item.critical });
        console.log("this.OutletFilter", this.OutletFilter);
      }
    });
  }
  GetDateRange(){
    let DOrderBy = [];
    this.TimerangeFilter = [];
    //this.SelectedDistOrderBy1 = [];
    this.BackupgetAllDataList.forEach((item) => {
      if (DOrderBy.indexOf(item.Del_Time_Range) === -1) {
        DOrderBy.push(item.Del_Time_Range);
        this.TimerangeFilter.push({ label: item.Del_Time_Range, value: item.Del_Time_Range });
        console.log("this.TimerangeFilter", this.TimerangeFilter);
      }
    });
  }
  filterOrderOutlet() {
    console.log("SelectedOutlet", this.SelectedOutlet);
    let DOrderBy = [];
    if (this.SelectedOutlet.length) {
      DOrderBy = this.SelectedOutlet;
    }
    this.getAllDataList = [];
    if (this.SelectedOutlet.length) {
      let LeadArr = this.BackupgetAllDataList.filter(function (e) {
        return (DOrderBy.length ? DOrderBy.includes(e['critical']) : true)
      });
      this.getAllDataList = LeadArr.length ? LeadArr : [];
      console.log("if GetAllDataList", this.getAllDataList)
    } else {
      this.getAllDataList = this.BackupgetAllDataList;
      console.log("else GetAllDataList", this.getAllDataList)
    }
  }
  filterTimeRange() {
    console.log("SelectedTimeRange", this.SelectedTimeRange);
    let DOrderBy = [];
    if (this.SelectedTimeRange.length) {
      DOrderBy = this.SelectedTimeRange;
    }
    this.getAllDataList = [];
    if (this.SelectedTimeRange.length) {
      let LeadArr = this.BackupgetAllDataList.filter(function (e) {
        return (DOrderBy.length ? DOrderBy.includes(e['Del_Time_Range']) : true)
      });
      this.getAllDataList = LeadArr.length ? LeadArr : [];
      console.log("if GetAllDataList", this.getAllDataList)
    } else {
      this.getAllDataList = this.BackupgetAllDataList;
      console.log("else GetAllDataList", this.getAllDataList)
    }
  }
  Critical(col) {
    this.DocNo = undefined;
    if (col.Adv_Order_No) {
      this.can_popup = true;
      this.DocNo = col.Adv_Order_No;
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
  onConfirm() {
    if (this.DocNo) {
      const obj = {
        "SP_String": "SP_Production_Voucher",
        "Report_Name_String": "Mark as Critical adv Order",
        "Json_Param_String": JSON.stringify([{ Doc_No: this.DocNo }])
      }
      this.GlobalAPI.getData(obj).subscribe((data: any) => {
        if (data[0].Column1 === "Done") {
          this.onReject();
          this.can_popup = false;
          this.DocNo = undefined;
          this.GetAllData(true);
        }
      })
    }
  }
  Normal(col) {
    this.DocNo = undefined;
    if (col.Adv_Order_No) {
      this.act_popup = true;
      this.DocNo = col.Adv_Order_No;
      this.compacctToast.clear();
      this.compacctToast.add({
        key: "c",
        sticky: true,
        severity: "warn",
        summary: "Are you sure?",
        detail: "Confirm to proceed"
      })
  }

  }
  onConfirm2() {
    if (this.DocNo) {
      const obj = {
        "SP_String": "SP_Production_Voucher",
        "Report_Name_String": "Mark as Normal adv Order",
        "Json_Param_String": JSON.stringify([{ Doc_No: this.DocNo }])
      }
      this.GlobalAPI.getData(obj).subscribe((data: any) => {
        if (data[0].Column1 === "Done") {
          this.onReject();
          this.act_popup = false;
          this.DocNo = undefined;
          this.GetAllData(true);
        }
      })
    }
  }
  view(col){
    this.viewData = {};
   if(col.Adv_Order_No){
     this.viewNo = col.Adv_Order_No;
    this.viewpopUp = true;
    this.viewData = col;
    console.log("col",col);
   }
  }
  print(obj){
    console.log("Print",obj.Adv_Order_No);
    if (obj.Adv_Order_No) {
      window.open("/Report/Crystal_Files/K4C/Adv_Production_Voucher_Print.aspx?DocNo=" + obj.Adv_Order_No, 'mywindow', 'fullscreen=yes, scrollbars=auto,width=950,height=500'

      );
    }
  }
  printorder(obj){
    console.log("Print",obj.Adv_Order_No);
    if (obj.Adv_Order_No) {
      window.open("/Report/Crystal_Files/K4C/Foctory_Order_Pad.aspx?DocNo=" + obj.Adv_Order_No, 'mywindow', 'fullscreen=yes, scrollbars=auto,width=950,height=500'

      );
    }
  }
}
class BrowseData {
  req_date_B: string;
  req_date2: string;
  Brand_ID: number;

}
