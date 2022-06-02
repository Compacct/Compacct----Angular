import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { CompacctCommonApi } from "../../../compacct.services/common.api.service";
import { CompacctGlobalApiService } from '../../../../shared/compacct.services/compacct.global.api.service';
declare var $: any;

@Component({
  selector: 'app-compacctgstandcustomduty',
  templateUrl: './compacctgstandcustomduty.component.html',
  styleUrls: ['./compacctgstandcustomduty.component.css']
})
export class CompacctgstandcustomdutyComponent implements OnInit {
  ObjGstandCustonDuty = new GstandCustonDuty();
  gstData = [];
  AllgstlData = [];
  GstAndCustomFormSubmit:any = false;
  private _required: boolean;

  @Output() GstandCustonDutyObj = new EventEmitter <GstandCustonDuty>();
  @Input()  set required(value: boolean) {
    this._required = value;
    if (this._required) {
      this.GstAndCustomFormSubmit = this.ObjGstandCustonDuty.Cat_ID ? true : false;
    } else {
      this.GstAndCustomFormSubmit = this.ObjGstandCustonDuty.Cat_ID ? true : false;
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

}
class GstandCustonDuty {
  Cat_ID: number;
  HSN_SAC_Code: string;
  Custom_Duty: number;
  Remarks: string;
}
