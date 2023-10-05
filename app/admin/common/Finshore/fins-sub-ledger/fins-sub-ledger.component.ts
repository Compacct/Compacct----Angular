import { Component, OnInit, ViewEncapsulation, ViewChild } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { MessageService } from "primeng/api";
import { FileUpload } from "primeng/primeng";
import { CompacctCommonApi } from "../../../shared/compacct.services/common.api.service";
import { CompacctHeader } from "../../../shared/compacct.services/common.header.service";
import { CompacctGlobalApiService } from "../../../shared/compacct.services/compacct.global.api.service";
import { DateTimeConvertService } from "../../../shared/compacct.global/dateTime.service";


@Component({
  selector: 'app-fins-sub-ledger',
  templateUrl: './fins-sub-ledger.component.html',
  styleUrls: ['./fins-sub-ledger.component.css'],
  providers: [MessageService],
  encapsulation: ViewEncapsulation.None
})
export class FinsSubLedgerComponent implements OnInit {
  act_popup:boolean = false
  can_popup:boolean = false
  tabIndexToView = 0;
  buttonname = "Create";
  Spinner = false;
  items:any = []
  objSubLedger : SubLedger = new SubLedger();
  objBank : Bank = new Bank();
  SubLedgerFormSubmit:boolean = false
  SubledgerTypeList:any[] =  []
  GSTvalidFlag = false;
  gstdisabled = false;
  AllUser:any[] = []
  ledgerList:any = [];
  AllCountryList:any[] = [];
  AllStateList:any[] = []
  TDSDeduction:any[] = [];
  TagledgerList:any[] = [];
  SelectedTagLedger : any[] = [];
  SubLedgerID = undefined;
  AllProductList:any = []
  Tabbuttonname = "Save"
  catagoryList:any = [];
  catagoryListFilter:any = [];
  SelectedCatagoryType:any = [];
  DocumentListAdd:any = [];
  bankListAdd:any = [];
  tabIndex = 0;
  TabSpinner = false;
  BankFormSubmit = false;
  DocumentFormSubmit = false;
  objDocument : Document = new Document();
  PDFFlag = false;
  PDFViewFlag = false;
  ProductPDFLink:any = undefined;
  ProductPDFFile:any = {};
  upLoadData:any  = {}
  AllDocument:any=[];
  AccountTypeList:any = []
  @ViewChild("fileInput", { static: false }) fileInput!: FileUpload;
  constructor(
    private $http: HttpClient,
    private commonApi: CompacctCommonApi,
    private Header: CompacctHeader,
    private GlobalAPI: CompacctGlobalApiService,
    private compacctToast: MessageService,
    private DateService: DateTimeConvertService
  ) { }

