import { Component, OnInit, Output, EventEmitter, Input, SimpleChanges, OnChanges } from '@angular/core';
import { CompacctCommonApi } from "../../../compacct.services/common.api.service";
import { CompacctGlobalApiService } from '../../../../shared/compacct.services/compacct.global.api.service';
declare var $: any;

@Component({
  selector: 'app-compacctgstandcustomduty',
  templateUrl: './compacctgstandcustomduty.component.html',
  styleUrls: ['./compacctgstandcustomduty.component.css']
})
export class CompacctgstandcustomdutyComponent implements OnInit,OnChanges{
  ObjGstandCustonDuty = new GstandCustonDuty();
  gstData = [];
  AllgstlData = [];
  GstAndCustomFormSubmit:any = false;
  _ServiceCheck = false

  @Output() GstandCustonDutyObj = new EventEmitter <GstandCustonDuty>();
  @Input() requirGst :any
  @Input() labelChange = "";
  // @Input() ServiceCheck : boolean;
  
  @Input() set ServiceCheck(value: boolean) {
    this._ServiceCheck = value;
    if (this._ServiceCheck) {
      this.labelChange = "SAC Code";
    } else {
      this.labelChange = "HSN Code";
    }
  }

  constructor(
    private $CompacctAPI: CompacctCommonApi,
    private GlobalAPI:CompacctGlobalApiService) { }

  ngOnInit() {
    this.getGSTTyp();
  }
  
//GST Dropdown
getGSTTyp(){
  this.gstData=[]; 
   this.AllgstlData = [];
      const obj = {
       "SP_String": "SP_Master_Product_New",
       "Report_Name_String":"GST_Category_Dropdown",
      }
      this.GlobalAPI.getData(obj).subscribe((data:any)=>{
       this.gstData = data;
      console.log("gstData==",this.gstData);
       this.gstData.forEach((el : any) => {
         this.AllgstlData.push({
           label: el.Cat_Name,
           value: el.Cat_ID,
         });
       });
     })
}
EventEmitDefault(){
  this.GstandCustonDutyObj.emit(this.ObjGstandCustonDuty);
}
clear() {
  // this.VendorAddressLists = [];
  this.ObjGstandCustonDuty = new GstandCustonDuty();
}
GetEdit(arr:any){
 console.log("GST",JSON.parse(arr))
 let data = JSON.parse(arr)
 const Editdata = data[0]
 this.ObjGstandCustonDuty = Editdata
 setTimeout(() => {
  this.ObjGstandCustonDuty.Cat_ID = Editdata.Cat_ID
  this.ObjGstandCustonDuty.Custom_Duty = Editdata.Custom_Duty
  this.ObjGstandCustonDuty.HSN_NO = Editdata.HSN_NO ? Editdata.HSN_NO : Editdata.HSN_Code 
  this.ObjGstandCustonDuty.Remarks = Editdata.Remarks
 }, 1000);
 this.EventEmitDefault()
 console.log("ObjGstandCustonDuty",this.ObjGstandCustonDuty)
}
ngOnChanges(changes: SimpleChanges) {
        
  //this.doSomething(changes.categoryId.currentValue);
  // You can also use categoryId.previousValue and 
  // categoryId.firstChange for comparing old and new values
 
  if( changes.requirGst){
    this.GstAndCustomFormSubmit = changes.requirGst.currentValue
    console.log("changes >>",changes);
  }
  else if(changes.ServiceCheck){
    console.log("changes Check>>",changes);
    if(changes.ServiceCheck.currentValue){
      this.labelChange = "SAC Code";
    }
    else{
      this.labelChange = "HSN Code";
    }
  }
  
}
}
class GstandCustonDuty {
  Cat_ID: number;
  HSN_NO: string;
  Custom_Duty: number;
  Remarks: string;
}
