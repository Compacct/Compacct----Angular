import { Component, OnInit, ViewEncapsulation, ViewChild } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { CompacctCommonApi } from "../../../../shared/compacct.services/common.api.service";
import { CompacctHeader } from "../../../../shared/compacct.services/common.header.service";
import { MessageService } from "primeng/api";
import { FileUpload } from "primeng/primeng";
declare var $: any;
import { THIS_EXPR } from "@angular/compiler/src/output/output_ast";

@Component({
  selector: "app-master.cost-center",
  templateUrl: "./master.cost-center.component.html",
  styleUrls: ["./master.cost-center.component.css"],
  providers: [MessageService],
  encapsulation: ViewEncapsulation.None
})
export class MasterCostCenterComponent implements OnInit {
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

  NativeSubLedgerList = [];
  SubLedgerList = [];

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
  constructor(
    private $http: HttpClient,
    public commonApi: CompacctCommonApi,
    private Header: CompacctHeader,
    private compacctToast: MessageService
  ) {}

  ngOnInit() {
    this.items = ["BROWSE", "CREATE"];
    this.menuList = [
      { label: "Edit", icon: "pi pi-fw pi-user-edit" },
      { label: "Delete", icon: "fa fa-fw fa-trash" }
    ];
    this.Header.pushHeader({
      Header: "Master Cost Center",
      Link: " Material Management -> Master -> Master Cost Center"
    });

    this.GetCountryList();
    this.GetStateList();
    this.getAllCostcenterList();
    this.gerCostCenterType();
    this.GetAllSubledger();
  }
  gerCostCenterType() {
    this.$http
      .get("/Scripts/Common/costcenters.json")
      .subscribe((data: any) => {
        // this.CostCenterList = data ? JSON.parse(data) : [];
        this.CostCenterList = data ? data : [];
        console.log("this.CostCenterList =", this.CostCenterList);
      });
    
  }

  // INIT DATA
  GetAllSubledger() {
    this.$http.get(this.url.apiGetSubledgerDr).subscribe((data:any)=>{
      console.log(data);
      this.NativeSubLedgerList = data ? JSON.parse(data) : [];
        this.NativeSubLedgerList.forEach(el => {
          this.SubLedgerList.push({
            label: el.Sub_Ledger_Name,
            value: el.Sub_Ledger_ID
          });
        });
    })
  }
  GetCategory() {
    this.$http
      .get("/Master_Costcenter_Category/GetAllData")
      .subscribe((data: any) => {
        this.CostcenterCategoryLists = data ? data : [];
      });
  }
  GetCostcenterMfd() {
    this.$http
      .get("/Master_Costcenter_Mfg/GetAllData")
      .subscribe((data: any) => {
        this.CostcenterMfdLists = data ? data : [];
      });
  }

  GetMaterialSubType(materialType) {
    this.MaterialSubTypeList = [];
    if (materialType) {
      const para = new HttpParams().set("Type", materialType);
      this.$http
        .get("/Master_Cost_Center_V2/Get_Meterial_SubType", { params: para })
        .subscribe((data: any) => {
          this.MaterialSubTypeList = data ? JSON.parse(data) : [];
        });
    }
  }

