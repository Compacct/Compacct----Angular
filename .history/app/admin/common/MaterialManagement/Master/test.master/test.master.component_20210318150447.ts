import { Component, OnInit, ViewEncapsulation} from '@angular/core';
import { HttpClient, HttpParams } from "@angular/common/http";
import { CompacctCommonApi } from "../../../../shared/compacct.services/common.api.service";
import { CompacctHeader } from "../../../../shared/compacct.services/common.header.service";
import { MessageService } from "primeng/api";
import { FileUpload } from "primeng/primeng";
declare var $: any;

@Component({
  selector: 'app-test-master',
  templateUrl: './test.master.component.html',
  styleUrls: ['./test.master.component.css'],
  providers: [MessageService],
  encapsulation: ViewEncapsulation.None
})
export class TestMasterComponent implements OnInit {
  tabIndexToView = 0;
  url = window["config"];
  persons: [];
  buttonname = "Create";
  Spinner = false;
  PDFFlag = false;
  PDFViewFlag = false;
  CostcenterPDFLink = undefined;

  items = [];
  CostcenterSearchSubmitted = false;
  CostcenterFormSubmitted = false;
  AllCostcenterList = [];
  CostcenterMfdLists = [];
  CostcenterCategoryLists = [];
  MaterialTypeList = [];
  MaterialSubTypeList = [];
  CostcenterPDFFile = {};

  MaterialType_Browse: any;
  MaterialSubType_Browse: any;
  CostcenterID: number;

  cols = [];
  menuList = [];

  CountryList = [];
  displayPin: boolean = true;
  ExistNameFlag = false;
  location: any;
  StateList = [];
  StateDisList = [];
  DistrictList = [];
  JobWork = false;
  CategoryList: any = ["Own", "Franchisee", "Others"];
  // CostCenterList: any=['center1', 'center2', 'center3'];
  CostCenterList: any[] = [];
  shareCostCenterID: number;
  componentDisplay: boolean = false;
  tmp_Cost_Cen_ID: number;

  ObjCostcenter: Costcenter = new Costcenter();
  @ViewChild("fileInput", { static: false }) fileInput: FileUpload;
  constructor(private Header: CompacctHeader,
    private compacctToast: MessageService,
    private $http: HttpClient,
    private commonApi: CompacctCommonApi,) { }

  ngOnInit() {
    this.items = [ "BROWSE" , "CREATE"];
    this.Header.pushHeader({
      Header: "Master Cost Center",
      Link: " Material Management -> Master -> Master Cost Center"
    });
    this.GetCountryList();
    this.GetStateList();
    this.getAllCostcenterList();
    this.getCostCenterType();
  }
  GetCountryList() {
    this.$http
      .get("/Master_Cost_Center_V2/Get_Country_List")
      .subscribe((data: any) => {
        this.CountryList = data ? JSON.parse(data) : [];
        setTimeout(() => {}, 500);
      });
  }
  GetStateList() {
    this.$http
      .get("/Master_Cost_Center_V2/Get_State")
      .subscribe((data: any) => {
        this.StateList = data ? JSON.parse(data) : [];
      });
  }
  getAllCostcenterList() {
    this.$http
      .get("/Master_Cost_Center_V2/Get_All_Data")
      .subscribe((data: any) => {
        this.AllCostcenterList = data ? JSON.parse(data) : [];
        console.log("AllCostcenterList =", this.AllCostcenterList);
      });
  }
  getCostCenterType() {
    this.$http
      .get("/Scripts/Common/costcenters.json")
      .subscribe((data: any) => {
        // this.CostCenterList = data ? JSON.parse(data) : [];
        this.CostCenterList = data ? data : [];
        console.log("this.CostCenterList =", this.CostCenterList);
      });
  }
  CountryChange(country) {
    console.log("country =", country);
    if (country === "India") {
      this.displayPin = true;
    } else {
      this.displayPin = false;
      this.GetStateList();
      this.ObjCostcenter.PIN = "";
      this.ObjCostcenter.State = "";
      this.ObjCostcenter.District = "";
    }
  }
  TabClick(e) {
    this.tabIndexToView = e.index;
    this.items = ["BROWSE", "CREATE"];
    this.buttonname = "Create";
    this.clearData();
  }
  clearData() {
    if (this.PDFViewFlag === false) {
      this.fileInput.clear();
    }
    this.CostcenterSearchSubmitted = false;
    this.CostcenterFormSubmitted = false;
    this.Spinner = false;
    this.componentDisplay = false;
    this.ObjCostcenter = new Costcenter();
    this.ObjCostcenter.Country = "India";
    this.PDFViewFlag = false;
    this.MaterialSubTypeList = [];
    this.ExistNameFlag = false;
    this.JobWork = false;

    //this.ObjCostcenter.Cost_Cen_ID = this.tmp_Cost_Cen_ID;
  }

