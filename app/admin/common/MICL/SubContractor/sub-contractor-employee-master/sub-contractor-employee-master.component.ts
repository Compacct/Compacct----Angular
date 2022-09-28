import { Component, OnInit, ViewEncapsulation, ViewChild } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { MessageService } from "primeng/api";
import { FileUpload, Terminal } from "primeng/primeng";
import { data } from "jquery";
import { Console } from "console";
import { CompacctCommonApi } from "../../../../shared/compacct.services/common.api.service";
import { CompacctHeader } from "../../../../shared/compacct.services/common.header.service";
import { CompacctGlobalApiService } from "../../../../shared/compacct.services/compacct.global.api.service";
import { DateTimeConvertService } from "../../../../shared/compacct.global/dateTime.service";
import { NgxUiLoaderService } from "ngx-ui-loader";

@Component({
  selector: 'app-sub-contractor-employee-master',
  templateUrl: './sub-contractor-employee-master.component.html',
  styleUrls: ['./sub-contractor-employee-master.component.css'],
  providers: [MessageService],
  encapsulation: ViewEncapsulation.None
})
export class SubContractorEmployeeMasterComponent implements OnInit {
  items:any = [];
  menuList:any =[];
  hrYeatList:any = [];
  menuData:any = [];
  tabIndexToView= 0;
  buttonname = "Create";
  MasterSubContEmpFormSubmit = false;
  ObjMasterSubContEmp: MasterSubContEmp = new MasterSubContEmp ()
  Spinner = false;
  Sub_Contractor_ID:any;
  SubContractorList:any = [];
  DepartmentList:any = [];
  
  ObjBrowse : Browse = new Browse ();
  MastersubConSearchFormSubmitted = false;
  seachSpinner = false;
  initDate:any = [];
  SearchFields:any = [];
  SubContEmpBrowseList:any = [];
  DocNo: any;

  constructor(
    private $http: HttpClient,
    private commonApi: CompacctCommonApi,
    private Header: CompacctHeader,
    private GlobalAPI: CompacctGlobalApiService,
    private compacctToast: MessageService,
    private DateService: DateTimeConvertService,
    private ngxService: NgxUiLoaderService,
    private $CompacctAPI: CompacctCommonApi,
  ) { }

  ngOnInit() {
    this.items = ["BROWSE", "CREATE"];
    this.menuList = [
      { label: "Edit", icon: "pi pi-fw pi-user-edit" },
      { label: "Delete", icon: "fa fa-fw fa-trash" }
    ];
    this.Header.pushHeader({
      Header: "Master Sub Contractor",
      Link: "Material Management -> Sub Contractor -> Master Sub Contractor"
    });
    this.Finyear();
    this.GetSubContractor();
    this.GetDepartment();
    this.GetMasterSubConempBrowseData();
    // this.getCostCenter();
    // this.getSupplier();
    // this.getcompany();
    // // this.initDate = [new Date(),new Date()]
  }

