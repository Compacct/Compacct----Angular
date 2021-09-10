import { Component, OnInit, ViewEncapsulation, ViewChild } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { CompacctCommonApi } from "../../../../shared/compacct.services/common.api.service";
import { CompacctHeader } from "../../../../shared/compacct.services/common.header.service";
import { MessageService } from "primeng/api";
import { FileUpload } from "primeng/primeng";

@Component({
  selector: "app-master.product",
  templateUrl: "./master.product.component.html",
  styleUrls: ["./master.product.component.css"],
  providers: [MessageService],
  encapsulation: ViewEncapsulation.None
})
export class MasterProductComponent implements OnInit {
  tabIndexToView = 0;
  url = window["config"];
  persons: [];
  buttonname = "Create";
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

  ObjProduct = new Product();
  @ViewChild("fileInput", { static: false }) fileInput: FileUpload;
  constructor(
    private $http: HttpClient,
    private commonApi: CompacctCommonApi,
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
      Header: "Master Product",
      Link: " Material Management -> Master -> Master Product"
    });
    this.GetCategory();
    this.GetProductMfd();
    this.GetMaterialType();
  }
  // INIT DATA
  GetCategory() {
    this.$http
      .get("/Master_Product_Category/GetAllData")
      .subscribe((data: any) => {
        this.ProductCategoryLists = data ? data : [];
      });
  }
  GetProductMfd() {
    this.$http.get("/Master_Product_Mfg/GetAllData").subscribe((data: any) => {
      this.ProductMfdLists = data ? data : [];
    });
  }
  GetMaterialType() {
    this.$http
      .get("/Master_Product_V2/Get_Meterial_Type")
      .subscribe((data: any) => {
        this.MaterialTypeList = data ? JSON.parse(data) : [];
      });
  }
  GetMaterialSubType(materialType) {
    this.MaterialSubTypeList = [];
    if (materialType) {
      const para = new HttpParams().set("Type", materialType);
      this.$http
        .get("/Master_Product_V2/Get_Meterial_SubType", { params: para })
        .subscribe((data: any) => {
          this.MaterialSubTypeList = data ? JSON.parse(data) : [];
        });
    }
  }
  getCostCenterData(event) {
    console.log(event);
  }
  // Change
  MaterialTypeChange(matType) {
    this.ObjProduct.Material_Sub_Type = undefined;
    this.MaterialSubTypeList = [];
    if (matType) {
      this.GetMaterialSubType(matType);
    }
  }
  MaterialTypeChangeSearch(matType) {
    this.MaterialSubType_Browse = undefined;
    this.MaterialSubTypeList = [];
    if (matType) {
      this.GetMaterialSubType(matType);
    }
  }

  // Search
  SearchProduct(valid) {
    this.ProductSearchSubmitted = true;
    if (valid) {
      this.Spinner = true;
      const obj = new HttpParams()
        .set("Material_Type", this.MaterialType_Browse)
        .set(
          "Material_Sub_Type",
          this.MaterialSubType_Browse ? this.MaterialSubType_Browse : 0
        );
      this.$http
        .get("/Master_Product_V2/Get_Product_Details", { params: obj })
        .subscribe((data: any) => {
          this.AllProductList = data.length ? JSON.parse(data) : [];
          this.Spinner = false;
          this.ProductSearchSubmitted = false;
        });
    }
  }
  // Save
  SaveProductMaster(valid) {
    this.ProductFormSubmitted = true;
    if (valid) {
      this.Spinner = true;
      this.ObjProduct.Reorder_Level = this.ObjProduct.Reorder_Level
        ? this.ObjProduct.Reorder_Level
        : 0;
      this.ObjProduct.Sale_rate = this.ObjProduct.Sale_rate
        ? this.ObjProduct.Sale_rate
        : 0;
      this.ObjProduct.Purchase_Rate = this.ObjProduct.Purchase_Rate
        ? this.ObjProduct.Purchase_Rate
        : 0;
      this.ObjProduct.Warranty_Terms = this.ObjProduct.Warranty_Terms
        ? this.ObjProduct.Warranty_Terms
        : 0;
      this.ObjProduct.Vendor_Wrnty = this.ObjProduct.Vendor_Wrnty
        ? this.ObjProduct.Vendor_Wrnty
        : 0;
      this.ObjProduct.BARCODE_COUNT = this.ObjProduct.BARCODE_COUNT
        ? this.ObjProduct.BARCODE_COUNT
        : 0;
      this.ObjProduct.Product_Code = this.ObjProduct.Product_Code
        ? this.ObjProduct.Product_Code
        : "-";
      this.ObjProduct.Product_SH_Descr = this.ObjProduct.Product_Description
        ? this.ObjProduct.Product_Description
        : "";
      this.ObjProduct.Product_ID = this.ObjProduct.Product_ID
        ? this.ObjProduct.Product_ID
        : 0;
      const UrlAddress = "/Master_Product_V2/Insert_Product";
      const obj = { Product_String: JSON.stringify([this.ObjProduct]) };
      this.$http.post(UrlAddress, obj).subscribe((data: any) => {
        if (data.success) {
          if (this.PDFFlag) {
            this.ProductBrochureUploader(this.ProductPDFFile);
          }
          if (this.ObjProduct.Product_ID) {
            this.compacctToast.clear();
            this.compacctToast.add({
              key: "compacct-toast",
              severity: "success",
              summary: "Product ID  :" + this.ObjProduct.Product_ID,
              detail: "Succesfully Updated"
            });
          } else {
            this.compacctToast.clear();
            this.compacctToast.add({
              key: "compacct-toast",
              severity: "success",
              summary: "Product Added",
              detail: "Succesfully Created"
            });
          }

          this.clearData();
        } else {
          this.compacctToast.clear();
          this.compacctToast.add({
            key: "compacct-toast",
            severity: "error",
            summary: "Warn Message",
            detail: "Error Occured "
          });
        }
      });
    }
  }
  // Edit
  EditProduct(product) {
    if (product.Product_ID) {
      this.tabIndexToView = 1;
      this.items = ["BROWSE", "UPDATE"];
      this.buttonname = "Update";
      this.clearData();
      this.GetEditMasterProduct(product);
    }
  }
  GetEditMasterProduct(product) {
    this.GetMaterialSubType(product.Material_Type);
    this.ObjProduct = product;
    this.PDFViewFlag = this.ObjProduct.Product_Brochure ? true : false;
    this.ProductPDFLink = this.ObjProduct.Product_Brochure
      ? this.ObjProduct.Product_Brochure
      : undefined;
  }
  // Delete
  onConfirm() {
    if (this.productID) {
      this.$http
        .post("/Master_Product_V2/Delete", { id: this.productID })
        .subscribe((data: any) => {
          if (data.success === true) {
            this.SearchProduct(true);
            this.onReject();
            this.compacctToast.clear();
            this.compacctToast.add({
              key: "compacct-toast",
              severity: "success",
              summary: "Product ID: " + this.productID.toString(),
              detail: "Succesfully Deleted"
            });
          }
        });
    }
  }
  onReject() {
    this.compacctToast.clear("c");
  }
  DeleteProduct(product) {
    this.productID = undefined;
    if (product.Product_ID) {
      this.productID = product.Product_ID;
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

  // File Upload
  FetchPDFFile(event) {
    this.PDFFlag = false;
    this.ProductPDFFile = {};
    if (event) {
      this.ProductPDFFile = event.files[0];
      this.PDFFlag = true;
    }
  }
  ProductBrochureUploader(fileData) {
    const endpoint = "/Master_Product_V2/Upload_Doc";
    const formData: FormData = new FormData();
    formData.append("aFile", fileData);
    this.$http.post(endpoint, formData).subscribe(data => {
      console.log(data);
    });
  }
  // Clear & Tab
  TabClick(e) {
    this.tabIndexToView = e.index;
    this.items = ["BROWSE", "CREATE"];
    this.buttonname = "Create";
    this.clearData();
  }
  clearData() {
    if (this.PDFViewFlag === false) {
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
  Product_ID: number;
  Is_Service = false;
  Product_Code: string;
  Product_Description: string;
  Product_SH_Descr: string;
  Cat_ID: number;
  Product_Mfg_Comp_ID: number;
  ESN = false;
  UOM: string;
  Alt_UOM: string;
  ALT_UOM_Qty: string;
  UOM_Qty: string;
  Billable = false;
  Can_Purchase = false;
  Material_Type: string;
  Material_Sub_Type: string;
  Reorder_Level: number;
  Sale_rate: number;
  Purchase_Rate: number;
  Is_Visiable = "Y";
  Warranty_Terms: number;
  Vendor_Wrnty: number;
  BARCODE_COUNT: number;
  Product_Brochure: string;
  Rate_Form_Quote: number;
  Remarks: string;
  Mfg_Product_Code: string;
  Product_Expiry: string;
  Sale_Rate_Form_Quote = "N";
  HSN_NO: number;
}