  CostCenterIniCheck(Cost_Cen_Ini) {
  console.log("Cost_Cen_Ini =", Cost_Cen_Ini);
  console.log("Cost_Cen_Ini 22 =", Cost_Cen_Ini.length);
  this.ExistNameFlag = false;
  if (Cost_Cen_Ini.length === 5) {
    this.$http
      .get(
        "/Master_Cost_Center_V2/Check_Cost_Centre_Ini?Cost_Cen_Ini=" +
          Cost_Cen_Ini
      )
      .subscribe((data: any) => {
        //const data2 = data ? JSON.parse(data) : [];
        const existMsg = data;
        console.log("data =", existMsg);
        if (existMsg !== "[]") {
          console.log("data22 =", existMsg);
          this.ExistNameFlag = true;
          this.compacctToast.clear();
          this.compacctToast.add({
            key: "compacct-toast",
            severity: "error",
            // summary: 'Costcenter ID  :' + this.ObjCostcenter.Cost_Cen_ID ,
            detail: existMsg
          });
        } else {
          this.ExistNameFlag = false;
        }
      });
    }
 }

  SaveCostcenterMaster(valid) {
    this.CostcenterFormSubmitted = true;
    console.log(this.ObjCostcenter);
    if (valid) {
      this.Spinner = true;
      this.ObjCostcenter.Job_Work = this.JobWork ? 1 : 0;
      const UrlAddress = "/Master_Cost_Center_V2/Insert_Edit_Cost_Centre";
      const obj = { Cost_Centre_String: JSON.stringify([this.ObjCostcenter]) };
      this.$http.post(UrlAddress, obj).subscribe((data: any) => {
        if (data.success) {
          this.shareCostCenterID = data.id;

          if (this.PDFFlag) {
            this.CostcenterBrochureUploader(this.CostcenterPDFFile);
          }
          if (this.ObjCostcenter.Cost_Cen_ID) {
            this.componentDisplay = true;
            console.log(" this.shareCostCenterID 22", this.shareCostCenterID);
            this.compacctToast.clear();
            this.compacctToast.add({
              key: "compacct-toast",
              severity: "success",
              summary: "Cost Center ID :" + this.ObjCostcenter.Cost_Cen_ID,
              detail: "Succesfully Updated"
            });
          } else {
            this.componentDisplay = true;
            console.log(" this.shareCostCenterID 11", this.shareCostCenterID);
            this.compacctToast.clear();
            this.compacctToast.add({
              key: "compacct-toast",
              severity: "success",
              summary: "Costcenter Added",
              detail: "Succesfully Created"
            });
            this.clearData();
          }
          this.Spinner = false;
          this.getAllCostcenterList();
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




class Costcenter {
  Cost_Cen_ID = 0;
  Cost_Cen_Name: string;
  Cost_Cen_Ini: string;
  Address1: string;
  Address2: string;
  Location: string;
  Country: any;
  PIN: string;
  State: string;
  District: string;
  Mobile: number;
  Phone: number;
  Email1: string;
  Is_Visiable = "Y";
  ZONE: string;
  CATEGORY: any;
  SALE_TARGET: string;
  Parent_Cost_Cen_ID: any;
  Job_Work = 0;
  Cost_Cen_Logo: any;
  GST_NO: string;
  Cost_Cen_Type: string;
}
