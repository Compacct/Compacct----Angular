import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CompacctHeader } from '../../../../shared/compacct.services/common.header.service';
import { MessageService } from 'primeng/api';
@Component({
  selector: 'app-master-royale-material-type',
  templateUrl: './master-royale-material-type.component.html',
  styleUrls: ['./master-royale-material-type.component.css'],
  providers: [MessageService]
})
export class MasterRoyaleMaterialTypeComponent implements OnInit {
  saveSpinner = false;
  buttonname = "Create";
  pmVal = false;

  MaterialTypeLists = [];
  MaterialTypOnlyLists = [];
  NewMaterialType : string;
  ObjMaterial = new Material();
  MaterialFormSubmitted = false;
  NewMaterialFormSubmitted = false;
  MaterialTypeID: any;

  constructor(  private $http: HttpClient,
    private Header: CompacctHeader,
    private compacctToast: MessageService) { }

  ngOnInit() {
    this.GetAllMaterialTypeLists();
  }



  GetAllMaterialTypeLists() {
    this.$http.get('/Master_Product_Material_Type/GetAllData').subscribe((data: any) => {
      this.MaterialTypeLists = data ? JSON.parse(data) : [];
      this.GetMaterial();
    });
 }

  GetMaterial () {
  this.$http.get('/Master_Product_Material_Type/Get_Material_Type_Only').subscribe((data: any) => {
    if (data) {
      const material = data ? JSON.parse(data) : [];
      console.log(material);
      // material.forEach(el => {
      //   this.MaterialTypOnlyLists.push({
      //     label: el.Txn_Type_Name,
      //     value: el.Bank_Txn_Type_ID
      //   });
      // });
    } else {
      this.MaterialTypOnlyLists = [];
    }
  });
 }


// CHANGE
AddMaterialType(){
  if(this.NewMaterialType){

  }
}

EditMaterialType(obj){
  if(obj.Ledger_ID){
    this.ClearData();
    this.ObjMaterial = obj;

    this.pmVal = obj.Use_In_PM === 'Y' ? true:false;
    this.buttonname = "Update";

  }
}
//  SAVE & UPDATE & CLEAR
SaveMaterialType(valid) {
  this.MaterialFormSubmitted = true;
  console.log(this.ObjMaterial);
  if (valid) {
       this.saveSpinner = true;
      this.ObjMaterial.Use_In_PM = this.pmVal ? 'Y' : 'N';
      const url = this.ObjMaterial.Master_Product_Material_Type_ID
        ? '/Master_Product_Material_Type/Update_Matser_Product_Material_Type_Ajax'
        : '/Master_Product_Material_Type/Create_Matser_Product_Material_Type_Ajax';

      this.$http.post(url, this.ObjMaterial).subscribe((data: any) => {
        if (data.success === true) {
          console.group("Compacct V2");
          console.log("%c Material Type Sucess:", "color:green;", data.Doc_No);
          console.log(url);
            this.compacctToast.clear();
            this.compacctToast.add({
              key: "compacct-toast",
              severity: "success",
              summary: data.Doc_No,
              detail: this.ObjMaterial.Master_Product_Material_Type_ID
                ? "Succesfully Updated"
                : "Succesfully Created"
            });
            this.GetAllMaterialTypeLists();
            this.ClearData();
        } else {
          this.compacctToast.clear();
          this.compacctToast.add({
            key: "compacct-toast",
            severity: "error",
            summary: "Warn Message",
            detail: "Error Occured "
          });
        }
        this.saveSpinner = false;
      });

    }
}
ClearData() {
  this.pmVal = false;
  this.buttonname = "Create";
  this.NewMaterialType = undefined;
  this.ObjMaterial = new Material();

  this.saveSpinner = false;
  this.MaterialFormSubmitted = false;
}

// DELETE
onConfirm() {
  if (this.MaterialTypeID) {
    this.$http
      .post('/Master_Product_Material_Type/Delete', { id: this.MaterialTypeID })
      .subscribe((data: any) => {
        if (data.success === true) {
          this.GetAllMaterialTypeLists();
          this.onReject();
          this.compacctToast.clear();
          this.compacctToast.add({
            key: "compacct-toast",
            severity: "success",
            summary: this.MaterialTypeID,
            detail: "Succesfully Deleted"
          });
        }
      });
  }
}
onReject() {
  this.compacctToast.clear("c");
}
DeleteMaterialType(obj) {
  this.MaterialTypeID = undefined;
  if (obj.Ledger_ID) {
    this.MaterialTypeID = obj.Master_Product_Material_Type_ID;
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
}
class Material{
  Master_Product_Material_Type_ID: string;
  Material_Type:string;
  Material_Sub_Type: string;
  Use_In_PM:string
}
