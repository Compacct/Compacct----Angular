import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MessageService } from "primeng/api";
import {CompacctHeader} from "../../../shared/compacct.services/common.header.service"
import { HttpClient, HttpParams } from '@angular/common/http';
import { CompacctGlobalApiService } from '../../../shared/compacct.services/compacct.global.api.service';
import { DateTimeConvertService } from '../../../shared/compacct.global/dateTime.service';
import { CompacctCommonApi } from '../../../shared/compacct.services/common.api.service';
import { Dropdown } from "primeng/components/dropdown/dropdown";
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs/internal/Observable';
import { Console } from 'console';
declare var $:any;

@Component({
  selector: 'app-k4c-factory-return',
  templateUrl: './k4c-factory-return.component.html',
  styleUrls: ['./k4c-factory-return.component.css'],
  providers: [MessageService],
  encapsulation: ViewEncapsulation.None
})
export class K4cFactoryReturnComponent implements OnInit {
  items = [];
  Spinner = false;
  seachSpinner = false
  tabIndexToView = 0;
  buttonname = "Save";

  myDate: Date;
  selectProduct = [];
  ObjProductaddForm : ProductaddForm  = new ProductaddForm();
  ObjSaveForm : SaveForm  = new SaveForm();

  public QueryStringObj : any;
  Cost_Center: any;
  Godown: any;
  BatchNo: any;
  //Expire_BatchNo: any;
  ExProductFlag = false;
  ReturnReasonid: any;
  GoDown_Id: void;
  ProductaddFormSubmitted = false;
  productaddSubmit = [];
  toGodownList = [];
  dateList: any;
  Searchedlist =[];
  constructor(
    private Header: CompacctHeader,
    private route : ActivatedRoute,
    private router : Router,
    private $http : HttpClient,
    private GlobalAPI: CompacctGlobalApiService,
    private DateService: DateTimeConvertService,
    public $CompacctAPI: CompacctCommonApi,
    private compacctToast: MessageService,
  ) {}

