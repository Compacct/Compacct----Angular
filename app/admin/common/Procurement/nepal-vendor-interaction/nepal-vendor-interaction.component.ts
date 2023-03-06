import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MessageService } from 'primeng/api';
import { DateTimeConvertService } from '../../../shared/compacct.global/dateTime.service';
import { CompacctCommonApi } from '../../../shared/compacct.services/common.api.service';
import { CompacctHeader } from '../../../shared/compacct.services/common.header.service';
import { CompacctGlobalApiService } from '../../../shared/compacct.services/compacct.global.api.service';
import { DateNepalConvertService } from "../../../shared/compacct.global/dateNepal.service"

@Component({
  selector: 'app-nepal-vendor-interaction',
  templateUrl: './nepal-vendor-interaction.component.html',
  styleUrls: ['./nepal-vendor-interaction.component.css'],
  providers: [MessageService] ,
  encapsulation: ViewEncapsulation.None
})
export class NepalVendorInteractionComponent implements OnInit {
  tabIndexToView: number = 0;
  items :any = [];
  VendorList: any= [];
  VendorDetails: any= [];
  VendorAddressDetails: any= [];
  Searchedlist: any= [];
  allDetalisHeader: any=[];
  DocumentPendingList: any= [];
  DocumentDetalisHeader: any= [];
  ProductPurchasedList: any=[];
  ProductDetalisHeader: any= [];


  ObjVendorInteraction: VendorInteraction = new VendorInteraction();
  constructor(
    private $http: HttpClient,
    private GlobalAPI: CompacctGlobalApiService,
    private Header: CompacctHeader,
    private DateService: DateTimeConvertService,
    private DateNepalConvertService : DateNepalConvertService,
    public $CompacctAPI: CompacctCommonApi,
    private compacctToast: MessageService,
  ) { }

  ngOnInit() {
    this.items = ["Vendor Details", "Purchase Order", "Doucment Pending", "Product Purchased"];
    this.Header.pushHeader({
      Header: "Vendor Interaction Managemnet",
      Link: " Procurement ->  Vendor Interaction Managemnet"
    });
    this.getVendorList();
  }

  TabClick(e) {
    this.tabIndexToView = e.index;
    this.items = ["Vendor Details", "Purchase Order", "Doucment Pending", "Product Purchased"];
  }

  getVendorList(){
    this.VendorList = [];
    const obj = {
      "SP_String": "sp_Bl_Txn_Requisition_From_Salesman",
      "Report_Name_String": "Get_Sub_Ledger_For_Purchase"
  
   }
   this.GlobalAPI.getData(obj).subscribe((data:any)=>{
    // console.log("Get Vendor",data);
    if(data.length) {
        data.forEach(element => {
          element['label'] = element.Sub_Ledger_Name,
          element['value'] = element.Sub_Ledger_ID
        });
       this.VendorList = data;
      }
       else {
        this.VendorList = [];
      }
   });
  }

  getVendorDetails(){
    if(this.ObjVendorInteraction.Vendor_Name){
      const TempObj={
        Sub_Ledger_ID: this.ObjVendorInteraction.Vendor_Name
      }
      // console.log("Sub_Ledger_ID",TempObj);

      const obj = {
        "SP_String": "SP_BL_Txn_Vendor_Interaction",
        "Report_Name_String": "Get_Subledger_Details",
        "Json_Param_String": JSON.stringify(TempObj)
      }

      this.GlobalAPI.getData(obj).subscribe((data: any) => {
        // console.log("Get_Subledger_Details",data);
        this.VendorDetails=data[0];

        this.ObjVendorInteraction.Sub_Ledger_Mobile_No= this.VendorDetails.Sub_Ledger_Mobile_No;
        this.ObjVendorInteraction.Mobile_No2= this.VendorDetails.Mobile_No2;
        this.ObjVendorInteraction.Sub_Ledger_Email= this.VendorDetails.Sub_Ledger_Email;
        this.ObjVendorInteraction.Email2= this.VendorDetails.Email2;
        this.ObjVendorInteraction.Sub_Ledger_PAN_No= this.VendorDetails.Sub_Ledger_PAN_No;
        this.ObjVendorInteraction.Sub_Ledger_Address_1= this.VendorDetails.Sub_Ledger_Address_1;
        this.ObjVendorInteraction.IS_SEZ= this.VendorDetails.IS_SEZ  ? 'Yes' : 'No';

        this.getVendorAddressDetails();
        this.BrowsePurchaseOrder();
        this.getDocumentPending();
        this.getProductPurchased();
      });
    }
    else{
      this.ClearData();
    }
  }

