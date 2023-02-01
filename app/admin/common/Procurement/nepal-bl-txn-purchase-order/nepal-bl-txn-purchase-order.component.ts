import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MessageService } from 'primeng/api';
import { DateTimeConvertService } from '../../../shared/compacct.global/dateTime.service';
import { CompacctCommonApi } from '../../../shared/compacct.services/common.api.service';
import { CompacctHeader } from '../../../shared/compacct.services/common.header.service';
import { CompacctGlobalApiService } from '../../../shared/compacct.services/compacct.global.api.service';
import { DateNepalConvertService } from "../../../shared/compacct.global/dateNepal.service"
import { UnsubscriptionError } from 'rxjs';
import { createClient } from 'http';
import { FileUpload } from "primeng/primeng";
import { NgxUiLoaderService } from 'ngx-ui-loader';
@Component({
  selector: 'app-nepal-bl-txn-purchase-order',
  templateUrl: './nepal-bl-txn-purchase-order.component.html',
  styleUrls: ['./nepal-bl-txn-purchase-order.component.css'],
  providers: [MessageService],
  encapsulation: ViewEncapsulation.None
})
export class NepalBLTxnPurchaseOrderComponent implements OnInit {
  tabIndexToView: number = 0;
  tabIndex: number = 0;
  items: any = [];
  items1: any = [];
  buttonname: string = "Save";
  ObjPurchase: Purchase = new Purchase();
  DocDate: any = {};
  BrowseStartDate: any = {};
  BrowseEndDate: any = {};
  ASDate: any = {};
  ToDate: any = {};
  docDate: any = {};
  PurchaseOrderForm: boolean = false;
  SearchFormSubmit: boolean = false;
  TotalRate: number = 0;
  BillingTolist: any = [];
  ShippingTolist: any = [];
  VendorList: any = [];
  POnoList: any = [];
  ProductList: any = [];
  ProductQtyTotal: number = 0;
  QtyTotal: number = 0;
  Searchedlist: any = [];
  masterDoc: any = undefined;
  PoCode: any = undefined;
  Spinner: boolean = false;
  editorDis: boolean = false;
  EditList: any = [];
  UpdatePono: any = {};
  ViewPoTypeModal: boolean = false;
  StatusForPop: any = undefined;
  POPform: boolean = false;
  POupdateList: any = [];
  DocID: any = undefined;
  titleHeder: string = "";
  ViewCompanyModal: boolean = false;
  CreateEmailModal: boolean = false;
  CaptionList: any = [];
  CompanyList: any = [];
  CurentSID: any = undefined;
  CompanyEmailList: any = [];
  EmailId: any = undefined;
  NewEmailFormSubmitted: boolean = false;
  CompantEmailName: any = undefined;
  toEmailList: any = [];
  CCEmailList: any = [];
  EmailCheck: any = false;
  ToEmailSelect: any = undefined;
  CCEmailSelect: any = undefined;
  ApproverOneS: any = undefined;
  ApproverTwoS: any = undefined;
  ApproverTwo: any = undefined;
  ApproverOne: any = undefined;
  ActivityPlanModal: boolean = false;
  ToDoList: any = [];
  Doclist: any = [];
  ExpectedDaysDoc: number = 0;
  ExpectedDaysToDo: number = 0;
  ActivityDetailsObj: any = {};
  ViewPoVaultModal: boolean = false;
  PODocVList: any = [];
  PDFFlag: boolean = false;
  ProductPDFFile: any = [];
  ValidationNoUpload: any = undefined;
  DocIdD: any = undefined;
  DocUplodeDate: any;
  viewTodoModal: boolean = false;
  ViewTOdoNameModal: boolean = false;
  dataList: any = [];
  todoNameList: any = [];
  PendingList: any = [];
  StatusID: any = undefined;
  POid: any = undefined;
  PendingTodo: any = undefined;
  StatusDetails: any = undefined;
  RemarksDetails: any = undefined;
  TodoForm: boolean = false;
  UpdatePopIdDoc: any = undefined;
  UpdatePopIdDate: any = undefined;
  backUPdataList: any = [];
  SelectedDistPresentStatus: any = [];
  DistPresentStatus: any = [];
  ColorModel: boolean = false;
  EmailUpdate: any = undefined;
  EmailSendModel: boolean = false;
  EmailFormSubmitted: boolean = false;
  pathURl: any = undefined;
  @ViewChild("fileInput", { static: false }) fileInput!: FileUpload;
  constructor(
    private $http: HttpClient,
    private GlobalAPI: CompacctGlobalApiService,
    private Header: CompacctHeader,
    private DateService: DateTimeConvertService,
    private DateNepalConvertService: DateNepalConvertService,
    public $CompacctAPI: CompacctCommonApi,
    private compacctToast: MessageService,
    private ngxService: NgxUiLoaderService,
  ) { }

