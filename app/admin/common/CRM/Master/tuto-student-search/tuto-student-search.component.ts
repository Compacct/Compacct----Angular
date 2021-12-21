import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { AfterViewInit, Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MessageService } from "primeng/api";
import { map } from 'rxjs/operators';
import { DateTimeConvertService } from '../../../../shared/compacct.global/dateTime.service';
import { CompacctCommonApi } from '../../../../shared/compacct.services/common.api.service';
import { CompacctHeader } from '../../../../shared/compacct.services/common.header.service';
import { CompacctGlobalApiService } from '../../../../shared/compacct.services/compacct.global.api.service';
import { NgxUiLoaderService } from "ngx-ui-loader";
 
@Component({
  selector: 'app-tuto-student-search',
  templateUrl: './tuto-student-search.component.html',
  styleUrls: ['./tuto-student-search.component.css'],
  providers: [MessageService],
  encapsulation: ViewEncapsulation.None
})
export class TutoStudentSearchComponent implements OnInit,AfterViewInit {
  url = window["config"];
  ConfirmSearchFormSubmitted = false;
  seachSpinner = false;
  Searchlist = [];

  Studentdetails:any;

  ShowDetailsModal = false;
  tabIndexToView = 0;
  items = [];
  Billingdetaillist = [];
  Orderdetaillist = [];

  ObjStusearchForm = new StusearchForm();
  ObjStudetail = new Studetail();
  objLedgerDetails = new LedgerDetails();
  LedgerModal = false;
  LedgerSubmitted = false;
  ClassList = [];
  StudentEditFormSubmitted = false;
  StudentEditModal = false;
  ObjStudentEdit = new StudentEdit();
  FollowupList = [];
  SupportTicketDumplist = [];
  SupportQuestionDumplist = [];

  ShowOrderModal = false;
  Orderdetaillist2 = [];
  OrderProductsList = [];
  OrderProductslist2 = [];
  OrderProductsModal = false;
  OrderSubsTxnID = undefined;

  
  objFollowupDetails = new Followup();
  objFollowUpCreation = new Followup();
  FollowupModal = false;
  folloupFormSubmit = false;
  NxtFollowupDate = new Date();
  TodayDate = new Date();
  TutopiaDemoActionFlag = false;
  followUpLists = [];
  distinctDateArray = [];
  validcheck = false;
  forwardlead = true;
  SalesUserList = [];
  ActionList = [];
  Product_ID = undefined;

  NxtFollowupDate2 = new Date();

  transferLeadSubmitted = false;
  TransferLeadModal = false;
  AllUserList = [];
  CancelOrderObj:any = {};
  
  PDFFlag = false;
  PDFViewFlag = false;
  ProductPDFLink = undefined;
  ProductPDFFile:any = {};
  ManualPaymentConfirmModal = false;
  ManualPaymentConfirmFormSubmit = false;
  ObjManualPaymentCnfm = new ManualPaymentCnfm();
  SkeletonShow = true;
  ShowRefundModal = false;
  constructor(
    private Header: CompacctHeader,
    private $http : HttpClient,
    private GlobalAPI: CompacctGlobalApiService,
    private DateService: DateTimeConvertService,
    private compacctToast: MessageService,
    public $CompacctAPI: CompacctCommonApi,
    private ngxService: NgxUiLoaderService
  ) { }

  ngOnInit() {
    this.items = ["Student Detail","Followup Details", "Billing Details","Order Details","Support Question Dump","Support Ticket Dump"];
    this.Header.pushHeader({
      Header: "Student Search",
      Link: " CRM -> Student Search"
    });
    this.GetClassList();
    this.GetProducts2();
    this.GetAllUserList();
    this.GetActionList();
    this.GetAllUserList2();
  }
  ngAfterViewInit() {
    setTimeout(() => {
    this.SkeletonShow = false;
   });
   }
  TabClick(e){
    console.log(e)
    this.tabIndexToView = e.index;
    this.items = ["Student Detail","Followup Details", "Billing Details","Order Details","Support Question Dump","Support Ticket Dump"];

  }
  getDateRange(dateRangeObj) {
    if (dateRangeObj.length) {
      this.objLedgerDetails.StDate = dateRangeObj[0];
      this.objLedgerDetails.EndDate = dateRangeObj[1];
    }
  }
  GetClassList(){
    this.seachSpinner = true;
    const obj = {
      "Report_Name": "List_Class "
    }
    this.GlobalAPI
        .CommonTaskData(obj)
        .subscribe((data: any) => {
          this.ClassList = data.length ? data : [];
          this.seachSpinner = false;
    });
  }
  GetAllUserList2() {
    const obj = {
      "Report_Name": "Get_Direct_Sale_Users ",
      "Json_Param_String" : JSON.stringify([{USER_ID :this.$CompacctAPI.CompacctCookies.User_ID}])
    }
    this.GlobalAPI
        .CommonTaskData(obj)
        .subscribe((data: any) => {
          this.AllUserList = data.length ? data : [];
        });
    // this.$http
    //     .get(this.url.apiGetUserListAll)
    //     .subscribe((data: any) => {
    //         this.AllUserList = data.length ? data : [];
    //     });
  }