  getVendorAddressDetails(){
    const TempObj={
      Sub_Ledger_ID: this.ObjVendorInteraction.Vendor_Name
    }
    // console.log("Sub_Ledger_ID",TempObj);

    const obj = {
      "SP_String": "SP_BL_Txn_Vendor_Interaction",
      "Report_Name_String": "Get_Sub_Ledger_Address_Details",
      "Json_Param_String": JSON.stringify(TempObj)
    }
    this.GlobalAPI.getData(obj).subscribe((data: any) => {
      // console.log("Get_Subledger_Address_Details",data);
      this.VendorAddressDetails= data[0];

      this.ObjVendorInteraction.Address_1= this.VendorAddressDetails.Address_1;
      this.ObjVendorInteraction.Address_Caption= this.VendorAddressDetails.Address_Caption;
      this.ObjVendorInteraction.Country= this.VendorAddressDetails.Country;

    });

  }

  BrowsePurchaseOrder(){
    this.Searchedlist=[];

    const TempObj={
      Sub_Ledger_ID: this.ObjVendorInteraction.Vendor_Name
    }
    //  console.log("Sub_Ledger_ID",TempObj);

    const obj = {
      "SP_String": "SP_BL_Txn_Vendor_Interaction",
      "Report_Name_String": "Get_Purchase_Order_Grid",
      "Json_Param_String": JSON.stringify(TempObj)
    }

    this.GlobalAPI.getData(obj).subscribe((data: any) => {
      // console.log("BrowsePurchaseOrder",data);
      if(data.length){
        this.Searchedlist = data;
        this.allDetalisHeader = Object.keys(data[0])
         data.forEach((y:any) => {
         y.Doc_Date = this.DateNepalConvertService.convertNewEngToNepaliDateObj(y.Doc_Date);
        });
      // console.log("Searchedlist",this.Searchedlist);
      }
    });
  }

  GetPrint(col){

    if (col.Doc_No) {
      const obj = {
        "SP_String": "SP_BL_Txn_Vendor_Interaction",
        "Report_Name_String": "Get_Purchase_Order_print_link"
      }

      this.GlobalAPI.getData(obj).subscribe((data: any) => {
        // console.log("Print data",data);
        let PdfLink= data[0].Column1;

        window.open(PdfLink + col.Doc_No, 'mywindow', 'fullscreen=yes, scrollbars=auto,width=950,height=500');
      });
    }

  }

  getDocumentPending(){
    this.DocumentPendingList= [];
    const TempObj={
      Sub_Ledger_ID: this.ObjVendorInteraction.Vendor_Name
    }
    //  console.log("Sub_Ledger_ID",TempObj);

    const obj = {
      "SP_String": "SP_BL_Txn_Vendor_Interaction",
      "Report_Name_String": "Get_Purchase_Order_Document_Pending",
      "Json_Param_String": JSON.stringify(TempObj)
    }

    this.GlobalAPI.getData(obj).subscribe((data: any) => {
      // console.log("getDocumentPending",data);
      if(data.length){
        this.DocumentPendingList = data;
        this.DocumentDetalisHeader = Object.keys(data[0])
         data.forEach((y:any) => {
         y.Task_End_Date = this.DateNepalConvertService.convertNewEngToNepaliDateObj(y.Task_End_Date);
        });
      // console.log("DocumentPendingList",this.DocumentPendingList);
      }
    });
  }

  getColor(Document_Status) {
    // console.log("Document_Status",Document_Status);
    switch (Document_Status) {
      case 'PENDING':
        return 'blue';
      case 'PENDING AND CROSSED TARGET DATE':
        return 'red';
    }
  }

  getProductPurchased(){
    this.ProductPurchasedList= [];
    const TempObj={
      Sub_Ledger_ID: this.ObjVendorInteraction.Vendor_Name
    }
    //  console.log("Sub_Ledger_ID",TempObj);

    const obj = {
      "SP_String": "SP_BL_Txn_Vendor_Interaction",
      "Report_Name_String": "Get_Purchase_Order_Products",
      "Json_Param_String": JSON.stringify(TempObj)
    }

    this.GlobalAPI.getData(obj).subscribe((data: any) => {
      // console.log("getDocumentPending",data);
      if(data.length){
        this.ProductPurchasedList = data;
        this.ProductDetalisHeader = Object.keys(data[0])
         data.forEach((y:any) => {
         y.Doc_Date = this.DateNepalConvertService.convertNewEngToNepaliDateObj(y.Doc_Date);
        });
      // console.log("ProductPurchasedList",this.ProductPurchasedList);
      }
    });
  }

  onConfirm(){
  }

  onReject(){
    this.compacctToast.clear("c");
  }

  ClearData(){
    this.ObjVendorInteraction = new VendorInteraction();
    this.Searchedlist = [];
    this.DocumentPendingList = [];
    this.ProductPurchasedList = [];
  }


}

class VendorInteraction{
  Vendor_Name: any;
  Sub_Ledger_Mobile_No: any;
  Mobile_No2: any;
  Sub_Ledger_Email: any;
  Email2: any;
  Sub_Ledger_PAN_No: any;
  IS_SEZ: any;
  Sub_Ledger_Address_1: any;
  Address_1: any;
  Address_Caption: any;
  Country: any;
}
