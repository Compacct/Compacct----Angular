import { Component, OnInit, ViewEncapsulation, ViewChild } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { CompacctCommonApi } from "../../../../shared/compacct.services/common.api.service";
import { CompacctGlobalApiService } from '../../../../shared/compacct.services/compacct.global.api.service';
import { CompacctHeader } from "../../../../shared/compacct.services/common.header.service";
import { MessageService } from "primeng/api";

@Component({
  selector: 'app-engg-nepal-spare-parts',
  templateUrl: './engg-nepal-spare-parts.component.html',
  styleUrls: ['./engg-nepal-spare-parts.component.css'],
  providers: [MessageService],
  encapsulation: ViewEncapsulation.None
})
export class EnggNepalSparePartsComponent implements OnInit {
  tabIndexToView = 0;
  url = window["config"];
  persons: [];
  buttonname = "Save";
  Spinner = false;

  items = [];
  ProductSearchSubmitted = false;
  SPandIMasterFormSubmitted = false;

  ObjSPandIMaster = new SPandIMaster();
  //@ViewChild("fileInput", { static: false }) fileInput: FileUpload;

  MfCreateModal = false;
  spManufacturerName = undefined;
  spMfcreateFormSubmitted = false;
  SPGroupList = [];
  MfList = [];
  BrowseList = [];
  editList = [];
  sparepartid: any;

