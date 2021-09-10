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
  updateSpinner = false;

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
          this.SKUList = data.length ? data : [];
    });
  }
  UpdateDescription (obj){
    if(obj.Product_ID && obj.Product_Description) {
      this.updateSpinner = true;
      const Tempobj = {
        "Report_Name": "Update_Product_Name",
        "Json_Param_String" : JSON.stringify([{'Product_ID' : obj.Product_ID ,'Product_Description' : obj.Product_Description}])
      }
      this.GlobalAPI
          .CommonTaskData(Tempobj)
          .subscribe((data: any) => {
            console.log(data)
            if(data[0].Remarks === 'success') {
              this.compacctToast.clear();
              this.compacctToast.add({
                key: "compacct-toast",
                severity: "success",
                summary: 'SKU ID : ' + obj.Product_ID,
                detail: "Succesfully Updated."
              });
              this.GetSKUlist();
            }
      });
    }
    if(!obj.Product_Description){
      this.compacctToast.clear();
      this.compacctToast.add({
        key: "compacct-toast",
        severity: "error",
        summary: "Validation Error",
        detail: "Please Enter English Name."
      });
    }
  }
}
