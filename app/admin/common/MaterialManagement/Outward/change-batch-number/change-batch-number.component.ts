import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MessageService } from "primeng/api";
import {CompacctHeader} from "../../../../shared/compacct.services/common.header.service"
import { HttpClient, HttpParams } from '@angular/common/http';
import { CompacctGlobalApiService } from '../../../../shared/compacct.services/compacct.global.api.service';
import { DateTimeConvertService } from '../../../../shared/compacct.global/dateTime.service';
import { CompacctCommonApi } from '../../../../shared/compacct.services/common.api.service';

@Component({
  selector: 'app-change-batch-number',
  templateUrl: './change-batch-number.component.html',
  styleUrls: ['./change-batch-number.component.css'],
  providers: [MessageService],
  encapsulation: ViewEncapsulation.None
})
export class ChangeBatchNumberComponent implements OnInit {
  BrandList:any = [];
  ProductionVoucherNoList:any = [];
  ProductList:any = [];
  OldBatchNoList:any = [];
  Spinner:boolean = false;
  seachSpinner:boolean = false
  tabIndexToView = 0;
  buttonname = "Save"
  ObjChangeBatchNo : ChangeBatchNo = new ChangeBatchNo ();
  ChangeBatchNoFormSubmitted = false;
  CurrentDate = new Date();
  Searchedlist:any = [];
  Doc_No = undefined;
  ViewList:any = [];
  ViewPoppup:boolean = false;
  Doc_date = new Date();
  Cost_Cent_ID = undefined;
  BrandId = undefined;
  //remarks = undefined;

  constructor(
    private Header: CompacctHeader,
    private $http : HttpClient,
    private GlobalAPI: CompacctGlobalApiService,
    private DateService: DateTimeConvertService,
    public $CompacctAPI: CompacctCommonApi,
    private compacctToast: MessageService, 
  ) { }

