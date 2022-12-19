import { Component, OnInit, ViewEncapsulation, ViewChild } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { MessageService } from "primeng/api";
import { ActivatedRoute } from "@angular/router";
import { CompacctCommonApi } from "../../../shared/compacct.services/common.api.service";
import { CompacctHeader } from "../../../shared/compacct.services/common.header.service";
import { CompacctGlobalApiService } from "../../../shared/compacct.services/compacct.global.api.service";
import { DateTimeConvertService } from "../../../shared/compacct.global/dateTime.service";
import * as XLSX from 'xlsx';
import { NgxUiLoaderService } from "ngx-ui-loader";

@Component({
  selector: 'app-accept-return-material',
  templateUrl: './accept-return-material.component.html',
  styleUrls: ['./accept-return-material.component.css'],
  providers:[MessageService],
  encapsulation: ViewEncapsulation.None
})
export class AcceptReturnMaterialComponent implements OnInit {
  items:any = [];
  tabIndexToView = 0;
  menuList:any = [];
  buttonname = "Create";
  seachSpinner = false;
  GetAllDataList:any = [];
  EditList:any = [];
  tabEdit = false;
  DocNO = undefined;
  FromStokePoint = undefined;
  date = undefined;
  viewDocNO = undefined;
  viewFromStokePoint = undefined;
  viewdate : any;
  productDetails:any = [];
  Spinner = false;
  saveData:any = [];
  ReasonList:any = [];
  ReasonId = undefined;
  Reason = undefined;
  tabView = false ;
  viewproductDetails:any = [];
  initDate:any = [];
  ObjBrowseData : BrowseData = new BrowseData ()
  DistributionSearchFormSubmitted = false;
  ToBcostcenlist:any = [];
  ToBGodownList:any = [];
  AcceptRMSearchFormSubmitted = false;
  Indent_Date: any;
  Material_Type = undefined;
  Adv_Order_No: any;
  Indent_Date_To: any;
  Indent_Date_From: any;
  ReqNo: any;
  ReqNolist = [];
  docno: any;
  docdate: Date;
  costcenname: any;
  godownname: any;
  viewgodownname: any;

  constructor(
    private $http : HttpClient,
    private commonApi : CompacctCommonApi,
    private Header : CompacctHeader,
    private GlobalAPI : CompacctGlobalApiService,
    private route : ActivatedRoute,
    private compacctToast : MessageService,
    private DateService : DateTimeConvertService,
    private $CompacctAPI: CompacctCommonApi,
    private ngxService: NgxUiLoaderService
  ) { }

