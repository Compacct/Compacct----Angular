import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MessageService } from "primeng/api";
import { CompacctHeader } from "../../../../shared/compacct.services/common.header.service";
import { HttpClient, HttpParams } from "@angular/common/http";
import { CompacctCommonApi } from "../../../../shared/compacct.services/common.api.service";
import { CompacctGlobalApiService } from '../../../../shared/compacct.services/compacct.global.api.service';

@Component({
  selector: 'app-k4c-master-bom-reciepe',
  templateUrl: './k4c-master-bom-reciepe.component.html',
  styleUrls: ['./k4c-master-bom-reciepe.component.css'],
  providers: [MessageService],
  encapsulation: ViewEncapsulation.None
})
export class K4cMasterBOMReciepeComponent implements OnInit {
  items = [];
  seachSpinner = false;
  Spinner = false;
  tabIndexToView = 0;
  buttonname = "Save";
  BomRecipeFormSubmitted = false;
  RawMaterialFormSubmitted = false;
  SemiFinishedSubmitted = false;
  ObjBrowse : Browse = new Browse ();
  SearchFormSubmitted = false;
  ObjBomReciepe : BomReciepe = new BomReciepe ();
  ObjRawMaterial : RawMaterial = new RawMaterial ();
  ObjSemiFinished : SemiFinished = new SemiFinished ();
  BrandList = [];
  typeofmateriallist = [];
  selectfinalmateriallist = [];
  rawmaterialprotypellist = [];
  semifishedprotypellist = [];
  getrawmaterialtabledata = [];
  getsemifinishedtabledata = [];
  tabIndexToView1 = 0;
  items1 = [];
  BrowseList = [];
  DistRMProductType = [];
  SelectedDistRMProductType = [];
  RMSearchFields = [];
  BackupRMSearchedlist = [];
  BackupSearchedlist = [];
  DistProductType = [];
  SelectedDistProductType = [];
  SearchFields = [];
  editList = [];
  editdisableflag = false;

  constructor(
    private Header: CompacctHeader,
    private $http : HttpClient,
    private compacctToast: MessageService,
    private GlobalAPI: CompacctGlobalApiService,
    public $CompacctAPI: CompacctCommonApi,
  ) { }

