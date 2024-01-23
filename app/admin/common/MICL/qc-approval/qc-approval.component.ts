import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { MessageService } from 'primeng/api';
import { DateTimeConvertService } from '../../../shared/compacct.global/dateTime.service';
import { CompacctCommonApi } from '../../../shared/compacct.services/common.api.service';
import { CompacctHeader } from '../../../shared/compacct.services/common.header.service';
import { CompacctGlobalApiService } from '../../../shared/compacct.services/compacct.global.api.service';
import { NgxUiLoaderService } from "ngx-ui-loader";

@Component({
  selector: 'app-qc-approval',
  templateUrl: './qc-approval.component.html',
  styleUrls: ['./qc-approval.component.css'],
  providers: [MessageService] ,
  encapsulation: ViewEncapsulation.None
})
export class QcApprovalComponent implements OnInit {
  tabIndexToView: number= 0;
  POnoList: any= [];
  QCDocNoList: any= [];
  SelectProductList: any= [];
  allDetalis: any= [];
  allDetalisHeader: any= [];
  QCapprovalFormSubmitted: boolean= false;
  Spinner: boolean= false;
  items: any= [];
  buttonname: any= "Create";
  newAllDetails: any= [];
  Created_By: any;
  Cost_Cen_ID: any;
  seachSpinner: boolean= false;
  Searchedlist: any= [];
  SearchedlistHeader: any=[];


  ObjQCapproval: QCapproval = new QCapproval();
  BackupSearchedlist:any = [];
  DistSubledgerName:any = [];
  SelectedDistSubledgerName:any = [];
  SearchFields:any = [];
  initDate:any = [];

  RecDetalis:any = [];
  RecDetalisHeader:any = [];
  rangevalidation:boolean = false;
  savedata:any = [];

  constructor(
    private $http: HttpClient,
    private GlobalAPI:CompacctGlobalApiService,
    private compacctToast:MessageService,
    private DateService: DateTimeConvertService,
    private Header: CompacctHeader,
    public $CompacctAPI: CompacctCommonApi,
    private ngxService: NgxUiLoaderService
  ) { }

  ngOnInit() {
    this.Header.pushHeader({
      Header: "QC APPROVAL",
      Link: "MICL -> QC APPROVAL"
    });
    this.items = ["BROWSE", "CREATE"];
    this.Finyear();
    this.GetPONo();
    this.Created_By= Number(this.$CompacctAPI.CompacctCookies.User_ID);
    this.Cost_Cen_ID= Number(this.$CompacctAPI.CompacctCookies.Cost_Cen_ID);
  }
  TabClick(e) {
    this.tabIndexToView = e.index;
    this.items = ["BROWSE", "CREATE"];
    this.buttonname = "Create";
    this.ObjQCapproval = new QCapproval();
    this.allDetalis=[];
    this.allDetalisHeader=[];
    this.SelectProductList=[];
    this.newAllDetails=[];
    this.QCapprovalFormSubmitted = false;
    this.rangevalidation = false
  }
  Finyear() {
    this.$http
      .get("Common/Get_Fin_Year_Date?Fin_Year_ID=" + this.$CompacctAPI.CompacctCookies.Fin_Year_ID)
      .subscribe((res: any) => {
      let data = JSON.parse(res)
      // this.vouchermaxDate = new Date(data[0].Fin_Year_End);
      // this.voucherminDate = new Date(data[0].Fin_Year_Start);
      // this.voucherdata = new Date().getMonth() > new Date(data[0].Fin_Year_End).getMonth() ? new Date() : new Date(data[0].Fin_Year_End)
     this.initDate =  [new Date(data[0].Fin_Year_Start) , new Date(data[0].Fin_Year_End)]
      });
  }

