import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { CompacctCommonApi } from '../../../shared/compacct.services/common.api.service';
import { CompacctHeader } from '../../../shared/compacct.services/common.header.service';
import { MessageService } from "primeng/api";
import * as moment from "moment";
import { DateTimeConvertService } from '../../../shared/compacct.global/dateTime.service';
declare var $:any;

@Component({
  selector: 'app-compacct-civildaily-job',
  templateUrl: './compacct.civildaily-job.component.html',
  styleUrls: ['./compacct.civildaily-job.component.css'],
  providers: [MessageService],
  encapsulation: ViewEncapsulation.None
})
export class CompacctCivildailyJobComponent implements OnInit {
  tabIndexToView = 0;
  url = window["config"];
  persons: [];
  buttonname = "Create";
  Spinner = false;
  items = [];

  ProjectList = [];
  RoadList = [];

  BOQData = [];
  ItemList = [];
  TripByList = [];
  DeductPerList = [];
  SelectedItemCode:any;

  ObjSearch = new Search();
  SerachFormSubmitted = false;
  TripTempArr:any = [];
  TripTempArrFromDetails:any =[];
  TripModal = false;

  JobDate = new Date();
  YESTERDAY = new Date(Date.now() - 864e5);
  TODAY = new Date();
  ObjJobData = new JobData();
  DailyJobFormFormSubmitted = false;
  TripByFormSubmitted = false;
  expandedRows: {} = {};
  DetailList = [];
  DetailList2 = [];
  DetailList3 = [];
  tempArr = [];
  tempArr2 = [];
  tempArr3 = [];
  TripBySubmitted = false
TripByName = undefined;
TripByModal = false;

CreateModalFlag = false;
rowGroupMetadata: any;


TypeBrideList = [];
BridgeItemData =[];
BridgeItemList = [];
BridgeItemSelect = [];
BridgeDetailList = [];
LooseQtyList =[];
TypeSubmitted = false;
TypeName = undefined;
TypeModal = false;
LooseQntySubmitted = false;
LooseQntyName = undefined;
LooseQntyModal = false;
StructureTypeModal = false;
StructureFormSubmitted = false;
PartySubmitted = false;
PartyName = undefined;
PartyModal = false;
ReceivedFromSubmitted = false;
ReceivedFromName = undefined;
ReceivedFromModal = false;
StructureTypeDetailList =[];
PartyList =[];
ReceivedFromList = [];
DistinctItemCode = [];
DistinctItemCode2 = [];
DistinctItemCode3 = [];
DistinctSubItemCode3 = [];
DistinctSubItemCode2 = [];
DistinctSubItemCode = [];
ChainageValidMgs = '';
DiaList = [];

  constructor(
    private $http: HttpClient,
    private commonApi: CompacctCommonApi,
    private Header: CompacctHeader,
    private compacctToast: MessageService,
    private DateService: DateTimeConvertService
  ) {
    this.DiaList = [
      {dia : '8.000' , co_eff : 0.395},
      {dia : '10.000' , co_eff : 0.617},
      {dia : '12.000' , co_eff : 0.889},
      {dia : '16.000' , co_eff : 1.580},
      {dia : '20.000' , co_eff : 2.469},
      {dia : '25.000' , co_eff : 3.858},
      {dia : '28.000' , co_eff : 4.840},
      {dia : '32.000' , co_eff : 6.321},
      {dia : '34.000' , co_eff : 7.136},
      {dia : '36.000' , co_eff : 8.000},
      {dia : '40.000' , co_eff : 9.877},
      {dia : '45.000' , co_eff : 12.500},
      {dia : '50.000' , co_eff : 15.432},
      {dia : '56.000' , co_eff : 19.358},
      {dia : '60.000' , co_eff : 22.222},
      {dia : '63.000' , co_eff : 24.500},
      {dia : '63.500' , co_eff : 24.890},
      {dia : '65.000' , co_eff : 26.080},
      {dia : '70.000' , co_eff : 30.247}
    ]
   }

  ngOnInit() {
     this.items = ["BROWSE", "CREATE"];
     this.Header.pushHeader({
      Header: "Daily Progress Report (Civil)",
      Link: " Civil -> Daily Progress Report (Civil)"
    });

    this.GetRoad();
    this.GetLooseQty();
    this.GetBridgeType();
    this.GetDeductPerList();
    this.GetParty();
    this.GetReceivedFrom();
    this.GetStructureTypeDetail();

  }
  // BROWSE
  GetRoad() {
    this.$http
    .get("/BL_Txn_Civil_Daily_Job/Get_Project_Short_Name_Json")
      .subscribe((data: any) => {
        const roadData = data ? JSON.parse(data) : [];
        roadData.forEach(el => {
          this.RoadList.push({
            label: el.Project_Short_Name,
            value: el.Project_Short_Name
          });
        });
      });
  }
  GetLooseQty() {
    this.$http
    .get("/BL_Txn_Civil_Daily_Job/Get_Loose_Qty_Per_Trip")
      .subscribe((data: any) => {
        this.LooseQtyList = data.length ? data : [];
      });
  }
  GetBridgeType() {
    this.$http
    .get("/BL_Txn_Civil_Daily_Job/Get_Structured_Type_Json")
      .subscribe((data: any) => {
        this.TypeBrideList = data ? JSON.parse(data) : [];

      });
  }
  GetStructureTypeDetail() {
    this.$http
    .get("/BL_Txn_Civil_Daily_Job/Get_Structured_Details")
      .subscribe((data: any) => {
        this.StructureTypeDetailList = data.length ? data : [];

      });
  }
  GetParty(){
    this.$http
    .get("/BL_Txn_Civil_Daily_Job/Get_Party_Json")
      .subscribe((data: any) => {
        this.PartyList = data ? JSON.parse(data) : [];

      });
  }
  GetReceivedFrom() {
    this.$http
    .get("/BL_Txn_Civil_Daily_Job/Get_Received_From_Json")
      .subscribe((data: any) => {
        this.ReceivedFromList = data ? JSON.parse(data) : [];

      });
  }
  GetDeductPerList() {
    for(let k=0;k < 100;k++){
      const val = k+1;
      this.DeductPerList.push(val);
    }
    this.ObjJobData.Deduct_Percentage = 30;
  }
  Search(valid){
    this.SerachFormSubmitted = true;
    if (valid) {
      this.Spinner = true;
      const obj = new HttpParams()
      .set("Project_Short_Name", this.ObjSearch.Project_Short_Name)
      .set("Agreement_Number", this.ObjSearch.Agreement_Number ?  this.ObjSearch.Agreement_Number : '')
      this.$http
        .get("/BL_Txn_Civil_Daily_Job/Get_Entry_Daily_Job_Browse_Json", { params: obj })
        .subscribe((data: any) => {
          this.ProjectList = data.length ? JSON.parse(data) : [];
          this.Spinner = false;
          this.SerachFormSubmitted = false;
        });
    }
  }

