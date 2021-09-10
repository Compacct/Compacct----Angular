import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  ViewEncapsulation,
  ɵConsole
} from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { DateTimeConvertService } from "../../../../shared/compacct.global/dateTime.service";
import { CompacctHeader } from "../../../../shared/compacct.services/common.header.service";
import * as moment from "moment";
import { CompacctCommonApi } from "../../../../shared/compacct.services/common.api.service";
import { FileUpload, MessageService } from "primeng/primeng";

@Component({
  selector: "app-compacct-bnb-leadbydate",
  templateUrl: "./compacct.bnb.leadbydate.component.html",
  styleUrls: ["./compacct.bnb.leadbydate.component.css"],
  providers: [MessageService],
  encapsulation: ViewEncapsulation.None
})
export class CompacctBnbLeadbydateComponent implements OnInit {
  url = window["config"];

  // SEARCH
  DisplayBnbLeadEditModal = false;
  seachSpinner = false;
  ObjSearch = {
    start_dt: this.DateService.dateConvert(new Date()),
    end_dt: this.DateService.dateConvert(new Date()),
    User_ID: "0"
  };
  BNBLeadList = [];

  // EDIT
  Spinner = false;
  items = ["LEAD", "FOLLOWUP"];

  NextFollowupDateTime: Date;
  EnqSourceModel: [];
  ProductCatModel: any = [];
  ReferencebyCustomerList: any = [];
  leadowner: [];
  customertype: [];
  CountryList = [];
  ProductCat: string;
  ForwardLeadFlag = true;
  ForwardLeadFlagRequire = false;
  leadSubmitted = false;

  UserList: [];
  FollowupList = [];
  TilldateInput = new Date();
  FollowupTilldate = undefined;
  FollowupSearchSubmitted = false;
  ObjLead = new Lead();

  @ViewChild("location", { static: false }) locationInput: ElementRef;
  constructor(
    private $http: HttpClient,
    private commonApi: CompacctCommonApi,
    private DateService: DateTimeConvertService,
    private Header: CompacctHeader,
    private compacctToast: MessageService
  ) {}

  ngOnInit() {
    this.Header.pushHeader({
      Header: "Lead Search By Date",
      Link: " CRM -> Reports -> Lead Search By Date"
    });
    this.GetUser();
    this.GetEnqSource();
    this.GetProductCat();
    this.GetExistingcustomer();
    this.GetLeadowner();
    this.GetCustomerType();
    this.GetCountry();
    this.ObjSearch.User_ID = this.commonApi.CompacctCookies.User_ID;
  }

  // FUNCTION
  GetUser() {
    this.UserList = [];
    this.$http.get(this.url.apiGetUserLists).subscribe((data: any) => {
      this.UserList = data.length ? data : [];
    });
  }
  GetCountry() {
    this.CountryList = [];
    this.$http.get("/Common/Get_Country_List").subscribe((data: any) => {
      this.CountryList = data ? JSON.parse(data) : [];
    });
  }
  GetEnqSource() {
    this.$http.get("/BNB_New_Lead/Get_Enq_Source").subscribe((data: any) => {
      this.EnqSourceModel = data.length ? data : [];
    });
  }
  GetProductCat() {
    this.$http.get("/BNB_New_Lead/Get_Product_Cat").subscribe((data: any) => {
      const List = data.length ? data : [];
      List.forEach(el => {
        this.ProductCatModel.push({
          label: el.Cat_Name,
          value: el.Cat_ID
        });
      });
    });
  }
  GetExistingcustomer() {
    this.$http
      .get(
        "/Common/Get_Master_Accounting_Sub_Ledger_Report_BNB?User_ID=" +
          this.commonApi.CompacctCookies.User_ID
      )
      .subscribe((data: any) => {
        const List = data ? JSON.parse(data) : [];
        List.forEach(el => {
          this.ReferencebyCustomerList.push({
            label: el.Sub_Ledger_Name,
            value: el.Sub_Ledger_ID
          });
        });
      });
  }
  GetLeadowner() {
    this.$http.get(this.url.apiGetUserListAll).subscribe((data: any) => {
      this.leadowner = data.length ? data : [];
    });
  }
  GetCustomerType() {
    this.$http.get("/BNB_New_Lead/Get_Customer_Type").subscribe((data: any) => {
      this.customertype = data.length ? data : [];
    });
  }

  // CHANGE
  getDateRange(dateRangeObj) {
    if (dateRangeObj.length) {
      this.ObjSearch.start_dt = this.DateService.dateConvert(dateRangeObj[0]);
      this.ObjSearch.end_dt = this.DateService.dateConvert(dateRangeObj[1]);
    }
  }
  GetFollowupTill(tillDate) {
    if (tillDate) {
      this.FollowupTilldate = this.DateService.dateConvert(
        moment(tillDate, "YYYY-MM-DD")["_d"]
      );
    }
  }
  getAddressOnChange(e) {
    this.ObjLead.Location = undefined;
    if (e) {
      this.ObjLead.Location = e;
    }
  }
  changeLeadStatus(status) {
    this.ObjLead.Sent_To = undefined;
    if (
      status === "Forward Lead" ||
      status === "Forward Lead With My Own Followup"
    ) {
      this.ForwardLeadFlag = false;
      this.ForwardLeadFlagRequire = true;
    } else {
      this.ForwardLeadFlag = true;
      this.ForwardLeadFlagRequire = false;
    }
    if (status === "Keep it in My Own Followup") {
      this.ForwardLeadFlag = true;
      this.ForwardLeadFlagRequire = false;
    }
  }

