import { Component, OnInit, ViewEncapsulation, ElementRef, ViewChild } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from "@angular/common/http";
import { MessageService } from "primeng/api";
import { CompacctCommonApi } from '../../../shared/compacct.services/common.api.service';
import { CompacctHeader } from '../../../shared/compacct.services/common.header.service';
import { DateTimeConvertService } from "../../../shared/compacct.global/dateTime.service";
import {CompacctGetDistinctService } from "../../../shared/compacct.services/compacct-get-distinct.service"
import * as moment from "moment";
declare var $:any;
import * as XLSX from 'xlsx';
import { FileUpload } from "primeng/primeng";
import { CompacctGlobalApiService } from '../../../shared/compacct.services/compacct.global.api.service';
import { ActivatedRoute } from '@angular/router';
import { DateNepalConvertService } from "../../../shared/compacct.global/dateNepal.service"
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { map, catchError } from 'rxjs/operators';
@Component({
  selector: 'app-nepal-sup-tkt-customer-account-creation',
  templateUrl: './nepal-sup-tkt-customer-account-creation.component.html',
  styleUrls: ['./nepal-sup-tkt-customer-account-creation.component.css'],
  providers: [MessageService],
  encapsulation: ViewEncapsulation.None
})
export class NepalSupTktCustomerAccountCreationComponent implements OnInit {
  items:any = []
  tabIndexToView: number = 0;
  buttonname = "Save";
  cusacccreationFormsSubmitted:boolean = false
  DocDate: any = {};
  objcusacccre:cusacccre = new cusacccre()
  companyTypeList:any =[]
  companyNatureList:any = []
  Spinner:boolean = false
  SupportTicketNo:any = undefined
  Productcrc:any = {}
  Productpvrc:any= {}
  Productcw:any = {}
  BrowseStartDate: any = {};
  BrowseEndDate: any = {};
  SearchFormSubmit:boolean = false
  SearchedBrowselist:any = []
  CitizenshipOwner:any = []
  imageCitizenshipOwner:any = undefined
  imageCompRegistration:any = undefined
  imagePANVATRegistration:any = undefined
  updateModal:boolean = false
  SearchedBrowselistHeader:any = []
  view:boolean = false
  @ViewChild("crcDoc", { static: false }) crcDoc!: FileUpload;
  @ViewChild("pvrcDoc", { static: false }) pvrcDoc!: FileUpload;
  @ViewChild("cwDoc", { static: false }) cwDoc!: FileUpload;
  constructor(
    private $http: HttpClient,
    private GlobalAPI: CompacctGlobalApiService,
    private Header: CompacctHeader,
    private DateService: DateTimeConvertService,
    private DateNepalConvertService: DateNepalConvertService,
    public $CompacctAPI: CompacctCommonApi,
    private compacctToast: MessageService,
    private ngxService: NgxUiLoaderService,
  ) { }

