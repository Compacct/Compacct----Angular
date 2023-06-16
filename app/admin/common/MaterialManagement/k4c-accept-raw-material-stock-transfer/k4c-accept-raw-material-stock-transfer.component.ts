import { Component, OnInit, ViewEncapsulation, ViewChild } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { MessageService } from "primeng/api";
import { FileUpload } from "primeng/primeng";
declare var $: any;
import { THIS_EXPR } from "@angular/compiler/src/output/output_ast";
import { CompacctCommonApi } from "../../../shared/compacct.services/common.api.service";
import { CompacctHeader } from "../../../shared/compacct.services/common.header.service";
import { CompacctGlobalApiService } from "../../../shared/compacct.services/compacct.global.api.service";
import { DateTimeConvertService } from "../../../shared/compacct.global/dateTime.service"
import { ActivatedRoute, Router } from "@angular/router";
import { NgxUiLoaderService } from "ngx-ui-loader";
import * as XLSX from 'xlsx';


@Component({
  selector: 'app-k4c-accept-raw-material-stock-transfer',
  templateUrl: './k4c-accept-raw-material-stock-transfer.component.html',
  styleUrls: ['./k4c-accept-raw-material-stock-transfer.component.css'],
  providers: [MessageService],
  encapsulation: ViewEncapsulation.None
})
export class K4cAcceptRawMaterialStockTransferComponent implements OnInit {
  items:any = [];
  Spinner = false;
  seachSpinner = false
  ShowSpinner = false;
  tabIndexToView = 0;
  buttonname = "Save";
  myDate = new Date();
  ObjBrowse : Browse = new Browse ();
  Searchedlist:any = [];
  flag = false;
  Param_Flag ='';
  CostCentId_Flag : any;
  MaterialType_Flag = '';
  TCdisableflag = false;
  todayDate = new Date();
  initDate:any = [];
  RawMaterialIssueSearchFormSubmitted = false;
  ToBcostcenlist:any = [];
  ToBGodownList:any = [];
  TBCdisableflag = false;
  TBGdisableflag = false;
  ViewPoppup = false;
  Viewlist:any = [];
  Doc_date: any;
  Formstockpoint: any;
  Tostockpoint: any;
  displaysavepopup = false;
  filteredData:any = [];
  ShowPopupSpinner = false;
  AcceptChallanPoppup:boolean=false;
  editList:any = [];
  Doc_No: any;
  From_outlet: any;
  To_Godown_ID: any;
  view:boolean = false;
  accept:boolean = false;

  constructor(
    private Header: CompacctHeader,
    private router : Router,
    private route : ActivatedRoute,
    private $http : HttpClient,
    private GlobalAPI: CompacctGlobalApiService,
    private DateService: DateTimeConvertService,
    public $CompacctAPI: CompacctCommonApi,
    private compacctToast: MessageService,
    private ngxService: NgxUiLoaderService
  ) { }

