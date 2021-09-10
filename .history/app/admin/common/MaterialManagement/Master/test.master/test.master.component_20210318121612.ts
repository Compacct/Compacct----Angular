import { Component, OnInit, ViewEncapsulation} from '@angular/core';
import { HttpClient, HttpParams } from "@angular/common/http";
import { CompacctCommonApi } from "../../../../shared/compacct.services/common.api.service";
import { CompacctHeader } from "../../../../shared/compacct.services/common.header.service";
import { MessageService } from "primeng/api";

@Component({
  selector: 'app-test-master',
  templateUrl: './test.master.component.html',
  styleUrls: ['./test.master.component.css'],
  providers: [MessageService],
  encapsulation: ViewEncapsulation.None
})
export class TestMasterComponent implements OnInit {
  MaterialType_Browse: any;
  MaterialSubType_Browse: any;
  items=[];
  tabIndexToView=0;
  buttonname = "Create";
  ObjCostcenter: Costcenter = new Costcenter();
  ExistNameFlag = false;
  CostcenterFormSubmitted = false;

  constructor(private Header: CompacctHeader,
    private compacctToast: MessageService,
    private $http: HttpClient,
    private commonApi: CompacctCommonApi,) { }

  ngOnInit() {
    this.items = [ "BROWSE" , "CREATE"];
    this.Header.pushHeader({
      Header: "Master Cost Center",
      Link: " Material Management -> Master -> Master Cost Center"
    })
  }
  TabClick(e) {
    this.tabIndexToView = e.index;
    this.items = ["BROWSE", "CREATE"];
    // this.buttonname = "Create";
    // this.clearData();
  }
  CostCenterIniCheck(Cost_Cen_Ini) {
    console.log("Cost_Cen_Ini =", Cost_Cen_Ini);
    console.log("Cost_Cen_Ini 22 =", Cost_Cen_Ini.length);
    this.ExistNameFlag = false;
    if (Cost_Cen_Ini.length === 5) {
      this.$http
        .get(
          "/Master_Cost_Center_V2/Check_Cost_Centre_Ini?Cost_Cen_Ini=" +
            Cost_Cen_Ini
        )
        .subscribe((data: any) => {
          //const data2 = data ? JSON.parse(data) : [];
          const existMsg = data;
          console.log("data =", existMsg);
          if (existMsg !== "[]") {
            console.log("data22 =", existMsg);
            this.ExistNameFlag = true;
            this.compacctToast.clear();
            this.compacctToast.add({
              key: "compacct-toast",
              severity: "error",
              // summary: 'Costcenter ID  :' + this.ObjCostcenter.Cost_Cen_ID ,
              detail: existMsg
            });
          } else {
            this.ExistNameFlag = false;
          }
        });
    }
  }

}

class Costcenter {
  Cost_Cen_ID = 0;
  Cost_Cen_Name: string;
  Cost_Cen_Ini: string;
  Address1: string;
  Address2: string;
  Location: string;
  Country: any;
  PIN: string;
  State: string;
  District: string;
  Mobile: number;
  Phone: number;
  Email1: string;
  Is_Visiable = "Y";
  ZONE: string;
  CATEGORY: any;
  SALE_TARGET: string;
  Parent_Cost_Cen_ID: any;
  Job_Work = 0;
  Cost_Cen_Logo: any;
  GST_NO: string;
  Cost_Cen_Type: string;
}
