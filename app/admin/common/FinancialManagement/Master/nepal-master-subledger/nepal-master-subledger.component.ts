import { HttpClient, HttpParams } from '@angular/common/http';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MessageService } from 'primeng/api';
import { DateTimeConvertService } from '../../../../shared/compacct.global/dateTime.service';
import { CompacctCommonApi } from '../../../../shared/compacct.services/common.api.service';
import { CompacctHeader } from '../../../../shared/compacct.services/common.header.service';
import { CompacctGlobalApiService } from '../../../../shared/compacct.services/compacct.global.api.service';
import { NgxUiLoaderService } from "ngx-ui-loader";
@Component({
  selector: 'app-nepal-master-subledger',
  templateUrl: './nepal-master-subledger.component.html',
  styleUrls: ['./nepal-master-subledger.component.css'],
  providers: [MessageService],
  encapsulation: ViewEncapsulation.None
})
export class NepalMasterSubledgerComponent implements OnInit {
  urlService = window["config"];
  tabIndexToView = 0;
  items = [];
  seachSpinner = false;
  saveSpinner = false;
  buttonName = 'Create';

  SubLedgerList = [];
  SubledgerSubmitted = false;

  ContactList = [];
  SubledgerContactPersonSubmitted = false;
  AdressList = [];
  SubledgerAddressSubmitted= false;
  DublicateSubLedgerList = [];
  ExistingSubledgersModalFlag = false;

  ObjSubLedgerVdetails:any = {};
  SubledgerModalFlag = false;

  ObjSubledger = new Subledger();
  PDFFlag = false;
  PDFViewFlag = false;
  ProductPDFLink = undefined;
  ProductPDFFile:any = {};

  // Input falg
  batchCodeAccess = false;

  SelectedSubledgerCategory = [];
  SelectedTagLedger =[];

  LedgerList = [];
  UserList = [];
  SalesmanList = [];
  CustomerRouteList = [];
  SubledgerClassList = [];
  ParentSubledgerList = [];
  EnqSrcList = [];
  CountryList = [];
  StateList = [];
  DistrictList =[];
  SubledgerCategoryList = [];
  constructor(private $http: HttpClient,
    private Header: CompacctHeader,
    public $CompacctAPI: CompacctCommonApi,
    private GlobalAPI: CompacctGlobalApiService,
    private DateService: DateTimeConvertService,
    private compacctToast: MessageService,
    private ngxService: NgxUiLoaderService) { }

