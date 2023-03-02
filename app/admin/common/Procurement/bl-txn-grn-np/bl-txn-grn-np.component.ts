import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MessageService } from 'primeng/api';
import { DateTimeConvertService } from '../../../shared/compacct.global/dateTime.service';
import { CompacctCommonApi } from '../../../shared/compacct.services/common.api.service';
import { CompacctHeader } from '../../../shared/compacct.services/common.header.service';
import { CompacctGlobalApiService } from '../../../shared/compacct.services/compacct.global.api.service';
import { DateNepalConvertService } from "../../../shared/compacct.global/dateNepal.service"
@Component({
  selector: 'app-bl-txn-grn-np',
  templateUrl: './bl-txn-grn-np.component.html',
  styleUrls: ['./bl-txn-grn-np.component.css'],
  providers: [MessageService],
  encapsulation: ViewEncapsulation.None
})
export class BLTxnGrnNPComponent implements OnInit {
  tabIndexToView: number = 0;
  items: any = [];
  buttonname: string = "Create";
  ObjGRN: GRN = new GRN();
  GRNcreatFormSubmitted: boolean = false;
  GRNcreatFormSearch: boolean = false;
  PendingGRNFormSearch: boolean = false;
  GRN_Date: any = {} ;
  SEDate: any = {};
  INVDate: any = {};
  companyListBrowse: any = [];
  companyListPending: any = [];
  Supplierlist: any = [];
  CostCenterlist: any = [];
  Godownlist: any = [];
  POList :any =[];
  Spinner: boolean = false;
  BottomList: any = [];
  PO_Date: any = undefined;
  masterDoc: any = undefined;
  COmpany_NameBrowse: any = undefined;
  COmpany_NamePending : any = undefined;
  BrowseStartDate: any = {};
  BrowseEndDate: any = {};
  PendingStartDate: any = {};
  PendingEndDate: any = {};
  Searchedlist: any = [];
  PendingSearchedlist: any = [];
  GRNEdit: any = undefined;
  GRNEPending: any = undefined;
  readonly: boolean = false;
  constructor(
    private $http: HttpClient,
    private GlobalAPI: CompacctGlobalApiService,
    private Header: CompacctHeader,
    private DateService: DateTimeConvertService,
    private DateNepalConvertService : DateNepalConvertService,
    public $CompacctAPI: CompacctCommonApi,
    private compacctToast: MessageService,
  ) {}