  ngOnInit() {
    this.Header.pushHeader({
      Header: "Change Batch Number",
      Link: "Material Management -> Change Batch Number"
    });
    this.GetBrandBro();
  }
  GetBrandBro(){
    const obj = {
      "SP_String": "SP_Production_Voucher",
      "Report_Name_String": "Get - Brand",

    }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      this.BrandList = data;
    })
  }
  GetProductionVoucherNo(brandid){
    this.ProductionVoucherNoList = [];
    const TempObj = {
      Brand_ID : brandid
     }
     const obj = {
      "SP_String": "SP_batch_no_change",
      "Report_Name_String": "Get_Production_doc_no",
      "Json_Param_String": JSON.stringify([TempObj])

    }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      if(data.length) {
        data.forEach(element => {
          element['label'] = element.Doc_No + ' (' + this.DateService.dateConvert(new Date(element.doc_date)) + ')',
          element['value'] = element.Doc_No
        });
        this.ProductionVoucherNoList = data;

      }
      else {
        this.ProductionVoucherNoList = [];
      }
      console.log("select ProductionVoucherNoList======",this.ProductionVoucherNoList);


    });
  }
  GetProduct(pvno){
    this.ProductList = [];
    this.ObjChangeBatchNo.Product_ID = undefined;
    this.ObjChangeBatchNo.Old_Batch_No = undefined;
    this.ObjChangeBatchNo.Qty = undefined;
    this.ObjChangeBatchNo.UOM = '';
    this.ObjChangeBatchNo.New_Batch_No = undefined;
    const TempObj = {
      Doc_No : pvno
     }
     const obj = {
      "SP_String": "SP_batch_no_change",
      "Report_Name_String": "GET_Products",
      "Json_Param_String": JSON.stringify([TempObj])

    }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      if(data.length) {
        this.ProductList = data;

      }
      else {
        this.ProductList = [];
      }
      console.log("select Product======",this.ProductList);


    });
  }
  GetOldBatchList(){
    this.OldBatchNoList = [];
    this.ObjChangeBatchNo.Old_Batch_No = undefined;
    this.ObjChangeBatchNo.Qty = undefined;
    this.ObjChangeBatchNo.UOM = '';
    this.ObjChangeBatchNo.New_Batch_No = undefined;
    const TempObj = {
      Product_ID : this.ObjChangeBatchNo.Product_ID,
      Doc_No : this.ObjChangeBatchNo.Production_Voucher_No
     }
     const obj = {
      "SP_String": "SP_batch_no_change",
      "Report_Name_String": "Get_old_batch",
     "Json_Param_String": JSON.stringify([TempObj])

    }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      this.OldBatchNoList = data
      // console.log("select Batch======",this.OldBatchNoList);


    });
  }
  BatchChange() {
    if(this.ObjChangeBatchNo.Old_Batch_No) {
      const ctrl = this;
      const batchObj = $.grep(ctrl.OldBatchNoList,function(item:any) {return item.Batch_No == ctrl.ObjChangeBatchNo.Old_Batch_No})[0];
      // console.log(batchObj);
      this.ObjChangeBatchNo.Qty = batchObj.Bal_Qty;
      this.ObjChangeBatchNo.UOM = batchObj.UOM;
      this.ObjChangeBatchNo.Old_Batch_No = batchObj.Batch_No
      this.ObjChangeBatchNo.To_Cost_Cen_ID = batchObj.Cost_Cen_ID
      this.ObjChangeBatchNo.To_godown_id = batchObj.godown_id
      this.GetNewBatch();
     }
  }
  GetNewBatch(){
    this.ObjChangeBatchNo.New_Batch_No = undefined;
    const TempObj = {
      Product_ID : this.ObjChangeBatchNo.Product_ID,
      Batch_No : this.ObjChangeBatchNo.Old_Batch_No
     }
     const obj = {
      "SP_String": "SP_batch_no_change",
      "Report_Name_String": "Get_new_batch",
     "Json_Param_String": JSON.stringify([TempObj])

    }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      this.ObjChangeBatchNo.New_Batch_No = data[0].New_Batch_No
      console.log("select Product======",this.ProductList);


    });
  }
  onConfirm() {
    this.compacctToast.clear("c");
  }
  onReject() {
    this.compacctToast.clear("c");
  }
  GetDataForSave(){
        //let tempArr =[];
        const TempObj = {
          Doc_No : "A",
          Doc_Date : this.DateService.dateConvert(new Date(this.CurrentDate)),
          To_Cost_Cen_ID : this.ObjChangeBatchNo.To_Cost_Cen_ID,
          Brand_ID : this.ObjChangeBatchNo.Brand_ID,
          Production_Doc_No: this.ObjChangeBatchNo.Production_Voucher_No,
          Product_ID : this.ObjChangeBatchNo.Product_ID,
          Qty: this.ObjChangeBatchNo.Qty,
          UOM: this.ObjChangeBatchNo.UOM,
          Batch_No: this.ObjChangeBatchNo.Old_Batch_No,
          New_Batch_No: this.ObjChangeBatchNo.New_Batch_No,
          User_ID	: this.$CompacctAPI.CompacctCookies.User_ID,
          To_godown_id: this.ObjChangeBatchNo.To_godown_id,
          Narration: "",
          Process_ID : 100
        }
        console.log("Save Data ===", TempObj)
        return JSON.stringify(TempObj);
  
  }
  SaveNewBatchNo(valid){
    this.ChangeBatchNoFormSubmitted = true;
    if(valid){
      const obj = {
        "SP_String": "SP_batch_no_change",
        "Report_Name_String" : "create_new_batch_no",
       "Json_Param_String": this.GetDataForSave()

      }
      this.GlobalAPI.postData(obj).subscribe((data:any)=>{
        //console.log(data);
        var tempID = data[0].Column1;
        if(data[0].Column1){
          this.compacctToast.clear();
          this.compacctToast.add({
           key: "compacct-toast",
           severity: "success",
           summary:  tempID,
           detail: "Succesfully  Saved" //+ mgs
         });
         this.ObjChangeBatchNo = new ChangeBatchNo()
         this.ChangeBatchNoFormSubmitted = false;
         this.OldBatchNoList = [];

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

  View(DocNo){
    this.Doc_No = undefined;
    if(DocNo.Doc_No){
    this.Doc_No = DocNo.Doc_No;
    this.getdataforview(this.Doc_No);;
    }
  }
  getdataforview(DocNo){
    this.ViewList = [];
    const obj = {
      "SP_String": "SP_Update_Expiry_Adjustment",
      "Report_Name_String": "Get_Data_For_View_Update_Expiry_Adjustment",
      "Json_Param_String": JSON.stringify([{Doc_No : this.Doc_No}])

    }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      this.ViewList = data;
       this.Doc_No = data[0].Doc_No;
       this.Doc_date = new Date(data[0].Doc_Date);
       this.BrandId = data[0].Brand_Name;
       this.Cost_Cent_ID = data[0].Location;
      // this.remarks = data[0].Narration
      console.log("this.Viewlist  ===",this.ViewList);

      this.ViewPoppup = true;
    })
  }

}
class ChangeBatchNo {
  Doc_No: any;
  Brand_ID: any;
  Production_Voucher_No: any;
  Product_ID : any;
  Qty : any;
  UOM:string = "";
  Old_Batch_No: any;
  New_Batch_No: any;
  To_Cost_Cen_ID:any;
  Product_Description:string = "";
  Exp_Date_Time : any;
  Batch_No : any;
  To_godown_id : any;
 // Batch_Qty : number;
 }
 class Browse {
  start_date : Date ;
  end_date : Date;
  Brand_ID : string;
}
