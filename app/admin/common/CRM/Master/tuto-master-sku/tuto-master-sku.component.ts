import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MessageService } from 'primeng/api';
import { DateTimeConvertService } from '../../../../shared/compacct.global/dateTime.service';
import { CompacctHeader } from '../../../../shared/compacct.services/common.header.service';
import { CompacctGlobalApiService } from '../../../../shared/compacct.services/compacct.global.api.service';
declare var $:any;
import * as XLSX from 'xlsx';
@Component({
  selector: 'app-tuto-master-sku',
  templateUrl: './tuto-master-sku.component.html',
  styleUrls: ['./tuto-master-sku.component.css'],
  providers: [MessageService],
  encapsulation: ViewEncapsulation.None
})
export class TutoMasterSkuComponent implements OnInit {
  SKUList = [];
  seachSpinner = false;
  addSpinner = false;
  viewData:any = [];
  viewpopUp = false;
  initDate = [];
  productList = [];
  TxnID = undefined;
  Start_Date:Date = new Date();
  End_Date:Date = new Date();
  Objaddcommission: addcommission = new addcommission();
  constructor(private Header: CompacctHeader,
    private $http : HttpClient,
    private GlobalAPI: CompacctGlobalApiService,
    private compacctToast: MessageService,
    private DateService: DateTimeConvertService) { }

