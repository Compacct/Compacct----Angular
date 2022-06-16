
import { AnyAaaaRecord } from 'dns';
import { Component, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { HttpClient, HttpParams } from "@angular/common/http";
import { MessageService } from "primeng/api";
import { FileUpload } from "primeng/primeng";
declare var $: any;
import { CompacctCommonApi } from "../../../../shared/compacct.services/common.api.service";
import { CompacctGlobalApiService } from "../../../../shared/compacct.services/compacct.global.api.service";
import { DateTimeConvertService } from "../../../../shared/compacct.global/dateTime.service";
import { CompacctHeader } from "../../../../shared/compacct.services/common.header.service";
import { NgxUiLoaderService } from "ngx-ui-loader";

@Component({
  selector: 'app-k4c-conversion-of-product',
  templateUrl: './k4c-conversion-of-product.component.html',
  styleUrls: ['./k4c-conversion-of-product.component.css'],
  providers: [MessageService],
  encapsulation: ViewEncapsulation.None
})
export class K4cConversionOfProductComponent implements OnInit {
  items = [];
  Spinner = false;
  seachSpinner = false;
  tabIndexToView = 0;
  buttonname = "Save"
  ObjConversionpro : Conversionpro = new Conversionpro ();
  ObjBrowse : Browse = new Browse ()
  todayDate : any = new Date();
  ConversionProFormSubmitted = false;
  ConversionCode = undefined;
  fromoutletdisableflag = false;
  fromstockdisableflag = false;
  tooutletdisableflag = false;
  tostockdisableflag = false;
  CostCentreList = [];
  GodownList = [];
  FromProductList = [];
  ToProductList = [];
  //AddProducts = [];

  ProductId = undefined;
  AllData =[];
  FromBatchList =[];
  Doc_No: any;
 

  constructor(
    private $http: HttpClient,
    private commonApi: CompacctCommonApi,
    private GlobalAPI: CompacctGlobalApiService,
    private Header: CompacctHeader,
    private DateService: DateTimeConvertService,
    public $CompacctAPI: CompacctCommonApi,
    private compacctToast: MessageService,
    private ngxService: NgxUiLoaderService
    ) { }

  ngOnInit() {
    this.items = ["BROWSE", "CREATE"];
    this.Header.pushHeader({
      Header: "Conversion of Product",
      Link: "Material Management -> Conversion of Product"
    });
    this.todayDate = new Date();
    //this.GetBrowseData();
   
  }
  TabClick(e) {
    this.tabIndexToView = e.index;
    this.items = ["BROWSE", "CREATE"];
    this.buttonname = "Save";
    this.todayDate = new Date();
    //this.AddProducts = [];
    this.clearData();
    this.GetCostCentre();
    this.GetFromProduct();
    this.GetToProduct();
  }
  clearData(){
  this.ConversionProFormSubmitted = false;
  this.ObjConversionpro= new Conversionpro ();
  this.ConversionCode = undefined;
  this.Spinner = false;
  this.GetFromBatch();
  this.FromBatch()
  }
   getDateRange(dateRangeObj) {
    if (dateRangeObj.length) {
      this.ObjBrowse.start_date = dateRangeObj[0];
      this.ObjBrowse.end_date = dateRangeObj[1];
    }
  }
  GetBrowseData(){
    this.seachSpinner = true;
    const start = this.ObjBrowse.start_date
    ? this.DateService.dateConvert(new Date(this.ObjBrowse.start_date))
    : this.DateService.dateConvert(new Date());
  const end = this.ObjBrowse.end_date
    ? this.DateService.dateConvert(new Date(this.ObjBrowse.end_date))
    : this.DateService.dateConvert(new Date());
  const tempobj = {
    From_Date : start,
    To_Date : end
  }
    const obj = {
      "SP_String":"SP_Conversion_Of_Product",
      "Report_Name_String":"Browse_Conversion_Of_Product",
      "Json_Param_String": JSON.stringify([tempobj])
    }
     this.GlobalAPI.getData(obj)
     .subscribe((data:any)=>{
      this.AllData = data;
      console.log("Browse data==",this.AllData);
      this.seachSpinner = false;
      }); 
  }
  GetCostCentre(){
    const obj = {
      "SP_String": "SP_Conversion_Of_Product",
      "Report_Name_String": "GET_Cost_Cent_Name_All"
     }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
     this.CostCentreList = data;
    console.log("this.CostCentreList ======",this.CostCentreList);
      
      if(this.$CompacctAPI.CompacctCookies.User_Type != 'A'){
        // this.ObjConversionpro.Cost_Cen_ID = this.CostCentreList.length === 1 ? this.CostCentreList[0].Cost_Cen_ID : undefined;
        this.ObjConversionpro.Cost_Cen_ID = this.$CompacctAPI.CompacctCookies.Cost_Cen_ID;
        this.fromoutletdisableflag = true;
        this.GetGodown();
        } else {
          this.ObjConversionpro.Cost_Cen_ID = undefined;
          this.fromoutletdisableflag = false;
          this.GetGodown();
       }
    console.log("ObjConversionpro.Cost_Cen_ID",this.ObjConversionpro.Cost_Cen_ID)
    });
  }
  GetGodown(){
   // console.log("cost==",this.ObjConversionpro.Cost_Cen_ID)
    const obj = {
      "SP_String": "SP_Conversion_Of_Product",
      "Report_Name_String": "GET_Godown",
      "Json_Param_String": JSON.stringify([{Cost_Cent_ID:this.ObjConversionpro.Cost_Cen_ID}])
      //"Json_Param_String": JSON.stringify([{User_ID : 61}])
     }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
     this.GodownList = data;
     //this.Objcrate.From_Godown_Id = this.FromGodownList.length === 1 ? this.FromGodownList[0].godown_id : undefined;
     if(this.GodownList.length === 1){
      this.ObjConversionpro.godown_id = this.GodownList[0].godown_id;
      this.fromstockdisableflag = true;
     }else{
       this.ObjConversionpro.godown_id = undefined;
       this.fromstockdisableflag = false;
     }
     // console.log("this.FromGodownList ======",this.FromGodownList);

    });
  }
 
  GetFromProduct(){
      const obj = {
       "SP_String": "SP_Conversion_Of_Product",
       "Report_Name_String" : "GET_Products"
 
     }
     this.GlobalAPI.getData(obj).subscribe((data:any)=>{
       if(data.length) {
         data.forEach(element => {
           element['label'] = element.Product_Description,
           element['value'] = element.Product_ID
         });
         this.FromProductList = data;
       } else {
         this.FromProductList = [];
 
       }
     console.log("this.FromProductList======",this.FromProductList);
 
 
     });
  }
  GetFromBatch(){
    this.FromBatchList=[];
    this.ObjConversionpro.From_UOM = undefined;
    this.GetUOMFrom();
    let tempObj = {
      Cost_Cen_ID:this.ObjConversionpro.Cost_Cen_ID,
      Godown_ID :this.ObjConversionpro.godown_id,
      Product_ID:this.ObjConversionpro.From_Product_ID
    }
    const obj = {
     "SP_String": "SP_Conversion_Of_Product",
     "Report_Name_String" : "GET_Batch",
     "Json_Param_String": JSON.stringify([tempObj])
   }
   this.GlobalAPI.getData(obj).subscribe((data:any)=>{
    this.FromBatchList = data;
    //this.GetUOMFrom();
   
    console.log("FromBatch===",this.FromBatchList)
    
 });
  }
