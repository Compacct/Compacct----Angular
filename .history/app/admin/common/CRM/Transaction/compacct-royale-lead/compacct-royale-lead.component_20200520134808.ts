import { Component, OnInit ,ViewChild , ElementRef,ViewEncapsulation} from '@angular/core';
import { HttpClient, HttpParams } from "@angular/common/http";
import { MessageService } from "primeng/api";
import { CompacctCommonApi } from "../../../../shared/compacct.services/common.api.service";
import { CompacctHeader } from "../../../../shared/compacct.services/common.header.service";
import { FileUpload } from "primeng/primeng";
import { DateTimeConvertService } from "../../../../shared/compacct.global/dateTime.service";
import * as moment from "moment";
@Component({
  selector: 'app-compacct-royale-lead',
  templateUrl: './compacct-royale-lead.component.html',
  styleUrls: ['./compacct-royale-lead.component.css'],
  providers: [MessageService],
  encapsulation: ViewEncapsulation.None
})
export class CompacctRoyaleLeadComponent implements OnInit {

  tabIndexToView = 0;
  url = window["config"];
  buttonname = "Create";
  Spinner = false;
  seachSpinner = false;
  items = ["YOUR LEAD", "MY TASK"];

// Your Lead
CreateLeadModalHeader = 'Create Lead';
CreateLeadModal = false;
SearchleadSubmitted = false;
MemberList = [];

districtList =[];
EnqSourceModel: [];
CountryList = [];
StatusList = [];
ExistingContactList = [];
CustomerRadioFlag= "NewCustomer";

//  TASK
SearcTaskSubmitted = false;

  NextFollowupDateTime: Date;
  ProductCatModel: any = [];
  ReferencebyCustomerList: any = [];
  leadowner: [];
  customertype: [];
  ProductCat: string;
  ForwardLeadFlag = true;
  ForwardLeadFlagRequire = false;
  leadSubmitted = false;

  UserList: [];
  FollowupList = [];
  TilldateInput = new Date();
  FollowupTilldate = undefined;


  CardFlag = false;
  CardViewFlag = false;
  VistingCardLink = undefined;
  VistingCardFile = {};

  ObjLead = new Lead();
  ObjLeadSearch = new SearchLead();
  SearchUserID: number;
  // @ViewChild("location", { static: false }) locationInput: ElementRef;
  constructor(
    private $http: HttpClient,
    private commonApi: CompacctCommonApi,
    private Header: CompacctHeader,
    private DateService: DateTimeConvertService,
    private compacctToast: MessageService
  ) {}

  ngOnInit() {
    this.Header.pushHeader({
      Header: "Lead Management",
      Link: " CRM -> Transaction -> Lead Management"
    });

    this. GetUser();
    this.GetSaleExcu();
    this.GetEnqSource();
    this.GetEnqSt();
    this.GetExistingcustomer();
    this.GetLeadowner();
    this.GetCustomerType();
    this.GetCountry();
    this.GetExistingContact();
  }

