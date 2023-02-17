import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MessageService } from 'primeng/api';
import { DateTimeConvertService } from '../../../shared/compacct.global/dateTime.service';
import { CompacctCommonApi } from '../../../shared/compacct.services/common.api.service';
import { CompacctHeader } from '../../../shared/compacct.services/common.header.service';
import { CompacctGlobalApiService } from '../../../shared/compacct.services/compacct.global.api.service';
import { DateNepalConvertService } from "../../../shared/compacct.global/dateNepal.service"
@Component({
  selector: 'app-bl-txn-grn-np',
  templateUrl: './bl-txn-grn-np.component.html',
  styleUrls: ['./bl-txn-grn-np.component.css'],
  providers: [MessageService],
  encapsulation: ViewEncapsulation.None
})
export class BLTxnGrnNPComponent implements OnInit {
  tabIndexToView: number = 0;
  items: any = [];
  buttonname: string = "Create";
  ObjGRN: GRN = new GRN();
  GRNcreatFormSubmitted: boolean = false;
  GRN_Date: any = {} ;
  SEDate: any = {};
  INVDate: any = {} ;
  constructor(
    private $http: HttpClient,
    private GlobalAPI: CompacctGlobalApiService,
    private Header: CompacctHeader,
    private DateService: DateTimeConvertService,
    private DateNepalConvertService : DateNepalConvertService,
    public $CompacctAPI: CompacctCommonApi,
    private compacctToast: MessageService,
  ) {}

  ngOnInit() {
    this.items = ["Browse", "Create", "Pending PO"];
    this.Header.pushHeader({
      Header: "BL TXN GRN ",
      Link: " Procurement -> Master-> BL TXN GRN "
    });
    this.GRN_Date = this.DateNepalConvertService.GetNepaliCurrentDateNew(); 
    this.SEDate = this.DateNepalConvertService.GetNepaliCurrentDateNew();
    this.INVDate = this.DateNepalConvertService.GetNepaliCurrentDateNew();
  }
   TabClick(e) {
    this.tabIndexToView = e.index;
     this.items = ["Browse", "Create", "Pending PO"];
     this.ClearData();
   }
  ClearData() {
    this.ObjGRN = new GRN();
    this.GRNcreatFormSubmitted = false;
    this.GRN_Date = this.DateNepalConvertService.GetNepaliCurrentDateNew(); 
    this.SEDate = this.DateNepalConvertService.GetNepaliCurrentDateNew();
    this.INVDate = this.DateNepalConvertService.GetNepaliCurrentDateNew();
  }
  SaveGRN(valid:any) {
    this.GRNcreatFormSubmitted = true;
    if (valid) {
      
    }
  }
}
class GRN{
  Company_ID: any;
  Sub_Ledger_ID: any;
  Cost_Cen_ID:any ;
  godown_id:any ;
  SE_No: any;
  INV_No: any;
  Vehicle_No: any;
  LR_No_Date: any;
  Mode_Of_transport: any
  PO_Number: any;
  Remarks: any;
  Received: any;
  Challan: any;
}
