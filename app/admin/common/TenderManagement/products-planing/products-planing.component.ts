import {
  Component,
  OnInit,
  ViewEncapsulation
} from '@angular/core';
import {
  HttpClient
} from "@angular/common/http";
import {
  CompacctHeader
} from "../../../shared/compacct.services/common.header.service";
import {
  CompacctCommonApi
} from '../../../shared/compacct.services/common.api.service';
import {
  ActivatedRoute,
  Data
} from '@angular/router';
import {
  DateTimeConvertService
} from '../../../shared/compacct.global/dateTime.service';
import {
  CompacctGlobalApiService
} from '../../../shared/compacct.services/compacct.global.api.service';
import {
  MessageService
} from 'primeng/api';
@Component({
  selector: 'app-products-planing',
  templateUrl: './products-planing.component.html',
  styleUrls: ['./products-planing.component.css'],
  providers: [MessageService],
  encapsulation: ViewEncapsulation.None
})
export class ProductsPlaningComponent implements OnInit {
  items = [];
  tabIndexToView = 0;
  buttonname = "Create";
  menuList = [];
  Spinner = false;

  siteSubmitted = false;
  siteCreate = undefined;
  siteModal = false;
  Spinnersite = false;

  SearchFormSubmit = false;
  SearchSniper = false;
  ObjSearch:any = {};
  EditFlag = false;

  ObjProdPlan = new ProdPlan();
  PlanedProductList = [];

  AddedPlanedProductList = [];
  PlanedProductFormSubmit = true;
  ProjectList = [];
  SiteList = [];
  GroupNameList = [];
  ProductList = [];
  ExsitData = [];

  
  ShowAddedEstimateProductList = [];
  rowGroupMetadata: any;
  cols = [{
      field: 'SL_No',
      header: 'SL No.'
    },
    {
      field: 'Budget_Group_Name',
      header: 'Group Name'
    },
    {
      field: 'Budget_Sub_Group_Name',
      header: 'Sub Group Name'
    },
    {
      field: 'Work_Details',
      header: 'Work Details'
    },
    {
      field: 'Site_Description',
      header: 'Site'
    },
    {
      field: 'Product_Description',
      header: 'Product'
    },
    {
      field: 'unit',
      header: 'Unit'
    },
    {
      field: 'Qty',
      header: 'Qty'
    },
    {
      field: 'Nos',
      header: 'Nos'
    },
    {
      field: 'TQty',
      header: 'Total Qty'
    },
    {
      field: 'UOM',
      header: 'UOM'
    }
  ];
  ProductsModal =  false;
  constructor(
    private $http: HttpClient,
    private Header: CompacctHeader,
    private $CompacctAPI: CompacctCommonApi,
    private route: ActivatedRoute,
    private compacctToast: MessageService,
    private GlobalAPI: CompacctGlobalApiService,
    private DateService: DateTimeConvertService) {}


  ngOnInit() {
    this.items = ["BROWSE", "CREATE"];
    this.menuList = [{
        label: "Edit",
        icon: "pi pi-fw pi-user-edit"
      },
      {
        label: "Delete",
        icon: "fa fa-fw fa-trash"
      }
    ];
    this.Header.pushHeader({
      Header: "Bill Of Materials",
      Link: "Project Management -> Bill Of Materials"
    });
    // this.GetPlanedProductList();
    this.GetProjectList();
  }
  TabClick(e) {
    this.tabIndexToView = e.index;
    this.items = ["BROWSE", "CREATE"];
    this.buttonname = "CREATE";
    this.clearData();
  }
  clearData() {
    this.ObjProdPlan = new ProdPlan();
    this.AddedPlanedProductList = [];
    this.PlanedProductFormSubmit = false;
    this.EditFlag = false;
  }

