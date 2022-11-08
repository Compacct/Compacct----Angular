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
  RawMatConsList:any = [];
  AddRMConsList:any = [];
  RMConsumptionvalid = false;
  FurnaceNoList:any = [];

  ConsumableConsList:any = [];
  AddConsumableConsList:any = [];
  ConConsumptionvalid = false;
  
  ProductionList:any = [];
  AddProductionList:any = [];
  Productionvalid = false;

  WasteSlagList:any = [];
  AddWasteSlagList:any = [];
  wasteslagvalid = false;

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
                  "PRODUCTION", "WASTE SLAG", "SHUTDOWN DETAILS", "PRODUCT CHARACTERISTICS",
                  "RAW MATERIAL & CONSUMABLE RECEIPT", "DISPATCHES", "CRITICAL ISSUE"];
    this.Header.pushHeader({
      Header: "Furnace MIS Input",
      Link: "Material Management -> Production -> Furnace MIS Input"
    });
    // this.RawMatConsList = ["Raw_Material_Consumable"]
  }
  onReject(){}
  onConfirm(){}
  TabClick(e) {
    //console.log(e)
    this.tabIndexToView = e.index;
    this.items = ["DAILY PERFORMANCE PARAMETER", "RAW MATERIAL CONSUMPTION", "CONSUMABLE CONSUMPTION",
                  "PRODUCTION", "WASTE SLAG", "SHUTDOWN DETAILS", "PRODUCT CHARACTERISTICS",
                  "RAW MATERIAL & CONSUMABLE RECEIPT", "DISPATCHES", "CRITICAL ISSUE"];
    //this.buttonname = "Save";
    //this.clearData();
  }
  addRMCons(){
    this.RMConsumptionvalid = true;
    if(this.ObjFurnaceMISinput.Raw_Material_Consumable){
      // const productFilter:any = this.RawMatConsList.filter((el:any)=>Number(el.Product_ID) === Number(this.objRMreqiadd.Product_ID));
       //console.log("productFilter",productFilter);
      // if(productFilter.length){
        this.AddRMConsList.push({
          Raw_Material_Consumable: this.ObjFurnaceMISinput.Raw_Material_Consumable,
          // Product_Description: productFilter[0].Product_Description,
          RMC_Batch_No: this.ObjFurnaceMISinput.RMC_Batch_No,
          RMC_Qty: this.ObjFurnaceMISinput.RMC_Qty,
          // Created_By: this.$CompacctAPI.CompacctCookies.User_ID
          // Challan_No : null
        })
        this.RMConsumptionvalid = false;
        this.ObjFurnaceMISinput.Raw_Material_Consumable = undefined;
      }
    // }
  }
  RMConsdelete(i){
    this.AddRMConsList.splice(i,1);
  }
  addConsumableCons(){
    this.ConConsumptionvalid = true;
    if(this.ObjFurnaceMISinput.Consumable_Consumption){
        this.AddConsumableConsList.push({
          Consumable_Consumption: this.ObjFurnaceMISinput.Consumable_Consumption,
          CC_Batch_No: this.ObjFurnaceMISinput.CC_Batch_No,
          CC_Qty: this.ObjFurnaceMISinput.CC_Qty,
        })
        this.ConConsumptionvalid = false;
        this.ObjFurnaceMISinput.Consumable_Consumption = undefined;
      }
  }
  ConsumableConsdelete(i){
    this.AddConsumableConsList.splice(i,1);
  }
  addProduction(){
  this.Productionvalid = true;
  if(this.ObjFurnaceMISinput.Production){
      this.AddProductionList.push({
        Production: this.ObjFurnaceMISinput.Production,
        Production_Batch_No: this.ObjFurnaceMISinput.Production_Batch_No,
        Production_Qty: this.ObjFurnaceMISinput.Production_Qty,
      })
      this.Productionvalid = false;
      this.ObjFurnaceMISinput.Production = undefined;
    }
  }
  Productiondelete(i){
    this.AddProductionList.splice(i,1);
  }
  addWasteSlag(){
    this.wasteslagvalid = true;
    if(this.ObjFurnaceMISinput.Waste_Slag){
        this.AddProductionList.push({
          Waste_Slag: this.ObjFurnaceMISinput.Waste_Slag,
          WasteSlag_Batch_No: this.ObjFurnaceMISinput.WasteSlag_Batch_No,
          WasteSlag_Qty: this.ObjFurnaceMISinput.WasteSlag_Qty,
        })
        this.wasteslagvalid = false;
        this.ObjFurnaceMISinput.Waste_Slag = undefined;
      }
  }
  WasteSlagdelete(i){
    this.AddWasteSlagList.splice(i,1);
  }
  SaveFurnace(valid){}
}
class FurnaceMISinput {
  Furnace_No : any;
  Furnace_Power : any;
  Auxiliary_Power : any;
  Average_Load : any;
  Average_Power : any;
  Load_Factor : any;
  slipping : any;
  No_of_Tapping : any;
  Raw_Material_Consumable : any;
  RMC_Batch_No : any;
  RMC_Qty : any;
  Consumable_Consumption : any;
  CC_Batch_No : any;
  CC_Qty : any;
  Production : any;
  Production_Batch_No :  any;
  Production_Qty :  any;
  Waste_Slag : any;
  WasteSlag_Batch_No : any;
  WasteSlag_Qty : any;
  Critical_Issue : any;
}
