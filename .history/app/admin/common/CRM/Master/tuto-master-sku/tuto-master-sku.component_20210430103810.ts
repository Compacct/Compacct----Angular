import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MessageService } from 'primeng/api';
import { CompacctHeader } from '../../../../shared/compacct.services/common.header.service';
import { CompacctGlobalApiService } from '../../../../shared/compacct.services/compacct.global.api.service';

@Component({
  selector: 'app-tuto-master-sku',
  templateUrl: './tuto-master-sku.component.html',
  styleUrls: ['./tuto-master-sku.component.css'],
  providers: [MessageService],
  encapsulation: ViewEncapsulation.None
})
export class TutoMasterSkuComponent implements OnInit {
  SKUList = [];
  seachSpinner = false;

  constructor(private Header: CompacctHeader,
    private $http : HttpClient,
    private GlobalAPI: CompacctGlobalApiService,
    private compacctToast: MessageService) { }

  ngOnInit() {
    this.Header.pushHeader({
      Header: "Master SKU",
      Link: "SKU Management -> Master -> Master SKU"
    });
    this.GetSKUlist();
  }
  GetSKUlist() {
    const obj = {
      "Report_Name": "List_Product"
    }
    this.GlobalAPI
        .CommonTaskData(obj)
        .subscribe((data: any) => {
          console.log(data)
    });
  }
}
