import { Component, OnInit, ViewEncapsulation} from '@angular/core';
import { CompacctHeader } from "../../../../shared/compacct.services/common.header.service";

@Component({
  selector: 'app-test-master',
  templateUrl: './test.master.component.html',
  styleUrls: ['./test.master.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class TestMasterComponent implements OnInit {
items=[];
tabIndexToView=0
  constructor(private Header: CompacctHeader) { }

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
