import { Component, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { CompacctCommonApi } from '../../../../shared/compacct.services/common.api.service';
import { CompacctHeader } from '../../../../shared/compacct.services/common.header.service';
import { MessageService } from 'primeng/api';
import { FileUpload } from 'primeng/primeng';
import { Routes, RouterModule, Router, ActivatedRoute } from '@angular/router';
import { CompacctGlobalApiService } from '../../../../shared/compacct.services/compacct.global.api.service';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-k4c-master-product',
  templateUrl: './k4c-master-product.component.html',
  providers: [MessageService],
  styleUrls: ['./k4c-master-product.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class K4cMasterProductComponent implements OnInit {
  tabIndexToView = 0;
  items = [];
  menuList = [];
  Spinner = false;
  row : boolean = false;
  disabled: boolean = true;
  disablesIndut : boolean = true;
  row_m = false ;
  producttypeList = [];
  productSubtypeList = [];
  mfgList = [];
  Param_Flag ='';
  uom_Flag = false;
  brandInput = false ;
  categoryList = [];
  sharemasterProduct = [];
  UOMList = [];
  brandIdSave:any;
  AllCostcenterList = [];
  rowDataList = [];
  BackupRowDataList = [];
  SelectedProductType: any = [];
  SelectedDept: any = [];
  productListFilter = [];
  deptlistFilter = [];
  brandList = [];
  brandBrowseList = [];
  costcenterList = [];
  costcenterTableData:any = [];
  masterProductId : number;
  componentDisplay: boolean = false;
  masterProductFormSubmitted = false;
  masterProductSearchSubmitted = false;
  costcenterFormSubmitted = false;
  DynamicHeader = [];
  buttonname = "Create";
  ObjmasterProduct: masterProduct = new masterProduct();
  ObjcostCenter: costCenter = new costCenter();
  Objbrand: brand = new brand();
  can_popup = false;
  act_popup = false;
  ParamFlaghtml = undefined;
  exceldisable = false;
  billableSaleable = "Enable Saleable Product"
  constructor( private $http: HttpClient ,
    private commonApi: CompacctCommonApi,
    private GlobalAPI: CompacctGlobalApiService,
    private Header: CompacctHeader ,
    private compacctToast: MessageService,
    private route: ActivatedRoute,
    private _router: Router) {
      this.route.queryParams.subscribe(params => {
         console.log(params);
        this.Param_Flag = params['Material_Type'];
         console.log ("Material_Type",this.Param_Flag);
        })

    }

  ngOnInit() {
    this.items = ["BROWSE", "CREATE"];
    this.menuList = [
      { label: "Edit", icon: "pi pi-fw pi-user-edit" },
      { label: "Delete", icon: "fa fa-fw fa-trash" }
    ];
    this.Header.pushHeader({
      Header: "Product Master - " + this.Param_Flag,
      Link: " Material Management -> Master -> Product Master "
    });

    if(this.Param_Flag === 'Raw Material'){
    this.getRowData();
    this.getProductTypeListRow(0);
    this.GetCostCenter();
    this.billableSaleable = "Enable Billable"

    }else if (this.Param_Flag === 'Semi Finished') {
      this.getBrand();
      this.GetCostCenter();

    } else if (this.Param_Flag === 'Finished') {
      this.getBrand();
    }
    else if(this.Param_Flag === 'Store Item - N/Saleable'){
      this.getBrand();
      this.getBandlist();
      //this.getRowData();
      this.getProductTypeListRow(0);
    }
    else if(this.Param_Flag === 'Store Item - Saleable'){
      this.getBandlist();
      this.getBrand();
      this.getProductTypeListRow(0);
      this.getBandlist();
    }
    else if(this.Param_Flag === 'Maintenance'){
      this.getBrand();
      this.getBandlist();
      //this.getRowData();
      // this.getProductTypeListRow(0);
    }
    this.getMfgData();
    this.getCategoryList();
    this.GetUOM();
   // this.getProductTypeListRow();
    // console.log("brand Id for page",this.ObjmasterProduct.Brand_ID);
  }
  Active(masterProduct,ParamFlag){
    this.can_popup = false;
    this.ParamFlaghtml = ParamFlag;
    this.masterProductId = undefined ;
     if(masterProduct.Product_ID){
      this.act_popup = true;
       this.masterProductId = masterProduct.Product_ID ;
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
  onConfirm2(){
    console.log("ParamFlaghtml",this.ParamFlaghtml);
    console.log(this.ObjmasterProduct.Product_ID)
      if(this.masterProductId){
        const obj = {
          "SP_String": "SP_Controller_Master",
          "Report_Name_String": "Active Product",
          "Json_Param_String": JSON.stringify([{Product_ID : this.masterProductId}])
        }
        this.GlobalAPI.getData(obj).subscribe((data:any)=>{
          // console.log("del Data===", data[0].Column1)
          if (data[0].Column1 === "done"){
          
          
            if(this.ParamFlaghtml === "Raw Material"){
              this.getRowData();
            }
            else {
            this.getBandlist();
            }
            this.onReject();
            this.act_popup = false;
            this.compacctToast.clear();
            this.compacctToast.add({
              key: "compacct-toast",
              severity: "success",
              summary: "Product Id: " + this.masterProductId.toString(),
              detail: "Succesfully Activated"
            });


          }
        })
      }
      //this.ParamFlaghtml = undefined;
  }
 onConfirm(){
    console.log("ParamFlaghtml",this.ParamFlaghtml);
    console.log(this.ObjmasterProduct.Product_ID)
      if(this.masterProductId){
        const obj = {
          "SP_String": "SP_Controller_Master",
          "Report_Name_String": "Delete Product",
          "Json_Param_String": JSON.stringify([{Product_ID : this.masterProductId}])
        }
        this.GlobalAPI.getData(obj).subscribe((data:any)=>{
          // console.log("del Data===", data[0].Column1)
          if (data[0].Column1 === "done"){
          
            if(this.ParamFlaghtml === "Raw Material"){
              this.getRowData();
            }
            else {
            this.getBandlist();
            }
            this.onReject();
           this.can_popup = false;
            this.compacctToast.clear();
            this.compacctToast.add({
              key: "compacct-toast",
              severity: "success",
              summary: "Product Id: " + this.masterProductId.toString(),
              detail: "Succesfully Deleted"
            });


          }
        })
      }
     // this.ParamFlaghtml = undefined;
  }
  onReject() {
    this.compacctToast.clear("c");
  }

  TabClick(e) {
    this.tabIndexToView = e.index;
    this.brandInput = false ;
    this.items = ["BROWSE", "CREATE"];
    this.buttonname = "Create";

    this.clearData();
    this.masterProductFormSubmitted = false;
    // console.log("tabclick",this.ObjmasterProduct);
    this.costcenterTableData = [];
  }
  clearData(){
  //  console.log("clearData")

   this.ObjmasterProduct = new masterProduct();
  // this.Objbrand = new brand();
  // this.ObjmasterProduct.Brand_ID = this.brandIdSave;
  // this.ObjmasterProduct.Brand_ID = undefined;
   console.log(this.ObjmasterProduct.Brand_ID);
   this.ObjmasterProduct.UOM = this.UOMList.length === 1 ? this.UOMList[0].UOM : undefined;
   this.ObjmasterProduct.Alt_UOM = this.UOMList.length === 1 ? this.UOMList[0].UOM : undefined;
   
   //this.masterProductFormSubmitted = false;
  // this.ParamFlaghtml = undefined; 
  }
  SaveProductMaster(valid){
      this.masterProductFormSubmitted = true;
      console.log(valid)
       if(valid){
        this.ObjmasterProduct.Brand_ID = this.ObjmasterProduct.Brand_ID ? this.ObjmasterProduct.Brand_ID : 0;
        this.ObjmasterProduct.Cess_Percentage = this.ObjmasterProduct.Cess_Percentage ? this.ObjmasterProduct.Cess_Percentage : 0;
        this.Spinner = true;
        if(this.ObjmasterProduct.Product_ID){
          
          console.log(this.ObjmasterProduct);
          if (this.Param_Flag === 'Raw Material') {
             var TempId = this.ObjmasterProduct.Product_ID;
             this.ObjmasterProduct.Billable = this.ObjmasterProduct.Saleable_Product;
            const obj = {
              "SP_String": "SP_Controller_Master",
              "Report_Name_String": "Update Raw Material Product",
              "Json_Param_String": JSON.stringify([this.ObjmasterProduct])
            }

            this.GlobalAPI.getData(obj).subscribe((data:any)=>{
              // console.log("del Data===", data[0].Column1)
              console.log("this.ObjmasterProduct.Product_ID",this.ObjmasterProduct.Product_ID);
              console.log("TempId",TempId );
              if (data[0].Column1 === "done"){
                this.saveCost(this.ObjmasterProduct.Product_ID);
                 this.compacctToast.clear();
                this.compacctToast.add({
                  key: "compacct-toast",
                  severity: "success",
                  summary: "Product Id: " + TempId,
                  detail: "Succesfully Updated"
                });
                }
                this.Spinner = false;
                this.getRowData();
            })
            this.tabIndexToView = 0;
            this.items = ["BROWSE", "CREATE"];
            this.buttonname = "Create";
          }
          else if (this.Param_Flag === "Semi Finished"){
            const obj = {
              "SP_String": "SP_Controller_Master",
              "Report_Name_String":"Update Semi Finished Product",
              "Json_Param_String": JSON.stringify([this.ObjmasterProduct])
            }
            this.GlobalAPI.getData(obj).subscribe((data:any)=>{
              //  console.log("del Data===", data)
              if (data[0].Column1 === "done"){
                this.saveCost(this.ObjmasterProduct.Product_ID);
                this.compacctToast.clear();
                this.compacctToast.add({
                  key: "compacct-toast",
                  severity: "success",
                  summary: "Product Id: " + TempId ,
                  detail: "Succesfully Updated"
                });
                }
                this.Spinner = false;
                this.getBandlist();
            })
            this.tabIndexToView = 0;
            this.items = ["BROWSE", "CREATE"];
            this.buttonname = "Create";
          }
         else if (this.Param_Flag === "Finished") {
          const obj = {
            "SP_String": "SP_Controller_Master",
            "Report_Name_String": "Update Finished Product",
            "Json_Param_String": JSON.stringify([this.ObjmasterProduct])
          }
          this.GlobalAPI.getData(obj).subscribe((data:any)=>{
            // console.log("del Data===", data[0].Column1)
            if (data[0].Column1 === "done"){
             this.compacctToast.clear();
              this.compacctToast.add({
                key: "compacct-toast",
                severity: "success",
                summary: "Product Id: " + TempId ,
                detail: "Succesfully Updated"
              });
              }
              this.Spinner = false;
              this.getBandlist();
          })
          this.tabIndexToView = 0;
          this.items = ["BROWSE", "CREATE"];
          this.buttonname = "Create";
        }
        else if (this.Param_Flag === "Store Item - N/Saleable"){
          const obj = {
            "SP_String": "SP_Controller_Master",
            "Report_Name_String": "Update Store Item Product",
            "Json_Param_String": JSON.stringify([this.ObjmasterProduct])
          }
          this.GlobalAPI.getData(obj).subscribe((data:any)=>{
            // console.log("del Data===", data[0].Column1)
            if (data[0].Column1 === "done"){
             this.compacctToast.clear();
              this.compacctToast.add({
                key: "compacct-toast",
                severity: "success",
                summary: "Product Id: " + TempId ,
                detail: "Succesfully Updated"
              });
              this.Spinner = false;
              //this.getRowData();
              this.getBandlist();
              }
          })
          this.tabIndexToView = 0;
          this.items = ["BROWSE", "CREATE"];
          this.buttonname = "Create";
        }
        else if (this.Param_Flag === "Store Item - Saleable"){
          const obj = {
            "SP_String": "SP_Controller_Master",
            "Report_Name_String": "Update Store Item - Saleable Product",
            "Json_Param_String": JSON.stringify([this.ObjmasterProduct])
          }
          this.GlobalAPI.getData(obj).subscribe((data:any)=>{
            // console.log("del Data===", data[0].Column1)
            if (data[0].Column1 === "done"){
             this.compacctToast.clear();
              this.compacctToast.add({
                key: "compacct-toast",
                severity: "success",
                summary: "Product Id: " + TempId ,
                detail: "Succesfully Updated"
              });
              this.Spinner = false;
              this.getBandlist();
              }
          })
          this.tabIndexToView = 0;
          this.items = ["BROWSE", "CREATE"];
          this.buttonname = "Create";
        }
        else if (this.Param_Flag === "Maintenance"){
          const obj = {
            "SP_String": "SP_Controller_Master",
            "Report_Name_String": "Update Maintenance Product",
            "Json_Param_String": JSON.stringify([this.ObjmasterProduct])
          }
          this.GlobalAPI.getData(obj).subscribe((data:any)=>{
            // console.log("del Data===", data[0].Column1)
            if (data[0].Column1 === "done"){
             this.compacctToast.clear();
              this.compacctToast.add({
                key: "compacct-toast",
                severity: "success",
                summary: "Product Id: " + TempId ,
                detail: "Succesfully Updated"
              });
              this.Spinner = false;
              //this.getRowData();
              this.getBandlist();
              }
          })
          this.tabIndexToView = 0;
          this.items = ["BROWSE", "CREATE"];
          this.buttonname = "Create";
        }
        else {
          this.compacctToast.clear();
          this.compacctToast.add({
            key: "compacct-toast",
            severity: "error",
            summary: "Warn Message",
            detail: "Error Occured "
          });
        }
        this.masterProductFormSubmitted = false;
        }
        else {
         // console.log("fire")
          if (this.Param_Flag === 'Raw Material'){
           this.ObjmasterProduct.Billable = this.ObjmasterProduct.Saleable_Product;
            const obj = {
              "SP_String": "SP_Controller_Master",
              "Report_Name_String": "Add Raw Material Product",
              "Json_Param_String": JSON.stringify([this.ObjmasterProduct])
            }
            this.GlobalAPI.postData(obj).subscribe((data:any)=>{
             console.log("del Data===", data[0].Column1)
              if (data[0].Column1){
                 this.saveCost(data[0].Column1);
                 this.compacctToast.clear();
                this.compacctToast.add({
                  key: "compacct-toast",
                  severity: "success",
                  summary: "Product Added",
                  detail: "Succesfully Created"
        });
                }
                this.Spinner = false;
                this.getRowData();
            })
          }
          else if(this.Param_Flag === 'Semi Finished'){
            const obj = {
              "SP_String": "SP_Controller_Master",
              "Report_Name_String": "Add Semi Finished Product",
              "Json_Param_String": JSON.stringify([this.ObjmasterProduct])
            }
            this.GlobalAPI.postData(obj).subscribe((data:any)=>{
             console.log("del Data===", data[0].Column1)
              if (data[0].Column1){
                this.saveCost(data[0].Column1);
                this.compacctToast.clear();
              this.compacctToast.add({
                key: "compacct-toast",
                severity: "success",
                summary: "Product Added",
                detail: "Succesfully Created"
              });
                }
                this.Spinner = false;
                this.getBandlist();
            })
          }
          else if (this.Param_Flag === 'Finished'){
            const obj = {
              "SP_String": "SP_Controller_Master",
              "Report_Name_String": "Add Finished Product",
              "Json_Param_String": JSON.stringify([this.ObjmasterProduct])
            }
            this.GlobalAPI.postData(obj).subscribe((data:any)=>{
             console.log("del Data===", data[0].Column1)
              if (data[0].Column1){
                 this.compacctToast.clear();
                this.compacctToast.add({
                  key: "compacct-toast",
                  severity: "success",
                  summary: "Product Added",
                  detail: "Succesfully Created"
                });
                }
                this.Spinner = false;
                this.getBandlist();
            })
          }
          else if (this.Param_Flag === "Store Item - N/Saleable"){
            const obj = {
              "SP_String": "SP_Controller_Master",
              "Report_Name_String": "Add Store Item Product",
              "Json_Param_String": JSON.stringify([this.ObjmasterProduct])
            }
            this.GlobalAPI.postData(obj).subscribe((data:any)=>{
             console.log("del Data===", data[0].Column1)
              if (data[0].Column1){
                 this.compacctToast.clear();
                this.compacctToast.add({
                  key: "compacct-toast",
                  severity: "success",
                  summary: "Product Added",
                  detail: "Succesfully Created"
                });
                }
                this.Spinner = false;
                // this.getRowData();
                this.getBandlist();
            })
          }
          else if (this.Param_Flag === "Store Item - Saleable"){
            const obj = {
              "SP_String": "SP_Controller_Master",
              "Report_Name_String": "Add Store Item - Saleable Product",
              "Json_Param_String": JSON.stringify([this.ObjmasterProduct])
            }
            this.GlobalAPI.postData(obj).subscribe((data:any)=>{
             console.log("del Data===", data[0].Column1)
              if (data[0].Column1){
                 this.compacctToast.clear();
                this.compacctToast.add({
                  key: "compacct-toast",
                  severity: "success",
                  summary: "Product Added",
                  detail: "Succesfully Created"
                });
                }
                this.Spinner = false;
                this.getBandlist();
            })
          }
          else if (this.Param_Flag === "Maintenance"){
            const obj = {
              "SP_String": "SP_Controller_Master",
              "Report_Name_String": "Add Maintenance Product",
              "Json_Param_String": JSON.stringify([this.ObjmasterProduct])
            }
            this.GlobalAPI.postData(obj).subscribe((data:any)=>{
             console.log("del Data===", data[0].Column1)
              if (data[0].Column1){
                 this.compacctToast.clear();
                this.compacctToast.add({
                  key: "compacct-toast",
                  severity: "success",
                  summary: "Product Added",
                  detail: "Succesfully Created"
                });
                }
                this.Spinner = false;
                // this.getRowData();
                this.getBandlist();
            })
          }
          else {
            this.compacctToast.clear();
           this.compacctToast.add({
            key: "compacct-toast",
            severity: "error",
            summary: "Warn Message",
            detail: "Error Occured "
          });
          }

          this.masterProductFormSubmitted = false;
        }
      }

    this.clearData();

  }
  editmaster(masterProduct){
    this.ObjmasterProduct.Product_ID = undefined;
      this.clearData();
      if(masterProduct.Product_ID){
      this.tabIndexToView = 1;
      this.items = ["BROWSE", "UPDATE"];
      this.buttonname = "Update";
      this.brandInput = true;
      this.geteditmaster(masterProduct.Product_ID);
      this.editCostcenter(masterProduct.Product_ID);
      }
  }
  geteditmaster(product_id){
    // console.log(product_id)
    const tempObj = {
      Product_ID : product_id
    }
    const obj = {
      "SP_String": "SP_Controller_Master",
      "Report_Name_String": "Get Product",
      "Json_Param_String": JSON.stringify([tempObj])
    }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      //  console.log("editDataList data  ===",data);
      const editDataList = data[0];
      this.ObjmasterProduct = editDataList;
      this.ProductTypeChange(editDataList.Product_Type_ID);
      this.ObjmasterProduct.Product_Sub_Type_ID = editDataList.Product_Sub_Type_ID;
      console.log("ObjmasterProduct ===",this.ObjmasterProduct);
       this.ObjmasterProduct.Product_ID = product_id;
       if (this.Param_Flag === 'Store Item - Saleable' || this.Param_Flag === 'Store Item - N/Saleable') {
       this.ObjmasterProduct.Brand_ID = editDataList.Brand_ID === 0 ? undefined : editDataList.Brand_ID;
       this.brandInput = false;
       }
       if (this.Param_Flag === 'Raw Material') {
        this.ObjmasterProduct.Saleable_Product = data[0].Billable;
       }
       console.log("this.ObjmasterProduct.Product_ID",this.ObjmasterProduct.Product_ID);
      
    })

  }
  getCategoryList(){
    const obj = {
      "SP_String": "SP_Controller_Master",
      "Report_Name_String": "Get - Product Master Category List",

    }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      console.log("Category ===",data);
      this.categoryList = data;
    })
  }
  getRowData(){
    // const TempReportName = this.Param_Flag === 'Store Item - N/Saleable' ? "Browse - Store Item Product Master" : "Browse - Raw Material Product Master";
    const TempReportName = "Browse - Raw Material Product Master";
    console.log("Browse API",TempReportName);
    const obj = {
      "SP_String": "SP_Controller_Master",
      "Report_Name_String": TempReportName

    }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      // console.log("row  ===",data);
      this.DynamicHeader = Object.keys(data[0]);
      this.rowDataList = data;
      this.BackupRowDataList = data;
      this.filterProduct();
      console.log("this.DynamicHeader",this.DynamicHeader)
    })
  }
  exportoexcel(Arr,fileName): void {
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(Arr);
    const workbook: XLSX.WorkBook = {Sheets: {'data': worksheet}, SheetNames: ['data']};
    XLSX.writeFile(workbook, fileName+'.xlsx');
  }
 getProductTypeListRow(id){
  this.productListFilter = [];
  let ReportName = "";
  //  console.log("Brand Id", id)
  this.SelectedProductType = [];
  console.log("this.Param_Flag",this.Param_Flag);
  //ReportName = this.Param_Flag === 'Raw Material' ? "Get - Product Type List Raw Material" : 'Semi Finished' ? "Get - Product Type List Semi Finished" : "Get - Product Type List Finished";
  if(this.Param_Flag === 'Raw Material')
  { ReportName = "Get - Product Type List Raw Material" }
  else if (this.Param_Flag === 'Semi Finished')
  {ReportName = "Get - Product Type List Semi Finished"}
  else if (this.Param_Flag === 'Finished')
  {ReportName = "Get - Product Type List Finished"}
  else if(this.Param_Flag === 'Store Item - N/Saleable' || this.Param_Flag === 'Store Item - Saleable')
  {ReportName = "Get - Product Type List Store Item"}
  else if(this.Param_Flag === 'Maintenance')
  {ReportName = "Get - Product Type List Maintenance"}
  console.log(ReportName);
  const obj = {
      "SP_String": "SP_Controller_Master",
      // "Report_Name_String": "Get - Product Type List Raw Material",
      "Report_Name_String": ReportName,
      "Json_Param_String": JSON.stringify([{Brand_ID : id}])

    }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      console.log("ProductList  ===",data);
      this.producttypeList = data;
      this.producttypeList.forEach(el => {
        this.SelectedProductType.push(el.Product_Type);
        this.productListFilter.push(
          {
            label: el.Product_Type,
            value: el.Product_Type
          }
        )
      })
      // console.log("Product_Type_ID ===",this.producttypeList[0].Product_Type_ID);
      // this.getProductSubTypeList(this.producttypeList[0].Product_Type_ID);
    })
  }
  async ProductTypeChange(product_id) {
    // console.log(product_id);
    // console.log('fired');
    await this.getProductSubTypeList(product_id).then(response => {
      this.productSubtypeList = response;
    });
  }
  async getProductSubTypeList(product_id){
    const obj = {
      "SP_String": "SP_Controller_Master",
      "Report_Name_String": "Get - Product Sub Type List",
      "Json_Param_String": JSON.stringify([{Product_Type_ID : product_id}])
    }
     const response = await this.GlobalAPI.getData(obj).toPromise();
    return response;

  }

  getMfgData(){
    const obj = {
      "SP_String": "SP_Controller_Master",
      "Report_Name_String": "Get - Product Mfg List",

    }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      // console.log("mfgList  ===",data);
      this.mfgList = data;
    })
  }

  alt_uomChange(){
     console.log("this.ObjmasterProduct.UOM",this.ObjmasterProduct.UOM);
     console.log("this.ObjmasterProduct.Alt_UOM",this.ObjmasterProduct.Alt_UOM);
    if(this.ObjmasterProduct.UOM.toUpperCase() === this.ObjmasterProduct.Alt_UOM.toUpperCase()){
      this.ObjmasterProduct.ALT_UOM_Qty = 1 ;
      this.ObjmasterProduct.UOM_Qty = 1 ;

      this.disablesIndut = true ;
    }
    else {
      this.ObjmasterProduct.UOM_Qty = 1 ;
      this.ObjmasterProduct.ALT_UOM_Qty = "" ;
      this.disablesIndut = false ;
      this.uom_Flag = true ;
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
  getBandlist(){
    this.DynamicHeader = [];
    this.rowDataList = [];
    this.BackupRowDataList = [];
    
      if (this.Param_Flag === 'Store Item - Saleable' || this.Param_Flag === 'Store Item - N/Saleable') {
        const ReportName = this.Param_Flag === 'Store Item - N/Saleable' ? "Browse - Store Item Product Master" : "Browse - Store Item Saleable Product Master";
        const obj = {
          "SP_String": "SP_Controller_Master",
          "Report_Name_String": ReportName,
          "Json_Param_String": JSON.stringify([{Brand_ID : this.Objbrand.Brand_ID ? this.Objbrand.Brand_ID : 0}])
    
        }
        this.GlobalAPI.getData(obj).subscribe((data:any)=>{
          // console.log("row  ===",data);
          this.DynamicHeader = Object.keys(data[0]);
          this.rowDataList = data;
          this.BackupRowDataList = data;
          this.brandIdSave = this.Objbrand.Brand_ID;
          this.getProductTypeListRow(this.Objbrand.Brand_ID);
          this.filterProduct();
          console.log("this.DynamicHeader",this.DynamicHeader);
          console.log("this.rowDataList",this.rowDataList);
        })
      }
      else if (this.Param_Flag === 'Maintenance') {
        const obj = {
          "SP_String": "SP_Controller_Master",
          "Report_Name_String": "Browse - Maintenance Product Master",
          "Json_Param_String": JSON.stringify([{Brand_ID : this.Objbrand.Brand_ID ? this.Objbrand.Brand_ID : 0}])
    
        }
        this.GlobalAPI.getData(obj).subscribe((data:any)=>{
          // console.log("row  ===",data);
          this.DynamicHeader = data.length ? Object.keys(data[0]) : [];
          this.rowDataList = data;
          this.BackupRowDataList = data;
          this.brandIdSave = this.Objbrand.Brand_ID;
          this.getProductTypeListRow(this.Objbrand.Brand_ID);
          this.filterProduct();
          console.log("this.DynamicHeader",this.DynamicHeader);
          console.log("this.rowDataList",this.rowDataList);
        })
      }
       else {
      const ReportName = this.Param_Flag === 'Finished' ? "Browse - Finished Product Master" : "Browse - Semi Finished Product Master";

      const obj = {
        "SP_String": "SP_Controller_Master",
        "Report_Name_String": ReportName,
        "Json_Param_String": JSON.stringify([{Brand_ID : this.Objbrand.Brand_ID}])
      }
      this.GlobalAPI.getData(obj).subscribe((data:any)=>{
        this.DynamicHeader = Object.keys(data[0]);
        // console.log("brandBrowseList  ===",data);
        this.rowDataList = data;
        this.BackupRowDataList = data;
        this.brandIdSave = this.Objbrand.Brand_ID;
        this.getProductTypeListRow(this.Objbrand.Brand_ID);
       // console.log(this.rowDataList);
        this.filterProduct();

      })
    }
    

  }
  delectMaster(masterProduct,ParamFlag){
    // console.log("delect masterProduct ===",masterProduct)
     this.act_popup = false;
     this.masterProductId = undefined ;
     if(masterProduct.Product_ID){
      this.ParamFlaghtml = ParamFlag;
      this.can_popup = true;
       this.masterProductId = masterProduct.Product_ID ;
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
  GetUOM(){
    const obj = {
      "SP_String": "SP_Controller_Master",
      "Report_Name_String": "Get - UOM",
    }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
       console.log("UOMList  ===",data);
      this.UOMList = data;
    })
  }
  filterProduct(){
    console.log("SelectedProductType",this.SelectedProductType);
    if(this.SelectedProductType.length){
      let tempProduct = [];
      this.SelectedProductType.forEach(item => {
        this.BackupRowDataList.forEach((el,i)=>{

          const ProductObj = this.BackupRowDataList.filter((elem) => elem.Product_Type == item)[i];
          //const ProductObj = el;
          //console.log("ProductObj",ProductObj);
          if(ProductObj)
          tempProduct.push(ProductObj)


        })
        })

    this.rowDataList  = [...tempProduct];
    console.log("if.rowDataList",this.rowDataList)
    }else {

      this.rowDataList  = [...this.BackupRowDataList];
      console.log("else.rowDataList",this.rowDataList);
    }

  }
  onFilterChange(eve: any) {
    console.log("event",eve);
    console.log("Product_Expiry",this.ObjmasterProduct.Product_Expiry);
  }
  GetCostCenter(){
    const obj = {
      "SP_String": "SP_Controller_Master",
      "Report_Name_String": "Get - Cost Center Name Material Management",
    }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
       console.log("costcenterList  ===",data);
      this.costcenterList = data;
    })
  }
  GetDept(id){
    this.deptlistFilter = [];
    this.SelectedDept = [];
    console.log("Cost_Cen_ID",id);
    const obj = {
      "SP_String": "SP_Controller_Master",
      "Report_Name_String": "Get - Godown Name Name Material Management",
      "Json_Param_String": JSON.stringify([{Cost_Cen_ID : id}])
    }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
       console.log("Dept  ===",data);
      const tempdept = data;
       tempdept.forEach(el => {
       this.deptlistFilter.push(
          {
            label: el.godown_name,
            value: el.godown_id
          }
        )
      })
    })
  }

  saveCost(product_id){
    let saveData = [];
    console.log("save table",this.costcenterTableData);
    if(this.costcenterTableData.length){
      this.costcenterTableData.forEach(ele => {
        let tempsave = {
          Product_ID : product_id,
          Cost_Cent_ID : ele.Cost_Cen_ID,
          Godown_ID : ele.Godown_ID
        }
        saveData.push(tempsave);
      });
      console.log("saveData",saveData);
      const obj = {
        "SP_String": "SP_Controller_Master",
        "Report_Name_String": "Create Update Product Wise Godown",
        "Json_Param_String": JSON.stringify(saveData)
      }
      this.GlobalAPI.postData(obj).subscribe((data:any)=>{
      console.log("saveData",data);
      if(data[0].Column1 === "done"){
        this.costcenterTableData = [];
        this.SelectedDept = [];
        this.ObjcostCenter.costcenterId = undefined;
      }
    
      })
    }
    
  }
  SavetablecostCenter(valid){
    this.costcenterFormSubmitted = true;
    let tablecheck  = [];
    console.log("add table",this.costcenterTableData);
    if(valid){
      this.SelectedDept.forEach(ele => {
         tablecheck = this.costcenterTableData.filter(item=> Number(item.Cost_Cen_ID) === Number(this.ObjcostCenter.costcenterId) && Number(item.Godown_ID) === Number(ele));
      })
     if(!tablecheck.length){
      const sameproduct = this.costcenterList.filter(item=> Number(item.Cost_Cen_ID) === Number(this.ObjcostCenter.costcenterId));
      console.log("sameproduct",sameproduct);
      console.log("SelectedDept",this.SelectedDept);
      this.SelectedDept.forEach(ele => {
        const samego = this.deptlistFilter.filter(item=> Number(item.value) === Number(ele));
        if(samego.length){
          const productObj = {
            Cost_Cen_ID : sameproduct[0].Cost_Cen_ID,
            Cost_Cen_Name : sameproduct[0].Cost_Cen_Name,
            Godown_ID : samego[0].value,
            Godown_Name : samego[0].label,
           };
           this.costcenterTableData.push(productObj);
        }
   
      });
      this.costcenterFormSubmitted = false;
     }
     else{
      this.compacctToast.clear();
        this.compacctToast.add({
          key: "compacct-toast",
          severity: "error",
          summary: "Warn Message",
          detail: "already add"
        });
     }
    }
    
    console.log("costcenterTableData",this.costcenterTableData);
    this.SelectedDept = [];
    this.ObjcostCenter.costcenterId = undefined;
  }
  delete(index) {
    this.costcenterTableData.splice(index,1)
  }
  editCostcenter(id){
    this.costcenterTableData = [];
    let temparr = {}
    const obj = {
      "SP_String": "SP_Controller_Master",
      "Report_Name_String": "Get Product Wise Godown",
      "Json_Param_String": JSON.stringify([{Product_ID : id}])
    }
    this.GlobalAPI.postData(obj).subscribe((data:any)=>{
      console.log("editcost",data);
     const tempEditdata = data;
     tempEditdata.forEach(ele => {
      temparr = {
        Cost_Cen_ID : ele.Cost_Cen_ID,
        Cost_Cen_Name : ele.Cost_Cen_Name,
        Godown_ID : ele.Godown_ID,
        Godown_Name : ele.godown_name,
       };
       this.costcenterTableData.push(temparr);
     });
    })
    console.log("edit table",this.costcenterTableData);
  }
  }