  GetMaterialType() {
    this.$http
      .get("/Master_Cost_Center_V2/Get_Meterial_Type")
      .subscribe((data: any) => {
        this.MaterialTypeList = data ? JSON.parse(data) : [];
      });
  }
  getAddressOnChange(e) {
    this.ObjCostcenter.Location = undefined;
    if (e) {
      this.ObjCostcenter.Location = e;
    }
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

  GetDistrictList() {
    this.$http
      .get("/Master_Cost_Center_V2/Get_District")
      .subscribe((data: any) => {
        this.DistrictList = data ? JSON.parse(data) : [];
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
  StateChange(statename) {
    console.log("statename =", statename);
    this.$http
      .get("/Master_Cost_Center_V2/Get_District?statename=" + statename)
      .subscribe((data: any) => {
        this.DistrictList = data ? JSON.parse(data) : [];
        console.log("DistrictList  =", this.DistrictList);
      });
  }

  stateDistrictChange(pin) {
    console.log("pin =", pin);
    console.log("pin 22 =", pin.length);
    if (pin.length === 6) {
      this.$http
        .get("/Master_Cost_Center_V2/Get_State_District_Against_PIN?PIN=" + pin)
        .subscribe((data: any) => {
          this.StateDisList = data ? JSON.parse(data) : [];
          this.StateChange(this.StateDisList[0].statename);
          this.ObjCostcenter.State = this.StateDisList[0].statename;
          this.ObjCostcenter.District = this.StateDisList[0].Districtname;

          //console.log('this.ObjCostcenter.State 22 =', this.ObjCostcenter.State);
          //console.log('this.ObjCostcenter.District  22 =', this.ObjCostcenter.District );
        });
    }
  }

  // Change
  MaterialTypeChange(matType) {
    // this.ObjCostcenter.Material_Sub_Type = undefined;
    // this.MaterialSubTypeList = [];
    // if ( matType) {
    //   this.GetMaterialSubType(matType);
    // }
  }
  MaterialTypeChangeSearch(matType) {
    // this.MaterialSubType_Browse = undefined;
    // this.MaterialSubTypeList = [];
    // if ( matType) {
    //   this.GetMaterialSubType(matType);
    // }
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
  CostCenCatChangte(cat) {
    this.ObjCostcenter.Sub_Ledger_ID = undefined;
  }

  // Search

  // Save
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
  // Edit
  EditCostcenter(Costcenter) {
    if (Costcenter.Cost_Cen_ID) {
      this.tabIndexToView = 1;
      this.items = ["BROWSE", "UPDATE"];
      this.buttonname = "Update";
      this.clearData();
      this.GetEditMasterCostcenter(Costcenter);
    }
  }
  GetEditMasterCostcenter(Costcenter) {
    if (Costcenter.PIN) {
      this.stateDistrictChange(Costcenter.PIN);
    }
    this.ObjCostcenter = Costcenter;
    this.JobWork = this.ObjCostcenter.Job_Work ? true : false;
    this.PDFViewFlag = this.ObjCostcenter.Cost_Cen_Logo ? true : false;
    this.location = this.ObjCostcenter.Location;
    console.log(Costcenter);
    this.CostcenterPDFLink = this.ObjCostcenter.Cost_Cen_Logo
      ? this.ObjCostcenter.Cost_Cen_Logo
      : undefined;
    this.shareCostCenterID = Costcenter.Cost_Cen_ID;
    console.log("this.shareCostCenterID 33 =", this.shareCostCenterID);
    this.componentDisplay = true;
  }
  // Delete
  onConfirm() {
    if (this.CostcenterID) {
      this.$http
        .post("/Master_Cost_Center_V2/Delete", { id: this.CostcenterID })
        .subscribe((data: any) => {
          if (data.success === true) {
            this.onReject();
            this.getAllCostcenterList();
            this.compacctToast.clear();
            this.compacctToast.add({
              key: "compacct-toast",
              severity: "success",
              summary: "Costcenter ID: " + this.CostcenterID.toString(),
              detail: "Succesfully Deleted"
            });
          }
        });
    }
  }
  onReject() {
    this.compacctToast.clear("c");
  }
  DeleteCostcenter(Costcenter) {
    console.log("Costcenter ===", Costcenter);
    this.CostcenterID = undefined;
    if (Costcenter.Cost_Cen_ID) {
      this.CostcenterID = Costcenter.Cost_Cen_ID;
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

  // File Upload
  FetchPDFFile(event) {
    this.PDFFlag = false;
    this.CostcenterPDFFile = {};
    if (event) {
      this.CostcenterPDFFile = event.files[0];
      this.PDFFlag = true;
      this.PDFViewFlag = false;
    }
  }
  CostcenterBrochureUploader(fileData) {
    const endpoint = "/Master_Cost_Center_V2/Upload_Pic";
    const formData: FormData = new FormData();
    formData.append("aFile", fileData);
    this.$http.post(endpoint, formData).subscribe(data => {
      console.log(data);
    });
  }
  // Clear & Tab
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
  Sub_Ledger_ID: string;
}