  // CREATE
  EntryJob(obj) {
    this.CreateModalFlag = false;
    this.tempArr = [];
    this.DetailList = [];
    this.DistinctItemCode = [];
    if(obj.Project_ID) {
      this.GetBOQData(obj.Project_ID);
      this.CreateModalFlag = true;
      const name  = this.ObjSearch.Project_Short_Name;
      this.items[1] = "CREATE DPR FOR "+name;
      this.ObjJobData.calculation_type = 'Addition';
      this.ChangeType();
      const crl = this;
      setTimeout(function(){
        crl.tabIndexToView = 1;
      })
    }
  }
  GetBOQData(id) {
    this.ItemList = [];
    if(id) {
    this.$http
    .get("/BL_Txn_Civil_Daily_Job/Get_Item_Code_Json?Project_ID="+ id)
      .subscribe((data: any) => {
        this.BOQData = data ? JSON.parse(data) : [];
        this.BOQData.forEach(el => {
          this.ItemList.push({
            label:  el.Sl_No +' ' +el.Item_Code,
            value: el.Item_Code
          });
        });
      });
    }
  }
  clearOnChange() {

  }
  ChangeTypeOfWork(type) {
    this.DetailList = [];
    this.DetailList2 = [];
    this.DistinctItemCode = [];
    this.DistinctItemCode2 = [];
    this.DistinctSubItemCode2 = [];
    this.tempArr = [];
    this.tempArr2 = [];
    if(type){
      this.GetTripByList(type);
    }
  }
  ChangeType() {
    this.ObjJobData.Material_Unit = 'CFT';
    if(this.ObjJobData.calculation_type === 'Addition') {
      this.ObjJobData.Chanage_At_KM = undefined;
      this.ObjJobData.Chanage_At_M = undefined;

    }
    if(this.ObjJobData.calculation_type === 'Deduction') {
      this.ObjJobData.No_Of_Trip = undefined;
      this.ObjJobData.Loose_Qty_Per_Trip = undefined;
      this.ObjJobData.Trip_By = undefined;

      this.ObjJobData.Chanage_From_KM = undefined;
      this.ObjJobData.Chanage_From_M = undefined;

      this.ObjJobData.Chanage_To_KM = undefined;
      this.ObjJobData.Chanage_To_M = undefined;
      // this.TripTempArr = [];
    }
  }
  ChecItemCode ():string {
    if(this.ObjJobData.Item_Code) {
      let flag;
      const itemCodetoLower = this.ObjJobData.Item_Code.toUpperCase();
      switch(itemCodetoLower) {
        case 'HYSD BAR':
          flag = 'BAR';
          break;
        case 'HP':
          flag = 'HP';
          break;
        case 'HPC':
          flag = 'HP';
          break;
        case 'WEEP HOLE':
          flag = 'HP';
          break;
        case '300MM HP':
          flag = 'HP';
          break;
        case '600MM HP':
          flag = 'HP';
          break;
        case '750MM HP':
          flag = 'HP';
          break;
        case '900MM HP':
          flag = 'HP';
          break;
        case '1000MM HP':
          flag = 'HP';
          break;
        case '1200MM HP':
          flag = 'HP';
          break;
        case '1500MM HP':
          flag = 'HP';
          break;
        case '1800MM HP':
          flag = 'HP';
          break;
        case '2000MM HP':
          flag = 'HP';
          break;


        default:
          flag = '';
      }
return flag;

    }
  }
  ChangeStructureDetails(StructureID){
    this.ObjJobData.Party = undefined;
    this.ObjJobData.structure_at_km = undefined;
    this.ObjJobData.structure_at_meter = undefined;
    this.ObjJobData.Structured_Type = undefined;
    this.ObjJobData.Structured_Breadth = undefined;
    this.ObjJobData.Structured_Height = undefined;
    this.ObjJobData.Structured_Length = undefined;
    this.ObjJobData.structure_at_km = undefined;
    this.ObjJobData.No_of_Span =  undefined;
    if(StructureID) {
      const obj = $.grep(this.StructureTypeDetailList,function(obj){ return obj.Structure_ID === StructureID})[0];
      this.ObjJobData.structure_at_km = obj.structure_at_km;
    this.ObjJobData.structure_at_meter = obj.structure_at_meter;
    this.ObjJobData.Structured_Type = obj.Structured_Type;
    this.ObjJobData.Structured_Breadth = obj.Structured_Breadth;
    this.ObjJobData.Structured_Height = obj.Structured_Height;
    this.ObjJobData.Structured_Length = obj.Structured_Length;
    this.ObjJobData.structure_at_km = obj.structure_at_km;
    this.ObjJobData.No_of_Span =  obj.No_of_Span;
    this.ObjJobData.Party = obj.Party;
    }
  }
  ChangeParty(){

  }
  GetTripByList(type) {
    if(type) {
      this.$http
      .get("/BL_CRM_Txn_Enq_Tender/Get_Tender_BOQ_Trip_By_Json?Type="+type)
      .subscribe((data: any) => {
        this.TripByList = data ? JSON.parse(data) : [];
      });
    }
  }
  GetJobDate (date) {
    if (date) {
      this.ObjJobData.Date = this.DateService.dateConvert(
        moment(date, "YYYY-MM-DD")["_d"]
      );
    }
  }
  ItemCodeChange(obj) {
    this.ObjJobData.Item_Code = undefined;
    this.ObjJobData.UNIT = undefined;
    this.ObjJobData.BOQ_Txn_ID = undefined;
    this.ObjJobData.Sl_No = undefined;
    this.ObjJobData.Deduct_Percentage = undefined;
    this.ObjJobData.No_Of_Trip = undefined;
    this.ObjJobData.Loose_Qty_Per_Trip = undefined;
    this.ObjJobData.Trip_By = undefined;

    this.ObjJobData.Chanage_From_KM = undefined;
    this.ObjJobData.Chanage_From_M = undefined;

    this.ObjJobData.Chanage_To_KM = undefined;
    this.ObjJobData.Chanage_To_M = undefined;
    this.TripTempArr = [];
    this.ObjJobData.Chanage_At_KM = undefined;
    this.ObjJobData.Chanage_At_M = undefined;
    this.ObjJobData.Chanage_At_KM = undefined;
    this.ObjJobData.Chanage_At_M = undefined;
   this.ObjJobData.Total_Length= undefined;
   this.ObjJobData.Side= undefined;
   this.ObjJobData.Width= undefined;
   this.ObjJobData.Hight_Thikness= undefined;
   this.ObjJobData.QNTY= undefined;
   this.ObjJobData.UNIT= undefined;
   this.ObjJobData.Trip_Arr = [];
   this.ObjJobData.Remarks= undefined;
   this.ObjJobData.Loose_Qnty= undefined;
  this.ObjJobData.Deduct_Percentage= undefined;
  this.ObjJobData.Total_Loose_Qnty_All= undefined;

  this.ObjJobData.bridge_item_length= undefined;
  this.ObjJobData.Bridge_Item_Breath = undefined;
  this.ObjJobData.Bridge_Item_Height= undefined;
  this.ObjJobData.Bridge_Item_Total_Qty= undefined;
  this.ObjJobData.Bridge_Item_Unit= undefined;
  this.ObjJobData.Bridge_Item_Remarks= undefined;
  this.ObjJobData.bridge_item= undefined;

  this.ObjJobData.Dia= undefined;
  this.ObjJobData.Length_per_Each_Bar= undefined;
  this.ObjJobData.Total_Length_Rmt= undefined;
  this.ObjJobData.Co_efficient= undefined;
  this.ObjJobData.Size_Weep_Hole= undefined;
  this.ObjJobData.Length_per_piece= undefined;
  this.ObjJobData.Number= undefined;
    if(obj) {
      this.ObjJobData.Item_Code = obj;
      this.ObjJobData.Deduct_Percentage = obj === 'BORROWPIT EARTH' ? 30 : undefined;
      const temObj = $.grep(this.BOQData,function(arr){ return arr.Item_Code === obj})[0];
      this.ObjJobData.UNIT = temObj.Unit;
      this.TripTempArr = temObj.Unit === 'Cum' ? this.getTripByItemCode(obj) : [];
      this.ObjJobData.BOQ_Txn_ID = temObj.BOQ_Txn_ID;
      this.ObjJobData.Sl_No = temObj.Sl_No;
       this.ObjJobData.calculation_type = 'Addition';
       this.ObjJobData.Material_Unit = 'CFT';
      if(this.ObjJobData.Type_of_Work) {
        this.BridgeItemData = [];
        this.BridgeItemList = [];
        this.getBridgeItems(this.ObjJobData.BOQ_Txn_ID);
      }
      this.ChecItemCode();
    }
  }
  getBridgeItems(boqID){
    if(boqID) {
      this.$http
    .get("/BL_Txn_Civil_Daily_Job/Get_Bridge_Culvart_Sub_Code_Json?BOQ_Txn_ID="+boqID)
      .subscribe((data: any) => {
        this.BridgeItemData = JSON.parse(data);
        if(this.BridgeItemData.length) {
          this.BridgeItemData.forEach(el => {
            this.BridgeItemList.push({
              label: el.Sl_No +' ' +el.Item_Code,
              value: el.Item_Code
            });
          });
        }
      });
    }
  }
  BridgeItemCodeChange(obj) {
    this.ObjJobData.bridge_item = undefined;
    this.ObjJobData.Bridge_Item_Unit = undefined;
    this.ObjJobData.bridge_item_Sl_No = undefined;
    if(obj) {
      this.ObjJobData.bridge_item = obj;
      const temObj = $.grep(this.BridgeItemData,function(arr){ return arr.Item_Code === obj})[0];
      this.ObjJobData.Bridge_Item_Unit = temObj.Unit;
      this.ObjJobData.bridge_item_Sl_No = temObj.Sl_No;
      if(!this.ObjJobData.UNIT) {
        this.ObjJobData.UNIT = temObj.Unit;
      }
    }
  }
  CalculateTotalLooseQty (){
    this.ObjJobData.Total_Loose_Qty = undefined;
    if(this.ObjJobData.Loose_Qty_Per_Trip && this.ObjJobData.No_Of_Trip){
      const val = Number(this.ObjJobData.No_Of_Trip) * Number(this.ObjJobData.Loose_Qty_Per_Trip);
      this.ObjJobData.Total_Loose_Qty = typeof(val) === "number" ? val.toFixed(3) : Number(val).toFixed(3);
    }
  }
  getFlooredFixed(v, d) {
    return (Math.floor(v * Math.pow(10, d)) / Math.pow(10, d)).toFixed(d);
  }
  addZeroes(numr) {
    const num = typeof(numr) === "number" ? numr.toString() : numr;
    const dec = num.split('.')[1]
    const len = dec && dec.length > 3 ? dec.length : 3
    return Number(num).toFixed(len)
  }
  insertDecimal(num) {
    return Number((num / 100).toFixed(3));
 }
  GetTotalLength() {
    if(this.ObjJobData.Item_Code !== 'BORROWPIT EARTH' || (this.ObjJobData.UNIT !== 'Cum' && this.ObjJobData.UNIT !== 'Sqm')) {
    this.ObjJobData.Total_Length =  undefined;
    if((this.ObjJobData.Chanage_From_KM && this.ObjJobData.Chanage_From_M) && (this.ObjJobData.Chanage_To_KM && this.ObjJobData.Chanage_To_M) && (this.ObjJobData.UNIT === 'Cum' || this.ObjJobData.UNIT === 'Sqm')){
      const regExp = /^0[0-9].*$/
      const FromM = regExp.test(this.ObjJobData.Chanage_From_M) ? this.ObjJobData.Chanage_From_M : Number(this.ObjJobData.Chanage_From_M)
      const tOM = regExp.test(this.ObjJobData.Chanage_To_M) ? this.ObjJobData.Chanage_To_M : Number(this.ObjJobData.Chanage_To_M)
      const ChanageFromTotal = this.ObjJobData.Chanage_From_KM +"."+ FromM;
      const ChanageToTotal =   this.ObjJobData.Chanage_To_KM  +"."+ tOM;
      const val =((Number(ChanageToTotal)-Number(ChanageFromTotal)) * 1000).toFixed(3);
      const addVal = this.addZeroes(val)
      this.ObjJobData.Total_Length = this.numberWithCommas(val);
      this.GetQnty();
    }
  }
  }
  GetBridgeTotalQtny() {
    this.ObjJobData.QNTY =  undefined;
    if(this.ObjJobData.Bridge_Item_Breath && this.ObjJobData.bridge_item_length){
      if(this.ObjJobData.UNIT === 'Cum' && this.ObjJobData.Bridge_Item_Height) {
        const addVal = Number(this.ObjJobData.Bridge_Item_Height) * Number(this.ObjJobData.Bridge_Item_Breath) * Number(this.ObjJobData.bridge_item_length)
        const FlterVal = this.ObjJobData.calculation_type === 'Deduction' ? '-' + addVal.toFixed(3) : addVal.toFixed(3)
        this.ObjJobData.QNTY = this.numberWithCommas(FlterVal);
      }
      if(this.ObjJobData.UNIT !== 'Cum') {
        const addVal =  Number(this.ObjJobData.Bridge_Item_Breath) * Number(this.ObjJobData.bridge_item_length)
        const FlterVal = this.ObjJobData.calculation_type === 'Deduction' ? '-' + addVal.toFixed(3) : addVal.toFixed(3)
        this.ObjJobData.QNTY = this.numberWithCommas(FlterVal);
      }
    }

  }
  GetQnty() {
    if(this.ObjJobData.Item_Code !== 'BORROWPIT EARTH') {
      this.ObjJobData.QNTY =  undefined;
      if(this.ObjJobData.Total_Length && this.ObjJobData.Width  && (this.ObjJobData.UNIT === 'Cum' || this.ObjJobData.UNIT === 'Sqm') ){
       if(this.ObjJobData.UNIT === 'Sqm' ) {
       const height = this.ObjJobData.Hight_Thikness ? Number(this.ObjJobData.Hight_Thikness.replace(/,/g, '')) : 0;
      // const totalLenth =   1000 * Number(this.ObjJobData.Total_Length);
      const totalLenth =   Number(this.ObjJobData.Total_Length.replace(/,/g, ''));
        const val= height === 0 ? (totalLenth * Number(this.ObjJobData.Width.replace(/,/g, ''))) :((totalLenth * height) * Number(this.ObjJobData.Width.replace(/,/g, '')))
        // const val = (( totalLenth* 1000) * Number(height) * Number(this.ObjJobData.Width)).toFixed(3);

        const FlterVal =  val.toFixed(3);
        this.ObjJobData.QNTY =  this.ObjJobData.calculation_type === 'Deduction' ? '-'+ this.numberWithCommas(FlterVal) : this.numberWithCommas(FlterVal);
       }
       if(this.ObjJobData.UNIT === 'Cum' && this.ObjJobData.Hight_Thikness) {
        const height = this.ObjJobData.Hight_Thikness ? Number(this.ObjJobData.Hight_Thikness.replace(/,/g, '')) : 0;
       // const totalLenth =   1000 * Number(this.ObjJobData.Total_Length);
       const totalLenth =   Number(this.ObjJobData.Total_Length.replace(/,/g, ''));
         const val= height === 0 ? (totalLenth * Number(this.ObjJobData.Width.replace(/,/g, ''))) :((totalLenth * height) * Number(this.ObjJobData.Width.replace(/,/g, '')))
         // const val = (( totalLenth* 1000) * Number(height) * Number(this.ObjJobData.Width)).toFixed(3);

         const FlterVal =  val.toFixed(3);
         this.ObjJobData.QNTY =  this.ObjJobData.calculation_type === 'Deduction' ? '-'+ this.numberWithCommas(FlterVal) : this.numberWithCommas(FlterVal);
       }
    }
  }
  }
  GetTotalLooseQnty () {
    this.ObjJobData.Total_Loose_Qnty_All = undefined;
    this.ObjJobData.QNTY = undefined;
    if(this.ObjJobData.Deduct_Percentage && this.ObjJobData.Loose_Qnty){
      const  valueInString = this.ObjJobData.Loose_Qnty.replace(/,/g, '');
      const num = Number(valueInString);
      const Percentage = Number('.'+this.ObjJobData.Deduct_Percentage);
      const val = num - (num * Percentage);
      this.ObjJobData.Total_Loose_Qnty_All = val.toFixed(3);
      this.ObjJobData.QNTY = this.numberWithCommas(val.toFixed(3));
    }
  }
  numberWithCommas(x) {
    x=x.toString();
    let afterPoint = '';
    if(x.indexOf('.') > 0){
      afterPoint = x.substring(x.indexOf('.'),x.length);
    }
    x = Math.floor(x);
    x=x.toString();
    let lastThree = x.substring(x.length-3);
    const otherNumbers = x.substring(0,x.length-3);
    if(otherNumbers != ''){
      lastThree = ',' + lastThree;
    }
    const res = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + lastThree + afterPoint;
    return res
  }
  check3DigitChanage(val:any , fieldName) {
    if(val.length) {

      if(val.length === 1) {
        this.ObjJobData[fieldName] =  '00'+val;;

      }
      if(val.length === 2) {
        this.ObjJobData[fieldName] = '0'+val;

      }
      if(val.length === 3) {
        this.ObjJobData[fieldName] = val;

      }
      if(val.length <= 3) {
        if(this.ObjJobData.Type_of_Work === 'Road Works') {
          this.GetTotalLength();
        }
      }

    }
  }
  check3DigitLooseQty(val:any) {
    this.ObjJobData.No_Of_Trip = typeof(val) === "number" ? val.toFixed(2) : Number(val).toFixed(2);
    this.CalculateTotalLooseQty();
  }
  check3DigitTotalLooseQty(val) {
    this.LooseQntyName =  typeof(val) === "number" ? val.toFixed(3) : Number(val).toFixed(3);
  }
  check3DigitWidth(val:any) {
    const val1 = typeof(val) === "number" ? val.toFixed(3) : Number(val).toFixed(3);
    this.ObjJobData.Width = this.numberWithCommas(val1);
    this.GetQnty();
  }
  check3DigitHeight(val:any) {
    const val1 = typeof(val) === "number" ? val.toFixed(3) : Number(val).toFixed(3);
    this.ObjJobData.Hight_Thikness = this.numberWithCommas(val1);
    this.GetQnty();
  }
  check3Digit(val:any,field) {
    if(field === 'QNTY'){
      const val1 = typeof(val) === "number" ? val.toFixed(2) : Number(val).toFixed(2);
      this.ObjJobData[field] = this.numberWithCommas(val1);
    }else{
      this.ObjJobData[field] = typeof(val) === "number" ? val.toFixed(3) : Number(val).toFixed(3);

    }
  }
  check3DigitBridge(val:any,field) {
    this.ObjJobData[field] = typeof(val) === "number" ? val.toFixed(3) : Number(val).toFixed(3);
    this.GetBridgeTotalQtny();
  }

