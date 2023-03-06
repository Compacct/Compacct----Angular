import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { MessageService } from 'primeng/api';
import { DateTimeConvertService } from '../../../shared/compacct.global/dateTime.service';
import { CompacctCommonApi } from '../../../shared/compacct.services/common.api.service';
import { CompacctHeader } from '../../../shared/compacct.services/common.header.service';
import { CompacctGlobalApiService } from '../../../shared/compacct.services/compacct.global.api.service';

@Component({
  selector: 'app-micl-raw-material-qa',
  templateUrl: './micl-raw-material-qa.component.html',
  styleUrls: ['./micl-raw-material-qa.component.css'],
  providers: [MessageService] ,
  encapsulation: ViewEncapsulation.None
})
export class MICLRawMaterialQAComponent implements OnInit {
  tabIndexToView: number= 0;
  RecvDocList: any= [];
  SelectProductList: any= [];
  allDetalis: any= [];
  allDetalisHeader: any= [];
  QualityCheckFormSubmitted: boolean= false;
  Spinner: boolean= false;
  items: any= [];
  buttonname: any= "Create";
  newAllDetails: any= [];
  Created_By: any;
  Cost_Cen_ID: any;
  seachSpinner: boolean= false;
  Searchedlist: any= [];
  SearchedlistHeader: any=[];


  ObjRaw: RawMaterial = new RawMaterial();
  BackupSearchedlist:any = [];
  DistSubledgerName:any = [];
  SelectedDistSubledgerName:any = [];
  SearchFields:any = [];
  initDate:any = [];
  constructor(
    private $http: HttpClient,
    private GlobalAPI:CompacctGlobalApiService,
    private compacctToast:MessageService,
    private DateService: DateTimeConvertService,
    private Header: CompacctHeader,
    public $CompacctAPI: CompacctCommonApi
  ) { }

  ngOnInit() {
    this.Header.pushHeader({
      Header: "Quality Check",
      Link: "MICL -> Quality Check"
    });
    this.items = ["BROWSE", "CREATE"];
    this.Finyear();
    this.getRecvDoc();
    this.Created_By= Number(this.$CompacctAPI.CompacctCookies.User_ID);
    this.Cost_Cen_ID= Number(this.$CompacctAPI.CompacctCookies.Cost_Cen_ID);
  }

