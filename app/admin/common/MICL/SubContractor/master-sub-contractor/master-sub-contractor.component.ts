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
  selector: 'app-master-sub-contractor',
  templateUrl: './master-sub-contractor.component.html',
  styleUrls: ['./master-sub-contractor.component.css'],
  providers: [MessageService],
  encapsulation: ViewEncapsulation.None
})
export class MasterSubContractorComponent implements OnInit {
  items:any = [];
  menuList:any =[];
  hrYeatList:any = [];
  menuData:any = [];
  tabIndexToView= 0;
  buttonname = "Create";
  MasterSubContractorFormSubmit = false;
  ObjMasterSubContractor: MasterSubContractor = new MasterSubContractor ()
  Spinner = false;
  
  ObjBrowse : Browse = new Browse ();
  MastersubConSearchFormSubmitted = false;
  seachSpinner = false;
  initDate:any = [];
  BackupAllData:any = [];
  DistEmpName:any = [];
  SelectedDistEmpName:any = [];
  SearchFields:any = [];
  AllData:any = [];
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
    this.GetMasterSubConBrowseData();
    // this.getCostCenter();
    // this.getSupplier();
    // this.getcompany();
    // // this.initDate = [new Date(),new Date()]
  }
  TabClick(e) {
    this.tabIndexToView = e.index;
    this.items = ["BROWSE", "CREATE"];
    this.buttonname = "Create";
    this.ObjMasterSubContractor = new MasterSubContractor();
    this.DocNo = undefined;
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
  saveMasterSubCon(valid:any){
    this.MasterSubContractorFormSubmit = true;
    this.Spinner = true;
    if(valid){
      if (this.buttonname === "Create") {
        const obj = {
          "SP_String": "SP_Master_Sub_Contractor",
          "Report_Name_String": 'Save_Master_Sub_Contractor',
          "Json_Param_String": JSON.stringify([this.ObjMasterSubContractor])
         }
         this.GlobalAPI.postData(obj).subscribe((data:any)=>{
          var id = data[0].Column1;
          if (data[0].Column1){
            this.compacctToast.clear();
            this.compacctToast.add({
              key: "compacct-toast",
              severity: "success",
              summary: "Sub_Contractor_ID " + id ,
              detail: "Succesfully Create"
            });
            this.Spinner = false;
            this.GetMasterSubConBrowseData();
            this.MasterSubContractorFormSubmit = false;
            this.ObjMasterSubContractor = new MasterSubContractor();
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
          Sub_Contractor_ID : this.DocNo
        }
          const obj = {
            "SP_String": "SP_Master_Sub_Contractor",
            "Report_Name_String": 'Update_Master_Sub_Contractor',
            "Json_Param_String": JSON.stringify([{...this.ObjMasterSubContractor,...docno}])
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
              this.GetMasterSubConBrowseData();
              this.MasterSubContractorFormSubmit = false;
              this.ObjMasterSubContractor = new MasterSubContractor();
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
  GetMasterSubConBrowseData(){
    this.AllData = [];
   this.MastersubConSearchFormSubmitted = true;
   this.seachSpinner = true;
  const obj = {
    "SP_String":"SP_Master_Sub_Contractor",
    "Report_Name_String":"Browse_Master_Sub_Contractor"
  }
   this.GlobalAPI.getData(obj).subscribe((data:any)=>{
    this.AllData = data;
    this.MastersubConSearchFormSubmitted = false;
    this.seachSpinner = false;
  });
 }
 Edit(col){
  this.ObjMasterSubContractor = new MasterSubContractor();
    this.DocNo = undefined;
    if(col.Sub_Contractor_ID){
      this.DocNo = col.Sub_Contractor_ID;
      this.tabIndexToView = 1;
      this.items = ["BROWSE", "UPDATE"];
      this.buttonname = "Update";
      this.getedit();
     }
   }
   getedit(){
    const obj = {
      "SP_String": "SP_Master_Sub_Contractor",
      "Report_Name_String": "Get_Master_Sub_Contractor",
      "Json_Param_String": JSON.stringify([{Sub_Contractor_ID : this.DocNo}])
  
    }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      // console.log("Edit data",data);
      this.ObjMasterSubContractor.Name = data ? data[0].Name : undefined;
      this.ObjMasterSubContractor.Address = data ? data[0].Address : undefined;
      });
   }
  //  UpdateMasterSubCon(valid:any){
  //   this.MasterSubContractorFormSubmit = true;
  //   this.Spinner = true;
  //   if(valid){
  //     const docno= {
  //       Sub_Contractor_ID : this.DocNo
  //     }
  //       const obj = {
  //         "SP_String": "SP_Master_Sub_Contractor",
  //         "Report_Name_String": 'Update_Master_Sub_Contractor',
  //         "Json_Param_String": JSON.stringify([{...this.ObjMasterSubContractor,...docno}])
  //        }
  //        this.GlobalAPI.postData(obj).subscribe((data:any)=>{
  //         var id = data[0].Column1;
  //         if (data[0].Column1){
  //           this.compacctToast.clear();
  //           this.compacctToast.add({
  //             key: "compacct-toast",
  //             severity: "success",
  //             summary: "Sub_Contractor_ID " + id ,
  //             detail: "Succesfully Update"
  //           });
  //           this.Spinner = false;
  //           this.GetMasterSubConBrowseData();
  //           this.MasterSubContractorFormSubmit = false;
  //           this.ObjMasterSubContractor = new MasterSubContractor();
  //           this.DocNo = undefined;
  //           this.tabIndexToView = 0;
  //           this.items = ["BROWSE", "CREATE"];
  //           this.buttonname = "CREATE";
  //           }
  //           else {
  //             this.Spinner = false;
  //             this.compacctToast.clear();
  //             this.compacctToast.add({
  //               key: "compacct-toast",
  //               severity: "error",
  //               summary: "Warn Message ",
  //               detail: "Error Occured "
  //             });
  //           }
  //         });
  //     }
  //     else{
  //       this.Spinner = false;
  //       this.compacctToast.clear();
  //       this.compacctToast.add({
  //         key: "compacct-toast",
  //         severity: "error",
  //         summary: "Warn Message ",
  //         detail: "Error Occured "
  //       });
  //     }
        
  // }

}
class   MasterSubContractor {
  Name:any;
  Address:any;
}
class Browse {
  From_date : Date;
  To_date : Date;
 }
