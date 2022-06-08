import { Component, OnInit, ViewEncapsulation, ViewChild } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { CompacctCommonApi } from "../../../../shared/compacct.services/common.api.service";
import { CompacctHeader } from "../../../../shared/compacct.services/common.header.service";
import { MessageService } from "primeng/api";
import { FileUpload } from "primeng/primeng";
import { CompacctGlobalApiService } from "../../../../shared/compacct.services/compacct.global.api.service";
import { DateTimeConvertService } from '../../../../shared/compacct.global/dateTime.service';
import { data } from "jquery";
import { Console } from "console";
@Component({
  selector: 'app-sub-ledger',
  templateUrl: './sub-ledger.component.html',
  styleUrls: ['./sub-ledger.component.css'],
  providers: [MessageService],
  encapsulation: ViewEncapsulation.None
})
export class SubLedgerComponent implements OnInit {
  tabIndexToView = 0;
  buttonname = "Create";
  Spinner = false;
  can_popup = false;
  items = [];
  CostHeadFormSubmit = false;
  AllProductList = [];
  act_popup = false;
  menuList = [];
  userList = [];

  SubLedgerID = undefined;
  
  objSubLedger : SubLedger = new SubLedger();
  objAddress : Address = new Address();
  objContact : Contact = new Contact();
  objDocument : Document = new Document();
  objBank : Bank = new Bank();

  catagoryListFilter = [];
  SelectedCatagoryType:any = [];
  TagLedgerFilter=[];
  SelectedTagLedger : any = [];

  SubLedgerFormSubmit = false;
  AddressFormSubmit = false;
  ContactFormSubmit = false;
  BankFormSubmit = false;
  DocumentFormSubmit = false;

  AllLedgerList = [];
  AllCountryList = [];
  ledgerList = [];
  AllStateList = [];
  AllSales = [];
  AllDocument=[];
  AllUser=[];
  SubledgerTypeList = [];
  catagoryList = [];
  subledgerClassList = [];
  TDSDeduction = [];
  AllRoute = [];
  WeeklyClosingList = [];
  RegionList = [];
  AllEnquirySource = [];
  AllTagLedger = [];
  AllparentLedger = [];
  TagledgerList = [];
  AccountTypeList = [];
  //AddressListAdd : any[];
  AddressListAdd  = [];
  contactListAdd = [];
  DepartmentList = [];
  DocumentListAdd = [];
  bankListAdd = [];
  frequency = 0
  
  tabIndex = 0;
  TabSpinner = false;
  Tabbuttonname = "Save"
  GSTvalidFlag = false;
  constructor(
    private $http: HttpClient,
    private commonApi: CompacctCommonApi,
    private Header: CompacctHeader,
    private GlobalAPI: CompacctGlobalApiService,
    private compacctToast: MessageService,
    private DateService: DateTimeConvertService
  ) { }

