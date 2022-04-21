import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MessageService } from 'primeng/api';
import { DateTimeConvertService } from '../../../../shared/compacct.global/dateTime.service';
import { CompacctCommonApi } from '../../../../shared/compacct.services/common.api.service';
import { CompacctHeader } from '../../../../shared/compacct.services/common.header.service';
import { CompacctGlobalApiService } from '../../../../shared/compacct.services/compacct.global.api.service';
declare var NepaliFunctions: any;
import { DateNepalConvertService } from '../../../../shared/compacct.global/dateNepal.service';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
const NepaliDate = require('nepali-date');

@Component({
  selector: 'app-engineering-quotation-nepal',
  templateUrl: './engineering-quotation-nepal.component.html',
  styleUrls: ['./engineering-quotation-nepal.component.css'],
  providers: [MessageService],
  encapsulation: ViewEncapsulation.None
})
export class EngineeringQuotationNepalComponent implements OnInit {
  tabIndexToView = 0;
  url = window["config"];
  persons: [];
  buttonname = "Save";
  Spinner = false;
  seachSpinner = false;
  items = [];

  ObjSupportTicket = new SupportTicket();
  EnginnerQuoationFormSubmit = false;
  SupportTicketDate : any = {};
  ExpectedcompletionDate : any = {};
  SupportStartDate : any = {};
  SupportEndDate : any = {};
  CallTypeList = [];
  LoctionList = [];
  MfList = [];
  MachineList = [];
  SerialNoList = [];
  EngineerList = [];
  ContractStatusList = [];
  SymptomList = [];

  previouscontractList = [];
  PreviousContractPopup = false;
  customername = undefined;
  locationname = undefined
  precontractdisable = true;

  StatusList = [];

  currentdate = new Date();
  ObjBrowse = new Browse();
  BrowseStartDate : any = {};
  BrowseEndDate : any = {};
  SearchFormSubmit = false;
  BrowseList = [];
  EditList = [];
  Contract_ID = undefined;
  browsestartdate: Date;
  CurrentDateNepal= undefined;

  alignedenggid = undefined;
  alignedengineer = undefined;
  AlEngineerList = [];

  EnginnerQuoationFormSubmitted = false;
  ObjEnginnerQuoation = new EnginnerQuoation();
  QuoationDate : any = {};

  EnginnerQuoationMachineFormSubmitted = false;

  CustomerList =[];
  ManufactureList = [];
  InstallMachineList = [];
  SparePartsList =[];

  EngQuoationProductList = [];

  Browse_Sub_Ledger_ID : any;
  SearchFormSubmitted = false;

  QuotationDocID = undefined;
  CustomerCreatePopup = false;


  constructor(
    private $http: HttpClient,
    private commonApi: CompacctCommonApi,
    private GlobalAPI: CompacctGlobalApiService,
    private Header: CompacctHeader,
    private compacctToast: MessageService,
    public $CompacctAPI: CompacctCommonApi,
    private DateService: DateTimeConvertService,
    private DateNepalConvertService : DateNepalConvertService
  ) {
    this.CurrentDateNepal = this.DateNepalConvertService.GetNepaliCurrentDateNew();
    console.log(this.DateNepalConvertService.GetNepaliCurrentDateNew())
    console.log(this.DateNepalConvertService.convertNepaliDateToEngDate(this.CurrentDateNepal))
   }

  ngOnInit() {
    this.items = ["BROWSE", "CREATE"];
    this.Header.pushHeader({
      Header: "Engineering Quotation",
      Link: " Engineering CRM -> Transaction -> Engineering Quotation"
    });
    this.SupportTicketDate = this.CurrentDateNepal;
    this.ExpectedcompletionDate = this.CurrentDateNepal;
    this.SupportStartDate = this.CurrentDateNepal;
    this.SupportEndDate = this.CurrentDateNepal;
    this.BrowseStartDate = this.CurrentDateNepal;
    this.BrowseEndDate = this.CurrentDateNepal;
       this.GetCallType();
       this.GetCustomer();
       this.GetManufactureList();
      // this.GetSerialNo();
       this.GetEngineer();
       this.GetContractStatus();
       this.GetSymptom();
       //
       
       this.GetCustomer();
    this.QuoationDate = this.CurrentDateNepal;
  }

