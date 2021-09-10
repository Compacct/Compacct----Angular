import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-inward-outward-register',
  templateUrl: './inward-outward-register.component.html',
  styleUrls: ['./inward-outward-register.component.css']
})
export class InwardOutwardRegisterComponent implements OnInit {
  //tab
tabIndexToView = 0;
items = [];
  constructor() { }   

  ngOnInit() {   
    this.items = [ 'SERVICE', 'NEW HA', 'NEW HA CUSTOM' , 'NEW HA RIC' , 'EAR MOULD'];
  }
  // Clear & Tab
TabClick(e) {
  this.tabIndexToView = e.index;
  //console.log('this.tabIndexToView =', this.tabIndexToView);

} 

}
