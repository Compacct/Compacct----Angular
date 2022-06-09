import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewEncapsulation , ElementRef, ViewChild} from '@angular/core';
import { MessageService } from 'primeng/api';
import { DateTimeConvertService } from '../../../../shared/compacct.global/dateTime.service';
import { CompacctCommonApi } from '../../../../shared/compacct.services/common.api.service';
import { CompacctHeader } from '../../../../shared/compacct.services/common.header.service';
import { CompacctGlobalApiService } from '../../../../shared/compacct.services/compacct.global.api.service';
declare var NepaliFunctions: any;
import { DateNepalConvertService } from '../../../../shared/compacct.global/dateNepal.service';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
const NepaliDate = require('nepali-date');
declare var $:any;

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
  LeadList = [];
  ManufactureList = [];
  InstallMachineList = [];
  SparePartsList =[];

  EngQuoationProductList = [];

  ObjBrowseQuotation = new BrowseQuotation();
  Browse_Sub_Ledger_ID : any;
  SearchFormSubmitted = false;

  QuotationDocID = undefined;
  CustomerCreatePopup = false;

  ObjLeadCreation = new LeadCreation();
  LeadcreateFormSubmitted = false;
  // Company_Name:any;
  // Address:any;
  @ViewChild("address", { static: false }) locationInput: ElementRef;
  Lead_Date : any = {};
  IndustryList = [];
  SourceList = [];
  AssignToList = [];
  ProductGrpList = [];
  BackupProductGrpList = [];
  ProductGrpFilter = [];
  SelectedProGrp = [];
  TProGrpList = [];
  existingname = undefined;
  SubjectList = [];
  CustomerBrowseList = [];
  LeadBrowseList = [];
  cols =[];
  Quodocid = undefined;
  emailmsg: any;
 

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
       this.GetManufactureList();
      // this.GetSerialNo();
       this.GetEngineer();
       this.GetContractStatus();
       this.GetSymptom();

       this.GetCustomer();
    this.QuoationDate = this.CurrentDateNepal;
    this.Lead_Date = this.CurrentDateNepal;
    this.ObjEnginnerQuoation.Quotation_From = "Customer";
    this.GetBrowseCustomer();
    this.ObjBrowseQuotation.Quotation_From = "CustomerBrowse";
    
       this.GetIndustry();
       this.GetSource();
       this.GetAssignTo();
       this.getProductGroup();
    this.ObjLeadCreation.Existing = "Other";
       this.existingchange();
       this.GetSubject();

       this.cols = [
        { field: 'Sub_Ledger_Name', header: 'Customer Name' },
        // { field: 'Org_Name', header: 'Lead Name' },
        { field: 'Quotation_Type', header: 'Quotation Type' },
        { field: 'Quotation_To_Company', header: 'Quotation To Company' },
        { field: 'Total_Taxable_Amount', header: 'Total Taxable Amount' },
        // { field: 'State', header: 'State' }
      ];

      this.ObjEnginnerQuoation.VAT = 13;
  }

  // CREATE CUSTOMER DROPDOWN
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
  // CREATE LEADE DROPDOWN
  GetLead(){
    const tobj = {
      User_ID: this.$CompacctAPI.CompacctCookies.User_ID
    }
    const obj = {
      "SP_String": "SP_New_Lead_Registration",
      "Report_Name_String": "Get_Leads_with_User_ID",
      "Json_Param_String": JSON.stringify([tobj])
     }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      data.forEach((obj)=>{
        obj.label = obj.Org_Name;
        obj.value = obj.Foot_Fall_ID;
      })
     this.LeadList = data;  
     console.log('this.CustomerList',this.CustomerList)
    });
  }
  radiochange(){
    if (this.ObjEnginnerQuoation.Quotation_From === "Customer") {
      this.GetCustomer();
    } else {
      this.GetLead();
    }
  }
  // BROWSE CUSTOMER DROPDOWN
  GetBrowseCustomer(){
    const obj = {
      "SP_String": "SP_Engg_CRM_Installed_Machine_Service_Contract",
      "Report_Name_String": "Get_Customer"
     }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      data.forEach((obj)=>{
        obj.label = obj.Sub_Ledger_Name;
        obj.value = obj.Sub_Ledger_ID;
      })
     this.CustomerBrowseList = data;  
    });
  }
  // BROWSE LEAD DROPDOWN
  GetBrowseLead(){
    const tobj = {
      User_ID: this.$CompacctAPI.CompacctCookies.User_ID
    }
    const obj = {
      "SP_String": "SP_New_Lead_Registration",
      "Report_Name_String": "Get_Leads_with_User_ID",
      "Json_Param_String": JSON.stringify([tobj])
     }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      data.forEach((obj)=>{
        obj.label = obj.Org_Name;
        obj.value = obj.Foot_Fall_ID;
      })
     this.LeadBrowseList = data;  
     console.log('this.CustomerList',this.CustomerList)
    });
  }
  radiobrowsechange(){
    if (this.ObjBrowseQuotation.Quotation_From === "CustomerBrowse") {
      this.GetBrowseCustomer();
      this.BrowseList = [];
      this.cols = [
        { field: 'Sub_Ledger_Name', header: 'Customer Name' },
        // { field: 'Org_Name', header: 'Lead Name' },
        { field: 'Quotation_Type', header: 'Quotation Type' },
        { field: 'Quotation_To_Company', header: 'Quotation To Company' },
        { field: 'Total_Taxable_Amount', header: 'Total Taxable Amount' },
        // { field: 'State', header: 'State' }
      ];
    } else {
      this.GetBrowseLead();
      this.BrowseList = [];
      this.cols = [
        // { field: 'Sub_Ledger_Name', header: 'Customer Name' },
        { field: 'Org_Name', header: 'Lead Name' },
        { field: 'Quotation_Type', header: 'Quotation Type' },
        { field: 'Quotation_To_Company', header: 'Quotation To Company' },
        { field: 'Total_Taxable_Amount', header: 'Total Taxable Amount' },
        // { field: 'State', header: 'State' }
      ];
    }
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
    // this.ObjEnginnerQuoation.VAT = 0;
    this.ObjEnginnerQuoation.Net_Amt = undefined;
    if(this.ObjEnginnerQuoation.Product_ID) {
      const TempArr = $.grep(this.InstallMachineList,(arr)=>{ return arr.Product_ID === this.ObjEnginnerQuoation.Product_ID});
      this.ObjEnginnerQuoation.Machine = TempArr.length ? TempArr[0].Machine : undefined;
      this.GetSpareParts();
      if(this.ObjEnginnerQuoation.Quotation_Type != "Spare") {
      this.ObjEnginnerQuoation.Rate = TempArr.length ? TempArr[0].Sale_rate : undefined;
      }
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
      this.ObjEnginnerQuoation.Foot_Fall_ID = PrevObj.Foot_Fall_ID;
      this.ObjEnginnerQuoation.Quotation_Type = PrevObj.Quotation_Type;
      this.ObjEnginnerQuoation.Quotation_To_Company = PrevObj.Quotation_To_Company;
      this.ObjEnginnerQuoation.Quotation_From = PrevObj.Quotation_From;
      this.ObjEnginnerQuoation.VAT = PrevObj.VAT;
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
    // this.ObjEnginnerQuoation.VAT = this.ObjEnginnerQuoation.VAT ? this.ObjEnginnerQuoation.VAT : 0;
    // this.ObjEnginnerQuoation.Taxable = this.ObjEnginnerQuoation.Taxable === "Taxable" ? 13 : 0;
    // if(this.ObjEnginnerQuoation.Taxable_Amount) {
    //   const percenAmt = ( Number(this.ObjEnginnerQuoation.Taxable) / 100) * Number(this.ObjEnginnerQuoation.Taxable_Amount);
    //   this.ObjEnginnerQuoation.Net_Amt = Number(this.ObjEnginnerQuoation.Taxable_Amount) + percenAmt;
    // }
    if (this.ObjEnginnerQuoation.VAT == 13) {
      if(this.ObjEnginnerQuoation.Taxable_Amount) {
        const percenAmt = ( 13 / 100) * Number(this.ObjEnginnerQuoation.Taxable_Amount);
        this.ObjEnginnerQuoation.Net_Amt = Number(this.ObjEnginnerQuoation.Taxable_Amount) + percenAmt;
      }
    }
    else {
      if(this.ObjEnginnerQuoation.Taxable_Amount) {
        const percenAmt = ( 0 / 100) * Number(this.ObjEnginnerQuoation.Taxable_Amount);
        this.ObjEnginnerQuoation.Net_Amt = Number(this.ObjEnginnerQuoation.Taxable_Amount) + percenAmt;
      }
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
    this.ObjEnginnerQuoation.Quotation_From = "Customer";
    this.ObjEnginnerQuoation.VAT = 13;
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
        this.ObjEnginnerQuoation.Sub_Ledger_ID = this.ObjEnginnerQuoation.Sub_Ledger_ID ? this.ObjEnginnerQuoation.Sub_Ledger_ID : 0;
        this.ObjEnginnerQuoation.Foot_Fall_ID = this.ObjEnginnerQuoation.Foot_Fall_ID ? this.ObjEnginnerQuoation.Foot_Fall_ID : 0;
        const obj = {
          "SP_String": "SP_Quotation_Master",
          "Report_Name_String": "Create_Edit_Quotation",
          "Json_Param_String": JSON.stringify(this.EngQuoationProductList)
        }
        this.GlobalAPI.postData(obj).subscribe((data: any) => {
          console.log(data);
          //var msg = data[0].Column1;
          this.Quodocid = data[0].Column1;
          if (data[0].Column1) {
            this.SendEmail();
            this.compacctToast.clear();
            this.compacctToast.add({
              key: "compacct-toast",
              severity: "success",
              summary: "Engineering Quotation",
              detail: this.buttonname != "Save" ? "Succesfully Updated" : "Succesfully Saved"
            });
              this.clearData();
              this.ObjEnginnerQuoation.Quotation_From = "Customer";
              this.GetSearchedList(true)
              this.Spinner = false;
              if (this.buttonname != "Save"){
                this.clearData();
                this.ObjEnginnerQuoation.Quotation_From = "Customer";
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
  SendEmail() {
      const QuertString = '?Quotation_Doc_ID=' + this.Quodocid;
      this.$http.get('/BL_CRM_Engineering_Quotation_Nepal/Send_Email_Quotation'+QuertString).subscribe((data: any) => {
        // this.DueCustomerList = data ? JSON.parse(data) : [];
        // this.emailmsg = data;
        this.Quodocid = undefined;
        // console.log(this.emailmsg);
      });
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
        Sub_Ledger_ID: this.ObjBrowseQuotation.Sub_Ledger_ID ? this.ObjBrowseQuotation.Sub_Ledger_ID : 0,
        // Start_Date : this.DateService.dateConvert(this.DateNepalConvertService.convertNepaliDateToEngDate(this.BrowseStartDate)),
        // End_Date : this.DateService.dateConvert(this.DateNepalConvertService.convertNepaliDateToEngDate(this.BrowseEndDate)),
      }
      const leadobj = {
        Foot_Fall_ID: this.ObjBrowseQuotation.Foot_Fall_ID ? this.ObjBrowseQuotation.Foot_Fall_ID : 0,
        // Start_Date : this.DateService.dateConvert(this.DateNepalConvertService.convertNepaliDateToEngDate(this.BrowseStartDate)),
        // End_Date : this.DateService.dateConvert(this.DateNepalConvertService.convertNepaliDateToEngDate(this.BrowseEndDate)),
      }
      const obj = {
        "SP_String": "SP_Quotation_Master",
        "Report_Name_String": this.ObjBrowseQuotation.Quotation_From === "CustomerBrowse" ? "Get_Quotation" : "Get_Quotation_Foot_Fall_ID",
        "Json_Param_String": this.ObjBrowseQuotation.Quotation_From === "CustomerBrowse" ? JSON.stringify([tempobj]) : JSON.stringify([leadobj])
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
  Print(obj) {
    if (obj.Quotation_Doc_ID) {
      
        let Quotation_Doc_ID = obj.Quotation_Doc_ID
        let Sub_Ledger_ID = this.ObjBrowseQuotation.Sub_Ledger_ID ? this.ObjBrowseQuotation.Sub_Ledger_ID : 0
        let Foot_Fall_ID = this.ObjBrowseQuotation.Foot_Fall_ID ? this.ObjBrowseQuotation.Foot_Fall_ID : 0
      
      window.open("/Report/Crystal_Files/Nepal/Quotation_Print_New.aspx?Quotation_Doc_ID="+Quotation_Doc_ID+"&Sub_Ledger_ID="+Sub_Ledger_ID+"&Foot_Fall_ID="+Foot_Fall_ID, 'mywindow', 'fullscreen=yes, scrollbars=auto,width=950,height=500'
  
      );
    }
  }
  EmailBrowse(quotid){
    const QuertString = '?Quotation_Doc_ID=' + quotid.Quotation_Doc_ID;
      this.$http.get('/BL_CRM_Engineering_Quotation_Nepal/Send_Email_Quotation'+QuertString).subscribe((data: any) => {
        // this.DueCustomerList = data ? JSON.parse(data) : [];
        // this.emailmsg = data;
        // this.Quodocid = undefined;
        console.log('email',true);
      });
  }
  onConfirm(){}
  onReject(){}

  // Lead Creation
  CreateCustomer(){
    this.LeadcreateFormSubmitted = false;
    this.ObjLeadCreation = new LeadCreation();
    this.Lead_Date = this.CurrentDateNepal;
    this.ObjLeadCreation.Existing = "Other";
    this.existingchange();
    this.CustomerCreatePopup = true;
  }
  getAddressOnChange(e) {
    this.ObjLeadCreation.Address = undefined;
    if (e) {
      this.ObjLeadCreation.Address = e;
    }
  }
  GetIndustry() {
    this.$http.get("/DIPL_CRM_Lead/Get_Customer_Type").subscribe((data: any) => {
      this.IndustryList = data ? data : [];
    });
  }
  GetSource() {
    this.$http.get("/DIPL_CRM_Lead/Get_Enq_Source").subscribe((data: any) => {
      this.SourceList = data ? data : [];
    });
  }
  GetAssignTo() {
    this.$http.get("/BL_CRM_Master_SalesTeam/Get_Sales_Man_for_napal").subscribe((data: any) => {
      this.AssignToList = data ? data : [];
    });
  }
  getProductGroup(){
    this.$http.get("/Master_Product_Type/Master_Product_Type_Browse").subscribe((data: any) => {
      // this.ProductGrpList = data ? data : [];
      data = JSON.parse(data);
      if(data.length) {
        data.forEach(element => {
          element['label'] = element.Product_Type,
          element['value'] = element.Product_Type_ID
        });
        this.ProductGrpList = data;
      } else {
        this.ProductGrpList = data ? data : [];
  
       }
       console.log("this.ProductGrpList======",this.ProductGrpList);
      // this.BackupProductGrpList = data;
      // this.GetProductGrpdist();
    });
  }
  // GetProductGrpdist(){
  //   let DProGrp = [];
  //   this.ProductGrpFilter = [];
  //   this.SelectedProGrp = [];
  //   this.ProductGrpList.forEach((item) => {
  //     if (DProGrp.indexOf(item.Product_Type_ID) === -1) {
  //       DProGrp.push(item.Product_Type_ID);
  //       this.ProductGrpFilter.push({ label: item.Product_Type, value: item.Product_Type_ID });
  //       console.log("this.IndentFilter", this.ProductGrpFilter);
  //     }
  //   });
  //   this.BackupProductGrpList = [...this.ProductGrpList];
  // }
  // filterProGrpList() {
    //console.log("SelectedTimeRange", this.SelectedTimeRange);
    // let DProGrp = [];
    // this.TProGrpList = [];
    //const temparr = this.ProductionlList.filter((item)=> item.Qty);
    // if(!this.editList.length){
    //   this.BackUpProductionlList =[];
    // this.ProductionlList = [];
    //   this.GetProductionpro();
    //   }
    // if (this.SelectedProGrp.length) {
    //   this.TProGrpList.push('Req_No');
    //   DProGrp = this.SelectedProGrp;
    // }
    // if(this.editList.length) {
      // this.ProductionlList = [];
      // if (this.TProGrpList.length) {
      //   let LeadArr = this.BackupProductGrpList.filter(function (e) {
      //     return (DProGrp.length ? DProGrp.includes(e['Req_No']) : true)
      //   });
      //   this.ProductionlList = LeadArr.length ? LeadArr : [];
      // } else {
      //   this.ProductionlList = [...this.BackupProductGrpList];
      //   console.log("else Get indent list", this.IndentNoList)
      // }
    // }


  // }
  existingchange(){
    this.existingname = undefined;
    if(this.ObjLeadCreation.Existing) {
    this.existingname = this.ObjLeadCreation.Existing;
    }
  }
  letterOnly(event) {//: Boolean{
    // const charCode = (event.which) ? event.which : event.keyCode;
    // allow letters only.
    // if ((charCode < 65 || charCode > 90) && (charCode < 97 || charCode > 122)) {
    //   return false;
    // }
    // return true;
    var userGetData = event.which;
        // allow letters and whitespaces only.
        if(!(userGetData >= 65 && userGetData <= 120) && (userGetData != 32 && userGetData != 0)) { 
            event.preventDefault(); 
        }
  }
  GetSubject(){
    const obj = {
      "SP_String": "SP_New_Lead_Registration",
      "Report_Name_String": "Get_Lead_Task_Subjects",
      //"Json_Param_String": JSON.stringify([TObj])
     }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
     this.SubjectList = data;
    console.log('SubjectList ==', this.SubjectList)
  
    });
  }
  SaveLeadCreation(valid){
    this.LeadcreateFormSubmitted = true;
      // const Obj = {
      //   Mfg_Company : this.spManufacturerName
      // }
      this.ObjLeadCreation.Cost_Cen_ID = this.$CompacctAPI.CompacctCookies.Cost_Cen_ID;
      this.ObjLeadCreation.User_ID = this.$CompacctAPI.CompacctCookies.User_ID;
      this.ObjLeadCreation.Lead_Date = this.DateService.dateConvert(this.DateNepalConvertService.convertNepaliDateToEngDate(this.Lead_Date));
      this.ObjLeadCreation.Product_Type_IDs = this.ObjLeadCreation.Product_Type_IDs ? this.ObjLeadCreation.Product_Type_IDs.toString() : undefined;
      if(valid){
         const obj = {
           "SP_String": "SP_New_Lead_Registration",
           "Report_Name_String" : "New Lead Create",
           "Json_Param_String": JSON.stringify(this.ObjLeadCreation)
       
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
             summary: "Return_ID  " + tempID,
             detail: "Succesfully Saved" //+ mgs
           });
           this.LeadcreateFormSubmitted = false;
           this.ObjLeadCreation = new LeadCreation();
           this.Lead_Date = this.CurrentDateNepal;
           this.ObjLeadCreation.Existing = "Other";
           this.existingchange();
           this.GetLead()
          //  this.spManufacturerName = undefined;
          //  this.MfCreateModal = false;
          //  this.GetManufacturer();
           // this.clearData();
            // this.testchips =[];
       
           } else{
            // this.ngxService.stop();
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
  }

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
class BrowseQuotation{
  Quotation_From:string;
  Sub_Ledger_ID:Number;
  Foot_Fall_ID:Number;
}
class EnginnerQuoation{
  Quotation_From:string;
  Quotation_ID:string;
  Quotation_Doc_ID:Number;
  Sub_Ledger_ID:Number;
  Foot_Fall_ID:Number;
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
class LeadCreation {
  Foot_Fall_ID:number;
  Cost_Cen_ID:number;
  Sub_Ledger_ID:number;
  Org_Name:string;
  Address:any;
  Landmark:string;
  Country: "Nepal";
  User_ID:number;
  Sub_Ledger_ID_Ref:number;
  Lead_Priority:string;
  Sub_Ledger_Cat_ID:string; // industry
  Recd_Media: "Visit";
  Lead_Date:any;
  Enq_Source_ID:string;
  Website:string;
  Social_FaceBook_Link:string;
  Social_Instagram_Link:string;
  Social_Linkedin_Link:string;
  Contact_Name:string;
  Desig:string;
  Mobile:number;
  Email:string;
  Land_Line:number;
  Phone:number;
  Status: "Prospecting";
  Sub_Dept_ID:number;
  Sent_To: 0;
  Assign_To:string;
  Product_Type_IDs:string;
  Existing:string;
  Existing_Name:string;
  Competition_Activity:string;
  // Is_Visiable: "Y";
  //  Subject_ID : 2
}