  ngOnInit() {
    this.items = ["BROWSE", "CREATE"];
    this.Header.pushHeader({
      Header: " Customer Account Creation",
      Link: " Ticket Management -> Customer Account Creation"
    });
    this.DocDate = this.DateNepalConvertService.GetNepaliCurrentDateNew();
    this.BrowseStartDate = this.DateNepalConvertService.GetNepaliCurrentDateNew();
    this.BrowseEndDate = this.DateNepalConvertService.GetNepaliCurrentDateNew();
    this.companyTypeList = ['Proprietorship','Partnership','PVT. LTD.','LTD.','Others']
    this.GetcompanyNature()
  }
  onReject() {
    this.compacctToast.clear("c");
    this.ngxService.stop();
  }
  onConfirm(){
   if(this.SupportTicketNo){
    const tempdata = {
      Support_Ticket_No:this.SupportTicketNo,
      User_ID : this.$CompacctAPI.CompacctCookies.User_ID
    }
    const obj = {
      "SP_String": "SP_Np_Sup_Tkt_Customer_Creation",
      "Report_Name_String": "Delete_Customer_Account",
      "Json_Param_String": JSON.stringify([tempdata])
    }
    this.GlobalAPI.getData(obj).subscribe((data: any) => {
       if(data[0].Column1 == 'Done'){
        
        this.clearData();
        this.onReject()
        this.getbrowseData(true)
       }
       this.ngxService.stop();
    })
   }
  }
  TabClick(e:any){
    this.tabIndexToView = e.index;
    this.items = ["BROWSE", "CREATE"];
    this.buttonname = "Save";
    this.clearData()
  }
  clearData(){
   this.objcusacccre = new cusacccre()
   this.DocDate = this.DateNepalConvertService.GetNepaliCurrentDateNew();
   this.cusacccreationFormsSubmitted = false
   this.Spinner = false
   this.SupportTicketNo = undefined
  this.imageCitizenshipOwner = undefined
  this.imageCompRegistration = undefined
  this.imagePANVATRegistration = undefined
  this.view = false
    if(!this.imageCompRegistration){
      this.crcDoc.clear();
    }
    if(!this.imagePANVATRegistration){
      this.pvrcDoc.clear();
    }
    if(!this.imageCitizenshipOwner){
      this.cwDoc.clear();
    }
   
   

  }
  GetcompanyNature(){
    this.$http.get('/Master_Acctonting_Subledger/Get_Sub_Ledger_Cat_Name_List?cat_type=Customer')
    .pipe(map((data:any) => data ? JSON.parse(data) : []))
    .subscribe((data:any)=>{
      console.log(data)
      this.companyNatureList = [...data]
    })
  }
  async Savecusacccre(valid:any){
    console.log("valid",valid)
   this.cusacccreationFormsSubmitted =true
   
   if(valid){
    this.Spinner = true
      this.objcusacccre.Trn_Date = this.DateService.dateConvert(this.DateNepalConvertService.convertNepaliDateToEngDate(this.DocDate))
      this.objcusacccre.Support_Ticket_No = this.SupportTicketNo ? this.SupportTicketNo : 'A'
      this.objcusacccre.User_ID_Create = this.$CompacctAPI.CompacctCookies.User_ID
      if (this.Productcrc['size']) {
        var res:any = await this.upload(this.Productcrc);
         const data = JSON.parse(res)
         this.objcusacccre.URL_Comp_Registration = data.file_url
      }
      if (this.Productpvrc['size']) {
        var res:any = await this.upload(this.Productpvrc);
        const data = JSON.parse(res)
        this.objcusacccre.URL_PAN_VAT_Registration = data.file_url
      }
      if (this.Productcw['size']) {
        var res:any = await this.upload(this.Productcw);
        const data = JSON.parse(res)
        this.objcusacccre.URL_Citizenship_Owner = data.file_url
      }
      const obj = {
        "SP_String": "SP_Np_Sup_Tkt_Customer_Creation",
        "Report_Name_String": "Create_Customer_Account",
        "Json_Param_String": JSON.stringify(this.objcusacccre)
      }
      console.log("data",this.objcusacccre)
      this.GlobalAPI.getData(obj).subscribe((data: any) => {
       if(data[0].Column1){
        this.compacctToast.clear();
        this.compacctToast.add({
          key: "compacct-toast",
          severity: "success",
          summary: "Customer Creation",
          detail: "Succesfully "+this.buttonname,
        });
        this.clearData()
        this.getbrowseData(true)
        this.tabIndexToView = 0
         }
      })
   }
  }
  handlecrcSelect(event:any) {
    this.Productcrc = {};
    if (event) {
      this.Productcrc = event.files[0];
   }
  }
  handlepvrcSelect(event:any) {
    this.Productpvrc = {};
    if (event) {
      this.Productpvrc = event.files[0];
   }
  }
  handlecwSelect(event:any) {
    this.Productcw = {};
    if (event) {
      this.Productcw = event.files[0];
   }
  }
  async upload(event:any){
    const file = event;
    console.log("file",file);
     const formData: FormData = new FormData();
    formData.append("frontfile", file);
    
    const requestHeaders: HeadersInit = new Headers();
    requestHeaders.set('x-functions-key', '9WkvVXtG259qhyTIQ9iB81FGEOJ4IV2fRza7i9A3KxM7AzFu5LiQZQ==');
   let response = await fetch('https://sgnepalemailaz.azurewebsites.net/api/Common_File_Upload?',{ 
     method: 'POST',
     headers: requestHeaders,
     body: formData ,// This is your file object
   });
   let responseText = await response.text();
   console.log("responseText",responseText);
   return responseText
   }