  ngOnInit() {
    this.items = ["BROWSE", "CREATE", "REPORT"];
    this.menuList = [
      { label: "Edit", icon: "pi pi-fw pi-user-edit" },
      { label: "Delete", icon: "fa fa-fw fa-trash" }
    ];
    this.Header.pushHeader({
      Header: "Sub Ledger",
      Link: "Accounts - > Master  - >Accounting Sub Ledger Master"
    });
    this.SubledgerTypeList = ["Customer","Vendor","Broker","Other"];
    this.TDSDeduction = ["Yes", "No"];
    this.WeeklyClosingList = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
    this.DepartmentList = ['Owner', 'Accounts', 'Purchase', 'Operator', 'Godown'];
    this.RegionList = ['Asia'];
    this.AccountTypeList = ['Current Account', 'CC Account', 'Savings Account', 'OD Account', 'Other Account'];
    
    this.getLedger();
    this.getCountry();
    this.getSalesMaster();
    this.getDocumentType();
    this.GetAllData();
    this.getUser();
    this.GetSubledgerClass();
    this.getRoute();
    this.getEnquirySource();
    this.getParentLedger();
    this.getTagLedger();
    this.getTagLedger()
    
  //this.GetUser();
  //this.GetAllData();
  }
  checkGSTvalid(g){
    this.GSTvalidFlag = false;
    if(g) {
      let regTest = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(g)
      if(regTest){
        let a = 65,b = 55, c =36;
        let p;
        return Array['from'](g).reduce((i:any,j:any,k:any,g:any)=>{
          p =(p=(j.charCodeAt(0)<a?parseInt(j):j.charCodeAt(0)-b)*(k%2+1))>c?1+(p-c):p;
          return k<14?i+p:j==((c=(c-(i%c)))<10?c:String.fromCharCode(c+b));
        },0);
      }
      this.GSTvalidFlag = !regTest;
    }

  }
  GetAllData(){
    const obj = {
      "SP_String": "Sp_Sub_Ledger",
      "Report_Name_String":"Browse_Master_Accounting_Sub_Ledger",
     }
     this.GlobalAPI.getData(obj)
      .subscribe((data: any) => {
        this.AllProductList = data;
        console.log("AllProductList=",this.AllProductList);
      });
  }

  TabClick(e) {
    this.tabIndexToView = e.index;
    this.items = ["BROWSE", "CREATE", "REPORT"];
    this.buttonname = "Create";
    this.clearData();
  }
  clearData(){
    this.buttonname = "Create";
    this.Tabbuttonname = "Save"
    this.Spinner = false;
    this.SubLedgerFormSubmit = false;
    this.act_popup = false;
    this.can_popup = false;
    this.objSubLedger = new SubLedger();
    this.SubLedgerID = undefined;
    this.TabSpinner = undefined;
    this.SelectedCatagoryType = [];
    this.SelectedTagLedger =[];
  }