  GetSearchList(valid){
    this.ConfirmSearchFormSubmitted = true;
    if(valid) {
      this.seachSpinner = true;
        const para = new HttpParams().set("Search_BY", this.ObjStusearchForm.Search_BY)
    .set("Search_Type", this.ObjStusearchForm.Search_Type)
    .set("Search_Value", this.ObjStusearchForm.Search_Value);
    this.$http
    .get('Tutopia_Student_Search/Get_Student_Search', { params: para })
    .subscribe((data: any) => {
      this.Searchlist = data ? JSON.parse(data) : [];
      this.seachSpinner = false;
    });
  }

  }
  GetStudentdetails(){
    this.Studentdetails = undefined;
    const tempObj = {
      Lead_ID: this.ObjStusearchForm.Lead_ID
    };

    const obj = {
      "Report_Name" : "Get_Student_Details",
      "Json_Param_String" : JSON.stringify([tempObj])
    }
    this.GlobalAPI.CommonPostData(obj,'Create_Common_task_Tutopia_Call?Report_Name=Get_Student_Details').subscribe((data:any)=>{
      this.Studentdetails = data ? data[0] : [];

     })
  }
  GetBillingdetaillist(){
    this.Billingdetaillist = [];
    this.ngxService.start();
    const Objtemp = {
      Foot_Fall_ID : this.ObjStusearchForm.Foot_Fall_ID
    };
    const objj = {
      "Report_Name" : "Get_Student_Bill_Details",
      "Json_Param_String" : JSON.stringify([Objtemp])
    }
    this.GlobalAPI.CommonTaskData(objj).subscribe((data:any)=>{
      this.Billingdetaillist = data.length ? data : [];
      this.ngxService.stop();
      console.log(this.Billingdetaillist)

     })

  }
  GetOrderdetaillist(){
    this.Orderdetaillist = [];
    const Objtemp = {
      Foor_Fall_ID : this.ObjStusearchForm.Foot_Fall_ID
    };
    const objj = {
      "Report_Name" : "Get_Order_Details_Foot_Fall_ID_Wise",
      "Json_Param_String" : JSON.stringify([Objtemp])
    }
    this.GlobalAPI.CommonTaskData(objj).subscribe((data:any)=>{
      this.Orderdetaillist = data.length ? data : [];
      console.log(this.Orderdetaillist)

     })

  }
  GetFollowupList(){
    this.FollowupList = [];
    const Objtemp = {
      Lead_ID : this.ObjStusearchForm.Lead_ID
    };
    const objj = {
      "Report_Name" : "Get_Followup_Details_Foot_Fall_ID_Wise",
      "Json_Param_String" : JSON.stringify([Objtemp])
    }
    this.GlobalAPI.CommonPostData(objj,'Create_Common_task_Tutopia_Call?Report_Name=Get_Followup_Details_Foot_Fall_ID_Wise').subscribe((data:any)=>{
      this.FollowupList = data.length ? data : [];
      console.log(this.FollowupList)

     })

  }
  GetSupportQuestionDumplist(){
    this.SupportQuestionDumplist = [];
    const Objtemp = {
      Foot_Fall_ID : this.ObjStusearchForm.Foot_Fall_ID
    };
    const objj = {
      "Report_Name" : "Get_Support_Question_Foot_Fall_ID_Wise",
      "Json_Param_String" : JSON.stringify([Objtemp])
    }
    this.GlobalAPI.CommonTaskData(objj).subscribe((data:any)=>{
      this.SupportQuestionDumplist = data.length ? data : [];
      console.log(this.SupportQuestionDumplist)

     })

  }
  GetSupportTicketDumplist(){
    this.SupportTicketDumplist = [];
    const Objtemp = {
      Foot_Fall_ID : this.ObjStusearchForm.Foot_Fall_ID
    };
    const objj = {
      "Report_Name" : "Get_Support_Ticket_Foot_Fall_ID_Wise",
      "Json_Param_String" : JSON.stringify([Objtemp])
    }
    this.GlobalAPI.CommonTaskData(objj).subscribe((data:any)=>{
      this.SupportTicketDumplist = data.length ? data : [];
      console.log(this.SupportTicketDumplist)

     })

  }
  GetAllUserList() {
    const obj = {
      "Report_Name": "Get_Direct_Sale_Users ",
      "Json_Param_String" : JSON.stringify([{USER_ID :this.$CompacctAPI.CompacctCookies.User_ID}])
    }
    this.GlobalAPI
        .CommonTaskData(obj)
        .subscribe((data: any) => {
          this.SalesUserList = data.length ? data : [];
        });
  }
  GetActionList() {
    const obj = {
      "SP_String": "SP_Controller",
      "Report_Name_String": "GET_Action_Type"
    }
    this.GlobalAPI.CommonPostData(obj,'/Tutopia_Call_Common_SP_For_All')
      .subscribe((data: any) => {
        console.log(data);
        const tempActionTaken = data.length ? $.grep(data, function (value:any) { return value.Request_Type !== "Visit Customer" && value.Request_Type !== "Direct Appointment"; }) : [];
        this.ActionList = tempActionTaken;
      });
  }