  ngOnInit() {
    this.items = ["BROWSE", "CREATE"];
    this.Header.pushHeader({
      Header: "Master Sub Ledger",
      Link: "Financial Management --> Master -> Master Sub Ledger"
    });
    this.GetUserList();
    this.GetLedgerList();
    this.GetSalesmanList();
    this.GetCustomerRouteList();
    this.GetSubledgerClassList();
    this.GetParentSubledgerList();
    this.GetCountryList();
    this.GetEnqSrcList();  
    this.GetSubLedgerList();
    this.GetState();
  }
  TabClick(e){
    this.ClearData();
    this.buttonName = 'Create';
  }
  ClearData(){
    this.PDFFlag = false;
    this.ProductPDFFile = {};
    this.SubledgerSubmitted = false;
    this.SubledgerContactPersonSubmitted = false;
    this.SubledgerAddressSubmitted= false;
    this.ObjSubledger = new Subledger();
    this.saveSpinner = false;
  }
  // Init Data --
  GetLedgerList() {
    this.LedgerList = [];
    this.$http.get('/Common/Get_Acc_Ledger_List_With_Subledger').subscribe((data: any) => {
      const resDta = data.length ? data : [];
      resDta.forEach(el => {
        el.label=el.Ledger_Name;
        el.value= el.Ledger_ID;
      });
      this.LedgerList = resDta;
    });
  }
  GetUserList() {
    this.UserList = [];
    this.$http.get(this.urlService.apiGetUserLists).subscribe((data: any) => {
      const resDta = data.length ? data : [];
      resDta.forEach(el => {
        el.label=el.Name;
        el.value= el.User_ID;
      });
      this.UserList = resDta;
    });
  }
  GetSalesmanList() {
    this.SalesmanList = [];
    this.$http.get(this.urlService.apiGetSalesManList).subscribe((data: any) => {
      const resDta = data.length ? data : [];
      resDta.forEach(el => {
        el.label=el.Member_Name;
        el.value= el.Sales_Man_ID;
      });
      this.SalesmanList = resDta;
    });
  }
  GetCustomerRouteList() {
    this.CustomerRouteList = [];
    this.$http.get('/Customer_Route/Customer_Route_Browse').subscribe((data: any) => {
      this.CustomerRouteList =  data ? JSON.parse(data) : [];
    });
  }
  GetSubledgerClassList() {
    this.SubledgerClassList = [];
    this.$http.get('/Master_Acctonting_Subledger/Get_Sub_Ledger_Class').subscribe((data: any) => {
      const resDta = data ? JSON.parse(data) : [];
      resDta.forEach(el => {
        el.label=el.Sub_Ledger_Class;
        el.value= el.Sub_Ledger_Class_ID;
      });
      this.SubledgerClassList = resDta;
    });
  }
  GetParentSubledgerList() {
    this.ParentSubledgerList = [];
    this.$http.get('/Master_Acctonting_Subledger/GetAllData').subscribe((data: any) => {
      const resDta =  data ? JSON.parse(data) : [];
      resDta.forEach(el => {
        el.label=el.Sub_Ledger_Name;
        el.value= el.Sub_Ledger_ID;
      });
      this.ParentSubledgerList = resDta;
    });
  }
  GetCountryList() {
    this.CountryList = [];
    this.$http.get('/Common/Get_Country_List').subscribe((data: any) => {
      const resDta = data ? JSON.parse(data) : [];
      this.CountryList = resDta;
    });
  }
  GetEnqSrcList() {
    this.EnqSrcList = [];
    this.$http.get(this.urlService.apiGetEnquerySource).subscribe((data: any) => {
      const resDta = data.length ? data : [];
      this.EnqSrcList = resDta;
    });
  }
  GetState() {
    this.$http.get(this.urlService.apiGetState).subscribe((data: any) => {
      this.StateList = data ?  data : [];
    });
  }

  //Subledger Create Change Evnt
  batchCodeEnableDisable(id){
    if (id) {
      const v = this.LedgerList.filter(value => Number(value.Ledger_ID) === Number(id));
      if (v[0].Accounting_Group_ID == 11) {
          this.batchCodeAccess = false;
      }else {
          this.ObjSubledger.Batch_Code = "";
          this.batchCodeAccess = true;
      }
    }
  }
  SubledgerNameChange(name) {
    this.DublicateSubLedgerList = [];
    if(name) {
      this.$http.get(this.urlService.apiGetSubLedgerSoundLike+'?Sub_Ledger_Name='+name).subscribe((data: any) => {
        this.DublicateSubLedgerList = data ? JSON.parse(data) : [];
        this.ExistingSubledgersModalFlag = true;
      });
    }
  }
  changeSubledgerType(){
    this.SubledgerCategoryList =[];
    this.SelectedSubledgerCategory =[];
    if(this.ObjSubledger.Subledger_Type){
      this.GetSubLedgerCategoryNameList(this.ObjSubledger.Subledger_Type);
    }
  }
  GetSubLedgerCategoryNameList(name) {
    this.SubledgerCategoryList =[];
    if(name) {
      this.$http.get('/Master_Acctonting_Subledger/Get_Sub_Ledger_Cat_Name_List?cat_type='+name).subscribe((data: any) => {
        const resDta = data ? JSON.parse(data) : [];
        resDta.forEach(el => {
          el.label=el.Sub_Ledger_Cat_Name;
          el.value= el.Sub_Ledger_Cat_ID;
        });
        this.SubledgerCategoryList = resDta;
      });
    }
  }
  ChangeCustomerRoute(){
    if (this.ObjSubledger.Route_ID && this.ObjSubledger.Weekly_Closing) {
      const temp = this.CustomerRouteList.filter(obj => Number(obj.Route_ID) == Number(this.ObjSubledger.Route_ID))[0];
      if (this.ObjSubledger.Weekly_Closing !== temp.Route_Weekly_Off) {
        this.compacctToast.clear();
          this.compacctToast.add({
            key: "compacct-toast",
            severity: "error",
            summary: "Warn Message",
            detail: "Route closing and Customer closing day not matching "
          });
      }
    } else {
        if (this.ObjSubledger.Route_ID) {
            const temp = this.CustomerRouteList.filter(obj => Number(obj.Route_ID) == Number(this.ObjSubledger.Route_ID))[0];
            this.ObjSubledger.Weekly_Closing = temp.Route_Weekly_Off;
        }
    }
  }
  onCountryChange (country) {
    this.ObjSubledger.Export_Domestic = 'Domestic';
    if (country) {
      this.ObjSubledger.Export_Domestic = country == 'India' ?'Domestic' : 'Export';
    }
  }
  GetDistrict (stateparm) {
    this.DistrictList = [];
    if (stateparm) {
      const obj = new HttpParams()
      .set('StateName', stateparm);
      this.$http.get(this.urlService.apiGetDistrict, {params : obj} ).subscribe((data: any) => {
        this.DistrictList = data ? data : [];
      });
    }
  }
  GetStateDistrict (PinParam) {
    this.DistrictList = [];
    this.ObjSubledger.State = undefined;
    this.ObjSubledger.District = undefined;
    if (PinParam && Number(PinParam.length) === 6) {
      const obj = new HttpParams()
      .set('PINCODE', PinParam);
      this.$http.get(this.urlService.apiGetStateDistrict, {params : obj} ).subscribe((data: any) => {
        if (data.PIN) {
        this.DistrictList = data ? data : [];
        this.ObjSubledger.State = data.State;
        this.GetDistrict(data.State);
        this.ObjSubledger.District = data.District;
        }
      });
    }
  }
  // Details Modal Change event
  changeAddressActiveDeactive (TxnID, SubLedgerID, Active) {
    var obj = {
        'Txn_ID': TxnID,
        'Sub_Ledger_ID': SubLedgerID,
        'Active': Active
    }
    this.$http.post("/Master_Acctonting_Subledger/Update_Active", obj).subscribe((data: any) => {
      console.log(data)
        if (data.success==true) {
            this.GetContactList();
        }
    });
  }

