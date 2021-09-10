import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { MessageService } from "primeng/api";
import { CompacctHeader } from "../../../../shared/compacct.services/common.header.service";
import { CompacctGlobalApiService } from '../../../../shared/compacct.services/compacct.global.api.service';
import { DateTimeConvertService } from '../../../../shared/compacct.global/dateTime.service';
import { CompacctCommonApi } from '../../../../shared/compacct.services/common.api.service';


@Component({
  selector: 'app-bulk-sms-nepal',
  templateUrl: './bulk-sms-nepal.component.html',
  styleUrls: ['./bulk-sms-nepal.component.css'],
  providers: [MessageService],
  encapsulation: ViewEncapsulation.None
})
export class BulkSmsNepalComponent implements OnInit {
  sendSpinner = false;
  SendEmail1SearchSubmitted = false;
  ObjBulkEmail1 = new BulkEmail1();

  DueCustomerList = [];
  MemberID = 0;
  EmailCounter = 0;
  ProgressPercentage = 0;
  constructor(private $http: HttpClient,
    private Header: CompacctHeader,
    private GlobalAPI: CompacctGlobalApiService,
    private DateService: DateTimeConvertService,
    private compacctToast: MessageService,
    private $CompacctAPI: CompacctCommonApi,) { }

  ngOnInit() {
    this.Header.pushHeader({
      Header: "Bulk Email",
      Link: " CRM -> Report -> Bulk Email"
    });
    this.GetMemberID();
    console.log(this.DueCustomerList);
  }
  GetMemberID() {
  this.$http.get('/BL_CRM_Master_SalesTeam/GetAllData_Sales_Man').subscribe((data: any) => {
    this.MemberID = data[0].Member_ID;
      });
  }
  GetAllCustomer(valid) {
    this.SendEmail1SearchSubmitted = true;
    if (valid) {
      this.sendSpinner = true;
      const QuertString = '?Report_type=' + this.ObjBulkEmail1.Report_type + '&Due_Amount=' + this.ObjBulkEmail1.Due_Amount;
      this.$http.get('/Send_Bulk_Email_Nepal/Get_All_Subledger_Email'+QuertString).subscribe((data: any) => {
        this.DueCustomerList = data ? JSON.parse(data) : [];
        console.log(this.DueCustomerList);
        this.SendMailToAll();
      });
    }
  }
  async SendMailToAll() {
    for (let i = 0; i < this.DueCustomerList.length; i++) {
      console.log('start');
      this.DueCustomerList[i]['Mgs_Body'] = '';
      const BodyData = await this.GetEmailBody(this.DueCustomerList[i]);
      // console.log('BodyData',BodyData);
      this.DueCustomerList[i]['Mgs_Body'] = BodyData;
      const EmailPostData = await this.SendEmail(this.DueCustomerList[i]);
      // console.log('EmailPostData', EmailPostData);
      this.EmailCounter = i + 1;
      this.ProgressPercentage = Number(((this.EmailCounter / this.DueCustomerList.length) * 100).toFixed(2));
    }
    this.EmailCounter = 0;
    this.DueCustomerList = [];
    this.ProgressPercentage = 0;
    this.sendSpinner = false;
    this.compacctToast.clear();
    this.compacctToast.add({
      key: "compacct-toast",
      severity: "success",
      summary: 'BULK EMAIL',
      life : 6000,
      detail: "Succesfully Sent Email To All."
    });
  }
  async GetEmailBody(customer) {
      const headers = new HttpHeaders().set('Content-Type', 'text/plain; charset=utf-8').set('responseType', 'text/html');
      const urlParam = '?Sub_Ledger_ID='+customer.Sub_Ledger_ID + '&Member_ID=' + this.MemberID;
      const response = await this.$http.get('/Send_Bulk_Email_Nepal/Bulk_Email_Aging_Analysis_To_Customer'+urlParam,{ headers, responseType: 'text'}).toPromise();
    return response;
  }
  async SendEmail(customer){
    const obj = {
      "sender":{
      "name":"Sarawagi Group",
      "email":"no-reply@sarawagigroup.com.np"
      },
      "to":[{
      "email":'testxxcompacttoxy@gmail.com',
      "name":customer.Customer_Name
      }],
      "subject":customer.Subject,
      "htmlContent":customer.Mgs_Body
    }
    const httpOptions = {
    headers: new HttpHeaders()
    .set('api-key', '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')
    .set('accept', 'application/json')
    .set('content-type', 'application/json')
    }
    const returnData = await this.$http.post('https://api.sendinblue.com/v3/smtp/email', obj, httpOptions).toPromise();
    return returnData;
  }
}
class BulkEmail1 {
  Report_type: string;
  Due_Amount: string;
}