class masterProduct {
  Product_ID: 0;
  Is_Service : false ;
  Product_Code : string = " ";
  Product_Description : string;
  Product_SH_Descr : string = " ";
  Cat_ID : any;
  Cess_Percentage : any;
  Product_Mfg_Comp_ID : string ;
  ESN : false ;
  UOM : any ="";
  Alt_UOM : any = "" ;
  UOM_Qty = 1;
  ALT_UOM_Qty : any= 1;
  Billable : false ;
  Can_Purchase = true ;
  Material_Type : any ;
  Reorder_Level : any ;
  Sale_rate : any ;
  Purchase_Rate : any ;
  Warranty_Terms : any ;
  BARCODE_COUNT : any;
  Vendor_Wrnty : any ;
  Rate_Form_Quote = "N";
  Remarks : any ;
  Mfg_Product_Code : any ;
  Product_Expiry : false ;
  Sale_Rate_Form_Quote = "N";
  Product_Type_ID : string ;
  Product_Sub_Type_ID : any ;
  HSN_NO : any ;
  Brand_ID : number;
  Sale_rate_Franchise_New   : any ;
  Sale_rate_Franchise_Old : any;
  Sale_rate_Online : any;
  Shelf_Life_Hours: any;
  Critical_Level:any;
  Saleable_Product : false;
  Premix_Item : any;
  Daily_Weekly : any;
}
class brand{
  Brand_ID : number ;
}
class costCenter{
  costcenterId : 0;
}
