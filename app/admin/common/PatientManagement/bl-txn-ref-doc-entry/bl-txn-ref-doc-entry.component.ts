import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MessageService } from "primeng/api";
import {CompacctHeader} from "../../../shared/compacct.services/common.header.service"
import { HttpClient, HttpParams } from '@angular/common/http';
import { CompacctGlobalApiService } from '../../../shared/compacct.services/compacct.global.api.service';
import { DateTimeConvertService } from '../../../shared/compacct.global/dateTime.service';
import { CompacctCommonApi } from '../../../shared/compacct.services/common.api.service';

@Component({
  selector: 'app-bl-txn-ref-doc-entry',
  templateUrl: './bl-txn-ref-doc-entry.component.html',
  styleUrls: ['./bl-txn-ref-doc-entry.component.css'],
  providers: [MessageService],
  encapsulation: ViewEncapsulation.None
})
export class BlTxnRefDocEntryComponent implements OnInit {
  items:any = [];
  Spinner = false;
  seachSpinner = false
  tabIndexToView = 0;
  buttonname = "Save"
  ObjDoctorEntry : DoctorEntry = new DoctorEntry ();
  DoctorEntryFormSubmitted = false;
  StateList = [];
  ObjBrowse : Browse  = new Browse();
  SearchFormSubmitted = false;
  Searchedlist = [];
  EditList:any = [];

  constructor(
    private Header: CompacctHeader,
    private $http : HttpClient,
    private GlobalAPI: CompacctGlobalApiService,
    private DateService: DateTimeConvertService,
    public $CompacctAPI: CompacctCommonApi,
    private compacctToast: MessageService,
  ) { }