  TabClick(e) {
    this.tabIndexToView = e.index;
    this.items = ["BROWSE", "CREATE"];
    this.buttonname = "Create";
    this.ObjMasterSubContEmp = new MasterSubContEmp();
    this.DocNo = undefined;
    this.Sub_Contractor_ID = undefined;
    // this.clearData();
  }
  Finyear() {
    this.$http
      .get("Common/Get_Fin_Year_Date?Fin_Year_ID=" + this.$CompacctAPI.CompacctCookies.Fin_Year_ID)
      .subscribe((res: any) => {
      let data = JSON.parse(res)
      // this.vouchermaxDate = new Date(data[0].Fin_Year_End);
      // this.voucherminDate = new Date(data[0].Fin_Year_Start);
      // this.voucherdata = new Date().getMonth() > new Date(data[0].Fin_Year_End).getMonth() ? new Date() : new Date(data[0].Fin_Year_End)
     this.initDate =  [new Date(data[0].Fin_Year_Start) , new Date(data[0].Fin_Year_End)]
      });
  }
  onConfirm(){}
  onReject(){}
  GetSubContractor(){
      const obj = {
       "SP_String": "SP_Master_Sub_Contractor_Employee",
       "Report_Name_String" : "Get_Sub_Contractor"
 
     }
     this.GlobalAPI.getData(obj).subscribe((data:any)=>{
       if(data.length) {
         data.forEach(element => {
           element['label'] = element.Name,
           element['value'] = element.Sub_Contractor_ID
         });
         this.SubContractorList = data;
       } else {
         this.SubContractorList = [];
       }
     // console.log("this.selectitem======",this.selectitem);
 
     });
 }
 GetDepartment(){
  const obj = {
   "SP_String": "SP_Master_Sub_Contractor_Employee",
   "Report_Name_String" : "Get_Dept"

 }
 this.GlobalAPI.getData(obj).subscribe((data:any)=>{
   if(data.length) {
     data.forEach(element => {
       element['label'] = element.Dept_Name,
       element['value'] = element.Dept_ID
     });
     this.DepartmentList = data;
   } else {
     this.DepartmentList = [];
   }
 // console.log("this.selectitem======",this.selectitem);

 });
}
  saveMasterSubConEmp(valid:any){
    this.MasterSubContEmpFormSubmit = true;
    this.Spinner = true;
    if(valid){
      if (this.buttonname === "Create") {
        const subcontractoreid = {
          Sub_Contractor_ID : this.Sub_Contractor_ID
        }
        const obj = {
          "SP_String": "SP_Master_Sub_Contractor_Employee",
          "Report_Name_String": 'Save_Master_Sub_Contractor_Employee',
          "Json_Param_String": JSON.stringify([{...subcontractoreid,...this.ObjMasterSubContEmp}])
         }
         this.GlobalAPI.postData(obj).subscribe((data:any)=>{
          var id = data[0].Column1;
          if (data[0].Column1){
            this.compacctToast.clear();
            this.compacctToast.add({
              key: "compacct-toast",
              severity: "success",
              summary: "Sub_Contractor_Emp_ID " + id ,
              detail: "Succesfully Create"
            });
            this.Spinner = false;
            this.GetMasterSubConempBrowseData();
            this.MasterSubContEmpFormSubmit = false;
            this.ObjMasterSubContEmp = new MasterSubContEmp();
            }
            else {
              this.Spinner = false;
              this.compacctToast.clear();
              this.compacctToast.add({
                key: "compacct-toast",
                severity: "error",
                summary: "Warn Message ",
                detail: "Error Occured "
              });
            }
          });
        }
        else {
        const docno= {
          Sub_Contractor_ID : this.Sub_Contractor_ID,
          Emp_ID : this.DocNo
        }
          const obj = {
            "SP_String": "SP_Master_Sub_Contractor_Employee",
            "Report_Name_String": 'Update_Master_Sub_Contractor_Employee',
            "Json_Param_String": JSON.stringify([{...docno,...this.ObjMasterSubContEmp}])
           }
           this.GlobalAPI.postData(obj).subscribe((data:any)=>{
            var id = data[0].Column1;
            if (data[0].Column1){
              this.compacctToast.clear();
              this.compacctToast.add({
                key: "compacct-toast",
                severity: "success",
                summary: "Sub_Contractor_ID " + id ,
                detail: "Succesfully Update"
              });
              this.Spinner = false;
              this.GetMasterSubConempBrowseData();
              this.MasterSubContEmpFormSubmit = false;
              this.ObjMasterSubContEmp = new MasterSubContEmp();
              this.DocNo = undefined;
              this.tabIndexToView = 0;
              this.items = ["BROWSE", "CREATE"];
              this.buttonname = "CREATE";
              }
              else {
                this.Spinner = false;
                this.compacctToast.clear();
                this.compacctToast.add({
                  key: "compacct-toast",
                  severity: "error",
                  summary: "Warn Message ",
                  detail: "Error Occured "
                });
              }
            });
          }
      }
      else{
        this.Spinner = false;
        this.compacctToast.clear();
        this.compacctToast.add({
          key: "compacct-toast",
          severity: "error",
          summary: "Warn Message ",
          detail: "Error Occured "
        });
      }
        
  }
  GetMasterSubConempBrowseData(){
    this.SubContEmpBrowseList = [];
  //  this.MastersubConSearchFormSubmitted = true;
   this.seachSpinner = true;
  const obj = {
    "SP_String":"SP_Master_Sub_Contractor_Employee",
    "Report_Name_String":"Browse_Master_Sub_Contractor_Employee"
  }
   this.GlobalAPI.getData(obj).subscribe((data:any)=>{
    this.SubContEmpBrowseList = data;
    // this.MastersubConSearchFormSubmitted = false;
    this.seachSpinner = false;
  });
 }
 Edit(col){
  this.ObjMasterSubContEmp = new MasterSubContEmp();
    this.DocNo = undefined;
    if(col.Emp_ID){
      this.DocNo = col.Emp_ID;
      this.tabIndexToView = 1;
      this.items = ["BROWSE", "UPDATE"];
      this.buttonname = "Update";
      this.getedit();
     }
   }
   getedit(){
    const obj = {
      "SP_String": "SP_Master_Sub_Contractor_Employee",
      "Report_Name_String": "Get_Master_Sub_Contractor_Employee",
      "Json_Param_String": JSON.stringify([{Emp_ID : this.DocNo}])
  
    }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      // console.log("Edit data",data);
      this.Sub_Contractor_ID = data ? data[0].Sub_Contractor_ID : undefined;
      this.ObjMasterSubContEmp.Emp_Code = data ? data[0].Emp_Code : undefined;
      this.ObjMasterSubContEmp.Emp_Name = data ? data[0].Emp_Name : undefined;
      this.ObjMasterSubContEmp.Dept_ID = data ? data[0].Dept_ID : undefined;
      });
   }

}
class   MasterSubContEmp {
  Emp_Code:any;
  Emp_Name:any;
  Dept_ID:any;
}
class Browse {
  From_date : Date;
  To_date : Date;
 }

