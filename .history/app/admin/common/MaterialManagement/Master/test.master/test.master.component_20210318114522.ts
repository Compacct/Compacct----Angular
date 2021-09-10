import { Component, OnInit, ViewEncapsulation} from '@angular/core';
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

  constructor(private Header: CompacctHeader, private compacctToast: MessageService) { }

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