  GetCustomer(){
    const obj = {
      "SP_String": "SP_Engg_CRM_Installed_Machine_Service_Contract",
      "Report_Name_String": "Get_Customer"
     }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      data.forEach((obj)=>{
        obj.label = obj.Sub_Ledger_Name;
        obj.value = obj.Sub_Ledger_ID;
      })
     this.CustomerList = data;  
    });
  }
  GetLocation() {
    this.LoctionList = [];
    if(this.ObjEnginnerQuoation.Sub_Ledger_ID) {
    const TObj = {
      Sub_Ledger_ID: this.ObjEnginnerQuoation.Sub_Ledger_ID
    }
    const obj = {
      "SP_String": "SP_Engg_CRM_Installed_Machine_Service_Contract",
      "Report_Name_String": "Get_Location",
      "Json_Param_String": JSON.stringify([TObj])
    }
    this.GlobalAPI.getData(obj).subscribe((data: any) => {
      this.LoctionList = data;
      // console.log('LoctionList ==', this.LoctionList)

    });
  }
  }
  // CHANGE 
  GetManufactureList(){
    this.InstallMachineList =[];
    this.SparePartsList =[];
    this.ObjEnginnerQuoation.Product_Mfg_Comp_ID = undefined;
    this.ObjEnginnerQuoation.Mfg_Company = undefined;
    this.ObjEnginnerQuoation.Machine = undefined;
    this.ObjEnginnerQuoation.Product_ID = undefined;
    this.ObjEnginnerQuoation.Spare_Parts_Product_ID = undefined;
    this.ObjEnginnerQuoation.Spare_Part_Description = undefined;
    //if(this.ObjEnginnerQuoation.Sub_Ledger_ID && this.ObjEnginnerQuoation.Location_ID) {      
      // const TempArr = $.grep(this.LoctionList,(arr)=>{ return arr.Location_ID === this.ObjEnginnerQuoation.Location_ID});
      // this.ObjEnginnerQuoation.Location_Name = TempArr.length ? TempArr[0].Location_Name : undefined;
    // const Obj = {
    //   Sub_Ledger_ID: this.ObjEnginnerQuoation.Sub_Ledger_ID,
    //   Location_ID: this.ObjEnginnerQuoation.Location_ID
    // }
      const obj = {
        "SP_String": "SP_Engg_CRM_Installed_Machine_Service_Contract",
        "Report_Name_String": "Get_Manufacturer_All",
        //"Json_Param_String": JSON.stringify([Obj])
      }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      data.forEach((obj)=>{
        obj.label = obj.Mfg_Company;
        obj.value = obj.Product_Mfg_Comp_ID;
      })
    this.ManufactureList = data;  
    });
   // }
  }
  GetInstallMachine(){
    this.InstallMachineList =[];
    this.SparePartsList =[];
    this.ObjEnginnerQuoation.Machine = undefined;
    this.ObjEnginnerQuoation.Product_ID = undefined;
    this.ObjEnginnerQuoation.Spare_Parts_Product_ID = undefined;
    this.ObjEnginnerQuoation.Spare_Part_Description = undefined;
    if(this.ObjEnginnerQuoation.Product_Mfg_Comp_ID) {
      const TempArr = $.grep(this.ManufactureList,(arr)=>{ return arr.Product_Mfg_Comp_ID === this.ObjEnginnerQuoation.Product_Mfg_Comp_ID});
      this.ObjEnginnerQuoation.Mfg_Company = TempArr.length ? TempArr[0].Mfg_Company : undefined;
      const TObj = {
        Product_Mfg_Comp_ID : this.ObjEnginnerQuoation.Product_Mfg_Comp_ID,
        // Sub_Ledger_ID: this.ObjEnginnerQuoation.Sub_Ledger_ID,
        // Location_ID: this.ObjEnginnerQuoation.Location_ID
      }
      const obj = {
        "SP_String": "SP_Engg_CRM_Installed_Machine_Service_Contract",
        "Report_Name_String": "Get_All_Machine",
        "Json_Param_String": JSON.stringify([TObj])
      }
      this.GlobalAPI.getData(obj).subscribe((data:any)=>{
        data.forEach((obj)=>{
          obj.label = obj.Machine;
          obj.value = obj.Product_ID;
        })
      this.InstallMachineList = data;  
      });
    }
    
  }
  GetSpareParts(){
    this.ObjEnginnerQuoation.Spare_Parts_Product_ID = undefined;
    this.ObjEnginnerQuoation.Spare_Part_Description = undefined;
    if(this.ObjEnginnerQuoation.Product_ID) {
      const TObj = {
        Machine_Product_ID : this.ObjEnginnerQuoation.Product_ID
      }
      const obj = {
        "SP_String": "SP_Engg_CRM_Installed_Machine_Service_Contract",
        "Report_Name_String": "Get_Spare_Parts_with_Machine_ID_for_Quotation",
        "Json_Param_String": JSON.stringify([TObj])
      }
      this.GlobalAPI.getData(obj).subscribe((data:any)=>{
        data.forEach((obj)=>{
          obj.label = obj.Spare_Part_Description;
          obj.value = obj.Spare_Parts_Product_ID;
        })
      this.SparePartsList = data;  
      });
    }
  }
  SparePartChange(){
    this.ObjEnginnerQuoation.Spare_Part_Description = undefined;
    if(this.ObjEnginnerQuoation.Spare_Parts_Product_ID){      
      const TempArr = $.grep(this.SparePartsList,(arr)=>{ return arr.Spare_Parts_Product_ID === this.ObjEnginnerQuoation.Spare_Parts_Product_ID});
      this.ObjEnginnerQuoation.Spare_Part_Description = TempArr.length ? TempArr[0].Spare_Part_Description : undefined;
      this.ObjEnginnerQuoation.Rate = TempArr.length ? TempArr[0].Sale_rate : undefined;
    }
  }
  ProductChange() {
    this.ObjEnginnerQuoation.Machine = undefined;
    this.ObjEnginnerQuoation.Spare_Part_Description = undefined;
    this.ObjEnginnerQuoation.Qty = undefined;
    this.ObjEnginnerQuoation.Rate = undefined;
    this.ObjEnginnerQuoation.Total_Amount = undefined;
    this.ObjEnginnerQuoation.Discount = undefined;
    this.ObjEnginnerQuoation.Discount_Type = undefined;
    this.ObjEnginnerQuoation.Discount_Amount = undefined;
    this.ObjEnginnerQuoation.Taxable_Amount = undefined;
    this.ObjEnginnerQuoation.VAT = 0;
    this.ObjEnginnerQuoation.Net_Amt = undefined;
    if(this.ObjEnginnerQuoation.Product_ID) {
      const TempArr = $.grep(this.InstallMachineList,(arr)=>{ return arr.Product_ID === this.ObjEnginnerQuoation.Product_ID});
      this.ObjEnginnerQuoation.Machine = TempArr.length ? TempArr[0].Machine : undefined;
      this.GetSpareParts();
    }
  }
  // ADD PRODUCT
  AddProductInfo(valid){
    this.EnginnerQuoationMachineFormSubmitted = true;
    const TempArr = $.grep(this.LoctionList,(arr)=>{ return arr.Location_ID === this.ObjEnginnerQuoation.Location_ID});
      this.ObjEnginnerQuoation.Location_Name = TempArr.length ? TempArr[0].Location_Name : undefined;
      //this.ObjEnginnerQuoation.Quotation_Date = this.QuoationDate;
      //this.ObjEnginnerQuoation.Quotation_Date = this.DateService.dateConvert(this.DateNepalConvertService.convertNepaliDateToEngDate(this.QuoationDate))
      // this.ObjEnginnerQuoation.Spare_Parts_Product_ID = this.ObjEnginnerQuoation.Quotation_Type != 'Spare'
      this.ObjEnginnerQuoation.Quotation_Doc_ID = Number(this.QuotationDocID) ? Number(this.QuotationDocID) : 0;
    if(valid) {
      this.EnginnerQuoationMachineFormSubmitted = false;
      this.EngQuoationProductList.push(this.ObjEnginnerQuoation);
      const PrevObj = {...this.ObjEnginnerQuoation};
      this.ObjEnginnerQuoation = new EnginnerQuoation();
      this.ObjEnginnerQuoation.Sub_Ledger_ID = PrevObj.Sub_Ledger_ID;
      this.ObjEnginnerQuoation.Quotation_Type = PrevObj.Quotation_Type;
      this.ObjEnginnerQuoation.Quotation_To_Company = PrevObj.Quotation_To_Company;
      console.log(this.EngQuoationProductList);
    }
  }
  Delete(i){    
    this.EngQuoationProductList.splice(i, 1);
  }
  
  CalculateAmount() {
    if (this.ObjEnginnerQuoation.Rate && this.ObjEnginnerQuoation.Qty) {
      this.ObjEnginnerQuoation.Total_Amount =(Number(this.ObjEnginnerQuoation.Rate) * Number(this.ObjEnginnerQuoation.Qty));
    } else {
      this.ObjEnginnerQuoation.Total_Amount = 0;
    }
    this.DiscountTypeChange();
  }
  CalculateTax(){
    this.ObjEnginnerQuoation.Net_Amt = undefined;
    this.ObjEnginnerQuoation.VAT = this.ObjEnginnerQuoation.VAT ? this.ObjEnginnerQuoation.VAT : 0;
    if(this.ObjEnginnerQuoation.Taxable_Amount) {
      const percenAmt = ( Number(this.ObjEnginnerQuoation.VAT) / 100) * Number(this.ObjEnginnerQuoation.Taxable_Amount);
      this.ObjEnginnerQuoation.Net_Amt = Number(this.ObjEnginnerQuoation.Taxable_Amount) + percenAmt;
    }
  }
  DiscountTypeClean = function() {
    this.ObjEnginnerQuoation.Discount = undefined;
    this.ObjEnginnerQuoation.Discount_Amount = undefined;
    this.ObjEnginnerQuoation.Taxable_Amount = undefined;
    if (
      this.ObjEnginnerQuoation.Discount_Type === undefined ||
      this.ObjEnginnerQuoation.Discount_Type === ""
    ) {
      this.ObjEnginnerQuoation.Discount_Type = undefined;
      this.DiscountTypeChange();
    }
  };
  DiscountTypeChange = function() {
    if (this.ObjEnginnerQuoation.Discount_Type) {
      if (this.ObjEnginnerQuoation.Discount_Type === "%") {
        this.ObjEnginnerQuoation.Discount_Amount = (
          (this.ObjEnginnerQuoation.Total_Amount * this.ObjEnginnerQuoation.Discount) /
          100
        ).toFixed(2);
        this.ObjEnginnerQuoation.Taxable_Amount = (
          this.ObjEnginnerQuoation.Total_Amount - this.ObjEnginnerQuoation.Discount_Amount
        ).toFixed(2);
      } else if (this.ObjEnginnerQuoation.Discount_Type === "AMT") {
        this.ObjEnginnerQuoation.Discount_Amount = this.ObjEnginnerQuoation.Discount;
        this.ObjEnginnerQuoation.Taxable_Amount = (
          this.ObjEnginnerQuoation.Total_Amount - this.ObjEnginnerQuoation.Discount_Amount
        ).toFixed(2);
      }
    } else {
      this.ObjEnginnerQuoation.Discount = 0;
      this.ObjEnginnerQuoation.Discount_Amount = this.ObjEnginnerQuoation.Discount;
      this.ObjEnginnerQuoation.Taxable_Amount = (
        this.ObjEnginnerQuoation.Total_Amount - this.ObjEnginnerQuoation.Discount_Amount
      ).toFixed(2);
    }
    this.CalculateTax();
  };
  // SAVE 
  
  // Clear & Tab
  TabClick(e) {
    this.tabIndexToView = e.index;
    this.items = ["BROWSE", "CREATE"];
    this.buttonname = "Save";
    this.clearData();
    this.QuotationDocID = undefined;
  }
  clearData() {
    this.Spinner = false;
   
    this.MfList = [];
    this.MachineList = [];
    this.LoctionList = [];
    this.SerialNoList = [];
    // this.GetBrowseList();
     this.EditList = [];
     this.Contract_ID = undefined;
     this.previouscontractList = [];
     this.GetContractStatus();
     this.alignedenggid = undefined;
     this.alignedengineer = undefined;
     //
    this.QuoationDate = this.CurrentDateNepal;
    this.ObjEnginnerQuoation = new EnginnerQuoation();
    this.EngQuoationProductList = [];
    this.InstallMachineList = [];
    this.SparePartsList = [];
    this.EnginnerQuoationFormSubmit = false; 
    this.EnginnerQuoationFormSubmitted = false;
    this.EnginnerQuoationMachineFormSubmitted = false;
  }
  GetCallType(){
    //  console.log("StatusList ===", this.StatusList)
        this.CallTypeList =[
          {Name : "Installation"},
          {Name : "PM"},
          {Name : "Breakdown"}
        ];
  }
  GetManufacturer(){
    const Obj = {
      Sub_Ledger_ID: this.ObjSupportTicket.Customer_Name,
      Location_ID: this.ObjSupportTicket.Location
    }
      const obj = {
        "SP_String": "SP_Engg_CRM_Installed_Machine_Service_Contract",
        "Report_Name_String": "Get_Manufacturer",
        "Json_Param_String": JSON.stringify([Obj])
       }
      this.GlobalAPI.getData(obj).subscribe((data:any)=>{
       this.MfList = data;
      // console.log('MfList ==', this.MfList)
    
      });
  }
  GetMachine(){
      const TObj = {
        Product_Mfg_Comp_ID : this.ObjSupportTicket.Machine_Manufacturer,
        Sub_Ledger_ID: this.ObjSupportTicket.Customer_Name,
        Location_ID: this.ObjSupportTicket.Location
      }
      const obj = {
        "SP_String": "SP_Engg_CRM_Installed_Machine_Service_Contract",
        "Report_Name_String": "Get_Machine",
        "Json_Param_String": JSON.stringify([TObj])
       }
      this.GlobalAPI.getData(obj).subscribe((data:any)=>{
       this.MachineList = data;
      // console.log('MachineList ==', this.MachineList)
      });
  }
  GetSerialNo(){
      const TObj = {
        Sub_Ledger_ID: this.ObjSupportTicket.Customer_Name,
        Location_ID: this.ObjSupportTicket.Location,
        Product_ID: this.ObjSupportTicket.Machine
      }
      const obj = {
        "SP_String": "SP_Engg_CRM_Installed_Machine_Service_Contract",
        "Report_Name_String": "Get_Serial_NOs",
        "Json_Param_String": JSON.stringify([TObj])
       }
      this.GlobalAPI.getData(obj).subscribe((data:any)=>{
       this.SerialNoList = data;
      // console.log('SerialNoList ==', this.SerialNoList)
      this.GetAlignedEngineer();
    
      });
  }
  GetEngineer(){
    // const TObj = {
    //   Product_Mfg_Comp_ID : this.ObjServiceContract.Machine_Manufacturer
    // }
    const obj = {
      "SP_String": "SP_Support_Ticket_Nepal",
      "Report_Name_String": "Get_Engineer",
      //"Json_Param_String": JSON.stringify([TObj])
     }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
     this.EngineerList = data;
    // console.log('SerialNoList ==', this.SerialNoList)
  
    });
  }
  GetAlignedEngineer(){
    this.alignedenggid = undefined;
    this.alignedengineer = undefined;
    const TObj = {
      Sub_Ledger_ID : this.ObjSupportTicket.Customer_Name,
      Location_ID : this.ObjSupportTicket.Location,
      Product_ID : this.ObjSupportTicket.Machine
    }
    const obj = {
      "SP_String": "SP_Support_Ticket_Nepal",
      "Report_Name_String": "Get_Engineer_Aligned",
      "Json_Param_String": JSON.stringify([TObj])
     }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
     this.AlEngineerList = data;
     this.alignedenggid = data[0].User_ID;
     this.alignedengineer = data[0].Member_Name;
     this.EngineerList.forEach(el => {
       if (el.User_ID == this.alignedenggid) {
        this.ObjSupportTicket.Assigned_Engineer = el.User_ID;
       }
    })
    // this.ObjSupportTicket.Assigned_Engineer = this.EngineerList[0].User_ID;
    console.log('Aligned EngineerList ==', this.AlEngineerList)
  
    });
  }
  ViewContract(){
    this.PreviousContractPopup = true;
  }
  ShowPreviousContract(){
    this.previouscontractList = [];
    const TObj = {
      Product_Mfg_Comp_ID : this.ObjSupportTicket.Machine_Manufacturer,
        Product_ID : this.ObjSupportTicket.Machine,
        Serial_No : this.ObjSupportTicket.Serial_No,
        Sub_Ledger_ID : this.ObjSupportTicket.Customer_Name,
        Location_ID : this.ObjSupportTicket.Location
    }
    const obj = {
      "SP_String": "SP_Support_Ticket_Nepal",
      "Report_Name_String": "Get_Previous_Contract",
      "Json_Param_String": JSON.stringify([TObj])
    }
    this.GlobalAPI.getData(obj).subscribe((data: any) => {
      this.previouscontractList = data;
      //this.PreviousContractPopup = true;
      // console.log('previouscontractList ==', this.previouscontractList)
    });
  }
  GetContractStatus(){
    //  console.log("StatusList ===", this.StatusList)
        this.ContractStatusList =[
          {Service_Type : "Chargeable"},
          {Service_Type : "Not Chargeable"}
        ];
  }
  GetPreContractStatus(){
    const TObj = {
        Product_Mfg_Comp_ID : this.ObjSupportTicket.Machine_Manufacturer,
        Product_ID : this.ObjSupportTicket.Machine,
        Serial_No : this.ObjSupportTicket.Serial_No,
        Sub_Ledger_ID : this.ObjSupportTicket.Customer_Name,
        Location_ID : this.ObjSupportTicket.Location
      }
      const obj = {
        "SP_String": "SP_Support_Ticket_Nepal",
        "Report_Name_String": "Get_Contract_Status",
        "Json_Param_String": JSON.stringify([TObj])
       }
      this.GlobalAPI.getData(obj).subscribe((data:any)=>{
       this.ContractStatusList = data;
       if(this.ContractStatusList.length) {
       this.ObjSupportTicket.Contract_Status = data[0].Service_Type;
       this.ShowPreviousContract();
       }
       else {
        this.GetContractStatus();
        this.ShowPreviousContract();
       }
      // console.log('SerialNoList ==', this.SerialNoList)
    
      });
  }
  GetSymptom(){
    // const TempObj = {
    //   User_ID:this.$CompacctAPI.CompacctCookies.User_ID,
    //   Cost_Cen_ID : this.$CompacctAPI.CompacctCookies.Cost_Cen_ID,
    //   Doc_Type : "Sale_Bill",
    //   Product_Type_ID : 0,
    //   bill_type : this.QueryStringObj.Ledger_Name ? 'Online' : ''
    //  }
   const obj = {
    "SP_String": "SP_Support_Ticket_Nepal",
    "Report_Name_String" : "Get_Symptom",
   //"Json_Param_String": JSON.stringify([TempObj])

  }
  this.GlobalAPI.getData(obj).subscribe((data:any)=>{
    if(data.length) {
      data.forEach(element => {
        element['label'] = element.Symptom,
        element['value'] = element.Symptom_ID
      });
      this.SymptomList = data;
    } else {
      this.SymptomList = [];

     }
    console.log("this.SymptomList======",this.SymptomList);


  });
  }
  convertToNepaliDateObj = function (_Date) {
    const EnglishDate = new Date(_Date);
    var month = EnglishDate.getUTCMonth() + 1;
    var day = EnglishDate.getDate();
    var year = EnglishDate.getUTCFullYear();
    const NepalDateObj = NepaliFunctions.AD2BS({
      year: year,
      month: month,
      day: day
    });
    //const NepalDate = {nyear: NepalDateObj.year, nmonth: Number(NepalDateObj.month) - 1, nday: NepalDateObj.day};
    const d1 = new NepaliDate(NepalDateObj.year, Number(NepalDateObj.month) - 1, NepalDateObj.day)
    // const nyear = NepalDateObj.year.toString().length == 1 ? "0" + NepalDateObj.year : NepalDateObj.year;
    // const nmonth = NepalDateObj.month.toString().length == 1 ? "0" + NepalDateObj.month : NepalDateObj.month;
    // const nday = NepalDateObj.day.toString().length == 1 ? "0" + NepalDateObj.day : NepalDateObj.day;
    //const NepalDate = NepalDateObj.day + '/' + NepalDateObj.month + '/' + NepalDateObj.year;
    //const NepalDate = nday + '/' + nmonth + '/' + nyear;
    return d1.format('dd mmmm, yyyy');
    // return {
    //   day: Number(nday),
    //   month: Number(nmonth),
    //   year: nyear
    // };
  }
  
  SaveEnggQuotation() {
    // this.SupportTicketFormSubmit = true;
    // this.Spinner = true;
    // if (valid && this.Contract_ID) {

    //   const d1 = new NepaliDate(this.ServiceStartDate.year, this.ServiceStartDate.month, this.ServiceStartDate.day);
    //   const d2 = new NepaliDate(this.ServiceEndDate.year, this.ServiceEndDate.month, this.ServiceEndDate.day);
    //   const d3 = new NepaliDate(this.PaymentDate.year, this.PaymentDate.month, this.PaymentDate.day);
    //   const Obj = {
    //     Contract_ID: this.Contract_ID,
    //     Sub_Ledger_ID: this.ObjServiceContract.Customer_Name,
    //     Location_ID: this.ObjServiceContract.Location,
    //     Product_Mfg_Comp_ID: this.ObjServiceContract.Machine_Manufacturer,
    //     Product_ID: this.ObjServiceContract.Machine,
    //     Serial_No: this.ObjServiceContract.Serial_No,
    //     Service_Type: this.ObjServiceContract.Type_of_Service,
    //     Service_Start_Date: d1.format('dd-mm-yyyy'),
    //     Service_End_Date: d2.format('dd-mm-yyyy'),
    //     Payment_Status: this.ObjServiceContract.Payment_Status,
    //     Payment_Date: d3.format('dd-mm-yyyy')
    //   }
    //   const obj = {
    //     "SP_String": "SP_Support_Ticket_Nepal",
    //     "Report_Name_String": "Update_Engg_CRM_Installed_Machine_Service_Contract",
    //     "Json_Param_String": JSON.stringify([Obj])

    //   }
    //   this.GlobalAPI.postData(obj).subscribe((data: any) => {
    //     console.log(data);
    //     //var tempID = data[0].Column1;
    //     if (data[0].Column1) {
    //       this.compacctToast.clear();
    //       //const mgs = this.buttonname === 'Save & Print Bill' ? "Created" : "updated";
    //       this.compacctToast.add({
    //         key: "compacct-toast",
    //         severity: "success",
    //         summary: "Installed Machine",
    //         detail: "Succesfully Updated" //+ mgs
    //       });
    //       this.clearData();
    //       this.GetSearchedList(true);
    //       this.Contract_ID = undefined;
    //       this.tabIndexToView = 0;
    //       this.items = ["BROWSE", "CREATE"];
    //       //  this.buttonname = "Save";
    //       // this.testchips =[];

    //     } else {
    //       // this.ngxService.stop();
    //       this.Spinner = false;
    //       this.compacctToast.clear();
    //       this.compacctToast.add({
    //         key: "compacct-toast",
    //         severity: "error",
    //         summary: "Warn Message",
    //         detail: "Error Occured "
    //       });
    //     }
    //   })
    // // } else {
      this.EnginnerQuoationFormSubmit = true;
      this.Spinner = true;
     if (this.ObjEnginnerQuoation.Quotation_Type && this.ObjEnginnerQuoation.Quotation_To_Company) {
        console.log('save',this.ObjEnginnerQuoation)
        const obj = {
          "SP_String": "SP_Quotation_Master",
          "Report_Name_String": "Create_Edit_Quotation",
          "Json_Param_String": JSON.stringify(this.EngQuoationProductList)
        }
        this.GlobalAPI.postData(obj).subscribe((data: any) => {
          console.log(data);
          //var msg = data[0].Column1;
          if (data[0].Column1) {
            this.compacctToast.clear();
            this.compacctToast.add({
              key: "compacct-toast",
              severity: "success",
              summary: "Engineering Quotation",
              detail: this.buttonname != "Save" ? "Succesfully Updated" : "Succesfully Saved"
            });
              this.clearData();
              this.GetSearchedList(true)
              this.Spinner = false;
              if (this.buttonname != "Save"){
                this.clearData();
                this.tabIndexToView = 0;
                this.GetSearchedList(true);
              }

          } else {
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
      } else {
        this.Spinner = false;
        this.compacctToast.clear();
        this.compacctToast.add({
          key: "compacct-toast",
          severity: "error",
          summary: "Warn Message",
          detail: "Error Occured "
        });
      }
    //}
  }
  getDateRange(dateRangeObj) {
    if (dateRangeObj.length) {
      this.ObjBrowse.start_date = dateRangeObj[0];
      this.ObjBrowse.end_date = dateRangeObj[1];
    }
  }
  GetSearchedList(valid) {
    this.SearchFormSubmit = true;
    // const start = this.ObjBrowse.start_date
    //  ? this.DateService.dateConvert(new Date(this.ObjBrowse.start_date))
    //  : this.DateService.dateConvert(new Date());
    // const end = this.ObjBrowse.end_date
    //  ? this.DateService.dateConvert(new Date(this.ObjBrowse.end_date))
    //  : this.DateService.dateConvert(new Date());
    if (valid) {
      this.seachSpinner = true;
      const tempobj = {
        Sub_Ledger_ID: this.Browse_Sub_Ledger_ID ? this.Browse_Sub_Ledger_ID : 0,
        // Start_Date : this.DateService.dateConvert(this.DateNepalConvertService.convertNepaliDateToEngDate(this.BrowseStartDate)),
        // End_Date : this.DateService.dateConvert(this.DateNepalConvertService.convertNepaliDateToEngDate(this.BrowseEndDate)),
      }
      const obj = {
        "SP_String": "SP_Quotation_Master",
        "Report_Name_String": "Get_Quotation",
        "Json_Param_String": JSON.stringify([tempobj])
      }
      this.GlobalAPI.getData(obj).subscribe((data: any) => {
        this.BrowseList = data;
        // console.log('Search list=====',this.BrowseList)
        this.seachSpinner = false;
        this.SearchFormSubmit = false;
        for(let i = 0; i < this.BrowseList.length ; i++){
           this.BrowseList[i]['Support_Ticket_Date'] = this.convertToNepaliDateObj(this.BrowseList[i]['Support_Ticket_Date']);
          // console.log('Service_Start_Date==', this.BrowseList[i]['Service_Start_Date'])
        }  
      })
    }
  }
  Edit(rowdata){
    this.QuotationDocID = undefined;
    this.clearData();
    if (rowdata.Quotation_Doc_ID) {
      console.log('Quotation_Doc_ID',rowdata.Quotation_Doc_ID)
      this.QuotationDocID = rowdata.Quotation_Doc_ID
      this.tabIndexToView = 1;
      this.items = ["BROWSE", "UPDATE"];
      this.buttonname = "Update";
      this.clearData();
      this.GetEdit(this.QuotationDocID);
    }
  }
  GetEdit(rowdata){
    this.EditList = [];
    const obj = {
      "SP_String": "SP_Quotation_Master",
      "Report_Name_String": "Retrieve_Quotation",
      "Json_Param_String": JSON.stringify([{Quotation_Doc_ID  : this.QuotationDocID}])
  
    }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      this.EditList = data;
      this.ObjEnginnerQuoation.Sub_Ledger_ID = data[0].Sub_Ledger_ID;
      this.GetLocation();
      this.ObjEnginnerQuoation.Quotation_Type = data[0].Quotation_Type;
      this.ObjEnginnerQuoation.Quotation_To_Company = data[0].Quotation_To_Company;

      data.forEach(element => {
        const  QuotObj = {
            Sub_Ledger_ID : element.Sub_Ledger_ID,
            Quotation_Type : element.Quotation_Type,
            Quotation_To_Company : element.Quotation_To_Company,
            Location_ID : element.Location_ID,
            Location_Name : element.Location_Name,
            Product_Mfg_Comp_ID : element.Product_Mfg_Comp_ID,
            Mfg_Company : element.Mfg_Company,
            Product_ID : element.Product_ID,
            Machine :  element.Machine,
            Spare_Parts_Product_ID : element.Spare_Parts_Product_ID,
            Spare_Part_Description : element.Spare_Part_Description,
            Qty : element.Qty,
            Rate : element.Rate,
            Total_Amount : element.Total_Amount,
            Discount : element.Discount,
            Discount_Type : element.Discount_Type,
            Discount_Amount : element.Discount_Amount,
            Taxable_Amount : element.Taxable_Amount,
            VAT : element.VAT,
            Net_Amt : element.Taxable_Amount,
            Quotation_Doc_ID : element.Quotation_Doc_ID
          };
    
          this.EngQuoationProductList.push(QuotObj);
        });
      // const editDataList = data[0];
      // this.ObjEnginnerQuoation = editDataList;
      // this.EngQuoationProductList.push(this.ObjEnginnerQuoation);
      // const PrevObj = {...this.ObjEnginnerQuoation};
      // this.ObjEnginnerQuoation = new EnginnerQuoation();
      // console.log('edit this.EngQuoationProductList',this.EngQuoationProductList)
      //const PrevObj = {...this.ObjEnginnerQuoation};
      //  this.ObjMachineMaster.Product_Model = data[0].Product_Code;
       //this.myDate = data[0].Date;
      //  this.ObjMachineMaster.Product_Description = data[0].Product_Description;
      //  this.ObjMachineMaster.Manufacturer = data[0].Product_Mfg_Comp_ID;
      //  this.GetManufacturer();
      // console.log("this.editList  ===",this.editList);

      // const editDataList = data[0];
      // this.ObjmasterProduct = editDataList;
      // this.ProductTypeChange(editDataList.Product_Type_ID);
      // this.ObjmasterProduct.Product_Sub_Type_ID = editDataList.Product_Sub_Type_ID;
      // console.log("ObjmasterProduct ===",this.ObjmasterProduct);
      // this.ObjmasterProduct.Product_ID = product_id;
      // console.log("this.ObjmasterProduct.Product_ID",this.ObjmasterProduct.Product_ID);
  
  })
  }
  onConfirm(){}
  onReject(){}

  // Customer Creation
  CreateCustomer(){
    this.CustomerCreatePopup = true;
  }
  SaveCustomer(){}

}
class SupportTicket{
  Call_Type:string;
  Customer_Name:string;
  Location:string;
  Machine_Manufacturer:string;
  Machine:string;
  Serial_No:any;
  Assigned_Engineer:string;
  Aligned_Engineer:string;
  Contract_Status:string;
  Symptom:any;
  Remarks:string
}
class Browse{
  Customer_Name:string;
  start_date : Date ;
  end_date : Date;
}
class EnginnerQuoation{
  Quotation_ID:string;
  Quotation_Doc_ID:Number;
  Sub_Ledger_ID:string;
  Quotation_Date:any;
  Quotation_Type:string;
  Quotation_To_Company:string;
  Product_Mfg_Comp_ID:String;
  Mfg_Company:String;
  Location_ID:String;
  Location_Name:String;
  Product_ID:String;
  Machine:String;
  Spare_Parts_Product_ID:string;
  Spare_Part_Description:String;
  Qty:Number;
  Rate:Number;
  Total_Amount:Number;
  Discount:String;
  Discount_Type:String;
  Discount_Amount:String;
  Taxable_Amount:String;
  //Vat_Tax:Number;
  VAT:Number;
  Net_Amt:Number;
  //Status:"ACTIVE"
}