  ngOnInit() {
    this.items = ["BROWSE", "CREATE"];
    this.Header.pushHeader({
      Header: "Reference Doctor Entry",
      Link: "Patient Management -> Master -> General -> Reference Doctor Entry"
    });
    this.GetState();
    this.GetSearchedList();
  }
  TabClick(e){
    this.tabIndexToView = e.index;
    this.items = ["BROWSE", "CREATE"];
    this.buttonname = "Save";
  }
  GetState(){
    this.StateList = [];
    const obj = {
      "SP_String": "SP_BL_Txn_Ref_Doc_Entry",
      "Report_Name_String": "Get_Location"
    }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      this.StateList = data;
       //console.log("State List ===",this.StateList);
    })
  }
  SaveRefDocName(valid){
    this.DoctorEntryFormSubmitted = true;
    if(valid){
      let spname:any;
      let reportname:any;
      if(this.ObjDoctorEntry.Enq_Source_Sub_ID){
        spname = "SP_BL_Txn_Ref_Doc_Entry",
        reportname = "Update_BL_Txn_Ref_Doc"
      } else {
          spname = "SP_BL_Txn_Ref_Doc_Entry",
          reportname = "Add_BL_Txn_Ref_Doc"
      }
      const obj = {
        "SP_String": spname,
        "Report_Name_String" : reportname,
        "Json_Param_String": JSON.stringify(this.ObjDoctorEntry)
      }
      this.GlobalAPI.postData(obj).subscribe((data:any)=>{
        //console.log(data);
        var tempID = data[0].Column1;
       // this.Objproduction.Doc_No = data[0].Column1;
        if(data[0].Column1){
          this.compacctToast.clear();
         const mgs = this.buttonname === "Save" ? "Saved" : "Updated";
          this.compacctToast.add({
           key: "compacct-toast",
           severity: "success",
           summary:  "Reference Doctor",
           detail: "Succesfully " + mgs
         });
         this.DoctorEntryFormSubmitted = false;
         this.ObjDoctorEntry = new DoctorEntry();
         this.GetSearchedList();
         if(this.buttonname === "Update"){
          this.tabIndexToView = 0;
          this.items = ["BROWSE", "CREATE"];
         }
        } else{
          this.compacctToast.clear();
          this.compacctToast.add({
            key: "compacct-toast",
            severity: "error",
            summary: "Warn Message",
            detail: "Error Occured "
          });
        }
      })
    }
  }
  getDateRange(dateRangeObj) {
    if (dateRangeObj.length) {
      this.ObjBrowse.start_date = dateRangeObj[0];
      this.ObjBrowse.end_date = dateRangeObj[1];
    }
  }
  GetSearchedList(){
    this.SearchFormSubmitted = true;
    this.Searchedlist = [];
      const obj = {
        "SP_String": "SP_BL_Txn_Ref_Doc_Entry",
        "Report_Name_String": "Get_BL_Txn_Ref_Doc"
      }
      this.GlobalAPI.getData(obj).subscribe((data:any)=>{
        this.Searchedlist = data;
        //console.log('Search list=====',this.Searchedlist)
        this.seachSpinner = false;
        this.SearchFormSubmitted = false;
      })
    
  }
  Edit(enqsrcid){
   this.ObjDoctorEntry = new DoctorEntry();
   if(enqsrcid.Enq_Source_Sub_ID){
    this.ObjDoctorEntry.Enq_Source_Sub_ID = enqsrcid.Enq_Source_Sub_ID;
    this.tabIndexToView = 1;
    this.items = ["BROWSE", "UPDATE"];
    this.buttonname = "Update";
    this.GetEdit(this.ObjDoctorEntry.Enq_Source_Sub_ID);
   }
  }
  GetEdit(Enq_Source_Sub_ID){
    this.EditList = [];
    //this.ProductionFormSubmitted = false;
    const obj = {
      "SP_String": "SP_BL_Txn_Ref_Doc_Entry",
      "Report_Name_String": "Retrieve_BL_Txn_Ref_Doc",
      "Json_Param_String": JSON.stringify([{Enq_Source_Sub_ID : Enq_Source_Sub_ID}])
  
    }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      this.EditList = data;
      this.ObjDoctorEntry = data[0];
      // console.log("this.editList  ===",data);
  
  })
  }
  Delete(enqsrcid){
    this.ObjDoctorEntry.Enq_Source_Sub_ID = undefined ;
    if(enqsrcid.Enq_Source_Sub_ID){
      this.ObjDoctorEntry.Enq_Source_Sub_ID = enqsrcid.Enq_Source_Sub_ID;
      this.compacctToast.clear();
      this.compacctToast.add({
        key: "c",
        sticky: true,
        severity: "warn",
        summary: "Are you sure?",
        detail: "Confirm to proceed"
      });
    }
  }
  onConfirm() {
    const Tempobj = {
      Enq_Source_Sub_ID : this.ObjDoctorEntry.Enq_Source_Sub_ID,
      User_ID : this.$CompacctAPI.CompacctCookies.User_ID
    }
    const obj = {
      "SP_String" : "SP_BL_Txn_Ref_Doc_Entry",
      "Report_Name_String" : "Delete_BL_Txn_Ref_Doc",
      "Json_Param_String" : JSON.stringify([Tempobj])
    }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
     // console.log(data);
      if(data[0].Column1 === "Done") {
        this.compacctToast.clear();
        this.compacctToast.add({
          key: "compacct-toast",
          severity: "success",
          summary: "Reference Doctor",
          detail:  "Succesfully Delete"
        });
        this.GetSearchedList();
      } else{
        this.compacctToast.clear();
        this.compacctToast.add({
          key: "compacct-toast",
          severity: "error",
          summary: "Warn Message",
          detail: "Error Occured "
        });
      }
    })
  }
  onReject() {
    this.compacctToast.clear("c");
  }

}

class DoctorEntry {
  Enq_Source_Sub_ID:any;
  Enq_Source_Sub_Name:any;
  Mobile_No:any;
  Location:any;
 }

 class Browse {
  start_date : Date ;
  end_date : Date;
  Brand_ID : string;
}