  check3DigitLengthPerRmt(val:any) {
    this.ObjJobData.Length_per_Each_Bar = typeof(val) === "number" ? val.toFixed(3) : Number(val).toFixed(3);
    this.CalculateTotalLengthRmt();
  }
  check3DigitNumber(val:any) {
    this.ObjJobData.Number = typeof(val) === "number" ? val.toFixed(3) : Number(val).toFixed(3);
    this.CalculateTotalLengthRmt();
  }
  check3DigitTotalLengthRmt(val:any) {
    this.ObjJobData.Total_Length_Rmt = typeof(val) === "number" ? val.toFixed(3) : Number(val).toFixed(3);
    this.CalculateCoefficientQty();
  }
  CalculateTotalLengthRmt() {
    this.ObjJobData.Total_Length_Rmt =  undefined;
    if(this.ObjJobData.Length_per_Each_Bar && this.ObjJobData.Number) {
      const val =  Number(this.ObjJobData.Number) * Number(this.ObjJobData.Length_per_Each_Bar);
      this.ObjJobData.Total_Length_Rmt = typeof(val) === "number" ? val.toFixed(3) : Number(val).toFixed(3);
      this.CalculateCoefficientQty();
    }
  }
  FetchCoefficient(dia) {
    this.ObjJobData.Co_efficient = undefined;
    if (dia) {
      const data = $.grep(this.DiaList,function(obj){ return obj.dia === dia});
      this.ObjJobData.Co_efficient = data.length ? data[0].co_eff : undefined;
      this.CalculateCoefficientQty();
    }
  }
  CalculateCoefficientQty(){
    this.ObjJobData.QNTY =  undefined;
    if(this.ObjJobData.Total_Length_Rmt && this.ObjJobData.Co_efficient) {
      const val =  Number(this.ObjJobData.Total_Length_Rmt) * Number(this.ObjJobData.Co_efficient) * 100;
      this.ObjJobData.QNTY = typeof(val) === "number" ? val.toFixed(3) : Number(val).toFixed(3);
    }
  }
  calculateHpLength(){
    this.ObjJobData.Total_Length =  undefined;
    if(this.ObjJobData.Length_per_piece && this.ObjJobData.Number) {
      const totallengthper = this.ObjJobData.Length_per_piece.replace(' mtr.','');
      const val =  Number(this.ObjJobData.Number) * Number(totallengthper);
      this.ObjJobData.Total_Length = typeof(val) === "number" ? val.toFixed(3) : Number(val).toFixed(3);
    }
  }

  AddTrip() {
    this.TripByFormSubmitted = false;
    if(this.ObjJobData.Trip_By && this.ObjJobData.No_Of_Trip && this.ObjJobData.Loose_Qty_Per_Trip && this.ObjJobData.Material_Unit) {
      this.TripTempArr.push({
        'Trip_By' : this.ObjJobData.Trip_By,
        'No_Of_Trip' : this.ObjJobData.No_Of_Trip,
        'Loose_Qty_Per_Trip' : this.ObjJobData.Loose_Qty_Per_Trip,
        'Material_Unit' : this.ObjJobData.Material_Unit,
        'Total_Loose_Qty' : this.ObjJobData.Total_Loose_Qty,
        'Received_From' : this.ObjJobData.Received_From
      });
      this.TripTempArr.sort(function(a, b){
        return a.Trip_By === b.Trip_By ? 0 : +(a.Trip_By > b.Trip_By) || -1;
      });
      this.ObjJobData.Trip_By = undefined;
      this.ObjJobData.No_Of_Trip = undefined;
      this.ObjJobData.Loose_Qty_Per_Trip = undefined;
      this.ObjJobData.Total_Loose_Qty = undefined;
      this.ObjJobData.Received_From = undefined;
      this.ObjJobData.Material_Unit = 'CFT';
      if(this.ObjJobData.UNIT === 'Cum') {
        const qnty = this.getAllQtyTrip();
        this.ObjJobData.Loose_Qnty = qnty.toString();
        if( this.ObjJobData.Item_Code === 'BORROWPIT EARTH'){
          this.GetTotalLooseQnty();
        }
      }
    } else {
      this.TripByFormSubmitted = true;
    }
  }

  getAllQtyTrip() {
    let qunty:any = 0;
    for(let i = 0; i < this.TripTempArr.length; i++) {
      if (this.TripTempArr[i].Material_Unit === 'CFT') {
        const val = Number(this.TripTempArr[i].No_Of_Trip) * Number(this.TripTempArr[i].Loose_Qty_Per_Trip) * 0.0283;
        const addVal = typeof(val) === "number" ? val.toFixed(3) : Number(val).toFixed(3);
        qunty += Number(addVal);
      } else {
        qunty += Number(this.TripTempArr[i].Total_Loose_Qty);
      }
    }
    const decimalCheck = qunty % 1;
    if (decimalCheck > 0) {
      const k = qunty.toString()
      const n = k.lastIndexOf('.');
      const result = k.substring(n + 1);
      const round = Number(Math.round(qunty)).toFixed(3);
      qunty = (Number(result) >= 995 && Number(result) <= 999 ) ? Number(round).toFixed(3) : qunty.toFixed(3);
    }
    const valQnty =  typeof(qunty) === "number" ? qunty.toFixed(3) : Number(qunty).toFixed(3);
    return this.numberWithCommas(valQnty);
  }
  getAllTempQtyTrip() {
    let qunty:any = 0;
    for(let i = 0; i < this.TripTempArrFromDetails.length; i++) {
      if (this.TripTempArrFromDetails[i].Material_Unit === 'CFT') {
        const val = Number(this.TripTempArrFromDetails[i].No_Of_Trip) * Number(this.TripTempArrFromDetails[i].Loose_Qty_Per_Trip) * 0.0283;
        const addVal = typeof(val) === "number" ? val.toFixed(3) : Number(val).toFixed(3);
        qunty += Number(addVal);
      } else {
        qunty += Number(this.TripTempArrFromDetails[i].Total_Loose_Qty);
      }
    }
    const decimalCheck = qunty % 1;
    if (decimalCheck > 0) {
      const k = qunty.toString()
      const n = k.lastIndexOf('.');
      const result = k.substring(n + 1);
      const round = Number(Math.round(qunty)).toFixed(3);
      qunty = (Number(result) >= 995 && Number(result) <= 999 ) ? Number(round).toFixed(3) : qunty.toFixed(3);
    }
    const valQnty =  typeof(qunty) === "number" ? qunty.toFixed(3) : Number(qunty).toFixed(3);
    return this.numberWithCommas(valQnty);
  }
  firstInGroupTrip(str: any){
    return this.TripTempArr.filter(s => s.Trip_By == str.Trip_By).indexOf(str) == 0;
  }
  DeleteTrip(index){
    this.TripTempArr.splice(index, 1);
    this.getAllQtyTrip();
    if( this.ObjJobData.Item_Code === 'BORROWPIT EARTH' && this.ObjJobData.UNIT === 'Cum') {
      const qnty = this.getAllQtyTrip();
      this.ObjJobData.Loose_Qnty = qnty.toString();
      this.GetTotalLooseQnty();
    }
  }

  firstInGroup(str: any){
    return this.DetailList.filter(s => s.Item_Code == str.Item_Code).indexOf(str) == 0;
  }
  GetTotalQnt(obj) {
    const arrTemp = $.grep(this.DetailList,function(val){return val.Item_Code === obj});
    let qunty = 0;
    if(this.ObjJobData.Type_of_Work === 'Bridges and Culverts') {
      for(let i = 0; i < arrTemp.length; i++) {
        if(arrTemp[i].QNTY) {
          qunty += Number(arrTemp[i].QNTY.replace(/,/g, ''));
        }
      }
    }
    if(this.ObjJobData.Type_of_Work === 'Road Works') {
      for(let i = 0; i < arrTemp.length; i++) {
        if(arrTemp[i].QNTY) {
        qunty += Number(arrTemp[i].QNTY.replace(/,/g, ''));
        }
      }
    }
    const valQnty =  typeof(qunty) === "number" ? qunty.toFixed(3) : Number(qunty).toFixed(3);
    return this.numberWithCommas(valQnty);
  }
  GetSubTotalQnt(obj) {
    const arrTemp = $.grep(this.DetailList,function(val){return val.bridge_item === obj});
    let qunty = 0;
    if(this.ObjJobData.Type_of_Work === 'Bridges and Culverts') {
      for(let i = 0; i < arrTemp.length; i++) {
        if(arrTemp[i].QNTY) {
          qunty += Number(arrTemp[i].QNTY.replace(/,/g, ''));
        }
      }
    }
    if(this.ObjJobData.Type_of_Work === 'Road Works') {
      for(let i = 0; i < arrTemp.length; i++) {
        if(arrTemp[i].QNTY) {
          qunty += Number(arrTemp[i].QNTY.replace(/,/g, ''));
        }
      }
    }
    const valQnty =  typeof(qunty) === "number" ? qunty.toFixed(3) : Number(qunty).toFixed(3);
    return this.numberWithCommas(valQnty);
  }

