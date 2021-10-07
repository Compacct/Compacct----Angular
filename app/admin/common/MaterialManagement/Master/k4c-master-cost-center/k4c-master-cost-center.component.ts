import { Component, OnInit, ViewEncapsulation, ViewChild } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { CompacctCommonApi } from "../../../../shared/compacct.services/common.api.service";
import { CompacctHeader } from "../../../../shared/compacct.services/common.header.service";
import { MessageService } from "primeng/api";
import { FileUpload } from "primeng/primeng";
import { CompacctGlobalApiService } from '../../../../shared/compacct.services/compacct.global.api.service';
declare var $: any;
import { THIS_EXPR } from "@angular/compiler/src/output/output_ast";

@Component({
  selector: 'app-k4c-master-cost-center',
  templateUrl: './k4c-master-cost-center.component.html',
  styleUrls: ['./k4c-master-cost-center.component.css'],
  providers: [MessageService],
  encapsulation: ViewEncapsulation.None
})
export class K4cMasterCostCenterComponent implements OnInit {

  tabIndexToView = 0;
  url = window["config"];
  persons: [];
  buttonname = "Create";
  Spinner = false;
  PDFFlag = false;
  PDFViewFlag = false;
  CostcenterPDFLink = undefined;
  frnVal = false;
  brandList = [];
  userList = [];

  items = [];
  CostcenterSearchSubmitted = false;
  CostcenterFormSubmitted = false;
  AllCostcenterList = [];
  DynamicHeader = [];
  CostcenterMfdLists = [];
  CostcenterCategoryLists = [];
  MaterialTypeList = [];
  MaterialSubTypeList = [];
  CostcenterPDFFile = {};
  FranchiseRateList = ["New","Old"];
  MaterialType_Browse: any;
  MaterialSubType_Browse: any;
  CostcenterID: number;

  NativeSubLedgerList = [];
  SubLedgerList = [];
  Parent_Cost_cenList = [];
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
  CategoryList = [];
  // CostCenterList: any=['center1', 'center2', 'center3'];
  CostCenterList: any[] = [];
  shareCostCenterID: number;
  componentDisplay: boolean = false;
  tmp_Cost_Cen_ID: number;