  ngOnInit() {
    this.Header.pushHeader({
      Header: "Master SKU",
      Link: "SKU Management -> Master -> Master SKU"
    });
    this.GetSKUlist();
  }
  cleardata(){
    this.Objaddcommission.Dist_Sale_Commission = undefined;
    this.Objaddcommission.End_To = undefined;
    this.Objaddcommission.Start_From = undefined;
    this.TxnID = undefined;
  }
  GetSKUlist() {
    this.seachSpinner = true;
    const obj = {
      "Report_Name": "List_Product"
    }
    this.GlobalAPI
        .CommonTaskData(obj)
        .subscribe((data: any) => {
          this.SKUList = data.length ? data : [];
          this.seachSpinner = false;
          console.log('list product ==', this.SKUList)
    });
  }
  UpdateDescription (obj){
    if(obj.Product_ID && obj.Product_Description) {
      $('#RowID'+obj.Product_ID).button('loading');
      const TObj = {
        Product_ID : obj.Product_ID,
        Product_Description : obj.Product_Description,
        Tutopia_Product_Count : obj.Tutopia_Product_Count,
        DS_Min_Bill_Amt : obj.DS_Min_Bill_Amt,
        DI_Max_Bill_Amt : obj.DS_Min_Bill_Amt,
        Direct_Sale_Min_Sale : obj.Direct_Sale_Min_Sale,
        Direct_Sale_Commission : obj.Direct_Sale_Commission,
        Affi_Sale_Min_Sale : obj.Affi_Sale_Min_Sale,
        Affi_Sale_Commission : obj.Affi_Sale_Commission,
        Dist_Sale_Min_Sale : obj.Dist_Sale_Min_Sale,
        Dist_Sale_Commission : obj.Dist_Sale_Commission,
        DS_DIS_Amount_Price : obj.DS_DIS_Amount_Price
       }
    const Tempobj = {
        "Report_Name": "Update_Product_Name",
        "Json_Param_String" : JSON.stringify([TObj])
      }
      this.GlobalAPI
          .CommonTaskData(Tempobj)
          .subscribe((data: any) => {
           // console.log(data);
            if(data[0].Remarks === 'success') {
              this.compacctToast.clear();
              this.compacctToast.add({
                key: "compacct-toast",
                severity: "success",
                summary: 'SKU ID : ' + obj.Product_ID,
                detail: "Succesfully Updated."
              });
              this.GetSKUlist();
              $('#RowID'+obj.Product_ID).button('reset');
            }else{
              this.compacctToast.clear();
              this.compacctToast.add({
                key: "compacct-toast",
                severity: "error",
                summary: "Error",
                detail: "Error Occured"
              });
              $('#RowID'+obj.Product_ID).button('reset');
            }
      });
      console.log('Update ===', TObj)
    }
    if(!obj.Product_Description){
      this.compacctToast.clear();
      this.compacctToast.add({
        key: "compacct-toast",
        severity: "error",
        summary: "Validation Error",
        detail: "Please Enter English Name."
      });
    }
  }
  GetUpdateCommission(Product_ID){
   if(Product_ID){
    this.cleardata();
    $('#RowcomID'+Product_ID).button('loading');
    this.productList = [];
    this.viewpopUp = true;
    this.Objaddcommission.Product_ID = undefined;
    this.UpdateCommission(Product_ID);
   }
  }
  UpdateCommission(Product_ID){
    if(Product_ID){
       const TempObj = {
        Product_ID : Product_ID
      }
      const obj = {
        "SP_String":"Tutopia_Direct_Sale_Commission_SP",
        "Report_Name_String":"Get_Direct_Commission",
        "Json_Param_String": JSON.stringify([TempObj])
      }
      this.GlobalAPI.getData(obj).subscribe((data: any) => {
       // console.log("UpdateCommission",data);
        this.productList = data;
        this.productList.forEach(el =>{
          el['Start_Date'] = this.DateService.dateConvert(new Date(el.Start_From))
          el['End_Date'] = this.DateService.dateConvert(new Date(el.End_To))
        })
        this.Objaddcommission.Product_ID = Product_ID;
        $('#RowcomID'+Product_ID).button('reset');
      })
    }
  }
  getConfirmDateRange(dateRangeObj) {
    if (dateRangeObj.length) {
      this.Objaddcommission.Start_From = dateRangeObj[0];
      this.Objaddcommission.End_To = dateRangeObj[1];
    }
  }
  adddata(valid){
   console.log(valid);
   if(valid){
     this.addSpinner = true;
    this.Objaddcommission.Start_From = this.Start_Date
    ? this.DateService.dateConvert(new Date(this.Start_Date))
    : this.DateService.dateConvert(new Date());
    this.Objaddcommission.End_To = this.End_Date
    ? this.DateService.dateConvert(new Date(this.End_Date))
    : this.DateService.dateConvert(new Date());
    this.Objaddcommission.Dist_Sale_Commission = Number(this.Objaddcommission.Dist_Sale_Commission);
    const obj = {
      "SP_String":"Tutopia_Direct_Sale_Commission_SP",
      "Report_Name_String":"create_direct_commission",
      "Json_1_String": JSON.stringify([this.Objaddcommission])
    }
    this.GlobalAPI.getData(obj).subscribe((data: any) => {
      this.productList = data;
      this.productList.forEach(el =>{
        el.Start_Date = this.DateService.dateConvert(new Date(el.Start_From))
        el.End_Date = this.DateService.dateConvert(new Date(el.End_To))
      })
      this.addSpinner = false;
     // console.log("productList add",this.productList);
      this.UpdateCommission(this.Objaddcommission.Product_ID);
      this.cleardata();
    })
   }
  }
  updateDriect(col){
    let saveData = {};
    let saveItem = [];
    console.log("updateDriect",col);
    if(col.Txn_ID){
      
     saveData = {
        Txn_ID : col.Txn_ID,
        Start_From : this.DateService.dateConvert(new Date(col.Start_Date)),
        End_To : this.DateService.dateConvert(new Date(col.End_Date)),
        Dist_Sale_Commission : col.Dist_Sale_Commission
      }
    
      $('#RowTxnID'+col.Txn_ID).button('loading');
      const obj = {
        "SP_String":"Tutopia_Direct_Sale_Commission_SP",
        "Report_Name_String":"Edit_direct_commission",
        "Json_1_String": JSON.stringify([saveData])
      }
      this.GlobalAPI.getData(obj).subscribe((data: any) => {
      //  console.log("Updata Data",data);
        if(data[0].Column1 === 'Successfully Updated') {
          this.compacctToast.clear();
          this.compacctToast.add({
            key: "compacct-toast",
            severity: "success",
            summary: 'Direct Sale Commission ',
            detail: "Succesfully Updated."
          });
          this.UpdateCommission(this.Objaddcommission.Product_ID);
          this.GetSKUlist();
          $('#RowTxnID'+col.Txn_ID).button('reset');
        }else{
          this.compacctToast.clear();
          this.compacctToast.add({
            key: "compacct-toast",
            severity: "error",
            summary: "Error",
            detail: "Error Occured"
          });
          $('#RowTxnID'+col.Txn_ID).button('reset');
        }
        
      })
    }
  }
  contvDate(value){
      return this.DateService.dateConvert(new Date(value))
  }
  // deleteDriect(col){
  //   this.TxnID = undefined;
  //   if(col.Txn_ID){
  //    this.TxnID = col.Txn_ID;
  //    this.compacctToast.clear();
  //      this.compacctToast.add({
  //        key: "c",
  //        sticky: true,
  //        severity: "warn",
  //        summary: "Are you sure?",
  //        detail: "Confirm to proceed"
  //      });
  //   }
  // }
  deleteDriect(col){
  if(col.Txn_ID){
    const obj = {
      "SP_String": "Tutopia_Direct_Sale_Commission_SP",
      "Report_Name_String": "Delete_Direct_Commission",
      "Json_Param_String": JSON.stringify([{Txn_ID : col.Txn_ID}])      
    }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      console.log("Delete",data);
      if(data[0].Column1 === "Successfully Deleted"){
       // this.onReject();
        this.UpdateCommission(this.Objaddcommission.Product_ID);
        this.compacctToast.clear();
            this.compacctToast.add({
              key: "compacct-toast",
              severity: "success",
              summary: "Txn Id: " + this.TxnID,
              detail: "Succesfully Deleted"
            });
      }
    })
  }
  }
  onReject() {
    this.compacctToast.clear("c");
  }
    // EXPORT TO EXCEL