  AddDetailList(valid) {
    this.DailyJobFormFormSubmitted = true;
    this.ObjJobData.Trip_Arr = [];
    const validFlag = this.GridValidationCheck();
    if(valid && validFlag) {
      this.ObjJobData.Date =  this.ObjJobData.Date ?  this.ObjJobData.Date : this.DateService.dateConvert(new Date());
      if(this.ObjJobData.calculation_type === 'Addition' && this.ObjJobData.Type_of_Work === 'Road Works') {
        this.ObjJobData.Chanage_At =  undefined;
        this.ObjJobData.Chanage_At_KM = undefined;
        this.ObjJobData.Chanage_At_M = undefined;
        this.ObjJobData.Trip_Arr = this.TripTempArr;
        this.ObjJobData.Chanage_From = Number(this.ObjJobData.Chanage_From_KM) + '.' + this.ObjJobData.Chanage_From_M;
        this.ObjJobData.Chanage_To = Number(this.ObjJobData.Chanage_To_KM) + '.' + this.ObjJobData.Chanage_To_M;
      }
      if(this.ObjJobData.calculation_type === 'Deduction' && this.ObjJobData.Type_of_Work === 'Road Works') {
        this.ObjJobData.Trip_Arr =  [];
        this.ObjJobData.Chanage_From =  undefined;
        this.ObjJobData.Chanage_To =  undefined;
        this.ObjJobData.Chanage_From_KM = undefined;
        this.ObjJobData.Chanage_From_M = undefined;
        this.ObjJobData.Chanage_To_KM = undefined;
        this.ObjJobData.Chanage_To_M = undefined;
        this.ObjJobData.Chanage_At = Number(this.ObjJobData.Chanage_At_KM) + '.' + this.ObjJobData.Chanage_At_M;
      }
      this.ObjJobData.Grid_Index =  Math.floor(100000 + Math.random() * 900000);



      const processed = [];
      const processed2 = [];
      const ItemFlag = this.ChecItemCode();
      if(this.ObjJobData.Type_of_Work === 'Bridges and Culverts' && ItemFlag === 'HP') {
        this.DistinctItemCode2 = [];
        this.DistinctSubItemCode2 = [];
        this.tempArr2.push(this.ObjJobData);
        for(let i = 0; i < this.tempArr2.length; i++){
          if(this.tempArr2[i].Item_Code === this.ObjJobData.Item_Code) {
            this.tempArr2[i].Trip_Arr = this.TripTempArr;
          }
        }

        this.tempArr2.sort(function(a, b) {
          if (a.Item_Code < b.Item_Code) return -1;
          if (a.Item_Code > b.Item_Code) return 1;
          if (a.Item_Code == b.Item_Code) {
              if(a.order > b.order) return -1; else return 1;
          }
        });
        this.DetailList2 = this.tempArr2;
        for(let i = 0; i < this.DetailList2.length; i++) {
          let k = 0 ;
          let objTemp:any = {}
          for(let r = 0; r < this.tempArr2.length; r++){
            if(this.DetailList2[i].Item_Code === this.tempArr2[r].Item_Code) {
              k++;
            }
          }

          if (k > 1) {
            objTemp = this.tempArr2[i];
            this.DetailList2[i].Group = 'Y';
            this.DetailList2[i].Temp_Group_Array = k;
            // const arrTemp = $.grep(this.DetailList,function(val){return val.Item_Code === this.DetailList[i].Item_Code});
            // this.DetailList[i].Temp_Group_Array = [...arrTemp];

          }
        }
        const thisRef = this;
        this.DetailList2.forEach(function(car) {
          thisRef.expandedRows[car.Item_Code] = 1;
        });
        for(let i = 0; i < this.DetailList2.length; i++) {
          if (processed.indexOf(this.DetailList2[i].Item_Code)<0) {
            processed.push(this.DetailList2[i].Item_Code);
            this.DistinctItemCode2.push({
              Item_Code:this.DetailList2[i].Item_Code,
              Sl_No:this.DetailList2[i].Sl_No,
              ToggleFlag: true,
              Sub_Item_Flag : false,
              Sub_Item_List : []
            });


          }
        }
        for(let i = 0; i < this.DetailList2.length; i++) {
          for(let k = 0; k < this.DistinctItemCode2.length; k++) {
            if (this.DetailList2[i].Item_Code ===  this.DistinctItemCode2[k].Item_Code && this.DetailList2[i].bridge_item ) {
              if(processed2.indexOf(this.DetailList2[i].bridge_item)<0) {
                processed2.push(this.DetailList2[i].bridge_item);
                this.DistinctItemCode2[k].Sub_Item_Flag = true;
                this.DistinctItemCode2[k].Sub_Item_List.push({
                  bridge_item:this.DetailList2[i].bridge_item,
                  Sl_No:this.DetailList2[i].bridge_item_Sl_No,
                  ToggleFlag2: true,
                });
                this.DistinctItemCode2[k].Sub_Item_List.sort((a, b) => (Number(a.Sl_No) > Number(b.Sl_No)) ? 1 : -1);
              }
            }
          }
        }

      this.DistinctItemCode2.sort((a, b) => (Number(a.Sl_No) > Number(b.Sl_No)) ? 1 : -1);
      } else if (this.ObjJobData.Type_of_Work === 'Bridges and Culverts' && ItemFlag === 'BAR') {
        this.DistinctItemCode3 = [];
        this.DistinctSubItemCode3 = [];
        this.tempArr3.push(this.ObjJobData);
        for(let i = 0; i < this.tempArr3.length; i++){
          if(this.tempArr3[i].Item_Code === this.ObjJobData.Item_Code) {
            this.tempArr3[i].Trip_Arr = this.TripTempArr;
          }
        }

        this.tempArr3.sort(function(a, b) {
          if (a.Item_Code < b.Item_Code) return -1;
          if (a.Item_Code > b.Item_Code) return 1;
          if (a.Item_Code == b.Item_Code) {
              if(a.order > b.order) return -1; else return 1;
          }
        });
        this.DetailList3 = this.tempArr3;
        for(let i = 0; i < this.DetailList3.length; i++) {
          let k = 0 ;
          let objTemp:any = {}
          for(let r = 0; r < this.tempArr3.length; r++){
            if(this.DetailList3[i].Item_Code === this.tempArr3[r].Item_Code) {
              k++;
            }
          }

          if (k > 1) {
            objTemp = this.tempArr3[i];
            this.DetailList3[i].Group = 'Y';
            this.DetailList3[i].Temp_Group_Array = k;
            // const arrTemp = $.grep(this.DetailList,function(val){return val.Item_Code === this.DetailList[i].Item_Code});
            // this.DetailList[i].Temp_Group_Array = [...arrTemp];

          }
        }
        const thisRef = this;
        this.DetailList3.forEach(function(car) {
          thisRef.expandedRows[car.Item_Code] = 1;
        });
        for(let i = 0; i < this.DetailList3.length; i++) {
          if (processed.indexOf(this.DetailList3[i].Item_Code)<0) {
            processed.push(this.DetailList3[i].Item_Code);
            this.DistinctItemCode3.push({
              Item_Code:this.DetailList3[i].Item_Code,
              Sl_No:this.DetailList3[i].Sl_No,
              ToggleFlag: true,
              Sub_Item_Flag : false,
              Sub_Item_List : []
            });


          }
        }
        for(let i = 0; i < this.DetailList3.length; i++) {
          for(let k = 0; k < this.DistinctItemCode3.length; k++) {
            if (this.DetailList3[i].Item_Code ===  this.DistinctItemCode3[k].Item_Code && this.DetailList3[i].bridge_item ) {
              if(processed2.indexOf(this.DetailList3[i].bridge_item)<0) {
                processed2.push(this.DetailList3[i].bridge_item);
                this.DistinctItemCode3[k].Sub_Item_Flag = true;
                this.DistinctItemCode3[k].Sub_Item_List.push({
                  bridge_item:this.DetailList3[i].bridge_item,
                  Sl_No:this.DetailList3[i].bridge_item_Sl_No,
                  ToggleFlag2: true,
                });
                this.DistinctItemCode3[k].Sub_Item_List.sort((a, b) => (Number(a.Sl_No) > Number(b.Sl_No)) ? 1 : -1);
              }
            }
          }
        }

      this.DistinctItemCode3.sort((a, b) => (Number(a.Sl_No) > Number(b.Sl_No)) ? 1 : -1);
      } else {
        this.tempArr.push(this.ObjJobData);
        for(let i = 0; i < this.tempArr.length; i++){
          if(this.tempArr[i].Item_Code === this.ObjJobData.Item_Code) {
            this.tempArr[i].Trip_Arr = this.TripTempArr;
          }
        }

        this.tempArr.sort(function(a, b) {
          if (a.Item_Code < b.Item_Code) return -1;
          if (a.Item_Code > b.Item_Code) return 1;
          if (a.Item_Code == b.Item_Code) {
              if(a.order > b.order) return -1; else return 1;
          }
        });
        this.DetailList = this.tempArr;
        for(let i = 0; i < this.DetailList.length; i++) {
          let k = 0 ;
          let objTemp:any = {}
          for(let r = 0; r < this.tempArr.length; r++){
            if(this.DetailList[i].Item_Code === this.tempArr[r].Item_Code) {
              k++;
            }
          }

          if (k > 1) {
            objTemp = this.tempArr[i];
            this.DetailList[i].Group = 'Y';
            this.DetailList[i].Temp_Group_Array = k;
            // const arrTemp = $.grep(this.DetailList,function(val){return val.Item_Code === this.DetailList[i].Item_Code});
            // this.DetailList[i].Temp_Group_Array = [...arrTemp];

          }
        }
        const thisRef = this;
        this.DetailList.forEach(function(car) {
          thisRef.expandedRows[car.Item_Code] = 1;
        });
        this.DistinctItemCode = [];
        this.DistinctSubItemCode = [];
        for(let i = 0; i < this.DetailList.length; i++) {
          if (processed.indexOf(this.DetailList[i].Item_Code)<0) {
            processed.push(this.DetailList[i].Item_Code);
            this.DistinctItemCode.push({
              Item_Code:this.DetailList[i].Item_Code,
              Sl_No:this.DetailList[i].Sl_No,
              ToggleFlag: true,
              Sub_Item_Flag : false,
              Sub_Item_List : []
            });


          }
        }
        for(let i = 0; i < this.DetailList.length; i++) {
          for(let k = 0; k < this.DistinctItemCode.length; k++) {
            if (this.DetailList[i].Item_Code ===  this.DistinctItemCode[k].Item_Code && this.DetailList[i].bridge_item ) {
              if(processed2.indexOf(this.DetailList[i].bridge_item)<0) {
                processed2.push(this.DetailList[i].bridge_item);
                this.DistinctItemCode[k].Sub_Item_Flag = true;
                this.DistinctItemCode[k].Sub_Item_List.push({
                  bridge_item:this.DetailList[i].bridge_item,
                  Sl_No:this.DetailList[i].bridge_item_Sl_No,
                  ToggleFlag2: true,
                });
                this.DistinctItemCode[k].Sub_Item_List.sort((a, b) => (Number(a.Sl_No) > Number(b.Sl_No)) ? 1 : -1);
              }
            }
          }
        }
        this.DistinctItemCode.sort((a, b) => (Number(a.Sl_No) > Number(b.Sl_No)) ? 1 : -1);
      }
      this.updateRowGroupMetaData();
      this.clearAddDetails();
      this.ChainageValidMgs = '';
    } else {
      if(!validFlag) {
        this.compacctToast.clear();
        this.compacctToast.add({
          key: "compacct-toast",
          severity: "error",
          life: 5000,
          summary: "Chainage Error Message",
          detail: this.ChainageValidMgs
        });
      }
    }

  }
  isBetween(n, a, b,flag?) {
    let toFlag = false;
    if(flag === 'Tovalid') {
      toFlag = n === b ? true: false
    }
    if(flag === 'Fromvalid') {
      toFlag = n === a ? true: false
    }
    return toFlag ? false : (n - a) * (n - b) <= 0
 }
  GridValidationCheck() {
    let flag = false;
    this.ChainageValidMgs = '';
    const Chanage_From = Number(this.ObjJobData.Chanage_From_KM) + '.' + this.ObjJobData.Chanage_From_M;
    const Chanage_To = Number(this.ObjJobData.Chanage_To_KM) + '.' + this.ObjJobData.Chanage_To_M;
    const Chanage_At = Number(this.ObjJobData.Chanage_At_KM) + '.' + this.ObjJobData.Chanage_At_M;
    for(let i = 0; i < this.DetailList.length; i++) {
      if((this.DetailList[i].calculation_type === this.ObjJobData.calculation_type) && (this.DetailList[i].Item_Code === this.ObjJobData.Item_Code) && this.ObjJobData.Side === 'Both Side') {
        if(this.ObjJobData.bridge_item){
          if(this.DetailList[i].bridge_item === this.ObjJobData.bridge_item){
            const checkFrom = this.isBetween(Number(Chanage_From),Number(this.DetailList[i].Chanage_From),Number(this.DetailList[i].Chanage_To),'Tovalid');
            const checkTo = this.isBetween(Number(Chanage_To),Number(this.DetailList[i].Chanage_From),Number(this.DetailList[i].Chanage_To),'Fromvalid');
            if(checkFrom || checkTo) {
              console.log('found between');
              const Tostr =  'Chainage To : ' + this.DetailList[i].Chanage_To + ' of Side ' + this.ObjJobData.Side + ' Already Exits.';
              const Fromstr =  'Chainage From : '+ this.DetailList[i].Chanage_From + ' of Side ' + this.ObjJobData.Side + ' Already Exits.';
              const Allstr =  'Chainage From : '+ this.DetailList[i].Chanage_From + ' | Chainage To : ' + this.DetailList[i].Chanage_To +' of Side ' + this.ObjJobData.Side + ' Already Exits.';
              this.ChainageValidMgs = checkFrom && checkTo ? Allstr : checkFrom ? Fromstr : checkTo ? Tostr: '';
              flag = false;
                break;
            } else {
              const checkMax = Number(Chanage_From) < Number(this.DetailList[i].Chanage_From);
              const checkMaxTo = checkMax ? Number(Chanage_To) > Number(this.DetailList[i].Chanage_From) : false;
              if(checkMaxTo) {
                console.log('found between')
                const Tostr =  'Chainage To : ' + this.DetailList[i].Chanage_To + ' of Side ' + this.ObjJobData.Side + ' Already Exits.';
              const Fromstr =  'Chainage From : '+ this.DetailList[i].Chanage_From + ' of Side ' + this.ObjJobData.Side + ' Already Exits.';
              const Allstr =  'Chainage From : '+ this.DetailList[i].Chanage_From + ' | Chainage To : ' + this.DetailList[i].Chanage_To +' of Side ' + this.ObjJobData.Side + ' Already Exits.';
              this.ChainageValidMgs = checkFrom && checkTo ? Allstr : checkFrom ? Fromstr : checkTo ? Tostr: '';
                flag = false;
                break;
              } else{
                flag =  true;
              }
              }
            }
        } else {
            const checkFrom = this.isBetween(Number(Chanage_From),Number(this.DetailList[i].Chanage_From),Number(this.DetailList[i].Chanage_To),'Tovalid');
            const checkTo = this.isBetween(Number(Chanage_To),Number(this.DetailList[i].Chanage_From),Number(this.DetailList[i].Chanage_To),'Fromvalid');
            if(checkFrom || checkTo) {
              console.log('found between')
              const Tostr =  'Chainage To : ' + this.DetailList[i].Chanage_To + ' of Side ' + this.ObjJobData.Side + ' Already Exits.';
              const Fromstr =  'Chainage From : '+ this.DetailList[i].Chanage_From + ' of Side ' + this.ObjJobData.Side + ' Already Exits.';
              const Allstr =  'Chainage From : '+ this.DetailList[i].Chanage_From + ' | Chainage To : ' + this.DetailList[i].Chanage_To +' of Side ' + this.ObjJobData.Side + ' Already Exits.';
              this.ChainageValidMgs = checkFrom && checkTo ? Allstr : checkFrom ? Fromstr : checkTo ? Tostr: '';
              flag = false;
                break;
            } else {
              const checkMax = Number(Chanage_From) < Number(this.DetailList[i].Chanage_From);
              const checkMaxTo = checkMax ? Number(Chanage_To) > Number(this.DetailList[i].Chanage_From) : false;
              if(checkMaxTo) {
                console.log('found between')
                const Tostr =  'Chainage To : ' + this.DetailList[i].Chanage_To + ' of Side ' + this.ObjJobData.Side + ' Already Exits.';
              const Fromstr =  'Chainage From : '+ this.DetailList[i].Chanage_From + ' of Side ' + this.ObjJobData.Side + ' Already Exits.';
              const Allstr =  'Chainage From : '+ this.DetailList[i].Chanage_From + ' | Chainage To : ' + this.DetailList[i].Chanage_To +' of Side ' + this.ObjJobData.Side + ' Already Exits.';
              this.ChainageValidMgs = checkFrom && checkTo ? Allstr : checkFrom ? Fromstr : checkTo ? Tostr: '';
                flag = false;
                break;
              } else{
                flag =  true;
              }
            }
          }
      }
      else{
        if( (this.DetailList[i].calculation_type === this.ObjJobData.calculation_type) && (this.DetailList[i].Item_Code === this.ObjJobData.Item_Code) && (this.DetailList[i].Side === 'LHS' && this.ObjJobData.Side === 'LHS')) {
          if(this.ObjJobData.bridge_item){
            if(this.DetailList[i].bridge_item === this.ObjJobData.bridge_item){
              const checkFrom = this.isBetween(Number(Chanage_From),Number(this.DetailList[i].Chanage_From),Number(this.DetailList[i].Chanage_To),'Tovalid');
              const checkTo = this.isBetween(Number(Chanage_To),Number(this.DetailList[i].Chanage_From),Number(this.DetailList[i].Chanage_To),'Fromvalid');
              if(checkFrom || checkTo) {
                console.log('found between')
                const Tostr =  'Chainage To : ' + this.DetailList[i].Chanage_To + ' of Side ' + this.ObjJobData.Side + ' Already Exits.';
              const Fromstr =  'Chainage From : '+ this.DetailList[i].Chanage_From + ' of Side ' + this.ObjJobData.Side + ' Already Exits.';
              const Allstr =  'Chainage From : '+ this.DetailList[i].Chanage_From + ' | Chainage To : ' + this.DetailList[i].Chanage_To +' of Side ' + this.ObjJobData.Side + ' Already Exits.';
              this.ChainageValidMgs = checkFrom && checkTo ? Allstr : checkFrom ? Fromstr : checkTo ? Tostr: '';
                flag = false;
                  break;
              } else {
                const checkMax = Number(Chanage_From) < Number(this.DetailList[i].Chanage_From);
              const checkMaxTo = checkMax ? Number(Chanage_To) > Number(this.DetailList[i].Chanage_From) : false;
              if(checkMaxTo) {
                console.log('found between')
                const Tostr =  'Chainage To : ' + this.DetailList[i].Chanage_To + ' of Side ' + this.ObjJobData.Side + ' Already Exits.';
              const Fromstr =  'Chainage From : '+ this.DetailList[i].Chanage_From + ' of Side ' + this.ObjJobData.Side + ' Already Exits.';
              const Allstr =  'Chainage From : '+ this.DetailList[i].Chanage_From + ' | Chainage To : ' + this.DetailList[i].Chanage_To +' of Side ' + this.ObjJobData.Side + ' Already Exits.';
              this.ChainageValidMgs = checkFrom && checkTo ? Allstr : checkFrom ? Fromstr : checkTo ? Tostr: '';
                flag = false;
                break;
              } else{
                flag =  true;
              }
                }
              }
          } else {
              const checkFrom = this.isBetween(Number(Chanage_From),Number(this.DetailList[i].Chanage_From),Number(this.DetailList[i].Chanage_To),'Tovalid');
              const checkTo = this.isBetween(Number(Chanage_To),Number(this.DetailList[i].Chanage_From),Number(this.DetailList[i].Chanage_To),'Fromvalid');
              if(checkFrom || checkTo) {
                console.log('found between')
                const Tostr =  'Chainage To : ' + this.DetailList[i].Chanage_To + ' of Side ' + this.ObjJobData.Side + ' Already Exits.';
              const Fromstr =  'Chainage From : '+ this.DetailList[i].Chanage_From + ' of Side ' + this.ObjJobData.Side + ' Already Exits.';
              const Allstr =  'Chainage From : '+ this.DetailList[i].Chanage_From + ' | Chainage To : ' + this.DetailList[i].Chanage_To +' of Side ' + this.ObjJobData.Side + ' Already Exits.';
              this.ChainageValidMgs = checkFrom && checkTo ? Allstr : checkFrom ? Fromstr : checkTo ? Tostr: '';
                flag = false;
                  break;
              } else {
                const checkMax = Number(Chanage_From) < Number(this.DetailList[i].Chanage_From);
                const checkMaxTo = checkMax ? Number(Chanage_To) > Number(this.DetailList[i].Chanage_From) : false;
                if(checkMaxTo) {
                  console.log('found between')
                  const Tostr =  'Chainage To : ' + this.DetailList[i].Chanage_To + ' of Side ' + this.ObjJobData.Side + ' Already Exits.';
              const Fromstr =  'Chainage From : '+ this.DetailList[i].Chanage_From + ' of Side ' + this.ObjJobData.Side + ' Already Exits.';
              const Allstr =  'Chainage From : '+ this.DetailList[i].Chanage_From + ' | Chainage To : ' + this.DetailList[i].Chanage_To +' of Side ' + this.ObjJobData.Side + ' Already Exits.';
              this.ChainageValidMgs = checkFrom && checkTo ? Allstr : checkFrom ? Fromstr : checkTo ? Tostr: '';
                  flag = false;
                  break;
                } else{
                  flag =  true;
                }
              }
            }
        }
        else if( (this.DetailList[i].calculation_type === this.ObjJobData.calculation_type) && (this.DetailList[i].Item_Code === this.ObjJobData.Item_Code) && (this.DetailList[i].Side === 'RHS' && this.ObjJobData.Side === 'RHS')) {
          if(this.ObjJobData.bridge_item){
            if(this.DetailList[i].bridge_item === this.ObjJobData.bridge_item){
              const checkFrom = this.isBetween(Number(Chanage_From),Number(this.DetailList[i].Chanage_From),Number(this.DetailList[i].Chanage_To),'Tovalid');
              const checkTo = this.isBetween(Number(Chanage_To),Number(this.DetailList[i].Chanage_From),Number(this.DetailList[i].Chanage_To),'Fromvalid');
              if(checkFrom || checkTo) {
                console.log('found between')
                const Tostr =  'Chainage To : ' + this.DetailList[i].Chanage_To + ' of Side ' + this.ObjJobData.Side + ' Already Exits.';
              const Fromstr =  'Chainage From : '+ this.DetailList[i].Chanage_From + ' of Side ' + this.ObjJobData.Side + ' Already Exits.';
              const Allstr =  'Chainage From : '+ this.DetailList[i].Chanage_From + ' | Chainage To : ' + this.DetailList[i].Chanage_To +' of Side ' + this.ObjJobData.Side + ' Already Exits.';
              this.ChainageValidMgs = checkFrom && checkTo ? Allstr : checkFrom ? Fromstr : checkTo ? Tostr: '';
                flag = false;
                  break;
              } else {
                const checkMax = Number(Chanage_From) < Number(this.DetailList[i].Chanage_From);
                const checkMaxTo = checkMax ? Number(Chanage_To) > Number(this.DetailList[i].Chanage_From) : false;
                if(checkMaxTo) {
                  console.log('found between')
                  const Tostr =  'Chainage To : ' + this.DetailList[i].Chanage_To + ' of Side ' + this.ObjJobData.Side + ' Already Exits.';
              const Fromstr =  'Chainage From : '+ this.DetailList[i].Chanage_From + ' of Side ' + this.ObjJobData.Side + ' Already Exits.';
              const Allstr =  'Chainage From : '+ this.DetailList[i].Chanage_From + ' | Chainage To : ' + this.DetailList[i].Chanage_To +' of Side ' + this.ObjJobData.Side + ' Already Exits.';
              this.ChainageValidMgs = checkFrom && checkTo ? Allstr : checkFrom ? Fromstr : checkTo ? Tostr: '';
                  flag = false;
                  break;
                } else{
                  flag =  true;
                }
                }
              }
          } else {
              const checkFrom = this.isBetween(Number(Chanage_From),Number(this.DetailList[i].Chanage_From),Number(this.DetailList[i].Chanage_To),'Tovalid');
              const checkTo = this.isBetween(Number(Chanage_To),Number(this.DetailList[i].Chanage_From),Number(this.DetailList[i].Chanage_To),'Fromvalid');
              if(checkFrom || checkTo) {
                console.log('found between')
                const Tostr =  'Chainage To : ' + this.DetailList[i].Chanage_To + ' of Side ' + this.ObjJobData.Side + ' Already Exits.';
              const Fromstr =  'Chainage From : '+ this.DetailList[i].Chanage_From + ' of Side ' + this.ObjJobData.Side + ' Already Exits.';
              const Allstr =  'Chainage From : '+ this.DetailList[i].Chanage_From + ' | Chainage To : ' + this.DetailList[i].Chanage_To +' of Side ' + this.ObjJobData.Side + ' Already Exits.';
              this.ChainageValidMgs = checkFrom && checkTo ? Allstr : checkFrom ? Fromstr : checkTo ? Tostr: '';
                flag = false;
                  break;
              } else {
                const checkMax = Number(Chanage_From) < Number(this.DetailList[i].Chanage_From);
                const checkMaxTo = checkMax ? Number(Chanage_To) > Number(this.DetailList[i].Chanage_From) : false;
                if(checkMaxTo) {
                  console.log('found between')
                  const Tostr =  'Chainage To : ' + this.DetailList[i].Chanage_To + ' of Side ' + this.ObjJobData.Side + ' Already Exits.';
              const Fromstr =  'Chainage From : '+ this.DetailList[i].Chanage_From + ' of Side ' + this.ObjJobData.Side + ' Already Exits.';
              const Allstr =  'Chainage From : '+ this.DetailList[i].Chanage_From + ' | Chainage To : ' + this.DetailList[i].Chanage_To +' of Side ' + this.ObjJobData.Side + ' Already Exits.';
              this.ChainageValidMgs = checkFrom && checkTo ? Allstr : checkFrom ? Fromstr : checkTo ? Tostr: '';
                  flag = false;
                  break;
                } else{
                  flag =  true;
                }
              }

            }
        } else {
          flag = true;
        }

      }
    }
    return  this.DetailList.length ? flag : true;
  }
  GetItemConsumption(item,item_code) {
    if(item.Loose_Qnty) {
      const totalcompact = this.GetTotalQnt(item_code);
      const totalLoseQnty = this.GetGridTotalLooseQnty(item);
      const n = (Number(totalLoseQnty.replace(/,/g, '')) / ( Number(totalcompact.replace(/,/g, ''))));
      return n.toFixed(2) +' %';
    }else {
      return '-';
    }
  }
  GetGridTotalLooseQnty(obj){
    const arrTemp = $.grep(this.DetailList,function(val){return val.Item_Code === obj.Item_Code});
      let tempArr = [];
      for(let i = 0; i < arrTemp.length; i++) {
        if(arrTemp[i].Trip_Arr.length) {
          for(let k = 0; k < arrTemp[i].Trip_Arr.length; k++) {
            tempArr.push(arrTemp[i].Trip_Arr[k]);
          }
        }
      }
      let qunty:any = 0;
      for(let i = 0; i < tempArr.length; i++) {
        if (tempArr[i].Material_Unit === 'CFT') {
          const val = Number(tempArr[i].No_Of_Trip) * Number(tempArr[i].Loose_Qty_Per_Trip) * 0.0283;
          const addVal = typeof(val) === "number" ? val.toFixed(3) : Number(val).toFixed(3);
          qunty += Number(addVal);
        } else {
          qunty += Number(tempArr[i].Total_Loose_Qty);
        }
      }
      const decimalCheck = qunty % 1;
      if (decimalCheck > 0) {
        const k = qunty.toString()
        const n = k.lastIndexOf('.');
        const result = k.substring(n + 1);
        const round = Number(Math.round(qunty)).toFixed(3);
        qunty = (Number(result) >= 995 && Number(result) <= 999 ) ? Number(round).toFixed(3) : qunty.toFixed(3);
      }
      const valQnty =  typeof(qunty) === "number" ? qunty.toFixed(3) : Number(qunty).toFixed(3);
      return this.numberWithCommas(valQnty);
  }
  getDetailList(item , itemFlag) {
    let tempArr = [];
    if(itemFlag === 'Main' ){
      for(let i = 0; i < this.DetailList.length; i++) {
        if(this.DetailList[i].Item_Code === item) {
          tempArr.push(this.DetailList[i])
        }
      }
    }
    if(itemFlag === 'Sub' ){
      for(let i = 0; i < this.DetailList.length; i++) {
        if(this.DetailList[i].bridge_item === item) {
          tempArr.push(this.DetailList[i])
        }
      }
    }
    if(this.ObjJobData.Type_of_Work === 'Road Works'){
      let arr1 = [];
      for(let i = 0; i < tempArr.length; i++) {
        if(tempArr[i].calculation_type === 'Addition' && tempArr[i].Side === 'LHS') {
          arr1.push(tempArr[i])
        }
      }
      arr1.sort(function (vote1, vote2) {
        if (Number(vote1.Chanage_From)  < Number(vote2.Chanage_From)) {
            return -1;
        }
        if ( Number(vote1.Chanage_From)  >  Number(vote2.Chanage_From)){
              return 1;
        }
      });
      let arr2 = [];
      for(let i = 0; i < tempArr.length; i++) {
        if(tempArr[i].calculation_type === 'Addition' && tempArr[i].Side === 'RHS') {
          arr2.push(tempArr[i])
        }
      }
      arr2.sort(function (vote1, vote2) {
        if (Number(vote1.Chanage_From)  < Number(vote2.Chanage_From)) {
            return -1;
        }
        if (Number(vote1.Chanage_From)  >  Number(vote2.Chanage_From)){
              return 1;
        }
      });
      let arr3 = [];
      for(let i = 0; i < tempArr.length; i++) {
        if(tempArr[i].calculation_type === 'Addition' && tempArr[i].Side === 'Both Side') {
          arr3.push(tempArr[i])
        }
      }
      arr3.sort(function (vote1, vote2) {
        if (Number(vote1.Chanage_From)  < Number(vote2.Chanage_From)) {
            return -1;
        }
        if (Number(vote1.Chanage_From)  >  Number(vote2.Chanage_From)){
              return 1;
        }
      });

      let arr4 = [];
      for(let i = 0; i < tempArr.length; i++) {
        if(tempArr[i].calculation_type === 'Deduction' && tempArr[i].Side === 'LHS') {
          arr4.push(tempArr[i])
        }
      }
      arr4.sort(function (vote1, vote2) {
        if (Number(vote1.Chanage_At)  < Number(vote2.Chanage_At)) {
            return -1;
        }
        if ( Number(vote1.Chanage_At)  >  Number(vote2.Chanage_At)){
              return 1;
        }
      });
      let arr5 = [];
      for(let i = 0; i < tempArr.length; i++) {
        if(tempArr[i].calculation_type === 'Deduction' && tempArr[i].Side === 'RHS') {
          arr5.push(tempArr[i])
        }
      }
      arr5.sort(function (vote1, vote2) {
        if (Number(vote1.Chanage_At)  < Number(vote2.Chanage_At)) {
            return -1;
        }
        if (Number(vote1.Chanage_At)  >  Number(vote2.Chanage_At)){
              return 1;
        }
      });
      let arr6 = [];
      for(let i = 0; i < tempArr.length; i++) {
        if(tempArr[i].calculation_type === 'Deduction' && tempArr[i].Side === 'Both Side') {
          arr6.push(tempArr[i])
        }
      }
      arr6.sort(function (vote1, vote2) {
        if (Number(vote1.Chanage_At)  < Number(vote2.Chanage_At)) {
            return -1;
        }
        if (Number(vote1.Chanage_At)  >  Number(vote2.Chanage_At)){
              return 1;
        }
      });


      const array = arr1.concat(arr2);
      const array1 = array.concat(arr3);
      const array2 = array1.concat(arr4);
      const array3 = array2.concat(arr5);
      const array4 = array3.concat(arr6);
      return array4;
    }
    if(this.ObjJobData.Type_of_Work === 'Bridges and Culverts') {
      let arr1 = [];
      for(let i = 0; i < tempArr.length; i++) {
        if(tempArr[i].calculation_type === 'Addition') {
          arr1.push(tempArr[i])
        }
      }
      let arr2 = [];
      for(let i = 0; i < tempArr.length; i++) {
        if(tempArr[i].calculation_type === 'Deduction') {
          arr2.push(tempArr[i])
        }
      }
      const array = arr1.concat(arr2);
      return array;
    }

  }
  getDetailListHp (item , itemFlag) {
    let tempArr = [];
    if(itemFlag === 'Main' ){
      for(let i = 0; i < this.DetailList2.length; i++) {
        if(this.DetailList2[i].Item_Code === item) {
          tempArr.push(this.DetailList2[i])
        }
      }
    }
    if(itemFlag === 'Sub' ){
      for(let i = 0; i < this.DetailList2.length; i++) {
        if(this.DetailList2[i].bridge_item === item) {
          tempArr.push(this.DetailList2[i])
        }
      }
    }
    let arr1 = [];
    for(let i = 0; i < tempArr.length; i++) {
      if(tempArr[i].calculation_type === 'Addition') {
        arr1.push(tempArr[i])
      }
    }
    let arr2 = [];
    for(let i = 0; i < tempArr.length; i++) {
      if(tempArr[i].calculation_type === 'Deduction') {
        arr2.push(tempArr[i])
      }
    }
    const array = arr1.concat(arr2);
    return array;
  }
  getDetailListbAR (item , itemFlag) {
    let tempArr = [];
    if(itemFlag === 'Main' ){
      for(let i = 0; i < this.DetailList3.length; i++) {
        if(this.DetailList3[i].Item_Code === item) {
          tempArr.push(this.DetailList3[i])
        }
      }
    }
    if(itemFlag === 'Sub' ){
      for(let i = 0; i < this.DetailList3.length; i++) {
        if(this.DetailList3[i].bridge_item === item) {
          tempArr.push(this.DetailList3[i])
        }
      }
    }
    let arr1 = [];
    for(let i = 0; i < tempArr.length; i++) {
      if(tempArr[i].calculation_type === 'Addition') {
        arr1.push(tempArr[i])
      }
    }
    let arr2 = [];
    for(let i = 0; i < tempArr.length; i++) {
      if(tempArr[i].calculation_type === 'Deduction') {
        arr2.push(tempArr[i])
      }
    }
    const array = arr1.concat(arr2);
    array.sort(function (vote1, vote2) {
      if (Number(vote1.Dia)  < Number(vote2.Dia)) {
          return -1;
      }
      if ( Number(vote1.Dia)  >  Number(vote2.Dia)){
            return 1;
      }
    });
    return array;
  }
  firstInGroup2(str: any){
    return this.DetailList3.filter(s => s.Dia == str.Dia).indexOf(str) == 0;
  }
  getDiaWiseLength(obj) {
    const arr = $.grep(this.DetailList3,function(ob){return ob.Dia === obj.Dia});
    return arr;
  }
  GetTotalDiaWise(dia) {
    const arr = $.grep(this.DetailList3,function(ob){return ob.Dia === dia});
    let count = 0;
    for(let i = 0; i < arr.length; i++) {
      if(arr[i].Dia) {
        count += Number(arr[i].Dia);
      }
    }
    const valQnty =  typeof(count) === "number" ? count.toFixed(3) : Number(count).toFixed(3);
    return this.numberWithCommas(valQnty);
  }
  GetTotalDia(dia) {
    let count = 0;
    for(let i = 0; i < this.DetailList3.length; i++) {
      if(this.DetailList3[i].Dia) {
        count += Number(this.DetailList3[i].Dia);
      }
    }
    const valQnty =  typeof(count) === "number" ? count.toFixed(3) : Number(count).toFixed(3);
    return this.numberWithCommas(valQnty);
  }
  DeleteSubItemIndex(item) {
   // this.DeleteDetailList(index);
  }
  DeleteDetailList(item){
    const index =  this.tempArr.findIndex(obj => obj.Grid_Index === item.Grid_Index);
    this.tempArr.splice(index, 1);
    this.DetailList =  this.tempArr;
    this.DistinctItemCode = [];
    this.DistinctSubItemCode = [];
    const processed = [];
    const processed2 = [];
    for(let i = 0; i < this.DetailList.length; i++) {
      if (processed.indexOf(this.DetailList[i].Item_Code)<0) {
        processed.push(this.DetailList[i].Item_Code);
        this.DistinctItemCode.push({
          Item_Code:this.DetailList[i].Item_Code,
          Sl_No:this.DetailList[i].Sl_No,
          ToggleFlag: true,
          Sub_Item_Flag : false,
          Sub_Item_List : []
        });
      }
    }
    for(let i = 0; i < this.DetailList.length; i++) {
      for(let k = 0; k < this.DistinctItemCode.length; k++) {
        if (this.DetailList[i].Item_Code ===  this.DistinctItemCode[k].Item_Code && this.DetailList[i].bridge_item ) {
          if(processed2.indexOf(this.DetailList[i].bridge_item)<0) {
            processed2.push(this.DetailList[i].bridge_item);
            this.DistinctItemCode[k].Sub_Item_Flag = true;
            this.DistinctItemCode[k].Sub_Item_List.push({
              bridge_item:this.DetailList[i].bridge_item,
              Sl_No:this.DetailList[i].bridge_item_Sl_No,
              ToggleFlag2: true,
            });
            this.DistinctItemCode[k].Sub_Item_List.sort((a, b) => (Number(a.Sl_No) > Number(b.Sl_No)) ? 1 : -1);
          }
        }
      }
    }
    this.DistinctItemCode.sort((a, b) => (Number(a.Sl_No) > Number(b.Sl_No)) ? 1 : -1);
    this.updateRowGroupMetaData();
    this.getAllQtyTrip();
  }
  DeleteDetailListHp(item){
    const index =  this.tempArr2.findIndex(obj => obj.Grid_Index === item.Grid_Index);
    this.tempArr2.splice(index, 1);
    this.DetailList2 =  this.tempArr2;
    this.DistinctItemCode2 = [];
    this.DistinctSubItemCode2 = [];
    const processed = [];
    const processed2 = [];
    for(let i = 0; i < this.DetailList2.length; i++) {
      if (processed.indexOf(this.DetailList2[i].Item_Code)<0) {
        processed.push(this.DetailList2[i].Item_Code);
        this.DistinctItemCode2.push({
          Item_Code:this.DetailList2[i].Item_Code,
          Sl_No:this.DetailList2[i].Sl_No,
          ToggleFlag: true,
          Sub_Item_Flag : false,
          Sub_Item_List : []
        });
      }
    }
    for(let i = 0; i < this.DetailList2.length; i++) {
      for(let k = 0; k < this.DistinctItemCode2.length; k++) {
        if (this.DetailList2[i].Item_Code ===  this.DistinctItemCode2[k].Item_Code && this.DetailList2[i].bridge_item ) {
          if(processed2.indexOf(this.DetailList2[i].bridge_item)<0) {
            processed2.push(this.DetailList2[i].bridge_item);
            this.DistinctItemCode2[k].Sub_Item_Flag = true;
            this.DistinctItemCode2[k].Sub_Item_List.push({
              bridge_item:this.DetailList2[i].bridge_item,
              Sl_No:this.DetailList2[i].bridge_item_Sl_No,
              ToggleFlag2: true,
            });
            this.DistinctItemCode2[k].Sub_Item_List.sort((a, b) => (Number(a.Sl_No) > Number(b.Sl_No)) ? 1 : -1);
          }
        }
      }
    }
    this.DistinctItemCode2.sort((a, b) => (Number(a.Sl_No) > Number(b.Sl_No)) ? 1 : -1);

  }
  DeleteDetailListBAR(item){
    const index =  this.tempArr3.findIndex(obj => obj.Grid_Index === item.Grid_Index);
    this.tempArr3.splice(index, 1);
    this.DetailList3 =  this.tempArr3;
    this.DistinctItemCode3 = [];
    this.DistinctSubItemCode3 = [];
    const processed = [];
    const processed2 = [];
    for(let i = 0; i < this.DetailList3.length; i++) {
      if (processed.indexOf(this.DetailList3[i].Item_Code)<0) {
        processed.push(this.DetailList3[i].Item_Code);
        this.DistinctItemCode3.push({
          Item_Code:this.DetailList3[i].Item_Code,
          Sl_No:this.DetailList3[i].Sl_No,
          ToggleFlag: true,
          Sub_Item_Flag : false,
          Sub_Item_List : []
        });
      }
    }
    for(let i = 0; i < this.DetailList3.length; i++) {
      for(let k = 0; k < this.DistinctItemCode3.length; k++) {
        if (this.DetailList3[i].Item_Code ===  this.DistinctItemCode3[k].Item_Code && this.DetailList3[i].bridge_item ) {
          if(processed2.indexOf(this.DetailList3[i].bridge_item)<0) {
            processed2.push(this.DetailList3[i].bridge_item);
            this.DistinctItemCode3[k].Sub_Item_Flag = true;
            this.DistinctItemCode3[k].Sub_Item_List.push({
              bridge_item:this.DetailList2[i].bridge_item,
              Sl_No:this.DetailList2[i].bridge_item_Sl_No,
              ToggleFlag2: true,
            });
            this.DistinctItemCode3[k].Sub_Item_List.sort((a, b) => (Number(a.Sl_No) > Number(b.Sl_No)) ? 1 : -1);
          }
        }
      }
    }
    this.DistinctItemCode3.sort((a, b) => (Number(a.Sl_No) > Number(b.Sl_No)) ? 1 : -1);

  }
  AddBridgeDetailList(valid) {

  }
  updateRowGroupMetaData() {
    this.rowGroupMetadata = {};
    if (this.DetailList) {
        for (let i = 0; i < this.DetailList.length; i++) {
            let rowData = this.DetailList[i];
            let brand = rowData.Item_Code;
            if (i == 0) {
                this.rowGroupMetadata[brand] = { index: 0, size: 1 };
            }
            else {
                let previousRowData = this.DetailList[i - 1];
                let previousRowGroup = previousRowData.Item_Code;
                if (brand === previousRowGroup)
                    this.rowGroupMetadata[brand].size++;
                else
                    this.rowGroupMetadata[brand] = { index: i, size: 1 };
            }
        }
    }
  }