  //
  GetProjectList() {
    this.ExsitData = [];
    const obj = {
      "SP_String": "SP_Task_Management_Tender",
      "Report_Name_String": "Get_Project_All",
    }
    this.GlobalAPI.getData(obj).subscribe((data: any) => {
      data.forEach(el => {
        el['work_name'] = el.Project_Description;
        el['label'] = el.work_name;
        el['value'] = el.Tender_Doc_ID;
      });
      this.ProjectList = data;
      console.log("SUB", data);
    })
  }
  ProjectChange() {
    this.SiteList = [];
    this.GroupNameList = [];
    this.ObjProdPlan.work_name = undefined;
    this.ObjProdPlan.Site_Description = undefined;
    this.ObjProdPlan.Site_ID = undefined;
    this.ExsitData = [];
    if (this.ObjProdPlan.Tender_Doc_ID) {
      const arr = this.ProjectList.filter(o => o.Tender_Doc_ID == this.ObjProdPlan.Tender_Doc_ID);
      this.ObjProdPlan.work_name = arr.length ? arr[0].label : undefined;
      this.GetGroupNameList();
      const obj = {
        "SP_String": "SP_Tender_Management_All",
        "Report_Name_String": "Get_Site_For_Project_Planning",
        "Json_Param_String": JSON.stringify([{
          'Project_ID': arr[0].Project_ID,
          'Tender_Doc_ID': arr[0].Tender_Doc_ID
        }])
      }
      this.GlobalAPI
        .getData(obj)
        .subscribe((data: any) => {
          data.forEach(el => {
            el['label'] = el.Site_Description;
            el['value'] = el.Site_ID;
          });
          this.SiteList = data;

        });
    }
  }
  ChangeSiteName() {
    this.ObjProdPlan.Site_Description = undefined;
    this.ExsitData = [];
    if (this.ObjProdPlan.Site_ID) {
      const arr = this.SiteList.filter(o => o.Site_ID == this.ObjProdPlan.Site_ID);
      this.ObjProdPlan.Site_Description = arr.length ? arr[0].Site_Description : undefined;
      this.CheckIfExist();
    }
  }
  GetGroupNameList() {
    this.GroupNameList = [];
    this.ObjProdPlan.Budget_Group_ID = undefined;
    this.ObjProdPlan.Budget_Group_Name = undefined;
    if (this.ObjProdPlan.Tender_Doc_ID) {
      const arr = this.ProjectList.filter(o => o.Budget_Group_ID == this.ObjProdPlan.Budget_Group_ID);
      this.ObjProdPlan.Budget_Group_Name = arr.length ? arr[0].Budget_Group_Name : undefined;
      const obj = {
        "SP_String": "SP_BL_CRM_Txn_Enq_Tender_Harbauer_Bill_Planning",
        "Report_Name_String": "Get_Group_with_Tender_Doc_ID",
        "Json_Param_String": JSON.stringify([{
          'Tender_Doc_ID': this.ObjProdPlan.Tender_Doc_ID
        }])
      }
      this.GlobalAPI
        .getData(obj)
        .subscribe((data: any) => {
          data.forEach(el => {
            el['label'] = el.Budget_Group_Name;
            el['value'] = el.Budget_Group_ID;
          });
          this.GroupNameList = data;

        });
    }
  }
  ChangeGroupName() {
    this.ObjProdPlan.Budget_Group_Name = undefined;
    if (this.ObjProdPlan.Budget_Group_ID) {
      const arr = this.GroupNameList.filter(o => o.Budget_Group_ID == this.ObjProdPlan.Budget_Group_ID);
      this.ObjProdPlan.Budget_Group_Name = arr.length ? arr[0].Budget_Group_Name : undefined;
    }
  }
  GetProductList() {
    this.ProductList = [];
    this.ObjProdPlan.Product_ID = undefined;
    this.ObjProdPlan.Product_Description = undefined;
    this.ObjProdPlan.Qty = undefined;
    if (this.ObjProdPlan.Type_Of_Product) {
      const obj = {
        "SP_String": "SP_BL_CRM_Txn_Enq_Tender_Harbauer_Bill_Planning",
        "Report_Name_String": "Get_Product_With_Material_Type",
        "Json_Param_String": JSON.stringify([this.ObjProdPlan])
      }
      this.GlobalAPI
        .getData(obj)
        .subscribe((data: any) => {
          data.forEach(el => {
            el['label'] = el.Product_Description;
            el['value'] = el.Product_ID;
          });
          this.ProductList = data;

        });
    }
  }
  ChangeProduct() {
    this.ObjProdPlan.Product_Description = undefined;
    this.ObjProdPlan.Qty = undefined;
    if (this.ObjProdPlan.Product_ID) {
      const arr = this.ProductList.filter(o => o.Product_ID == this.ObjProdPlan.Product_ID);
      this.ObjProdPlan.Product_Description = arr.length ? arr[0].Product_Description : undefined;
    }
  }