  //  SEARCH
  SearchBNBLead(valid) {
    this.BNBLeadList = [];
    if (valid) {
      this.seachSpinner = true;

      this.$http
        .get("/BNB_BL_CRM_Lead_Browse/GetList", {
          params: this.ObjSearch
        })
        .subscribe((data: any) => {
          this.BNBLeadList = data ? JSON.parse(data) : [];
          this.seachSpinner = false;
        });
    }
  }
  // EDIT LEAD

  EditLead(footfall) {
    this.clearData();
    this.GetEditData(footfall);
  }
  GetEditData(footfall) {
    if (footfall) {
      const obj = new HttpParams().set("FootFallID", footfall);
      this.$http
        .get("/BNB_CRM_Lead_Search/Get_CRM_One_Lead_BNB", { params: obj })
        .subscribe((data: any) => {
          this.getEditCat(footfall);
          this.ObjLead = data.length ? data[0] : new Lead();
          this.locationInput.nativeElement.value = this.ObjLead.Location;
          const dateObj = moment(
            this.ObjLead.Next_Followup,
            "DD-MM-YYYY HH:mm:ss a"
          ).format();
          this.NextFollowupDateTime = new Date(dateObj);
          this.ObjLead.Foot_Fall_ID = footfall;
          this.DisplayBnbLeadEditModal = true;
          //  this.seachSpinner = false;
        });
    }
  }
  getEditCat(footfall) {
    if (footfall) {
      const obj = new HttpParams().set("FootFallID", footfall);
      this.$http
        .get("/Common/New_Get_CRM_Lead_Category", { params: obj })
        .subscribe((data: any) => {
          this.ProductCat = data.length ? data[0].Requirement : "";
        });
    }
  }
  UpdateBNBLead(valid) {
    this.leadSubmitted = true;
    const flag = this.checkIfSame(
      this.ObjLead.Mobile,
      this.ObjLead.Website,
      this.ObjLead.Phone
    );
    if (!flag) {
      this.compacctToast.clear();
      this.compacctToast.add({
        key: "compacct-toast",
        severity: "error",
        summary: "Warn Message",
        detail: "Field Mobile / Fax / Landline / Website Might Be Same"
      });
    }
    if (valid && flag) {
      this.Spinner = true;
      this.ObjLead.Next_Followup = moment(this.NextFollowupDateTime).format(
        "DD-MMM-YYYY h:mm a"
      );
      console.log(this.ObjLead);
      this.$http
        .post("/BNB_New_Lead/Update_Lead_Ajax", {
          _DIPL_CRM_Lead: this.ObjLead
        })
        .subscribe((data: any) => {
          if (data.success === true) {
            if (this.ProductCat) {
              this.saveCategory(this.ObjLead.Foot_Fall_ID);
            } else {
              this.compacctToast.clear();
              this.compacctToast.add({
                key: "compacct-toast",
                severity: "success",
                summary: "Succesfully Updated Lead"
              });
              this.clearData();
              this.SearchBNBLead(true);
            }
            console.group("Compacct V2");
            console.log("%c  Lead Update Sucess:", "color:green;");
            console.log("/BNB_New_Lead/Update_Lead_Ajax");
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
  saveCategory(footfall) {
    const arr = [];
    arr.push({
      Foot_Fall_ID: footfall,
      Requirement: this.ProductCat
    });
    console.log(arr);
    this.$http
      .post("/BNB_New_Lead/Create_Category_Ajax", arr)
      .subscribe((data: any) => {
        console.log("Cat Updated - ");
        if (data.success === true) {
          this.Spinner = false;
          this.compacctToast.clear();
          this.compacctToast.add({
            key: "compacct-toast",
            severity: "success",
            summary: "Succesfully Updated Lead"
          });
          this.clearData();
          this.SearchBNBLead(true);
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
  CloseBnbEdit() {
    this.DisplayBnbLeadEditModal = false;
  }
  // CHECKING
  checkIfSame(mobile, website, landline): boolean {
    let flag = false;
    if (!!website && !!landline) {
      if (mobile === website || mobile === landline || website === landline) {
        flag = false;
      } else {
        flag = true;
      }
    } else {
      flag = true;
    }
    if (!!mobile) {
      if (mobile === landline) {
        flag = false;
      }
      if (website === mobile) {
        flag = false;
      }
    }

    return flag;
  }

  clearData() {
    this.ProductCat = undefined;
    this.locationInput.nativeElement.value = undefined;
    this.NextFollowupDateTime = undefined;
    this.leadSubmitted = false;
    this.Spinner = false;
    this.ObjLead = new Lead();
    this.seachSpinner = false;
    this.ForwardLeadFlag = true;
    this.ForwardLeadFlagRequire = false;

    this.DisplayBnbLeadEditModal = false;
  }

  // REDIRECT
  redirectDetails(footFallID) {
    console.log(footFallID);
    if (footFallID) {
      window.open("/BNB_CRM_Lead_Search/Index?id=" + window.btoa(footFallID));
    }
  }
}

class Lead {
  Foot_Fall_ID = 0;
  Cost_Cen_ID = 0;
  Sub_Ledger_ID = 0;
  Mobile: number;
  Phone: number;
  Email: string;
  Fax: string;
  Contact_Name: string;
  SKU: string;
  Org_Name: string;
  Dept: string;
  Desig: string;
  Address: string;
  Landmark: string;
  City: string;
  District: string;
  State: string;
  Pin: string;
  Country: string;
  Enq_Source_ID: number;
  User_ID: number;
  Sub_Ledger_ID_Ref: number;
  Enq_Chance: string;
  Next_Followup: string;
  Sub_Ledger_Cat_ID: number;
  Recd_Media: string;
  Followup_Remarks: string;
  Status: string;
  Sub_Dept_ID: number;
  Sent_To: number;
  Location: string;

  Business_Type = "B2B";
  Product_Name: string;
  Website: string;
}