  getTripByItemCode(item) {
    const arrTemp = $.grep(this.DetailList,function(val){return val.Item_Code === item});
    let tempArr = [];
    for(let i = 0; i < arrTemp.length; i++) {
      if(arrTemp[i].Trip_Arr.length) {
        tempArr =  arrTemp[i].Trip_Arr;
        break;
      } else{
        tempArr = [];
      }
    }
    tempArr.sort(function(a, b){
      return a.Trip_By === b.Trip_By ? 0 : +(a.Trip_By > b.Trip_By) || -1;
    });
    return tempArr.length ? tempArr : [];
  }
  viewTripTempArrFromDetails (obj) {
    this.TripTempArrFromDetails = []
      const arrTemp = $.grep(this.DetailList,function(val){return val.Item_Code === obj.Item_Code});
      let tempArr = [];
      for(let i = 0; i < arrTemp.length; i++) {
        if(arrTemp[i].Trip_Arr.length) {
          tempArr =  arrTemp[i].Trip_Arr;
          break;
        } else{
          tempArr = [];
        }
      }
      if(tempArr.length) {
        this.TripTempArrFromDetails = tempArr;
        this.TripModal = true;
      } else {
        this.TripTempArrFromDetails = [];
        this.TripModal = false;
      }
  }

  SaveDailyEntry(valid) {
    this.DailyJobFormFormSubmitted = true;
    if(valid) {
      const obj = {
        'CIVIL_DP_RW_String' : JSON.stringify(this.DetailList),
        'CIVIL_DP_RW_Trip_String': JSON.stringify(this.TripTempArr)
      }
      const UrlAddress = "/BL_Txn_Civil_Daily_Job/Insert_CIVIL_DP_RW";
      this.$http.post(UrlAddress, obj).subscribe((data: any) => {
        if (data.success) {
          console.group("Compacct V2");
          console.log("%c  Entry Updated:", "color:green;");
          console.log("/BL_Txn_Civil_Daily_Job/Insert_CIVIL_DP_RW");
          this.compacctToast.clear();
          this.compacctToast.add({
            key: "compacct-toast",
            severity: "success",
            summary: "",
            detail: "Succesfully Entry Updated"
          });
          this.Spinner = false;
          this.DailyJobFormFormSubmitted = false;
        } else {
          this.compacctToast.clear();
          this.compacctToast.add({
            key: "compacct-toast",
            severity: "error",
            summary: "Warn Message",
            detail: "Error Occured "
          });
        }
      });
    }
  }