  validate3 (e) {
    let input = e.target.value;
    const reg = /^\d*(\.\d{0,2})?$/;
  
    if (!reg.test(input)) {
      e.preventDefault();
    }
  }
  // CHECK EDIT / UPDATE
  CheckIfExist(){
    this.ExsitData = [];
    if (!this.EditFlag && this.ObjProdPlan.Tender_Doc_ID && this.ObjProdPlan.Site_ID) {
      const tempObj = {
        'Tender_Doc_ID': this.ObjProdPlan.Tender_Doc_ID,
        'Site_ID' : this.ObjProdPlan.Site_ID
      }
      const obj = {
        "SP_String": "SP_BL_CRM_Txn_Enq_Tender_Harbauer_Bill_Planning",
        "Report_Name_String": "Project_Planning_Retrieve",
        "Json_Param_String": JSON.stringify([tempObj])
      }
      this.GlobalAPI.getData(obj).subscribe((data: any) => {
        console.log(data)
        if(data.length) {
          this.ExsitData = data;
          this.IfPlanExist();
        }
      })
    }
  }
  onRejectClear(){
    this.ExsitData = [];
    const obj = {...this.ObjProdPlan}
    this.ObjProdPlan = new ProdPlan();
    this.ObjProdPlan.Tender_Doc_ID = obj.Tender_Doc_ID;
    this.ObjProdPlan.work_name =  obj.work_name;
    this.items = ["BROWSE", "CREATE"];
    this.buttonname = "CREATE";
    this.compacctToast.clear("c2");

  }
  IfPlanExist() {
    this.compacctToast.clear();
    this.compacctToast.add({
      key: "c2",
      sticky: true,
      severity: "warn",
      summary: "Data Already Exist for Project : " + this.ObjProdPlan.work_name + ' & Site Name : ' + this.ObjProdPlan.Site_Description,
      detail: "Confirm to proceed"
    });
  }
  onConfirm2(){
    this.AddedPlanedProductList = [];
    this.AddedPlanedProductList = [...this.ExsitData];
    this.ObjProdPlan = new ProdPlan();
    this.ObjProdPlan.Tender_Doc_ID = this.ExsitData[0].Tender_Doc_ID;
    this.ObjProdPlan.work_name =  this.ExsitData[0].work_name;
    this.ObjProdPlan.Site_ID =  this.ExsitData[0].Site_ID;
    this.ObjProdPlan.Site_Description =  this.ExsitData[0].Site_Description;
    this.items = ["BROWSE", "UPDATE"];
    this.buttonname = "UPDATE";
    this.compacctToast.clear("c2");
  }
  // SITE CREATE 
  ToggleSite() {
    this.siteSubmitted = false;
    this.siteCreate = undefined;
    this.siteModal = true;
    this.Spinnersite = false;
  }
  CreateSite(valid) {
    this.siteSubmitted = true;
    if (valid && this.ObjProdPlan.work_name) {
      this.Spinnersite = true;
      const temp = {
        Tender_Doc_ID: this.ObjProdPlan.Tender_Doc_ID,
        Site_Description: this.siteCreate,
        Budget_Short_Description: this.ObjProdPlan.work_name
      }
      console.log("Site Save Data", temp);
      const obj = {
        "SP_String": "SP_Tender_Management_All",
        "Report_Name_String": "Add Site",
        "Json_Param_String": JSON.stringify([temp])
      }
      this.GlobalAPI
        .getData(obj)
        .subscribe((data: any) => {
          console.log(data)
          if (data[0].Site_ID) {
            this.compacctToast.clear();
            this.compacctToast.add({
              key: "compacct-toast",
              severity: "success",
              summary: "",
              detail: "Succesfully Site Created"
            });
            this.ProjectChange();
            this.siteSubmitted = false;
            this.siteCreate = undefined;
            this.siteModal = false;
            this.Spinnersite = false;
          } else {
            this.compacctToast.clear();
            this.compacctToast.add({
              key: "compacct-toast",
              severity: "error",
              summary: "Warn Message",
              detail: "Error Occured "
            });
            this.Spinnersite = false;
          }
        });
    }
  }