  ngOnInit() {
    this.items = ["BROWSE", "CREATE"];
    this.items1 = ["TO-DO Status", "TO-DO Update"];
    this.Header.pushHeader({
      Header: "Purchase Order",
      Link: " Procurement -> Transaction ->  Purchase Order"
    });
    this.DocDate = this.DateNepalConvertService.GetNepaliCurrentDateNew();
    this.BrowseStartDate = this.DateNepalConvertService.GetNepaliCurrentDateNew();
    this.BrowseEndDate = this.DateNepalConvertService.GetNepaliCurrentDateNew();
    this.ASDate = this.DateNepalConvertService.GetNepaliCurrentDateNew();
    this.ToDate = this.DateNepalConvertService.GetNepaliCurrentDateNew();
    this.docDate = this.DateNepalConvertService.GetNepaliCurrentDateNew();
    this.getGodown();
    this.getVendor();
    this.getCompany();
    this.getCompanyMail()
  }
  TabClick(e) {
    this.tabIndexToView = e.index;
    this.items = ["BROWSE", "CREATE"];
    this.buttonname = "Save";
    this.clearData();
  }
  TabClick1(r) {
    this.tabIndex = r.index;
    this.items1 = ["TO-DO Status", "TO-DO Update"];
    this.clearData1()
  }
  onReject() {
    this.compacctToast.clear("c");
    this.compacctToast.clear("A");
  }
  clearData() {
    this.PurchaseOrderForm = false;
    this.ObjPurchase.Sub_Ledger_ID = undefined;
    this.ObjPurchase.Address_Caption = undefined;
    this.ObjPurchase.Subledger_Address = undefined;
    this.ObjPurchase.Company_Name = undefined;
    this.ObjPurchase.Address_Caption = undefined;
    this.ObjPurchase.Remarks = undefined;
    this.ObjPurchase.Heading = undefined;
    this.ApproverOneS = undefined;
    this.ApproverTwoS = undefined;
    this.ApproverTwo = undefined;
    this.ApproverOne = undefined;
    this.ProductList = [];
    this.Searchedlist = [];
    this.UpdatePono = {};
    this.DocDate = this.DateNepalConvertService.GetNepaliCurrentDateNew();
  }
  clearData1() {
    this.TodoForm = false;
    this.PendingTodo = undefined;
    this.StatusDetails = undefined;
    this.RemarksDetails = undefined;
    
  }
  getGodown() {
    this.BillingTolist = [];
    this.ShippingTolist = []
    const obj = {
      "SP_String": "sp_Bl_Txn_Purchase_Order_Nepal",
      "Report_Name_String": "Get_Godown_Details",
    }
    this.GlobalAPI.getData(obj).subscribe((data: any) => {
      // console.log("GodownList==",data)
      if (data.length) {
        data.forEach((xy: any) => {
          xy['label'] = xy.Godown
          xy['value'] = xy.Godown
        });
      }
      this.BillingTolist = data
      this.ObjPurchase.Godown1 = data[0].Godown
      this.Alladdress()
      this.ShippingTolist = data
      this.ObjPurchase.Godown2 = data[0].Godown
      this.Alladdress()

    });
    
  }
  getVendor() {
    this.VendorList = []
    const obj = {
      "SP_String": "sp_Bl_Txn_Requisition_From_Salesman",
      "Report_Name_String": "Get_Sub_Ledger_For_Purchase",
    }
    this.GlobalAPI.getData(obj).subscribe((data: any) => {
      if (data.length) {
        data.forEach((xy: any) => {
          xy['label'] = xy.Sub_Ledger_Name
          xy['value'] = xy.Sub_Ledger_ID
        });
        this.VendorList = data
        // console.log("VendorList==",this.VendorList)
      }
    });
  }
  getVaddress() {
    this.ObjPurchase.Subledger_Address = []
    if (this.ObjPurchase.Address_Caption) {
      const AddressTyp = this.CaptionList.filter(items => items.Address_Caption === this.ObjPurchase.Address_Caption);
      this.ObjPurchase.Subledger_Address = AddressTyp[0].Subledger_Address
    }
  }
  getPRno() {
    this.POnoList = []
    this.ObjPurchase.Address_Caption = undefined
    this.ObjPurchase.Subledger_Address = undefined
    if (this.ObjPurchase.Sub_Ledger_ID) {
      const obj = {
        "SP_String": "sp_Bl_Txn_Purchase_Request",
        "Report_Name_String": "Get_Purchase_Request_Doc_No_with_Vendor",
        "Json_Param_String": JSON.stringify([{ Sub_Ledger_ID: this.ObjPurchase.Sub_Ledger_ID }])
      }
      this.GlobalAPI.getData(obj).subscribe((data: any) => {
        if (data.length) {
          data.forEach((xy: any) => {
            xy['label'] = xy.Purchase_Request_No_Text
            xy['value'] = xy.Purchase_Request_No
          });
          this.POnoList = data
          // console.log("POnoList==",this.POnoList)
        }
      });
    }
    this.getCaption()
    this.getEmailId(this.ObjPurchase.Sub_Ledger_ID)
  }
  getPRoduct() {
    const obj = {
      "SP_String": "sp_Bl_Txn_Purchase_Request",
      "Report_Name_String": "Get_Details_with_Purchase_Request_No",
      "Json_Param_String": JSON.stringify([{ Purchase_Request_No: this.ObjPurchase.Purchase_Request_No }])
    }
    this.GlobalAPI.getData(obj).subscribe((data: any) => {
       
      this.ProductList = data
      this.ObjPurchase.Qty = data.Purchase_Request_Qty,
        this.ObjPurchase.Rate = data.Rate
      this.ProductList.forEach(ele => {
        ele.Line_Total = Number(ele.Purchase_Request_Qty) * Number(ele.Rate)
      });
      //this.getTotalClc();
      this.GetTotalPro();
      this.getTotal();
      // console.log("ProductList",this.ProductList)
    })
  }
  getTotalClc(i: any) {
    this.ProductList[i].Line_Total = Number(this.ProductList[i].Purchase_Request_Qty) * Number(this.ProductList[i].Rate)
  }
  GetTotalPro() {
    let flg: Number = 0
    this.ProductList.forEach((ele: any) => {
      (flg) = Number(ele.Purchase_Request_Qty) + Number(flg)
    });
    this.ProductQtyTotal = Number(Number(flg).toFixed())
    return this.ProductQtyTotal
  }
  getTotal() {
    let flg: Number = 0
    this.ProductList.forEach((ele: any) => {
      (flg) = Number(ele.Line_Total) + Number(flg)
    });
    this.QtyTotal = Number(Number(flg).toFixed())
    return this.QtyTotal
  }
  SavePo(vaild) {
    this.PurchaseOrderForm = true;
    let ArrData: any = [];
    this.ProductList.forEach(element => {
      const TempObj = {
        Doc_No: this.PoCode ? this.PoCode : "A",
        Purchase_Request_No: this.ObjPurchase.Purchase_Request_No ? this.ObjPurchase.Purchase_Request_No : this.UpdatePono.Purchase_Request_No,
        Doc_Date: this.DateService.dateConvert(this.DateNepalConvertService.convertNepaliDateToEngDate(this.DocDate)),
        Cost_Center_ID: 2,
        Sub_Ledger_ID: this.ObjPurchase.Sub_Ledger_ID,
        Address_Caption: this.ObjPurchase.Address_Caption,
        Sub_Ledger_Address: this.ObjPurchase.Shipping_Address,
        Shipping_To: this.ObjPurchase.Godown2,
        Billing_To: this.ObjPurchase.Godown1,
        Company_Name: this.ObjPurchase.Company_Name,
        Remarks: this.ObjPurchase.Remarks,
        Heading: this.ObjPurchase.Heading,
        Current_Status: this.CurentSID ? this.CurentSID : "",
        Approver_One_Status: this.ApproverOneS ? this.ApproverOneS : "",
        Approver_Two_Status: this.ApproverTwoS ? this.ApproverTwoS : "",
        Approver_One: this.ApproverOne ? this.ApproverOne : "",
        Approver_Two: this.ApproverTwo ? this.ApproverTwo : "",
        Product_ID: element.Product_ID,
        Qty: element.Purchase_Request_Qty,
        Rate: element.Rate,
        UOM: element.UOM,
        Line_Total: element.Line_Total,
        Grant_Total: this.getTotal(),
        Posted_By: this.$CompacctAPI.CompacctCookies.User_ID,
      }
      ArrData.push(TempObj)
    })
    if (vaild) {
      const obj = {
        "SP_String": "sp_Bl_Txn_Purchase_Order_Nepal",
        "Report_Name_String": "Create_Purchase_Order",
        "Json_Param_String": JSON.stringify(ArrData)
      }
      this.GlobalAPI.postData(obj).subscribe((data: any) => {
        if (data[0].Column1) {
          this.compacctToast.clear();
          this.compacctToast.add({
            key: "compacct-toast",
            severity: "success",
            summary: this.PoCode ? this.PoCode : "Purchase Order",
            detail: "Succesfully" + this.buttonname,
          });
          this.tabIndexToView = 0;
          this.ObjPurchase = new Purchase();
          this.PurchaseOrderForm = false;
          this.items = ["BROWSE", "CREATE"];
          this.Searchedlist = [];
          if (data[0].Column1) {
            window.open("/Report/Crystal_Files/Nepal/Purchase_Order_Nepal.aspx?Doc_No=" + data[0].Column1,
              'mywindow', 'fullscreen=yes, scrollbars=auto,width=950,height=500'
            );
          }
        }
      })

    }
  }
  BrowseSearch(valid) {
    this.SearchFormSubmit = true
    if (valid) {
      this.Searchedlist = []
      const tempobj = {
        From_Date: this.DateService.dateConvert(this.DateNepalConvertService.convertNepaliDateToEngDate(this.BrowseStartDate)),
        To_Date: this.DateService.dateConvert(this.DateNepalConvertService.convertNepaliDateToEngDate(this.BrowseEndDate)),
      }
      const obj = {
        "SP_String": "sp_Bl_Txn_Purchase_Order_Nepal",
        "Report_Name_String": "Browse_Purchase_Order",
        "Json_Param_String": JSON.stringify([tempobj])
      }
      this.GlobalAPI.getData(obj).subscribe((data: any) => {
        if (data.length) {
          console.log("Searchedlist", data)
          this.Searchedlist = data
          data.forEach((y: any) => {
            y.Doc_Date = this.DateNepalConvertService.convertNewEngToNepaliDateObj(y.Doc_Date);
          });
     
        }
      })
    }
  }
  DeleteBrowse(DocID) {
    this.masterDoc = undefined;
    if (DocID.Doc_No) {
      this.masterDoc = DocID.Doc_No;
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
    if (this.masterDoc) {
      const obj = {
        "SP_String": "sp_Bl_Txn_Purchase_Order_Nepal",
        "Report_Name_String": "Delete_Purchase_Order",
        "Json_Param_String": JSON.stringify([{ Doc_No: this.masterDoc }])
      }
      this.GlobalAPI.getData(obj).subscribe((data: any) => {
        if (data[0].Column1) {
          this.compacctToast.clear();
          this.compacctToast.add({
            key: "compacct-toast",
            severity: "success",
            summary: "Doc ID: " + this.masterDoc,
            detail: "Succesfully Deleted"
          });
          this.BrowseSearch(true);
        }
      })
    }
  }
  EditBrowse(Update) {
    this.EditList = [];
    if (Update.Doc_No) {
      this.PoCode = undefined;
      this.tabIndexToView = 1;
      this.items = ["BROWSE", "UPDATE"];
      this.buttonname = "Update";
      this.clearData();
      this.PoCode = Update.Doc_No
      this.CurentSID = Update.Current_Status
      this.GetEdit(Update.Doc_No)
    }
  }
  GetEdit(Uid) {
    const obj = {
      "SP_String": "sp_Bl_Txn_Purchase_Order_Nepal",
      "Report_Name_String": "Get_Data_From_Purchase_Order",
      "Json_Param_String": JSON.stringify([{ Doc_No: Uid }])
    }
    this.GlobalAPI.getData(obj).subscribe((data: any) => {
      // console.log("data", data);
      if (data.length) {
        this.EditList = [];
        this.UpdatePono = data[0];
        this.DocDate = this.DateNepalConvertService.convertNewEngToNepaliDateObj(data[0].Doc_Date),
          this.ObjPurchase.Godown1 = data[0].Billing_To,
          this.ObjPurchase.Godown2 = data[0].Shipping_To,
          this.Alladdress(),
          this.ObjPurchase.Subledger_Address = data[0].Subledger_Address,
          this.ObjPurchase.Remarks = data[0].Remarks,
          this.ObjPurchase.Heading = data[0].Remarks1,
          this.ObjPurchase.Company_Name = data[0].Company_Name
        this.ObjPurchase.Sub_Ledger_ID = data[0].Sub_Ledger_ID,
          this.getPRno(),
          this.ObjPurchase.Address_Caption = data[0].Address_Caption,
          setTimeout(() => {
            this.getVaddress()
          }, 300);
        this.ApproverOneS = data[0].Approver_One_Status;
        this.ApproverTwoS = data[0].Approver_Two_Status;
        this.ApproverTwo = data[0].Approver_Two;
        this.ApproverOne = data[0].Approver_One;
        data.forEach(element => {
          const TempObj = {
            Product_Description: element.Product_Description,
            Product_ID: element.Product_ID,
            Purchase_Request_Qty: Number(element.Qty),
            Rate: element.Rate,
            UOM: element.UOM,
            Line_Total: element.Line_Total,
            Grant_Total: this.getTotal(),
          }
          this.ProductList.push(TempObj);
        })
      }
    })
  }
  Print(Doc) {
    if (Doc.Doc_No) {
      window.open("/Report/Crystal_Files/Nepal/Purchase_Order_Nepal.aspx?Doc_No=" + Doc.Doc_No,
        'mywindow', 'fullscreen=yes, scrollbars=auto,width=950,height=500'
      );
    }
  }
  // PoUpdate(po: any) {
  //   this.POPform = false;
  //   this.POupdateList = [];
  //   this.DocID = po.Doc_No;
  //   this.titleHeder =""
  //   if (this.DocID) {
  //     this.titleHeder = this.DocID;
  //    const obj = {
  //     "SP_String": "sp_Bl_Txn_Purchase_Order_Nepal",
  //     "Report_Name_String": "Get_Status_With_Doc_No",
  //     "Json_Param_String": JSON.stringify([{ Doc_No: this.DocID}])
  //   }
  //     this.GlobalAPI.getData(obj).subscribe((data: any) => {
  //       // console.log("data", data);
  //       if (data.length) {
  //         this.POupdateList = data;
  //         data.forEach((el: any) => {
  //           el.Status_Date = this.DateNepalConvertService.convertNewEngToNepaliDateObj(el.Status_Date);
  //         });
  //       }
  //     }) 
  //   }
  //   setTimeout(() => {
  //      this.ViewPoTypeModal = true   
  //   },600);

  // }
  UpdatePOP(){}
  // UpdatePOP() {
  //   this.POPform = true
  //   if (this.StatusForPop) {
  //     const PopData = {
  //       Doc_No: this.DocID,
  //       Status: this.StatusForPop,
  //       Posted_By: this.$CompacctAPI.CompacctCookies.User_ID
  //     }
  //     const obj = {
  //       "SP_String": "sp_Bl_Txn_Purchase_Order_Nepal",
  //       "Report_Name_String": "Update_Status_With_Doc_No",
  //       "Json_Param_String": JSON.stringify(PopData)
  //     }
  //     this.GlobalAPI.postData(obj).subscribe((data: any) => {
  //       if (data[0].Column1) {
  //         this.compacctToast.clear();
  //         this.compacctToast.add({
  //           key: "compacct-toast",
  //           severity: "success",
  //           summary:"Purchase Order Status",
  //           detail: "Succesfully Update" 
  //         });
  //         this.BrowseSearch(true);
  //       }
  //     })
  //   this.StatusForPop = undefined;
  //   this.POPform = false;
  //   this.ViewPoTypeModal = false;
    
  //   }
    
  // }
  PoDCoVault(DocNo: any){
    this.ProductPDFFile = {};
    this.ValidationNoUpload = undefined;
    if (DocNo) {
      this.ValidationNoUpload = DocNo;
      this.PODocVList = [];
      const obj = {
        "SP_String": "sp_Bl_Txn_Purchase_Order_Activity",
        "Report_Name_String": "Get_Po_Document_Vault",
        "Json_Param_String": JSON.stringify([{ PO_Doc_No: this.ValidationNoUpload }])
      }
      this.GlobalAPI.getData(obj).subscribe((data: any) => {
        //console.log("PODocVList", data);
        if (data.length) {
          this.PODocVList = data;
          data.forEach((el: any) => {
            el.Task_End_Date = this.DateNepalConvertService.convertNewEngToNepaliDateObj(el.Task_End_Date);
          });
        }
      })
      setTimeout(() => {
        this.ViewPoVaultModal = true
      }, 300);
    }
  }
  getCaption(){
    this.CaptionList = []
    this.ObjPurchase.Address_Caption = undefined;
    this.ObjPurchase.Subledger_Address = undefined
    if (this.ObjPurchase.Sub_Ledger_ID) {
      const obj = {
        "SP_String": "sp_Bl_Txn_Purchase_Order_Nepal",
        "Report_Name_String": "Get_Sub_Ledger_Address",
        "Json_Param_String": JSON.stringify([{ Sub_Ledger_ID: this.ObjPurchase.Sub_Ledger_ID }])
      }
      this.GlobalAPI.getData(obj).subscribe((data: any) => {
        // console.log("getCaption==",data)
        if (data.length) {
          data.forEach((xy: any) => {
            xy['label'] = xy.Address_Caption
            xy['value'] = xy.Address_Caption
          });
          this.CaptionList = data
        }
      });
    }
   
  }
  getCompany(){
    this.CompanyList = []
    const obj = {
      "SP_String": "sp_Bl_Txn_Purchase_Request",
      "Report_Name_String": "Get_Company_For_PO",
    }
    this.GlobalAPI.getData(obj).subscribe((data: any) => {
      if (data.length) {
        data.forEach((xy: any) => {
          xy['label'] = xy.Company_Name
          xy['value'] = xy.Company_Name
        });
        this.CompanyList = data
        // console.log("VendorList==",this.VendorList)
      }
    });
  }
  Alladdress(){
    this.ObjPurchase.Billing_Address = undefined;
    this.ObjPurchase.Shipping_Address = undefined
    if (this.ObjPurchase.Godown1) {
      const AddressTyp = this.BillingTolist.filter(items => items.Godown === this.ObjPurchase.Godown1);
      this.ObjPurchase.Billing_Address = AddressTyp[0].Billing_Address
    }
    if (this.ObjPurchase.Godown2) {
      const SAddressTyp = this.ShippingTolist.filter(items => items.Godown === this.ObjPurchase.Godown2);
      this.ObjPurchase.Shipping_Address = SAddressTyp[0].Shipping_Address
    }
  }
  getEmailId(col){
    this.toEmailList = []
    this.CCEmailList = []
    this.EmailCheck = false
    this.ToEmailSelect = undefined
    this.CCEmailSelect = undefined
    this.CompantEmailName = undefined
    if (col) {
      const obj = {
        "SP_String": "sp_Bl_Txn_Purchase_Request",
        "Report_Name_String": "Get_Subledger_Email_ID",
        "Json_Param_String": JSON.stringify([{ Sub_Ledger_ID: col }])
      }
      this.GlobalAPI.getData(obj).subscribe((data: any) => {
        // console.log("data",data)
        if (data.length) {
          data.forEach(element => {
            element['label'] = element.email,
              element['value'] = element.email
          });
          this.toEmailList = data;
          this.CCEmailList = data
        }
        else {
          this.toEmailList = [];
          this.CCEmailList = []
  
        }
        // console.log("toEmailList",this.toEmailList)
      })
    }
      
  }
  ClickCheck(){
    if (this.EmailCheck === false) {
      this.ToEmailSelect = undefined;
      this.CCEmailSelect = undefined;
      this.CompantEmailName = undefined;
    }
  }
  getCompanyMail(){
    this.CompanyEmailList = []
    const obj = {
      "SP_String": "sp_Bl_Txn_Purchase_Request",
      "Report_Name_String": "Get_Company_Email",
    }
    this.GlobalAPI.getData(obj).subscribe((data: any) => {
      //console.log("dataEmail",data)
      if (data.length) {
        data.forEach(element => {
          element['label'] = element.Email_ID,
            element['value'] = element.Email_ID
        });
        this.CompanyEmailList = data;
      }
      else {
        this.CompanyEmailList = [];
      }
    })

        
  }
  deleteEmailId(valid: any){
    this.EmailId = undefined
    if (valid.Email_ID) {
      this.EmailId = valid.Email_ID
      this.compacctToast.clear();
      this.compacctToast.add({
        key: "A",
        sticky: true,
        severity: "warn",
        summary: "Are you sure?",
        detail: "Confirm to proceed"
      });
    }
  }
  onConfirm1(){
    if (this.EmailId) {
      const obj = {
        "SP_String": "sp_Bl_Txn_Purchase_Request",
        "Report_Name_String": "Delete_Company_Email",
        "Json_Param_String": JSON.stringify([{ Email_ID: this.EmailId }])
      }
      this.GlobalAPI.getData(obj).subscribe((data: any) => {
        if (data[0].Column1) {
          this.onReject();
          this.getCompanyMail();
          this.compacctToast.clear();
          this.compacctToast.add({
            key: "compacct-toast",
            severity: 'success',
            summary: "Email ID:- " + this.EmailId,
            detail: "Succesfully Delete"
          });
        }
      })
    }
  }
  ViewCompEmail(){
    setTimeout(() => {
      this.ViewCompanyModal = true;
    }, 200);
  }
  CompCreatPopup(){
    this.NewEmailFormSubmitted = false;
    this.CompantEmailName = undefined;
    this.CreateEmailModal = true
  }
  CreateEmailType(valid){
    this.NewEmailFormSubmitted = true;
    if (valid) {
      const tempSave = {
        Email_ID: this.CompantEmailName,
      }
      const obj = {
        "SP_String": "sp_Bl_Txn_Purchase_Request",
        "Report_Name_String": "Create_Company_Email",
        "Json_Param_String": JSON.stringify([tempSave])
      }
      this.GlobalAPI.postData(obj).subscribe((data: any) => {
        if (data[0].Column1) {
          this.compacctToast.clear();
          this.compacctToast.add({
            key: "compacct-toast",
            severity: "success",
            summary: "Email ID:- " + this.CompantEmailName,
            detail: "Succesfully Created"
          });
          this.getCompanyMail();
          this.NewEmailFormSubmitted = false;
          this.CompantEmailName = undefined;
          this.CreateEmailModal = false;
        }
      })
    }

  }
  ActivityPlan(PoPlan){
    this.PoCode = undefined;
    if (PoPlan.Doc_No) {
      this.PoCode = PoPlan.Doc_No;
      setTimeout(() => {
        this.ActivityPlanModal = true
      }, 300);
      this.getPlanList(this.PoCode)
      // this.getDocList(this.PoCode)
    }
  }
  getPlanList(Docid){
    this.ToDoList = [];
    this.Doclist = []
    this.ActivityDetailsObj = {}
    const obj = {
      "SP_String": "sp_PO_Activity_Plan",
      "Report_Name_String": "Get_Activity_Plan",
      "Json_Param_String": JSON.stringify([{ Doc_No: Docid }])
    }
    this.GlobalAPI.getData(obj).subscribe((res: any) => {
     // console.log("ToDoList==", JSON.parse(res[0].topper))
      let data = JSON.parse(res[0].topper)
      this.ToDoList = data[0].hasOwnProperty("bottom_To_Do_List") ? data[0].bottom_To_Do_List : []
      this.Doclist = data[0].hasOwnProperty("bottom_Document") ? data[0].bottom_Document : []
      this.ActivityDetailsObj = data[0].bottom_Activity_Details ? data[0].bottom_Activity_Details[0] : {}
      if (Object.keys(this.ActivityDetailsObj).length != 0) {
        this.ASDate = this.ActivityDetailsObj.Activity_Statrt_Date ? this.DateNepalConvertService.convertNewEngToNepaliDateObj(this.ActivityDetailsObj.Activity_Statrt_Date) : this.DateNepalConvertService.GetNepaliCurrentDateNew();
        this.caldateTodo()
        this.caldateDoc()
      }
      else {
        this.ASDate = this.DateNepalConvertService.GetNepaliCurrentDateNew()
        this.caldateTodo()
        this.caldateDoc()
      }
    });
     
  }
  caldateTodo(){
    if (this.ToDoList.length) {
      this.ToDoList.forEach((ele: any) => {
        let engdate = this.DateNepalConvertService.convertNepaliDateToEngDate(this.ASDate)
        //console.log("engdate", engdate)
        ele['Task_End_Date'] = ele.Expected_Days ?
          this.DateNepalConvertService.convertNewEngToNepaliDateObj(new Date(new Date().setDate(new Date(engdate).getDate() + Number(ele.Expected_Days)))) :
          null;
      
      });
      
    }
  }
  caldateDoc(){
    if (this.Doclist.length) {
      this.Doclist.forEach((ele: any) => {
        let engdate = this.DateNepalConvertService.convertNepaliDateToEngDate(this.ASDate)
        ele['Task_End_Date'] = ele.Expected_Days ?
          this.DateNepalConvertService.convertNewEngToNepaliDateObj(new Date(new Date().setDate(new Date(engdate).getDate() + Number(ele.Expected_Days)))) :
          null;
        
      });
      
    }
  }
  getDocList(DocId){
    this.Doclist = []
    const obj = {
      "SP_String": "sp_PO_Activity_Plan",
      "Report_Name_String": "Get_Document_List",
      "Json_Param_String": JSON.stringify([{ Doc_No: DocId }])
    }
    this.GlobalAPI.getData(obj).subscribe((data: any) => {
     // console.log("Doclist==", data)
      if (data.length) {
        this.Doclist = data;
        this.Doclist.forEach((ele: any) => {
          ele['Task_End_Date'] = ele.Expected_Days ? this.DateNepalConvertService.convertNewEngToNepaliDateObj(new Date(new Date().setDate(new Date(this.DateNepalConvertService.convertNepaliDateToEngDate(this.ASDate)).getDate() + Number(ele.Expected_Days)))) : null;
          
        });
        
      }
    });
     
  }
  dateChToDo(i: any){
    // 
    this.caldateTodo()
  }
  dateChDocument(i: any){
    // this.Doclist[i].Task_End_Date = this.Doclist[i].Expected_Days ? this.DateNepalConvertService.convertNewEngToNepaliDateObj(new Date(new Date().setDate(new Date(this.DateNepalConvertService.convertNepaliDateToEngDate(this.ASDate)).getDate() + Number(this.Doclist[i].Expected_Days)))) : null;
    this.caldateDoc()
  }
  changeDate(e: any){
    this.ASDate = e
    this.caldateTodo()
    this.caldateDoc()
  }
  saveActivityPlan(){
    this.ActivityPlanModal = false
    this.ToDoList.forEach((ele: any) => {
      let endDate = ele.Task_End_Date ? this.DateNepalConvertService.convertNepaliDateToEngDate(ele.Task_End_Date) : null
      ele.Task_End_Date = endDate ? this.DateService.dateConvert(new Date(endDate)) : null
      if (ele.Task_End_Date) {
        ele.Status = ele.Status ? ele.Status : "PENDING"
        ele.Remarks = ele.Remarks ? ele.Remarks : "PENDING"
      }
      else {
        ele.Status = null
        ele.Remarks = null
        ele.Expected_Days = null
      }
    });
    this.Doclist.forEach((ele: any) => {
      let endDate = ele.Task_End_Date ? this.DateNepalConvertService.convertNepaliDateToEngDate(ele.Task_End_Date) : null
      ele.Task_End_Date = endDate ? this.DateService.dateConvert(new Date(endDate)) : null
      if (ele.Task_End_Date) {
        ele.Status = ele.Status ? ele.Status : "PENDING"
      }
      else {
        ele.Expected_Days = null
      }
    });
    let saveData = {
      PO_Doc_No: this.PoCode,
      Activity_Statrt_Date: this.DateService.dateConvert(this.DateNepalConvertService.convertNepaliDateToEngDate(this.ASDate)),
      Posted_By: this.$CompacctAPI.CompacctCookies.User_ID,
      bottom_To_Do: this.ToDoList,
      bottom_Document: this.Doclist
    }
    //console.log("saveData", saveData)
    //console.log("saveData", JSON.stringify(saveData))
    const obj = {
      "SP_String": "sp_Bl_Txn_Purchase_Order_Activity",
      "Report_Name_String": "Create_PO_Activity",
      "Json_Param_String": JSON.stringify([saveData])
    }
    this.GlobalAPI.getData(obj).subscribe((data: any) => {
      if (data[0].Column1 == "Done") {
        this.compacctToast.clear();
        this.compacctToast.add({
          key: "compacct-toast",
          severity: "success",
          detail: "Succesfully Created"
        });
      }
    })
  }
  getColor(Document_Status){
    //console.log("Document_Status",Document_Status)
    switch (Document_Status) {
      case 'PENDING':
        return 'blue';
      case 'PENDING AND CROSSED TARGET DATE':
        return 'red';
      case 'COMPLETED WITHIN TARGET DATE':
        return 'green';
      case 'COMPLETED BUT NOT IN TARGET DATE':
        return 'orange';
    }
  }
  handleFileSelect(event: any, DOC: any, Date: any){
    //console.log("event", event)
   // console.log("DOC", DOC)
   // console.log("Date", Date)
    this.PDFFlag = false;
    this.ProductPDFFile = {};
    this.DocIdD = undefined;
    this.DocUplodeDate = undefined
    if (event) {
      this.ProductPDFFile = event.files[0];
      this.DocIdD = DOC
      this.DocUplodeDate = Date
      this.PDFFlag = true;
      this.SaveUploadDoc()
    }
  }
  SaveUploadDoc(){
    if (this.ProductPDFFile['size']) {
      this.ngxService.start();
      this.GlobalAPI.CommonFileUpload(this.ProductPDFFile)
        .subscribe((data: any) => {
          //console.log("eventdata", data)
          if (data.file_url) {
            this.saveDocFinal(data.file_url)
          }
          else {
            this.compacctToast.clear();
            this.compacctToast.add({
              key: "compacct-toast",
              severity: "error",
              summary: "Error",
              detail: "Fail to upload"
            });
          }
        })
    }
  }
  saveDocFinal(fileUrl){
    const tempSaveDataObj = {
      PO_Doc_No: this.ValidationNoUpload,
      Document_ID: this.DocIdD,
      File_Path: fileUrl,
      Task_End_Date: this.DateNepalConvertService.convertNepaliDateToEngDate(this.DocUplodeDate)
    }
    const obj = {
      "SP_String": "sp_Bl_Txn_Purchase_Order_Activity",
      "Report_Name_String": "Update_For_Upload_Document",
      "Json_Param_String": JSON.stringify(tempSaveDataObj)
    }
    this.GlobalAPI.postData(obj).subscribe((data: any) => {
     // console.log("file save data", data);
      if (data[0].Column1) {
        this.PDFFlag = false;
        this.ProductPDFFile = {};
        this.PoDCoVault(this.ValidationNoUpload)
        this.fileInput.clear();
        this.compacctToast.clear();
        this.compacctToast.add({
          key: "compacct-toast",
          severity: "success",
          detail: "File Succesfully Upload"
        });
        this.ngxService.stop();
      }
      else {
        this.ngxService.stop();
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
  DownloadFile(UrlAll){
    //console.log("UrlAll", UrlAll)
    window.open(UrlAll)
  }
  ToDoUpdate(PODoc: any){
    this.UpdatePopIdDoc = PODoc;
    this.getTodoPanding(this.UpdatePopIdDoc);
    this.getTodoView(this.UpdatePopIdDoc);
    setTimeout(() => {
      this.viewTodoModal = true;
      this.tabIndex = 0;
    },700);
  }
  getTodoPanding(Doc){
    this.PendingList = []
    const obj = {
      "SP_String": "sp_Bl_Txn_Purchase_Order_Activity",
      "Report_Name_String": "Get_Pending_To_Do",
      "Json_Param_String": JSON.stringify([{ PO_Doc_No: Doc }])
    }
    this.GlobalAPI.getData(obj).subscribe((data: any) => {
      if (data.length) {
        data.forEach((xy: any) => {
          xy['label'] = xy.Status_Name
          xy['value'] = xy.Status_ID
        });
        this.PendingList = data
        // console.log("VendorList==",this.VendorList)
      }
    });
  }
  getTodoView(TODoc){
    this.dataList = [];
    this.backUPdataList = [];
    const obj = {
      "SP_String": "sp_Bl_Txn_Purchase_Order_Activity",
      "Report_Name_String": "Get_To_Do_with_Doc_No",
      "Json_Param_String": JSON.stringify([{ PO_Doc_No: TODoc }])
    }
    this.GlobalAPI.getData(obj).subscribe((data: any) => {
      if (data.length) {
        this.dataList = data;
        this.backUPdataList = data;
        data.forEach((y: any) => {
          y.Task_End_Date = this.DateNepalConvertService.convertNewEngToNepaliDateObj(y.Task_End_Date);
          y.Completed_On = this.DateNepalConvertService.convertNewEngToNepaliDateObj(y.Completed_On)
        });
       // console.log("dataList==", this.dataList)
        this.GetDistinct()
      }
    });
  }
  GetDistinct(){
    let Status:any = [];
    this.DistPresentStatus = [];
    this.dataList.forEach((item) => {
  if (Status.indexOf(item.Last_Status) === -1) {
    Status.push(item.Last_Status);
  this.DistPresentStatus.push({ label: item.Last_Status, value: item.Last_Status });
  }
  });
    this.backUPdataList = [...this.dataList];
  }
  FilterDist(){
    let PresentStatus: any = [];
    let SearchFields:any =[];
  if (this.SelectedDistPresentStatus.length) {
    SearchFields.push('Last_Status');
    PresentStatus = this.SelectedDistPresentStatus;
  }
  this.dataList = [];
  if (SearchFields.length) {
    let LeadArr = this.backUPdataList.filter(function (e) {
      return (PresentStatus.length ? PresentStatus.includes(e['Last_Status']) : true) 
    });
  this.dataList = LeadArr.length ? LeadArr : [];
  } else {
  this.dataList = [...this.backUPdataList] ;
  }

  }
  DetailsPoUp(Valid: any){
    this.StatusID = Valid.Status_ID;
    this.POid = Valid.PO_Doc_No;
    this.getTodoName(this.StatusID, this.POid)
    setTimeout(() => {
      this.ViewTOdoNameModal = true
    }, 700);
  }
  getTodoName(Typeof, ONtype){
    this.todoNameList = []
    const temData = {
      PO_Doc_No: ONtype,
      Status_ID: Typeof
    }
    const obj = {
      "SP_String": "sp_Bl_Txn_Purchase_Order_Activity",
      "Report_Name_String": "Get_To_Do_with_Doc_No_Details",
      "Json_Param_String": JSON.stringify([temData])
    }
    this.GlobalAPI.getData(obj).subscribe((data: any) => {
      if (data.length) {
        this.todoNameList = data;
        data.forEach((yr: any) => {
          yr.Posted_On = this.DateNepalConvertService.convertNewEngToNepaliDateObj(yr.Posted_On);
        });
        //console.log("todoNameList==",this.todoNameList)
      }
    });
  }
  UpdateFormPop(valid: any){
    this.TodoForm = true;
    if (valid) {
      const FilterData = this.PendingList.filter(items => items.Status_ID === this.PendingTodo);
      const ArrData = {
        PO_Doc_No:this.UpdatePopIdDoc,  
        Status_ID	:this.PendingTodo,			
        Last_Status	:this.StatusDetails,
        Last_Remarks:this.RemarksDetails,	
        Posted_By	:this.$CompacctAPI.CompacctCookies.User_ID,
        Task_End_Date: this.DateService.dateConvert(FilterData[0].Task_End_Date),
      }
      const obj = {
        "SP_String": "sp_Bl_Txn_Purchase_Order_Activity",
        "Report_Name_String": "Update_To_Do_Status",
        "Json_Param_String": JSON.stringify(ArrData)
      }
      this.GlobalAPI.postData(obj).subscribe((data: any) => {
        if (data[0].Column1) {
          this.compacctToast.clear();
          this.compacctToast.add({
            key: "compacct-toast",
            severity: "success",
            summary:"TO-DO List",
            detail: "Succesfully Update" ,
          });
          this.tabIndex = 0;
          this.items1 = ["TO-DO View", "TO-DO Update"];
          this.TodoForm = false;
          this.PendingTodo = undefined;
          this.StatusDetails = undefined;
          this.RemarksDetails = undefined;
          this.getTodoView(this.UpdatePopIdDoc);
        }
      })
    }
  }
  ColourInfo(){
    this.ColorModel = true
  }
  Emailpop(path: any){
    this.pathURl = undefined;
    this.EmailSendModel = true;
    this.EmailUpdate = undefined;
    this.EmailFormSubmitted = false;
    if (path) {
      this.pathURl = path;  
    }
  }
  SaveEmail(valid){
    this.EmailFormSubmitted = true
    if (valid) {
      const eMail = {
        Url: this.pathURl,
        Email: this.EmailUpdate
      }
      this.EmailSendModel = false;
      console.log("eMail",eMail)
    }
  }
}
  // toEmailChange(){
  //   console.log("toEmailList", this.toEmailList)
  //   console.log("CCEmailList",this.CCEmailList)
  //   const bckp = this.toEmailList
  //   const toEmailListFilter = bckp.find((el: any) => el.email === this.ToEmailSelect)
  //   if (toEmailListFilter) {
  //     this.CCEmailList.splice(0, 1);
  //     this.CCEmailList = this.CCEmailList.length ? this.CCEmailList : []
  //   }
  // }
class Purchase{
Doc_No :any;	            
Purchase_Request_No	:any;	
Doc_Date:any;	           
Cost_Center_ID: any = 2;	
Godown1: any;
Godown2: any;
Sub_Ledger_ID	:any;
Product_ID:any;	  	
Qty	:any = 0;       
UOM	:any;
Rate:any = 0;	           
Line_Total	:number;
Grant_Total:number;	
Remarks:any;	     
Heading: any;
Address_Caption: any;  
Subledger_Address: any;
Company_Name: any;
Shipping_Address: any;
Billing_Address:any
}