exportexcel(Arr,fileName): void {
  const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(Arr);
  const workbook: XLSX.WorkBook = {Sheets: {'data': worksheet}, SheetNames: ['data']};
  XLSX.writeFile(workbook, fileName+'.xlsx');
}
}
class addcommission{
  Product_ID : number;
  Start_From :string;
  End_To:string;
  Dist_Sale_Commission:number;
}
// 1)    for retrieving Direct Sale Commission to bind grid pop up --->
// {"SP_String":"Tutopia_Direct_Sale_Commission_SP","Report_Name_String":"Get_Direct_Commission","Json_Param_String":'[{"Product_ID":"21"}]',"Json_1_String":"NA","Json_2_String":"NA","Json_3_String":"NA","Json_4_String":"NA"}
// 2)    for creating new commission --->
// Report_Name_String:"create_direct_commission"
// json1 --->          Product_ID                 bigint          	 
// 			  Start_From                 varchar(100)    
// 			  End_To                      varchar(100)    
// 			  Dist_Sale_Commission       numeric(18,0) 
// 3)   for editing commission ---->   
// Report_Name_String:"Edit_direct_commission"
// json1 ---->        Txn_ID                 bigint          	 
// 			  Start_From                 varchar(100)    
// 			  End_To                      varchar(100)    
// 			  Dist_Sale_Commission       numeric(18,0) 

// for delete --->  {"SP_String":"Tutopia_Direct_Sale_Commission_SP","Report_Name_String":"Delete_Direct_Commission","Json_Param_String":'[{"Txn_ID":"21"}]',"Json_1_String":"NA","Json_2_String":"NA","Json_3_String":"NA","Json_4_String":"NA"}

