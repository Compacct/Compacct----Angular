import { Component, OnInit, ViewEncapsulation, ViewChild } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { CompacctCommonApi } from "../../../../shared/compacct.services/common.api.service";
import { CompacctGlobalApiService } from '../../../../shared/compacct.services/compacct.global.api.service';
import { CompacctHeader } from "../../../../shared/compacct.services/common.header.service";
import { MessageService } from "primeng/api";
import { FileUpload } from "primeng/primeng";

@Component({
  selector: 'app-engg-nepal-machine-master',
  templateUrl: './engg-nepal-machine-master.component.html',
  styleUrls: ['./engg-nepal-machine-master.component.css'],
  providers: [MessageService],
  encapsulation: ViewEncapsulation.None
})
export class EnggNepalMachineMasterComponent implements OnInit {
  tabIndexToView = 0;
  url = window["config"];
  persons: [];
  buttonname = "Save";
  Spinner = false;

  items = [];
  MachineMasterFormSubmitted = false;

  ObjMachineMaster = new MachineMaster();
  //@ViewChild("fileInput", { static: false }) fileInput: FileUpload;

  MfCreateModal = false;
  ManufacturerName = undefined;
  MfcreateFormSubmitted = false;
  MfList = [];
  BrowseList = [];
  editList = [];
  productid: any;
  column = [];

  constructor(
    private $http: HttpClient,
    private commonApi: CompacctCommonApi,
    private GlobalAPI: CompacctGlobalApiService,
    private Header: CompacctHeader,
    private compacctToast: MessageService
  ) { }