  ngOnInit() {
    this.items = ["Browse", "Create", "Pending PO"];
    this.Header.pushHeader({
      Header: "GRN ",
      Link: " Procurement -> Transaction->  GRN "
    });
    this.GRN_Date = this.DateNepalConvertService.GetNepaliCurrentDateNew(); 
    this.SEDate = this.DateNepalConvertService.GetNepaliCurrentDateNew();
    this.INVDate = this.DateNepalConvertService.GetNepaliCurrentDateNew();
    this.BrowseStartDate =this.DateNepalConvertService.GetNepaliCurrentDateNew();
    this.BrowseEndDate = this.DateNepalConvertService.GetNepaliCurrentDateNew();
    this.PendingStartDate = this.DateNepalConvertService.GetNepaliCurrentDateNew();;
    this.PendingEndDate = this.DateNepalConvertService.GetNepaliCurrentDateNew();;
    this.GetCompany();
    this.GetSuplyer();
    this.GetCostCenter();
    this.GetGowdown();
  }
  TabClick(e) {
    this.tabIndexToView = e.index;
     this.items = ["Browse", "Create", "Pending PO"];
    this.ClearData();
    this.buttonname = "Create";
  }
  ClearData() {
    const TempObj = {...this.ObjGRN}
    this.ObjGRN = new GRN();
    this.ObjGRN.Cost_Cen_Name = TempObj.Cost_Cen_Name;
    this.ObjGRN.Cost_Cen_ID = TempObj.Cost_Cen_ID;
    this.GRNcreatFormSubmitted = false;
    this.GRNcreatFormSearch = false;
    this.PendingGRNFormSearch= false;
    this.GRN_Date = this.DateNepalConvertService.GetNepaliCurrentDateNew(); 
    this.SEDate = this.DateNepalConvertService.GetNepaliCurrentDateNew();
    this.INVDate = this.DateNepalConvertService.GetNepaliCurrentDateNew();
    this.PO_Date = undefined;
    this.BottomList = [];
    this.readonly = false;
    this.GRNEdit = undefined;
    this.Searchedlist = [];
    this.PendingSearchedlist = [];
  }
  GetCompany() {
    this.companyListBrowse = [];
    this.companyListPending = [];
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
        this.companyListBrowse = data
        this.companyListPending =data
        // console.log("VendorList==",this.VendorList)
      }
    }); 
  }
  GetSuplyer() {
    this.Supplierlist = [];
    this.POList = [];
    this.ObjGRN.PO_Number = undefined;
    this.ObjGRN.Company_Name = undefined;
    this.BottomList = [];
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
        this.Supplierlist = data
       // console.log("VendorList==",this.Supplierlist)
      }
    }); 
  }
  GetCostCenter() {
   // this.CostCenterlist = []
    this.ObjGRN.Cost_Cen_Name = undefined;
    const obj = {
      "SP_String": "sp_Bl_Txn_GRN_Np",
      "Report_Name_String": "Get_Cost_Center",
    }
    this.GlobalAPI.getData(obj).subscribe((data: any) => {
      if (data.length) {
        // data.forEach((xy: any) => {
        //   xy['label'] = xy.Cost_Cen_Name
        //   xy['value'] = xy.Cost_Cen_ID
        // });
        //this.CostCenterlist = data
        this.ObjGRN.Cost_Cen_Name = data[0].Cost_Cen_Name,
        this.ObjGRN.Cost_Cen_ID = data[0].Cost_Cen_ID
          //console.log("this.ObjGRN.Cost_Cen_Name==", this.ObjGRN.Cost_Cen_Name)
         // console.log("this.ObjGRN.Cost_Cen_ID==",this.ObjGRN.Cost_Cen_ID)
      }
    }); 
  }
  GetGowdown() {
    this.Godownlist = []
    const obj = {
      "SP_String": "sp_Bl_Txn_Purchase_Order_Nepal",
      "Report_Name_String": "Get_Godown_Details",
    }
    this.GlobalAPI.getData(obj).subscribe((data: any) => {
      if (data.length) {
        data.forEach((xy: any) => {
          xy['label'] = xy.Godown
          xy['value'] = xy.Godown_ID
        });
        this.Godownlist = data
       // console.log("VendorList==",this.Supplierlist)
      }
    }); 
  }
  GetPO() {
    this.POList = [];
    this.PO_Date = undefined;
    this.ObjGRN.PO_Number = undefined;
    this.ObjGRN.Company_Name = undefined;
    this.BottomList = [];
    const obj = {
      "SP_String": "sp_Bl_Txn_GRN_Np",
      "Report_Name_String": "Get_PO_No",
      "Json_Param_String": JSON.stringify([{ Sub_Ledger_ID : this.ObjGRN.Sub_Ledger_ID}])
    }
    this.GlobalAPI.getData(obj).subscribe((data: any) => {
      if (data.length) {
        data.forEach((xy: any) => {
          xy['label'] = xy.Doc_No
          xy['value'] = xy.Doc_No
        });
        this.POList = data;
        //console.log("POList==",this.POList)
      }
    });   
  }
  GetGridList() {
    this.BottomList = [];
    const obj = {
      "SP_String": "sp_Bl_Txn_GRN_Np",
      "Report_Name_String": "Get_Product_With_PO_No",
      "Json_Param_String": JSON.stringify([{ Doc_No : this.ObjGRN.PO_Number}])
    }
    this.GlobalAPI.getData(obj).subscribe((data: any) => {
      if (data.length) {
        this.BottomList = data
         this.BottomList.forEach(ele => {
        ele.Total_Amount = Number(ele.Challan_Qty) * Number(ele.Rate)
         });
               // console.log("BottomList==", this.BottomList)  
      }
      this.GetPODate();  
    });  
  }
  GetPODate() {
    if (this.ObjGRN.PO_Number) {
      const Fillter = this.POList.filter((el: any) => el.Doc_No == this.ObjGRN.PO_Number)
      this.PO_Date = this.DateNepalConvertService.convertEngDateToNepaliDateObj(Fillter[0].PO_Date);
      this.ObjGRN.Company_Name = Fillter[0].Company_Name;
    }
    else {
      this.PO_Date = undefined;
       this.ObjGRN.Company_Name = undefined;
    }
  }
  SaveGRN(valid:any) {
    this.GRNcreatFormSubmitted = true;
    let ArrData: any = [];
    const filtergdwn = this.Godownlist.filter((go: any) => Number(go.Godown_ID) == Number(this.ObjGRN.Godown_ID));
    if (valid && this.BottomList.length) {
        this.BottomList.forEach(element => {
        const TempObj = {
          Sub_Ledger_ID: this.ObjGRN.Sub_Ledger_ID,
          Cost_Cen_ID: this.ObjGRN.Cost_Cen_ID,
          godown_id: this.ObjGRN.Godown_ID,
          godown : filtergdwn[0].Godown,
          SE_No: this.ObjGRN.SE_No,
          SE_Date: this.DateService.dateConvert(this.DateNepalConvertService.convertNepaliDateToEngDate(this.SEDate)),
          PO_Doc_No: this.ObjGRN.PO_Number,
          PO_Doc_Date: this.DateService.dateConvert(this.DateNepalConvertService.convertNepaliDateToEngDate(this.PO_Date)),
          Inv_No: this.ObjGRN.INV_No,
          Inv_Date: this.DateService.dateConvert(this.DateNepalConvertService.convertNepaliDateToEngDate(this.INVDate)),
          Mode_Of_transport: this.ObjGRN.Mode_Of_transport,
          LR_No_Date: this.ObjGRN.LR_No_Date,
          Vehicle_No: this.ObjGRN.Vehicle_No,
          Product_ID: element.Product_ID,
          HSN_Code: 0,
          UOM: element.UOM,
          Challan_Qty: Number(element.Challan_Qty),
          Received_Qty: Number(element.Received_Qty),
          Rate: Number(element.Rate),
          Total_Tax_Amount: Number(element.Total_Amount),
          Total_Amount: Number(element.Total_Amount),
          Remarks: this.ObjGRN.Remarks,
          Created_By: this.$CompacctAPI.CompacctCookies.User_ID,
          Status: "GRN_enterd",
          GRN_NO: this.GRNEdit ? this.GRNEdit: "A",
          GRN_Date: this.DateService.dateConvert(this.DateNepalConvertService.convertNepaliDateToEngDate(this.GRN_Date)),
          Company_Name: this.ObjGRN.Company_Name,
          PO_QTY: Number(element.PO_Qty),
          Pending_PO_QTY: Number(element.Pending_PO_Qty),
        }
        ArrData.push(TempObj)
       // console.log("ArrData", ArrData)
      });
        const obj = {
        "SP_String": "sp_Bl_Txn_GRN_Np",
        "Report_Name_String": "Create_BL_Txn_Purchase_Challan_GRN",
        "Json_Param_String": JSON.stringify(ArrData)
      }
      this.GlobalAPI.postData(obj).subscribe((data: any) => {
        if (data[0].Column1) {
          this.compacctToast.clear();
          this.compacctToast.add({
            key: "compacct-toast",
            severity: "success",
            summary:"GRN-No ="+ data[0].Column1,
            detail: "Succesfully" + this.buttonname,
          });
          this.tabIndexToView = 0;
          this.ObjGRN = new GRN();
          this.GRNcreatFormSubmitted = false;
          this.items = ["Browse", "Create", "Pending PO"];
          this.BottomList = [];
        }
      }) 
      }   
  
  }
  onReject() {
  this.compacctToast.clear("c");
  }
  delete(index) {
  this.BottomList.splice(index, 1);
  }
  getTotal(i: any) {
    this.getvalid(i) 
    if (Number(this.BottomList[i].Challan_Qty) <= Number(this.BottomList[i].Pending_PO_Qty) ) {
     this.BottomList[i].Total_Amount = (Number(this.BottomList[i].Challan_Qty) * Number(this.BottomList[i].Rate)).toFixed(2)  
    }
    else {
      this.BottomList[i].Challan_Qty = 0
      this.BottomList[i].Total_Amount = 0
       this.compacctToast.clear();
          this.compacctToast.add({
            key: "compacct-toast",
            severity: "error",
            summary: "Invalid Typing",
            detail: "Challan Qty Not More Than Pending QTY"
          });
    }  
  }
  getvalid(i: any) {
    if (Number(this.BottomList[i].Received_Qty) > Number(this.BottomList[i].Challan_Qty)) { 
      this.BottomList[i].Received_Qty = 0
       this.compacctToast.clear();
          this.compacctToast.add({
            key: "compacct-toast",
            severity: "error",
            summary: "Invalid Typing",
            detail: "Received Qty Not More Than Challan Qty"
          }); 
    } 
  //  else {
  //     this.BottomList[i].Received_Qty = Number(this.BottomList[i].Received_Qty)
  //   }
  }
  BrowseSearch(valid:any){
    this.GRNcreatFormSearch = true;
    this.Searchedlist = [];
    if(valid){
      const tempobj = {
        From_date : this.DateService.dateConvert(this.DateNepalConvertService.convertNepaliDateToEngDate(this.BrowseStartDate)),
        To_date: this.DateService.dateConvert(this.DateNepalConvertService.convertNepaliDateToEngDate(this.BrowseEndDate)),
        Company_Name :this.COmpany_NameBrowse
      }
      const obj = {
        "SP_String": "sp_Bl_Txn_GRN_Np",
        "Report_Name_String": "Browse_BL_Txn_Purchase_Challan_GRN",
        "Json_Param_String": JSON.stringify([tempobj])
      }
      this.GlobalAPI.getData(obj).subscribe((data: any) => {
        if (data.length) {
         data.forEach((y:any) => {
          y.GRN_Date = this.DateNepalConvertService.convertEngToNepaliFormatDateObj(y.GRN_Date);
          });
          this.Searchedlist = data;
          this.GRNcreatFormSearch = true;
       // console.log("Searchedlist",this.Searchedlist)
        }
      })
    }
  }
  PendingGRNSearch(valid:any){
  this.PendingGRNFormSearch = true;
    this.PendingSearchedlist = [];
    if(valid){
      const tempobj = {
        From_date : this.DateService.dateConvert(this.DateNepalConvertService.convertNepaliDateToEngDate(this.PendingStartDate)),
        To_date: this.DateService.dateConvert(this.DateNepalConvertService.convertNepaliDateToEngDate(this.PendingEndDate)),
        Company_Name :this.COmpany_NamePending
      }
      const obj = {
        "SP_String": "sp_Bl_Txn_GRN_Np",
        "Report_Name_String": "Get_Data_Pending_PO_Tab",
        "Json_Param_String": JSON.stringify([tempobj])
      }
      this.GlobalAPI.getData(obj).subscribe((data: any) => {
        if (data.length) {
         data.forEach((y:any) => {
          y.PO_Date = this.DateNepalConvertService.convertEngToNepaliFormatDateObj(y.PO_Date);
          });
          this.PendingSearchedlist = data;
          this.PendingGRNFormSearch = true;
        //console.log("PendingSearchedlist",this.PendingSearchedlist)
        }
      })
    } 
  }
  DeleteBrowse(DocID) {
    this.masterDoc = undefined;
    if (DocID.GRN_No) {
      this.masterDoc = DocID.GRN_No;
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
        "SP_String": "sp_Bl_Txn_GRN_Np",
        "Report_Name_String": "Delete_BL_Txn_Purchase_Challan_GRN",
        "Json_Param_String": JSON.stringify([{GRN_No: this.masterDoc,Created_By: this.$CompacctAPI.CompacctCookies.User_ID}])
      }
      this.GlobalAPI.getData(obj).subscribe((data: any) => {
        if (data[0].Column1) {
          this.compacctToast.clear();
          this.compacctToast.add({
            key: "compacct-toast",
            severity: "success",
            summary: "GRN No: " + this.masterDoc,
            detail: "Succesfully Deleted" 
          });
          this.BrowseSearch(true);
        }
      })
    }
  }
  EditBrowse(Update) {
    if (Update.GRN_No) {
      this.GRNEdit = undefined;
      this.tabIndexToView = 1;
      this.items = ["Browse", "Update", "Pending PO"];
      this.buttonname = "Update";
      this.GRNEdit = Update.GRN_No
      this.GetEdit(this.GRNEdit)
    }
  }
  GetEdit(Uid) {
    const obj = {
      "SP_String": "sp_Bl_Txn_GRN_Np",
      "Report_Name_String": "Get_Data_For_GRN_Edit",
      "Json_Param_String": JSON.stringify([{ GRN_No: Uid }])
    }
    this.GlobalAPI.getData(obj).subscribe((data: any) => {
       console.log("EDitdata", data);
      if (data.length) {
        this.GRN_Date = this.DateNepalConvertService.convertNewEngToNepaliDateObj(data[0].GRN_Date),
          this.ObjGRN.Company_Name = data[0].company_name,
          this.ObjGRN.Sub_Ledger_ID = data[0].Sub_Ledger_ID,
          this.ObjGRN.Sub_Ledger_Name = data[0].Sub_Ledger_Name,
          this.ObjGRN.Cost_Cen_ID = data[0].Cost_Cen_ID,
          this.GetCostCenter();
          this.ObjGRN.Godown_ID = data[0].godown_id,
          this.ObjGRN.SE_No = data[0].SE_No,
          this.SEDate = this.DateNepalConvertService.convertNewEngToNepaliDateObj(data[0].SE_Date),
          this.ObjGRN.INV_No = data[0].Inv_No,
          this.INVDate = this.DateNepalConvertService.convertNewEngToNepaliDateObj(data[0].Inv_Date),
          this.ObjGRN.Mode_Of_transport = data[0].Mode_Of_transport,
          this.ObjGRN.LR_No_Date = data[0].LR_No_Date,
          this.ObjGRN.Vehicle_No = data[0].Vehicle_No,
          this.ObjGRN.PO_Number = data[0].PO_Doc_No;
          this.PO_Date = this.DateNepalConvertService.convertNewEngToNepaliDateObj(data[0].PO_Doc_Date),
          this.ObjGRN.Remarks = data[0].Remarks;
        data.forEach(element => {
          const TempObj = {
            Product_Description: element.Product_Description,
            Product_ID: element.Product_ID,
            PO_Qty :element.PO_QTY,
            Pending_PO_Qty:element.Pending_PO_QTY,
            Challan_Qty:Number(element.Challan_Qty),
            Received_Qty:Number(element.Received_Qty),
            Rate: element.Rate,
            UOM: element.UOM,
            Total_Amount: Number(element.Total_Amount),
          }
          this.BottomList.push(TempObj);
         // console.log("this.BottomList",this.BottomList)
        })
      }
    })
  }
  PendingGRNcreate(pcr:any) {
   if (pcr.PO_Doc_No) {
      this.GRNEPending = undefined;
      this.tabIndexToView = 1;
      this.items = ["Browse", "Create", "Pending PO"];
      this.buttonname = "Create";
      this.GRNEPending = pcr.PO_Doc_No;
      this.GetPending(this.GRNEPending);
      this.readonly = true;
    }  
  }
  GetPending(final:any) {
     const obj = {
      "SP_String": "sp_Bl_Txn_GRN_Np",
      "Report_Name_String": "Get_Pending_All_With_PO_No",
      "Json_Param_String": JSON.stringify([{ PO_Doc_No: final }])
    }
    this.GlobalAPI.getData(obj).subscribe((data: any) => {
     // console.log("Pending Retrivedata==", data);
      const finalData = JSON.parse(data[0].PO_Result);
     // console.log("finalData Retrivedata==", finalData);
      if (finalData.length) {
          this.ObjGRN.Company_Name = finalData[0].Company_Name,
          this.ObjGRN.Sub_Ledger_ID = finalData[0].Sub_Ledger_ID,
          this.ObjGRN.Sub_Ledger_Name = finalData[0].Sub_Ledger_Name,
          this.ObjGRN.PO_Number = finalData[0].PO_Doc_No;
          this.PO_Date = this.DateNepalConvertService.convertNewEngToNepaliDateObj(finalData[0].PO_Doc_Date),
          this.BottomList = finalData[0].Product_Details,
          this.BottomList.forEach((ele:any) => {
            ele.Total_Amount = Number(ele.Challan_Qty) * Number(ele.Rate)
         });
          this.GRNEdit = undefined
      }
    }) 
  }
}

class GRN{
  Company_Name: any;
  Sub_Ledger_ID: any;
  Sub_Ledger_Name: any;
  Cost_Cen_ID: any;
  Cost_Cen_Name: any;
  Godown_ID: any;
  godown: any;
  SE_No: any;
  INV_No: any;
  Vehicle_No: any;
  LR_No_Date: any;
  Mode_Of_transport: any
  PO_Number: any;
  PO_date: any;
  Remarks: any;
}