GetToProduct(){
    const obj = {
     "SP_String": "SP_Conversion_Of_Product",
     "Report_Name_String" : "GET_Products"

   }
   this.GlobalAPI.getData(obj).subscribe((data:any)=>{
     if(data.length) {
       data.forEach(element => {
         element['label'] = element.Product_Description,
         element['value'] = element.Product_ID
       });
       this.ToProductList = data;
     } else {
       this.ToProductList = [];

     }
   console.log("this.ToProductList======",this.ToProductList);


   });
  }
GetUOMTo(){
  //console.log("uom",true)
  this.ObjConversionpro.To_UOM = undefined;
  if(this.ObjConversionpro.To_Product_ID){
    var uomname = this.ToProductList.filter(item => item.Product_ID === this.ObjConversionpro.To_Product_ID)
  this.ObjConversionpro.To_UOM = uomname[0].UOM ;
 
  }
  else 
  {
    this.ObjConversionpro.To_UOM = undefined;
  }
  // console.log("uom", this.ObjConversionpro.To_UOM)
  }
GetUOMFrom(){
   // console.log("uom",true)
    this.ObjConversionpro.From_UOM = undefined;
    if(this.ObjConversionpro.From_Product_ID){
      var uomname = this.FromProductList.filter(item => item.Product_ID === this.ObjConversionpro.From_Product_ID)
    this.ObjConversionpro.From_UOM = uomname[0].UOM ;
   
    }
    else 
    {
      this.ObjConversionpro.From_UOM = undefined;
    }
    // console.log("uom", this.ObjConversionpro.To_UOM)
    }
 FromBatch(){
  //console.log("FromBatch===",this.ObjConversionpro.From_Batch)
  if(this.ObjConversionpro.From_Batch){
  //   var batchname:any = this.FromBatchList.filter((item:any) => item.Batch_No === this.ObjConversionpro.From_Batch)
  // this.ObjConversionpro.To_Batch = batchname[0].Batch_No ;
  this.ObjConversionpro.To_Batch = this.ObjConversionpro.From_Batch;
  }
  else 
  {
    this.ObjConversionpro.To_Batch = undefined;
  }

  }
