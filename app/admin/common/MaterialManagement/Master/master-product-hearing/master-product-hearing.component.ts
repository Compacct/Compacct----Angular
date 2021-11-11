import { Component, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { CompacctCommonApi } from '../../../../shared/compacct.services/common.api.service';
import { CompacctHeader } from '../../../../shared/compacct.services/common.header.service';
import { MessageService } from 'primeng/api';
import { FileUpload } from 'primeng/primeng';
import { Routes, RouterModule, Router } from '@angular/router';


@Component({
  selector: 'app-master-product-hearing',
  templateUrl: './master-product-hearing.component.html',
  styleUrls: ['./master-product-hearing.component.css'],
  providers: [MessageService] ,
  encapsulation: ViewEncapsulation.None
})
export class MasterProductHearingComponent implements OnInit {
  tabIndexToView = 0;
  url = window['config'];
  persons: [];
  buttonname = 'Create';
  Spinner = false;
  PDFFlag = false;
  PDFViewFlag = false;
  ProductPDFLink = undefined;

  items = [];
  ProductSearchSubmitted = false;
  ProductFormSubmitted = false;
  AllProductList = [];
  ProductMfdLists = [];
  ProductCategoryLists = [];
  MaterialTypeList = [];
  MaterialSubTypeList = [];
  ProductPDFFile = {};

  MaterialType_Browse: any;
  MaterialSubType_Browse: any;
  productID: number;

  cols = [];
  menuList = [];
  productTypes:any[]= [];
  connectionTypes:any[]= [];
  rangeList:any[]= [];
  betteryList:any[]= [];
  editProductList:any[] =[];

  ObjProduct = new Product();
  @ViewChild('fileInput' , { static: false}) fileInput: FileUpload;
  constructor(private $http: HttpClient ,
    private commonApi: CompacctCommonApi,
    private Header: CompacctHeader ,
    private compacctToast: MessageService,
    private _router: Router) { }

  ngOnInit() {

    this.items = [ 'BROWSE', 'CREATE'];
    this.menuList = [
      {label: 'Edit', icon: 'pi pi-fw pi-user-edit'},
      {label: 'Delete', icon: 'fa fa-fw fa-trash'}
    ];
    this.Header.pushHeader({'Header' : 'Master Product Hearing Aid',
                            'Link' : ' Material Management -> Master -> Master Product Hearing Aid'});

    this.getAllProduct();
    this.GetCategory();
    this.GetProductMfd();
    this.getProductType();
  }
  // INIT DATA
  GetCategory() {
    this.$http.get('/Master_Product_Category/GetAllData').subscribe((data: any) => {
      this.ProductCategoryLists = data ? data : [];
    });
 }
  GetProductMfd () {
    this.$http.get('/Master_Product_Mfg/GetAllData').subscribe((data: any) => {
      this.ProductMfdLists = data ? data : [];
    });
 }
  GetMaterialType() {
    this.$http.get('/Master_Product_V2/Get_Meterial_Type').subscribe((data: any) => {
         this.MaterialTypeList = data ? JSON.parse(data) : [];
    });
  }
  GetMaterialSubType(materialType) {
    this.MaterialSubTypeList = [];
    if (materialType) {
      const para = new HttpParams()
      .set('Type', materialType);
      this.$http.get('/Master_Product_V2/Get_Meterial_SubType', {params : para}).subscribe((data: any) => {
        this.MaterialSubTypeList = data ? JSON.parse(data) : [];
      });
    }
  }
  // Change
  MaterialTypeChange(matType) {
    //this.ObjProduct.Material_Sub_Type = undefined;
    this.MaterialSubTypeList = [];
    if ( matType) {
      this.GetMaterialSubType(matType);
    }
  }
  MaterialTypeChangeSearch(matType) {
    this.MaterialSubType_Browse = undefined;
    this.MaterialSubTypeList = [];
    if ( matType) {
      this.GetMaterialSubType(matType);
    }
  }

  getProductType() {
    this.$http.get('/Master_Product_HA/Get_Product_HA_Product_Type')
    .subscribe((data: any) => {
         this.productTypes = data ? JSON.parse(data) : [];

         this.productTypes.forEach((val, index)=>{
          this.productTypes[index].label = val.HA_Product_Type;
          this.productTypes[index].value = val.HA_Product_Type;
        });
        console.log('this.productTypes =', this.productTypes);
    });

    this.$http.get('/Master_Product_HA/Get_Product_HA_Connection_Type')
    .subscribe((data: any) => {
         this.connectionTypes = data ? JSON.parse(data) : [];

         this.connectionTypes.forEach((val, index)=>{
          this.connectionTypes[index].label = val.HA_Connection_Type;
          this.connectionTypes[index].value = val.HA_Connection_Type;
        });
        console.log('this.connectionTypes =', this.connectionTypes);
    });

    this.$http.get('/Master_Product_HA/Get_Product_HA_Range')
    .subscribe((data: any) => {
         this.rangeList = data ? JSON.parse(data) : [];

         this.rangeList.forEach((val, index)=>{
          this.rangeList[index].label = val.HA_Range;
          this.rangeList[index].value = val.HA_Range;
        });
        console.log('this.rangeList =', this.rangeList);
    });

    this.$http.get('/Master_Product_HA/Get_Product_HA_Battery')
    .subscribe((data: any) => {
         this.betteryList = data ? JSON.parse(data) : [];

         this.betteryList.forEach((val, index)=>{
          this.betteryList[index].label = val.HA_Battery;
          this.betteryList[index].value = val.HA_Battery;
        });
        console.log('this.betteryList =', this.betteryList);
    });  }

  // Search
  SearchProduct (valid) {
   /*  this.ProductSearchSubmitted = true;
    if (valid) {
      this.Spinner = true;
      const obj = new HttpParams()
      .set('Material_Type', this.MaterialType_Browse)
      .set('Material_Sub_Type', this.MaterialSubType_Browse ? this.MaterialSubType_Browse : 0);
      this.$http.get('/Master_Product_V2/Get_Product_Details', {params : obj}).subscribe((data: any) => {
        this.AllProductList =  data.length ? JSON.parse(data) : [];
        this.Spinner = false;
        this.ProductSearchSubmitted = false;
      });
    } */
  }
  addCat(){
    // this._router.navigate(['/Master_Product_Category?Country=INDIA']);
     window.open('/Master_Product_Category?Country=INDIA');
   }
  refreshCat(){
    this.GetCategory();
  }
  addManufacturer(){
     window.open('/Master_Product_Mfg');
   }
   refreshManufacturer(){
     this.GetProductMfd();
  }

  getAllProduct() {
      this.Spinner = true;
      this.$http.get('/Master_Product_HA/Get_Browse')
      .subscribe((data: any) => {
           this.AllProductList = data ? JSON.parse(data) : [];
          console.log('this.AllProductList =', this.AllProductList);
          this.Spinner = false;
      });
  }
  // Save
  SaveProductMaster (valid) {
    this.ProductFormSubmitted = true;
    if (valid) {
      this.Spinner = true;
      // this.ObjProduct.Sale_rate = this.ObjProduct.Sale_rate ? this.ObjProduct.Sale_rate : 0;
      // this.ObjProduct.Purchase_Rate = this.ObjProduct.Purchase_Rate ? this.ObjProduct.Purchase_Rate : 0;
      this.ObjProduct.Warranty_Terms = this.ObjProduct.Warranty_Terms ? this.ObjProduct.Warranty_Terms : 0;
      //this.ObjProduct.Vendor_Wrnty = this.ObjProduct.Vendor_Wrnty ? this.ObjProduct.Vendor_Wrnty : 0;
      this.ObjProduct.Vendor_Wrnty = this.ObjProduct.Warranty_Terms;
      this.ObjProduct.Product_ID = this.ObjProduct.Product_ID ? this.ObjProduct.Product_ID : 0;
      console.log('this.ObjProduct =', this.ObjProduct);

      const UrlAddress = '/Master_Product_HA/Create_Edit_Master_Product_HA';
      const obj = { 'Master_Product_HA_String' : JSON.stringify([this.ObjProduct])};

      this.$http.post(UrlAddress, obj ).subscribe((data: any) => {
          if (data.success) {
            const product_id = data.Doc_No;
            if (this.PDFFlag) {
              this.ProductBrochureUploader(this.ProductPDFFile, product_id);
            }
            if (this.ObjProduct.Product_ID) {
                  this.compacctToast.clear();
                  this.compacctToast.add({key: 'compacct-toast',
                                    severity: 'success',
                                    summary: 'Product ID  :' + this.ObjProduct.Product_ID ,
                                    detail: 'Succesfully Updated'});

                  this.getAllProduct();
            } else {
                this.compacctToast.clear();
                this.compacctToast.add({key: 'compacct-toast',
                                  severity: 'success',
                                  summary: 'Product Added'  ,
                                  detail: 'Succesfully Created'});
                                  this.clearData();
                                  this.getAllProduct();
            }
          } else {
            this.compacctToast.clear();
            this.compacctToast.add({key: 'compacct-toast',
                                  severity: 'error',
                                  summary: 'Warn Message',
                                  detail: 'Error Occured '});
        }
      });
    }
  }
  // Edit
  EditProduct (product) {
    if (product.Product_ID) {
          this.tabIndexToView = 1;
          this.items = ['BROWSE', 'UPDATE'];
          this.buttonname = 'Update';
          this.clearData();

          this.$http.post('/Master_Product_HA/Get_All_Data', {'Product_ID' : product.Product_ID})
          .subscribe((data: any) => {
            this.editProductList = data ? JSON.parse(data) : [];
            console.log('this.editProductList =', this.editProductList[0]);
            this.ObjProduct =  this.editProductList[0];
            this.PDFViewFlag = this.ObjProduct.Product_Image ? true : false;
            this.ProductPDFLink =  this.ObjProduct.Product_Image ? this.ObjProduct.Product_Image : undefined;
        });
    }
  }
  GetEditMasterProduct (product) {
    this.GetMaterialSubType(product.Material_Type);
    this.ObjProduct = product;
    this.PDFViewFlag = this.ObjProduct.Product_Image ? true : false;
    this.ProductPDFLink =  this.ObjProduct.Product_Image ? this.ObjProduct.Product_Image : undefined;

  }
  // Delete
  DeleteProduct (product) {
    this.productID = undefined;
    if (product.Product_ID) {
      this.productID = product.Product_ID;
      this.compacctToast.clear();
      this.compacctToast.add({key: 'c', sticky: true, severity: 'warn', summary: 'Are you sure?', detail: 'Confirm to proceed'});
    }
  }
  onConfirm() {
    if (this.productID) {
      this.$http.post('/Master_Product_HA/Delete', {'Product_ID' : this.productID}).subscribe((data: any) => {
          if (data.success === true) {
            //  this.SearchProduct(true);
             this.getAllProduct();
              this.onReject();
              this.compacctToast.clear();
              this.compacctToast.add({key: 'compacct-toast',
                                 severity: 'success',
                                 summary: 'Product ID: ' + this.productID.toString(),
                                 detail: 'Succesfully Deleted'});
            }
      });
    }
  }
  onReject() {
    this.compacctToast.clear('c');
  }
  // File Upload
  FetchPDFFile (event) {
    this.PDFFlag = false;
    this.ProductPDFFile = {};
    if (event) {
      this.ProductPDFFile = event.files[0];
      this.PDFFlag = true;
    }
  }
  ProductBrochureUploader (fileData, product_id) {
    const endpoint = '/Master_Product_HA/Upload_Pic?Product_ID=' + product_id;
    const formData: FormData = new FormData();
    formData.append('aFile', fileData);
    this.$http
      .post(endpoint, formData)
      .subscribe((data) => {
        console.log('Image data =',data);
      });
   }
  // Clear & Tab
  TabClick(e) {
    this.tabIndexToView = e.index;
    this.items = ['BROWSE', 'CREATE'];
    this.buttonname = 'Create';
   this.clearData();
  }
  clearData() {
    if ( this.PDFViewFlag === false) {
      this.fileInput.clear();
    }
    this.ProductSearchSubmitted = false;
    this.ProductFormSubmitted = false;
    this.Spinner = false;
    this.ObjProduct = new Product();
    this.PDFViewFlag = false;
    this.MaterialSubTypeList = [];
  }
}

class Product {
  Product_ID:number;
  Product_Description: string;
  Cat_ID: number;
  Product_Mfg_Comp_ID: number;
  Billable =  true;
  Can_Purchase =  true;
  Sale_rate = 0;
  Purchase_Rate = 0;
  Warranty_Terms: number;
  Vendor_Wrnty: number;
  Remarks: string;
  Product_Image: string;
  HA_Product_Type: string;
  HA_Connection_Type: string;
  HA_Range: string;
  HA_Battery: string;
}

