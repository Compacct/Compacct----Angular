import { Component, OnInit, ViewEncapsulation, ViewChild } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { MessageService } from "primeng/api";
import { FileUpload } from "primeng/primeng";
declare var $: any;
import { IfStmt, THIS_EXPR, ThrowStmt } from "@angular/compiler/src/output/output_ast";
import { NgxUiLoaderService } from "ngx-ui-loader";
import * as XLSX from 'xlsx';
import { CompacctCommonApi } from "../../../../shared/compacct.services/common.api.service";
import { CompacctGlobalApiService } from "../../../../shared/compacct.services/compacct.global.api.service";
import { CompacctHeader } from "../../../../shared/compacct.services/common.header.service";
import { DateTimeConvertService } from "../../../../shared/compacct.global/dateTime.service";
import { CompacctProjectComponent } from "../../../../shared/compacct.components/compacct.forms/compacct-project/compacct-project.component";
import { ActivatedRoute } from "@angular/router";

@Component({
  selector: 'app-furnace-mis-input',
  templateUrl: './furnace-mis-input.component.html',
  styleUrls: ['./furnace-mis-input.component.css'],
  providers: [MessageService],
  encapsulation: ViewEncapsulation.None
})
export class FurnaceMisInputComponent implements OnInit {
  FurnaceMISinputFormSubmitted = false;
  ObjFurnaceMISinput : FurnaceMISinput = new FurnaceMISinput();
  Doc_Date = new Date();
  tabIndexToView = 0;
  items:any = [];
  Spinner = false;
  AddRMConsList:any = [];
  RMConsumptionvalid = false;

  ObjDailyPerformancet : DailyPerformance = new DailyPerformance();
  FurnaceNoList:any = [];

  RawMatConsList:any = [];
  DynamicHeaderforRMC:any = [];

  ConsumableConsList:any = [];
  DynamicHeaderforCC:any = [];
  
  CostCenterList:any = [];
  GodownList:any = [];
  ProdList:any = [];
  WasteProList:any = [];

  ObjFurMISinputPro : FurMISinputPro = new FurMISinputPro();
  // ProductionList:any = [];
  AddProductionList:any = [];
  Productionvalid = false;

  ObjFurMISinputWaste : FurMISinputWaste = new FurMISinputWaste();
  // WasteSlagList:any = [];
  AddWasteSlagList:any = [];
  wasteslagvalid = false;
  ReasonList:any = [];

  ObjFurMISinputShutdoun : FurMISinputShutdoun = new FurMISinputShutdoun();
  Shutdownvalid = false;
  AddShutdownList:any = [];
  // FromTimeValue : any;
  // ToTimeValue : any;

  ProCharList:any = [];
  DynamicHeaderforProCharList:any = [];

  DispatchList:any = [];
  DynamicHeaderforDispatchList:any = [];
  ViewReasonModal = false;
  reasonid: any;
  CreateReasonModal = false;
  Reason_Des: any;
  Spinnerreas = false;
  CreateReasonFormSubmitted = false;
  Time_Duration: any;
  
  constructor(
    private $http: HttpClient,
    private commonApi: CompacctCommonApi,
    private GlobalAPI: CompacctGlobalApiService,
    private Header: CompacctHeader,
    private DateService: DateTimeConvertService,
    public $CompacctAPI: CompacctCommonApi,
    private compacctToast: MessageService,
    private route: ActivatedRoute,
    private ngxService: NgxUiLoaderService
  ) { }