  ngOnInit() {
    this.items = ["BROWSE", "CREATE"];
    this.Header.pushHeader({
      Header: "Sub Ledger",
      Link: "Accounts - > Master  - >Accounting Sub Ledger Master"
    });
    this.SubledgerTypeList = ["Customer","Consultant","Other"];
    this.TDSDeduction = ["Yes", "No"];
    this.AccountTypeList = ['Current Account', 'CC Account', 'Savings Account', 'OD Account', 'Other Account'];
    this.getUser()
    this.getLedger()
    this.getCountry()
    this.GetAllData()
    this.getDocumentType()
    this.getTagLedger()
  }
  onReject(){
    this.compacctToast.clear("c");
  }
  TabClick(e) {
    this.tabIndexToView = e.index;
    this.items = ["BROWSE", "CREATE"];
    this.buttonname = "Create";
    this.clearData();
  }
  TabClick2(e){
    this.tabIndex = e.index;
    this.DocumentFormSubmit = false;
    this.BankFormSubmit = false;
    this.objBank = new Bank()
    this.objDocument = new Document()
    this.fileInput.clear()
    
   }
  clearData(){
    this.Tabbuttonname = "Save"
    this.buttonname = "Create";
    this.Spinner = false;
    this.SubLedgerFormSubmit = false;
    this.act_popup = false;
    this.can_popup = false;
    this.objSubLedger = new SubLedger();
    this.SubLedgerID = undefined;
    this.SelectedTagLedger =[];
    this.objSubLedger.Composite_GST = "No";
 
  }
  checkGSTvalid(g){
    // if (this.objSubLedger.Composite_GST === "No") {
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
    // }

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
  getLedger(){
   
   this.ledgerList = [];
  
     const obj = {
       "SP_String": "sp_Comm_Controller",
       "Report_Name_String":"Get_Master_Accounting_Ledger_Dropdown",
      }
      this.GlobalAPI.getData(obj).subscribe((data:any)=>{
        data.forEach((el:any) => {
           el.label = el.Ledger_Name,
           el.value = el.Ledger_ID
       });
       this.ledgerList = data
   
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
    });

  }
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
              this.objSubLedger.State = this.AllStateList.length ? this.AllStateList[0].StateName : undefined
              this.objSubLedger.District = this.AllStateList.length ? this.AllStateList[0].DistrictName : undefined
            });
          }

       
  }
  getTagLedger(){
 
    this.TagledgerList = [];
    this.SelectedTagLedger = [];
    const obj = {
      "SP_String": "sp_Comm_Controller",
      "Report_Name_String":"Dropdown_Tag_Ledger",
     }
      this.GlobalAPI.getData(obj)
     .subscribe((data : any)=>
     {
       data.forEach(el => {
        el.label = el.Ledger_Name,
        el.value = el.Ledger_ID
       });
      this.TagledgerList = data
     });

  }
  SaveSubLedgerMaster(valid){
    this.SubLedgerFormSubmit = true

    if(this.objSubLedger.GST){
    // if(!this.GSTvalidFlag){
   if(valid){
    this.Spinner = true;
    
     let TaggedLedger:any = [];
    this.SelectedTagLedger.forEach(ele => {
     TaggedLedger.push({
       Ledger_ID : ele
     })
    });
    //this.objSubLedger.Ledger_ID = this.SelectedTagLedger.toString();
   
      this.objSubLedger.Tagged_Ledger = TaggedLedger.length ? TaggedLedger : [];
      this.objSubLedger.IS_SEZ = this.objSubLedger.IS_SEZ === 'Yes'? 1 : 0;
     this.objSubLedger.Is_Adj_Enabled = this.objSubLedger.Is_Adj_Enabled ? 'Y' : 'N'
      this.objSubLedger.Is_CR_Note_Enabled = this.objSubLedger.Is_CR_Note_Enabled ? 'Y' : 'N'
      this.objSubLedger.Is_DR_Enabled = this.objSubLedger.Is_DR_Enabled ? 'Y' : 'N'
      this.objSubLedger.Is_Journal_Enabled = this.objSubLedger.Is_Journal_Enabled ? 'Y' : 'N'
      this.objSubLedger.Is_Payment_Enabled = this.objSubLedger.Is_Payment_Enabled ? 'Y' : 'N'
      this.objSubLedger.Is_Purchase_Bill_Enabled = this.objSubLedger.Is_Purchase_Bill_Enabled ? 'Y' : 'N'
      this.objSubLedger.Is_Reciept_Enabled = this.objSubLedger.Is_Reciept_Enabled ? 'Y' : 'N'
      this.objSubLedger.Is_Sale_Bill_Enabled = this.objSubLedger.Is_Sale_Bill_Enabled ? 'Y' : 'N'
      this.objSubLedger.Amount_Business_Expected = this.objSubLedger.Amount_Business_Expected ? this.objSubLedger.Amount_Business_Expected : 0;
      if(this.SubLedgerID)
       {
        console.log("Update");
        const obj = {
          "SP_String": "Sp_Sub_Ledger_Fins",
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
      "SP_String": "Sp_Sub_Ledger_Fins",
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
      this.Spinner = false;
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
    }
  }
  else {
    this.Spinner = false;
    this.compacctToast.clear();
    this.compacctToast.add({
    key: "compacct-toast",
    severity: "error",
    summary: "Error",
    detail: "Invalid GST No."
  });

}
  }
  GetAllData(){
    const obj = {
      "SP_String": "Sp_Sub_Ledger_Fins",
      "Report_Name_String":"Browse_Master_Accounting_Sub_Ledger",
     }
     this.GlobalAPI.getData(obj)
      .subscribe((data: any) => {
        this.AllProductList = data;
      });
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
      "SP_String": "Sp_Sub_Ledger_Fins",
      "Report_Name_String":"Get_Master_Accounting_Sub_Ledger",
      "Json_Param_String": JSON.stringify([{ Sub_Ledger_ID: SubLedgerID}]) 
      }
      this.GlobalAPI.getData(obj).subscribe(async(res : any)=>{
        const data = JSON.parse(res[0].Main);
        
        this.objSubLedger = data[0];
        console.log("Edit Data",this.objSubLedger);
        this.objSubLedger.Parent_Sub_Ledger_ID = data[0].Parent_Sub_Ledger_ID ? data[0].Parent_Sub_Ledger_ID : undefined;
        this.objSubLedger.Sales_Man_ID = data[0].Sales_Man_ID ? data[0].Sales_Man_ID : undefined;
        this.objSubLedger.User_ID = data[0].User_ID ? data[0].User_ID : undefined;
        this.objSubLedger.Route_ID = data[0].Route_ID ? data[0].Route_ID : undefined;
        this.objSubLedger.Weekly_Closing = data[0].UseWeekly_Closingr_ID ? data[0].Weekly_Closing : undefined;

        if (data[0].Composite_GST === "Yes") {
          this.gstdisabled = true;
        }
        else {
          this.gstdisabled = false;
        }
        
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
         
        this.objSubLedger.Pin = data[0].Pin;
        if (this.objSubLedger.Pin) {
        this.stateDistrictChange(this.objSubLedger.Pin)
        
        }
        this.DocumentListAdd = data[0].Document_Vault ? data[0].Document_Vault : [];
        this.bankListAdd = data[0].Bank_Details ?  data[0].Bank_Details : [];
         this.objSubLedger.Subledger_Type = data[0].Subledger_Type;
        await this.changeSubledrType();
        const SubArr = data[0].Sub_Ledger_Cat_ID ?  data[0].Sub_Ledger_Cat_ID.split(",").map(Number) : [];
        this.SelectedCatagoryType = [...SubArr]
        this.getTagLedger()
        setTimeout(() => {
          let tagArr:any = [];
          data[0].Tagged_Ledger.forEach(ele => {
            tagArr.push(ele.Ledger_ID)
            });
          this.SelectedTagLedger = [...tagArr]
        }, 1000);

        
          })

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
        "SP_String": "Sp_Sub_Ledger_Fins",
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
        "SP_String": "Sp_Sub_Ledger_Fins",
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
  handleFileSelect(event:any) {
    this.PDFFlag = false;
    this.ProductPDFFile = {};
    if (event) {
      console.log(event)
      this.ProductPDFFile = event.files[0];
      this.PDFFlag = true;
  }
  }
  openImg(img){
   window.open(img) 
  }
  
  SaveTabCommon(valid,value){
    this.DocumentFormSubmit = true;
    this.BankFormSubmit = true;
    console.log("valid2", valid);
     if(valid){
        if(value === "DocumentVault"){
          if(this.ProductPDFFile['size']){
           this.GlobalAPI.CommonFileUpload(this.ProductPDFFile)
             .subscribe((data : any)=>
             {
              this.upLoadData = data
              if(this.upLoadData.file_url){
                this.ProductPDFFile = {}
                const DocFilter = this.AllDocument.filter(el=>Number(el.Document_Type_ID) === Number(this.objDocument.Document_Type_ID))
              this.objDocument.Upload_Date = new Date();
              this.objDocument.Upload_By = this.commonApi.CompacctCookies.User_ID
              this.objDocument.Upload_Name = this.commonApi.CompacctCookies.User_Name
              this.objDocument.Document_Type_Name = DocFilter[0].Document_Type_Name
              this.objDocument.Upload_File = this.upLoadData.file_url
             this.DocumentListAdd.push(this.objDocument);
             this.objDocument = new Document()
             this.fileInput.clear()
             this.DocumentFormSubmit = false;
              }
              })
          }
        }
       else if(value === "bank"){
        this.bankListAdd.push(this.objBank);
        this.objBank = new Bank();
        this.BankFormSubmit = false
       }
      }
    
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
  commondelete(i,value){
   if(value === "DocumentVault"){
     this.DocumentListAdd.splice(i,1)
    }
    else if(value === "bank"){
     this.bankListAdd.splice(i,1)
    }
   
  }
  SaveTab(){
    if((this.DocumentListAdd.length || this.bankListAdd.length) && (this.SubLedgerID)){
      this.TabSpinner = true
      this.DocumentListAdd.forEach(el=>{
        el.Upload_Date = this.DateService.dateConvert(el.Upload_Date);
      })
     const saveData= {
       Sub_Ledger_ID : this.SubLedgerID,
       Document_Vault : this.DocumentListAdd.length ? this.DocumentListAdd : [{}],
       Bank_Details : this.bankListAdd.length ? this.bankListAdd : [{}]
     }
     const obj = {
       "SP_String": "Sp_Sub_Ledger_Fins",
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
    this.TabSpinner = false;
    this.GetAllData();
    this.tabIndexToView = 0;
    this.items = ["BROWSE", "CREATE", "REPORT"];
    this.Tabbuttonname = "Create";
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
  TagLedgerCatagory(){
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
  Export_Domestic : any = "Domestic";
  Brand : any;
  Website : any;
  TDS_Deduction : any;
  CIRCLE : any;
  IS_SEZ : any="No";
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
  Registered_Office_Address :any
  Contact_Name :any
  Tan_No:any
  City:any
} 

class Bank{
  Bank_Name : any;
  Branch : any;
  Ac_No : any;
  Bank_Ac_Type : any;
  MICR_Code : any;
  IFSC_Code : any

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