  GetPONo(){
    this.POnoList=[];
    const obj = {
      "SP_String": "SP_BL_Txn_Raw_Material_QA",
      "Report_Name_String": "Get_PO_Doc_Nos_For_QC_Approve" 
      
    }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      // console.log("Get POnoList",data);
      if(data.length) {
        data.forEach(element => {
          element['label'] = element.Doc_No,
          element['value'] = element.Doc_No
        });
       this.POnoList = data;
      }
       else {
        this.POnoList = [];
      }
    });
  }
  getDetails(DocNO){
    // console.log("getDetails",this.POnoList);
    // console.log("DOcNO",DocNO);
    this.SelectProductList = [];
    this.ObjQCapproval.SelectProduct = undefined;
    this.allDetalis = [];
    this.allDetalisHeader = [];
    if(DocNO && this.POnoList){
      for(let item of this.POnoList){
        if(item.Doc_No == DocNO){
          this.ObjQCapproval.VendorName= item.Sub_Ledger_Name;
          // this.ObjQCapproval.RecievedOn= item.Doc_Date;
          this.ObjQCapproval.PO_Doc_Date= item.Doc_Date;
          this.ObjQCapproval.Ref_No = item.Ref_No;
          this.ObjQCapproval.VendorInvNo= item.Inv_No_Date ? item.Inv_No_Date.split('&')[0] : "-";
          this.ObjQCapproval.VendorInvDate= item.Inv_No_Date ? item.Inv_No_Date.split('&')[1] : "-";
          this.ObjQCapproval.Inv_No_Date= item.Inv_No_Date;
          this.ObjQCapproval.Sub_Ledger_ID= item.Sub_Ledger_ID;
        }
      }
      this.GetQCDocNo();
    }
    else{
      this.ObjQCapproval = new QCapproval();
      this.allDetalis =[];
      this.allDetalisHeader=[];
      this.SelectProductList=[];
    }

   
    
  }
  GetQCDocNo(){
    this.QCDocNoList=[];
    const obj = {
      "SP_String": "SP_BL_Txn_Raw_Material_QA",
      "Report_Name_String": "Get_QC_Nos_For_QC_Approve",
      "Json_Param_String": JSON.stringify([{Doc_No : this.ObjQCapproval.PO_Doc_No}]) 
      
    }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      // console.log("Get POnoList",data);
      if(data.length) {
        data.forEach(element => {
          element['label'] = element.Doc_No,
          element['value'] = element.Doc_No
        });
       this.QCDocNoList = data;
      }
       else {
        this.QCDocNoList = [];
      }
    });
  }

  getParameterDetails(qcdocno){
    this.allDetalis=[];
    this.allDetalisHeader=[];
    this.ngxService.start();
    this.rangevalidation = false
    if (qcdocno) {
    const obj = {
      "SP_String": "SP_BL_Txn_Raw_Material_QA",
      "Report_Name_String":"Get_Parameters_For_QC_Approve",
      "Json_Param_String": JSON.stringify([{Doc_No : qcdocno}]) 
      }

      this.GlobalAPI.getData(obj).subscribe((data:any)=>{
        // console.log("getParameterDetails",data);

        this.allDetalis = data;
        this.ngxService.stop();
        // for(let item of this.SelectProductList){
        //   if(item.Product_ID == Product_ID){
        //     this.ObjQCapproval.UOM= item.UOM;
        //   }
        // }

        if (this.allDetalis.length) {
          this.allDetalisHeader = Object.keys(data[0]);
        }
      });  
    }
    else {
      this.ngxService.stop();
    }
  }

  getRecNo(){
    let Rarr:any =[]
    if(this.RecDetalis.length) {
      this.RecDetalis.forEach(el => {
        if(el.Confirm_Rec_No){
          const Dobj = {
            Doc_No : el.Doc_No
            }
            Rarr.push(Dobj)
        }

    });
    }
    else {
      const Dobj = {
        Doc_No : 'NA'
        }
        Rarr.push(Dobj)
    }
    console.log("Table Data ===", Rarr)
    return Rarr.length ? JSON.stringify(Rarr) : '';
  }
  Checktotalrange(col) {
    //this.flag = false;
    if (col.Below_Range && col.Within_Range && col.Above_Range) {
      const totalrange = Number(col.Below_Range) + Number(col.Within_Range) + Number(col.Above_Range)
      if (totalrange === 100) {
        return true;
      }
      else {
        return false;

        // this.flag = true;
        // this.compacctToast.clear();
        // this.compacctToast.add({
        //   key: "compacct-toast",
        //   severity: "error",
        //   summary: "Warn Message",
        //   detail: "Error Occured "
        // });
      }
    }
  }
  SaveDoc(valid:any){
    this.QCapprovalFormSubmitted = true;
    if(valid){
      if(this.allDetalis.length) {
      this.savedata =[];
    this.allDetalis.forEach(element => {
      // const totalrange = Number(element.Below_Range) + Number(element.Within_Range) + Number(element.Above_Range)
      if(element.Below_Range && element.Within_Range && element.Above_Range) {
      // if (totalrange === 100){
        this.rangevalidation = false;
    const SaveObj = {
      Doc_No: element.Doc_No,
      Doc_Date: this.DateService.dateConvert(new Date(element.Doc_Date)),
      Line_No: element.Line_No,
      Product_ID: element.Product_ID,
      Parameter_ID: element.Parameter_ID,
      UOM: element.UOM,
      Max_Value: element.Max_Value,
      Min_Value: element.Min_Value,
      Rec_Value: element.Rec_Value,
      QA_Value: element.QA_Value ,
      Max_Tolerance_Level: element.Max_Tolerance_Level,
      Min_Tolerance_Level: element.Min_Tolerance_Level,
      Remarks: element.Remarks,
      Below_Range: element.Below_Range,
      Within_Range: element.Within_Range,
      Above_Range: element.Above_Range
    }
    this.savedata.push(SaveObj);
    // }
    // else {
    //   this.rangevalidation = true;
    //   this.compacctToast.clear();
    //   this.compacctToast.add({
    //     key: "compacct-toast",
    //     severity: "error",
    //     summary: "Error message ",
    //     detail: element.Parameter_Name + " Approval Range is not equal to 100. "
    //   });
    //   return
    // }
    }
    else {
      this.Spinner = false;
      this.rangevalidation = true
      this.compacctToast.clear();
      this.compacctToast.add({
        key: "compacct-toast",
        severity: "error",
        summary: "Error message ",
        detail: "All Text Box are required"
      });
      return
    }
    });
    if (!this.rangevalidation) {
      // console.log("allDetalis.length===",this.allDetalis.length)
      // console.log("savedata.length===",savedata.length)
      // if(savedata.length) {
      let msg = this.buttonname == "Create" ? "Create" : "Update";
      this.Spinner=true;
      const obj = {
      "SP_String": "SP_BL_Txn_Raw_Material_QA",
      "Report_Name_String": "Check_Approval_Range_Of_QC",
      "Json_Param_String": JSON.stringify(this.savedata)
      }
      this.GlobalAPI.postData(obj).subscribe((data: any) => {
        // console.log("save data",data);
        if (data[0].Column1 === "OK"){
          this.aftercheckSaveDoc();
          // this.Spinner=false;
          // this.QCapprovalFormSubmitted=false;
          // this.compacctToast.clear();
          // this.compacctToast.add({
          //   key: "compacct-toast",
          //   severity: "success",
          //   summary: "Parameter " + msg,
          //   detail: "Succesfully " + msg
          // });
          // this.ObjQCapproval = new QCapproval();
          // // this.tabIndexToView = 0;
          // this.items = ["BROWSE", "CREATE"];
          // this.allDetalis=[];
          // this.allDetalisHeader=[];
          // this.getAlldata();
        }
        else if (data[0].Parameter_ID){
          this.Spinner=false;
          // this.QCapprovalFormSubmitted=false;
          this.compacctToast.clear();
          this.compacctToast.add({
            key: "compacct-toast",
            severity: "error",
            summary: "Error mrssage ",
            detail: data[0].Parameter_Name + " Approval Range is not equal to 100. "
          });
        }
        else {
          this.Spinner = false;
          this.compacctToast.clear();
          this.compacctToast.add({
            key: "compacct-toast",
            severity: "error",
            summary: "Parameter not " + msg,
            detail:"Error occured "
          });
        }
      });
    // }
    // else{
    //   this.Spinner = false;
    //       this.compacctToast.clear();
    //       this.compacctToast.add({
    //         key: "compacct-toast",
    //         severity: "error",
    //         summary: "Error message ",
    //         detail:"Something wrong "
    //       });
    // }
    }
      }
    }

  }
  aftercheckSaveDoc(){
    // this.QCapprovalFormSubmitted = true;
    // if(valid){
    //   if(this.allDetalis.length) {
    //   let savedata:any=[];
    // this.allDetalis.forEach(element => {
    //   // const totalrange = Number(element.Below_Range) + Number(element.Within_Range) + Number(element.Above_Range)
    //   if(element.Below_Range && element.Within_Range && element.Above_Range) {
    //   // if (totalrange === 100){
    //     this.rangevalidation = false;
    // const SaveObj = {
    //   Doc_No: element.Doc_No,
    //   Doc_Date: this.DateService.dateConvert(new Date(element.Doc_Date)),
    //   Line_No: element.Line_No,
    //   Product_ID: element.Product_ID,
    //   Parameter_ID: element.Parameter_ID,
    //   UOM: element.UOM,
    //   Max_Value: element.Max_Value,
    //   Min_Value: element.Min_Value,
    //   Rec_Value: element.Rec_Value,
    //   QA_Value: element.QA_Value ,
    //   Max_Tolerance_Level: element.Max_Tolerance_Level,
    //   Min_Tolerance_Level: element.Min_Tolerance_Level,
    //   Remarks: element.Remarks,
    //   Below_Range: element.Below_Range,
    //   Within_Range: element.Within_Range,
    //   Above_Range: element.Above_Range
    // }
    // savedata.push(SaveObj);
    // // }
    // // else {
    // //   this.rangevalidation = true;
    // //   this.compacctToast.clear();
    // //   this.compacctToast.add({
    // //     key: "compacct-toast",
    // //     severity: "error",
    // //     summary: "Error message ",
    // //     detail: element.Parameter_Name + " Approval Range is not equal to 100. "
    // //   });
    // //   return
    // // }
    // }
    // else {
    //   this.Spinner = false;
    //   this.rangevalidation = true
    //   this.compacctToast.clear();
    //   this.compacctToast.add({
    //     key: "compacct-toast",
    //     severity: "error",
    //     summary: "Error message ",
    //     detail: "All Text Box are required"
    //   });
    //   return
    // }
    // });
    // if (!this.rangevalidation) {
      // console.log("allDetalis.length===",this.allDetalis.length)
      // console.log("savedata.length===",savedata.length)
      // if(savedata.length) {
      let msg = this.buttonname == "Create" ? "Create" : "Update";
      // this.Spinner=true;
      const obj = {
      "SP_String": "SP_BL_Txn_Raw_Material_QA",
      "Report_Name_String": "Save_Approval_Range_Of_QC",
      "Json_Param_String": JSON.stringify(this.savedata)
      }
      this.GlobalAPI.postData(obj).subscribe((data: any) => {
        // console.log("save data",data);
        if (data[0].Column1){
          this.Spinner=false;
          this.QCapprovalFormSubmitted=false;
          this.compacctToast.clear();
          this.compacctToast.add({
            key: "compacct-toast",
            severity: "success",
            summary: "Parameter " + msg,
            detail: "Succesfully " + msg
          });
          this.ObjQCapproval = new QCapproval();
          // this.tabIndexToView = 0;
          this.items = ["BROWSE", "CREATE"];
          this.allDetalis=[];
          this.allDetalisHeader=[];
          this.getAlldata();
        }
        else {
          this.Spinner = false;
          this.compacctToast.clear();
          this.compacctToast.add({
            key: "compacct-toast",
            severity: "error",
            summary: "Parameter not " + msg,
            detail:"Error occured "
          });
        }
      });
    // }
    // else{
    //   this.Spinner = false;
    //       this.compacctToast.clear();
    //       this.compacctToast.add({
    //         key: "compacct-toast",
    //         severity: "error",
    //         summary: "Error message ",
    //         detail:"Something wrong "
    //       });
    // }
    // }
      // }
    // }

  }

  getDateRange(dateRangeObj:any){
    if(dateRangeObj.length){
      this.ObjQCapproval.From_Date = dateRangeObj[0];
      this.ObjQCapproval.To_Date  = dateRangeObj[1];
    }
   
  }

  getAlldata(){
    this.Searchedlist=[];
    this.SearchedlistHeader=[];
    this.seachSpinner = true
    const start = this.ObjQCapproval.From_Date
    ? this.DateService.dateConvert(new Date(this.ObjQCapproval.From_Date))
    : this.DateService.dateConvert(new Date());
    const end = this.ObjQCapproval.To_Date
    ? this.DateService.dateConvert(new Date(this.ObjQCapproval.To_Date))
    : this.DateService.dateConvert(new Date());
    const tempobj = {
      From_Date : start,
      To_Date  : end
    }
    const obj = {
      "SP_String": "SP_BL_Txn_Raw_Material_QA",
      "Report_Name_String": "BL_Txn_Raw_Material_QA_Browse_After_Approval",
      "Json_Param_String": JSON.stringify([tempobj])
    }
     this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      // console.log("Get data",data);
       this.Searchedlist = data;
       this.BackupSearchedlist = data;
       this.GetDistinct();
       if(data.length) {
        this.SearchedlistHeader = Object.keys(data[0]);
        // console.log("SearchedlistHeader",this.SearchedlistHeader);
       }
       this.seachSpinner = false;
      //  console.log('Searchedlist=====',this.Searchedlist); 
     })

  }
  // DISTINCT & FILTER