  ngOnInit() {
    this.items = ["DAILY PERFORMANCE PARAMETER", "RAW MATERIAL CONSUMPTION", "CONSUMABLE CONSUMPTION",
                  "PRODUCTION", "WASTE SLAG", "SHUTDOWN DETAILS", "DISPATCHES", "CRITICAL ISSUE"];
    this.Header.pushHeader({
      Header: "Furnace MIS Input",
      Link: "Material Management -> Production -> Furnace MIS Input"
    });
    // this.RawMatConsList = ["Raw_Material_Consumable"]
    this.GetRaWMatConsumption();
    this.GetConsConsumption();
    this.getCostcenter();
    this.GetGodown();
    this.GetProduction();
    this.GetReason();
    this.GetFurnaceNo();
  }
  onReject(){
    this.compacctToast.clear("c");
    this.compacctToast.clear("s");
    this.compacctToast.clear("d");
    this.ngxService.stop();
    this.Spinner = false;
    this.Spinnerreas = false;
  }
  onConfirm(){}
  TabClick(e) {
    //console.log(e)
    this.tabIndexToView = e.index;
    this.items = ["DAILY PERFORMANCE PARAMETER", "RAW MATERIAL CONSUMPTION", "CONSUMABLE CONSUMPTION",
                  "PRODUCTION", "WASTE SLAG", "SHUTDOWN DETAILS", "DISPATCHES", "CRITICAL ISSUE"];
    //this.buttonname = "Save";
    //this.clearData();
  }
  clearData() {
    this.ObjFurnaceMISinput = new FurnaceMISinput();
    this.Doc_Date = new Date();
    this.ObjDailyPerformancet = new DailyPerformance();
    this.ObjFurMISinputPro = new FurMISinputPro();
    this.AddProductionList = [];
    this.ObjFurMISinputWaste = new FurMISinputWaste();
    this.AddWasteSlagList = []
    this.ObjFurMISinputShutdoun = new FurMISinputShutdoun();
    this.AddShutdownList = [];
    this.GetRaWMatConsumption();
    this.GetConsConsumption();
  }
  GetMISinputData() {

  }
  //  CheckDecimal  = function (col,inputtxt){ 
  CheckDecimal(col) {
      //this.flag = false;
      var decimal = /^[-+]?[0-9]+\.[0-9]+$/;
      var inputtxt = col ? col.toString() : col;
      if (inputtxt && inputtxt.match(decimal)) {
        // if (col === 2) {
          //this.flag = false;
          const p1 = /^[-+]?[0-9]+\.[0-9]{1,1}$/;
          const p2 = /^[-+]?[0-9]+\.[0-9]{2,2}$/;
          //console.log("col.Oty==", inputtxt.match(p2))
          return inputtxt.match(p1) || inputtxt.match(p2) ? false : true;
        } 
        else {
          if (inputtxt) {
            //this.flag = false;
            const p0 = /^\d+$/;
           // console.log("col.Oty==", inputtxt.match(p0))
            return inputtxt.match(p0) ? false : true;
          } 
          else {
            return !col ? false : true;
  
          // this.flag = true;
          // this.compacctToast.clear();
          // this.compacctToast.add({
          //   key: "compacct-toast",
          //   severity: "error",
          //   summary: "Warn Message",
          //   detail: "Error Occured "
          // });
        }
      }
  }
  ChangeConsumption() {
    this.GetRaWMatConsumption();
    this.GetConsConsumption();
    if (this.ObjFurnaceMISinput.Furnace_No && this.Doc_Date) {
    this.GetData();
    }
  }
  // RAW MATERIAL CONSUMPTION
  GetRaWMatConsumption() {
      // const start = this.ObjPendingRDB.start_date
      // ? this.DateService.dateConvert(new Date(this.ObjPendingRDB.start_date))
      // : this.DateService.dateConvert(new Date());
      // const end = this.ObjPendingRDB.end_date
      // ? this.DateService.dateConvert(new Date(this.ObjPendingRDB.end_date))
      // : this.DateService.dateConvert(new Date());
      const tempobj = {
      Furnace_ID : Number(this.ObjFurnaceMISinput.Furnace_No),
      Furnace_Date : this.DateService.dateConvert(new Date(this.Doc_Date))
      }
      const obj = {
        "SP_String": "SP_Furnace_MIS_Input",
        "Report_Name_String": "Get_Raw_Material_Consumption",
        "Json_Param_String": JSON.stringify([tempobj])
        }
      this.GlobalAPI.getData(obj).subscribe((data:any)=>{
        this.RawMatConsList = data;
        // this.BackupSearchedlist = data;
        // this.GetDistinct();
        if(this.RawMatConsList.length){
          this.DynamicHeaderforRMC = Object.keys(data[0]);
        }
        else {
          this.DynamicHeaderforRMC = [];
        }
        console.log("RawMatConsList",this.RawMatConsList);
      })
  }