SaveConversion(valid:any){
    console.log("ObjConversionpro==",this.ObjConversionpro);
    this.ConversionProFormSubmitted = true;
     if(valid){
      if(this.ObjConversionpro.From_Product_ID !=   this.ObjConversionpro.To_Product_ID){
      this.Spinner = true
      //console.log("HrleaveId==",this.HrleaveId);
      // if(this.$CompacctAPI.CompacctCookies.User_Type === "A") {
      //    var fromprodes = this.FromProductList.filter(el => el.Product_ID == this.ObjConversionpro.From_Product_ID);
      //    var toprodes = this.ToProductList.filter(el => el.Product_ID == this.ObjConversionpro.To_Product_ID);
      //   var productObj:any = {
      //   Cost_Cen_ID: this.ObjConversionpro.Cost_Cen_ID,
      //   From_Product_ID : this.ObjConversionpro.From_Product_ID,
      //   //From_Product_Description : fromprodes[0].Product_Description,
      //   From_Batch : this.ObjConversionpro.From_Batch,
      //   From_Qty :  this.ObjConversionpro.From_Qty,
      //   To_Product_ID : this.ObjConversionpro.To_Product_ID,
      //  // To_Product_Description : toprodes[0].Product_Description,
      //   To_Batch : this.ObjConversionpro.To_Batch,
      //   To_Qty :  this.ObjConversionpro.To_Qty,
      //   Doc_No: this.ObjConversionpro.Doc_No,
      //   Doc_Date: this.ObjConversionpro.Doc_Date,
      //   User_ID: this.ObjConversionpro.User_ID,
      //   godown_id: this.ObjConversionpro.godown_id
      // }
      // }
      const tempobj = {
        Doc_No : "A",
        Doc_Date :this.DateService.dateConvert(new Date(this.todayDate)),
        User_ID:this.$CompacctAPI.CompacctCookies.User_ID,
         
      }
        const obj = {
          "SP_String": "SP_Conversion_Of_Product",
          "Report_Name_String": 'Save_Conversion_Of_Product',
          "Json_Param_String": JSON.stringify({...tempobj,...this.ObjConversionpro})
         }
         this.GlobalAPI.getData(obj)
         .subscribe((data:any)=>{
          console.log("Final save data ==",data);
          if (data[0].Column1){
            this.compacctToast.clear();
            this.compacctToast.add({
              key: "compacct-toast",
              severity: "success",
              summary: "Succesfully ", //+data[0].Msg,
              detail: "Succesfully "
            });
            this.Spinner = false;
            this.ConversionProFormSubmitted = false;
            //this.GetBrowseData();
            this.ProductId = undefined;
           
            this.tabIndexToView = 0;
            this.ConversionProFormSubmitted = false;
            this.ObjConversionpro = new Conversionpro();
            this.todayDate = new Date();
            this.GetGodown();
            this.GetFromBatch();
            this.FromBatch()
            }
            else {
              this.Spinner = false;
              this.compacctToast.clear();
              this.compacctToast.add({
                key: "compacct-toast",
                severity: "error",
                summary: "Warn Message ",
                detail: data[0].Msg
              });
            }
          });
      }
      else{
        this.Spinner = false;
        this.compacctToast.clear();
        this.compacctToast.add({
          key: "compacct-toast",
          severity: "error",
          summary: "Warn Message ",
          detail:"From & To Product Cannot be Same"
        });
      }
    }
    
  }
Delete(master): void{
  //console.log("deleteCol",master)
    this.Doc_No = undefined;
    if (master.Doc_No) {
     this.Doc_No = master.Doc_No;
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
onConfirm(){
    if(this.Doc_No){
      const TempObj = {
        Doc_No : this.Doc_No,
        User_ID : this.$CompacctAPI.CompacctCookies.User_ID,
      }
      const obj = {
        "SP_String": "SP_Conversion_Of_Product",
        "Report_Name_String": "Delete_Conversion_Of_Product",
        "Json_Param_String": JSON.stringify([TempObj])
      }
      this.GlobalAPI.getData(obj).subscribe((data:any)=>{
        console.log("del Data===", data[0].Column1)
         if (data[0].Column1 === "Done"){
           this.onReject();
           this.GetBrowseData();
           this.compacctToast.clear();
           this.compacctToast.add({
             key: "compacct-toast",
             severity: "success",
             summary: "Doc No.: " + this.Doc_No.toString(),
             detail: "Succesfully Deleted"
           });
           this.clearData();
         }
       })
    }
  }
onReject(){
      this.compacctToast.clear("c");
  }  
}
class Conversionpro {
  Cost_Cen_ID : any;
  godown_id : any;
  From_Product_ID : any;
  From_Batch : any;
  From_Qty : number;
  To_Product_ID : any;
  To_Batch : any;
  To_Qty : number;

  Doc_No:any;
  Doc_Date:any;
  User_ID:any;
  From_UOM:any;
  To_UOM:any
}
class Browse {
  start_date : Date ;
  end_date : Date;
  From_Cost_Cen_ID : any;
  From_Godown_Id : any;
}