  // FUNCTION  - > Your Leads
  GetUser() {
    this.UserList = [];
    this.$http.get(this.url.apiGetUserLists).subscribe((data: any) => {
      this.UserList = data.length ? data : [];
      this.SearchUserID = this.commonApi.CompacctCookies.User_ID;
     // this.ObjLead.User_ID = this.commonApi.CompacctCookies.User_ID;
    });
  }
  GetSaleExcu() {
    this.MemberList = [];
    const params = new HttpParams()
    .set("User_ID",  this.commonApi.CompacctCookies.User_ID)
    this.$http.get('/BL_CRM_Lead_Management_V2/Get_Salesman_with_hierarchy',{ params }).subscribe((data: any) => {
      this.MemberList = data ? JSON.parse(data) : [];
    });
  }
  GetCountry() {
    this.CountryList = [];
    this.$http.get("/Common/Get_Country_List").subscribe((data: any) => {
      this.CountryList = data ? JSON.parse(data) : [];
    });
  }
  GetEnqSt() {
    this.$http.get("/BL_CRM_Lead_Management_V2/Get_Enq_Status").subscribe((data: any) => {
      this.StatusList = data ? JSON.parse(data) : [];
    });
  }
  GetEnqSource() {
    this.$http.get("/Hearing_CRM_Lead/Get_Enq_Source").subscribe((data: any) => {
      this.EnqSourceModel = data.length ? data : [];
    });
  }
  GetExistingContact() {
    this.$http.get("/BL_CRM_Lead_Management_V2/Get_Existing_Contact").subscribe((data: any) => {
      this.ExistingContactList = data.length ? data : [];
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
  CreateLead(){
    this.CreateLeadModal = true;
    this.ObjLead = new Lead();
    this.leadSubmitted = false;
    this.Spinner = false;
  }

  // CHANGE
  getDateRange(dateRangeObj) {
    if (dateRangeObj.length) {
      this.ObjLeadSearch.Statrt_Date = dateRangeObj[0];
      this.ObjLeadSearch.End_Date = dateRangeObj[1];
    }
  }
  CustomerRadioChange(){
    console.log(this.CustomerRadioFlag)
  }
  GetFollowupTill(tillDate) {
    if (tillDate) {
      this.FollowupTilldate = this.DateService.dateConvert(
        moment(tillDate, "YYYY-MM-DD")["_d"]
      );
    }
  }
  getAddressOnChange(e) {
    // this.ObjLead.Location = undefined;
    // if (e) {
    //   this.ObjLead.Location = e;
    // }
  }
  changeLeadStatus(status) {
    // this.ObjLead.Sent_To = undefined;
    // if (
    //   status === "Forward Lead" ||
    //   status === "Forward Lead With My Own Followup"
    // ) {
    //   this.ForwardLeadFlag = false;
    //   this.ForwardLeadFlagRequire = true;
    // } else {
    //   this.ForwardLeadFlag = true;
    //   this.ForwardLeadFlagRequire = false;
    // }
    // if (status === "Keep it in My Own Followup") {
    //   this.ForwardLeadFlag = true;
    //   this.ForwardLeadFlagRequire = false;
    // }
  }
  GetDistrict(State){

  }
  // Visting card
  FetchPDFFile(event) {
    this.CardFlag = false;
    this.VistingCardFile = {};
    if (event) {
      this.VistingCardFile = event.files[0];
      this.CardFlag = true;
    }
  }
  VistingCardUploader(fileData, footfall) {
    const endpoint = "/BNB_New_Lead/Upload_Pic";
    const formData: FormData = new FormData();
    formData.append("aFile", fileData);
    formData.append("anint", footfall);
    this.$http.post(endpoint, formData).subscribe(data => {
      console.log(data);
    });
  }

  // SAVE LEAD
  SaveLead(valid) {
     this.leadSubmitted = true;
    // const flag = this.checkIfSame(
    //   this.ObjLead.Mobile,
    //   this.ObjLead.Website,
    //   this.ObjLead.Phone
    // );
    // if (!flag) {
    //   this.compacctToast.clear();
    //   this.compacctToast.add({
    //     key: "compacct-toast",
    //     severity: "error",
    //     summary: "Warn Message",
    //     detail: "Field Mobile / Fax / Landline / Website Might Be Same"
    //   });
    // }
    if (valid ) {
      this.Spinner = true;
      console.log(moment().format("DD/MMM/YYYY h:mm a"));
      this.ObjLead.User_ID =   String(this.SearchUserID);
      this.ObjLead.Posted_On = moment().format("DD/MMM/YYYY h:mm a");
      // this.ObjLead.Cost_Cen_ID = this.commonApi.CompacctCookies.Cost_Cen_ID;
      // this.ObjLead.Next_Followup = moment(this.NextFollowupDateTime).format(
      //   "DD/MMM/YYYY h:mm a"
      // );
      this.$http
        .post("/BL_CRM_Lead_Management_V2/Insert_Lead_Management_V2", { Lead_Management_V2_String: JSON.stringify([this.ObjLead]) })
        .subscribe((data: any) => {
          if (data.success === true) {
            if (this.ProductCat) {
              this.saveCategory(data.Foot_Fall_ID);
            } else {
              this.compacctToast.clear();
              this.compacctToast.add({
                key: "compacct-toast",
                severity: "success",
                summary:
                  this.ObjLead.Foot_Fall_ID === 0
                    ? ""
                    : this.ObjLead.Foot_Fall_ID.toString(),
                detail:
                  this.ObjLead.Foot_Fall_ID !== 0
                    ? "Succesfully Updated Lead"
                    : "Succesfully Created Lead"
              });
              this.clearData();
            }
            console.group("Compacct V2");
            console.log("%c  Lead Sucess:", "color:green;");
            console.log("/BL_CRM_Lead_Management_V2/Insert_Lead_Management_V2");
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
          if (this.CardFlag) {
            this.VistingCardUploader(this.VistingCardFile, footfall);
          }
          this.Spinner = false;
          this.compacctToast.clear();
          this.compacctToast.add({
            key: "compacct-toast",
            severity: "success",
            summary:
              this.ObjLead.Foot_Fall_ID === 0
                ? ""
                : this.ObjLead.Foot_Fall_ID.toString(),
            detail:
              this.ObjLead.Foot_Fall_ID !== 0
                ? "Succesfully Updated Lead"
                : "Succesfully Created Lead"
          });
          this.clearData();
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

  // SEARCH FOLLOWUP
  Searchfollowup(valid) {
    this.FollowupList = [];
    if (valid) {
      this.seachSpinner = true;
      const params = new HttpParams()
        .set("Statrt_Date",  this.ObjLeadSearch.Statrt_Date)
        .set("End_Date",  this.ObjLeadSearch.End_Date)
        .set("SalesManID",  this.ObjLeadSearch.SalesManID)
        .set("Status_ID",  this.ObjLeadSearch.Status_ID);
      this.$http
        .get("/BL_CRM_Lead_Management_V2/Get_Your_Leads", { params })
        .subscribe((data: any) => {
          this.FollowupList = data.length ? data : [];
          this.seachSpinner = false;
        });
    }
  }
  RedirectFollowup(footfall) {
    window.open("/BL_CRM_Followup_Add/Index?id=" + footfall);
  }

  RedirectAddress(footfallid) {
    window.open("/DIPL_Lead_Address/Create?id=" + footfallid);
  }
  RedirectQuotation(footfallid) {
    window.open("/Quotation/Index?Foot_Fall_ID=" + footfallid);
  }
  RedirectProposal(footfallid) {
    window.open("/DIPL_CRM_Proposal/Create?Foot_Fall_ID=" + footfallid);
  }
  RedirectLabelQuotation(footfallid) {
    window.open("/DIPL_Quotation_Label/Create?Foot_Fall_ID=" + footfallid);
  }
  RedirectLeadDetails(footfallid) {
    window.open("/BNB_CRM_Lead_Search/Index?id=" + window.btoa(footfallid));
  }
  RedirectLeadClose(footfallid) {
    window.open("/DIPL_CRM_Lead_Close/Create?id=" + footfallid);
  }

  // Clear & Tab
  TabClick(e) {
    this.tabIndexToView = e.index;
    this.items = ["YOUR LEAD", "MY TASK"];
    this.buttonname = "Create";
    this.clearData();
  }
  clearData() {
    if (this.CardViewFlag === false) {
      // this.fileInput.clear();
    }
    this.VistingCardFile = {};
    this.ProductCat = undefined;
    // this.locationInput.nativeElement.value = undefined;
    this.NextFollowupDateTime = undefined;
    this.leadSubmitted = false;
    this.CardFlag = false;
    this.Spinner = false;
    this.ObjLead = new Lead();
    this.seachSpinner = false;
    this.ForwardLeadFlag = true;
    this.ForwardLeadFlagRequire = false;
  }
}
class Lead{
  Foot_Fall_ID =0;
User_ID:string;
Posted_On:string;
Enq_Source_ID:number;
Org_Name:string;
Contact_Name:string;
Address:string;
District:string;
State:string;
Country:string;
Pin:string;
Mobile:number;
Email:string;
Lead_Date:string;
Member_ID:number;
Lead_Type:string;
Site_Name:string;
Alternatie_Mobile:number;
Whats_Up:number;
Site_Address:string;
Site_PIN_Code:string;
Site_State:string;
Site_District:string;
Site_Country:string;
Status_ID:number;
}
class SearchLead{
  Statrt_Date:any;
  End_Date:any;
  SalesManID:any;
  Status_ID:any;
}
