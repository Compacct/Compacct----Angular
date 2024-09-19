import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MessageService } from "primeng/api";
import {CompacctHeader} from "../../../../shared/compacct.services/common.header.service"
import { HttpClient, HttpParams } from '@angular/common/http';
import { CompacctGlobalApiService } from '../../../../shared/compacct.services/compacct.global.api.service';
import { DateTimeConvertService } from '../../../../shared/compacct.global/dateTime.service';
import { CompacctCommonApi } from '../../../../shared/compacct.services/common.api.service';
import { Dropdown } from "primeng/components/dropdown/dropdown";
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs/internal/Observable';

@Component({
  selector: 'app-k4c-raw-material-issue',
  templateUrl: './k4c-raw-material-issue.component.html',
  styleUrls: ['./k4c-raw-material-issue.component.css'],
  providers: [MessageService],
  encapsulation: ViewEncapsulation.None
})
export class K4cRawMaterialIssueComponent implements OnInit {
  items:any = [];
  Spinner = false;
  seachSpinner = false
  tabIndexToView = 0;
  buttonname = "Save";
  myDate = new Date();
  ObjRawMateriali : RawMateriali = new RawMateriali ();
  RawMaterialIssueFormSubmitted = false;
  ObjBrowse : Browse = new Browse ();
  Fcostcenlist:any = [];
  FromGodownList:any = [];
  Tocostcenlist :any= [];
  ToGodownList:any = [];
  FCostdisableflag = false;
  FGdisableflag = false;
  TCostdisableflag = false;
  TGdisableflag = false;
  IndentListFormSubmitted = false;
  IndentList:any = [];
  ProductList:any = [];
  SelectedIndent: any;
  BackupIndentList:any = [];
  IndentFilter:any = [];
  TIndentList:any = [];
  Searchedlist:any = [];
  flag = false;
  Param_Flag ='';
  CostCentId_Flag : any;
  constructor(
    private Header: CompacctHeader,
    private router : Router,
    private route : ActivatedRoute,
    private $http : HttpClient,
    private GlobalAPI: CompacctGlobalApiService,
    private DateService: DateTimeConvertService,
    public $CompacctAPI: CompacctCommonApi,
    private compacctToast: MessageService,
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      // console.log(params);
      this.Param_Flag = params['Name'];
      this.CostCentId_Flag = params['Cost_Cen_ID'];
       console.log (this.CostCentId_Flag);
    this.items = ["BROWSE", "CREATE"];
    this.Header.pushHeader({
      Header: "Raw Material " + this.Param_Flag,
      Link: " Material Management -> Raw Material " + this.Param_Flag
    });
    this.GetFromCostCen();
    this.GetToCostCen();
    this.clearData();
    this.Searchedlist = [];
    //this.ObjRawMateriali.To_Cost_Cen_ID = String(this.CostCentId_Flag);
  })
  }
  onReject(){
    this.compacctToast.clear("c");
  }
  onConfirm(){}
  TabClick(e){
    // console.log(e)
     this.tabIndexToView = e.index;
     this.items = ["BROWSE", "CREATE"];
     this.buttonname = "Save";
     this.clearData();
     this.BackupIndentList = [];
     this.TIndentList = [];
     this.SelectedIndent = [];
  }
  GetFromCostCen(){
    const tempObj = {
      Cost_Cen_ID : this.$CompacctAPI.CompacctCookies.Cost_Cen_ID
    }
    const obj = {
      "SP_String": "SP_Raw_Material_Issue",
      "Report_Name_String": "Get Cost Centre",
      "Json_Param_String": JSON.stringify([tempObj])
    }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      this.Fcostcenlist = data;
      //if(this.$CompacctAPI.CompacctCookies.User_Type != 'A'){
      //this.Objproduction.From_Cost_Cen_ID = this.Fcostcenlist.length === 21 ? this.Fcostcenlist[0].From_Cost_Cen_ID : undefined;
      //this.ObjRawMateriali.From_Cost_Cen_ID = data[0].Cost_Cen_ID;
      this.ObjRawMateriali.From_Cost_Cen_ID = this.$CompacctAPI.CompacctCookies.Cost_Cen_ID;
      this.FCostdisableflag = true;
      this.GetFromGodown();
      // } else {
      //   this.ObjRawMateriali.From_Cost_Cen_ID = this.$CompacctAPI.CompacctCookies.Cost_Cen_ID;
      //   this.FCostdisableflag = false;
      //   this.GetFromGodown();
      //  }
      // console.log("Cost Cen List ===",this.Fcostcenlist);
    })
  }
  GetFromGodown(){
    const tempObj = {
      //Cost_Cen_ID : this.$CompacctAPI.CompacctCookies.Cost_Cen_ID
      Cost_Cen_ID : this.ObjRawMateriali.From_Cost_Cen_ID
    }
    const obj = {
      "SP_String": "SP_Raw_Material_Issue",
      "Report_Name_String": "Get - Godown",
      "Json_Param_String": JSON.stringify([tempObj])
    }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      this.FromGodownList = data;
      //this.ObjRawMateriali.From_godown_id = data[0].godown_id;
      this.ObjRawMateriali.From_godown_id = this.FromGodownList.length === 1 ? this.FromGodownList[0].godown_id : undefined;
     if(this.FromGodownList.length === 1){
       this.FGdisableflag = true;
     }else{
       this.FGdisableflag = false;
     }
       //console.log("From Godown List ===",this.FromGodownList);
    })
  }
  GetToCostCen(){
    // const tempObj = {
    //   Cost_Cen_ID : this.CostCentId_Flag
    // }
    const obj = {
      "SP_String": "SP_Controller_Master",
      "Report_Name_String": "Get - Cost Center Name All",
      //"Json_Param_String": JSON.stringify([tempObj])
      "Json_Param_String": JSON.stringify([{User_ID:this.$CompacctAPI.CompacctCookies.User_ID}])
    }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      this.Tocostcenlist = data;
     // if(this.$CompacctAPI.CompacctCookies.User_Type != 'A'){
     // this.ObjRawMateriali.To_Cost_Cen_ID = this.$CompacctAPI.CompacctCookies.Cost_Cen_ID;
      this.ObjRawMateriali.To_Cost_Cen_ID = String(this.CostCentId_Flag);
      this.TCostdisableflag = true;
       this.GetToGodown();
      console.log("To Cost Cen List ===",this.ObjRawMateriali.To_Cost_Cen_ID);
    })
  }
  GetToGodown(){
    const tempObj = {
      Cost_Cen_ID : this.ObjRawMateriali.To_Cost_Cen_ID
    }
    const obj = {
      "SP_String": "SP_Raw_Material_Issue",
      "Report_Name_String": "Get - Godown",
      "Json_Param_String": JSON.stringify([tempObj])
    }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      this.ToGodownList = data;
       this.ObjRawMateriali.To_godown_id = this.ToGodownList.length === 1 ? this.ToGodownList[0].godown_id : undefined;
     if(this.ToGodownList.length === 1){
       this.TGdisableflag = true;
     }else{
       this.TGdisableflag = false;
     }
     //console.log("To Godown List ===",this.ToGodownList);
    })
  }

  // INDENT LIST DROPDOWN
  GetIndentList(valid){
    this.RawMaterialIssueFormSubmitted = true;
    this.ProductList = [];
    if(valid){
    const TempObj = {
      Cost_Cen_ID : this.ObjRawMateriali.From_Cost_Cen_ID,
      Godown_ID : this.ObjRawMateriali.From_godown_id
     }
   const obj = {
    "SP_String": "SP_Raw_Material_Issue",
    "Report_Name_String" : "Get Indent List With Multiple Choose",
   "Json_Param_String": JSON.stringify([TempObj])

  }
  this.GlobalAPI.getData(obj).subscribe((data:any)=>{
    // if(data.length) {
    //   data.forEach(element => {
    //     element['label'] = element.Doc_No,
    //     element['value'] = element.Doc_No
    //   });
      this.IndentList = data;
      this.BackupIndentList = data;
    // } else {
    //   this.IndentList = [];

    // }
    this.RawMaterialIssueFormSubmitted = false;
   console.log("this.Indentlist======",this.IndentList);
   this.GetIndent();
  })
  }
  }
  GetIndent(){
    let DIndent:any = [];
    this.IndentFilter = [];
    this.SelectedIndent = [];
    this.BackupIndentList.forEach((item) => {
      if (DIndent.indexOf(item.Doc_No) === -1) {
        DIndent.push(item.Doc_No);
        this.IndentFilter.push({ label: [item.Doc_No +'('+this.DateService.dateConvert(new Date(item.Doc_Date))+')'], value: item.Doc_No });
        console.log("this.IndentFilter", this.IndentFilter);
      }
    });
    this.BackupIndentList = [...this.IndentList];
  }
  filterIndentList() {
    //console.log("SelectedTimeRange", this.SelectedTimeRange);
    let DIndent:any = [];
    this.TIndentList = [];
    const temparr = this.ProductList.filter((item)=> item.Issue_Qty);
    this.ProductList = [];
    this.GetProduct(temparr.length ? temparr : []);
    if (this.SelectedIndent.length) {
      this.TIndentList.push('Doc_No');
      DIndent = this.SelectedIndent;
    }
    this.IndentList = [];
    if (this.TIndentList.length) {
      let LeadArr = this.BackupIndentList.filter(function (e) {
        return (DIndent.length ? DIndent.includes(e['Doc_No']) : true)
      });
      this.IndentList = LeadArr.length ? LeadArr : [];
    } else {
      this.IndentList = [...this.BackupIndentList];
      console.log("else Get indent list", this.IndentList)
    }

  }

  // GET PRODUCT LIST
  dataforproduct(){
    if(this.SelectedIndent.length) {
      let Arr:any =[]
      this.SelectedIndent.forEach(el => {
        if(el){
          const Dobj = {
            Doc_No : el,
            Cost_Cen_ID : this.ObjRawMateriali.From_Cost_Cen_ID,
            Godown_ID : this.ObjRawMateriali.From_godown_id,
            To_Cost_Cen_ID : this.ObjRawMateriali.To_Cost_Cen_ID,
            To_Godown_ID : this.ObjRawMateriali.To_godown_id
            }
      Arr.push(Dobj)
        }

    });
      console.log("Table Data ===", Arr)
      return Arr.length ? JSON.stringify(Arr) : '';
    }
  }
  GetProduct(arr){
    // const TempObj = {
    //   Cost_Cen_ID : this.ObjRawMateriali.From_Cost_Cen_ID,
    //   Godown_ID : this.ObjRawMateriali.From_godown_id,
    //  }
    if(this.dataforproduct()){
   const obj = {
    "SP_String": "SP_Raw_Material_Issue",
    "Report_Name_String" : "Get Product",
    "Json_Param_String": this.dataforproduct()
   //"Json_Param_String": JSON.stringify([TempObj])

  }
  this.GlobalAPI.getData(obj).subscribe((data:any)=>{
    if(arr.length) {
      arr.forEach(elem => {
       data.forEach( item =>{
          if(Number(item.Product_ID) === Number(elem.Product_ID)){
            item.Issue_Qty = elem.Issue_Qty
          }
        });
      })
    }
    this.ProductList = data;
   console.log("this.ProductList======",this.ProductList);


  });
}
  }

  // SAVE AND UPDATE
  qtyChq(col){
    this.flag = false;
    console.log("col",col);
    if(col.Issue_Qty){
      if(col.Issue_Qty <=  col.Batch_Qty){
        this.flag = false;
        return true;
      }
      else {
        this.flag = true;
        this.compacctToast.clear();
             this.compacctToast.add({
                 key: "compacct-toast",
                 severity: "error",
                 summary: "Warn Message",
                 detail: "Quantity can't be more than in batch available quantity "
               });

             }
    }
   }
   saveqty(){
    let flag = true;
   for(let i = 0; i < this.ProductList.length ; i++){
    if(Number(this.ProductList[i].Batch_Qty) <  Number(this.ProductList[i].Issue_Qty)){
      flag = false;
      break;
    }
   }
   return flag;
  }
  dataforSaveRawMaterialIssue(){
    // console.log(this.DateService.dateConvert(new Date(this.myDate)))
     this.ObjRawMateriali.Doc_Date = this.DateService.dateConvert(new Date(this.myDate));
    if(this.ProductList.length) {
      let tempArr:any =[]
      this.ProductList.forEach(item => {
        if(item.Issue_Qty && Number(item.Issue_Qty) != 0) {
        const obj = {
            Product_Type_ID : item.Product_Type_ID,
            Product_ID : item.Product_ID,
            Product_Description : item.Product_Description,
            Requisition_Qty : item.Requisition_Qty,
            Issue_Qty : item.Issue_Qty,
            UOM : item.UOM,
            Batch_No : item.Batch_No
        }

        const TempObj = {
          Doc_No : this.ObjRawMateriali.Doc_No ?  this.ObjRawMateriali.Doc_No : "A",
          Doc_Date : this.ObjRawMateriali.Doc_Date,
          From_Cost_Cent_ID : this.ObjRawMateriali.From_Cost_Cen_ID,
          From_Godown_ID : this.ObjRawMateriali.From_godown_id,
          To_Cost_Cent_ID : this.ObjRawMateriali.To_Cost_Cen_ID,
          To_Godown_ID : this.ObjRawMateriali.To_godown_id,
          User_ID : this.$CompacctAPI.CompacctCookies.User_ID
        }
        tempArr.push({...obj,...TempObj})
      }
      });
      console.log("Save Data ===", tempArr)
      return JSON.stringify(tempArr);

    }
  }
  SaveRawMaterialIssue(){
    if(this.ObjRawMateriali.From_Cost_Cen_ID == this.ObjRawMateriali.To_Cost_Cen_ID &&
      this.ObjRawMateriali.From_godown_id == this.ObjRawMateriali.To_godown_id){
      this.compacctToast.clear();
        this.compacctToast.add({
          key: "compacct-toast",
          severity: "error",
          summary: "Warn Message",
          detail: "can't use same stock point with respect to same cost centre"
        });
        return false;
    }
    if(this.saveqty()){
      const obj = {
        "SP_String": "SP_Raw_Material_Issue",
        "Report_Name_String" : "Save Raw Material Issue",
       "Json_Param_String": this.dataforSaveRawMaterialIssue()

      }
      this.GlobalAPI.postData(obj).subscribe((data:any)=>{
        //console.log(data);
        var tempID = data[0].Column1;
       // this.Objproduction.Doc_No = data[0].Column1;
        if(data[0].Column1){
          this.compacctToast.clear();
          const mgs = this.buttonname === "Save" ? "Saved" : "Updated";
          this.compacctToast.add({
           key: "compacct-toast",
           severity: "success",
           summary: "Production Voucher  " + tempID,
           detail: "Succesfully  " + mgs
         });
        //  if (this.buttonname == "Save & Print") {
        //  this.saveNprintProVoucher();
        //  }
         this.clearData();
         this.ProductList =[];
         this.Spinner = false;
         //this.ObjSaveForm = new SaveForm();
         this.IndentListFormSubmitted = false;
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
    else{
      this.compacctToast.clear();
      this.compacctToast.add({
          key: "compacct-toast",
          severity: "error",
          summary: "Warn Message",
          detail: "Quantity can't be more than in batch available quantity "
        });
    }
  }
  // checkgodown(){
  //   if(this.ObjRawMateriali.From_Cost_Cen_ID == this.ObjRawMateriali.To_Cost_Cen_ID &&
  //     this.ObjRawMateriali.From_godown_id == this.ObjRawMateriali.To_godown_id){
  //     this.compacctToast.clear();
  //       this.compacctToast.add({
  //         key: "compacct-toast",
  //         severity: "error",
  //         summary: "Warn Message",
  //         detail: "can't use same stock point with respect to same cost centre"
  //       });
  //       return false;
  //   }
  // }

  // FOR BROWSE
  getDateRange(dateRangeObj) {
    if (dateRangeObj.length) {
      this.ObjBrowse.start_date = dateRangeObj[0];
      this.ObjBrowse.end_date = dateRangeObj[1];
    }
  }
  GetSearchedList(){
    this.seachSpinner = true;
    this.Searchedlist = [];
  const start = this.ObjBrowse.start_date
  ? this.DateService.dateConvert(new Date(this.ObjBrowse.start_date))
  : this.DateService.dateConvert(new Date());
const end = this.ObjBrowse.end_date
  ? this.DateService.dateConvert(new Date(this.ObjBrowse.end_date))
  : this.DateService.dateConvert(new Date());
  // if(valid){
const tempobj = {
  From_Date : start,
  To_Date : end,
  //Brand_ID : this.ObjBrowse.Brand_ID,
  //Cost_Cen_ID : this.$CompacctAPI.CompacctCookies.Cost_Cen_ID,
}
const obj = {
  "SP_String": "SP_Raw_Material_Issue",
  "Report_Name_String": "Browse Raw Material Issue",
  "Json_Param_String": JSON.stringify([tempobj])
}
 this.GlobalAPI.getData(obj).subscribe((data:any)=>{
   this.Searchedlist = data;
   console.log('Search list=====',this.Searchedlist)
   this.seachSpinner = false;
 })
// }
  }
  clearData(){
    this.ObjRawMateriali.From_Cost_Cen_ID = this.$CompacctAPI.CompacctCookies.Cost_Cen_ID;
    this.ObjRawMateriali.To_Cost_Cen_ID = String(this.CostCentId_Flag);
    this.ObjRawMateriali.From_godown_id = this.FromGodownList.length === 1 ? this.FromGodownList[0].godown_id : undefined;
     if(this.FromGodownList.length === 1){
       this.FGdisableflag = true;
     }else{
       this.FGdisableflag = false;
     }
     this.ObjRawMateriali.To_godown_id = this.ToGodownList.length === 1 ? this.ToGodownList[0].godown_id : undefined;
     if(this.ToGodownList.length === 1){
       this.TGdisableflag = true;
     }else{
       this.TGdisableflag = false;
     }
    this.ObjRawMateriali.Remarks = [];
    this.ObjRawMateriali.Indent_List = undefined;
    this.ProductList = [];
    this.IndentList = [];
    this.BackupIndentList = [];
    this.TIndentList = [];
    this.SelectedIndent = [];
    this.IndentFilter = [];
  }

}
class RawMateriali {
  Doc_No : string;
  Doc_Date : string;
  From_godown_id : string;
  To_godown_id : string;
  To_Cost_Cen_ID : string;
  From_Cost_Cen_ID : string;
  Indent_List : string;
  Remarks : any;
 }
 class Browse {
  start_date : Date ;
  end_date : Date;
}