  TabClick(e) {
    this.tabIndexToView = e.index;
    this.items = ["BROWSE", "CREATE"];
    this.buttonname = "Create";
    this.ObjRaw = new RawMaterial();
    this.allDetalis=[];
    this.allDetalisHeader=[];
    this.SelectProductList=[];
    this.newAllDetails=[];
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

  getRecvDoc(){
    this.RecvDocList=[];
    const obj = {
      "SP_String": "SP_BL_Txn_Raw_Material_QA",
      "Report_Name_String": "Get_Receive_Doc_Nos" 
    }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      // console.log("Get RecvDocList",data);
      if(data.length) {
        data.forEach(element => {
          element['label'] = element.Doc_No,
          element['value'] = element.Doc_No
        });
       this.RecvDocList = data;
      }
       else {
        this.RecvDocList = [];
      }
    });
  }

  getDetails(DocNO){
    // console.log("getDetails",this.RecvDocList);
    // console.log("DOcNO",DocNO);
    this.SelectProductList = [];
    this.ObjRaw.SelectProduct = undefined;
    this.allDetalis = [];
    this.allDetalisHeader = [];
    if(DocNO && this.RecvDocList){
      for(let item of this.RecvDocList){
        if(item.Doc_No == DocNO){
          this.ObjRaw.VendorName= item.Sub_Ledger_Name;
          this.ObjRaw.RecievedOn= item.Doc_Date;
          this.ObjRaw.VendorInvNo= item.Inv_No_Date ? item.Inv_No_Date.split('&')[0] : "-";
          this.ObjRaw.VendorInvDate= item.Inv_No_Date ? item.Inv_No_Date.split('&')[1] : "-";
          this.ObjRaw.Inv_No_Date= item.Inv_No_Date;
          this.ObjRaw.Sub_Ledger_ID= item.Sub_Ledger_ID;
        }
      }
      this.getProductDetails(DocNO);
    }
    else{
      this.ObjRaw = new RawMaterial();
      this.allDetalis =[];
      this.allDetalisHeader=[];
      this.SelectProductList=[];
    }

   
    
  }

  getProductDetails(DocNO){
    this.SelectProductList=[];
    this.ObjRaw.SelectProduct = undefined;
    this.allDetalis = [];
    this.allDetalisHeader = [];
    const obj = {
      "SP_String": "SP_BL_Txn_Raw_Material_QA",
      "Report_Name_String":"Get_Product_Details",
      "Json_Param_String": JSON.stringify([{ Doc_No : DocNO}]) 
      }

      this.GlobalAPI.getData(obj).subscribe((data:any)=>{
        // console.log("getProductDetails",data);

        if(data.length) {
          data.forEach(element => {
            element['label'] = element.Product_Name,
            element['value'] = element.Product_ID
          });
         this.SelectProductList = data;
        }
         else {
          this.SelectProductList = [];
        }
      });  
  }

  getParameterDetails(Product_ID){
    this.allDetalis=[];
    this.allDetalisHeader=[];
    const obj = {
      "SP_String": "SP_BL_Txn_Raw_Material_QA",
      "Report_Name_String":"Get_Parameters",
      "Json_Param_String": JSON.stringify([{ Product_ID : Product_ID, Doc_No : this.ObjRaw.RecvDoc}]) 
      }

      this.GlobalAPI.getData(obj).subscribe((data:any)=>{
        // console.log("getParameterDetails",data);

        this.allDetalis = data;

        for(let item of this.SelectProductList){
          if(item.Product_ID == Product_ID){
            this.ObjRaw.UOM= item.UOM;
          }
        }

        this.allDetalis.forEach(ele=>{
          ele["QA_Value"]= ""
        })

        if (this.allDetalis.length) {
          this.allDetalisHeader = Object.keys(data[0]);
        }
      });  
  }

  SaveDoc(valid:any){
    this.newAllDetails=[];
    // console.log("S_AllDetails",this.allDetalis);

    this.allDetalis.forEach(element => {
      const TempObj = {
        Doc_No: "A",
        Doc_Date: this.DateService.dateConvert(new Date()),
        Product_ID: this.ObjRaw.SelectProduct,
        Parameter_ID: element.Parameter_ID,
        UOM: element.UOM,
        Max_Value: element.Max_Value,
        Min_Value: element.Min_Value,
        Rec_Value: element.Rec_Value,
        // Tolerance_Level: element.Tolerance_Level,
        Min_Tolerance_Level: element.Min_Tolerance_Level,
        Max_Tolerance_Level: element.Max_Tolerance_Level,
        QA_Value: Number(element.QA_Value)
      }
      this.newAllDetails.push(TempObj);
    });
    // console.log("newAllDetails",this.newAllDetails);

    const SaveObj = {
      Doc_No: "A",
      Doc_Date: this.DateService.dateConvert(new Date()),
      Rec_Doc_No: this.ObjRaw.RecvDoc,
      Rec_Doc_Date: this.ObjRaw.RecievedOn,
      Sub_Ledger_ID: this.ObjRaw.Sub_Ledger_ID,
      Inv_No_Date: this.ObjRaw.Inv_No_Date,
      Created_By: this.Created_By,
      Cost_Cen_ID: this.Cost_Cen_ID,
      Product_ID: this.ObjRaw.SelectProduct,
      UOM: this.ObjRaw.UOM,
      Parameter_Details: this.newAllDetails 
    }
    // console.log("SaveObj",SaveObj);

    this.QualityCheckFormSubmitted = true;
    if(valid){
      let msg = this.buttonname == "Create" ? "Create" : "Update";
      this.Spinner=true;
      const obj = {
      "SP_String": "SP_BL_Txn_Raw_Material_QA",
      "Report_Name_String": "Create_BL_Txn_Raw_Material_QA",
      "Json_Param_String": JSON.stringify(SaveObj)
      }
      this.GlobalAPI.postData(obj).subscribe((data: any) => {
        // console.log("save data",data);
        if (data[0].Column1){
          this.Spinner=false;
          this.QualityCheckFormSubmitted=false;
          this.compacctToast.clear();
          this.compacctToast.add({
            key: "compacct-toast",
            severity: "success",
            summary: "Parameter " + msg,
            detail: "Succesfully " + msg
          });
          this.ObjRaw = new RawMaterial();
          this.tabIndexToView = 0;
          this.items = ["BROWSE", "CREATE"];
          this.allDetalis=[];
          this.allDetalisHeader=[];
          this.SelectProductList=[];
          this.newAllDetails=[];
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
    }

  }

  getDateRange(dateRangeObj:any){
    if(dateRangeObj.length){
      this.ObjRaw.From_Date = dateRangeObj[0];
      this.ObjRaw.To_Date  = dateRangeObj[1];
    }
   
  }

  getAlldata(){
    this.Searchedlist=[];
    this.SearchedlistHeader=[];
    this.seachSpinner = true
    const start = this.ObjRaw.From_Date
    ? this.DateService.dateConvert(new Date(this.ObjRaw.From_Date))
    : this.DateService.dateConvert(new Date());
    const end = this.ObjRaw.To_Date
    ? this.DateService.dateConvert(new Date(this.ObjRaw.To_Date))
    : this.DateService.dateConvert(new Date());
    const tempobj = {
      From_Date : start,
      To_Date  : end
    }
    const obj = {
      "SP_String": "SP_BL_Txn_Raw_Material_QA",
      "Report_Name_String": "BL_Txn_Raw_Material_QA_Browse",
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

class RawMaterial{
  RecvDoc: any;
  VendorName: any;
  RecievedOn: any;
  VendorInvNo: any;
  VendorInvDate: any;
  Inv_No_Date: any;
  SelectProduct: any;
  Sub_Ledger_ID: number;
  UOM: any;
  From_Date: any;
  To_Date: any;
}
