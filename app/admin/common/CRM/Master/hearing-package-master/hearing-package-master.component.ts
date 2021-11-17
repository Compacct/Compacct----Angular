import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MessageService } from 'primeng/api';
import { DateTimeConvertService } from '../../../../shared/compacct.global/dateTime.service';
import { CompacctCommonApi } from '../../../../shared/compacct.services/common.api.service';
import { CompacctHeader } from '../../../../shared/compacct.services/common.header.service';
import { CompacctGlobalApiService } from '../../../../shared/compacct.services/compacct.global.api.service';

@Component({
  selector: 'app-hearing-package-master',
  templateUrl: './hearing-package-master.component.html',
  styleUrls: ['./hearing-package-master.component.css'],
  providers: [MessageService],
  encapsulation: ViewEncapsulation.None
})
export class HearingPackageMasterComponent implements OnInit {
  tabIndexToView = 0;
  items = [];
  PackageFormSubmitted = false;
  SessionFormSubmitted = false;
  saveSpinner = false;
  ObjPackageMaster = new Package();
  ObjPackageSessionMaster = new SessionPackage();
  ProductList = [];

  PackageSessionList = [];
  AllPackageList =[];
  BtnFlag = true;
  constructor(private $http: HttpClient,
    private Header: CompacctHeader,
    private $CompacctAPI: CompacctCommonApi,
    private GlobalAPI: CompacctGlobalApiService,
    private DateService: DateTimeConvertService,
    private compacctToast: MessageService) { }

  ngOnInit() {
    this.items =  ["CREATE", "BROWSE"];
    this.Header.pushHeader({
      Header: "Package Master",
      Link: "CRM --> Clinic -> Master -> Package Master"
    });
    this.GetProduct();
    this.GetAllPackageList();
  }
  GetAllPackageList() {
    this.AllPackageList = [];
    const obj = {
      "SP_String": "SP_BL_CRM_Package_Appointment",
      "Report_Name_String" : "Get_Package_Details",
    }
    this.GlobalAPI.postData(obj).subscribe((data:any)=>{
      console.log(data);
      this.AllPackageList = data;     
    })
  }

  GetProduct() {
    const today = this.DateService.dateConvert(new Date());
    this.$http.get('/Common/Get_Product_Saleable_with_GST_Tax?Doc_date='+today).subscribe((res: any) => {
      const data = res ? JSON.parse(res) : [];
      data.forEach(e=>{
        if(e.Is_Service) {
          e['label'] = e.Product_Name;
          e['value'] = e.Product_ID;
          this.ProductList.push(e);
        }
      });
    });
  }
  AddSession(valid){
    this.SessionFormSubmitted = true;
    if(valid) {
      this.PackageSessionList.push(this.ObjPackageSessionMaster);
      this.ObjPackageSessionMaster = new SessionPackage();
      this.SessionFormSubmitted = false;
    }
  }
  DeleteSession(i) {
    this.PackageSessionList.splice(i,1)
  }

  TabClick(e){
    this.tabIndexToView = e.index;
    this.items = ["CREATE", "BROWSE"];
    this.clearData();

  }
  clearData() {
    this.PackageFormSubmitted = false;
    this.SessionFormSubmitted = false;
    this.saveSpinner = false;
    this.ObjPackageMaster = new Package();
    this.ObjPackageSessionMaster = new SessionPackage();
    this.PackageSessionList = [];
    this.BtnFlag = true;
  }

  ViewPackageDetails(obj){
    this.clearData();
    if(obj.Package_ID) {
      const obj1 = {
        "SP_String": "SP_BL_CRM_Package_Appointment",
        "Report_Name_String" : "Get_Session_Details",
        "Json_Param_String" : JSON.stringify([obj])
      }
      this.GlobalAPI.postData(obj1).subscribe((data:any)=>{
        this.items = ["CREATE", "VIEW"];
        this.ObjPackageMaster = obj;
        this.PackageSessionList = data;
        this.tabIndexToView = 1; 
        this.BtnFlag = false;
        console.log(this.ObjPackageMaster);
      })
    }
  }

  SavePackage(valid){
    this.PackageFormSubmitted = true;
    if(valid && this.PackageSessionList.length) {
      this.saveSpinner = true;
      const obj = {
        "SP_String": "SP_BL_CRM_Package_Appointment",
        "Report_Name_String" : "Create_Edit_Package_With_Session",
        "Json_1_String": JSON.stringify([this.ObjPackageMaster]),
        "Json_2_String": JSON.stringify(this.PackageSessionList)
      }
      this.GlobalAPI.postData(obj).subscribe((data:any)=>{
        console.log(data);
        this.saveSpinner = false;
        if(data[0].Column1) {
          this.compacctToast.clear();
          this.compacctToast.add({
            key: "compacct-toast",
            severity: "success",
            summary: "Package ID : " + data[0].Column1,
            detail:  "Succesfully Package Created"
          });
          this.clearData();
          this.GetAllPackageList();
        } else{
          this.compacctToast.clear();
          this.compacctToast.add({
            key: "compacct-toast",
            severity: "error",
            summary: "Warn Message",
            detail: "Error Occured "
          });
        }
      })
    }
  }

}
class Package{
  Package_ID = 0;
  Product_ID:string;
  Package_Name:string;
  No_Of_Session:string;
}
class SessionPackage{
  Session_ID = 0;
  Package_ID = 0;
  Session_Name:string;
  Session_Duration_Mins:string;
  Appointment_Interval_Days:String;
}