  // ADD
  AddProductPlan(valid) {
    this.PlanedProductFormSubmit = true;
    if (valid) {
      this.PlanedProductFormSubmit = false;
      this.AddedPlanedProductList.push(this.ObjProdPlan);
      this.ObjProdPlan.Qty = Number(this.ObjProdPlan.Qty).toFixed(3);
      const obj = {
        ...this.ObjProdPlan
      };
      this.ObjProdPlan = new ProdPlan();
      this.ObjProdPlan.Tender_Doc_ID = obj.Tender_Doc_ID;
      this.ObjProdPlan.work_name = obj.work_name;
      this.ObjProdPlan.Site_ID = obj.Site_ID;
      this.ObjProdPlan.Site_Description = obj.Site_Description;

    }

  }
  DeleteProductPlan(index) {
    this.AddedPlanedProductList.splice(index, 1);
  }
// SAVE
  SaveProductPlanForm() {
    this.PlanedProductFormSubmit = true;
    if (this.AddedPlanedProductList.length) {
      this.Spinner = true;
      console.log("save", this.AddedPlanedProductList)
      const obj = {
        "SP_String": "SP_BL_CRM_Txn_Enq_Tender_Harbauer_Bill_Planning",
        "Report_Name_String":  this.buttonname === "CREATE" ? "Project_Planning_Insert" : "Project_Planning_Edit",
        "Json_Param_String": JSON.stringify(this.AddedPlanedProductList)
      }
      this.GlobalAPI.getData(obj).subscribe((data: any) => {
        if (data[0].Column1) {
          this.compacctToast.clear();
          this.compacctToast.add({
            key: "compacct-toast",
            severity: "success",
            summary: "Tender Doc ID:" + this.ObjProdPlan.Tender_Doc_ID.toString(),
            detail: "Succesfully  " + this.buttonname.toLowerCase() +'d.'
          });
          this.ObjSearch && this.ObjSearch.Tender_Doc_ID ? this.GetPlanedProductList(true) : null;
          this.tabIndexToView = 0;
          this.items = ["BROWSE", "CREATE"];
          this.buttonname = "CREATE";
        }
        this.Spinner = false;
        this.clearData();
      })
    }
  }
  GetPlanedProductList(valid) {
    this.SearchFormSubmit = true;
    this.PlanedProductList = [];
    if(valid) {
      this.SearchFormSubmit = false;
      this.SearchSniper = true;
      const obj = {
        "SP_String": "SP_BL_CRM_Txn_Enq_Tender_Harbauer_Bill_Planning",
        "Report_Name_String": "Project_Planning_Browse",
        "Json_Param_String": JSON.stringify([this.ObjSearch])
      }
      this.GlobalAPI.getData(obj).subscribe((data: any) => {
        this.PlanedProductList = data;
        this.SearchSniper = false;
      })
    }
    
  }
// EDIT
  EditProductPlan(col) {
    this.EditFlag = false;
    if (col.Tender_Doc_ID) {
      this.tabIndexToView = 1;
      this.items = ["BROWSE", "UPDATE"];
      this.buttonname = "UPDATE";
      this.clearData();
      this.GetEditMaster(col);
      this.EditFlag = true;
    }
  }
  GetEditMaster(obj) {
    if (obj.Tender_Doc_ID) {
      const tempObj = {
        'Tender_Doc_ID': obj.Tender_Doc_ID,
        'Site_ID': obj.Site_ID,
      }
      const obj1 = {
        "SP_String": "SP_BL_CRM_Txn_Enq_Tender_Harbauer_Bill_Planning",
        "Report_Name_String": "Project_Planning_Retrieve",
        "Json_Param_String": JSON.stringify([tempObj])
      }
      this.GlobalAPI.getData(obj1).subscribe((data: any) => {
        console.log(data)
        if(data.length) {
          this.AddedPlanedProductList = [...data];
          this.ObjProdPlan = new ProdPlan();
          this.ObjProdPlan.Tender_Doc_ID = data[0].Tender_Doc_ID;
          this.ProjectChange();
          this.ObjProdPlan.work_name =  data[0].work_name;
          this.ObjProdPlan.Site_ID =  data[0].Site_ID;
          this.ObjProdPlan.Site_Description =  data[0].Site_Description;
        }
      })
    }
  }