  // TRIP BY
  ToggleTripBy(){
    this.TripBySubmitted = false;
    this.TripByName = undefined;
    if(this.ObjJobData.Type_of_Work){
      this.TripByModal = true;

    }
   }
  CreateTripBy(valid){
  this.TripBySubmitted = true;
  if(valid) {
      this.Spinner = true;
      const UrlAddress = "/BL_CRM_Txn_Enq_Tender/Create_Tender_BOQ_Trip_By";
      const obj = {
        Type : this.ObjJobData.Type_of_Work,
        Trip_By : this.TripByName
       };
      this.$http.post(UrlAddress, obj).subscribe((data: any) => {
        console.log(data)
      if (data.success) {
        // if (this.ObjTender.Foot_Fall_ID) {
          this.compacctToast.clear();
          this.compacctToast.add({
            key: "compacct-toast",
            severity: "success",
            summary: "",
            detail: "Succesfully Trip By Created"
          });
        // } else {
        //   this.compacctToast.clear();
        //   this.compacctToast.add({
        //     key: "compacct-toast",
        //     severity: "success",
        //     summary: "",
        //     detail: "Organization Already Exits"
        //   });
        // }
        this.GetTripByList(this.ObjJobData.Type_of_Work);
        this.TripBySubmitted = false;
        this.TripByName = undefined;
        this.TripByModal = false;
        this.Spinner = false;
      } else {
        this.compacctToast.clear();
        this.compacctToast.add({
          key: "compacct-toast",
          severity: "error",
          summary: "Warn Message",
          detail: "Error Occured "
        });
      }
      });
  }
  }
  ToggleType(){
    this.TypeSubmitted = false;
    this.TypeName = undefined;
    if(this.ObjJobData.Type_of_Work){
      this.TypeModal = true;

    }
   }
  CreateType(valid){
  this.TypeSubmitted = true;
  if(valid) {
      this.Spinner = true;
      const UrlAddress = "/BL_Txn_Civil_Daily_Job/Create_Structured_Type";
      const obj = {
        Structured_Type : this.TypeName
       };
      this.$http.post(UrlAddress, obj).subscribe((data: any) => {
        console.log(data)
      if (data.success) {
        // if (this.ObjTender.Foot_Fall_ID) {
          this.compacctToast.clear();
          this.compacctToast.add({
            key: "compacct-toast",
            severity: "success",
            summary: "",
            detail: "Succesfully Type Created"
          });
        // } else {
        //   this.compacctToast.clear();
        //   this.compacctToast.add({
        //     key: "compacct-toast",
        //     severity: "success",
        //     summary: "",
        //     detail: "Organization Already Exits"
        //   });
        // }
        this.GetBridgeType();
        this.TypeSubmitted = false;
        this.TypeName = undefined;
        this.TypeModal = false;
        this.Spinner = false;
      } else {
        this.compacctToast.clear();
        this.compacctToast.add({
          key: "compacct-toast",
          severity: "error",
          summary: "Warn Message",
          detail: "Error Occured "
        });
      }
      });
  }
  }
  ToggleLooseQnty(){
    this.LooseQntySubmitted = false;
    this.LooseQntyName = undefined;
    this.LooseQntyModal = true;
   }
  CreateLooseQnty(valid){
  this.LooseQntySubmitted = true;
  if(valid) {
      this.Spinner = true;
      const UrlAddress = "/BL_Txn_Civil_Daily_Job/Create_Loose_Qty_Per_Trip";
      const obj = {
        Loose_Qty_Per_Trip : this.LooseQntyName
       };
      this.$http.post(UrlAddress, obj).subscribe((data: any) => {
        console.log(data)
      if (data.success) {
        // if (this.ObjTender.Foot_Fall_ID) {
          this.compacctToast.clear();
          this.compacctToast.add({
            key: "compacct-toast",
            severity: "success",
            summary: "",
            detail: "Succesfully Loose Qnty. Created"
          });
        // } else {
        //   this.compacctToast.clear();
        //   this.compacctToast.add({
        //     key: "compacct-toast",
        //     severity: "success",
        //     summary: "",
        //     detail: "Organization Already Exits"
        //   });
        // }
        this.GetLooseQty();
        this.LooseQntySubmitted = false;
        this.LooseQntyName = undefined;
        this.LooseQntyModal = false;
        this.Spinner = false;
      } else {
        this.compacctToast.clear();
        this.compacctToast.add({
          key: "compacct-toast",
          severity: "error",
          summary: "Warn Message",
          detail: "Error Occured "
        });
      }
      });
  }
  }
  ToggleStructureType(){
    this.StructureFormSubmitted = false;
    this.ObjJobData.Party = undefined;
    this.ObjJobData.structure_at_km = undefined;
    this.ObjJobData.structure_at_meter = undefined;
    this.ObjJobData.Structured_Type = undefined;
    this.ObjJobData.Structured_Breadth = undefined;
    this.ObjJobData.Structured_Height = undefined;
    this.ObjJobData.Structured_Length = undefined;
    this.ObjJobData.structure_at_km = undefined;
    this.ObjJobData.No_of_Span =  undefined;
    this.ObjJobData.Structure_Details = undefined;
    this.StructureTypeModal = true;
   }
  CreateStructureType(valid){
this.StructureFormSubmitted = true;
if(valid) {
    this.Spinner = true;
    // const UrlAddress = `/BL_Txn_Civil_Daily_Job/Create_Structured_Details?Party=`+this.ObjJobData.Party+`&structure_at_km=`+this.ObjJobData.structure_at_km+
    // `&structure_at_meter=`+this.ObjJobData.structure_at_meter+`&Structured_Type=`+this.ObjJobData.Structured_Type+`&structure_at=`+this.ObjJobData.structure_at+`&Structured_Breadth=`+this.ObjJobData.Structured_Breadth+
    // `&Structured_Height=`+this.ObjJobData.Structured_Height+`&Structured_Length=`+this.ObjJobData.Structured_Length;
    const UrlAddress = '/BL_Txn_Civil_Daily_Job/Create_Structured_Details';
    const obj = {
      Party : this.ObjJobData.Party,
      structure_at_km:this.ObjJobData.structure_at_km,
      structure_at: this.ObjJobData.structure_at_km,
      No_of_Span: this.ObjJobData.No_of_Span,
      structure_at_meter:this.ObjJobData.structure_at_meter,
      Structured_Type:this.ObjJobData.Structured_Type,
      Structured_Breadth:this.ObjJobData.Structured_Breadth,
      Structured_Height:this.ObjJobData.Structured_Height,
      Structured_Length:this.ObjJobData.Structured_Length

      };
    this.$http.post(UrlAddress, obj).subscribe((data: any) => {
      console.log(data)
    if (data.success) {
      // if (this.ObjTender.Foot_Fall_ID) {
        this.compacctToast.clear();
        this.compacctToast.add({
          key: "compacct-toast",
          severity: "success",
          summary: "",
          detail: "Succesfully Structure Type Created"
        });
      // } else {
      //   this.compacctToast.clear();
      //   this.compacctToast.add({
      //     key: "compacct-toast",
      //     severity: "success",
      //     summary: "",
      //     detail: "Organization Already Exits"
      //   });
      // }
      this.GetStructureTypeDetail();
      this.ObjJobData.Party = undefined;
      this.ObjJobData.structure_at_km = undefined;
      this.ObjJobData.structure_at_meter = undefined;
      this.ObjJobData.Structured_Type = undefined;
      this.ObjJobData.Structured_Breadth = undefined;
      this.ObjJobData.Structured_Height = undefined;
      this.ObjJobData.Structured_Length = undefined;
      this.ObjJobData.structure_at_km = undefined;
      this.ObjJobData.No_of_Span =  undefined;
      this.StructureTypeModal = false;
      this.StructureFormSubmitted = false;
      this.Spinner = false;
    } else {
      this.compacctToast.clear();
      this.compacctToast.add({
        key: "compacct-toast",
        severity: "error",
        summary: "Warn Message",
        detail: "Error Occured "
      });
    }
    });
}
  }
  ToggleParty(){
    this.PartySubmitted = false;
    this.PartyName = undefined;
      this.PartyModal = true;
   }
  CreateParty(valid){
  this.PartySubmitted = true;
  if(valid) {
      this.Spinner = true;
      const UrlAddress = "/BL_Txn_Civil_Daily_Job/Create_Party";
      const obj = {
        Party : this.PartyName
       };
      this.$http.post(UrlAddress, obj).subscribe((data: any) => {
        console.log(data)
      if (data.success) {
        // if (this.ObjTender.Foot_Fall_ID) {
          this.compacctToast.clear();
          this.compacctToast.add({
            key: "compacct-toast",
            severity: "success",
            summary: "",
            detail: "Succesfully Party Created"
          });
        // } else {
        //   this.compacctToast.clear();
        //   this.compacctToast.add({
        //     key: "compacct-toast",
        //     severity: "success",
        //     summary: "",
        //     detail: "Organization Already Exits"
        //   });
        // }
        this.GetParty();
        this.PartySubmitted = false;
        this.PartyName = undefined;
        this.PartyModal = false;
        this.Spinner = false;
      } else {
        this.compacctToast.clear();
        this.compacctToast.add({
          key: "compacct-toast",
          severity: "error",
          summary: "Warn Message",
          detail: "Error Occured "
        });
      }
      });
  }
  }
  ToggleReceivedFrom(){
    this.ReceivedFromSubmitted = false;
    this.ReceivedFromName = undefined;
      this.ReceivedFromModal = true;
   }
  CreateReceivedFrom(valid){
  this.ReceivedFromSubmitted = true;
  if(valid) {
      this.Spinner = true;
      const UrlAddress = "/BL_Txn_Civil_Daily_Job/Create_Received_From";
      const obj = {
        Received_From : this.ReceivedFromName
       };
      this.$http.post(UrlAddress, obj).subscribe((data: any) => {
        console.log(data)
      if (data.success) {
        // if (this.ObjTender.Foot_Fall_ID) {
          this.compacctToast.clear();
          this.compacctToast.add({
            key: "compacct-toast",
            severity: "success",
            summary: "",
            detail: "Succesfully Received From Created"
          });
        // } else {
        //   this.compacctToast.clear();
        //   this.compacctToast.add({
        //     key: "compacct-toast",
        //     severity: "success",
        //     summary: "",
        //     detail: "Organization Already Exits"
        //   });
        // }
        this.GetReceivedFrom();
        this.ReceivedFromSubmitted = false;
        this.ReceivedFromName = undefined;
        this.ReceivedFromModal = false;
        this.Spinner = false;
      } else {
        this.compacctToast.clear();
        this.compacctToast.add({
          key: "compacct-toast",
          severity: "error",
          summary: "Warn Message",
          detail: "Error Occured "
        });
      }
      });
  }
  }

