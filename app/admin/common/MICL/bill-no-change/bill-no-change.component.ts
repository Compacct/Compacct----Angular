import { Component, OnInit, ViewEncapsulation, ViewChild } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { MessageService } from "primeng/api";
import { FileUpload } from "primeng/primeng";
import { data } from "jquery";
import { Console } from "console";
import { ActivatedRoute } from "@angular/router";
import { takeUntil } from "rxjs/operators";
import { CompacctCommonApi } from "../../../shared/compacct.services/common.api.service";
import { CompacctHeader } from "../../../shared/compacct.services/common.header.service";
import { CompacctGlobalApiService } from "../../../shared/compacct.services/compacct.global.api.service";
import { DateTimeConvertService } from "../../../shared/compacct.global/dateTime.service";
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-bill-no-change',
  templateUrl: './bill-no-change.component.html',
  styleUrls: ['./bill-no-change.component.css'],
  providers:[MessageService],
  encapsulation: ViewEncapsulation.None
})
export class BillNoChangeComponent implements OnInit {
  buttonname  : any = 'Create';
  AllData : any = [];
  seachSpinner : any= false;
  Spinner : any = false;
  ObjSaleBillNoChange : SaleBillNoChange = new SaleBillNoChange();
  SaleBillNoChangeFormSubmitted:boolean = false;
  SaleBillNoList:any = [];
  BillNO:any;
  SaleBillNOChanged:any;
  Buttondisabled:boolean = false;

  constructor(
    private $http : HttpClient,
    private commonApi : CompacctCommonApi,
    private Header : CompacctHeader,
    private GlobalAPI : CompacctGlobalApiService,
    private route : ActivatedRoute,
    private compacctToast : MessageService,
    private DateService : DateTimeConvertService,
    private $CompacctAPI: CompacctCommonApi
  ) { }

  ngOnInit() {
    this.Header.pushHeader({
      Header:  "Bill Number Changed " ,
      Link: "Bill Number Changed " 
    });
    // this.initDate = [new Date(),new Date()];
    this.GetSaleBillNoChange();
    // this.Finyear();
    this.BillNO = "1234567890"
    this.ObjSaleBillNoChange.Changed_Bill_No = undefined;
    this.ObjSaleBillNoChange.Password = undefined;
    this.Buttondisabled = false;
  }
  onConfirm(){}
  onReject(){}
  GetSaleBillNoChange(){
      const obj = {
        "SP_String": "SP_Bill_No_Change",
        "Report_Name_String": "Get_Sale_Bill_No"
      }
      this.GlobalAPI.getData(obj).subscribe((data: any) => {
        if(data.length) {
            data.forEach(element => {
              element['label'] = element.Doc_No,
              element['value'] = element.Doc_No
            });
            this.SaleBillNoList = data;
          } else {
            this.SaleBillNoList = [];
          }
      })
  }
  GetBillNo() {
    if (this.ObjSaleBillNoChange.Sale_Bill_No) {
      const objbillno = this.SaleBillNoList.filter(item=> item.Doc_No == this.ObjSaleBillNoChange.Sale_Bill_No)

      this.SaleBillNOChanged = objbillno[0].Doc_No;
      var splitlast3digit = this.SaleBillNOChanged.slice(0,13);
      this.BillNO = splitlast3digit;
      var last3digit = this.SaleBillNOChanged.slice(13);
      this.ObjSaleBillNoChange.Changed_Bill_No = last3digit;
    }
     else {
      this.SaleBillNOChanged = undefined;
      this.BillNO = undefined;
      this.ObjSaleBillNoChange.Changed_Bill_No = undefined;
      }
  }
  PasswordCheck(valid){
    this.SaleBillNoChangeFormSubmitted = true;
    if(valid){
    if(this.ObjSaleBillNoChange.Password){
     const obj = {
       "SP_String": "SP_Bill_No_Change",
       "Report_Name_String": "Check_Password",
       "Json_Param_String": JSON.stringify([{Password : this.ObjSaleBillNoChange.Password}])
     }
     this.GlobalAPI.getData(obj).subscribe((data:any)=>{
       if(data[0].Column1 === "OK"){
         this.ChangeNo();
       }
       else {   
        this.Buttondisabled = false;
        this.Spinner = false;
        this.seachSpinner = false;
        this.compacctToast.clear();
        this.compacctToast.add({
            key: "compacct-toast",
            severity: "error",
            summary: "Warn Message",
            detail: "Wrong Password "
          });
       }
     })
   }
   }
  }
  ChangeNo(){
    // if(valid){
      var ChangedbillNo = this.BillNO + this.ObjSaleBillNoChange.Changed_Bill_No
      const SaveData ={
        Doc_No : this.ObjSaleBillNoChange.Sale_Bill_No,
        Change_Doc_No : ChangedbillNo
      }
      const obj = {
        "SP_String": "SP_Bill_No_Change",
        "Report_Name_String": "Update_Bill_No",
        "Json_Param_String": JSON.stringify([SaveData])
      }
      this.GlobalAPI.getData(obj).subscribe((data: any) => {
        var tempID = data[0].Column1;
        if (data[0].Column1 === "Done") {
          this.compacctToast.clear();
          this.compacctToast.add({
            key: "compacct-toast",
            severity: "success",
            // summary: tempID,
            detail: "successfully Changed Number. ",
          });
          this.ObjSaleBillNoChange = new SaleBillNoChange();
          this.SaleBillNOChanged = undefined;
          this.BillNO = undefined;
          this.ObjSaleBillNoChange.Changed_Bill_No = undefined;
          this.SaleBillNoChangeFormSubmitted = false;
          this.GetSaleBillNoChange();
        }
        else {
          this.Spinner = false;
          this.seachSpinner = false;
          this.compacctToast.clear();
          this.compacctToast.add({
            key: "compacct-toast",
            severity: "error",
            summary: "Warn Message",
            detail: tempID
          });
        }
      }); 
    // }
  }

}
class SaleBillNoChange {
  Sale_Bill_No : any;
  Changed_Bill_No : any;
  Password : any;
}
