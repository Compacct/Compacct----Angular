import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MessageService } from 'primeng/api';
import { DateTimeConvertService } from '../../../shared/compacct.global/dateTime.service';
import { CompacctCommonApi } from '../../../shared/compacct.services/common.api.service';
import { CompacctHeader } from '../../../shared/compacct.services/common.header.service';
import { CompacctGlobalApiService } from '../../../shared/compacct.services/compacct.global.api.service';

@Component({
  selector: 'app-k4-c-bill-date-update',
  templateUrl: './k4-c-bill-date-update.component.html',
  styleUrls: ['./k4-c-bill-date-update.component.css'],
  providers: [MessageService] ,
  encapsulation: ViewEncapsulation.None
})
export class K4CBillDateUpdateComponent implements OnInit {
  tabIndexToView:number = 0;
  UserType:any='';
  DelRight:any='';
  BillDateSubmitted:boolean=false;
  Spinner:boolean=false;

  ObjBill: BillInfo = new BillInfo();
  constructor(
    private header:CompacctHeader,
    private $http: HttpClient,
    private GlobalAPI:CompacctGlobalApiService,
    private compacctToast:MessageService,
    private DateService: DateTimeConvertService,
    public $CompacctAPI: CompacctCommonApi,
  ) { }

  ngOnInit() {
    this.header.pushHeader({
      Header: "K4C Bill Date Update",
      Link: " K4C Management -> K4C Bill Date Update"
    });
    this.UserType = this.$CompacctAPI.CompacctCookies.User_Type;
    this.DelRight= this.$CompacctAPI.CompacctCookies.Del_Right;
    this.ObjBill.Bill_Date= new Date();
  }

  TabClick(e) {
    this.tabIndexToView = e.index;
  }

  UpdateBill(valid:any){
    const TempObj={
      Bill_Date: this.ObjBill.Bill_Date,
      Bill_NO: this.ObjBill.Bill_NO
    }
    console.log("TempObj",TempObj);

    this.Spinner=false;
    this.BillDateSubmitted=true;
    if(valid){
      const obj = {
        "SP_String": "SP_Bill_Date_Update",
        "Report_Name_String": "Update_Bill_Date",
        "Json_Param_String": JSON.stringify(TempObj)
      }

      this.GlobalAPI.postData(obj).subscribe((data: any) => {
        console.log("save data",data);
        if (data[0].Column1){
          this.BillDateSubmitted=false;
          this.Spinner=false;
          this.compacctToast.clear();
          this.compacctToast.add({
            key: "compacct-toast",
            severity: "success",
            summary: "Bill Update",
            detail: "Succesfully "
          });
          this.ObjBill.Bill_Date= new Date();
          this.ObjBill.Bill_NO=undefined;
        }
        else {
          this.Spinner = false;
          this.compacctToast.clear();
          this.compacctToast.add({
            key: "compacct-toast",
            severity: "error",
            summary: "Warn Message ",
            detail:"Error occured "
          });
        }
      });

    }
  }

  onConfirm(){
  }
  onReject(){
  }

}

class BillInfo{
  Bill_NO: any;
  Bill_Date: any;
}
