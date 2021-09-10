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
  tabIndexToView=0
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

}
