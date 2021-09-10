import { Component, OnInit } from '@angular/core';
import { CompacctHeader } from "../../../../shared/compacct.services/common.header.service";

@Component({
  selector: 'app-test-master',
  templateUrl: './test.master.component.html',
  styleUrls: ['./test.master.component.css']
})
export class TestMasterComponent implements OnInit {
items=[]
  constructor() { }

  ngOnInit() {
    this.items = [ "BROWSE" , "CREATE"];
    this.Header.pushHeader({
      Header: "Master Cost Center",
      Link: " Material Management -> Master -> Master Cost Center"
    })
  }

}
