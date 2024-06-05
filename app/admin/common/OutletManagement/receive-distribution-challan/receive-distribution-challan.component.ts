import { Component, OnInit, ViewEncapsulation, ViewChild } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { MessageService } from "primeng/api";
import { FileUpload } from "primeng/primeng";
declare var $: any;
import { THIS_EXPR } from "@angular/compiler/src/output/output_ast";
import { CompacctCommonApi } from "../../../shared/compacct.services/common.api.service";
import { DateTimeConvertService } from "../../../shared/compacct.global/dateTime.service";
import { CompacctHeader } from "../../../shared/compacct.services/common.header.service";
import { CompacctGlobalApiService } from "../../../shared/compacct.services/compacct.global.api.service";
import { NgxUiLoaderService } from "ngx-ui-loader";



@Component({
  selector: 'app-receive-distribution-challan',
  templateUrl: './receive-distribution-challan.component.html',
  styleUrls: ['./receive-distribution-challan.component.css'],
  providers: [MessageService],
  encapsulation: ViewEncapsulation.None
})
export class ReceiveDistributionChallanComponent implements OnInit {
  items = [];
  tabIndexToView = 0;
  menuList = [];
  buttonname = "Create";
  seachSpinner = false;
  GetAllDataList = [];
  EditList = [];
  tabEdit = false;
  DocNO = undefined;
  FromStokePoint = undefined;
  date = undefined;
  viewDocNO = undefined;
  viewFromStokePoint = undefined;
  viewdate = undefined;
  productDetails = [];
  Spinner = false;
  saveData = [];
  ReasonList = [];
  ReasonId = undefined;
  Reason = undefined;
  tabView = false ;
  viewproductDetails = [];
  initDate = [];
  fromCostId = undefined;
  fromGodownId = undefined;
  ObjBrowseData : BrowseData = new BrowseData ()
  mattypelist = [];
  DistributionSearchFormSubmitted = false;
  Indent_Date: any;
  Material_Type = undefined;
  Adv_Order_No: any;
  Indent_Date_To: any;
  Indent_Date_From: any;
  updateexdate = [];
  Expirydate = [];
  ReqNo: any;
  ReqNolist = [];

  dispatchchallanno : any;
  FranchiseProductList = [];
  FranchiseList = [];
  taxable: any;
  cgst: any;
  sgst: any;
  igst: any;
  grossamount: any;
  netamount: any;
  Round_Off: any;
  currentDate: any = new Date();
  ToCostId = undefined;
  ToGodownId = undefined;
  subledgerid:any;
  franchisecostcenid:any;

  Franchise = [];
  FranchiseBill:any;
  ToCostCentId = undefined;
  lockdate:any;

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
    $(".content-header").removeClass("collapse-pos");
    $(".content").removeClass("collapse-pos");
    this.items = ["BROWSE", "UPDATE"];
    this.menuList = [
      { label: "Edit", icon: "pi pi-fw pi-user-edit" },
      { label: "Delete", icon: "fa fa-fw fa-trash" }
    ];
    this.Header.pushHeader({
      Header: "Browse Accept Challan",
      Link: "Outlet-> Browse Accept Challan"
    });
    this.GetReason();
    this.GetDate();
    this.getMaterialType();

