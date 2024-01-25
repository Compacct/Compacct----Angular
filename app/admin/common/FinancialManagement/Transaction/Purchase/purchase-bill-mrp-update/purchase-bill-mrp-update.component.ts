import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MessageService } from 'primeng/api';
import { CompacctHeader } from '../../../../../shared/compacct.services/common.header.service';
import { CompacctGlobalApiService } from '../../../../../shared/compacct.services/compacct.global.api.service';

@Component({
  selector: 'app-purchase-bill-mrp-update',
  templateUrl: './purchase-bill-mrp-update.component.html',
  styleUrls: ['./purchase-bill-mrp-update.component.css'],
  providers: [MessageService],
  encapsulation: ViewEncapsulation.None
})
export class PurchaseBillMrpUpdateComponent implements OnInit {
  tabIndexToView: number = 0;
  seachSpinner:boolean=false;
  CostCenterList:any=[];
  Tablelist:any=[];
  TablelistHeader:any=[];
  objMrpUpdateSearch: MrpUpdateSearch = new MrpUpdateSearch();
  constructor(
    private Header: CompacctHeader,
    private CompacctToast: MessageService,
    private GlobalAPI: CompacctGlobalApiService,
  ) { }

  ngOnInit() {
    this.Header.pushHeader({
      Header: "Purchase Bill MRP Update",
      Link: "Financial Management --> Transaction --> Purchase --> Purchase Bill MRP Update"
    });
  }

  getDateRange(dateRangeObj: any) {
    if (dateRangeObj.length) {
      this.objMrpUpdateSearch.From_Date = dateRangeObj[0];
      this.objMrpUpdateSearch.To_Date = dateRangeObj[1];
    }
  }

  GetAllBrowseData(){

  }

}

class MrpUpdateSearch{
  From_Date : any;
  To_Date : any;
  CostcenterID:any;
}
