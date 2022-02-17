import {
  Component,
  OnInit,
  ViewEncapsulation,
  ViewChild
} from '@angular/core';
import {
  HttpClient,
  HttpHeaders,
  HttpParams
} from "@angular/common/http";
import {
  CompacctCommonApi
} from "../../../../shared/compacct.services/common.api.service";
import {
  CompacctGlobalApiService
} from '../../../../shared/compacct.services/compacct.global.api.service';
import {
  CompacctHeader
} from "../../../../shared/compacct.services/common.header.service";
import {
  DateTimeConvertService
} from '../../../../shared/compacct.global/dateTime.service';
import {
  DateNepalConvertService
} from '../../../../shared/compacct.global/dateNepal.service';
import {
  MessageService
} from "primeng/api";
import {
  FileUpload
} from "primeng/primeng";
import {
  AnyTxtRecord
} from 'dns';
import {
  NonNullAssert
} from '@angular/compiler';
declare var NepaliFunctions: any;
const NepaliDate = require('nepali-date');
@Component({
  selector: 'app-engg-crm-installed-machine-service-contract',
  templateUrl: './engg-crm-installed-machine-service-contract.component.html',
  styleUrls: ['./engg-crm-installed-machine-service-contract.component.css'],
  providers: [MessageService],
  encapsulation: ViewEncapsulation.None
})
export class EnggCrmInstalledMachineServiceContractComponent implements OnInit {
  tabIndexToView = 0;
  url = window["config"];
  persons: [];
  buttonname = "Save";
  Spinner = false;
  seachSpinner = false;
  items = [];

  ObjServiceContract = new ServiceContract();
  ServiceContractFormSubmit = false;
  MfList = [];
  MachineList = [];
  SerialNoList = [];

  previouscontractList = [];
  PreviousContractPopup = false;
  precontractdisable = true;

  CustomerList = [];
  LoctionList = [];
  ServiceList = [];
  //ServiceStartDate = new Date();
  ServiceStartDate: any = {};
  ServiceEndDate: any = {};
  StatusList = [];
  PaymentDate: any = {};

  currentdate = new Date();
  ObjBrowse = new Browse();
  SearchFormSubmit = false;
  BrowseList = [];
  EditList = [];
  Contract_ID = undefined;
  browsestartdate: Date;
  CurrentDateNepal = undefined;
  // getdate: any;
  // memberid = undefined;
  // deluserid = undefined;
  // delmemberid = undefined;
  PDFViewFlag = false;
  PDFFlag = false;
  ProductPDFFile:any = {};
  ProductPDFLink = undefined;

  @ViewChild("fileInput", { static: false }) fileInput: FileUpload;


  constructor(
    private $http: HttpClient,
    private commonApi: CompacctCommonApi,
    private GlobalAPI: CompacctGlobalApiService,
    private Header: CompacctHeader,
    private compacctToast: MessageService,
    private DateService: DateTimeConvertService,
    private DateNepalConvertService : DateNepalConvertService
  ) {
   
    this.CurrentDateNepal = {...this.DateNepalConvertService.GetCurrentNepaliDate()};
    console.log(this.DateNepalConvertService.convertNepaliDateToEngDate(this.CurrentDateNepal))
  }