  GetSubLedgerList(){
    this.ngxService.start();
    this.seachSpinner = true;
    this.SubLedgerList = [];
    var obj = { 'ledgerids': 'All' };
    this.$http.get(this.urlService.apiGetAllDataMasterAccountingSubledger+'?ledgerids=All').subscribe((data: any) => {
      this.SubLedgerList = data ? JSON.parse(data) : [];
      this.ngxService.stop();
      this.seachSpinner = false;
    });
  }


  // OPEN MODAL
  ShowSubledgerAddCntModal(obj) {
    this.SubledgerContactPersonSubmitted = false;
    this.SubledgerAddressSubmitted= false;
    this.ContactList = [];
    this.AdressList = [];
    this.ObjSubLedgerVdetails = {};
    if(obj.Sub_Ledger_ID){
      this.ObjSubLedgerVdetails = obj;
      this.SubledgerModalFlag = true;
    }
  }
  GetContactList(){
    this.ContactList = [];
    this.$http.get("/Master_Acctonting_Subledger/Update_Active").subscribe((data: any) => {
      console.log(data)
    });
  }
  GetAdressList(){
    this.AdressList = [];
    this.$http.get("/Master_Acctonting_Subledger/Update_Active").subscribe((data: any) => {
      console.log(data)
    });
  }

  //VISTING CARD
  FetchPDFFile(event) {
    this.PDFFlag = false;
    this.ProductPDFFile = {};
    if (event) {
      this.ProductPDFFile = event.files[0];
      this.PDFFlag = true;
    }
  }
  async upload(id){
    const formData: FormData = new FormData();
        formData.append("file", this.ProductPDFFile);
    let response = await fetch('https://tutopiafilestorage.azurewebsites.net/api/Manual_Payment_Update?code=NNuTlQBwbP5UMBVVX8eD6x8do/WNOEIbHdwZVwu/bSulcefirS3Siw==&ConTyp='+this.ProductPDFFile['type']+'&ext='+this.ProductPDFFile['name'].split('.').pop()+'&pgid='+id,{ 
                  method: 'POST',
                  body: formData // This is your file object
                });
    let responseText = await response.text();
    console.log(responseText)
  };