  // Delete
  DeletePlan(col) {
    // this.BankID = undefined;
    // if(col.Bank_ID){
    //   this.BankID = col.Bank_ID;
    //   this.compacctToast.clear();
    //   this.compacctToast.add({
    //     key: "c",
    //     sticky: true,
    //     severity: "warn",
    //     summary: "Are you sure?",
    //     detail: "Confirm to proceed"
    //   });
    // }
  }
  onConfirm() {
    //  if(this.BankID){
    //   const tempObj = {
    //     Bank_ID:this.BankID
    //    }
    //   const obj = {
    //     "SP_String": "SP_Bank_Master_Payment_Followup",
    //     "Report_Name_String": "Delete_Bank_Master_Payment_Followup",
    //     "Json_Param_String": JSON.stringify([tempObj])      
    //   }
    //   this.GlobalAPI.getData(obj).subscribe((data:any)=>{
    //     if (data[0].Column1 === "Done"){
    //       this.onReject();
    //       this.GetPlanedProductList();
    //       this.compacctToast.clear();
    //       this.compacctToast.add({
    //         key: "compacct-toast",
    //         severity: "success",
    //         summary: "Bank Id: " + this.BankID.toString(),
    //         detail: "Succesfully Deleted"
    //       });
    //     }
    //   })
    //  }
  }
  onReject() {
    this.compacctToast.clear("c");
  }
  //Product Details
  onSort() {
    this.updateRowGroupMetaData();
  }
  updateRowGroupMetaData() {
    this.rowGroupMetadata = {};
    if (this.ShowAddedEstimateProductList) {
      for (let i = 0; i < this.ShowAddedEstimateProductList.length; i++) {
        let rowData = this.ShowAddedEstimateProductList[i];
        let brand = rowData.Budget_Group_Name;
        if (i == 0) {
          this.rowGroupMetadata[brand] = {
            index: 0,
            size: 1
          };
        } else {
          let previousRowData = this.ShowAddedEstimateProductList[i - 1];
          let previousRowGroup = previousRowData.Budget_Group_Name;
          if (brand === previousRowGroup)
            this.rowGroupMetadata[brand].size++;
          else
            this.rowGroupMetadata[brand] = {
              index: i,
              size: 1
            };
        }
      }
    }
  }
  GetEditSingleScheme() {
    this.ShowAddedEstimateProductList = [];
    if (this.ObjProdPlan.Tender_Doc_ID) {
      const obj = {
        "SP_String": "SP_Tender_Management_All",
        "Report_Name_String": "Get Data Tender Estimate_With_Changed_Amount",
        "Json_Param_String": JSON.stringify([{
          'Tender_Doc_ID': this.ObjProdPlan.Tender_Doc_ID
        }])
      }
      this.GlobalAPI
        .getData(obj)
        .subscribe((data: any) => {
          if (data.length) {
            this.ShowAddedEstimateProductList = data;
            console.log(data)
            this.ProductsModal =  true;
          }
        });
    }
  }
  getPurchaseAmt() {
    return this.ShowAddedEstimateProductList.reduce((n, {
      Amount
    }) => n + Number(Amount), 0)
  }
  getSaleAmt() {
    return this.ShowAddedEstimateProductList.reduce((n, {
      Sale_Amount
    }) => n + Number(Sale_Amount), 0)
  }
  getTotalPurchaseAmt() {
    return this.ShowAddedEstimateProductList.length ? Number(this.ShowAddedEstimateProductList[0].No_of_Site) * this.getPurchaseAmt() : '-';
  }
}
class ProdPlan {
  Tender_Doc_ID: String;
  work_name: string;
  Site_ID: string;
  Site_Description: string;
  Budget_Group_ID: string;
  Budget_Group_Name: string;
  Type_Of_Product: string;
  Product_ID: String;
  Product_Description: string;
  Qty: string;
}