  ngOnInit() {
    this.items = ["BROWSE", "CREATE"];
    this.Header.pushHeader({
      Header: "Service Contract",
      Link: " Engineering CRM -> Master -> Service Contract"
    });
    this.ServiceStartDate = {...this.DateNepalConvertService.GetCurrentNepaliDate()};
    this.ServiceEndDate = {...this.DateNepalConvertService.GetCurrentNepaliDate()};
    this.PaymentDate = {...this.DateNepalConvertService.GetCurrentNepaliDate()};
    this.GetCustomer();
    //this.GetManufacturer();
    //this.GetSerialNo();
    this.gettypeofservice();
    this.getStatus();
  }
  // Clear & Tab
  TabClick(e) {
    this.tabIndexToView = e.index;
    this.items = ["BROWSE", "CREATE"];
    this.buttonname = "Save";
    this.clearData();
  }
  clearData() {
    this.Spinner = false;
    this.ObjServiceContract = new ServiceContract();
    this.ServiceContractFormSubmit = false;
    this.MfList = [];
    this.MachineList = [];
    this.LoctionList = [];
    this.SerialNoList = [];
    this.ServiceStartDate = {...this.DateNepalConvertService.GetCurrentNepaliDate()};
    this.ServiceEndDate = {...this.DateNepalConvertService.GetCurrentNepaliDate()};
    this.PaymentDate = {...this.DateNepalConvertService.GetCurrentNepaliDate()};
    // this.GetBrowseList();
    this.EditList = [];
    this.Contract_ID = undefined;
    this.previouscontractList = [];
    this.PDFViewFlag = false;
     if (this.PDFViewFlag === false) {
      this.fileInput.clear();
    }
  }
  GetCustomer() {
    const obj = {
      "SP_String": "SP_Engg_CRM_Installed_Machine_Service_Contract",
      "Report_Name_String": "Get_Customer"
    }
    this.GlobalAPI.getData(obj).subscribe((data: any) => {
      this.CustomerList = data;
      //console.log('CustomerList ==', this.CustomerList)

    });
  }
  GetLocation() {
    const TObj = {
      Sub_Ledger_ID: this.ObjServiceContract.Customer_Name
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
  GetManufacturer() {
    const Obj = {
      Sub_Ledger_ID: this.ObjServiceContract.Customer_Name,
      Location_ID: this.ObjServiceContract.Location
    }
    const obj = {
      "SP_String": "SP_Engg_CRM_Installed_Machine_Service_Contract",
      "Report_Name_String": "Get_Manufacturer",
      "Json_Param_String": JSON.stringify([Obj])
    }
    this.GlobalAPI.getData(obj).subscribe((data: any) => {
      this.MfList = data;
      // console.log('MfList ==', this.MfList)

    });
  }
  GetMachine() {
    const TObj = {
      Product_Mfg_Comp_ID: this.ObjServiceContract.Machine_Manufacturer,
      Sub_Ledger_ID: this.ObjServiceContract.Customer_Name,
      Location_ID: this.ObjServiceContract.Location
    }
    const obj = {
      "SP_String": "SP_Engg_CRM_Installed_Machine_Service_Contract",
      "Report_Name_String": "Get_Machine",
      "Json_Param_String": JSON.stringify([TObj])
    }
    this.GlobalAPI.getData(obj).subscribe((data: any) => {
      this.MachineList = data;
      // console.log('MachineList ==', this.MachineList)
    });
  }
  GetSerialNo() {
    const TObj = {
      Sub_Ledger_ID: this.ObjServiceContract.Customer_Name,
      Location_ID: this.ObjServiceContract.Location,
      Product_ID: this.ObjServiceContract.Machine
    }
    const obj = {
      "SP_String": "SP_Engg_CRM_Installed_Machine_Service_Contract",
      "Report_Name_String": "Get_Serial_NOs",
      "Json_Param_String": JSON.stringify([TObj])
    }
    this.GlobalAPI.getData(obj).subscribe((data: any) => {
      this.SerialNoList = data;
      // console.log('SerialNoList ==', this.SerialNoList)
      this.Getpreviouscontract();

    });
  }
  previouscontract() {
    this.PreviousContractPopup = true;
  }
  Getpreviouscontract() {
    this.previouscontractList = [];
    const TObj = {
      Product_Mfg_Comp_ID: this.ObjServiceContract.Machine_Manufacturer,
      Product_ID: this.ObjServiceContract.Machine,
      Serial_No: this.ObjServiceContract.Serial_No
    }
    const obj = {
      "SP_String": "SP_Engg_CRM_Installed_Machine_Service_Contract",
      "Report_Name_String": "Get_Previous_Contract",
      "Json_Param_String": JSON.stringify([TObj])
    }
    this.GlobalAPI.getData(obj).subscribe((data: any) => {
      this.previouscontractList = data;
      //this.PreviousContractPopup = true;
      // console.log('previouscontractList ==', this.previouscontractList)
      for(let i = 0; i < this.previouscontractList.length ; i++){
        this.previouscontractList[i]['Service_Start_Date'] = this.convertToNepaliDateObj(this.previouscontractList[i]['Service_Start_Date']);
        this.previouscontractList[i]['Service_End_Date'] = this.convertToNepaliDateObj(this.previouscontractList[i]['Service_End_Date']);
        this.previouscontractList[i]['Payment_Date'] = this.convertToNepaliDateObj(this.previouscontractList[i]['Payment_Date']);
       // console.log('Service_Start_Date==', this.BrowseList[i]['Service_Start_Date'])
     }  

    });
  }
  gettypeofservice() {
    //  console.log("ServiceList ===", this.ServiceList)
    this.ServiceList = [{
        Name: "AMC"
      },
      {
        Name: "Warranty"
      }
    ];

  }
  getStatus() {
    //  console.log("StatusList ===", this.StatusList)
    this.StatusList = [{
        Name: "Paid"
      },
      {
        Name: "Due"
      }
    ];

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
  ValidatedNepaliDate(dateObj) {
    const year = dateObj.year.toString().length == 1 ? "0" + dateObj.year : dateObj.year;
    const month = dateObj.month.toString().length == 1 ? "0" + dateObj.month : dateObj.month;
    const day = dateObj.day.toString().length == 1 ? "0" + dateObj.day : dateObj.day;
    return day + '/' + month + '/' + year
  }
  FetchPDFFile(event) {
    this.PDFFlag = false;
    this.ProductPDFFile = {};
    if (event) {
      this.ProductPDFFile = event.files[0];
      this.PDFFlag = true;
    }
  }
  SaveServiceContract(valid) {
    this.ServiceContractFormSubmit = true;
    this.Spinner = true;
    console.log(
      {
        Service_Start_Date:this.DateService.dateConvert(this.DateNepalConvertService.convertNepaliDateToEngDate(this.ServiceStartDate)),
        Service_End_Date: this.DateService.dateConvert(this.DateNepalConvertService.convertNepaliDateToEngDate(this.ServiceEndDate)),
        Payment_Date: this.DateService.dateConvert(this.DateNepalConvertService.convertNepaliDateToEngDate(this.PaymentDate)),
        Service_Start_Date_nepali : this.DateNepalConvertService.GetNepaliDateStr(this.ServiceStartDate),
        Service_End_Date_nepali : this.DateNepalConvertService.GetNepaliDateStr(this.ServiceEndDate),
        Payment_Date_nepali	 : this.DateNepalConvertService.GetNepaliDateStr(this.PaymentDate),
      }
    )
    if (valid && this.Contract_ID) {

    
      const Obj = {
        Contract_ID: this.Contract_ID,
        Sub_Ledger_ID: this.ObjServiceContract.Customer_Name,
        Location_ID: this.ObjServiceContract.Location,
        Product_Mfg_Comp_ID: this.ObjServiceContract.Machine_Manufacturer,
        Product_ID: this.ObjServiceContract.Machine,
        Serial_No: this.ObjServiceContract.Serial_No,
        Service_Type: this.ObjServiceContract.Type_of_Service,
        Payment_Status: this.ObjServiceContract.Payment_Status,
        Service_Start_Date:this.DateService.dateConvert(this.DateNepalConvertService.convertNepaliDateToEngDate(this.ServiceStartDate)),
        Service_End_Date: this.DateService.dateConvert(this.DateNepalConvertService.convertNepaliDateToEngDate(this.ServiceEndDate)),
        Payment_Date: this.DateService.dateConvert(this.DateNepalConvertService.convertNepaliDateToEngDate(this.PaymentDate)),
        Service_Start_Date_nepali : this.ValidatedNepaliDate(this.ServiceStartDate),
        Service_End_Date_nepali : this.ValidatedNepaliDate(this.ServiceEndDate),
        Payment_Date_nepali	 : this.ValidatedNepaliDate(this.PaymentDate),
      }
      const obj = {
        "SP_String": "SP_Engg_CRM_Installed_Machine_Service_Contract",
        "Report_Name_String": "Update_Engg_CRM_Installed_Machine_Service_Contract",
        "Json_Param_String": JSON.stringify([Obj])

      }
      this.GlobalAPI.postData(obj).subscribe((data: any) => {
        console.log(data);
        //var tempID = data[0].Column1;
        this.upload(data[0].Column1);
        if (data[0].Column1) {
          // this.compacctToast.clear();
          // //const mgs = this.buttonname === 'Save & Print Bill' ? "Created" : "updated";
          // this.compacctToast.add({
          //   key: "compacct-toast",
          //   severity: "success",
          //   summary: "Installed Machine",
          //   detail: "Succesfully Updated" //+ mgs
          // });
          this.clearData();
          this.GetSearchedList(true);
          this.Contract_ID = undefined;
          this.tabIndexToView = 0;
          this.items = ["BROWSE", "CREATE"];
          //  this.buttonname = "Save";
          // this.testchips =[];

        } else {
          // this.ngxService.stop();
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
      this.ServiceContractFormSubmit = true;
      this.Spinner = true;
      if (valid) {       
        const TempObj = {
          Sub_Ledger_ID: this.ObjServiceContract.Customer_Name,
          Location_ID: this.ObjServiceContract.Location,
          Product_Mfg_Comp_ID: this.ObjServiceContract.Machine_Manufacturer,
          Product_ID: this.ObjServiceContract.Machine,
          Serial_No: this.ObjServiceContract.Serial_No,
          Service_Type: this.ObjServiceContract.Type_of_Service,
          Payment_Status: this.ObjServiceContract.Payment_Status,
          Service_Start_Date:this.DateService.dateConvert(this.DateNepalConvertService.convertNepaliDateToEngDate(this.ServiceStartDate)),
          Service_End_Date: this.DateService.dateConvert(this.DateNepalConvertService.convertNepaliDateToEngDate(this.ServiceEndDate)),
          Payment_Date: this.DateService.dateConvert(this.DateNepalConvertService.convertNepaliDateToEngDate(this.PaymentDate)),
          Service_Start_Date_nepali : this.ValidatedNepaliDate(this.ServiceStartDate),
          Service_End_Date_nepali : this.ValidatedNepaliDate(this.ServiceEndDate),
          Payment_Date_nepali	 : this.ValidatedNepaliDate(this.PaymentDate),
        }
        const obj = {
          "SP_String": "SP_Engg_CRM_Installed_Machine_Service_Contract",
          "Report_Name_String": "Create_Engg_CRM_Installed_Machine_Service_Contract",
          "Json_Param_String": JSON.stringify([TempObj])
        }
        this.GlobalAPI.postData(obj).subscribe((data: any) => {
          console.log(data);
          var msg = data[0].Column1;
          if (data[0].Column1) {
            if (data[0].Column1 != "Already Exists") {
            this.upload(data[0].Column1);
            }
            else {
               this.compacctToast.clear();
               this.compacctToast.add({
               key: "compacct-toast",
               severity: "success",
               summary: "Installed Machine",
               detail: "Already Exists "
            });
            }
            // this.compacctToast.clear();
            // this.compacctToast.add({
            //   key: "compacct-toast",
            //   severity: "success",
            //   summary: "Installed Machine",
            //   detail: msg != "Already Exists" ? "Succesfully Saved" : "Already Exists"
            // });
            // if (msg != "Already Exists") {
            //   this.clearData();
            // }
            // this.ServiceContractFormSubmit = false;
            this.Spinner = false;
            // this.ObjServiceContract = new ServiceContract();
            // this.MachineList = [];
            // this.LoctionList = [];

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
    }
  }
  async upload(id){
    const formData: FormData = new FormData();
        formData.append("aFile", this.ProductPDFFile)
        formData.append("Contract_ID", id);
    let response = await fetch('/Engg_CRM_Installed_Machine_Service_Contract/Upload_Doc',{ 
                  method: 'POST',
                  body: formData // This is your file object
                });
    let responseText = await response.text();
    var msg = this.buttonname != "Create" ? "Succesfully Updated " : "Succesfully Created " ;
      this.Spinner = false;
      this.compacctToast.clear();
      this.compacctToast.add({
        key: "compacct-toast",
        severity: "success",
        summary: '',//'Return_ID : ' + this.ObjMasterProductm.Product_ID,
        detail: msg
      });
      // this.ObjManualPaymentCnfm = new ManualPaymentCnfm();
      // this.ManualPaymentConfirmFormSubmit = false;
      // this.ManualPaymentConfirmModal = false;
      this.clearData();
      if(this.buttonname != "Create") {
        this.clearData();
          this.GetSearchedList(true);
          this.Contract_ID = undefined;
          this.tabIndexToView = 0;
          this.items = ["BROWSE", "CREATE"];
      }
  };
  GetSearchedList(valid) {
    this.SearchFormSubmit = true;
    if (valid) {
      this.seachSpinner = true;
      const tempobj = {
        Sub_Ledger_ID: this.ObjBrowse.Customer_Name
      }
      const obj = {
        "SP_String": "SP_Engg_CRM_Installed_Machine_Service_Contract",
        "Report_Name_String": "Browse_Engg_CRM_Installed_Machine_Service_Contract",
        "Json_Param_String": JSON.stringify([tempobj])
      }
      this.GlobalAPI.getData(obj).subscribe((data: any) => {
        this.BrowseList = data;
        // console.log('Search list=====',this.BrowseList)
        this.seachSpinner = false;
        this.SearchFormSubmit = false;
        for(let i = 0; i < this.BrowseList.length ; i++){
           this.BrowseList[i]['Service_Start_Date'] = this.convertToNepaliDateObj(this.BrowseList[i]['Service_Start_Date']);
           this.BrowseList[i]['Service_End_Date'] = this.convertToNepaliDateObj(this.BrowseList[i]['Service_End_Date']);
           this.BrowseList[i]['Payment_Date'] = this.convertToNepaliDateObj(this.BrowseList[i]['Payment_Date']);
          // console.log('Service_Start_Date==', this.BrowseList[i]['Service_Start_Date'])
        }  
      })
    }
  }
  textcolor(col) {
    this.browsestartdate = new Date(col.Service_Start_Date);
    // this.getdate = this.DateService.dateConvert(new Date(this.currentdate));
    // console.log('browsestartdate==',this.browsestartdate.getDate())
    // console.log('currentdate===',this.currentdate.getDate())
    // console.log('browsestartdate==',this.browsestartdate.getMonth() + 1)
    // console.log('currentdate===',this.currentdate.getMonth() + 1)
    // console.log('browsestartdate==',this.browsestartdate.getFullYear())
    // console.log('currentdate===',this.currentdate.getFullYear())
    return this.browsestartdate < this.currentdate ? "text-red-active" : "";
    //  if (this.browsestartdate.getTime() < this.currentdate.getTime()) {
    //     return "text-red-active";
    //  }
  }
  Edit(edit) {
    this.clearData();
    if (edit.Contract_ID) {
      this.Contract_ID = edit.Contract_ID;
      this.tabIndexToView = 1;
      this.items = ["BROWSE", "UPDATE"];
      this.buttonname = "Update";
      const ObjT = {
        Contract_ID: this.Contract_ID
      }
      const obj = {
        "SP_String": "SP_Engg_CRM_Installed_Machine_Service_Contract",
        "Report_Name_String": "Get_Engg_CRM_Installed_Machine_Service_Contract",
        "Json_Param_String": JSON.stringify([ObjT])
      }
      this.GlobalAPI.getData(obj).subscribe((data: any) => {
        this.EditList = data;
        this.ObjServiceContract.Customer_Name = data[0].Sub_Ledger_ID;
        this.GetLocation();
        this.ObjServiceContract.Location = data[0].Location_ID;
        this.GetManufacturer();
        this.ObjServiceContract.Machine_Manufacturer = data[0].Product_Mfg_Comp_ID;
        this.GetMachine();
        this.ObjServiceContract.Machine = data[0].Product_ID;
        this.GetSerialNo();
        this.ObjServiceContract.Serial_No = data[0].Serial_No;
        this.ObjServiceContract.Type_of_Service = data[0].Service_Type;
        this.ServiceStartDate = this.DateNepalConvertService.convertEngDateToNepaliDateObj(data[0].Service_Start_Date);
        console.log('this.ServiceStartDate==', this.ServiceStartDate)
        this.ServiceEndDate = this.DateNepalConvertService.convertEngDateToNepaliDateObj(data[0].Service_End_Date);
        this.ObjServiceContract.Payment_Status = data[0].Payment_Status;
        this.PaymentDate = this.DateNepalConvertService.convertEngDateToNepaliDateObj(data[0].Payment_Date)
        console.log(data)
        console.log(this.ServiceStartDate)
        console.log(this.ServiceEndDate)
        console.log(this.PaymentDate)
        this.PDFViewFlag = data[0].Document_Upload ? true : false;
        this.ProductPDFLink = data[0].Document_Upload
         ? data[0].Document_Upload
         : undefined;
      })
    }
  }
  onConfirm() {}
  onReject() {}

}
class ServiceContract {
  Customer_Name: string;
  Location: string;
  Machine_Manufacturer: string;
  Machine: string;
  Serial_No: any;
  Type_of_Service: string;
  Payment_Status: string;
}
class Browse {
  Customer_Name: string;
}