  ObjCostcenter: Costcenter = new Costcenter();
  // @ViewChild("fileInput", { static: false }) fileInput: FileUpload;
  constructor(
    private $http: HttpClient,
    private commonApi: CompacctCommonApi,
    private GlobalAPI: CompacctGlobalApiService,
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
      Link: "Material Management -> Master -> Master Cost Center"
    });

    this.GetCountryList();
    this.GetStateList();
    this.getAllCostcenterList();
    this.gerCostCenterType();
    this.GetAllSubledger();
    this.getBrand();
    this.GetUserId();
    this.Get_Parent_Cost_Cen();
    this.GetCostCenterType();
    console.log("Franchise",this.ObjCostcenter.Franchise);
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
    const obj = {
      "SP_String": "SP_Controller_Master",
      "Report_Name_String": "Franchise SubLedger Master List",
      
    }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      // console.log(data);
      this.NativeSubLedgerList = data ;
      console.log("NativeSubLedgerList",this.NativeSubLedgerList);
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
 GetCostCenterType(){
  const obj = {
    "SP_String": "SP_Controller_Master",
    "Report_Name_String": "Get - Cost center type",
    
  }
  this.GlobalAPI.getData(obj).subscribe((data:any)=>{
     this.CategoryList = data;
    console.log("CostCenterType",this.CategoryList);
    
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
    let TempArr = [];
    let TempVal ;
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
    const obj = {
      "SP_String": "SP_Controller_Master",
      "Report_Name_String": "Browse - Cost Centre Master",
      
    }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
       this.DynamicHeader = Object.keys(data[0]);
       this.AllCostcenterList = data;
      console.log("this.DynamicHeader",this.DynamicHeader);
      console.log("this.AllCostcenterList",this.AllCostcenterList);
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
  GetSlicedArr () {
    let TempArr = [];
    this.DynamicHeader.forEach((item)=>{
      if(item ==="Brand" || item === "Cost_Cen_Name"|| item ==="Location"){
        TempArr.push(item)
      }
    })
   // console.log(TempArr)
    return TempArr ;
  }

  stateDistrictChange(pin) {
    console.log("pin =", pin);
    console.log("pin 22 =", pin.length);
    if (pin.length === 6) {
      this.$http
        .get("/Master_Cost_Center_V2/Get_State_District_Against_PIN?PIN=" + pin)
        .subscribe((data: any) => {
          this.StateDisList = data ? JSON.parse(data) : [];
          console.log("this.StateDisList",this.StateDisList);
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
  getBrand(){
    const obj = {
      "SP_String": "SP_Controller_Master",
      "Report_Name_String": "Get - Brand",
      
    }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      // console.log("brandList  ===",data);
      this.brandList = data;
    })
  }
  GetUserId(){
    const obj = {
      "SP_String": "SP_Controller_Master",
      "Report_Name_String": "Get - UseridName",
      
    }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      // console.log("brandList  ===",data);
      this.userList = data;
      console.log("this.userList",this.userList);
    })
  }
  Get_Parent_Cost_Cen(){
    const obj = {
      "SP_String": "SP_Controller_Master",
      "Report_Name_String": "Get - Parent Cost Center",
      
    }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
     console.log("Parent_Cost_cenList  ===",data);
      this.Parent_Cost_cenList = data;
    })
  }
  // CostCenCatChangte() {
  //   this.ObjCostcenter.Sub_Ledger_ID = undefined;
   
  // }

  // Search

  // Save
  SaveCostcenterMaster(valid) {
    this.CostcenterFormSubmitted = true;
    this.ObjCostcenter.Franchise = this.frnVal ?  'Y' : 'N';
    console.log(valid);
    if (valid) {
      this.Spinner = true;
       console.log("this.ObjCostcenter",this.ObjCostcenter);
      if(this.ObjCostcenter.Cost_Cen_ID){
      const obj = {
        "SP_String": "SP_Controller_Master",
        "Report_Name_String": "Update Master Cost Center",
        "Json_Param_String": JSON.stringify([this.ObjCostcenter])      
      }
      this.GlobalAPI.getData(obj).subscribe((data:any)=>{
         console.log("save Data===", data[0].Column1)
        if (data[0].Column1 === "done"){
           this.compacctToast.clear();
           this.compacctToast.add({
            key: "compacct-toast",
            severity: "success",
            summary: "Cost Center ID: " + this.ObjCostcenter.Cost_Cen_ID,
            detail: "Succesfully Update"
          });
          this.tabIndexToView = 0;
          this.items = ["BROWSE", "CREATE"];
          this.buttonname = "Create";
          }
          this.Spinner = false;
          this.getAllCostcenterList();
      })
     
    }
    else{
      const obj = {
        "SP_String": "SP_Controller_Master",
        "Report_Name_String": "Add Master Cost Center",
        "Json_Param_String": JSON.stringify([this.ObjCostcenter])      
      }
      this.GlobalAPI.getData(obj).subscribe((data:any)=>{
        // console.log("del Data===", data[0].Column1)
        if (data[0].Column1){
          this.compacctToast.clear();
         this.compacctToast.add({
           key: "compacct-toast",
           severity: "success",
           summary: "Product Added" + this.ObjCostcenter.Cost_Cen_ID,
           detail: "Succesfully Created"
         });
         }
          this.Spinner = false;
          this.getAllCostcenterList();
          this.clearData();
      })
    }
      
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
    this.frnVal = this.ObjCostcenter.Franchise === 'Y' ? true : false;
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
      const obj = {
        "SP_String": "SP_Controller_Master",
        "Report_Name_String": "Delete Cost Centre",
        "Json_Param_String": JSON.stringify([{Cost_Cen_ID : this.CostcenterID}])      
      } 
      this.GlobalAPI.getData(obj).subscribe((data:any)=>{
       console.log("del Data===", data[0].Column1)
        if (data[0].Column1 === "done"){
          this.onReject();
          this.getAllCostcenterList();
          this.compacctToast.clear();
          this.compacctToast.add({
            key: "compacct-toast",
            severity: "success",
            summary: "Cost center Id: " + this.CostcenterID.toString(),
            detail: "Succesfully Deleted"
          });
          

        }
      })
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
  handleSelected($event){
    if ($event.target.checked === true) {
      this.frnVal = true;
      }
      else {
        this.frnVal = false;
      }
  }
  fraChange(){
    if(this.ObjCostcenter.COST_CEN_TYPE !== "Outlet"){
      this.ObjCostcenter.Franchise = "N";
        this.frnVal = false;
    }
  }

  // File Upload
  // FetchPDFFile(event) {
  //   this.PDFFlag = false;
  //   this.CostcenterPDFFile = {};
  //   if (event) {
  //     this.CostcenterPDFFile = event.files[0];
  //     this.PDFFlag = true;
  //     this.PDFViewFlag = false;
  //   }
  // }
  // CostcenterBrochureUploader(fileData) {
  //   const endpoint = "/Master_Cost_Center_V2/Upload_Pic";
  //   const formData: FormData = new FormData();
  //   formData.append("aFile", fileData);
  //   this.$http.post(endpoint, formData).subscribe(data => {
  //     console.log(data);
  //   });
  // }
  // Clear & Tab
  TabClick(e) {
    this.tabIndexToView = e.index;
    this.items = ["BROWSE", "CREATE"];
    this.buttonname = "Create";
    this.clearData();
  }
  clearData() {
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
  Country: string;
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
  Cost_Cen_Logo: any;
  GST_NO: string;
  FSSAI_NO: string;
  Cost_Cen_Type: string;
  Sub_Ledger_ID: string;
  COST_CEN_TYPE = "Others" ;
  Franchise : string;
  User_ID : string;
  Brand_ID : 0;
  Contact_Name : string ;
  Brand : any;
  Franchise_Rate : string;
}   