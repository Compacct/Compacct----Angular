import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MessageService } from 'primeng/api';
import { DateTimeConvertService } from '../../../../shared/compacct.global/dateTime.service';
import { CompacctCommonApi } from '../../../../shared/compacct.services/common.api.service';
import { CompacctHeader } from '../../../../shared/compacct.services/common.header.service';
import { CompacctGlobalApiService } from '../../../../shared/compacct.services/compacct.global.api.service';
import { NgxUiLoaderService } from "ngx-ui-loader";
import { Observable } from 'rxjs';
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
  ObjContact = new Contact();
  SubledgerContactPersonSubmitted = false;
  ContactEditFlag = false;
  LocationEditFlag = false;
  LocationList = [];
  ObjLocation = new Location();
  SubledgerLocationSubmitted= false;
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
  EngineerList =[];
  CountryList = [];
  StateList = [];
  DistrictList =[];
  SubledgerCategoryList = [];

  Is_Sale_Bill_Enabled = false;
  Is_Purchase_Bill_Enabled = false;
  Is_Payment_Enabled = false;
  Is_Reciept_Enabled = false;
  Is_Journal_Enabled = false;
  Is_CR_Note_Enabled = false;
  Is_DR_Enabled = false;
  Is_Adj_Enabled = false;
  SubLedgerID = undefined;
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
    this.GetEngineerList();
  }
  
  TabClick(e){
    console.log(e)
    this.ClearData();
    this.tabIndexToView = e.index;
    this.buttonName = 'Create';
  }
  ClearData(){
    this.PDFFlag = false;
    this.ProductPDFFile = {};
    this.SubledgerSubmitted = false;
    this.SubledgerContactPersonSubmitted = false;
    this.SubledgerLocationSubmitted= false;
    this.ObjSubledger = new Subledger();
    this.saveSpinner = false;
    this.SelectedSubledgerCategory = [];
    this.SelectedTagLedger = [];

    this.Is_Sale_Bill_Enabled = false;
    this.Is_Purchase_Bill_Enabled = false;
    this.Is_Payment_Enabled = false;
    this.Is_Reciept_Enabled = false;
    this.Is_Journal_Enabled = false;
    this.Is_CR_Note_Enabled = false;
    this.Is_DR_Enabled = false;
    this.Is_Adj_Enabled = false;
    this.ObjContact = new Contact();
    this.ObjLocation = new Location();

    this.ContactEditFlag = false;
    this.LocationEditFlag = false;
    this.ProductPDFLink = undefined;
    this.PDFViewFlag = false;
  }
  TabClick2(e){
    this.ClearData2();
  }
  ClearData2(){
    this.saveSpinner = false;
    this.SubledgerContactPersonSubmitted = false;
    this.SubledgerLocationSubmitted = false;
    this.ContactEditFlag = false;
    this.LocationEditFlag = false;
    
    this.ObjContact = new Contact();
    this.ObjLocation = new Location();
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
  GetEngineerList() {
    const obj = {
      "SP_String": "SP_Create_Subledger_New",
      "Report_Name_String": "Get_Engineer_Dropdown"
    }
    this.GlobalAPI.postData(obj).subscribe((data) => {
      console.log('engi',data)
      this.EngineerList = data; 
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
  changeSubledgerType(id?){
    this.SubledgerCategoryList =[];
    this.SelectedSubledgerCategory =[];
    if(this.ObjSubledger.Subledger_Type){
      this.GetSubLedgerCategoryNameList(this.ObjSubledger.Subledger_Type);
    }
  }
  GetSubLedgerCategoryNameList(name,initData?) {
    this.SubledgerCategoryList =[];
    if(name) {
      this.$http.get('/Master_Acctonting_Subledger/Get_Sub_Ledger_Cat_Name_List?cat_type='+name).subscribe((data: any) => {
        const resDta = data ? JSON.parse(data) : [];
        resDta.forEach(el => {
          el.label=el.Sub_Ledger_Cat_Name;
          el.value= el.Sub_Ledger_Cat_ID;
        });
        this.SubledgerCategoryList = resDta;
        if(initData){
          this.SelectedSubledgerCategory = [];
          this.SelectedSubledgerCategory = initData.includes(',') ? initData.split(',').map(Number) : [Number(initData)];
        }
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
      this.ObjSubledger.Export_Domestic = country == 'Nepal' ?'Domestic' : 'Export';
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
    this.SubledgerLocationSubmitted= false;
    this.ContactList = [];
    this.LocationList = [];
    this.ObjSubLedgerVdetails = {};
    if(obj.Sub_Ledger_ID){
      this.ObjSubLedgerVdetails = obj;
      this.SubledgerModalFlag = true;
    }
  }
  GetContactList(){
    this.ContactList = [];
    if(this.ObjSubledger.Sub_Ledger_ID) {      
      this.ngxService.start();
      const obj = {
        "SP_String": "SP_Create_Subledger_New",
        "Report_Name_String": "Get_Subledger_Contacts",
        "Json_Param_String": JSON.stringify([{'Sub_Ledger_ID' : this.ObjSubledger.Sub_Ledger_ID}])
      }
      this.GlobalAPI.postData(obj).subscribe((data) => {
        console.log(data)
        this.ContactList = data;  
        this.ngxService.stop();
      });
    }
  }
  GetLocationList(){
    this.LocationList = [];
    if(this.ObjSubledger.Sub_Ledger_ID) {      
      this.ngxService.start();
      const obj = {
        "SP_String": "SP_Create_Subledger_New",
        "Report_Name_String": "Get_Subledger_Location_For_Contacts",
        "Json_Param_String": JSON.stringify([{'Sub_Ledger_ID' : this.ObjSubledger.Sub_Ledger_ID}])
      }
      this.GlobalAPI.postData(obj).subscribe((data) => {
        console.log(data)
        this.LocationList = data;  
        this.ngxService.stop();
      });
    }
  }
  getLocationName(ID){
   const tempArr =  this.LocationList.filter(obj => Number(obj.Location_ID) === Number(obj.Location_ID));
    return (ID && tempArr.length) ? tempArr[0].Location_Name : '-';
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
        formData.append("anint", id);
        formData.append("aFile", this.ProductPDFFile);
      const httpHeader =   new HttpHeaders({'Content-Type': undefined,'Accept': 'application/json'})
    let response = await fetch(this.urlService.apiUploadVcardSubLedger,{ 
                  method: 'POST',
                  body: formData, // This is your file object
                });
    let responseText = await response.text();
    console.log(responseText)
    this.saveSpinner = false;
  };

  // SAVE 
  SaveSubLedger(valid) {
    this.SubledgerSubmitted = true;
    console.log(valid)
    if(this.SelectedSubledgerCategory.length) {
      this.saveSpinner = true;
      this.ObjSubledger.Sub_Ledger_Cat_ID = this.SelectedSubledgerCategory.toString();
      console.log(this.ObjSubledger);
      this.ObjSubledger.Is_Adj_Enabled = this.Is_Adj_Enabled ? 'Y' : 'N';
      this.ObjSubledger.Is_CR_Note_Enabled = this.Is_CR_Note_Enabled ? 'Y' : 'N';
      this.ObjSubledger.Is_DR_Enabled = this.Is_DR_Enabled ? 'Y' : 'N';
      this.ObjSubledger.Is_Journal_Enabled = this.Is_Journal_Enabled ? 'Y' : 'N';
      this.ObjSubledger.Is_Payment_Enabled = this.Is_Payment_Enabled ? 'Y' : 'N';
      this.ObjSubledger.Is_Purchase_Bill_Enabled = this.Is_Purchase_Bill_Enabled ? 'Y' : 'N';
      this.ObjSubledger.Is_Reciept_Enabled = this.Is_Reciept_Enabled ? 'Y' : 'N';
      this.ObjSubledger.Is_Sale_Bill_Enabled = this.Is_Sale_Bill_Enabled ? 'Y' : 'N';
      const obj = {
        "SP_String": "SP_Create_Subledger_New",
        "Report_Name_String": this.ObjSubledger.Sub_Ledger_ID ? "Edit_Subledger" : "Create_Subledger",
        "Json_Param_String": JSON.stringify([this.ObjSubledger])
      }
      this.GlobalAPI.postData(obj).subscribe((data) => {
          if (data[0].Column1) {
            this.saveTagLedger(data[0].Column1);            
           //this.SaveLocation({Sub_Ledger_ID : data[0].Column1 , Location_Name : 'MAIN'	,Location_Address: this.ObjSubledger.Address_1 +' '+ this.ObjSubledger.Address_2 ,Mobile_No : this.ObjSubledger.Mobile_No, Email : this.ObjSubledger.Email})
           if(this.PDFFlag && this.ProductPDFFile) {
             console.log(' before upload');
             this.upload(data[0].Column1);
             console.log(' after upload');
           } else {
            this.saveSpinner = false;
           }
           console.log(' dialog upload');
           this.compacctToast.clear();
            this.compacctToast.add({
              key: "compacct-toast",
              severity: "success",
              summary: 'Subledger ID : ' + data[0].Column1,
              detail: "Succesfully Created."
            });
           // this.ClearData();
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
  SaveLocation(DynObj){
    const obj = {
      "SP_String": "SP_Create_Subledger_New",
      "Report_Name_String":  this.LocationEditFlag ? "Edit_Subledger_Location":"Create_Subledger_Location",
      "Json_Param_String": JSON.stringify([DynObj])
    }
    this.GlobalAPI.postData(obj).subscribe((data) => {
        if (data[0].Column1) {
          this.compacctToast.clear();
          this.compacctToast.add({
            key: "compacct-toast",
            severity: "success",
            summary: 'Subledger ID : ' + data[0].Column1,
            detail: "Location Succesfully "+ (this.LocationEditFlag ? "Updated." : "Created.")
          });
          this.ClearData2();
          this.GetLocationList();
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
  SaveContact(DynObj){
    const obj = {
      "SP_String": "SP_Create_Subledger_New",
      "Report_Name_String": this.ContactEditFlag ? "Edit_Subledger_Contacts":"Create_Subledger_Contacts",
      "Json_Param_String": JSON.stringify([DynObj])
    }
    this.GlobalAPI.postData(obj).subscribe((data) => {
        if (data[0].Column1) {
          this.compacctToast.clear();
          this.compacctToast.add({
            key: "compacct-toast",
            severity: "success",
            summary: 'Subledger ID : ' + data[0].Column1,
            detail: "Contact Succesfully  "+ (this.ContactEditFlag ? "Updated." : "Created.")
          });
          this.ClearData2();
          this.GetContactList();
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

  SaveLocationForm(valid) {
    this.SubledgerLocationSubmitted = true;
    if(valid && this.ObjSubledger.Sub_Ledger_ID) {
      if(this.LocationEditFlag){
        this.ObjLocation.Sub_Ledger_ID = this.ObjSubledger.Sub_Ledger_ID;
        this.SaveLocation(this.ObjLocation);
      }
      if (!this.LocationEditFlag && this.CheckLocationNameExist()){
        this.ObjLocation.Sub_Ledger_ID = this.ObjSubledger.Sub_Ledger_ID;
        this.SaveLocation(this.ObjLocation);
      }
    }
  }
  CheckLocationNameExist() {
    if(this.LocationList.length && this.ObjLocation.Location_Name) {
      const dup = this.LocationList.filter(obj=> obj.Location_Name.toUpperCase() === this.ObjLocation.Location_Name.toUpperCase());
      if(dup.length) {
        this.compacctToast.clear();
        this.compacctToast.add({
          key: "compacct-toast",
          severity: "error",
          summary: "Validation",
          detail: "Location Name Already Exits."
        });
        this.ObjLocation.Location_Name = undefined;
        return false;
      }
      return true;
    } else{
      return true;
    }
  }
  SaveContactForm(valid: any) {
    this.SubledgerContactPersonSubmitted = true;
    if(valid && this.ObjSubledger.Sub_Ledger_ID) {
      this.ObjContact.Sub_Ledger_ID = this.ObjSubledger.Sub_Ledger_ID;
      this.SaveContact(this.ObjContact);
     }
  }
  // EDIT
  EditSubledger(id) {
    this.ClearData();
    if(id) {
      this.ObjSubledger.Sub_Ledger_ID = id;
      this.ngxService.start();
      const obj = {
        "SP_String": "SP_Create_Subledger_New",
        "Report_Name_String": "Get_Subledger_Individual",
        "Json_Param_String": JSON.stringify([{'Sub_Ledger_ID' : id}])
      }
      this.getEditdataTagLedger(id);
      this.GetLocationList();
      this.GetContactList();
      this.GlobalAPI.postData(obj).subscribe((data) => {
        console.log(data[0])
        this.ObjSubledger = data[0];
        this.Is_Adj_Enabled = this.ObjSubledger.Is_Adj_Enabled === 'Y' ? true : false;
        this.Is_CR_Note_Enabled = this.ObjSubledger.Is_CR_Note_Enabled === 'Y' ? true : false;
        this.Is_DR_Enabled = this.ObjSubledger.Is_DR_Enabled === 'Y' ? true : false;
        this.Is_Journal_Enabled = this.ObjSubledger.Is_Journal_Enabled === 'Y' ? true : false;
        this.Is_Payment_Enabled = this.ObjSubledger.Is_Payment_Enabled === 'Y' ? true : false;
        this.Is_Purchase_Bill_Enabled = this.ObjSubledger.Is_Purchase_Bill_Enabled === 'Y'  ? true : false;
        this.Is_Reciept_Enabled = this.ObjSubledger.Is_Reciept_Enabled === 'Y'  ? true : false;
        this.Is_Sale_Bill_Enabled = this.ObjSubledger.Is_Sale_Bill_Enabled === 'Y'  ? true : false;
        this.ProductPDFLink = this.ObjSubledger.Vcard  ? this.ObjSubledger.Vcard : undefined;
        this.PDFViewFlag =  this.ProductPDFLink ? true : false;
        this.GetSubLedgerCategoryNameList(this.ObjSubledger.Subledger_Type,this.ObjSubledger.Sub_Ledger_Cat_ID);
        this.GetStateDistrict(data[0].Pin);
        console.log(this.ObjSubledger);
        setTimeout(()=>{
          this.tabIndexToView = 1;
          this.buttonName = 'Update';
          this.ngxService.stop();
        },800)
      });
    }
  }
  getEditdataTagLedger(subLedger) {
    this.$http.get("/Master_Accounting_Sub_Ledger_Taged_Ledger/Get_Ledger_ID?Sub_Ledger_ID=" + subLedger).subscribe((data:any) => {
      console.log(data)
        if (data) {
            var tempTagLedgerList = JSON.parse(data);
            for (let i = 0; i < tempTagLedgerList.length; i++) {
              this.SelectedTagLedger.push(Number(tempTagLedgerList[i].Ledger_ID));
            }
        }
    })
  }
  // EDIT CONTACT
  EditContactList(i){
    this.ObjContact = new Contact();
    this.ObjContact = {...this.ContactList[i]};
    this.ContactEditFlag = true;
  }
  CancelContactForm(){
    this.ObjContact = new Contact();
    this.ContactEditFlag = false;
  }
  // EDIT LOCATION
  EditLocationList(i){
    this.ObjLocation = new Location();
    this.ObjLocation = {...this.LocationList[i]};
    this.LocationEditFlag = true;
  }
  CancelLocationForm(){
    this.ObjLocation = new Location();
    this.LocationEditFlag = false;
  }
  // DELETE  LOCATION
  DeleteLocation(col){
    if(col.Location_ID && confirm('Are you Sure ?')) {
      const obj = {
        "SP_String": "SP_Create_Subledger_New",
        "Report_Name_String": "Delete_Subledger_Location",
        "Json_Param_String": JSON.stringify([{ 'Location_ID' : col.Location_ID}])
      }
      this.GlobalAPI.postData(obj).subscribe((data) => {
          if (data[0].Column1 === 'Deleted Successfully'  ) {
            this.compacctToast.clear();
            this.compacctToast.add({
              key: "compacct-toast",
              severity: "success",
              summary: 'Subledger ID : ' + this.ObjSubledger.Sub_Ledger_ID,
              detail: "Location Succesfully  Deleted"
            });
            this.ClearData2();
            this.GetLocationList();
        } else if(data[0].Column1 === 'Sorry, This Location has been used already'){
          this.compacctToast.clear();
            this.compacctToast.add({
              key: "compacct-toast",
              severity: "warn",
              summary: 'Subledger ID : ' + this.ObjSubledger.Sub_Ledger_ID,
              detail: data[0].Column1
            });
            this.ClearData2();
            this.GetLocationList();

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

  // DOCUMENTS


  // 
  printPDF(subledgerid) {
    if (subledgerid) {
      window.open('/AspxPage/PrintOut.aspx?Sub_Ledger_ID=' + subledgerid,'mywindow', 'fullscreen=yes, scrollbars=auto,width=950,height=500');
    }
   }
 // DELETE
  onConfirm() {
  if (this.SubLedgerID) {
    this.$http
      .post('/Master_Acctonting_Subledger/Delete', { id: this.SubLedgerID })
      .subscribe((data: any) => {
        if (data.success === true) {
          this.GetSubLedgerList();
          this.onReject();
          this.compacctToast.clear();
          this.compacctToast.add({
            key: "compacct-toast",
            severity: "success",
            summary: 'Subledger ID : ' +this.SubLedgerID,
            detail: "Succesfully Deleted"
          });
        }
      });
  }
  }
  onReject() {
    this.compacctToast.clear("c");
  }
  DeleteSubledger(obj) {
    this.SubLedgerID = undefined;
    if (obj.Sub_Ledger_ID) {
      this.SubLedgerID = obj.Sub_Ledger_ID;
      this.compacctToast.clear();
      this.compacctToast.add({
        key: "c",
        sticky: true,
        severity: "warn",
        summary: "Are you sure?",
        detail: "Confirm to proceed"
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
  Engg_Member_ID:String;
  TDS_Deduction:String;
  CIRCLE:String;

  Is_Sale_Bill_Enabled:any;
  Is_Purchase_Bill_Enabled:any;
  Is_Payment_Enabled:any;
  Is_Reciept_Enabled:any;
  Is_Journal_Enabled:any;
  Is_CR_Note_Enabled:any;
  Is_DR_Enabled:any;
  Is_Adj_Enabled:any;
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
class Location{ 
  Sub_Ledger_ID:String;                   
  Location_Name:String;
  Location_Address:String;
  Mobile_No:String;
  Email:String;
  Engg_Member_ID:String;
}
class Contact{
  Contact_ID:String;        
  Location_ID:any;         
  Sub_Ledger_ID:String; 	      
  Contact_Person_Type:String;    	
  Contact_Number:String;                 
  Contact_Name:String;   
  Email_ID:String; 
}