  ngOnInit() {
    this.items1 = ["BROWSE", "CREATE"];
    this.items = ["RAW MATERIALS", "SEMI FINISHED"];
    this.Header.pushHeader({
      Header: "Master BOM-Recipe",
      Link: "Material Management -> Production -> Master BOM-Recipe"
    });
    this.GetTypeofMaterial();
    this.GetBrand();
   // this.GetRawMaterialProType();
    //this.GetBrowseList();
    this.RawMaterialTableData();
    //this.SemiFinishedTableData();
  }
  TabClick1(e){
    //console.log(e)
    this.tabIndexToView1 = e.index;
    this.items1 = ["BROWSE", "CREATE"];
    //this.buttonname = "Save";
    this.clearData();
    this.clearRawQty();
    //this.RawMaterialTableData();
    this.SelectedDistRMProductType = [];
    this.getsemifinishedtabledata = [];
    this.DistProductType =[];
    this.SelectedDistProductType =[];
  }
  TabClick(e){
    //console.log(e)
    this.tabIndexToView = e.index;
    this.items = ["RAW MATERIALS", "SEMI FINISHED"];
    //this.buttonname = "Save";
    //this.clearData();

  }
  //onReject(){}
  clearRawQty(){
    this.getrawmaterialtabledata.forEach(element => {
      element.Qty = "";
    });
  }
  GetBrand(){
    const obj = {
      "SP_String": "SP_Master_BOM_Reciepe",
      "Report_Name_String": "Get - Brand"
    }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      this.BrandList = data;
      //this.Objproduction.Brand_ID = this.BrandList.length === 1 ? this.BrandList[0].Brand_ID : undefined;
       //console.log("Brand List ===",this.BrandList);
    })
  }
  GetTypeofMaterial(){
    const obj = {
      "SP_String": "SP_Master_BOM_Reciepe",
      "Report_Name_String": "GET_Type_Of_material"
    }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      this.typeofmateriallist = data;
      //this.Objproduction.Brand_ID = this.BrandList.length === 1 ? this.BrandList[0].Brand_ID : undefined;
       console.log("type of material List ===",this.typeofmateriallist);
    })
  }
  GetSelectFinalMaterial(){
    const tempObj = {
      Brand_ID : this.ObjBomReciepe.Brand_ID,
      Material_Type  : this.ObjBomReciepe.Type_of_Material,
      //Cost_Cent_ID : this.$CompacctAPI.CompacctCookies.Cost_Cen_ID
    }
    const obj = {
      "SP_String": "SP_Master_BOM_Reciepe",
      "Report_Name_String": "GET_Final_material",
      "Json_Param_String": JSON.stringify([tempObj])
    }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
    //  this.selectfinalmateriallist = data;
      if(data.length) {
        data.forEach(element => {
          element['label'] = element.Product_Description,
          element['value'] = element.Product_ID
        });
        this.selectfinalmateriallist = data;
      } else {
        this.selectfinalmateriallist = [];

      }
       console.log("select final material List ===",this.selectfinalmateriallist);
    })
  }
  ProductChange() {
  if(this.ObjBomReciepe.Product_ID) {
    const ctrl = this;
    const productObj = $.grep(ctrl.selectfinalmateriallist,function(item) {return item.Product_ID == ctrl.ObjBomReciepe.Product_ID})[0];
    //console.log(productObj);
    //this.ObjproductAdd.ID = productObj.ID;
    this.ObjBomReciepe.Select_Final_Material = productObj.Product_Description;
    this.ObjBomReciepe.Product_Type_ID = productObj.Product_Type_ID;
    this.ObjBomReciepe.Product_Type = productObj.Product_Type;
    this.ObjBomReciepe.Final_Material_UOM = productObj.UOM;
  }
  }
  // GetRawMaterialProType(){
  //   const tempObj = {
  //     Brand_ID : this.ObjBomReciepe.Brand_ID
  //     //Cost_Cent_ID : this.$CompacctAPI.CompacctCookies.Cost_Cen_ID
  //   }
  //   const obj = {
  //     "SP_String": "SP_Master_BOM_Reciepe",
  //     "Report_Name_String": "Get_Product_Type_List_Raw_Material",
  //     "Json_Param_String": JSON.stringify([tempObj])
  //   }
  //   this.GlobalAPI.getData(obj).subscribe((data:any)=>{
  //     this.rawmaterialprotypellist = data;
  //      console.log("raw material product List ===",this.rawmaterialprotypellist);
  //   })
  // }
  RawMaterialTableData(){
  //   const tempObj = {
  //     Product_Type_ID  : this.ObjRawMaterial.Product_Type
  //     //Cost_Cent_ID : this.$CompacctAPI.CompacctCookies.Cost_Cen_ID
  //   }
    const obj = {
      "SP_String": "SP_Master_BOM_Reciepe",
      "Report_Name_String": "GET_Raw_material_Product",
      //"Json_Param_String": JSON.stringify([tempObj])
    }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      this.getrawmaterialtabledata = data;
      this.BackupRMSearchedlist = data;
      this.GetDistinct();
       console.log("semi raw material table List ===",this.getrawmaterialtabledata);
    })
  }
  GetDistinct() {
    let DRMProductType = [];
    this.DistRMProductType =[];
    this.SelectedDistRMProductType =[];
    this.RMSearchFields =[];
    this.getrawmaterialtabledata.forEach((item) => {
   if (DRMProductType.indexOf(item.Product_Type_ID) === -1) {
    DRMProductType.push(item.Product_Type_ID);
   this.DistRMProductType.push({ label: item.Product_Type, value: item.Product_Type_ID });
   }
  });
     this.BackupRMSearchedlist = [...this.getrawmaterialtabledata];
  }
  FilterDist() {
    let DRMProductType = [];
    this.RMSearchFields =[];
  if (this.SelectedDistRMProductType.length) {
    this.RMSearchFields.push('Product_Type_ID');
    DRMProductType = this.SelectedDistRMProductType;
  }
  this.getrawmaterialtabledata = [];
  if (this.RMSearchFields.length) {
    let LeadArr = this.BackupRMSearchedlist.filter(function (e) {
      return (DRMProductType.length ? DRMProductType.includes(e['Product_Type_ID']) : true)
    });
  this.getrawmaterialtabledata = LeadArr.length ? LeadArr : [];
  } else {
  this.getrawmaterialtabledata = [...this.BackupRMSearchedlist] ;
  }
  }
  // GetSemiFinishedProType(){
  //   const tempObj = {
  //     Brand_ID : this.ObjBomReciepe.Brand_ID
  //     //Cost_Cent_ID : this.$CompacctAPI.CompacctCookies.Cost_Cen_ID
  //   }
  //   const obj = {
  //     "SP_String": "SP_Master_BOM_Reciepe",
  //     "Report_Name_String": "Get_Product_Type_List_Semi_Finished",
  //     "Json_Param_String": JSON.stringify([tempObj])
  //   }
  //   this.GlobalAPI.getData(obj).subscribe((data:any)=>{
  //     this.semifishedprotypellist = data;
  //      console.log("semi finished product List ===",this.semifishedprotypellist);
  //   })
  // }
  SemiFinishedTableData(){
    const tempObj = {
      Brand_ID : this.ObjBomReciepe.Brand_ID,
      //Product_Type_ID  : this.ObjSemiFinished.Product_Type
      //Cost_Cent_ID : this.$CompacctAPI.CompacctCookies.Cost_Cen_ID
    }
    const obj = {
      "SP_String": "SP_Master_BOM_Reciepe",
      "Report_Name_String": "GET_Semi_Finished_Product",
      "Json_Param_String": JSON.stringify([tempObj])
    }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      this.getsemifinishedtabledata = data;
      this.BackupSearchedlist = data;
      this.GetDistinctSF();
       console.log("semi finished table List ===",this.getsemifinishedtabledata);
    })
  }
  GetDistinctSF() {
    let DProductType = [];
    this.DistProductType =[];
    this.SelectedDistProductType =[];
    this.SearchFields =[];
    this.getsemifinishedtabledata.forEach((item) => {
  if (DProductType.indexOf(item.Product_Type_ID) === -1) {
    DProductType.push(item.Product_Type_ID);
    this.DistProductType.push({ label: item.Product_Type, value: item.Product_Type_ID });
    }
  });
     this.BackupSearchedlist = [...this.getsemifinishedtabledata];
  }
  FilterDistSF() {
    let DProcessName = [];
    let DProductType = [];
    let DShift = [];
    this.SearchFields =[];
  if (this.SelectedDistProductType.length) {
    this.SearchFields.push('Product_Type_ID');
    DProductType = this.SelectedDistProductType;
  }
  this.getsemifinishedtabledata = [];
  if (this.SearchFields.length) {
    let LeadArr = this.BackupSearchedlist.filter(function (e) {
      return (DProcessName.length ? DProcessName.includes(e['Process_ID']) : true)
      && (DProductType.length ? DProductType.includes(e['Product_Type_ID']) : true)
      && (DShift.length ? DShift.includes(e['Shift_ID']) : true)
    });
  this.getsemifinishedtabledata = LeadArr.length ? LeadArr : [];
  } else {
  this.getsemifinishedtabledata = [...this.BackupSearchedlist] ;
  }
  }
  // FOR SAVE
  DataForSaveBomRecipe(){
    if(this.BackupRMSearchedlist.length && this.BackupSearchedlist.length) {
      let tempArr =[];
      const TempObj = {
        Brand_ID : this.ObjBomReciepe.Brand_ID,
        Final_Product_Type_ID : this.ObjBomReciepe.Product_Type_ID,
        Final_Product_Type_Name : this.ObjBomReciepe.Product_Type,
        Final_Product_ID : this.ObjBomReciepe.Product_ID,
        Final_Product_Description : this.ObjBomReciepe.Select_Final_Material,
        Final_Product_UOM : "PCS",
        Final_Product_Qty : this.ObjBomReciepe.Final_Material_Qty,
      }
      this.BackupRMSearchedlist.forEach(item => {
        if(Number(item.Qty) && Number(item.Qty) != 0) {
          const rawmaterialobj = {
            // ID : item.ID,
             BOM_Product_Material_Type : "Raw Material",
             BOM_Product_Type_ID : item.Product_Type_ID,
             BOM_Product_Type_Name : item.Product_Type,
             BOM_Product_ID : item.Product_ID,
             BOM_Product_Description : item.Product_Description,
             BOM_Product_UOM : item.UOM,
             BOM_Product_Qty : Number(item.Qty),
         }

         tempArr.push({...rawmaterialobj,...TempObj})
        }

      });
      let Arrtemp = []
      this.BackupSearchedlist.forEach(item => {
        if(Number(item.Qty) && Number(item.Qty) != 0) {
          const finishedobj = {
            // ID : item.ID,
             BOM_Product_Material_Type : "Semi Finished",
             BOM_Product_Type_ID : item.Product_Type_ID,
             BOM_Product_Type_Name : item.Product_Type,
             BOM_Product_ID : item.Product_ID,
             BOM_Product_Description : item.Product_Description,
             BOM_Product_UOM : item.UOM,
             BOM_Product_Qty : Number(item.Qty),
         }
         Arrtemp.push({...finishedobj,...TempObj})
        }
      });
      console.log("Save Data ===", ...tempArr,...Arrtemp)
      return JSON.stringify([...tempArr,...Arrtemp]);

    }
  }
  SaveBomRecipe(valid){
    //console.log("valid",valid);
    this.BomRecipeFormSubmitted = true;
    // this.RawMaterialFormSubmitted = true;
    // this.SemiFinishedSubmitted = true;
    if(valid){
      const obj = {
        "SP_String": "SP_Master_BOM_Reciepe",
        "Report_Name_String" : "Save_Master_BOM_Reciepe",
       "Json_Param_String": this.DataForSaveBomRecipe()

      }
      this.GlobalAPI.postData(obj).subscribe((data:any)=>{
        //console.log(data);
        var tempID = data[0].Column1;
       // this.Objproduction.Doc_No = data[0].Column1;
        if(data[0].Column1){
          this.compacctToast.clear();
         // const mgs = this.buttonname === "Save" ? "Saved" : "Updated";
          this.compacctToast.add({
           key: "compacct-toast",
           severity: "success",
           summary: "BOM_Recipe  " ,//+ tempID,
           detail: "Succesfully Saved " //+ mgs
         });
        //  if (this.buttonname == "Save & Print") {
        //  this.saveNprintProVoucher();
        //  }
         this.clearData();
         this.clearRawQty();
         this.RawMaterialTableData();
         //this.tabIndexToView = 0;
         this.BomRecipeFormSubmitted = false;
         this.getsemifinishedtabledata = [];
         this.DistProductType =[];
         this.SelectedDistRMProductType = [];
         this.editdisableflag = false;
        //  this.RawMaterialFormSubmitted = false;
        //  this.SemiFinishedSubmitted = false;

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
  GetBrowseList(valid){
    this.SearchFormSubmitted = true;
    if(valid){
    const tempObj = {
      Brand_ID : this.ObjBrowse.Brand_ID ? this.ObjBrowse.Brand_ID : 0
      //Cost_Cent_ID : this.$CompacctAPI.CompacctCookies.Cost_Cen_ID
    }
    const obj = {
      "SP_String": "SP_Master_BOM_Reciepe",
      "Report_Name_String": "Browse_BOM",
      "Json_Param_String": JSON.stringify([tempObj])
    }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      this.BrowseList = data;
      //this.Objproduction.Brand_ID = this.BrandList.length === 1 ? this.BrandList[0].Brand_ID : undefined;
       console.log("Browse List ===",this.BrowseList);
       this.SearchFormSubmitted = false;
    })
    }
  }
  EditBomReciepe(Bom){
    // console.log("editmaster ==",DocNo);
  // this.AddProDetails = [];
   this.clearData();
   if(Bom){
  // this.ObjBomReciepe.Doc_No = DocNo.Doc_No;
   this.ObjBomReciepe.Brand_ID = Bom.Brand_ID;
   this.SemiFinishedTableData();
   this.ObjBomReciepe.Product_Type_ID = Bom.Final_Product_Type_ID;
   this.ObjBomReciepe.Product_ID = Bom.Final_Product_ID;
   this.ObjBomReciepe.Final_Material_Qty = Bom.Final_Product_Qty;
   this.ObjBomReciepe.Final_Material_UOM = Bom.Final_Product_UOM;
   this.items1 = ["BROWSE", "UPDATE"];
   this.buttonname = "Update";
   //this.TabClick(true);
   // console.log("this.EditDoc_No ==", this.Objproduction.Doc_No);
   const ctrl = this;
   setTimeout(function(){
    ctrl.GetEditBomReciepe();
    ctrl.editdisableflag = true;

   },600)
   //this.getadvorderdetails(this.Objcustomerdetail.Bill_No);
   }
  }
  GetEditBomReciepe(){
    //this.editList = [];
    //this.ProductionFormSubmitted = false;
    const tempObj = {
      Brand_ID : this.ObjBomReciepe.Brand_ID,
      Final_Product_Type_ID : this.ObjBomReciepe.Product_Type_ID,
      Final_Product_ID : this.ObjBomReciepe.Product_ID,
      Final_Product_Qty : this.ObjBomReciepe.Final_Material_Qty,
      Final_Product_UOM : this.ObjBomReciepe.Final_Material_UOM
    }
    const obj = {
      "SP_String": "SP_Master_BOM_Reciepe",
      "Report_Name_String": "Get_Edit_Data_Master_BOM_Reciepe",
      "Json_Param_String": JSON.stringify([tempObj])

    }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      this.editList = data;
      console.log("this.editList  ===",data);
      this.ObjBomReciepe.Brand_ID = data[0].Brand_ID;
      this.ObjBomReciepe.Product_Type_ID = data[0].Final_Product_Type_ID;
      this.ObjBomReciepe.Product_Type = data[0].Final_Product_Type_Name;
      this.ObjBomReciepe.Type_of_Material = data[0].Final_Material_Type;
      this.ObjBomReciepe.Product_ID = data[0].Final_Product_ID;
      this.ObjBomReciepe.Select_Final_Material = data[0].Final_Product_Description;
     // this.GetSelectFinalMaterial();
      // this.ObjBomReciepe.Product_ID = data[0].Final_Product_ID;
      // this.ObjBomReciepe.Select_Final_Material = data[0].Final_Product_Description;
      this.ObjBomReciepe.Final_Material_Qty = data[0].Final_Product_Qty;
      this.ObjBomReciepe.Final_Material_UOM = data[0].Final_Product_UOM;
      // this.editList.forEach(el =>{
      // //  const FMarr =  this.editList.filter(el=> el.Final_Product_ID === this.ObjBomReciepe.Product_ID);
      // //  if(FMarr.length){
      //   this.ObjBomReciepe.Product_ID = el.Final_Product_ID;
      //   this.ObjBomReciepe.Select_Final_Material = el.Final_Product_Description;
      //   // el['label'] = el.Final_Product_Description,
      //   // el['value'] = el.Final_Product_ID
      //   //}
      // })
      if(data[0]) {
        data[0]['label'] = data[0].Final_Product_Description,
        data[0]['value'] = data[0].Final_Product_ID
        this.selectfinalmateriallist = new Array(data[0]);
      } else {
        this.selectfinalmateriallist = [];

      }

        this.BackupRMSearchedlist.forEach(el =>{
          const aRR =  this.editList.filter(obj=> el.Product_ID === obj.BOM_Product_ID);
          if(aRR.length){
            el.Qty = aRR[0].BOM_Product_Qty;
          }
        });
        this.getrawmaterialtabledata = [...this.BackupRMSearchedlist];
        console.log("getrawmaterialtabledata===",this.getrawmaterialtabledata);

       // this.GetBrand();
       // this.SemiFinishedTableData();
        //this.ObjBomReciepe.Brand_ID = data[0].Brand_ID;
        const ctrl = this;
        setTimeout(function(){
          ctrl.BackupSearchedlist.forEach(elem =>{
            const arr =  ctrl.editList.filter(Obj=> elem.Product_ID === Obj.BOM_Product_ID);
            if(arr.length){
              elem['Qty'] = arr[0].BOM_Product_Qty;
            }
          })
          ctrl.getsemifinishedtabledata = [...ctrl.BackupSearchedlist];
          console.log("getsemifinishedtabledata===",ctrl.getsemifinishedtabledata);
          ctrl.tabIndexToView1 = 1;

         },600)

  })
  }
  // FOR UPDATE
  DataForUpdateBomRecipe(){
    if(this.ObjBomReciepe.Brand_ID &&
      this.ObjBomReciepe.Product_Type_ID &&
      this.ObjBomReciepe.Product_ID &&
      this.ObjBomReciepe.Final_Material_Qty &&
      this.ObjBomReciepe.Final_Material_UOM ) {
    if(this.BackupRMSearchedlist.length && this.BackupSearchedlist.length) {
      let tempArr =[];
      const TempObj = {
        Brand_ID : this.ObjBomReciepe.Brand_ID,
        Final_Product_Type_ID : this.ObjBomReciepe.Product_Type_ID,
        Final_Product_Type_Name : this.ObjBomReciepe.Product_Type,
        Final_Product_ID : this.ObjBomReciepe.Product_ID,
        Final_Product_Description : this.ObjBomReciepe.Select_Final_Material,
        Final_Product_UOM : "PCS",
        Final_Product_Qty : this.ObjBomReciepe.Final_Material_Qty,
      }
      this.BackupRMSearchedlist.forEach(item => {
        if(Number(item.Qty) && Number(item.Qty) != 0) {
          const rawmaterialobj = {
            // ID : item.ID,
             BOM_Product_Material_Type : "Raw Material",
             BOM_Product_Type_ID : item.Product_Type_ID,
             BOM_Product_Type_Name : item.Product_Type,
             BOM_Product_ID : item.Product_ID,
             BOM_Product_Description : item.Product_Description,
             BOM_Product_UOM : item.UOM,
             BOM_Product_Qty : Number(item.Qty),
         }

         tempArr.push({...rawmaterialobj,...TempObj})
        }

      });
      let Arrtemp = []
      this.BackupSearchedlist.forEach(item => {
        if(Number(item.Qty) && Number(item.Qty) != 0) {
          const finishedobj = {
            // ID : item.ID,
             BOM_Product_Material_Type : "Semi Finished",
             BOM_Product_Type_ID : item.Product_Type_ID,
             BOM_Product_Type_Name : item.Product_Type,
             BOM_Product_ID : item.Product_ID,
             BOM_Product_Description : item.Product_Description,
             BOM_Product_UOM : item.UOM,
             BOM_Product_Qty : Number(item.Qty),
         }
         Arrtemp.push({...finishedobj,...TempObj})
        }
      });
      console.log("Updated Data ===", ...tempArr,...Arrtemp)
      return JSON.stringify([...tempArr,...Arrtemp]);

    }
   }
  }
  UpdateBomRecipe(valid){
    //console.log("valid",valid);
    this.BomRecipeFormSubmitted = true;
    // this.RawMaterialFormSubmitted = true;
    // this.SemiFinishedSubmitted = true;
    if(valid){
      const obj = {
        "SP_String": "SP_Master_BOM_Reciepe",
        "Report_Name_String" : "Save_Master_BOM_Reciepe",
       "Json_Param_String": this.DataForUpdateBomRecipe()

      }
      this.GlobalAPI.postData(obj).subscribe((data:any)=>{
        //console.log(data);
        var tempID = data[0].Column1;
       // this.Objproduction.Doc_No = data[0].Column1;
        if(data[0].Column1){
          this.compacctToast.clear();
         // const mgs = this.buttonname === "Save" ? "Saved" : "Updated";
          this.compacctToast.add({
           key: "compacct-toast",
           severity: "success",
           summary: "BOM_Recipe  " ,//+ tempID,
           detail: "Succesfully Updated " //+ mgs
         });
        //  if (this.buttonname == "Save & Print") {
        //  this.saveNprintProVoucher();
        //  }
         this.clearData();
         this.clearRawQty();
         this.RawMaterialTableData();
         //this.tabIndexToView = 0;
         this.BomRecipeFormSubmitted = false;
         this.getsemifinishedtabledata = [];
         this.DistProductType =[];
         this.SelectedDistRMProductType = [];
         this.editdisableflag = false;
        //  this.RawMaterialFormSubmitted = false;
        //  this.SemiFinishedSubmitted = false;

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
  DeleteBom(Bom){
   // this.Objproduction.Doc_No = undefined ;
    if(Bom){
      this.ObjBomReciepe.Brand_ID = Bom.Brand_ID;
      this.ObjBomReciepe.Product_Type_ID = Bom.Final_Product_Type_ID;
      this.ObjBomReciepe.Product_ID = Bom.Final_Product_ID;
      this.ObjBomReciepe.Final_Material_Qty = Bom.Final_Product_Qty;
      this.ObjBomReciepe.Final_Material_UOM = Bom.Final_Product_UOM;
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
      Brand_ID : this.ObjBomReciepe.Brand_ID,
      Final_Product_Type_ID : this.ObjBomReciepe.Product_Type_ID,
      Final_Product_ID : this.ObjBomReciepe.Product_ID,
      Final_Product_Qty : this.ObjBomReciepe.Final_Material_Qty,
      Final_Product_UOM : this.ObjBomReciepe.Final_Material_UOM
    }
    const obj = {
      "SP_String" : "SP_Master_BOM_Reciepe",
      "Report_Name_String" : "Delete_Master_BOM_Reciepe",
      "Json_Param_String" : JSON.stringify([Tempobj])
    }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
     // console.log(data);
      if(data[0].Column1 === "Done") {
        this.compacctToast.clear();
        this.compacctToast.add({
          key: "compacct-toast",
          severity: "success",
          summary: "Bom_Reciepe",
          detail:  "Succesfully Deleted "
        });
        this.GetBrowseList(true);
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
  clearData(){
  //  this.ObjBrowse.Brand_ID = undefined;
    // this.ObjBomReciepe.Brand_ID = undefined;
    // this.ObjBomReciepe.Type_of_Material = undefined;
   // this.ObjBomReciepe.Select_Final_Material = undefined;
    this.ObjBomReciepe = new BomReciepe()
    this.selectfinalmateriallist = [];
   // this.ObjRawMaterial.Product_Type = undefined;
   // this.getrawmaterialtabledata = [];
   // this.ObjSemiFinished.Product_Type = undefined;
   // this.getsemifinishedtabledata = [];
   this.DistProductType =[];
   this.SelectedDistProductType =[];
   this.tabIndexToView = 0;
  // this.BrowseList = [];
  // this.RawMaterialTableData();
   this.items1 = ["BROWSE", "CREATE"];
   this.buttonname = "Save";
   this.editdisableflag = false;
  // this.TabClick(true);
  }

}

class Browse {
  Brand_ID : string;
}
class BomReciepe {
  Doc_No : string;
  Brand_ID : string;
  Product_Type_ID : number;
  Product_Type : string;
  Product_ID : string;
  Type_of_Material : string;
  Select_Final_Material : string;
  Final_Material_Qty : string;
  Final_Material_UOM : string;
}
class RawMaterial {
  Product_Type_ID : number;
  Product_Type : string;
}
class SemiFinished {
  Product_Type_ID : number;
  Product_Type : string;
}
