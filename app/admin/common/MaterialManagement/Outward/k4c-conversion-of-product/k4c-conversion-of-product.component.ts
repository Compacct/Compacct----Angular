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
  todayDate : Date;
  ConversionProFormSubmitted = false;
  fromoutletdisableflag = false;
  fromstockdisableflag = false;
  tooutletdisableflag = false;
  tostockdisableflag = false;
  CostCentreList = [];
  GodownList = [];
  FromProductList = [];
  ToProductList = [];
  AddProducts = [];

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
    this.GetCostCentre();
    this.GetFromProduct();
    this.GetToProduct();
  }
  TabClick(e) {
    this.tabIndexToView = e.index;
    this.items = ["BROWSE", "CREATE"];
    this.buttonname = "Save";
    this.todayDate = new Date();
    this.AddProducts = [];
  }
  onConfirm(){};
  onReject(){};
  GetCostCentre(){
    const obj = {
      "SP_String": "SP_Conversion_Of_Product",
      "Report_Name_String": "GET_Cost_Cent_Name_All"
     }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
     this.CostCentreList = data;
    //  console.log("this.FromOutletList ======",this.FromOutletList);
      
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

    });
  }
  GetGodown(){
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
      this.ObjConversionpro.Godown_Id = this.GodownList[0].godown_id;
      this.fromstockdisableflag = true;
     }else{
       this.ObjConversionpro.Godown_Id = undefined;
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
  
  AddProduct(valid){
    //console.log('add ===', valid)
    this.ConversionProFormSubmitted = true;
    if(valid){
      //console.log(this.ObjproductAdd.Batch_No)
      var fromprodes = this.FromProductList.filter(el => el.Product_ID == this.ObjConversionpro.From_Product_ID);
      var toprodes = this.ToProductList.filter(el => el.Product_ID == this.ObjConversionpro.To_Product_ID);
    var productObj = {
      From_Product_ID : this.ObjConversionpro.From_Product_ID,
      From_Product_Description : fromprodes[0].Product_Description,
      From_Batch : this.ObjConversionpro.From_Batch,
      From_Qty :  this.ObjConversionpro.From_Qty,
      To_Product_ID : this.ObjConversionpro.To_Product_ID,
      To_Product_Description : toprodes[0].Product_Description,
      To_Batch : this.ObjConversionpro.To_Batch,
      To_Qty :  this.ObjConversionpro.To_Qty
    };
    this.AddProducts.push(productObj);
   // console.log("Product Submit",this.AddProDetails);
    this.ConversionProFormSubmitted = false;
    this.ObjConversionpro = new Conversionpro();
    }
    }
    
  delete(index) {
    this.AddProducts.splice(index,1)
  
    }
    SaveConversion(){};

}
class Conversionpro {
  Cost_Cen_ID : any;
  Godown_Id : any;
  From_Product_ID : any;
  From_Batch : any;
  From_Qty : number;
  To_Product_ID : any;
  To_Batch : any;
  To_Qty : number;
}
class Browse {
  start_date : Date ;
  end_date : Date;
  From_Cost_Cen_ID : any;
  From_Godown_Id : any;
}