    this.GetFranchiseBill();
    this.GetFranchiseList();
    this.getLockDate();
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
  getConfirmDateRange(dateRangeObj) {
    if (dateRangeObj.length) {
      this.ObjBrowseData.From_Date = dateRangeObj[0];
      this.ObjBrowseData.To_Date = dateRangeObj[1];
    }
  }
  GetDate(){
    const obj = {
      "SP_String": "SP_Production_Voucher",
      "Report_Name_String": "Get Date For Dispatch to outlet",
    }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      console.log("OutletNameList  ===",data);

      //this.ObjRequistion.Req_Date = new Date(data[0].Requisition_Date);
      new Date(data[0].Bill_Date);
      this.initDate = [ new Date(data[0].Bill_Date),new Date(data[0].Bill_Date)];
      // on save use this
      //this.ObjRequistion.Req_Date = this.DateService.dateTimeConvert(new Date(this.myDate));??

    })
  }
  getLockDate(){
    const obj = {
     "SP_String": "sp_Comm_Controller",
     "Report_Name_String": "Get_LockDate",
     //"Json_Param_String": JSON.stringify([{Doc_Type : "Sale_Bill"}])
  
   }
   this.GlobalAPI.getData(obj).subscribe((data:any)=>{
  //   console.log('LockDate===',data);
    this.lockdate = data[0].dated;
  
  })
  }
  checkLockDate(docdate){
    if(this.lockdate && docdate){
      if(new Date(docdate) > new Date(this.lockdate)){
        return true;
      } else {
        this.compacctToast.clear();
        this.compacctToast.add({
         key: "compacct-toast",
         severity: "error",
         summary: "Warn Message",
         detail: "Can't edit or delete this document. Transaction locked till "+ this.DateService.dateConvert(new Date (this.lockdate))
      });
        return false;
      }
    } else {
      this.compacctToast.clear();
      this.compacctToast.add({
       key: "compacct-toast",
       severity: "error",
       summary: "Warn Message",
       detail: "Date not found."
      });
      return false;
    }
  }
  getMaterialType() {
    const obj = {
      "SP_String": "SP_Production_Voucher",
      "Report_Name_String": "Get material Type",
    }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      this.mattypelist = data;
      //console.log("Material Type List ===",this.mattypelist);
    })
  }
  searchData(valid){
    this.seachSpinner = true;
    this.DistributionSearchFormSubmitted = true;
  const start = this.ObjBrowseData.From_Date
        ? this.DateService.dateConvert(new Date(this.ObjBrowseData.From_Date))
        : this.DateService.dateConvert(new Date());
      const end = this.ObjBrowseData.To_Date
        ? this.DateService.dateConvert(new Date(this.ObjBrowseData.To_Date))
        : this.DateService.dateConvert(new Date());
    if(valid){
      // if(this.ObjBrowseData.Material_Type === "Store Item"){
      //   const tempDate = {
      //     Material_Type : this.ObjBrowseData.Material_Type,
      //     From_Date :start,
      //     To_Date :end,
      //     Cost_Cen_ID : this.$CompacctAPI.CompacctCookies.Cost_Cen_ID,
      //     //Cost_Cen_ID :30
      //     Brand_ID  : 0
      //   }
  
      //  const obj = {
      //   "SP_String": "SP_Store_Item_Indent",
      //   "Report_Name_String": "Get Dispatch Details For Accept Challan Store Item",
      //   "Json_Param_String": JSON.stringify([tempDate])
      //  }
      //  this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      //   this.GetAllDataList = data;
      //   console.log("this.GetAllDataList",this.GetAllDataList);
      //   this.DistributionSearchFormSubmitted = false;
      //  // this.Objdispatch.From_Godown_ID = this.FromGodownList.length === 1 ? this.FromGodownList[0].From_Godown_ID : undefined;
      // })
      // } else {
        let spname = "";
        let reportname = "";
        if(this.ObjBrowseData.Material_Type == "Finished"){
          spname = "SP_Production_Voucher";
          reportname = "Get Dispatch Details For Accept Challan"
        } else {
          spname = "SP_Store_Item_Indent";
          reportname = "Get Store Item Dispatch Details For browse"
        }
      const tempDate = {
        Material_Type : this.ObjBrowseData.Material_Type,
        From_Date :start,
        To_Date :end,
        Cost_Cen_ID : this.$CompacctAPI.CompacctCookies.Cost_Cen_ID,
        //Cost_Cen_ID :30
        Brand_ID  : 0
      }

     const obj = {
      "SP_String": spname,
      "Report_Name_String": reportname,
      "Json_Param_String": JSON.stringify([tempDate])
     }
     this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      this.GetAllDataList = data;
      console.log("this.GetAllDataList",this.GetAllDataList);
      this.DistributionSearchFormSubmitted = false;
      this.seachSpinner = false;
     // this.Objdispatch.From_Godown_ID = this.FromGodownList.length === 1 ? this.FromGodownList[0].From_Godown_ID : undefined;
    })
  //}
    }
    else {
      this.seachSpinner = false;
    }
  }
  editmaster(masterProduct){
   this.clearData();
   this.ToCostCentId = undefined;
   if(masterProduct.Doc_No){
    // if(this.checkLockDate(masterProduct.Doc_Date)){
    this.fromCostId = undefined;
    this.fromGodownId = undefined;
    this.ToCostCentId = masterProduct.To_Cost_Cen_ID;
    this.tabIndexToView = 1;
    this.items = ["BROWSE", "UPDATE"];
    this.buttonname = "Update";
    console.log("this.tabIndexToView ",this.tabIndexToView )
    this.geteditmaster(masterProduct);
    this.getReqNo(masterProduct);
    this.getsubledgerid();
    // }
   }
  }
  geteditmaster(masterProduct){
    // if(this.ObjBrowseData.Material_Type === "Store Item"){
    //   const tempData = {
    //     Material_Type : this.ObjBrowseData.Material_Type,
    //     Doc_No : masterProduct.Doc_No
    //   }
    //   const obj = {
    //     "SP_String": "SP_Store_Item_Indent",
    //     "Report_Name_String": "Get Data For Accepted Receive Distribution Challan",
    //     "Json_Param_String": JSON.stringify([tempData])
    //   }
    //   this.GlobalAPI.getData(obj).subscribe((data:any)=>{
    //     console.log("Api EditList",data);
    //     this.productDetails = data;
    //     this.DocNO = data[0].Doc_No,
    //     this.FromStokePoint = data[0].From_godown_name,
    //     this.date = new Date(data[0].Doc_Date),
    //     this.fromCostId = data[0].F_Cost_Cen_ID;
    //     this.fromGodownId = data[0].F_Godown_ID;
    //     this.Indent_Date = data[0].Indent_Date;
    //     this.Material_Type = data[0].Material_Type;
    //     this.Adv_Order_No = data[0].Adv_Order_No;
    //     this.Indent_Date_To = data[0].Indent_Date_To;
    //     this.Indent_Date_From = data[0].Indent_Date_From;
  
    //     for(let i = 0; i < this.productDetails.length ; i++){
    //       this.selectBox(i);
    //     }
    //     console.log("this.EditList",this.productDetails);
    //    this.tabEdit = true;
  
    //   })
    // } else {
      const tempData = {
        Material_Type : this.ObjBrowseData.Material_Type,
        Doc_No : masterProduct.Doc_No
      }
    const obj = {
      "SP_String": "SP_Production_Voucher",
      "Report_Name_String": "Get Data For Accepted Receive Distribution Challan",
      "Json_Param_String": JSON.stringify([tempData])
    }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      console.log("Api EditList",data);
      this.productDetails = data;
      this.DocNO = data[0].Doc_No,
      this.FromStokePoint = data[0].From_godown_name,
      this.date = new Date(data[0].Doc_Date),
      this.fromCostId = data[0].F_Cost_Cen_ID;
      this.fromGodownId = data[0].F_Godown_ID;
      this.ToCostId = data[0].To_Cost_Cen_ID;
      this.ToGodownId = data[0].To_Godown_ID;
      this.Indent_Date = data[0].Indent_Date;
      this.Material_Type = data[0].Material_Type;
      this.Adv_Order_No = data[0].Adv_Order_No;
      this.Indent_Date_To = data[0].Indent_Date_To;
      this.Indent_Date_From = data[0].Indent_Date_From;
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
  GetFranchiseBill(){
    const tempObj = {
      Cost_Cen_ID : this.$CompacctAPI.CompacctCookies.Cost_Cen_ID,
      //Material_Type : this.MaterialType_Flag
    }
    const obj = {
      "SP_String": "SP_Controller_Master",
      "Report_Name_String": "Franchise Or not",
      "Json_Param_String": JSON.stringify([tempObj])
    }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      this.Franchise = data;
      this.FranchiseBill = data[0].Franchise;
      console.log("this.FranchiseList ===", this.FranchiseList)
      // this.FranchiseList.forEach(item => {
      //   item.Cost_Cen_ID = this.ObjfranchiseSalebill.Cost_Cen_ID
      // });
     })
  }
  getReqNo(masterProduct){
    const obj = {
      "SP_String": "SP_Production_Voucher",
      "Report_Name_String": "Get Req_No For Accepted Receive Distribution Challan",
      "Json_Param_String": JSON.stringify([{Doc_No : masterProduct.Doc_No}])
    }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      this.ReqNolist = data;
      this.ReqNo = data[0].Req_No;
      console.log("this.ReqNolist",this.ReqNolist);
    })
  }
  getReqNos(){
    let Rarr =[]
    if(this.ReqNolist.length) {
      this.ReqNolist.forEach(el => {
        if(el){
          const Dobj = {
            Req_No : el.Req_No ? el.Req_No : 'NA'
            }
            Rarr.push(Dobj)
        }

    });
      console.log("Table Data ===", Rarr)
      return Rarr.length ? JSON.stringify(Rarr) : '';
    } 
    // else {
    //   const Dobj = {
    //     Req_No : 'NA'
    //     }
    //     Rarr.push(Dobj)
    // }
    // console.log("Table Data ===", Rarr)
    //   return Rarr.length ? JSON.stringify(Rarr) : '';
  }
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
  saveCheck(){
     if(this.fromCostId && this.fromGodownId){
      this.ngxService.start();
      this.tabEdit = false;
      const TempObj = {
        Cost_Cen_ID : this.fromCostId,
        Godown_Id : this.fromGodownId
     }
      const obj = {
        "SP_String": "SP_Controller_Master",
        "Report_Name_String": "Check_Day_End",
        "Json_Param_String": JSON.stringify([TempObj])
      }
      this.GlobalAPI.getData(obj).subscribe((data:any)=>{
        if(data[0].Status === "Allow"){
          this.saveDispatch();
        }
        else if(data[0].Status === "Disallow"){    // Disallow
          this.ngxService.stop();
          this.compacctToast.clear();
          this.compacctToast.add({
            key: "c",
            sticky: true,
            severity: "error",
            summary: data[0].Message,
            detail: "Confirm to proceed"
          });
          this.productDetails = [];
          this.clearData();
        } else {
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


  }
  saveDispatch(){
    if(this.productDetails.length){
      if(this.saveReason()){
      this.saveData = [];
      this.productDetails.forEach(el=>{
         console.log(el.Accept_Reason);
          const saveObj = {
            Accept_Reason_ID : el.Accept_Reason_ID ? el.Accept_Reason_ID  : 0,
            Accept_Reason : el.Accept_Reason ? el.Accept_Reason : "NA",
            Doc_No: el.Doc_No,
            Doc_Date: this.DateService.dateConvert(new Date(el.Doc_Date)),
            F_Cost_Cen_ID: el.F_Cost_Cen_ID,
            F_Godown_ID: el.F_Godown_ID,
            To_Cost_Cen_ID: el.To_Cost_Cen_ID,
            To_Godown_ID: el.To_Godown_ID,
            Product_ID: el.Product_ID,
            Batch_No: el.Batch_No,
            Qty: el.Qty,
            Accepted_Qty: Number(el.Accepted_Qty),
            Rate: el.Rate,
            UOM: el.UOM,
            User_ID: el.USER_ID,
            REMARKS: el.REMARKS,
            Fin_Year_ID: el.Fin_Year_ID,
            Vehicle_Details: el.Vehicle_Details,
            Adv_Order_No: "NA",
            Indent_Date : this.DateService.dateConvert(new Date(el.Indent_Date)),
            Status : "Updated",
            Material_Type : el.Material_Type,
            Indent_Date_To : this.DateService.dateConvert(new Date(el.Indent_Date_To)),
            Indent_Date_From : this.DateService.dateConvert(new Date(el.Indent_Date_From)),
            Total_Qty : Number(this.getTotal('Qty')),
            Total_Accepted_Qty : Number(this.getTotal('Accepted_Qty'))
          }
          this.saveData.push(saveObj)

      })
      if(this.saveData.length){
        console.log("this.saveData",this.saveData);
        let SpName = "";
        let ReportName = "";
        if (this.ObjBrowseData.Material_Type == "Finished") {
          SpName = "SP_Production_Voucher"
          ReportName = "Add K4C Txn Distribution"
        } else {
          SpName = "SP_Store_Item_Indent"
          ReportName = "Add Store Item Dispatch"
        }
        const obj = {
          "SP_String": SpName,
          "Report_Name_String": ReportName,
          "Json_Param_String": JSON.stringify(this.saveData),
          //"Json_1_String" : JSON.stringify(this.ReqNolist)
          "Json_1_String" : this.getReqNos()
        }
        this.GlobalAPI.getData(obj).subscribe((data:any)=>{
          this.dispatchchallanno = data[0].Column1;
          if(data[0].Column1){
            if(this.FranchiseBill != "N" && Number(this.getTotal('Qty')) == Number(this.getTotal('Accepted_Qty'))) {
              this.SaveFranchisechallan();
            }
            this.updateexpirydate();
          this.searchData(true);
        this.tabEdit = false;
        this.ngxService.stop();
       this.compacctToast.clear();
       this.compacctToast.add({
        key: "compacct-toast",
        severity: "success",
        summary: "Accepted Distribution No. " + data[0].Column1,
        detail: "Accepted Distribution Challan Entry Succesfully"
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
    }
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
  // SAVE FRANCHISE
 SaveFranchisechallan(){
 // if (this.dispatchchallanno){
  const Obj = {
    Doc_No : this.dispatchchallanno,
    Cost_Cen_ID : this.fromCostId,
    From_Date : this.DateService.dateConvert(new Date(this.date)),
    To_Date :  this.DateService.dateConvert(new Date(this.date))
  }
     const obj = {
       "SP_String": "SP_K4C_Accounting_Journal",
       "Report_Name_String" : "Get Franchise Bill Ageinst Challan",
       "Json_Param_String": JSON.stringify([Obj])
     }
     this.GlobalAPI.postData(obj).subscribe((data:any)=>{
      this.FranchiseProductList = data;
      console.log("this.FranchiseProductList======",this.FranchiseProductList);
      if (this.FranchiseProductList.length) {
        this.calculateTotalAmt();
        this.SaveFranSaleBill();
      } else {
        this.searchData(true);
      }
     })
   
  //  }
  }
  GetFranchiseList(){
    // const tempObj = {
    //   Cost_Cen_ID : this.$CompacctAPI.CompacctCookies.Cost_Cen_ID,
    //   //Material_Type : this.MaterialType_Flag
    // }
    const obj = {
      "SP_String": "SP_Franchise_Sale_Bill",
      "Report_Name_String": "Get Franchise",
      //"Json_Param_String": JSON.stringify([tempObj])
    }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      this.FranchiseList = data;
      console.log("this.FranchiseList ===", this.FranchiseList)
      // this.FranchiseList.forEach(item => {
      //   item.Cost_Cen_ID = this.ObjfranchiseSalebill.Cost_Cen_ID
      // });
     })
  }
  getsubledgerid(){
    //this.ExpiredProductFLag = false;
   if(this.ToCostCentId) {
    const ctrl = this;
    const subledgeridObj = $.grep(ctrl.FranchiseList,function(item: any) {return item.Cost_Cen_ID == ctrl.ToCostCentId})[0];
    console.log(subledgeridObj);
    this.subledgerid = subledgeridObj.Sub_Ledger_ID;
    this.franchisecostcenid = subledgeridObj.Cost_Cen_ID;
    console.log("this.subledgerid ==", this.subledgerid)
    
   }
  }
  calculateTotalAmt(){
    this.taxable = undefined;
    this.cgst = undefined;
    this.sgst = undefined;
    this.igst = undefined;
    this.grossamount = undefined;
    let totaltax = 0; 
    let totalcgst = 0;
    let totalsgst = 0;
    let totaligst = 0;
    let grossamt = 0;
    this.FranchiseProductList.forEach(item => {
      totaltax = totaltax + Number(item.Taxable);
      totalcgst = totalcgst + Number(item.CGST_AMT);
      totalsgst = totalsgst + Number(item.SGST_AMT);
      totaligst = totaligst + Number(item.IGST_AMT);
      grossamt = grossamt + Number(item.Net_Amount);
    });
    this.taxable = (totaltax).toFixed(2);
    this.cgst = (totalcgst).toFixed(2);
    this.sgst = (totalsgst).toFixed(2);
    this.igst = (totaligst).toFixed(2);
    this.grossamount = (grossamt).toFixed(2);
    // Round Off
    this.Round_Off = (Number(this.grossamount) - Math.round(this.grossamount)).toFixed(2);
    this.netamount = Math.round(this.grossamount);
    //console.log(this.Net_Amount);
  }
 getdataforSaveFranchise(){
    //this.currentDate = this.DateService.dateConvert(new Date(this.currentDate));
    if(this.FranchiseProductList.length) {
      let tempArr =[]
      this.FranchiseProductList.forEach(item => {
        if (Number(item.Taxable) && Number(item.Taxable) != 0) {
     const TempObj = {
            Doc_No:  "A",
            //Doc_Date: this.currentDate,
            Doc_Date: this.DateService.dateConvert(new Date(this.date)),
            Sub_Ledger_ID : Number(this.subledgerid),
            Cost_Cen_ID	: 2,//this.fromCostId,
            Product_ID	: item.Product_ID,
            Product_Name	: item.Product_Description,
            Qty	: item.Qty,
            UOM	: item.UOM,
            MRP : item.Sale_rate,
            Rate : item.Sale_rate,
            Amount : Number(item.Qty) * Number(item.Sale_rate),
            Discount : 0,
            Taxable_Amount : item.Taxable,
            CAT_ID : item.Cat_ID,
            CGST_OUTPUT_LEDGER_ID : item.CGST_Output_Ledger_ID,
            CGST_Rate : item.CGST_PER,
            CGST_Amount : item.CGST_AMT,
            SGST_OUTPUT_LEDGER_ID : item.SGST_Output_Ledger_ID,
            SGST_Rate : item.SGST_PER,
            SGST_Amount : item.SGST_AMT,
            IGST_OUTPUT_LEDGER_ID : item.IGST_Output_Ledger_ID,
            IGST_Rate : item.IGST_PER,
            IGST_Amount : item.IGST_AMT,
            Bill_Gross_Amt : Number(this.taxable),
            Rounded_Off : Number(this.Round_Off),
            Bill_Net_Amt : this.netamount,
            User_ID : this.$CompacctAPI.CompacctCookies.User_ID,
            Remarks : 'NA',
            Fin_Year_ID : Number(this.$CompacctAPI.CompacctCookies.Fin_Year_ID),
            Total_Taxable : Number(this.taxable),
            Total_CGST_Amt : Number(this.cgst),
            Total_SGST_Amt : Number(this.sgst),
            Total_IGST_Amt : Number(this.igst),
            Total_Net_Amt : this.netamount,
            HSL_No : item.HSN_NO
         }
      tempArr.push(TempObj)
    } else {
      setTimeout(()=>{
      this.Spinner = false;
      this.ngxService.stop();
    this.compacctToast.clear();
    this.compacctToast.add({
       key: "compacct-toast",
      severity: "error",
      summary: "Warn Message",
      detail: "Error in Taxable amount"
    });
    },600)
  }
      });
      console.log("Save Data ===", tempArr)
      return JSON.stringify(tempArr);

    }
  }
  SaveFranSaleBill(){
    const obj = {
      "SP_String" : "SP_K4C_Accounting_Journal",
      "Report_Name_String" : "Save_Franchise_Sale_Bill",
      "Json_Param_String" : this.getdataforSaveFranchise(),
      "Json_1_String" : JSON.stringify([{Order_No : this.dispatchchallanno}])

    }
    this.GlobalAPI.postData(obj).subscribe((data:any)=>{
      //console.log(data);
      var tempID = data[0].Column1;
      console.log("After Save",tempID);
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
      // this.GetSearchedList();
       this.clearData();
       this.searchData(true);
      //  this.ProductList =[];
      //  this.franchiseSalebillFormSubmitted = false;
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
SaleBillPrint(obj) {
  //console.log("billno ===", obj.Bill_No)
  if (this.$CompacctAPI.CompacctCookies.User_Type != 'U'){
  if (obj.Bill_No) {
    window.open("/Report/Crystal_Files/Finance/SaleBill/Sale_Bill_GST_K4C.aspx?Doc_No=" + obj.Bill_No, 'mywindow', 'fullscreen=yes, scrollbars=auto,width=950,height=500'

    );
  }
  }
}
  updateexpirydate(){
    this.updateexdate = [];
    this.productDetails.forEach(el=>{
       const saveObj = {
         Doc_No: el.Doc_No,
       }
       this.updateexdate.push(saveObj)

   })
   const obj = {
    "SP_String": "SP_Production_Voucher",
    "Report_Name_String" : "Update Expiry date",
   "Json_Param_String": JSON.stringify(this.updateexdate)

  }
  this.GlobalAPI.postData(obj).subscribe((data:any)=>{
    this.Expirydate = data;
    console.log("expiry date ==",this.Expirydate);
  })
  }
  selectBox(i){
    if(this.productDetails[i].Accepted_Qty === 0){
       this.productDetails[i]['Accepted_Qty'] = this.productDetails[i]['Qty']
      } else {
       this.productDetails[i]['Accepted_Qty'] = this.productDetails[i]['Accepted_Qty']
      }
    this.ReasonId = undefined;

    console.log("index",i);
    if(Number(this.productDetails[i]['Qty']) !== Number(this.productDetails[i]['Accepted_Qty'])){
      this.productDetails[i]['remarks'] = false;
      this.productDetails[i]['Accept_Reason_ID'] = this.productDetails[i]['Accept_Reason_ID'] ? this.productDetails[i]['Accept_Reason_ID'] : undefined;

    }
    else{
      this.productDetails[i]['remarks'] = true;
       this.productDetails[i]['Accept_Reason_ID'] = undefined;
    this.productDetails[i]['Accept_Reason'] = undefined;
      this.productDetails[i]['Accept_Reason_ID'] = this.productDetails[i]['Accept_Reason_ID'] ? this.productDetails[i]['Accept_Reason_ID'] : undefined;
    }
  }
  GetReason(){
    const obj = {
      "SP_String": "SP_Production_Voucher",
      "Report_Name_String": "Get Date For Accpet Reason Dropdown",
     }
     this.GlobalAPI.getData(obj).subscribe((data:any)=>{
        this.ReasonList = data;
        console.log("this.ReasonList",this.ReasonList);
     })
  }
  saveReason(){
    let flag = true;
    let ExitsProduct = []
   for(let i = 0; i < this.productDetails.length;i++){
        if(this.productDetails[i]['remarks'] === false){
          //flag = false;
          if(this.productDetails[i]['Accept_Reason_ID'] === undefined){
            this.ngxService.stop();
            this.compacctToast.clear();
            this.compacctToast.add({
              key: "compacct-toast",
              severity: "error",
              summary: "Warn Message",
              detail: "Please Select Reason"
            });
            flag = false;
            break ;
          }


          }
      const sameproductwithbatch = this.ReasonList.filter(item=> Number(item.Accept_Reason_ID) === Number(this.productDetails[i]['Accept_Reason_ID']));
      if(sameproductwithbatch.length){
        this.productDetails[i]['Accept_Reason'] = sameproductwithbatch[0].Accept_Reason;
      }
    }


    return flag;
  }
  view(masterProduct){
    this.clearData();
   if(masterProduct.Doc_No){
     this.viewproductDetails = [];
    const obj = {
      "SP_String": "SP_Production_Voucher",
      "Report_Name_String": "Get Data For Accepted Receive Distribution Challan",
      "Json_Param_String": JSON.stringify([{Doc_No : masterProduct.Doc_No}])
    }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      console.log("Api view",data);
      this.viewproductDetails = data;
      this.viewDocNO = data[0].Doc_No,
      this.viewFromStokePoint = data[0].From_godown_name,
      this.viewdate = new Date(data[0].Doc_Date)

      //console.log("this.EditList",this.productDetails);

    this.tabView = true;
    })
   }

  }

}

class BrowseData {
  From_Date: string;
  To_Date: string;
  Material_Type : string;
  }