  ngOnInit() {
    this.items = ["BROWSE", "CREATE"];
    this.Header.pushHeader({
      Header: "Return To Factory",
      Link: " Outlet -> Return to Factory "
    });
    this.getDate();
    this.getToCostCenter();
    //this.getToGodown();
    this.getGodown();
    this.getselectproduct();
    this.getReturnReason();
    this.route.queryParamMap.subscribe((val:any) => {
      if(val.params) {
        this.QueryStringObj = val.params;
        if(this.QueryStringObj.Browse_Flag) {
          this.tabIndexToView = 1;
        }
      }
    } );
    //this.DateService.dateConvert(new Date(this.myDate));
  }
  onReject() {
    this.compacctToast.clear("c");
  }
  TabClick(e){
    //console.log(e)
    this.tabIndexToView = e.index;
    this.items = ["BROWSE", "CREATE"];
    this.buttonname = "Save";
    this.productaddSubmit =[];
    this.clearData();
  }
  getDate(){
    const obj = {
      "SP_String": "SP_Controller_Master",
      "Report_Name_String": "Get - End User Sale Bill Date",
      "Json_Param_String": JSON.stringify([{Doc_Type : "Sale_Bill"}])

    }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      this.dateList = data;
    //console.log("this.dateList  ===",this.dateList);
   this.myDate =  new Date(data[0].Column1);
    // on save use this
   // this.ObjRequistion.Req_Date = this.DateService.dateTimeConvert(new Date(this.myDate));

  })
  }

  getToCostCenter(){
    const obj = {
      "SP_String": "SP_Controller_Master",
      "Report_Name_String": "Get - Non Outlet Cost Centre",
     }
     this.GlobalAPI.getData(obj).subscribe((data:any)=>{
       this.Cost_Center = data;
       this.getToGodown();
      // console.log('Non Outlet Cost Center =',this.Cost_Center)

     })
  }
  getToGodown(){
   // console.log('to cost cent id ==', this.ObjSaveForm.Cost_Cent_ID)
    const TempObj = {
      Cost_Cen_ID : this.ObjSaveForm.Cost_Cent_ID
     }
    const obj = {
      "SP_String": "SP_Controller_Master",
      "Report_Name_String": "Get - Godown For Sale Bill",
      "Json_Param_String": JSON.stringify([TempObj])
     }
     this.GlobalAPI.getData(obj).subscribe((data:any)=>{
       this.toGodownList = data;
       //console.log('To Godown =',this.toGodownList)
     })
  }
  getGodown(){
    const TempObj = {
      Cost_Cen_ID : this.$CompacctAPI.CompacctCookies.Cost_Cen_ID
     }
    const obj = {
      "SP_String": "SP_Controller_Master",
      "Report_Name_String": "Get - Godown For Sale Bill",
      "Json_Param_String": JSON.stringify([TempObj])
     }
     this.GlobalAPI.getData(obj).subscribe((data:any)=>{
       this.Godown = data;
       this.GoDown_Id = data[0].godown_id ;
      // console.log('Godown =',this.Godown)
     })
  }

  getselectproduct(){
    //if(this.ObjaddbillForm.Cost_Cen_ID){
     //this.ObjProductaddForm.Doc_Date = this.DateService.dateConvert(new Date(this.myDate));
    // console.log("Doc_Date =",this.DateService.dateConvert(new Date(this.myDate)))
     const TempObj = {
       User_ID:this.$CompacctAPI.CompacctCookies.User_ID,
       Cost_Cen_ID : this.$CompacctAPI.CompacctCookies.Cost_Cen_ID,
       Doc_Type : "Sale_Bill",
       Doc_Date : this.DateService.dateConvert(new Date(this.myDate))
      }
      const obj = {
       "SP_String": "SP_Controller_Master",
       "Report_Name_String" : "Get Sale Requisition Product",
      "Json_Param_String": JSON.stringify([TempObj])

     }
     this.GlobalAPI.getData(obj).subscribe((data:any)=>{
       if(data.length) {
         data.forEach(element => {
           element['label'] = element.Product_Description,
           element['value'] = element.Product_ID
         });
         this.selectProduct = data;
       } else {
         this.selectProduct = [];

       }
      // console.log("select Product======",this.selectProduct);


     });
  }
  ProductChange() {
  this.BatchNo =[];
 if(this.ObjProductaddForm.Product_ID) {
   const ctrl = this;
  this.getBatchNo();
   const productObj = $.grep(ctrl.selectProduct,function(item) {return item.Product_ID == ctrl.ObjProductaddForm.Product_ID})[0];
   //console.log(productObj);
   this.ObjProductaddForm.Product_Description = productObj.Product_Description;
   this.ObjProductaddForm.Net_Price =  productObj.Net_Price;
  // //this.ObjaddbillForm.Stock_Qty = productObj.Stock_Qty;
  }
    }
  getBatchNo(){
  //console.log('Product Id ==',this.ObjProductaddForm.Product_ID)
  const TempObj = {
    Cost_Cen_ID : this.$CompacctAPI.CompacctCookies.Cost_Cen_ID,
    Godown_Id : this.GoDown_Id,
    Product_ID : this.ObjProductaddForm.Product_ID,
    //Cost_Cen_ID : 2,
    // Godown_Id : 4,
    // Product_ID : 3384
   }
  const obj = {
    "SP_String": "SP_Controller_Master",
    "Report_Name_String": "Get_Product_Wise_Batch",
    "Json_Param_String": JSON.stringify([TempObj])
   }
  this.GlobalAPI.getData(obj).subscribe((data:any)=>{
   this.BatchNo = data;
  // console.log('Batch No ==', data)

  });
  }
  ExpiredProducts(event){
    console.log("ExProductFlag",event);
    if(event){
      this.BatchNo = [];
      this.getExpireBathNo();
    }
    else{
      this.BatchNo = [];
      this.getBatchNo();
    }

  }
  getExpireBathNo(){

  const TempObj = {
    //Cost_Cen_ID : this.$CompacctAPI.CompacctCookies.Cost_Cen_ID
    Cost_Cen_ID : 2,
    Product_ID  : 3362,
    Godown_Id   : 4
   }
  const obj = {
    "SP_String": "SP_Controller_Master",
    "Report_Name_String": "Get_Expire_Product_Wise_Batch",
    "Json_Param_String": JSON.stringify([TempObj])
   }
   this.GlobalAPI.getData(obj).subscribe((data:any)=>{
     this.BatchNo = data;
    // console.log('Expire Batch No =',this.BatchNo)
   })
  }

  getReturnReason(){
  const obj = {
    "SP_String": "SP_Controller_Master",
    "Report_Name_String": "Return Reason Dropdown",
   }
   this.GlobalAPI.getData(obj).subscribe((data:any)=>{
     this.ReturnReasonid = data;
     //this.ObjProductaddForm.Return_Reason = data.Return_Reason;
    // console.log('Rerurn Reason =',this.ReturnReasonid)

   })
  }

  addProduct(valid){
  this.ProductaddFormSubmitted = true;
  if(valid){
    var RR = this.ReturnReasonid.find(Return_Reason => Return_Reason.Return_Reason_ID == this.ObjProductaddForm.Return_Reason_ID);
  var productObj = {
    Product_ID : this.ObjProductaddForm.Product_ID,
    Product_Description : this.ObjProductaddForm.Product_Description,
    Net_Price : this.ObjProductaddForm.Net_Price,
    Stock_Qty :  this.ObjProductaddForm.Stock_Qty,
    Batch_No : this.ObjProductaddForm.Batch_No,
    //Return_Reason : RR.Return_Reason
    Return_Reason : RR.Return_Reason,
    Return_Reason_ID : this.ObjProductaddForm.Return_Reason_ID
  };
  this.productaddSubmit.push(productObj);
 // console.log("Product Submit",this.productaddSubmit);
  this.ProductaddFormSubmitted = false;
  this.ObjProductaddForm = new ProductaddForm();
  this.BatchNo = [];
  this.ExProductFlag = false;
  }
 }
 getConfirmDateRange(e) {

 }
 GetSearchedlist(){}
 SaveProduct(){
  const obj = {
    "SP_String": "SP_Controller_Master",
    "Report_Name_String" : "Add Outlet Factory Return",
   "Json_Param_String": this.dataforSaveProduct()

  }
  this.GlobalAPI.postData(obj).subscribe((data:any)=>{
  //  console.log(data);
    var tempID = data[0].Column1;
    if(data[0].Column1){
      this.compacctToast.clear();
      //const mgs = this.buttonname === 'Save & Print Bill' ? "Created" : "updated";
      this.compacctToast.add({
       key: "compacct-toast",
       severity: "success",
       summary: "Return_ID  " + tempID,
       detail: "Succesfully Created" //+ mgs
     });
     this.clearData();
     this.productaddSubmit =[];
     this.ObjSaveForm = new SaveForm();

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
 dataforSaveProduct(){
  // console.log(this.DateService.dateConvert(new Date(this.myDate)))
   this.ObjSaveForm.Doc_Date = this.DateService.dateConvert(new Date(this.myDate));
  if(this.productaddSubmit.length) {
    let tempArr =[]
    this.productaddSubmit.forEach(item => {
      const obj = {
          Product_ID : item.Product_ID,
          Product_Description : item.Product_Description,
          Batch_No : item.Batch_No,
          Rate : item.Net_Price,
          Qty : item.Stock_Qty,
          Return_Reason : item.Return_Reason,
          Return_Reason_ID : item.Return_Reason_ID
      }

      const TempObj = {
        UOM : "PCS",
        Doc_No : "A",
        Doc_Date : this.ObjSaveForm.Doc_Date,
        F_Cost_Cen_ID : this.$CompacctAPI.CompacctCookies.Cost_Cen_ID,
        F_Godown_ID : this.GoDown_Id,
        To_Cost_Cen_ID : this.ObjSaveForm.Cost_Cent_ID,
        To_Godown_ID : this.ObjSaveForm.Godown_ID,
        User_ID : this.$CompacctAPI.CompacctCookies.User_ID,
        Fin_Year_ID : this.$CompacctAPI.CompacctCookies.Fin_Year_ID,
        REMARKS : "NA",
        //Return_Reason_ID : this.ObjProductaddForm.Return_Reason_ID

      }
      tempArr.push({...obj,...TempObj})
    });
   // console.log(tempArr)
    return JSON.stringify(tempArr);

  }
 }

 clearData(){
  this.ObjProductaddForm = new ProductaddForm();
  this.ObjSaveForm = new SaveForm();
  this.BatchNo = [];
 }


}
class SaveForm{
  Cost_Cent_ID : string;
  Godown_ID : string;
  Doc_Date : string;
}

class ProductaddForm{
  selectProduct : string;
  Product_ID : string;
  Batch_No : any;
  Return_Reason_ID : string;
  Return_Reason : string;
  BrowserDeliveryto : any;
  //User_ID : any;
  Doc_Type : any;
  /*Billno : string;
  selectitem : string;
  Qty : string;
 */
  Modifier : string;
  Product_Description : string;
  //Sale_rate : number;
  Net_Price : number;
  Stock_Qty : number;
}