  getbrowseData(valid:any){
   
    this.SearchFormSubmit = true
    if (valid) {
      this.ngxService.start();
      this.SearchedBrowselist = []
      const tempobj = {
        From_date: this.DateService.dateConvert(this.DateNepalConvertService.convertNepaliDateToEngDate(this.BrowseStartDate)),
        To_date: this.DateService.dateConvert(this.DateNepalConvertService.convertNepaliDateToEngDate(this.BrowseEndDate)),
        User_ID_Create:this.$CompacctAPI.CompacctCookies.User_ID
      }
      const obj = {
        "SP_String": "SP_Np_Sup_Tkt_Customer_Creation",
        "Report_Name_String": "Browse_Customer_Account",
        "Json_Param_String": JSON.stringify([tempobj])
      }
      this.GlobalAPI.getData(obj).subscribe((data: any) => {
       
        if (data.length) {
          console.log("Searchedlist", data)
          this.SearchedBrowselist = [...data]
          this.SearchedBrowselistHeader = data.length ? Object.keys(data[0]) : []
          this.SearchedBrowselist.forEach((y: any) => {
            if( y.Trn_Date){
            y.Trn_Date = this.DateNepalConvertService.convertNewEngToNepaliDateObj(y.Trn_Date);
            }
          });
     
        }
        this.ngxService.stop();
      })
    }
  }
  opneFile(file:any){
    if(file){
     window.open(file)
    }
  }
  getStatusWiseColor(obj:any) {
    if (obj.Ticket_Status == "Pending") {
        return 'orange'
    }
    else {
      return 'green'
    }
    
  }
  EditCustomar(col:any,perpo:any){
    this.SupportTicketNo = undefined
   if(col.Support_Ticket_No){
    this.clearData()
    this.SupportTicketNo = col.Support_Ticket_No
    this.items = ["BROWSE", "UPDATE"];
    this.buttonname = "Update";
    this.tabIndexToView = 1
    this.view = perpo =='view'? true : false
    this.getEditData(col.Support_Ticket_No)
   }
  }
  getEditData(TicketNo:any){
    const obj = {
      "SP_String": "SP_Np_Sup_Tkt_Customer_Creation",
      "Report_Name_String": "Get_Data_For_Customer_Account_Edit",
      "Json_Param_String": JSON.stringify([{Support_Ticket_No:TicketNo}])
    }
    this.GlobalAPI.getData(obj).subscribe((data: any) => {
      this.DocDate = this.DateNepalConvertService.convertNewEngToNepaliDateObj(data[0].Trn_Date),
      this.objcusacccre = data[0]
      this.imageCitizenshipOwner = data[0].URL_Citizenship_Owner
      this.imageCompRegistration = data[0].URL_Comp_Registration
      this.imagePANVATRegistration = data[0].URL_PAN_VAT_Registration
    })
  }
  closeBtn(field:any){
   this[field] = undefined
  }
  DeleteCustomar(col:any){
    this.SupportTicketNo = undefined
    if(col.Support_Ticket_No){
      this.ngxService.start();
      this.SupportTicketNo = col.Support_Ticket_No
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
  updatecustomer(col:any){
    this.SupportTicketNo = undefined
    if(col.Support_Ticket_No){
      this.updateModal = true
      console.log(" update col",col)
    }
  }
}

class cusacccre{
  Support_Ticket_No:any
  Executive_Name:any		
  Trn_Date:any	 
  Registered_Company_Name:any	    	
  Type_of_company:any	 	
  Nature_of_Company	:any
  VAT_Pan_no:any		
  Address:any	   
  Manufacturing_Address:any		
  Main_Office_Address:any	
  Owner_Name:any	
  Owner_Mobile_1:any
  Owner_Mobile_2:any	
  Owner_Landline:any		
  Owner_Ext_no:any	         	
  Owner_Email_ID:any		
  PM_Name	:any     	
  PM_Mobile_1:any	     	
  PM_Mobile_2:any		
  PM_Landline:any	
  PM_Ext_no	:any	
  PM_Email_ID	:any	
  AM_Name	:any	
  AM_Mobile_1:any	
  AM_Mobile_2:any		
  AM_Landline:any	
  AM_Ext_no	:any	
  AM_Email_ID:any		
  Pro_M_Name:any		
  Pro_M_Mobile_1:any
  Pro_M_Mobile_2:any		
  Pro_M_Landline:any
  Pro_M_Ext_no:any	
  Pro_M_Email_ID:any
  Pro_M_Designation	:any
  Bank_1_Name:any	
  Bank_1_Branch	:any
  Bank_1_Account_No:any		
  Bank_2_Name	:any	
  Bank_2_Branch:any		
  Bank_2_Account_No:any	
  URL_Comp_Registration	:any
  URL_PAN_VAT_Registration:any
  URL_Citizenship_Owner:any	
  User_ID_Create:any		
}