  //  DETAILS
  Showdetails(obj){
    this.ObjStudetail = new Studetail();
    this.ShowDetailsModal = false;
    this.Studentdetails = undefined;
    this.Orderdetaillist = [];
    this.FollowupList = [];
    this.Billingdetaillist = [];
    if(obj.Lead_ID){
      this.ObjStusearchForm.Foot_Fall_ID = obj.Foot_Fall_ID;
      this.ObjStusearchForm.Lead_ID = obj.Lead_ID;
      this.GetStudentdetails();
      this.GetFollowupList();
      if(obj.Foot_Fall_ID.toString() !== '0') {
        this.GetBillingdetaillist();
        this.GetOrderdetaillist();
        this.GetSupportQuestionDumplist();
        this.GetSupportTicketDumplist();
        }
      setTimeout(()=>{
        this.ShowDetailsModal = true;
      },900);
    }
  }
  PrintBill(obj) {
    if (obj.Doc_No) {
      window.open("/Report/Crystal_Files/Finance/SaleBill/tutopia_final.aspx?Doc_No=" + obj.Doc_No, 'mywindow', 'fullscreen=yes, scrollbars=auto,width=950,height=500'

      );
    }
  }
// ORDER 
  GetProducts2() {
    this.OrderProductslist2 = [];
    const objj = {
      "SP_String" : "Tutopia_Subscription_Update",
      "Report_Name_String" : "Get_Products"
    }
    this.GlobalAPI.getData(objj).subscribe((data:any)=>{
      this.OrderProductslist2 = data.length ? data : [];
      console.log(this.OrderProductslist2)

    })
  }
  ShowOrder(obj){
    this.ObjStudetail = new Studetail();
    this.ShowOrderModal = false;
    this.Studentdetails = undefined;
    this.Orderdetaillist2 = [];
    this.OrderSubsTxnID = undefined;
    this.Product_ID = undefined;
    if(obj.Foot_Fall_ID){
      this.ObjStusearchForm.Foot_Fall_ID = obj.Foot_Fall_ID;
      this.ObjStusearchForm.Lead_ID = obj.Lead_ID;
      this.GetStudentdetails();
      this.GetStudentOrderdetails2();
      setTimeout(()=>{
        this.ShowOrderModal = true;
        // App_Confirm
      },900);
    }
  }
  CancelOrder(obj) {
    this.CancelOrderObj = {};
    if(obj.Foot_Fall_ID){
      this.CancelOrderObj = obj;
      console.log(this.CancelOrderObj)
      this.compacctToast.clear();
      this.compacctToast.add({
        key: "c",
        sticky: true,
        severity: "warn",
        summary: "Are you sure, you want to cancel the order ?",
        detail: "Confirm to proceed"
      });
    }
  }
  CancelOrderTutopiaApi() {
    try {
      const obj = {
        "order_id": this.CancelOrderObj.Subscription_Txn_ID,
        "cancel_reason": "Subscription Cancled",
        "cancelled_by": this.$CompacctAPI.CompacctCookies.User_ID
    }
      this.CallTutopiaApi('subscription/cancel',obj).then((res:any) =>{
       console.log(res);
       this.CancelOrderApi();
      });
     } catch(error) {
       console.log(error)
       this.compacctToast.clear();
       this.compacctToast.add({
         key: "compacct-toast",
         severity: "error",
         summary: "Error",
         detail: "Error From Tutopia App API."
       });
     }
  }
  CancelOrderApi() {
    const Objtemp = {
      Subscription_Txn_ID : this.CancelOrderObj.Subscription_Txn_ID
    };
    const objj = {
      "SP_String" : "Tutopia_Subscription_Update",
      "Report_Name_String" : "Cancel_Orders",
      "Json_Param_String" : JSON.stringify([Objtemp])
    }
    this.GlobalAPI.getData(objj).subscribe((data:any)=>{
      console.log(data);
      this.compacctToast.clear();
      this.compacctToast.add({
        key: "compacct-toast",
        severity: "success",
        summary: 'Subscription',
        detail: "Subscription Cancelled Successfully."
      });
      this.CancelOrderObj = {};
      this.GetStudentOrderdetails2();


     })
  }
  onReject() {
    this.compacctToast.clear("c");
  }
  GetStudentOrderdetails2() {
    this.Orderdetaillist2 = [];
    this.ngxService.start();
    const Objtemp = {
      Foot_Fall_ID : this.ObjStusearchForm.Foot_Fall_ID
    };
    const objj = {
      "SP_String" : "Tutopia_Subscription_Update",
      "Report_Name_String" : "GET_Student_Wise_Orders",
      "Json_Param_String" : JSON.stringify([Objtemp])
    }
    this.GlobalAPI.getData(objj).subscribe((data:any)=>{
      this.Orderdetaillist2 = data.length ? data : [];
      console.log(this.Orderdetaillist)
      this.ngxService.stop();

     })
  }
  async  UpdateRefCode(obj) {
    const Objtemp = {
      Distributor_CODE : obj.Ref_Code,
      Subscription_Txn_ID : obj.Subscription_Txn_ID,
      User_ID: this.$CompacctAPI.CompacctCookies.User_ID
    };
    const objj = {
      "SP_String" : "Tutopia_Subscription_Update",
      "Report_Name_String" : "Update_Distributor_Code",
      "Json_Param_String" : JSON.stringify([Objtemp])
    }
    this.GlobalAPI.getData(objj).subscribe((data:any)=>{
      if(data[0].order_id) {
        try {
         this.CallTutopiaApi('subscription/edit',data[0]).then((res:any) =>{
            console.log(res);
            const prodData = res.data.order_detail.Products.length ? res.data.order_detail.Products : [];
            if(prodData.length) {
              prodData.forEach(item=> item['User_ID'] = this.$CompacctAPI.CompacctCookies.User_ID);
              this.SaveOrderProductLastApi(prodData);
            }
          });
        } catch(error) {
          console.log(error)
          this.compacctToast.clear();
          this.compacctToast.add({
            key: "compacct-toast",
            severity: "error",
            summary: "Error",
            detail: "Error From Tutopia App API."
          });
        }
        
      }else{
        this.compacctToast.clear();
        this.compacctToast.add({
          key: "compacct-toast",
          severity: "error",
          summary: "Error",
          detail: "Error Occured"
        });
      }

     })
  }
  CheckRefCode(obj){
    if(obj.Ref_Code) {
      const Objtemp = {
        Dist_Code : obj.Ref_Code
      };
      const objj = {
        "SP_String" : "Tutopia_Subscription_Update",
        "Report_Name_String" : "Check_Distributor_CODE",
        "Json_Param_String" : JSON.stringify([Objtemp])
      }
      this.GlobalAPI.getData(objj).subscribe((data:any)=>{
        console.log(data)
        const res = data.length ? data[0] : {};
        if(res.Column1 === 'Found') {
          this.UpdateRefCode(obj);
        }
        if(res.Column1 === 'Not Found') {
          this.compacctToast.clear();
          this.compacctToast.add({
            key: "compacct-toast",
            severity: "error",
            summary: "Error",
            detail: "Distributor CODE : "+obj.Ref_Code + "  Not Found."
          });
        }
  
       })
    }
    
  }
  ShowOrderProducts(obj){
    this.OrderProductsList = [];
    this.OrderProductsModal = false;
    this.OrderSubsTxnID = undefined;
    this.Product_ID = undefined;
    const Objtemp = {
      Subscription_Txn_ID : obj.Subscription_Txn_ID
    };
    const objj = {
      "SP_String" : "Tutopia_Subscription_Update",
      "Report_Name_String" : "GET_Student_Wise_Orders_Products",
      "Json_Param_String" : JSON.stringify([Objtemp])
    }
    this.GlobalAPI.getData(objj).subscribe((data:any)=>{
      this.OrderProductsList = data.length ? data : [];
      this.OrderProductsList.forEach(item=>{
        item['Rate']= 0;
        item['Discount']= 0;
        item['Amount']= 0;
      })
      if(this.OrderProductsList.length) {
        this.OrderSubsTxnID = obj.Subscription_Txn_ID;
        this.OrderProductsModal = true;
      }
      console.log(this.OrderProductsList)

     })
  }
  SaveOrderProduct(){
    console.log(this.OrderSubsTxnID)
    const arr = this.MergeProductAll();
    if(arr.length && this.OrderSubsTxnID) {
      const objj = {
        "SP_String" : "Tutopia_Subscription_Update",
        "Report_Name_String" : "Save Product",
        "Json_Param_String" : JSON.stringify(arr)
      }
      this.GlobalAPI.getData(objj).subscribe((data:any)=>{
        console.log(data)
        if(data[0].order_id) {
          try {
           this.CallTutopiaApi('subscription/edit',data[0]).then((res:any) =>{
            console.log(res);
            const prodData = res.data.order_detail.Products.length ? res.data.order_detail.Products : [];
            if(prodData.length) {
              prodData.forEach(item=> item['User_ID'] = this.$CompacctAPI.CompacctCookies.User_ID);
              this.SaveOrderProductLastApi(prodData);
            }
           });
          } catch(error) {
            console.log(error)
            this.compacctToast.clear();
            this.compacctToast.add({
              key: "compacct-toast",
              severity: "error",
              summary: "Error",
              detail: "Error From Tutopia App API."
            });
          }
        }else{
          this.compacctToast.clear();
          this.compacctToast.add({
            key: "compacct-toast",
            severity: "error",
            summary: "Error",
            detail: "Error Occured"
          });
        }
       })
    }
  }
  SaveOrderProductLastApi(arr) {
    const objj = {
      "SP_String" : "Tutopia_Subscription_Update",
      "Report_Name_String" : "Save Product",
      "Json_Param_String" : JSON.stringify(arr)
    }
    this.GlobalAPI.getData(objj).subscribe((data:any)=>{
      console.log(data)
      if(data[0].order_id) {
          this.compacctToast.clear();
          this.compacctToast.add({
            key: "compacct-toast",
            severity: "success",
            summary: 'Product',
            detail: "Succesfully Updated."
          });
          this.OrderSubsTxnID = undefined;
          this.GetStudentOrderdetails2();
          }
    });
  }
  MergeProductAll(){
    let tempArr = [];
    if(this.OrderSubsTxnID){
      this.OrderProductsList.forEach(item=>{
        if(item.Product_ID) {
          const obj = {
            Subscription_Txn_ID : this.OrderSubsTxnID,
            Product_ID : item.Product_ID,
            User_ID: this.$CompacctAPI.CompacctCookies.User_ID,
            Rate: item.Rate,
            Discount: item.Discount,
            Amount: item.Amount
          }
          tempArr.push(obj);
        }
      });
    }
    
    return tempArr;
  }
  addProduct(){
    if(this.Product_ID) {
    const arr =   this.OrderProductslist2.filter(item=> item.Product_ID == this.Product_ID);
    if(arr.length) {
      const obj = {
        Subscription_Txn_ID : this.OrderSubsTxnID,
        Product_ID : this.Product_ID,
        User_ID: this.$CompacctAPI.CompacctCookies.User_ID,
        Rate: 0,
        Discount: 0,
        Amount: 0
      }
      this.OrderProductsList.push(obj)
    } else {
      this.compacctToast.clear();
          this.compacctToast.add({
            key: "compacct-toast",
            severity: "error",
            summary: "Validation",
            detail: "Product Already Exits"
          });
    }
      
    }else {
      this.compacctToast.clear();
          this.compacctToast.add({
            key: "compacct-toast",
            severity: "error",
            summary: "Validation",
            detail: "Please Select a Product."
          });
    }
  }
  DeleteProduct(index){
    this.OrderProductsList.splice(index,1)
  }