  ngOnInit() {
    $(".content-header").removeClass("collapse-pos");
    $(".content").removeClass("collapse-pos");
    this.menuList = [
      { label: "Edit", icon: "pi pi-fw pi-user-edit" },
      { label: "Delete", icon: "fa fa-fw fa-trash" }
    ];
    this.Header.pushHeader({
      Header: "Accept Return Material",
      Link: "Material Management -> Outward -> Accept Return Material"
    });
    this.GetReason();
    this.Finyear();
    this.getCostcenter();
  }
  onConfirm(){}
  onReject(){
    this.compacctToast.clear("c");
  }
  TabClick(e) {
    this.tabIndexToView = e.index;
    this.items = ["BROWSE", "UPDATE"];
    this.buttonname = "Save";
    this.clearData();
  }
  clearData(){
    this.ngxService.stop();
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
  getCostcenter(){
    const obj = {
      "SP_String": "Sp_Return_Material_Module",
      "Report_Name_String": "Get_Cost_Center"
      
    }
     this.GlobalAPI.getData(obj).subscribe((data:any)=>{
       this.ToBcostcenlist = data;
       this.ObjBrowseData.Cost_Cen_ID = this.$CompacctAPI.CompacctCookies.Cost_Cen_ID;
       console.log('ToBcostcenlist=====',this.ToBcostcenlist)
       this.GetGodown();
     })

  }
  GetGodown(){
    const tempobj={
      Cost_Cen_ID : this.ObjBrowseData.Cost_Cen_ID
    }
    const obj = {
      "SP_String": "Sp_Return_Material_Module",
      "Report_Name_String": "Get_Godown_Name",
      "Json_Param_String": JSON.stringify([tempobj])
      
    }
     this.GlobalAPI.getData(obj).subscribe((data:any)=>{
       this.ToBGodownList = data;
       this.ObjBrowseData.godown_id = this.ToBGodownList.length ? data[0].godown_id : undefined;
       console.log('ToBGodownList=====',this.ToBGodownList)
       
     })

  }
  getConfirmDateRange(dateRangeObj) {
    if (dateRangeObj.length) {
      this.ObjBrowseData.From_Date = dateRangeObj[0];
      this.ObjBrowseData.To_Date = dateRangeObj[1];
    }
  }
  searchData(valid){
    this.AcceptRMSearchFormSubmitted = true;
  const start = this.ObjBrowseData.From_Date
        ? this.DateService.dateConvert(new Date(this.ObjBrowseData.From_Date))
        : this.DateService.dateConvert(new Date());
      const end = this.ObjBrowseData.To_Date
        ? this.DateService.dateConvert(new Date(this.ObjBrowseData.To_Date))
        : this.DateService.dateConvert(new Date());
    if(valid){
      const tempobj = {
        from_Date : start,
        to_date : end,
        Cost_Cen_ID : this.ObjBrowseData.Cost_Cen_ID ? this.ObjBrowseData.Cost_Cen_ID : 0,
        User_ID : this.$CompacctAPI.CompacctCookies.User_ID
        }

      const obj = {
        "SP_String": "Sp_Return_Material_Module",
        "Report_Name_String": "Txn_Return_Material_Browse",
        "Json_Param_String": JSON.stringify([tempobj])
      }
     this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      this.GetAllDataList = data;
      console.log("this.GetAllDataList",this.GetAllDataList);
      this.AcceptRMSearchFormSubmitted = false;
     // this.Objdispatch.From_Godown_ID = this.FromGodownList.length === 1 ? this.FromGodownList[0].From_Godown_ID : undefined;
    })
  //}
  }
  }
  editmaster(masterProduct){
   this.clearData();
   this.docno = undefined;
   this.docdate = new Date ();
   this.costcenname = undefined;
   this.godownname = undefined;
   if(masterProduct.Doc_No){
    this.docno = masterProduct.Doc_No;
    this.docdate = new Date(masterProduct.Doc_Date);
    this.costcenname = masterProduct.Cost_Cen_Name;
    this.godownname = masterProduct.godown_name;
    this.geteditmaster();
    }
  }
  geteditmaster(){
    const obj = {
      "SP_String": "Sp_Return_Material_Module",
      "Report_Name_String": "Txn_Return_Material_Get",
      "Json_Param_String": JSON.stringify([{Doc_No:this.docno}])
    }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      console.log("Api EditList",data);
      this.productDetails = data;
      // this.DocNO = data[0].Doc_No
      // this.FromStokePoint = data[0].From_godown_name
      // this.date = new Date(data[0].Doc_Date),
      // this.fromCostId = data[0].F_Cost_Cen_ID;
      // this.fromGodownId = data[0].F_Godown_ID;
      // this.ToCostId = data[0].To_Cost_Cen_ID;
      // this.ToGodownId = data[0].To_Godown_ID;
      // this.Indent_Date = data[0].Indent_Date;
      // this.Material_Type = data[0].Material_Type;
      // this.Adv_Order_No = data[0].Adv_Order_No;
      // this.Indent_Date_To = data[0].Indent_Date_To;
      // this.Indent_Date_From = data[0].Indent_Date_From;
      //this.ReqNo = data[0].Req_No;

       //if(this.productDetails.length){
      //  this.productDetails.forEach(item => {
      //   const dataTemp = this.productDetails.filter(elem=> elem.Qty == item.Accepted_Qty);
        // if(dataTemp.length === this.productDetails.length){
        //   this.productDetails[0].Accepted_Qty;
        // }

      // })
    //}
    // if(this.productDetails[0].Accepted_Qty === 0){
    //   this.productDetails[0].Accepted_Qty = this.productDetails[0].Qty
    //   } else {
    //     this.productDetails[0].Accepted_Qty = this.productDetails[0].Accepted_Qty
    //   }

      for(let i = 0; i < this.productDetails.length ; i++){
        this.selectBox(i);
        // if(this.productDetails[i].Accepted_Qty === 0){
        //  this.productDetails[i]['Accepted_Qty'] = this.productDetails[i]['Qty']
        // } else {
        //  this.productDetails[i]['Accepted_Qty'] = this.productDetails[i]['Accepted_Qty']
        // }
      }
      //this.getsubledgerid();
      console.log("this.EditList",this.productDetails);
      this.tabEdit = true;

    })
  //}
  }
  getTotal(key){
    let TotalAmt = 0;
    this.productDetails.forEach((item)=>{
      TotalAmt += Number(item[key]);
    });

    return  TotalAmt.toFixed(2);
  }
  // getReqNo(masterProduct){
  //   const obj = {
  //     "SP_String": "SP_Production_Voucher",
  //     "Report_Name_String": "Get Req_No For Accepted Receive Distribution Challan",
  //     "Json_Param_String": JSON.stringify([{Doc_No : masterProduct.Doc_No}])
  //   }
  //   this.GlobalAPI.getData(obj).subscribe((data:any)=>{
  //     this.ReqNolist = data;
  //     this.ReqNo = data[0].Req_No;
  //     console.log("this.ReqNolist",this.ReqNolist);
  //   })
  // }
  // getReqNos(){
  //   let Rarr =[]
  //   if(this.ReqNolist.length) {
  //     this.ReqNolist.forEach(el => {
  //       if(el){
  //         const Dobj = {
  //           Req_No : el.Req_No ? el.Req_No : 'NA'
  //           }
  //           Rarr.push(Dobj)
  //       }

  //   });
  //     console.log("Table Data ===", Rarr)
  //     return Rarr.length ? JSON.stringify(Rarr) : '';
  //   } 
  //   // else {
  //   //   const Dobj = {
  //   //     Req_No : 'NA'
  //   //     }
  //   //     Rarr.push(Dobj)
  //   // }
  //   // console.log("Table Data ===", Rarr)
  //   //   return Rarr.length ? JSON.stringify(Rarr) : '';
  // }
  CheckLengthProductID(ID) {
    const tempArr = this.productDetails.filter(item=> item.Product_ID == ID);
    return tempArr.length
  }
  CheckIndexProductID(ID) {
    let found = 0;
    for(let i = 0; i < this.productDetails.length; i++) {
        if (this.productDetails[i].Product_ID == ID) {
            found = i;
            break;
        }
    }
    return found;
  }
  CheckLengthProductIDview(ID) {
    const tempArr = this.viewproductDetails.filter(item=> item.Product_ID == ID);
    return tempArr.length
  }
  CheckIndexProductIDview(ID) {
    let found = 0;
    for(let i = 0; i < this.viewproductDetails.length; i++) {
        if (this.productDetails[i].Product_ID == ID) {
            found = i;
            break;
        }
    }
    return found;
  }
  // saveCheck(){
  //    if(this.fromCostId && this.fromGodownId){
  //     this.ngxService.start();
  //     this.tabEdit = false;
  //     const TempObj = {
  //       Cost_Cen_ID : this.fromCostId,
  //       Godown_Id : this.fromGodownId
  //    }
  //     const obj = {
  //       "SP_String": "SP_Controller_Master",
  //       "Report_Name_String": "Check_Day_End",
  //       "Json_Param_String": JSON.stringify([TempObj])
  //     }
  //     this.GlobalAPI.getData(obj).subscribe((data:any)=>{
  //       if(data[0].Status === "Allow"){
  //         this.saveDispatch();
  //       }
  //       else if(data[0].Status === "Disallow"){    // Disallow
  //         this.ngxService.stop();
  //         this.compacctToast.clear();
  //         this.compacctToast.add({
  //           key: "c",
  //           sticky: true,
  //           severity: "error",
  //           summary: data[0].Message,
  //           detail: "Confirm to proceed"
  //         });
  //         this.productDetails = [];
  //         this.clearData();
  //       } else {
  //         this.ngxService.stop();
  //         this.compacctToast.clear();
  //         this.compacctToast.add({
  //           key: "compacct-toast",
  //           severity: "error",
  //           summary: "Warn Message",
  //           detail: "Something Wrong"
  //         });
  //       }
  //     })
  //   }


  // }
  saveacceptreturn(){
    // if(this.productDetails.length){
      // if(this.saveReason()){
        this.ngxService.start();
        this.Spinner = true;
        let temparr:any = [];
      this.productDetails.forEach((item : any)=> {
         if(item.Accepted_Qty && Number(item.Accepted_Qty) != 0) {
          const saveObj = {
            Doc_No : item.Doc_No,
            Doc_Date : this.DateService.dateConvert(new Date(this.docdate)),
            Cost_Cen_ID : Number(item.Cost_Cen_ID),
            godown_id : Number(item.godown_id),
            Product_ID : Number(item.Product_ID),
            Qty : Number(item.Qty),
            Accepted_Qty : Number(item.Accepted_Qty),
            Rate : 0,
				    UOM : item.UOM,
            Batch_No : item.Batch_No,
            Serial_No : item.Serial_No,
            User_ID : this.commonApi.CompacctCookies.User_ID,
            Entry_Date : this.DateService.dateConvert(new Date()),
            Status : 'NA',
            Remarks : item.Remarks ? item.Remarks : 'NA',
            Store_Remarks : item.Store_Remarks ? item.Store_Remarks : 'NA',
            Total_Qty :	Number(this.getTotal('Qty')),
            Total_Accepted_Qty : Number(this.getTotal('Accepted_Qty'))
          }
          temparr.push(saveObj)
        }
      })
      // if(this.saveData.length){
        console.log("temparr",temparr);
        const obj = {
          "SP_String": "Sp_Return_Material_Module",
          "Report_Name_String":"Txn_Return_Material_Create",
          "Json_Param_String": JSON.stringify(temparr) 
        }
        this.GlobalAPI.getData(obj).subscribe((data:any)=>{
          console.log('data=',data[0].Column1);
       //if (data[0].Sub_Ledger_ID)
       if(data[0].Column1)
       {
         //this.SubLedgerID = data[0].Column1
        this.compacctToast.clear();
        this.compacctToast.add({
        key: "compacct-toast",
        severity: "success",
        summary: "Consumption Create Succesfully ",
        detail: "Succesfully Created"
      });
      this.tabEdit = false;
      this.searchData(true);
      // this.getCostcenter();
      this.Spinner = false;
      this.ngxService.stop();
      }
      else{
        this.Spinner = false;
        this.ngxService.stop();
        this.compacctToast.clear();
        this.compacctToast.add({
        key: "compacct-toast",
        severity: "error",
        summary: "Error",
        detail: "Something Wrong"
      });
      }
    })
  }
  selectBox(i){
    // if(this.productDetails[i].Accepted_Qty === 0){
    //    this.productDetails[i]['Accepted_Qty'] = this.productDetails[i]['Qty']
    //   } else {
    //    this.productDetails[i]['Accepted_Qty'] = this.productDetails[i]['Accepted_Qty']
    //   }
    // this.ReasonId = undefined;

    // console.log("index",i);
    // if(Number(this.productDetails[i]['Qty']) !== Number(this.productDetails[i]['Accepted_Qty'])){
    //   this.productDetails[i]['remarks'] = false;
    //   this.productDetails[i]['Accept_Reason_ID'] = this.productDetails[i]['Accept_Reason_ID'] ? this.productDetails[i]['Accept_Reason_ID'] : undefined;

    // }
    // else{
    //   this.productDetails[i]['remarks'] = true;
    //    this.productDetails[i]['Accept_Reason_ID'] = undefined;
    // this.productDetails[i]['Accept_Reason'] = undefined;
    //   this.productDetails[i]['Accept_Reason_ID'] = this.productDetails[i]['Accept_Reason_ID'] ? this.productDetails[i]['Accept_Reason_ID'] : undefined;
    // }
  }
  GetReason(){
    // const obj = {
    //   "SP_String": "SP_Production_Voucher",
    //   "Report_Name_String": "Get Date For Accpet Reason Dropdown",
    //  }
    //  this.GlobalAPI.getData(obj).subscribe((data:any)=>{
    //     this.ReasonList = data;
    //     console.log("this.ReasonList",this.ReasonList);
    //  })
  }
  saveReason(){
  //   let flag = true;
  //   let ExitsProduct = []
  //  for(let i = 0; i < this.productDetails.length;i++){
  //       if(this.productDetails[i]['remarks'] === false){
  //         //flag = false;
  //         if(this.productDetails[i]['Accept_Reason_ID'] === undefined){
  //           this.ngxService.stop();
  //           this.compacctToast.clear();
  //           this.compacctToast.add({
  //             key: "compacct-toast",
  //             severity: "error",
  //             summary: "Warn Message",
  //             detail: "Please Select Reason"
  //           });
  //           flag = false;
  //           break ;
  //         }


  //         }
  //     const sameproductwithbatch = this.ReasonList.filter(item=> Number(item.Accept_Reason_ID) === Number(this.productDetails[i]['Accept_Reason_ID']));
  //     if(sameproductwithbatch.length){
  //       this.productDetails[i]['Accept_Reason'] = sameproductwithbatch[0].Accept_Reason;
  //     }
  //   }


  //   return flag;
  }
  view(masterProduct){
    // this.clearData();
    this.viewproductDetails = [];
    this.viewdate = new Date ();
    this.viewFromStokePoint = undefined;
    this.viewgodownname = undefined;
   if(masterProduct.Doc_No){
    this.viewdate = new Date(masterProduct.Doc_Date);
    this.viewFromStokePoint = masterProduct.Cost_Cen_Name;
    this.viewgodownname = masterProduct.godown_name;
    const obj = {
      "SP_String": "Sp_Return_Material_Module",
      "Report_Name_String": "Txn_Return_Material_Get",
      "Json_Param_String": JSON.stringify([{Doc_No : masterProduct.Doc_No}])
    }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      console.log("Api view",data);
      this.viewproductDetails = data;
      // this.viewDocNO = data[0].Doc_No

      //console.log("this.EditList",this.productDetails);

    this.tabView = true;
    })
   }

  }

}
class BrowseData {
  From_Date: any;
  To_Date: any;
  Cost_Cen_ID : any;
  godown_id : any;
  }