  ngOnInit() {
    this.items = ["BROWSE", "CREATE"];
    // this.menuList = [
    //   { label: "Edit", icon: "pi pi-fw pi-user-edit" },
    //   { label: "Delete", icon: "fa fa-fw fa-trash" }
    // ];
    this.Header.pushHeader({
      Header: "Machine Master",
      Link: " Material Management -> Master -> Machine Master"
    });
     this.GetManufacturer();
     this.GetBrowseList();
    // this.GetMaterialType();

    this.column = [
      { field: 'Product_Code', header: 'Product Model' },
      { field: 'Product_Description', header: 'Product Description' },
      { field: 'Mfg_Company', header: 'Manufacturer' }
    ];
  }
  // Clear & Tab
  TabClick(e) {
    this.tabIndexToView = e.index;
    this.items = ["BROWSE", "CREATE"];
    this.buttonname = "Save";
    this.clearData();
    this.productid = undefined;
  }
  clearData() {
    this.MachineMasterFormSubmitted = false;
    this.Spinner = false;
    this.ObjMachineMaster = new MachineMaster();
    this.GetBrowseList();
  }
  // Create Tab
  ManufacturerPopup(){
    this.ManufacturerName = undefined;
    this.MfcreateFormSubmitted = false;
    this.MfCreateModal = true;
    this.Spinner = false;
   }
   GetManufacturer(){
    const obj = {
      "SP_String": "SP_Engg_Nepal_Machine_Master",
      "Report_Name_String": "Get_Master_Product_Mfg_Data"
     }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
     this.MfList = data;
     console.log('MfList ==', this.MfList)
  
    });
  }
  CreateManufacturer(valid){
    this.MfcreateFormSubmitted = true;
      const Obj = {
        Mfg_Company : this.ManufacturerName
      }
      if(valid){
         const obj = {
           "SP_String": "SP_Engg_Nepal_Machine_Master",
           "Report_Name_String" : "SAVE_Master_Product_Mfg",
           "Json_Param_String": JSON.stringify([Obj])
       
         }
         this.GlobalAPI.postData(obj).subscribe((data:any)=>{
           console.log(data);
           var tempID = data[0].Column1;
           if(data[0].Column1){
            this.compacctToast.clear();
            //const mgs = this.buttonname === 'Save & Print Bill' ? "Created" : "updated";
            this.compacctToast.add({
             key: "compacct-toast",
             severity: "success",
             summary: "Return_ID  " + tempID,
             detail: "Succesfully Created" //+ mgs
           });
           this.MfcreateFormSubmitted = false;
           this.ManufacturerName = undefined;
           this.MfCreateModal = false;
           this.GetManufacturer();
           // this.clearData();
            // this.testchips =[];
       
           } else{
            // this.ngxService.stop();
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
  SaveMachineMaster(valid){
    if(valid && this.productid){
    const Obj = {
      Product_ID  : this.productid,
      Product_Code : this.ObjMachineMaster.Product_Model,
      Product_Description : this.ObjMachineMaster.Product_Description,
      Product_Mfg_Comp_ID : this.ObjMachineMaster.Manufacturer
    }
       const obj = {
         "SP_String": "SP_Engg_Nepal_Machine_Master",
         "Report_Name_String" : "Update_Engg_Nepal_Machine_Master",
         "Json_Param_String": JSON.stringify([Obj])
     
       }
       this.GlobalAPI.postData(obj).subscribe((data:any)=>{
         console.log(data);
         var tempID = data[0].Column1;
         if(data[0].Column1){
          this.compacctToast.clear();
          //const mgs = this.buttonname === 'Save & Print Bill' ? "Created" : "updated";
          this.compacctToast.add({
           key: "compacct-toast",
           severity: "success",
           summary: "Return_ID  " + tempID,
           detail: "Succesfully Updated" //+ mgs
         });
         this.clearData();
         this.productid = undefined;
         this.tabIndexToView = 0;
         this.items = ["BROWSE", "CREATE"];
        //  this.buttonname = "Save";
          // this.testchips =[];
     
         } else{
          // this.ngxService.stop();
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
      else {
    this.MachineMasterFormSubmitted = true;
      const Obj = {
        Product_Code : this.ObjMachineMaster.Product_Model,
        Product_Description : this.ObjMachineMaster.Product_Description,
        Product_Mfg_Comp_ID : this.ObjMachineMaster.Manufacturer
      }
      if(valid){
         const obj = {
           "SP_String": "SP_Engg_Nepal_Machine_Master",
           "Report_Name_String" : "SAVE_Engg_Nepal_Machine_Master",
           "Json_Param_String": JSON.stringify([Obj])
       
         }
         this.GlobalAPI.postData(obj).subscribe((data:any)=>{
           console.log(data);
           var tempID = data[0].Column1;
           if(data[0].Column1){
            this.compacctToast.clear();
            //const mgs = this.buttonname === 'Save & Print Bill' ? "Created" : "updated";
            this.compacctToast.add({
             key: "compacct-toast",
             severity: "success",
             summary: "Return_ID  " + tempID,
             detail: "Succesfully Saved" //+ mgs
           });
           this.clearData();
            // this.testchips =[];
       
           } else{
            // this.ngxService.stop();
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

  // Browse Tab
  GetBrowseList(){
    const obj = {
      "SP_String": "SP_Engg_Nepal_Machine_Master",
      "Report_Name_String": "Browse_Machine_master"
     }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
     this.BrowseList = data;
     console.log('BrowseList ==', this.BrowseList)
  
    });
  }
  Edit(Mmaster){
    if (Mmaster.Product_ID) {
      this.productid = Mmaster.Product_ID
      this.tabIndexToView = 1;
      this.items = ["BROWSE", "UPDATE"];
      this.buttonname = "Update";
      this.clearData();
      this.GetEdit(this.productid);
    }
  }
  GetEdit(Mmaster){
    this.editList = [];
    //this.ProductionFormSubmitted = false;
    const obj = {
      "SP_String": "SP_Engg_Nepal_Machine_Master",
      "Report_Name_String": "Get_Machine_Master_Data_For_Edit",
      "Json_Param_String": JSON.stringify([{Product_ID  : this.productid}])
  
    }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      this.editList = data;
       this.ObjMachineMaster.Product_Model = data[0].Product_Code;
       //this.myDate = data[0].Date;
       this.ObjMachineMaster.Product_Description = data[0].Product_Description;
       this.ObjMachineMaster.Manufacturer = data[0].Product_Mfg_Comp_ID;
       this.GetManufacturer();
      console.log("this.editList  ===",this.editList);
  
  })
  }
  Delete(Mmaster){
    if (Mmaster.Product_ID) {
    this.productid = Mmaster.Product_ID;
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
    const Tempobj = {
      Product_ID  : this.productid
    }
    const obj = {
      "SP_String" : "SP_Engg_Nepal_Machine_Master",
      "Report_Name_String" : "Delete_Machine_Master_Data",
      "Json_Param_String" : JSON.stringify([Tempobj])
    }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
     // console.log(data);
      if(data[0].Column1 === "Done") {
        this.compacctToast.clear();
        this.compacctToast.add({
          key: "compacct-toast",
          severity: "success",
          summary: "Product ID : " + this.productid,
          detail:  "Succesfully Deleted"
        });
        this.GetBrowseList();
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
  onReject() {
    this.compacctToast.clear("c");
  }
}
class MachineMaster {
  Product_Model:string;
  Product_Description:string;
  Manufacturer:any;
}