  ObjMachineMf = new MachineMf();
  MachineMfFormSubmit = false;
  MachineList = [];
  MachineMfadd = [];
  editprList = [];
  colum = [];

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
      Header: "Spare Parts And Ink Master",
      Link: " Material Management -> Master -> Spare Parts And Ink Master"
    });
     this.GetSparePartsGroup();
     this.GetManufacturer();
     this.GetBrowseList();
     //this.GetMachine();

     this.colum = [
      { field: 'Spare_Part_Model_No', header: 'Spare Part Model No' },
      { field: 'Spare_Part_Description', header: 'Spare Part Description' },
      { field: 'Product_Type', header: 'Spare Part Group' },
      { field: 'Mfg_Company', header: 'Spare Part Manufacturer' }
    ];
  }
  // Clear & Tab
  TabClick(e) {
    this.tabIndexToView = e.index;
    this.items = ["BROWSE", "CREATE"];
    this.buttonname = "Save";
    this.clearData();
    this.MachineMfadd = [];
    this.sparepartid = undefined;
  }
  clearData() {
    this.ProductSearchSubmitted = false;
    this.SPandIMasterFormSubmitted = false;
    this.Spinner = false;
    this.ObjSPandIMaster = new SPandIMaster();
    this.ObjMachineMf = new MachineMf();
    this.GetBrowseList();
    this.MachineList = [];
  }
  // Create Tab
  GetSparePartsGroup(){
    const obj = {
      "SP_String": "SP_Engg_Nepal_Machine_Master",
      "Report_Name_String": "Get_Product_Group"
     }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
     this.SPGroupList = data;
     console.log('SPGroupList ==', this.SPGroupList)
  
    });
  }
  ManufacturerPopup(){
    this.spManufacturerName = undefined;
    this.spMfcreateFormSubmitted = false;
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
    this.spMfcreateFormSubmitted = true;
      const Obj = {
        Mfg_Company : this.spManufacturerName
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
           this.spMfcreateFormSubmitted = false;
           this.spManufacturerName = undefined;
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
  GetMachine(){
    const TObj = {
      Product_Mfg_Comp_ID : this.ObjMachineMf.Machine_Manufacturer
    }
    const obj = {
      "SP_String": "SP_Engg_Nepal_Machine_Master",
      "Report_Name_String": "Get_Machine_Details",
      "Json_Param_String": JSON.stringify([TObj])
     }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
     this.MachineList = data;
     console.log('MachineList ==', this.MachineList)
  
    });
  }
  Add(valid){
    this.MachineMfFormSubmit = true;
 // if(this.ObjSaveForm.Material_Type === "Finished"){     // FINISHED PRODUCT ADD
  if(valid){
    var MM = this.MfList.find(item => item.Product_Mfg_Comp_ID == this.ObjMachineMf.Machine_Manufacturer);
    var MName = this.MachineList.find(item => item.Product_ID == this.ObjMachineMf.Machine);
    var productObj = {
    Machine_Manufacturer : this.ObjMachineMf.Machine_Manufacturer,
    MM_Name : MM.Mfg_Company,
    Machine : this.ObjMachineMf.Machine,
    MName : MName.Machine,
  };
  this.MachineMfadd.push(productObj);
  //console.log("Product Submit",this.productaddSubmit);
  this.MachineMfFormSubmit = false;
  this.ObjMachineMf = new MachineMf();
  this.MachineList = [];
  }
  }
  delete(index) {
    this.MachineMfadd.splice(index,1)

  }
  SaveMachineMaster(valid){
    if(valid && this.sparepartid){
      let tempArr =[]
    this.MachineMfadd.forEach(item => {
      const obj = {
          Spare_Part_ID : this.sparepartid,
          //Spare_Parts_Product_ID : this.sparepartid,
          Machine_Product_ID : Number(item.Machine)
      }
      tempArr.push(obj)
    });
    const Obj = {
        Spare_Part_ID : this.sparepartid,
        //Spare_Parts_Product_ID : this.sparepartid,
        Spare_Part_Model_No : this.ObjSPandIMaster.Spare_Parts_Model_No,
        Spare_Part_Description : this.ObjSPandIMaster.Spare_Parts_Description,
        Spare_Part_Group_ID : this.ObjSPandIMaster.Spare_Parts_Group,
        Spare_Part_Mfg_ID : this.ObjSPandIMaster.Spare_Parts_Manufacturer
    }
       const obj = {
         "SP_String": "SP_Engg_Nepal_Machine_Master",
         "Report_Name_String" : "Update_Master_Spare_Part",
         "Json_Param_String": JSON.stringify([Obj]),
         "Json_1_String": JSON.stringify(tempArr)
     
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
         this.MachineMfadd = [];
         this.sparepartid = undefined;
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
    this.SPandIMasterFormSubmitted = true;
    let tempArr =[]
    this.MachineMfadd.forEach(item => {
      const obj = {
          Machine_Product_ID : Number(item.Machine)
      }
      tempArr.push(obj)
    });
      const Obj = {
        Spare_Part_Model_No : this.ObjSPandIMaster.Spare_Parts_Model_No,
        Spare_Part_Description : this.ObjSPandIMaster.Spare_Parts_Description,
        Spare_Part_Group_ID : this.ObjSPandIMaster.Spare_Parts_Group,
        Spare_Part_Mfg_ID : this.ObjSPandIMaster.Spare_Parts_Manufacturer
      }
      if(valid){
         const obj = {
           "SP_String": "SP_Engg_Nepal_Machine_Master",
           "Report_Name_String" : "SAVE_Engg_Master_Spare_Part",
           "Json_Param_String": JSON.stringify([Obj]),
           "Json_1_String": JSON.stringify(tempArr)
       
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
           this.MachineMfadd = [];
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
      "Report_Name_String": "Browse_Master_Spare_Part"
     }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
     this.BrowseList = data;
     console.log('BrowseList ==', this.BrowseList)
  
    });
  }
  Edit(Mmaster){
    if (Mmaster.Spare_Part_ID) {
      this.sparepartid = Mmaster.Spare_Part_ID
      this.tabIndexToView = 1;
      this.items = ["BROWSE", "UPDATE"];
      this.buttonname = "Update";
      this.clearData();
      this.GetEditSparePart(this.sparepartid);
      this.GetEditProductRelation(this.sparepartid);
    }
  }
  GetEditSparePart(Mmaster){
    this.editList = [];
    this.editprList = [];
    //this.ProductionFormSubmitted = false;
    const obj = {
      "SP_String": "SP_Engg_Nepal_Machine_Master",
      "Report_Name_String": "Get_Master_Spare_Part_For_Edit",
      "Json_Param_String": JSON.stringify([{Spare_Part_ID  : this.sparepartid}])
  
    }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      this.editList = data;
      this.ObjSPandIMaster.Spare_Parts_Model_No = data[0].Spare_Part_Model_No;
      this.ObjSPandIMaster.Spare_Parts_Description = data[0].Spare_Part_Description;
      this.ObjSPandIMaster.Spare_Parts_Group = data[0].Spare_Part_Group_ID;
      this.GetSparePartsGroup();
      this.ObjSPandIMaster.Spare_Parts_Manufacturer = data[0].Spare_Part_Mfg_ID;
      this.GetManufacturer();
     console.log("this.editList  ===",this.editList);
  
  })
  }
  GetEditProductRelation(Mmaster){
    this.editprList = [];
    this.editList = [];
    //this.ProductionFormSubmitted = false;
    const obj = {
      "SP_String": "SP_Engg_Nepal_Machine_Master",
      "Report_Name_String": "Get_Master_Product_Relation_For_Edit",
      "Json_Param_String": JSON.stringify([{Spare_Part_ID  : this.sparepartid}])
  
    }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      this.editprList = data;
      this.editprList.forEach(element => {
        const  productObj = {
           Machine_Manufacturer : element.Product_Mfg_Comp_ID,
           MM_Name : element.Mfg_Company,
           Machine : element.Machine_Product_ID,
           MName : element.Machine,
         };
          this.MachineMfadd.push(productObj);
     });
     console.log("this.editprList  ===",this.editprList);
  
  })
  }
  Delete(Mmaster){
    if (Mmaster.Spare_Part_ID) {
    this.sparepartid = Mmaster.Spare_Part_ID;
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
      Spare_Part_ID  : this.sparepartid
    }
    const obj = {
      "SP_String" : "SP_Engg_Nepal_Machine_Master",
      "Report_Name_String" : "Delete_Master_Spare_Part",
      "Json_Param_String" : JSON.stringify([Tempobj])
    }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
     // console.log(data);
     var msg = data[0].Column1;
      if(data[0].Column1) {
        this.compacctToast.clear();
        this.compacctToast.add({
          key: "compacct-toast",
          severity: "success",
          summary: "Spare Part ID : " + this.sparepartid,
          detail:  msg
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
class SPandIMaster {
  Spare_Parts_Model_No:string;
  Spare_Parts_Description:string;
  Spare_Parts_Group:any;
  Spare_Parts_Manufacturer:any;
}
class MachineMf {
  Machine_Manufacturer:any;
  Machine:any;
}