   // Clear & Tab
   TabClick(e) {
    this.tabIndexToView = e.index;
    this.buttonname = "Create";
   // this.clearData();
  }
  clearData() {
    this.Spinner = false;
   // this.BOQData = [];
   //  this.ItemList =[];
    this.DailyJobFormFormSubmitted = false;
    this.TripByFormSubmitted = false;
    this.DetailList = [];
    this.TripTempArr = [];
    this.ObjJobData = new JobData();
    this.JobDate = new Date();
    this.SelectedItemCode = undefined;
  }
  clearAddDetails () {
    const obj = this.ObjJobData;
    this.ObjJobData = new JobData();
    this.ObjJobData.Date = obj.Date;
    this.ObjJobData.Type_of_Work = obj.Type_of_Work;
    this.ObjJobData.calculation_type = obj.calculation_type;
    this.ObjJobData.Item_Code = obj.Item_Code;
    this.ObjJobData.UNIT =  obj.UNIT;
    this.ObjJobData.Sl_No =  obj.Sl_No;
    this.ObjJobData.BOQ_Txn_ID = obj.BOQ_Txn_ID;
    this.SelectedItemCode =  obj.Item_Code;
    this.ObjJobData.Structure_Details = obj.Structure_Details ? obj.Structure_Details :undefined;
    this.JobDate = new Date(obj.Date);
    this.ObjJobData.Type_of_Work = obj.Type_of_Work;
    this.TripTempArr = this.ObjJobData.UNIT === 'Cum' ? this.getTripByItemCode(obj.Item_Code) : [];
    this.DailyJobFormFormSubmitted = false;
    this.TripByFormSubmitted = false;
    this.BridgeItemSelect = undefined;
    this.ObjJobData.Chanage_From_KM = undefined;
    this.ObjJobData.Chanage_From_M = undefined;
    this.ObjJobData.Chanage_To_KM = undefined;
    this.ObjJobData.Chanage_To_M = undefined;
    this.ObjJobData.Chanage_At_KM = undefined;
    this.ObjJobData.Chanage_At_M = undefined;
    this.ObjJobData.Chanage_At_KM = undefined;
    this.ObjJobData.Chanage_At_M = undefined;
   this.ObjJobData.Total_Length= undefined;
   this.ObjJobData.Side= undefined;
   this.ObjJobData.Width= undefined;
   this.ObjJobData.Hight_Thikness= undefined;
   this.ObjJobData.QNTY= undefined;
   this.ObjJobData.Trip_Arr = [];
   this.ObjJobData.Remarks= undefined;
   this.ObjJobData.Loose_Qnty= undefined;

  this.ObjJobData.structure_at_km= undefined;
  this.ObjJobData.structure_at_meter= undefined;
  this.ObjJobData.Structured_Type= undefined;
  this.ObjJobData.Structured_Length= undefined;
  this.ObjJobData.Structured_Breadth = undefined;
  this.ObjJobData.Structured_Height = undefined;
  this.ObjJobData.bridge_item_length= undefined;
  this.ObjJobData.Bridge_Item_Breath = undefined;
  this.ObjJobData.Bridge_Item_Height= undefined;
  this.ObjJobData.Bridge_Item_Total_Qty= undefined;
  this.ObjJobData.Bridge_Item_Unit= undefined;
  this.ObjJobData.Bridge_Item_Remarks= undefined;
  this.ObjJobData.bridge_item= undefined;
  this.ObjJobData.bridge_item_Sl_No = undefined;
  this.ObjJobData.Material_Unit = 'CFT';
  }
  clearBridgeData() {}
}
class Search{
  Project_Short_Name:string;
  Agreement_Number:string;
}
class JobData {
  Date:string;
  Type_of_Work:string;
  calculation_type:string;
  Structure_Details:string;
  Trip_By:string;
  Item_Code:string;
  No_Of_Trip:string;
  Loose_Qty_Per_Trip:string;
  Total_Loose_Qty:string;
  Chanage_From:string;
  Chanage_From_KM:string;
  Chanage_From_M:string;
  Chanage_To:string;
  Chanage_To_KM:string;
  Chanage_To_M:string;
  Chanage_At:string;
  Chanage_At_KM:string;
  Chanage_At_M:string;
  Total_Length:string;
  Side:string;
  Width:string;
  Hight_Thikness:string;
  QNTY:any;
  UNIT:string;
  Trip_Arr:any;
  Remarks:string;

  BOQ_Txn_ID:string;
  Sl_No:string;
  No_of_Span:string;
  Material_Unit:string;
  Received_From:string;
  Loose_Qnty:string;
  Deduct_Percentage:number;
  Total_Loose_Qnty_All:string;

  Party:string;
  structure_at_km:string;
structure_at_meter:string;
Structured_Type:string;
Structured_Length:string;
Structured_Breadth :string;
Structured_Height :string;
bridge_item_length:string;
Bridge_Item_Breath :string;
Bridge_Item_Height:string;
Bridge_Item_Total_Qty:string;
Bridge_Item_Unit:string;
Bridge_Item_Remarks:string;
bridge_item:string;
Number:string;
bridge_item_Sl_No:string;
Grid_Index:number;

Dia:string;
Length_per_Each_Bar:string;
Total_Length_Rmt:string;
Co_efficient:string;
Size_Weep_Hole:string;
Length_per_piece:string;
}