  async CallTutopiaApi(url , obj) {
    const httpOptions = {headers: new HttpHeaders().set('Authorization', 'Bearer aZyAs0ynGvmOSNyyAOkJauiV')}
    const response = await this.$http.post('https://api.tutopia.in/api/crm/v1/'+url,obj,httpOptions).toPromise();
  return response;
  }
  // EDIT
  EditStudentDetails(obj) {
    this.StudentEditFormSubmitted = false;
    this.StudentEditModal = false;
    this.ObjStudentEdit = new StudentEdit();
    if(obj.Foot_Fall_ID) {
      this.ObjStudentEdit.Foot_Fall_ID = obj.Foot_Fall_ID;
      this.ObjStudentEdit.Contact_Name = obj.Contact_Name;
      this.GetDataForEdit(obj.Foot_Fall_ID)
    }
  }
  GetDataForEdit(footfall) {
    if(footfall) {
      const obj = {
        "Report_Name": "Get_Student_Details_For_Edit",
        "Json_Param_String" : JSON.stringify([{'Foot_Fall_ID' : footfall }])
      }
      this.GlobalAPI
          .CommonTaskData(obj)
          .subscribe((data: any) => {
            const redata = data.length ? data[0] : [];
            this.ObjStudentEdit.Ref_Code = redata.Ref_Code;
            this.ObjStudentEdit.Pin = redata.pin;
            this.ObjStudentEdit.school = redata.school;
            this.ObjStudentEdit.Class_ID = redata.Class_ID;
            this.StudentEditModal = true;
      });
    }
  }
  UpdateStudentEditData (valid) {
    this.StudentEditFormSubmitted = true;
    if(valid) {
      const obj = {
        "Report_Name": "Update_Student_Details_For_Edit",
        "Json_Param_String" : JSON.stringify([this.ObjStudentEdit])
      }
      this.GlobalAPI
          .CommonTaskData(obj)
          .subscribe((data: any) => {
            console.log(data[0].Remarks)
            if(data[0].Remarks === 'success') {
              this.compacctToast.clear();
              this.compacctToast.add({
                key: "compacct-toast",
                severity: "success",
                summary: 'Foot Fall ID : ' + this.ObjStudentEdit.Foot_Fall_ID,
                detail: "Succesfully Updated."
              });
              this.StudentEditFormSubmitted = false;
              this.ObjStudentEdit = new StudentEdit();
              this.StudentEditModal = false;
              this.GetSearchList(true);
            }else{
              this.compacctToast.clear();
              this.compacctToast.add({
                key: "compacct-toast",
                severity: "error",
                summary: "Error",
                detail: "Error Occured"
              });
            }
      });
    }
  }