GetDistinct() {
  let DSubledgerName:any = [];
  this.DistSubledgerName =[];
  this.SelectedDistSubledgerName =[];
  this.SearchFields =[];
  this.Searchedlist.forEach((item) => {
 if (DSubledgerName.indexOf(item.Sub_Ledger_Name) === -1) {
  DSubledgerName.push(item.Sub_Ledger_Name);
 this.DistSubledgerName.push({ label: item.Sub_Ledger_Name, value: item.Sub_Ledger_Name });
 }
});
   this.BackupSearchedlist = [...this.Searchedlist];
}
  FilterDist() {
    let DSubledgerName:any  = [];
    let DCostCentreName:any = [];
    this.SearchFields =[];
  if (this.SelectedDistSubledgerName.length) {
    this.SearchFields.push('Sub_Ledger_Name');
    DSubledgerName = this.SelectedDistSubledgerName;
  }
  this.Searchedlist = [];
  if (this.SearchFields.length) {
    let LeadArr = this.BackupSearchedlist.filter(function (e) {
      return (DSubledgerName.length ? DSubledgerName.includes(e['Sub_Ledger_Name']) : true)
      && (DCostCentreName.length ? DCostCentreName.includes(e['Cost_Cen_Name']) : true)
    });
  this.Searchedlist = LeadArr.length ? LeadArr : [];
  } else {
  this.Searchedlist = [...this.BackupSearchedlist] ;
  }
  }

  onConfirm(){

  }

  onReject(){
    this.compacctToast.clear("c");
  }

}

class QCapproval{
  PO_Doc_No: any;
  QC_Doc_No: any;
  VendorName: any;
  RecievedOn: any;
  PO_Doc_Date:any;
  Ref_No: any;
  VendorInvNo: any;
  VendorInvDate: any;
  Inv_No_Date: any;
  SelectProduct: any;
  Sub_Ledger_ID: number;
  UOM: any;
  From_Date: any;
  To_Date: any;
  Remarks: any;
}