  ngOnInit() {
    // this.items = ["BROWSE", "CREATE"];
    this.route.queryParams.subscribe(params => {
     this.Param_Flag = params['Name'];
     this.CostCentId_Flag = params['Cost_Cen_ID'];
     this.MaterialType_Flag = params['Material_Type']
    this.Searchedlist = [];
    this.Header.pushHeader({
      Header: this.MaterialType_Flag + " Stock Transfer - " + this.Param_Flag,
      Link: " Material Management -> " + this.MaterialType_Flag + " Stock Transfer - " + this.Param_Flag
    });
    this.GetBToCostCen();
  })
  }
   onReject() {
    this.compacctToast.clear("c");
  }
  GetBToCostCen(){
    // const tempObj = {
    //   User_ID : this.$CompacctAPI.CompacctCookies.User_ID,
    //   Material_Type : this.MaterialType_Flag
    // }
    const obj = {
      "SP_String": "SP_Raw_Material_Stock_Transfer",
      "Report_Name_String": "Get Cost Centre Non outlet",
     // "Json_Param_String": JSON.stringify([tempObj])
    }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      this.ToBcostcenlist = data;
     // if(this.$CompacctAPI.CompacctCookies.User_Type != 'A'){
      if (this.CostCentId_Flag) {
      this.ObjBrowse.To_Cost_Cen_ID = String(this.CostCentId_Flag);
      this.TBCdisableflag = true;
      this.GetBToGodown();
      } else {
        this.ObjBrowse.To_Cost_Cen_ID = undefined;
        this.TBCdisableflag = false;
        this.GetBToGodown();
       // this.ToBGodownList = [];
      }
      console.log("To B Cost Cen List ===",this.ToBcostcenlist);
    })
  }
  GetBToGodown(){
    this.ToBGodownList = [];
    //if(this.ObjBrowse.To_Cost_Cen_ID){
      const tempObj = {
        Cost_Cen_ID : this.ObjBrowse.To_Cost_Cen_ID,
        Material_Type : this.MaterialType_Flag
      }
      const obj = {
        "SP_String": "SP_Raw_Material_Stock_Transfer",
        "Report_Name_String": "Get - Godown",
        "Json_Param_String": JSON.stringify([tempObj])
      }
      this.GlobalAPI.getData(obj).subscribe((data:any)=>{
        this.ToBGodownList = data;
  // this.ObjRawMateriali.To_godown_id = this.ToGodownList.length === 1 ? this.ToGodownList[0].godown_id : undefined;
       if(this.ToBGodownList.length === 1){
        //this.ObjRawMateriali.To_godown_id = this.ToGodownList[0].godown_id;
        this.ObjBrowse.To_godown_id = this.ToBGodownList[0].godown_id;
         this.TBGdisableflag = true;
       }else{
       // this.ObjRawMateriali.To_godown_id = undefined;
        this.ObjBrowse.To_godown_id = undefined;
         this.TBGdisableflag = false;
       }
       //console.log("To Godown List ===",this.ToGodownList);
      })
    //}

  }
  // FOR BROWSE
  getDateRange(dateRangeObj) {
    if (dateRangeObj.length) {
      this.ObjBrowse.start_date = dateRangeObj[0];
      this.ObjBrowse.end_date = dateRangeObj[1];
    }
  }
  GetSearchedList(valid){
    this.Searchedlist = [];
  const start = this.ObjBrowse.start_date
  ? this.DateService.dateConvert(new Date(this.ObjBrowse.start_date))
  : this.DateService.dateConvert(new Date());
const end = this.ObjBrowse.end_date
  ? this.DateService.dateConvert(new Date(this.ObjBrowse.end_date))
  : this.DateService.dateConvert(new Date());

  this.seachSpinner = true;
  this.RawMaterialIssueSearchFormSubmitted = true;
  if (valid){
const tempobj = {
  From_date : start,
  To_Date : end,
  Cost_Cen_ID : this.ObjBrowse.To_Cost_Cen_ID ? this.ObjBrowse.To_Cost_Cen_ID : 0,
  Godown_ID : this.ObjBrowse.To_godown_id ? this.ObjBrowse.To_godown_id : 0

}
const obj = {
  "SP_String": "SP_Raw_Material_Stock_Transfer",
  "Report_Name_String": "Browse Raw Material Stock Transfer",
  "Json_Param_String": JSON.stringify([tempobj])
}
 this.GlobalAPI.getData(obj).subscribe((data:any)=>{
   this.Searchedlist = data;
   console.log('Search list=====',this.Searchedlist)
   this.seachSpinner = false;
   this.RawMaterialIssueSearchFormSubmitted = false;
 })
}
}
exportoexcel(Arr,fileName): void {
  const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(Arr);
  const workbook: XLSX.WorkBook = {Sheets: {'data': worksheet}, SheetNames: ['data']};
  XLSX.writeFile(workbook, fileName+'.xlsx');
}
  // View
  View(DocNo){
    this.view = true;
    this.accept = false;
    this.Viewlist = [];
    this.Doc_No = undefined;
    this.Doc_date = undefined;
    this.Formstockpoint = undefined;
    this.Tostockpoint = undefined;
    if(DocNo.Doc_No){
      this.Doc_No = DocNo.Doc_No;
      this.Doc_date = DocNo.Doc_Date;
      this.Formstockpoint = DocNo.From_Godown_Name;
      this.Tostockpoint = DocNo.To_Godown_Name;
     this.geteditmaster(DocNo.Doc_No);
    }
  }