  // SAVE 
  SaveSubLedger(valid) {
    this.SubledgerSubmitted = true;
    if(valid && this.SelectedSubledgerCategory.length) {
      this.ObjSubledger.Sub_Ledger_Cat_ID = this.SelectedSubledgerCategory.toString();
      console.log(this.ObjSubledger);
      const obj = {
        "SP_String": "SP_Create_Subledger_New",
        "Report_Name_String": this.ObjSubledger.Sub_Ledger_ID ? "Edit_Subledger" : "Create_Subledger",
        "Json_Param_String": JSON.stringify([this.ObjSubledger])
      }
      this.GlobalAPI.postData(obj).subscribe((data) => {
          if (data[0].Column1) {
            this.saveTagLedger(data[0].Column1);
            this.compacctToast.clear();
            this.compacctToast.add({
              key: "compacct-toast",
              severity: "success",
              summary: 'Subledger ID : ' + data[0].Column1,
              detail: "Succesfully Created."
            });
            this.ClearData();
            this.GetSubLedgerList();
        } else {
            this.compacctToast.clear();
            this.compacctToast.add({
              key: "compacct-toast",
              severity: "error",
              summary: "error",
              detail: "Error Occured"
            });
        }
        });
    }
  }
  saveTagLedger(subLedgerId) {
    if (this.SelectedTagLedger.length) {
        let tagLedgerList = [];
        for (let i = 0; i < this.SelectedTagLedger.length; i++) {
            tagLedgerList.push({ "Sub_Ledger_ID": subLedgerId, "Ledger_ID": this.SelectedTagLedger[i]})
        }   
        this.$http.post("/Master_Accounting_Sub_Ledger_Taged_Ledger/Insert_Ledger_ID",{ Sub_Ledger_Taged_Ledger_String: JSON.stringify(tagLedgerList)}).subscribe((data) => {
            console.log(data)                 
        });
    }
  
  }
  // EDIT
  EditSubledger(id) {
    if(id) {
      const obj = {
        "SP_String": "SP_Create_Subledger_New",
        "Report_Name_String": "Get_Subledger_Individual",
        "Json_Param_String": JSON.stringify([{'Sub_Ledger_ID' : id}])
      }
      this.GlobalAPI.postData(obj).subscribe((data) => {
        console.log(data[0])
        this.ObjSubledger = data[0];
        console.log(this.ObjSubledger)
        setTimeout(()=>{
          this.tabIndexToView = 1;
          this.buttonName = 'Update';
        },400)
      });
    }
  }
}
class Subledger{
  Address_1:String;
  Address_2:String;
  Address_3:String;
  Billing_Name:String;

  CR_Days:String;
  CR_Limit:String;
  CST_No:String;
  Country:String;
  District:String;
  EXID_NO:String;
  Email:String;
  Land_Mark:String;
  Ledger_ID:String;

  Mobile_No:String;
  Parent_Sub_Ledger_ID:String;
  PAN_No:String;
  Phone:String;
  Pin:String;
  SERV_REG_NO:String;
  Sales_Man_ID:String;
  State:String;

  Sub_Ledger_Cat_ID:String;
  Sub_Ledger_ID:String;
  Sub_Ledger_Name:String;
  TIN_No:String;
  UID_NO:String;
  User_ID:String;
  GST:String;
  Batch_Code:String;
  IS_SEZ:String;
  KYC_ID:String;
  Recurring_Order_Days:String;
  Brand:String;
  Website:String;
  Vcard:String;
  Amount_Business_Expected:String;
  PerYear_Onetime:String;
  Special_Note:String;
  Client_Brief_Description:String;
  Remarks:String;
  Composite_GST:String;
  Subledger_Type :String;
  Export_Domestic:String;
  FSSAI_No:String;
  WORLD_WIDE_REGION:String;
  Enq_Source_ID:String;
  TDS_Deduction:String;
  CIRCLE:String;

  Is_Sale_Bill_Enabled:String;
  Is_Purchase_Bill_Enabled:String;
  Is_Payment_Enabled:String;
  Is_Reciept_Enabled:String;
  Is_Journal_Enabled:String;
  Is_CR_Note_Enabled:String;
  Is_DR_Enabled:String;
  Is_Adj_Enabled:String;
  Route_ID:String;
  Weekly_Closing:String;
  Sub_Ledger_Class_ID:String;
  Alias_Name:String;

  SWS_GL_Code:String;
  SWS_GL_ShortName:String;
  SWS_GL_Category:String;
  SWS_Agent_Code:String;
  Email2:String;  
  Mobile_No2:String;	
}