  // CONSUMABLE CONSUMPTION
  GetConsConsumption() {
    const tempobj = {
    Furnace_ID : Number(this.ObjFurnaceMISinput.Furnace_No),
    Furnace_Date : this.DateService.dateConvert(new Date(this.Doc_Date))
    }
    const obj = {
      "SP_String": "SP_Furnace_MIS_Input",
      "Report_Name_String": "Get_Consumable_Consumption",
      "Json_Param_String": JSON.stringify([tempobj])
      }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      this.ConsumableConsList = data;
      // this.BackupSearchedlist = data;
      // this.GetDistinct();
      if(this.ConsumableConsList.length){
        this.DynamicHeaderforCC = Object.keys(data[0]);
      }
      else {
        this.DynamicHeaderforCC = [];
      }
      console.log("ConsumableConsList",this.ConsumableConsList);
    })
  }

  getCostcenter() {
    const obj = {
       "SP_String": "SP_Furnace_MIS_Input",
       "Report_Name_String": "Get_Cost_Center",
     }
     this.GlobalAPI.getData(obj).subscribe((data:any)=>{
       //console.log("costcenterList  ===",data);
      this.CostCenterList = data;
      this.ObjFurMISinputPro.Cost_Cent_ID = 36;
      this.ObjFurMISinputWaste.Cost_Cent_ID = 36;
   })
  }
  GetGodown() {
    const obj = {
     "SP_String": "SP_Furnace_MIS_Input",
     "Report_Name_String": "Get_Cost_Center_Godown"
    }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      this.GodownList = data;
      //console.log("this.toGodownList",this.GodownList);
      })
  }
  GetProduction() {
    const obj = {
      "SP_String": "SP_Furnace_MIS_Input",
      "Report_Name_String": "Get_Products"
    }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      //this.ProductionlList = data;
      if(data.length) {
        data.forEach(element => {
          element['label'] = element.Product_Description,
          element['value'] = element.Product_ID
        });
        this.ProdList = data;
        this.WasteProList = data;
      } else {
       this.ProdList = [];
       this.WasteProList = [];
      }
     console.log("Production List ===",this.ProdList);
  })
  }
  getProData(proid) {
    this.ObjFurMISinputPro.Product_Description = undefined;
    this.ObjFurMISinputPro.UOM = undefined;
    if (proid) {
      console.log("proid ====",proid)
      var prodata = this.ProdList.filter(item=> Number(item.Product_ID) === Number(proid))
      this.ObjFurMISinputPro.UOM = prodata[0].UOM;
      this.ObjFurMISinputPro.Product_Description = prodata[0].Product_Description;
    }
  }
  getwasteProData(wasteproid) {
    this.ObjFurMISinputWaste.Product_Description = undefined;
    this.ObjFurMISinputWaste.UOM = undefined;
    if (wasteproid) {
      console.log("wasteproid ====",wasteproid)
      var WasteProuom = this.WasteProList.filter(el=> Number(el.Product_ID) === Number(wasteproid))
      this.ObjFurMISinputWaste.UOM = WasteProuom[0].UOM;
      this.ObjFurMISinputWaste.Product_Description = WasteProuom[0].Product_Description
    }
  }
  // PRODUCTION
  addProduction(valid) {
  this.Productionvalid = true;
  var stockpoint = this.GodownList.filter(el=> Number(el.Godown_ID) === Number(this.ObjFurMISinputPro.Godown_ID));
  if(valid){
      this.AddProductionList.push({
        Cost_Cent_ID : this.ObjFurMISinputPro.Cost_Cent_ID,
        Godown_ID : Number(this.ObjFurMISinputPro.Godown_ID),
        Godown_Name : stockpoint[0].godown_name,
        Product_ID : this.ObjFurMISinputPro.Product_ID,
        Product_Description: this.ObjFurMISinputPro.Product_Description,
        Batch_No: this.ObjFurMISinputPro.Batch_No,
        Qty: Number(this.ObjFurMISinputPro.Qty),
        UOM : this.ObjFurMISinputPro.UOM
      })
      this.Productionvalid = false;
      this.ObjFurMISinputPro = new FurMISinputPro();
      this.ObjFurMISinputPro.Cost_Cent_ID = 36;
    }
  }
  Productiondelete(i) {
    this.AddProductionList.splice(i,1);
  }

  // WASTE SLAG
  addWasteSlag(valid) {
    this.wasteslagvalid = true;
    var stockpointw = this.GodownList.filter(el=> Number(el.Godown_ID) === Number(this.ObjFurMISinputWaste.Godown_ID));
    if(valid){
        this.AddWasteSlagList.push({
          Cost_Cent_ID : this.ObjFurMISinputWaste.Cost_Cent_ID,
          Godown_ID : Number(this.ObjFurMISinputWaste.Godown_ID),
          Godown_Name : stockpointw[0].godown_name,
          Product_ID : this.ObjFurMISinputWaste.Product_ID,
          Product_Description: this.ObjFurMISinputWaste.Product_Description,
          Batch_No: this.ObjFurMISinputWaste.Batch_No,
          Qty: Number(this.ObjFurMISinputWaste.Qty),
          UOM : this.ObjFurMISinputWaste.UOM
        })
        this.wasteslagvalid = false;
        this.ObjFurMISinputWaste = new FurMISinputWaste();
        this.ObjFurMISinputWaste.Cost_Cent_ID = 36;
      }
  }
  WasteSlagdelete(i) {
    this.AddWasteSlagList.splice(i,1);
  }
  
  // SHUTDOWN DETAILS
  GetReason() {
    const obj = {
      "SP_String": "SP_Furnace_MIS_Input",
      "Report_Name_String": "Get_Reason_For_Dropdown"

    }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
       this.ReasonList = data;
       console.log("ReasonList======",this.ReasonList);
    });
  }
  dateTimeConvert = function(dateTimeParam) {
    let hours = dateTimeParam.getHours();
    let minutes = dateTimeParam.getMinutes();
    const ampm = hours >= 12 ? "pm" : "am";
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? "0" + minutes : minutes;
    const strTime = hours + ":" + minutes + " " + ampm;
    return (
      strTime
    );
  };
  addShutdown(valid) {
    this.Shutdownvalid = true;
    var reson = this.ReasonList.filter(el => Number(el.Reason_ID) === Number(this.ObjFurMISinputShutdoun.Reason_ID))
    var furdate = this.DateService.dateConvert(new Date(this.Doc_Date))
    var ftime = this.dateTimeConvert(new Date(this.ObjFurMISinputShutdoun.From_Time))
    var totime = this.dateTimeConvert(new Date())
    console.log("totime",totime)
    console.log("this.ObjFurMISinputShutdoun.From_Time",this.ObjFurMISinputShutdoun.From_Time)
    console.log("this.ObjFurMISinputShutdoun.To_Time",this.ObjFurMISinputShutdoun.To_Time)
 
    if(valid){
      this.CalculateTime();
        this.AddShutdownList.push({
          From_Time: furdate + " " + this.transform(this.ObjFurMISinputShutdoun.From_Time),
          To_Time: furdate +" "+ this.transform(this.ObjFurMISinputShutdoun.To_Time),
          Time_Duration: this.Time_Duration,
          Reason_ID: Number(this.ObjFurMISinputShutdoun.Reason_ID),
          Reason_Des: reson[0].Reason_Des,
        })
        this.Shutdownvalid = false;
        this.ObjFurMISinputShutdoun = new FurMISinputShutdoun()
      }
  }
  Shutdowndelete(i) {
    this.AddShutdownList.splice(i,1);
  }
  transform(time: any): any {
    let hour = (time.split(':'))[0]
    let min = (time.split(':'))[1]
    let part = hour > 12 ? 'PM' : 'AM';
    if(parseInt(hour) == 0)
     hour = 12;
    min = (min+'').length == 1 ? `0${min}` : min;
    hour = hour > 12 ? hour - 12 : hour;
    hour = (hour+'').length == 1 ? `0${hour}` : hour;
    return `${hour}:${min}${part}`
  }

  //REASON
  // ViewReason(){
  //   this.ReasonList = [];
  //   this.GetReason();
  //   setTimeout(() => {
  //   this.ViewReasonModal = true;
  //   }, 300);
  // }
  // deleteReason(reasonid){
  //   this.reasonid = undefined;
  //   if(reasonid.Reason_ID){
  //     this.reasonid = reasonid.Reason_ID;
  //    // this.cnfrm2_popup = true;
  //     this.compacctToast.clear();
  //     this.compacctToast.add({
  //       key: "d",
  //       sticky: true,
  //       severity: "warn",
  //       summary: "Are you sure?",
  //       detail: "Confirm to proceed"
  //     });
  //   }
  // }
  ReasonPopup(){
    this.CreateReasonFormSubmitted = false;
    this.Reason_Des = undefined;
    this.CreateReasonModal = true;
    this.Spinnerreas = false;
  }
  CreateReason(valid){
    this.CreateReasonFormSubmitted = true;
    this.Spinnerreas = true;
      const Obj = {
        Reason_Des : this.Reason_Des
      }
      if(valid){
         const obj = {
           "SP_String": "SP_Furnace_MIS_Input",
           "Report_Name_String" : "Create_Reason_For_Dropdown",
           "Json_Param_String": JSON.stringify([Obj])
       
         }
         this.GlobalAPI.postData(obj).subscribe((data:any)=>{
           console.log(data);
           var tempID = data[0].Column1;
           if(data[0].Column1){
            this.compacctToast.clear();
            //const mgs = this.buttonname === 'Save & Print Bill' ? "Created" : "updated";
            this.compacctToast.add({
             key: "compacct-toast",
             severity: "success",
             summary: "Reason  ",
             detail: "Succesfully Created" //+ mgs
           });
           this.CreateReasonFormSubmitted = false;
           this.Reason_Des = undefined;
           this.CreateReasonModal = false;
           this.Spinnerreas = false;
           this.GetReason();
       
           } else{
             this.Spinnerreas = false;
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
        else {
          this.Spinnerreas = false;
        }
  }
  CalculateTime(){
    // console.log("obj.Off_Out_Time",new Date(obj.Off_Out_Time))
    // console.log("obj.Off_In_Time",new Date(obj.Off_In_Time))
      // obj.Work_Minute = undefined;
        this.Time_Duration = undefined;
        if (this.ObjFurMISinputShutdoun.From_Time && this.ObjFurMISinputShutdoun.To_Time) {
          // console.log("obj.Off_Out_Time",obj.Off_In_Time)
          // console.log("obj.Off_In_Time",obj.Off_In_Time)
          var totime:any = this.ObjFurMISinputShutdoun.To_Time.split(":");
          var fromtime:any = this.ObjFurMISinputShutdoun.From_Time.split(":");
          // console.log("getOut_Time",outtime.getTime())
          // console.log("getIn_Time",intime.getTime())
        // var minutes = Math.abs(outtime.getTime() - intime.getTime()) / 36e5 * 60;
        // var minutes = (Math.abs(totime - fromtime) / (1000 * 60));
        var subhours = (totime[0] - fromtime[0]);
        var submin = (totime[1] - fromtime[1]);
        var minutes = ((Math.abs(subhours)  * 60) + submin);
        this.Time_Duration = minutes;
        console.log('this.Time_Duration===',this.Time_Duration)
        // console.log(this.DateService.dateTimeConvert(new Date(this.objemployee.Off_In_Time)));
        // console.log(this.DateService.dateTimeConvert(new Date(this.objemployee.Off_Out_Time)));
      } 
      
  }

 GetFurnaceNo(){
  const obj = {
    "SP_String": "SP_Furnace_MIS_Input",
    "Report_Name_String": "Get_Furnace"
  
  }
  this.GlobalAPI.getData(obj).subscribe((data:any)=>{
    this.FurnaceNoList = data
  })
 }
  SaveFurnace() {
    // console.log("save valid ===",valid)
    this.FurnaceMISinputFormSubmitted = true;
    this.Spinner = true;
    this.ObjFurnaceMISinput.Furnace_No = this.ObjFurnaceMISinput.Furnace_No ? this.ObjFurnaceMISinput.Furnace_No : "A";
    this.ObjFurnaceMISinput.Furnace_Date = this.DateService.dateConvert(new Date(this.Doc_Date));
    if (this.ObjFurnaceMISinput.Furnace_No && this.ObjFurnaceMISinput.Furnace_Date && this.AddProductionList.length && this.AddWasteSlagList.length && this.AddShutdownList.length) {
      this.FurnaceMISinputFormSubmitted = false;
      this.compacctToast.clear();
      this.compacctToast.add({
       key: "s",
       sticky: true,
       closable: false,
       severity: "warn",
       summary: "Are you sure?",
       detail: "Confirm to proceed"
      });
    }
    else {
      this.Spinner = false;
      this.compacctToast.clear();
      this.compacctToast.add({
        key: "compacct-toast",
        severity: "error",
        summary: "Warn Message",
        detail: "Error Occured "
      });
      }
  }
  onConfirmSave() {
    this.Spinner = true
    this.ngxService.start();
    //  let msg = "";
    //  let rept = ""
  //  const tempCost = this.costCenterList.filter(el=> Number(el.Cost_Cen_ID) === Number(this.objpurchase.Cost_Cen_ID))[0]
  //  const tempsub = this.SubLedgerDataList.filter(el=> Number(el.Sub_Ledger_ID) === Number(this.objpurchase.Sub_Ledger_ID))[0]
  //  const tempCurr = this.currencyList.filter(el=> Number(el.Currency_ID) === Number(this.objpurchase.Currency_ID))
   this.ObjFurnaceMISinput.Furnace_No = this.ObjFurnaceMISinput.Furnace_No ? Number(this.ObjFurnaceMISinput.Furnace_No) : "A";
   this.ObjFurnaceMISinput.Furnace_ID = Number(this.ObjFurnaceMISinput.Furnace_No);
   this.ObjFurnaceMISinput.Furnace_Date = this.DateService.dateConvert(new Date(this.Doc_Date));
   this.ObjFurnaceMISinput.User_ID  = this.$CompacctAPI.CompacctCookies.User_ID;

   this.ObjDailyPerformancet.Furnace_Power = Number(this.ObjDailyPerformancet.Furnace_Power);
   this.ObjDailyPerformancet.Auxiliary_Power = Number(this.ObjDailyPerformancet.Auxiliary_Power);
   this.ObjDailyPerformancet.Average_Load = Number(this.ObjDailyPerformancet.Average_Load);
   this.ObjDailyPerformancet.Average_Power_Factor = Number(this.ObjDailyPerformancet.Average_Power_Factor);
   this.ObjDailyPerformancet.Load_Factor = Number(this.ObjDailyPerformancet.Load_Factor);
   this.ObjDailyPerformancet.Slipping_3_Electrodes = Number(this.ObjDailyPerformancet.Slipping_3_Electrodes);
   this.ObjDailyPerformancet.No_Of_Tapping = Number(this.ObjDailyPerformancet.No_Of_Tapping);

   this.ObjFurnaceMISinput.Daily_Performance = this.ObjDailyPerformancet;
   this.ObjFurnaceMISinput.Production = this.AddProductionList;
   this.ObjFurnaceMISinput.Waste_Slag = this.AddWasteSlagList;
   this.ObjFurnaceMISinput.Shut_Down = this.AddShutdownList;
    // let save = []
    if (this.ObjFurnaceMISinput.Furnace_No) {
    // if(this.addPurchaseList.length){
    // if(this.DocNo){
    //  msg = "Update"
    //  rept = "Purchase_Order_Edit"
    //   this.objpurchase.Doc_No = this.DocNo;
    //  this.objpurchase.L_element = this.addPurchaseList
    //  save = {...tempCost,...tempsub,...this.objpurchase}
    // }
    // else {
    //  msg = "Create"
    //  rept = "Purchase_Order_Create"
    //  save = {this.ObjFurnaceMISinput}
    // }
    // console.log("objpurchase",this.objpurchase)
    const obj = {
     "SP_String": "Sp_Furnace_MIS_Input",
     "Report_Name_String": "Create_MICL_Furnace_MIS_Input",
     "Json_Param_String": JSON.stringify(this.ObjFurnaceMISinput)
   
   }
   this.GlobalAPI.getData(obj).subscribe(async (data:any)=>{
    // this.ObjFurnaceMISinput.Furnace_No = data[0].Column1;
     if(data[0].Column1){
      this.compacctToast.clear();
       this.compacctToast.add({
         key: "compacct-toast",
         severity: "success",
         summary: data[0].Column1,
         detail: "Successfully Saved "
       });
       this.Spinner = false;
       this.ngxService.stop();
       this.clearData();
    //  if(this.DocNo){
    //    this.ngxService.stop();
    //    this.tabIndexToView = 0;
    //    this.items = [ 'BROWSE', 'CREATE','PENDING PURCHASE INDENT','PENDING PURCHASE INDENT PRODUCT','UPDATE TERMS','MIS REPORT'];
    //    this.buttonname = "Create";
    //  }
       
     }
     else {
       this.ngxService.stop();
       this.Spinner = false;
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
   else {
   this.ngxService.stop();
   this.Spinner = false;
   this.compacctToast.clear();
   this.compacctToast.add({
     key: "compacct-toast",
     severity: "error",
     summary: "Warn Message",
     detail: "Error Occured "
   });
   }
  }
  GetData(){
    this.ObjFurnaceMISinput.Critical_Issue = undefined;
    // this.ObjFurnaceMISinput.Daily_Performance = new DailyPerformance();
    this.AddProductionList = [];
    this.AddWasteSlagList = [];
    this.AddShutdownList = [];
    this.ObjFurnaceMISinput.Furnace_Date = this.DateService.dateConvert(new Date(this.Doc_Date));
    if (this.ObjFurnaceMISinput.Furnace_No && this.ObjFurnaceMISinput.Furnace_Date) {
      const obj = {
        "SP_String": "Sp_Furnace_MIS_Input",
         "Report_Name_String":"Get_Edit_Data",
         "Json_Param_String": JSON.stringify([{Furnace_ID : this.ObjFurnaceMISinput.Furnace_No , Furnace_Date : this.ObjFurnaceMISinput.Furnace_Date}]) 
          }
        this.GlobalAPI.getData(obj).subscribe((res)=>{
              console.log("Get Data",res)
              console.log("Get Data Main",JSON.parse(res[0].main))
              // JSON.parse(res[0].main)
              let data = JSON.parse(res[0].main)
              // this.EmployeeDetailsList = data;
            //  console.log("EmployeeDetailsList=",this.EmployeeDetailsList);
            //  const editlist = data ? data[0] : undefined;
            //   console.log("editlist=",editlist);
            //  if (this.objselect.Emp_ID) {
            //  this.objemployee = editlist;
            // }
            // else {
            //   this.objemployee = new Employee();
            // }
            this.ObjFurnaceMISinput.Critical_Issue = data ? data[0].Critical_Issue : undefined;
            this.ObjDailyPerformancet = data? data[0].Daily_Performance[0] : new DailyPerformance();
            console.log("this.ObjDailyPerformancet ===", this.ObjDailyPerformancet)
            this.AddProductionList = data ? data[0].Production : [];
            this.AddWasteSlagList = data ? data[0].Waste_Slag : [];
            this.AddShutdownList = data ? data[0].Shut_Down : [];
            });
          }
          // else {
          //   this.ObjFurnaceMISinput = new FurnaceMISinput();
          // }
  }
}
class FurnaceMISinput {
  Furnace_ID : any;
  Furnace_No : any;
  Furnace_Date : any;
  User_ID : any;
  Critical_Issue : any;
  Daily_Performance : any;
  Production : any;
  Waste_Slag : any;
  Shut_Down : any;
}
class DailyPerformance {
  Furnace_Power : any;
  Auxiliary_Power : any;
  Average_Load : any;
  Average_Power_Factor : any;
  Load_Factor : any;
  Slipping_3_Electrodes : any;
  No_Of_Tapping : any;
}
class FurMISinputPro {
  Cost_Cent_ID : any;
  Godown_ID : any;
  Product_ID : any;
  Product_Description : any;
  Batch_No : any;
  Qty : any;
  UOM : any;
}
class FurMISinputWaste {
  Cost_Cent_ID : any;
  Godown_ID : any;
  Product_ID : any;
  Product_Description : any;
  Batch_No : any;
  Qty : any;
  UOM : any;
}
class FurMISinputShutdoun {
  From_Time : any;
  To_Time : any;
  Reason_ID : any;
  Reason_Des : any;
}