  //  LEDGER
  showLedger(obj) {
    this.objLedgerDetails = new LedgerDetails();
    this.LedgerSubmitted = false;
    if(obj.Foot_Fall_ID) {
      this.objLedgerDetails.Foot_Fall_ID = obj.Foot_Fall_ID;
      this.objLedgerDetails.Patient_Name = obj.Contact_Name;
      this.LedgerModal = true;
    }
  }
  PrintLedger(valid) {
    this.LedgerSubmitted = true;
    if(valid){
      const start = this.objLedgerDetails.StDate
        ? this.DateService.dateConvert(new Date(this.objLedgerDetails.StDate))
        : this.DateService.dateConvert(new Date());
      const end = this.objLedgerDetails.EndDate
        ? this.DateService.dateConvert(new Date(this.objLedgerDetails.EndDate))
        : this.DateService.dateConvert(new Date());
      window.open("/Report/Crystal_Files/CRM/Clinic/Patient_Ledger.aspx?Report_type=" + this.objLedgerDetails.Report_type + "&StDate=" + start + "&EndDate=" + end + "&Foot_Fall_ID=" + this.objLedgerDetails.Foot_Fall_ID + "&Patient_Name=" + this.objLedgerDetails.Patient_Name, 'mywindow', 'fullscreen=yes, scrollbars=auto,width=950,height=500');
    }
  }
 // FOLLOWUP
  FollowUpPopup(obj) {
    this.followUpLists = [];
    this.distinctDateArray = [];
    this.objFollowUpCreation = new Followup();
    this.objFollowupDetails = new Followup();
    this.NxtFollowupDate = new Date();
    this.folloupFormSubmit = false;
    if (obj.Lead_ID) {
      this.objFollowupDetails = obj;
      this.objFollowUpCreation.Foot_Fall_ID = obj.Foot_Fall_ID;
      this.objFollowUpCreation.Lead_ID = obj.Lead_ID;
      this.objFollowUpCreation.School = obj.School;
      this.objFollowUpCreation.Pin = obj.Pin;
      this.objFollowUpCreation.Current_Action = 'Tele Call';
      this.objFollowUpCreation.Followup_Action = 'Tele Call';
      this.TutopiaDemoActionFlag = false;
      this.GetFollowupDetails(obj.Lead_ID);
      this.FollowupModal = true;
    }

  }
  GetFollowupDetails(footFallID) {
    const ctrl = this;
          const distinctDateArrayTemp = [];
          const obj = {
            "SP_String": "Tutopia_Followup_SP",
            "Report_Name_String": "Browse Followup Tutopia",
            "Json_1_String": '[{"Lead_ID":' + footFallID+'}]'
          }
          this.GlobalAPI.CommonPostData(obj,'Tutopia_Call_Common_SP_For_All?Report_Name=Browse Followup Tutopia').subscribe(function (data) {
                ctrl.followUpLists = data.length ? data:[];
                for (let i = 0; i < ctrl.followUpLists.length; i++) {
                    distinctDateArrayTemp.push(ctrl.followUpLists[i].Posted_On_C);
                }
                const unique = distinctDateArrayTemp.filter(function(value, index, self){
                                return self.indexOf(value) === index;
                                })
            ctrl.distinctDateArray = unique;
            ctrl.FollowupModal = true;
            });
  }
  getFollowupByDate(dateStr) {
    return this.followUpLists.filter((item) => item.Posted_On_C === dateStr);
  }
  // CHANGE
  FollowupActionChanged() {
    this.TutopiaDemoActionFlag = false;
    this.objFollowUpCreation.Fathers_Occupation = '';
    this.objFollowUpCreation.School = '';
    if (this.objFollowUpCreation.Current_Action === 'Interested for Web Demo' || this.objFollowUpCreation.Current_Action === 'Interested for Home Demo') {
        this.TutopiaDemoActionFlag = true;
      }
  }
  changeStatusForFollowupCreation(status) {
    this.objFollowUpCreation.Sent_To = undefined;
    this.forwardlead = true;
    this.validcheck = false;
    if (status) {
        if (status === "Forward Lead" || status === "Forward Lead With My Own Followup") {
            this.forwardlead = false;
            this.validcheck = true;
        }
    }
  }
  // SAVE FOLLOWUP
  saveFollowup(valid) {
    this.folloupFormSubmit = true;
    if (valid) {
      this.objFollowUpCreation.User_ID = this.$CompacctAPI.CompacctCookies.User_ID;
      this.objFollowUpCreation.Next_Followup = this.DateService.dateTimeConvert(new Date(this.NxtFollowupDate));
      const arrAction = this.ActionList.filter(item=> item.Request_Type == this.objFollowUpCreation.Current_Action);
      if(arrAction.length){
         this.objFollowUpCreation.Request_Type_id = arrAction[0].Request_Type_id;
       this.objFollowUpCreation.Request_Type = arrAction[0].Request_Type;
       this.objFollowUpCreation.Call_Req = arrAction[0].Call_Req;
      }
      console.log(this.objFollowUpCreation)
      const obj = {
            "SP_String": "Tutopia_Followup_SP",
            "Report_Name_String": "Save Followup Tutopia",
            "Json_1_String": JSON.stringify([this.objFollowUpCreation])
          }
          this.GlobalAPI.CommonPostData(obj,'Tutopia_Call_Common_SP_For_All?Report_Name=Save Followup Tutopia').subscribe((data) => {
              if (data[0].Column1) {
                this.saveTutopiaViewStatus(this.objFollowUpCreation);
                this.compacctToast.clear();
                this.compacctToast.add({
                  key: "compacct-toast",
                  severity: "success",
                  summary: 'Student ID : ' + this.objFollowUpCreation.Foot_Fall_ID,
                  detail: "Succesfully Saved."
                });
                this.GetFollowupDetails(this.objFollowUpCreation.Foot_Fall_ID);
            }
            else {
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
  saveTutopiaViewStatus(obj) {
    if (obj.Foot_Fall_ID) {
        const TempObj = {
            Viewd: obj.Status === 'Keep it in My Own Followup' ? 'Y':'N',
            Foot_Fall_ID: obj.Foot_Fall_ID
        }
      this.$http.post('/Tutopia_CRM_Lead/Update_Viewed_Followup', TempObj).subscribe((data: any) => {
        if (data.success) {
            this.GetSearchList(true);
        }
      })
    }
  }
   // FORWARD LEAD
   OpenForwardModal(obj) {
    this.NxtFollowupDate2 = new Date();
    this.objFollowupDetails = new Followup();
    this.transferLeadSubmitted = false;
    if(obj.Lead_ID){
      this.objFollowupDetails.Foot_Fall_ID = obj.Foot_Fall_ID;
      this.objFollowupDetails.Lead_ID = obj.Lead_ID;
      this.objFollowupDetails.frd_viewd = 'Fresh';
      this.TransferLeadModal = true;
    }
  }
  SaveForwardTo(valid) {
     this.transferLeadSubmitted = true;
    if (valid) {
       const obj = this.FetchSelectedLead();
      this.$http.post('/Tutopia_CRM_Lead/Insert_Followup_Branch', obj).subscribe((data: any) => {
        if (data.success) {
          this.compacctToast.clear();
          this.compacctToast.add({
            key: "compacct-toast",
            severity: "success",
            summary: 'success',
            detail: "Succesfully Forwarded."
          });
          this.GetSearchList(true);
          this.TransferLeadModal = false;
        }
      })
    }
  }
  FetchSelectedLead () {
    let tempArr = [];
    const obj = {
      Foot_Fall_ID: this.objFollowupDetails.Foot_Fall_ID,
      Lead_ID: this.objFollowupDetails.Lead_ID,
      User_ID:  this.$CompacctAPI.CompacctCookies.User_ID,
      Current_Action: "Tele Call",
      Followup_Details: "Forward From" + " " +  this.$CompacctAPI.CompacctCookies.User_Name,
      Followup_Action: "Tele Call",
      Status: "Forward Lead",
      Used: 'N',
      frd_viewd : this.objFollowupDetails.frd_viewd,
      Sent_To: this.objFollowupDetails.Sent_To,
      Posted_On: this.DateService.dateTimeConvert(new Date()),
      Next_Followup: this.DateService.dateTimeConvert(new Date(this.NxtFollowupDate2)),
    };
    tempArr.push(obj);
    return { Followup_Branch_String: JSON.stringify(tempArr) };
  }

  // MANUAL PAYMENT CONFIRM
  showManualPaymentModal(obj) {
    this.ObjManualPaymentCnfm = new ManualPaymentCnfm();
    this.PDFFlag = false;
    this.ProductPDFFile = {};
    this.ManualPaymentConfirmFormSubmit = false;
    if(obj.Foot_Fall_ID) {
      this.ObjManualPaymentCnfm.Foot_Fall_ID = obj.Foot_Fall_ID;
      this.ObjManualPaymentCnfm.Contact_Name = obj.Contact_Name;
      this.ObjManualPaymentCnfm.User_ID = this.$CompacctAPI.CompacctCookies.User_ID;
      this.ManualPaymentConfirmModal = true;
    }
  }
  FetchPDFFile(event) {
    this.PDFFlag = false;
    this.ProductPDFFile = {};
    if (event) {
      this.ProductPDFFile = event.files[0];
      this.PDFFlag = true;
    }
  }
  SaveManualPaymentConfirm(valid) {
    this.ManualPaymentConfirmFormSubmit = true;
    if (valid && this.ProductPDFFile['size']) {
      const obj = {
        "SP_String":"Tutopia_Manual_Payment_SP",
        "Report_Name_String":"Manual_Payment_Update",
        "Json_Param_String":JSON.stringify([this.ObjManualPaymentCnfm]),
        "Json_1_String": "NA",
        "Json_2_String":"NA",
        "Json_3_String":"NA",
        "Json_4_String":"NA"
      }
      this.GlobalAPI.postData(obj).subscribe((data) => {
        console.log(data[0])
          if (data[0].Column1) {
            this.upload(data[0].Column1);
        }
        else {
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
    if(!this.ProductPDFFile['size']) {
      this.compacctToast.clear();
      this.compacctToast.add({
        key: "compacct-toast",
        severity: "error",
        summary: "Validation",
        detail: "No Docs Selected"
      });
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
    if(responseText === 'Success') {
      this.compacctToast.clear();
      this.compacctToast.add({
        key: "compacct-toast",
        severity: "success",
        summary: 'Student ID : ' + this.ObjManualPaymentCnfm.Foot_Fall_ID,
        detail: "Payment Confirm Succesfully Saved."
      });
      this.ObjManualPaymentCnfm = new ManualPaymentCnfm();
      this.ManualPaymentConfirmFormSubmit = false;
      this.ManualPaymentConfirmModal = false;

    }
  };

  // REFUND
  ShowRefund(obj) {
    this.ObjStudetail = new Studetail();
    this.ShowRefundModal = false;
    this.Studentdetails = undefined;
    this.Billingdetaillist = [];
    if(obj.Lead_ID){
      this.ObjStusearchForm.Foot_Fall_ID = obj.Foot_Fall_ID;
      this.ObjStusearchForm.Lead_ID = obj.Lead_ID;
      this.GetStudentdetails();
      if(obj.Foot_Fall_ID.toString() !== '0') {
        this.GetBillingdetaillist();
        }
      setTimeout(()=>{
        this.ShowRefundModal = true;
      },900);
    }
  }
  SaveRefund(obj){
    if(obj.Doc_No && Number(obj.Refund_Amount) > 0) {
      const Objtemp = {
        Refund_Amount : obj.Refund_Amount,
        Refund_User_ID : this.$CompacctAPI.CompacctCookies.User_ID,
        Order_No : obj.Doc_No,
        Subscription_Txn_ID: obj.Subscription_Txn_ID
      };
      console.log(Objtemp)
      const objj = {
        "SP_String" : "Tutopia_Subscription_Update",
        "Report_Name_String" : "Refund_Order",
        "Json_Param_String" : JSON.stringify([Objtemp])
      }
      this.GlobalAPI.getData(objj).subscribe((data:any)=>{
        console.log(data)
        const res = data.length ? data[0] : {};
       console.log(res)
       if(res.remarks === 'success'){
         this.GetBillingdetaillist();
        this.compacctToast.clear();
        this.compacctToast.add({
          key: "compacct-toast",
          severity: "success",
          summary: 'success',
          detail: "Succesfully Saved."
        });
       } else {
        this.compacctToast.clear();
        this.compacctToast.add({
          key: "compacct-toast",
          severity: "error",
          summary: "Error",
          detail: "Error Occured"
        });
       }
        
  
       })
    } else {
        this.compacctToast.clear();
        this.compacctToast.add({
          key: "compacct-toast",
          severity: "error",
          summary: "Error",
          detail: "Refund Amount Not Found or Set as 0."
        });
    }
  }
}
class StusearchForm{
  Search_BY = "Mobile";
  Search_Type = "Similar To";
  Search_Value : string;
  Foot_Fall_ID : number;
  Lead_ID:String;
}

 class Studetail{
  Foot_Fall_ID : number;
  Contact_Name : string;
  Class_Name : string;
  Mobile : string;
  Pin : string;
  City : string;

}
class ManualPaymentCnfm {
  Foot_Fall_ID:string;	
  Contact_Name : string; 
  Amount:string;
  Bank_Txn_ID:string;
  Bank_Name:string; 
  Remarks :string;  
  User_ID:any; 
}
class LedgerDetails {
  Report_type = 'Detail Print';
  StDate:string;
  EndDate:string;
  Foot_Fall_ID:string;
  Patient_Name:string;
}
class StudentEdit {
  Ref_Code : string;
  school  : string;
  Pin  : string;
  Class_ID   : string;
  Foot_Fall_ID : string;
  Contact_Name : string;
}
class Followup {
  Foot_Fall_ID: String;
  Lead_ID: String;
  Contact_Name:string;
  User_ID: String;
  Current_Action: String;
  Followup_Details: String;
  Followup_Action: String;
  Status: String;
  Sent_To: String;
  Next_Followup: String;
  Fathers_Occupation: String;
  Pin: String;
  School: String;
  frd_viewd: String;
  Request_Type_id:String;
  Request_Type:String;
  Call_Req:string;
  }