  getLedger(){
   this.AllLedgerList=[]; 
  this.ledgerList = [];
 
    const obj = {
      "SP_String": "sp_Comm_Controller",
      "Report_Name_String":"Get_Master_Accounting_Ledger_Dropdown",
     }
     this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      this.AllLedgerList = data;
     console.log("this.AllLedgerList",this.AllLedgerList);
      this.AllLedgerList.forEach((el:any) => {
        this.ledgerList.push({
          label: el.Ledger_Name,
          value: el.Ledger_ID
        });
      });
      
  
    })
  }
  getParentLedger(){
    const obj = {
      "SP_String": "sp_Comm_Controller",
      "Report_Name_String":"Get_All_Sub_Ledger",
      "Json_Param_String": JSON.stringify([{User_ID: this.commonApi.CompacctCookies.User_ID}]) 
  }
  this.GlobalAPI.getData(obj).subscribe((data : any)=>
  {
    this.AllparentLedger = data;
    console.log('AllparentLedger=', this.AllparentLedger);
  })
}

  getCountry(){
    const obj = {
      "SP_String": "sp_Comm_Controller",
      "Report_Name_String":"Get_Country_Dropdown",
     }
     this.GlobalAPI.getData(obj)
     .subscribe((data : any)=>
     {
       this.AllCountryList = data;
       console.log('country=',this.AllCountryList);
     });

  }

  // getDistrict(){
  //   const obj = {
  //     "SP_String": "sp_Comm_Controller",
  //     "Report_Name_String":"Get_State_District_Dropdown",
  //    }
    
  //    this.GlobalAPI.getData(obj)
  //    .subscribe((data : any)=>
  //    {
  //      this.AllStateList = data;
  //      console.log('State=',this.AllStateList);
  //    });

  //}
  stateDistrictChange(pin){
    console.log("pin =", pin);
    console.log("pin 22 =", pin.length);
    if(pin.length === 6)
    {
    const obj = {
        "SP_String": "sp_Comm_Controller",
         "Report_Name_String":"Get_State_District_Dropdown",
         "Json_Param_String": JSON.stringify([{Pincode: pin}]) 
          }
          
          
            this.GlobalAPI.getData(obj)
            .subscribe((data)=>
            {
              this.AllStateList = data;
              //this.objSubLedger.State=this.AllStateList.StateName;
              console.log('State = ', this.AllStateList);
              this.objSubLedger.State = this.AllStateList.length ? this.AllStateList[0].StateName : undefined
              this.objSubLedger.District = this.AllStateList.length ? this.AllStateList[0].DistrictName : undefined
              this.objAddress.State = this.AllStateList.length ? this.AllStateList[0].StateName : undefined
              this.objAddress.District = this.AllStateList.length ? this.AllStateList[0].DistrictName : undefined
            });
          }

       
  }
  async changeSubledrType() {
    this.catagoryListFilter = [];
    this.catagoryList = [];
    this.SelectedCatagoryType = [];
    if(this.objSubLedger.Subledger_Type){
    const obj = {
      "SP_String": "sp_Comm_Controller",
      "Report_Name_String": "Dropdown_Sub_Ledger_Category",
      "Json_Param_String": JSON.stringify([{Sub_Ledger_Cat_Type : this.objSubLedger.Subledger_Type}])

    }
    const catData = await  this.GlobalAPI.getData(obj).toPromise();
    console.log(catData)
    this.catagoryList = catData;
    this.catagoryList.forEach(el => {
      this.catagoryListFilter.push(
        {
          label: el.Sub_Ledger_Cat_Name,
          value: el.Sub_Ledger_Cat_ID
        }
      )
    })
  }
  }
 GetsubledgerCat(subID?){
    this.catagoryListFilter = [];
    this.catagoryList = [];
    this.SelectedCatagoryType = [];
    if(this.objSubLedger.Subledger_Type){
      const obj = {
        "SP_String": "sp_Comm_Controller",
        "Report_Name_String": "Dropdown_Sub_Ledger_Category",
        "Json_Param_String": JSON.stringify([{Sub_Ledger_Cat_Type : this.objSubLedger.Subledger_Type}])
  
      }
      this.GlobalAPI.getData(obj).subscribe((data:any)=>{
        console.log("ProductList  ===",data);
        this.catagoryList = data;
          this.catagoryList.forEach(el => {
            this.catagoryListFilter.push(
              {
                label: el.Sub_Ledger_Cat_Name,
                value: el.Sub_Ledger_Cat_ID
              }
            )
          })
        if(subID){ 
            setTimeout(() => {
                this.SelectedCatagoryType = [...subID]
              console.log("SelectedCatagoryType",this.SelectedCatagoryType)
          }, 2000);
          }
        
     
      })
    }
  }
  getSalesMaster(){
    const obj = {
      "SP_String": "sp_Comm_Controller",
      "Report_Name_String":"Dropdown_Master_SalesTeam",
     }
     this.GlobalAPI.getData(obj)
     .subscribe((data : any)=>
     {
       this.AllSales = data;
       console.log('Sales=',this.AllSales);
     });
  }
 GetSubledgerClass(){
  const obj = {
    "SP_String": "sp_Comm_Controller",
    "Report_Name_String":"Dropdown_Sub_Ledger_Class",
   }
   this.GlobalAPI.getData(obj)
   .subscribe((data : any)=>
   {
     this.subledgerClassList = data;
     console.log('subledgerClassList=',this.subledgerClassList);
   });
 }
  getDocumentType(){
    const obj = {
      "SP_String": "sp_Comm_Controller",
      "Report_Name_String":"Dropdown_Master_Document_Type",
     }
     this.GlobalAPI.getData(obj)
     .subscribe((data : any)=>
     {
       this.AllDocument = data;
       console.log('Document=',this.AllDocument);
     });
  }

  getUser(){
    const obj = {
      "SP_String": "sp_Comm_Controller",
      "Report_Name_String":"Dropdown_User_Name",
     }
     this.GlobalAPI.getData(obj)
     .subscribe((data : any)=>
     {
       this.AllUser = data;
       console.log('User=',this.AllUser);
     });

  }

  getRoute(){
    const obj = {
      "SP_String": "sp_Comm_Controller",
      "Report_Name_String":"Dropdown_Route_Name",
     }
     this.GlobalAPI.getData(obj)
     .subscribe((data : any)=>
     {
       this.AllRoute = data;
       console.log('AllRoute=',this.AllRoute);
     });
  }

  getEnquirySource(){
    const obj = {
      "SP_String": "sp_Comm_Controller",
      "Report_Name_String":"Dropdown_Enquiry_Source",
     }
     this.GlobalAPI.getData(obj)
     .subscribe((data : any)=>
     {
       this.AllEnquirySource = data;
       console.log('AllEnquirySource=',this.AllEnquirySource);
     });
  }

   getTagLedger(){
    this.AllTagLedger=[]; 
    this.TagledgerList = [];
    this.SelectedTagLedger = [];
    const obj = {
      "SP_String": "sp_Comm_Controller",
      "Report_Name_String":"Dropdown_Tag_Ledger",
     }
     //const tagData = await  this.GlobalAPI.getData(obj).toPromise();
     this.GlobalAPI.getData(obj)
     .subscribe((data : any)=>
     {
       this.AllTagLedger = data;
       console.log('AllTagLedger=',this.AllTagLedger);
       this.AllTagLedger.forEach(el => {
        this.TagledgerList.push({
          label: el.Ledger_Name,
          value: el.Ledger_ID
        });
      });
      
     });
    // this.TagledgerList = tagData;
    // this.AllTagLedger.forEach(el => {
    //   this.TagledgerList.push(
    //     {
    //       label: el.Ledger_Name,
    //       value: el.Ledger_ID
    //     }
    //   )
    // })
  }

  SaveSubLedgerMaster(valid){
    this.SubLedgerFormSubmit = true
    console.log("valid",valid)
    console.log("SelectedCatagoryType",this.SelectedCatagoryType);
    console.log("SelectedTagLedger",this.SelectedTagLedger);
   if(valid){
    this.Spinner = true;
    this.objSubLedger.Sub_Ledger_Cat_ID = this.SelectedCatagoryType.toString();
     let TaggedLedger = [];
    this.SelectedTagLedger.forEach(ele => {
     TaggedLedger.push({
       Ledger_ID : ele
     })
    });
    //this.objSubLedger.Ledger_ID = this.SelectedTagLedger.toString();
   
      this.objSubLedger.Tagged_Ledger = TaggedLedger.length ? TaggedLedger : [];
      this.objSubLedger.IS_SEZ = this.objSubLedger.IS_SEZ === 'Yes'? 1 : 0;
      console.log("objSubLedger",this.objSubLedger);
      this.objSubLedger.Is_Adj_Enabled = this.objSubLedger.Is_Adj_Enabled ? 'Y' : 'N'
      this.objSubLedger.Is_CR_Note_Enabled = this.objSubLedger.Is_CR_Note_Enabled ? 'Y' : 'N'
      this.objSubLedger.Is_DR_Enabled = this.objSubLedger.Is_DR_Enabled ? 'Y' : 'N'
      this.objSubLedger.Is_Journal_Enabled = this.objSubLedger.Is_Journal_Enabled ? 'Y' : 'N'
      this.objSubLedger.Is_Payment_Enabled = this.objSubLedger.Is_Payment_Enabled ? 'Y' : 'N'
      this.objSubLedger.Is_Purchase_Bill_Enabled = this.objSubLedger.Is_Purchase_Bill_Enabled ? 'Y' : 'N'
      this.objSubLedger.Is_Reciept_Enabled = this.objSubLedger.Is_Reciept_Enabled ? 'Y' : 'N'
      this.objSubLedger.Is_Sale_Bill_Enabled = this.objSubLedger.Is_Sale_Bill_Enabled ? 'Y' : 'N'
      if(this.SubLedgerID)
       {
        console.log("Update");
        const obj = {
          "SP_String": "Sp_Sub_Ledger",
          "Report_Name_String":"Edit_Master_Accounting_Sub_Ledger",
          "Json_Param_String": JSON.stringify([this.objSubLedger]) 
        }
        this.GlobalAPI.getData(obj)
        .subscribe((data : any)=>
        {
          console.log("edit",data[0].Column1);
          if(data[0].Column1 == 'done')
          {
            this.compacctToast.clear();
              this.compacctToast.add({
                key: "compacct-toast",
                severity: "success",
                summary: "Sub Ledger Update Succesfully",
                detail: "Succesfully Updated"
              });
              this.Spinner = false;
              this.GetAllData();
              this.tabIndexToView = 0;
              this.items = ["BROWSE", "CREATE", "REPORT"];
              this.buttonname = "Create";
          }
          else{
            this.Spinner = false;
            this.compacctToast.clear();
            this.compacctToast.add({
            key: "compacct-toast",
            severity: "error",
            summary: "Error",
            detail: "Something Wrong"
          });
          }
        });
       }
       else{
       
     // this.SubLedgerFormSubmit = false;
     this.objSubLedger.Is_Visiable = "Y"
       const obj = {
      "SP_String": "Sp_Sub_Ledger",
      "Report_Name_String":"Add_Master_Accounting_Sub_Ledger",
      "Json_Param_String": JSON.stringify([this.objSubLedger]) 
     }
     this.GlobalAPI.getData(obj).subscribe((data : any)=>
     {
       console.log('data=',data[0].Column1);
       //if (data[0].Sub_Ledger_ID)
       if(data[0].Column1)
       {
         this.SubLedgerID = data[0].Column1
        this.compacctToast.clear();
        this.compacctToast.add({
        key: "compacct-toast",
        severity: "success",
        summary: "Sub-ledger Create Succesfully ",
        detail: "Succesfully Created"
      });
      this.clearData();
      this.GetAllData();
      }
      else{
        this.compacctToast.clear();
        this.compacctToast.add({
        key: "compacct-toast",
        severity: "error",
        summary: "Error",
        detail: "Something Wrong"
      });
      }
     });
     
      
    }
  }
  }

  SaveTabCommon(valid,value){
   
    this.AddressFormSubmit = true;
    this.ContactFormSubmit = true;
    this.DocumentFormSubmit = true;
    this.BankFormSubmit = true;
    console.log("valid2", valid);
     if(valid){
      console.log("this.AddressListAdd",this.AddressListAdd)
      if(value === "address"){
          this.frequency++;
     
          if(this.frequency == 1)
          {
        //  //this.AddressListAdd.push(tempArrAdd)
        //  this.AddressListAdd = JSON.parse(JSON.stringify(tempArrAdd));
         
         }
        //  else
        //  {
        //    this.AddressListAdd.push(tempArrAdd);
        //  }
         
       this.AddressListAdd.push(this.objAddress);
        console.log("AddressListAdd",this.AddressListAdd);
        this.objAddress = new Address()
        this.AddressFormSubmit = false;
       }
       else if(value === "contact"){
          //this.contactListAdd = [];
        // tempArrcon.push(this.objContact);
        // this.contactListAdd = tempArrcon
        this.contactListAdd.push(this.objContact);
        console.log("contactListAdd",this.contactListAdd);
        this.objContact = new Contact()
        this.ContactFormSubmit = false;
       }
       else if(value === "DocumentVault"){
          //this.DocumentListAdd = [];
         const DocFilter = this.AllDocument.filter(el=>Number(el.Document_Type_ID) === Number(this.objDocument.Document_Type_ID))
         this.objDocument.Upload_Date = new Date();
         this.objDocument.Upload_By = this.commonApi.CompacctCookies.User_ID
         this.objDocument.Upload_Name = this.commonApi.CompacctCookies.User_Name
         this.objDocument.Document_Type_Name = DocFilter[0].Document_Type_Name
        //  tempArrdoc.push(this.objDocument);
        //  this.DocumentListAdd = tempArrdoc
       this.DocumentListAdd.push(this.objDocument);
        console.log("DocumentListAdd",this.DocumentListAdd);
        this.objDocument = new Document()
        this.DocumentFormSubmit = false;
       }
       else if(value === "bank"){
          //this.bankListAdd = [];
        // tempArrbank.push(this.objBank)
        // this.bankListAdd = tempArrbank
        this.bankListAdd.push(this.objBank);
        console.log("bankListAdd",this.bankListAdd);
        this.objBank = new Bank();
        this.BankFormSubmit = false
       }
      }
    
    }

  

  SaveContactMaster(valid3){
    this.ContactFormSubmit = true;
    console.log("valid3", valid3);
    console.log('save contact', this.objContact);
    if(valid3){
      this.ContactFormSubmit = false
    }

  }

  SaveDocumentMaster(){

  }

  SaveBankMaster(valid5){
    this.BankFormSubmit = true;
    console.log('valid5', valid5);
    console.log('save Bankdetails', this.objBank);
    if(valid5){
      this.BankFormSubmit = false;
    }
  }

  EditSubLedger(col) {
    console.log('col=',col);
    if (col.Sub_Ledger_ID) {
     
       this.SubLedgerID = undefined;
       this.clearData();
       this.tabIndexToView = 1;
       this.items = ["BROWSE", "UPDATE", "REPORT"];
       this.buttonname = "Update";
       this.Tabbuttonname = "Update"
       this.SubLedgerID = col.Sub_Ledger_ID
       this.getEditSubLedger(col.Sub_Ledger_ID);
       
     }
   }

   getEditSubLedger(SubLedgerID){
    console.log('SubLedgerID=',SubLedgerID);
    const obj = {
      "SP_String": "Sp_Sub_Ledger",
      "Report_Name_String":"Get_Master_Accounting_Sub_Ledger",
      "Json_Param_String": JSON.stringify([{ Sub_Ledger_ID: SubLedgerID}]) 
      }
      this.GlobalAPI.getData(obj).subscribe(async(res : any)=>{
        const data = JSON.parse(res[0].Main);
        
        this.objSubLedger = data[0];
        console.log("Edit Data",this.objSubLedger);
        this.objSubLedger.IS_SEZ = Number(this.objSubLedger.IS_SEZ) == 1? "Yes" : "No";
        this.objSubLedger.Is_Sale_Bill_Enabled = this.objSubLedger.Is_Sale_Bill_Enabled === 'Y'? true: false;
        this.objSubLedger.Is_Purchase_Bill_Enabled = this.objSubLedger.Is_Purchase_Bill_Enabled === 'Y'? true : false;
        this.objSubLedger.Is_Payment_Enabled = this.objSubLedger.Is_Payment_Enabled === 'Y'? true : false;
        this.objSubLedger.Is_Reciept_Enabled = this.objSubLedger.Is_Reciept_Enabled === 'Y'? true : false;
        this.objSubLedger.Is_Journal_Enabled = this.objSubLedger.Is_Journal_Enabled === 'Y'? true : false;
        this.objSubLedger.Is_CR_Note_Enabled = this.objSubLedger.Is_CR_Note_Enabled === 'Y'? true : false;
        this.objSubLedger.Is_DR_Enabled = this.objSubLedger.Is_DR_Enabled === 'Y'? true : false;
        this.objSubLedger.Is_Adj_Enabled = this.objSubLedger.Is_Adj_Enabled === 'Y'? true : false;
        this.getTagLedger();
         
          this.stateDistrictChange(data[0].Pin)
        this.AddressListAdd = data[0].Address_Details ? data[0].Address_Details : [];
        this.contactListAdd = data[0].Contact_Persons ? data[0].Contact_Persons : [];
        this.DocumentListAdd = data[0].Document_Vault ? data[0].Document_Vault : [];
        this.bankListAdd = data[0].Bank_Details ?  data[0].Bank_Details : [];
        //this.SelectedTagLedger = data[0].Tagged_Ledger;
        const SubArr = data[0].Sub_Ledger_Cat_ID ?  data[0].Sub_Ledger_Cat_ID.split(",").map(Number) : [];
        const call = await this.changeSubledrType();
        this.SelectedCatagoryType = [...SubArr]
        this.getTagLedger()
        setTimeout(() => {
          let tagArr = [];
          data[0].Tagged_Ledger.forEach(ele => {
            tagArr.push(ele.Ledger_ID)
            });
          this.SelectedTagLedger = [...tagArr]
        }, 1000);

        
          })

  }

  DeleteSubLedger(col){
    this.act_popup = false;
    if (col.Sub_Ledger_ID) {
      this.can_popup = true;
      this.SubLedgerID = undefined;
      this.SubLedgerID = col.Sub_Ledger_ID;
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

  Active(col){
    this.can_popup = false;
    if (col.Sub_Ledger_ID) {
      this.SubLedgerID = undefined;
      this.SubLedgerID = col.Sub_Ledger_ID;
      this.act_popup = true;
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

  onConfirm(){
    if(this.SubLedgerID){
      const obj = {
        "SP_String": "Sp_Sub_Ledger",
        "Report_Name_String":"Deactive_Master_Accounting_Sub_Ledger",
        "Json_Param_String": JSON.stringify([{Sub_Ledger_ID : this.SubLedgerID}]) 
       };
       this.GlobalAPI.getData(obj)
        .subscribe((data: any) => {
          console.log("data2==",data[0].Column1)
          // if (data.success === true) {
            if (data[0].Column1 === "done"){
            this.GetAllData();
            this.onReject();
            this.compacctToast.clear();
            this.compacctToast.add({
              key: "compacct-toast",
              severity: "success",
              summary: "Sub ledger: " + this.SubLedgerID.toString(),
              detail: "Succesfully Deleted"
            });
          }
        });
      
    }

  }

  onConfirm2(){
    if(this.SubLedgerID)
    {
      const obj = {
        "SP_String": "Sp_Sub_Ledger",
        "Report_Name_String":"Active_Master_Accounting_Sub_Ledger",
        "Json_Param_String": JSON.stringify([{Sub_Ledger_ID : this.SubLedgerID}]) 
       };
       this.GlobalAPI.getData(obj)
       .subscribe((data: any) => {
         // if (data.success === true) {
           if (data[0].Column1 === "done"){
           this.GetAllData();
           this.onReject();
           this.compacctToast.clear();
           this.compacctToast.add({
             key: "compacct-toast",
             severity: "success",
             summary: "Sub Ledger: " + this.SubLedgerID.toString(),
             detail: "Succesfully Activate"
           });
         }
       });


  }
}

  filterCatagory(){

  }
  TagLedgerCatagory(){
     }

  onReject(){
    this.compacctToast.clear("c");
  }
 commondelete(i,value){
   if(value === "address"){
    this.AddressListAdd.splice(i,1)
   }
   else if(value === "contact"){
    this.contactListAdd.splice(i,1)
   }
   else if(value === "DocumentVault"){
    this.DocumentListAdd.splice(i,1)
   }
   else if(value === "bank"){
    this.bankListAdd.splice(i,1)
   }
  
 }
 TabClick2(e){
  this.tabIndex = e.index;
  this.AddressFormSubmit = false;
  this.ContactFormSubmit = false;
  this.DocumentFormSubmit = false;
  this.BankFormSubmit = false;
  this.objAddress = new Address()
  this.objBank = new Bank()
  this.objContact = new Contact()
  this.objDocument = new Document()
 }
 SaveTab(){
   if(this.AddressListAdd.length && this.contactListAdd.length && this.DocumentListAdd.length && this.bankListAdd.length && this.SubLedgerID){
     this.TabSpinner = true
     this.DocumentListAdd.forEach(el=>{
       el.Upload_Date = this.DateService.dateConvert(el.Upload_Date);
     })
    const saveData= {
      Sub_Ledger_ID : this.SubLedgerID,
      Address_Details : this.AddressListAdd,
      Contact_Persons : this.contactListAdd,
      Document_Vault : this.DocumentListAdd,
      Bank_Details : this.bankListAdd
    }
    const obj = {
      "SP_String": "Sp_Sub_Ledger",
      "Report_Name_String":"Add_Master_Accounting_Sub_Ledger_Part_2",
      "Json_Param_String": JSON.stringify(saveData) 
    }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
    console.log("data",data);
    if(data[0].Column1)
    {
      this.SubLedgerID = Number(data[0].Column1)
      this.TabSpinner = false;
      this.SubLedgerID = data[0].Column1
     this.compacctToast.clear();
     this.compacctToast.add({
     key: "compacct-toast",
     severity: "success",
     summary: "Sub-ledger Updated Succesfully ",
     detail: "Succesfully Updated"
   });
  }
   else{
    this.TabSpinner = false;
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
   else {
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

class SubLedger{
  Ledger_ID : any;
  Sub_Ledger_Name : string;
  Email : string;
  Mobile_No : any;
  Phone : any;
  Sales_Man_ID : any;
  User_ID : any;
  Subledger_Type : any;
  Route_ID : any;
  Weekly_Closing : any;
  Sub_Ledger_Class_ID : any;
  Parent_Sub_Ledger_ID : any;
  CR_Days : any;
  CR_Limit : any;
  PAN_No : any;
  GST : any;
  FSSAI_No : any;
  WORLD_WIDE_REGION : any;
  Batch_Code : any;
  CIN : any;
  Excise_No : any;
  Composite_GST : any;
  Billing_Name : any;
  Address_1 : any;
  Address_2 : any;
  Address_3 : any;
  Land_Mark : any;
  Country : any;
  Pin : any;
  State : any;
  District : any;
  Export_Domestic : any;
  Brand : any;
  Website : any;
  TDS_Deduction : any;
  CIRCLE : any;
  IS_SEZ : any;
  Recurring_Order_Days : any;
  Amount_Business_Expected : any;
  PerYear_Onetime : any = "PerYear";
  Special_Note : any;
  Client_Brief_Description : any;
  Remarks : any;
  Vcard : any;
  Enq_Source_ID : any;
  Is_Sale_Bill_Enabled:any=true;
  Is_Purchase_Bill_Enabled:any=true;
  Is_Payment_Enabled:any=true;
  Is_Reciept_Enabled:any=true;
  Is_Journal_Enabled:any=true;
  Is_CR_Note_Enabled:any=true;
  Is_DR_Enabled : any=true;
  Is_Adj_Enabled : any=true;
  Pincode : any;
  Intro_Member_ID : any;
  Sub_Ledger_Cat_ID:any;
  Tagged_Ledger:any;
  Sub_Ledger_ID : any
  EXID_NO : any;
  Is_Visiable : any;
} 

class Address{
  Address_Caption: any;
  Contact_Person_Name : any;
  Department : any;
  Address1 : any;
  Address2 : any; 
  Address3 : any;
  State : any;
  District : any;
  GST : any;
  FSSAI_No : any;
  Country : any;
  WORLD_WIDE_REGION: any;
  Route_ID : any;
  Weekly_Closing : any;
  Pin : any
 
}

class Contact{ 
  Contact_Person_Name : any;
  Department : any;
  Location : any;
  Designation : any;
  Email_ID : any;
  Mobile_No : any;
  Land_Line_No : any
}

class Document{
  Document_Type_ID : any
  Document_Type_Name:any
  File_Name:any
  Upload_Date:any
  Upload_By:any
  Upload_Name:any
  Upload_File : any
}

class Bank{
  Bank_Name : any;
  Branch : any;
  Ac_No : any;
  Bank_Ac_Type : any;
  MICR_Code : any;
  IFSC_Code : any

}