// Edit
AcceptST(DocNo){
  //this.clearData();
  this.accept = true;
  this.view = false;
  this.Doc_No = undefined;
  this.Doc_date = undefined;
  this.From_outlet = undefined;
  this.To_Godown_ID = undefined;
  if(DocNo.Doc_No){
    this.Doc_date = new Date(DocNo.Doc_Date);
    this.Doc_No = DocNo.Doc_No;
    this.From_outlet = DocNo.From_Godown_Name;
    this.To_Godown_ID = DocNo.To_Godown_Name;
    this.geteditmaster(DocNo.Doc_No);
  }

}
geteditmaster(Doc_No){
  const obj = {
    "SP_String": "SP_Raw_Material_Stock_Transfer",
    "Report_Name_String": "Get Raw Material Stock Transfer For Edit",
    "Json_Param_String": JSON.stringify([{Doc_No : Doc_No}])

  }
  this.GlobalAPI.getData(obj).subscribe((data:any)=>{
    this.Viewlist = data;
    this.editList = data;
    // this.Doc_no = data[0].Doc_No;
    this.Doc_date = new Date(data[0].Doc_Date);
    console.log("this.editList  ===",data);  
    this.ViewPoppup = this.view ? true : false; 
    this.AcceptChallanPoppup = this.accept ? true : false; 
    if (this.AcceptChallanPoppup) {
    for(let i = 0; i < this.editList.length ; i++){
    if(this.editList[i].Remarks == " "){
        this.editList[i].Remarks = null;
        } else {
          this.editList[i].Remarks = this.editList[i].Remarks;
        }
      }
    }
  })
}
getTotalValue(key){
  let Total = 0;
  this.editList.forEach((item)=>{
    Total += Number(item[key]);
  });

  return Total ? Total.toFixed(2) : '-';
}
changeRemarks(col){
  console.log("Change Remarks")
  this.editList.forEach(el=>{
    if(col.Product_ID === el.Product_ID){
     if(Number(col.Accepted_Qty) === Number(col.Qty)){
       // this.Remarksdisabled = true;
       col.Remarks = "NA";
      } else {
     //   this.Remarksdisabled = false;
       col.Remarks = el.Remarks;
      }
    }

  })
console.log(this.editList)
}
CheckRemarks(col) {
  if (Number(col.Accepted_Qty) === 0 && !col.Remarks) {
    return true;
  } 
  else {
    return false;
  }

}
ValidRemarksCheck() {
  let ValidFlag = false;
  for (let index = 0; index < this.editList.length; index++) {
    const element = this.editList[index];
    if (this.CheckRemarks(element)) {
      ValidFlag = false;
      this.compacctToast.clear();
      this.compacctToast.add({
        key: "compacct-toast",
        severity: "warn",
        summary: "Validation",
        detail: "Enter Remarks."
      });
      return ValidFlag;
    } else {
      ValidFlag = true;
    }

  }
  return ValidFlag;
}
AcceptRMST(){
  if(this.editList.length){
    let updateData:any = [];
    this.editList.forEach(el=>{

        const updateObj = {
          Doc_No:  el.Doc_No,
          Doc_Date: this.DateService.dateConvert(new Date(el.Doc_Date)),
          From_Cost_Cen_ID : el.From_Cost_Cen_ID,
          From_godown_id	: el.From_godown_id,
          To_Cost_Cen_ID	: el.To_Cost_Cen_ID,
          To_godown_id	: el.To_godown_id,
          Product_ID	: el.Product_ID,
          Product_Description	: el.Product_Description,
          Product_Type_ID	: el.Product_Type_ID,
          Qty	: Number(el.Qty),
          Accepted_Qty: Number(el.Accepted_Qty),
          UOM	: el.UOM,
          User_ID	: el.User_ID,
          Accepted_By : this.$CompacctAPI.CompacctCookies.User_ID,
          Batch_No : el.Batch_No,
          Remarks : Number(el.Qty) === Number(el.Accepted_Qty) ? 'NA' : el.Remarks ,
          Store_Remarks : el.Store_Remarks,
          Total_Qty : Number(this.getTotalValue('Qty')),
          Total_Accepted_Qty : Number(this.getTotalValue('Accepted_Qty'))

        }
        updateData.push(updateObj)

    })
  //}
  // if(this.ValidRemarksCheck()){
    if(updateData.length){
     // console.log("this.updateData",this.updateData);
      const obj = {
        "SP_String": "SP_Raw_Material_Stock_Transfer",
        "Report_Name_String" : "Save Raw Material Stock Transfer",
        "Json_Param_String": JSON.stringify(updateData)
      }
      this.GlobalAPI.getData(obj).subscribe((data:any)=>{
        // this.RTFchallanno = data[0].Column1;
        if(data[0].Column1){
        this.GetSearchedList(true);
      this.AcceptChallanPoppup = false;
      this.ngxService.stop();
     this.compacctToast.clear();
     this.compacctToast.add({
      key: "compacct-toast",
      severity: "success",
      summary: "Doc No. " + data[0].Column1,
      detail: "Accepted Succesfully"
    });
        }
        else{
          this.ngxService.stop();
          this.compacctToast.clear();
              this.compacctToast.add({
                key: "compacct-toast",
                severity: "error",
                summary: "Warn Message",
                detail: "Something Wrong"
              });
        }
    })
    }
    else{
      this.ngxService.stop();
      this.compacctToast.clear();
          this.compacctToast.add({
            key: "compacct-toast",
            severity: "error",
            summary: "Warn Message",
            detail: "Something Wrong"
          });
    }
  // }
  }
  else{
    this.ngxService.stop();
    this.compacctToast.clear();
        this.compacctToast.add({
          key: "compacct-toast",
          severity: "error",
          summary: "Warn Message",
          detail: "Something Wrong"
        });
  }
 }
 Accept(){
  if(this.ValidRemarksCheck()){
    this.AcceptRMST();
  }
 }

}
 class Browse {
  start_date : Date ;
  end_date : Date;
  To_Cost_Cen_ID : any;
  To_godown_id : any;
}
