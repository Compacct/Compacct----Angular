import { Browser } from '@syncfusion/ej2-base';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MessageService } from 'primeng/components/common/messageservice';
import { DateTimeConvertService } from '../../../../shared/compacct.global/dateTime.service';
import { CompacctCommonApi } from '../../../../shared/compacct.services/common.api.service';
import { CompacctHeader } from '../../../../shared/compacct.services/common.header.service';
import { CompacctGlobalApiService } from '../../../../shared/compacct.services/compacct.global.api.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-contract-voucher-v2',
  templateUrl: './contract-voucher-v2.component.html',
  styleUrls: ['./contract-voucher-v2.component.css'],
  providers: [MessageService],
  encapsulation: ViewEncapsulation.None
})
export class ContractVoucherV2Component implements OnInit {
items:any = [];
menuList:any =[];
tabIndexToView= 0;
AllData:any =[];
buttonname = "Create";
initDateValid: any = [];
ObjContract:Contract = new Contract();
ObjOther : Other = new Other();
ObjBrowse : Browse = new Browse();
ContractFormSubmitted = false;
companyDataList:any =[];
costCenterList:any =[];
initDate:any = [];
Searchedlist = [];
BankData =[];
Voucher_Date = new Date();
Cheque_Date = new Date();
vouchermaxDate = new Date();
voucherminDate = new Date();
voucherdata = new Date();
userType = "";
LedgerList:any = [];
ToLedgerList:any =[];
VoucherTypeID = 0;
LedgerId =0;
datePickerdis = false;
VoucherId= undefined;
masterVoucherId :any ;
ContractFormSubmittedAdd = false;
lowerAddList:any = [];
showTost = true;
Spinner = false;
labelText1:string = "";
labelText2:string = "";
labelText3:string = "";
labelText4:string = "";
DynamicHeader:any = []
voucherNo = "";
  constructor(
    private header:CompacctHeader,
    private $http: HttpClient,
    private GlobalAPI:CompacctGlobalApiService,
    private compacctToast:MessageService,
    private DateService: DateTimeConvertService,
    private route: ActivatedRoute,
    public $CompacctAPI: CompacctCommonApi, 
  ) { 
    this.route.queryParams.subscribe(params => {
      this.VoucherTypeID = params['Voucher_Type_ID'];
      console.log("params",params)
    })
  }

ngOnInit() {
    this.items = ["BROWSE", "CREATE","REPORT"];
    this.menuList = [
      { label: "Edit", icon: "pi pi-fw pi-product-edit" },
      { label: "Delete", icon: "fa fa-fw fa-trash" }
    ];
    this.header.pushHeader({
      Header: "Contra Voucher",
      Link: " Financial Management ->Voucher -> Contra Voucher V2"
    })
    this.companyData();
    this.costCenterData();
    this.Finyear();
    this.userType = this.$CompacctAPI.CompacctCookies.User_Type
    if(this.VoucherTypeID){
      this.LedgerData();
      this.ToLedgerData();
    }
    
}
TabClick(e) {
    this.tabIndexToView = e.index;
    this.items = ["BROWSE", "CREATE","REPORT"];
    this.buttonname = "Create";
    this.clearData();
}
clearData(){
    this.ContractFormSubmitted = false;
    this.ObjContract = new Contract();
    this.ObjOther = new Other();
    this.ObjContract.Company_ID	= this.companyDataList[0].Company_ID;					
    // this.Voucher_Date = this.voucherdata;
    this.Voucher_Date = new Date();
    // this.initDate = [];
    this.Cheque_Date = new Date(this.Cheque_Date.setDate(new Date().getDate()));
    this.companyData();
    this.costCenterData();
    this.VoucherId = undefined;
    this.showTost = true;
    this.lowerAddList = [];
    this.voucherNo = ""
    this.ContractFormSubmittedAdd = false
}
companyData(){
    const obj = {
      "SP_String":"sp_Comm_Controller",
      "Report_Name_String": "Dropdown_Company"
      
    }
     this.GlobalAPI.getData(obj)
     .subscribe((data:any)=>{
      if(data.length) {
        this.companyDataList = data;
        console.log("companyDataList==",this.companyDataList);
        this.ObjContract.Company_ID = this.companyDataList[0].Company_ID
        this.ObjBrowse.Company_ID = this.companyDataList[0].Company_ID
      } 
      else {
        this.companyDataList = [];
      }
      }); 
}
costCenterData(){
    const obj = {
     "SP_String": "sp_Comm_Controller",
     "Report_Name_String" : "Get_Master_Cost_Center_Dropdown"
   }
   this.GlobalAPI.getData(obj).subscribe((data:any)=>{
    //console.log("LedgerList======",data);
     if(data.length) {
       data.forEach(element => {
         element['label'] = element.Cost_Cen_Name,
         element['value'] = element.Cost_Cen_ID								
       });
       this.costCenterList = data; 
       this.ObjContract.Cost_Cen_ID= this.$CompacctAPI.CompacctCookies.Cost_Cen_ID,
       this.ObjOther.Cost_Cen_ID= this.$CompacctAPI.CompacctCookies.Cost_Cen_ID,
       this.ObjBrowse.Cost_Cen_ID = this.$CompacctAPI.CompacctCookies.Cost_Cen_ID								  
     } 
     else {
       this.costCenterList = [];
     }
   console.log("costCenterList======",this.costCenterList);
   });
}
getDateRange(dateRangeObj) {
   if (dateRangeObj.length) {
     this.ObjBrowse.st_dt_time = dateRangeObj[0];
    this.ObjBrowse.end_dt_time = dateRangeObj[1];
   }
}
Finyear() {
  this.$http
    .get("Common/Get_Fin_Year_Date?Fin_Year_ID=" + this.$CompacctAPI.CompacctCookies.Fin_Year_ID)
    .subscribe((res: any) => {
    let data = JSON.parse(res)
     this.vouchermaxDate = new Date(data[0].Fin_Year_End);
   this.voucherminDate = new Date(data[0].Fin_Year_Start);
   this.voucherdata = new Date().getMonth() > new Date(data[0].Fin_Year_End).getMonth() ? new Date() : new Date(data[0].Fin_Year_End)
   this.initDate =  [new Date(data[0].Fin_Year_Start) , new Date(data[0].Fin_Year_End)]
    });
}

GetSearchedList(){
  this.Searchedlist = [];
const start = this.ObjBrowse.st_dt_time
? this.DateService.dateConvert(new Date(this.ObjBrowse.st_dt_time))
: this.DateService.dateConvert(new Date());
const end = this.ObjBrowse.end_dt_time
? this.DateService.dateConvert(new Date(this.ObjBrowse.end_dt_time))
: this.DateService.dateConvert(new Date());
const tempobj = {
  st_dt_time : start,
  end_dt_time : end,
  Cost_Cen_ID: Number(this.ObjBrowse.Cost_Cen_ID),
  Voucher_Type_ID	:Number(this.VoucherTypeID),
  Company_ID : Number(this.ObjBrowse.Company_ID),
  proj : "N"
}
console.log("tempobj==",tempobj)
const obj = {
"SP_String": "SP_Acc_Journal",
"Report_Name_String": "BL_Txn_Acc_Journal_Browse",
"Json_Param_String": JSON.stringify([tempobj])
}
this.GlobalAPI.getData(obj).subscribe((data:any)=>{
 this.Searchedlist = data;
 this.DynamicHeader = Object.keys(data[0]);
 this.Searchedlist = data;
 console.log('Search list=====',this.Searchedlist)
})
}
LedgerData(){
  const obj = {
    "SP_String": "SP_Financial_Voucher",
    "Report_Name_String": "Get_Ledger",
    "Json_Param_String": JSON.stringify({Topper : 'Y',Type_ID: Number(this.VoucherTypeID)})
 }
 this.GlobalAPI.getData(obj).subscribe((data:any)=>{
 this.LedgerList = data
  console.log("LedgerData======",this.LedgerList);
});
}
ToLedgerData(){
  const obj = {
    "SP_String": "SP_Financial_Voucher",
    "Report_Name_String": "Get_Ledger",
    "Json_Param_String": JSON.stringify({Topper : 'N',Type_ID: Number(this.VoucherTypeID)})
 }
 this.GlobalAPI.getData(obj).subscribe((data:any)=>{
 this.ToLedgerList = data
  console.log("ToLedgerData======",this.ToLedgerList);
//    if(data.length) {
//      data.forEach(element => {
//        element['label'] = element.Cost_Cen_Name,
//        element['value'] = element.Cost_Cen_ID								
//      });
//      this.LedgerList = data; 
//    } 
//    else {
//      this.LedgerList = [];
//    }
//  console.log("LedgerData======",this.LedgerList);
});
}
getBankTRTyp(){
  if(this.ObjContract.Ledger_ID){
    this.datePickerdis = true
    const obj = {
      "SP_String": "SP_Financial_Voucher",
      "Report_Name_String": "Get_Bank_Txn_Type",
      "Json_Param_String": JSON.stringify({ledger_id: Number(this.ObjContract.Ledger_ID)})
    }
     this.GlobalAPI.getData(obj)
     .subscribe((data:any)=>{
      //console.log("BankData==",data);
      if(data.length) {
        this.BankData = data;
        console.log("BankData==",this.BankData);
      } 
      else {
        this.BankData = [];
      }
      }); 
  }
  else {
    this.datePickerdis = false
  }

}
getBankTRNType(id:any){
  console.log("Type Check",typeof(id));
  if(id){
     if(Number(id)=== 1){
      this.labelText1 = "Transaction No"
      this.labelText2 = "Transaction Date"
      this.labelText3 = "Bank Name"
      this.labelText4 = "Bank Branch Name"
     }
     else if(Number(id)=== 2){
      this.labelText1 = ""
      this.labelText2 = ""
      this.labelText3 = ""
      this.labelText4 = ""
     }
     else if(Number(id)=== 3){
      this.labelText1 = "Cheque No"
      this.labelText2 = "Cheque Date"
      this.labelText3 = "Bank Name"
      this.labelText4 = "Bank Branch Name"
     }
     else if(Number(id)=== 4){
      this.labelText1 = "NEFT No"
      this.labelText2 = "NEFT Date"
      this.labelText3 = ""
      this.labelText4 = ""
     }
     else if(Number(id) === 6){
      this.labelText1 = "Transaction No"
      this.labelText2 = "Transaction Date"
      this.labelText3 = "Card Issue Bank"
      this.labelText4 = ""
     }
     else if(Number(id)=== 7){
      this.labelText1 = "Transaction No"
      this.labelText2 = "Transaction Date"
      this.labelText3 = ""
      this.labelText4 = ""
     }
     else if(Number(id)=== 5){
      this.labelText1 = "Transaction No"
      this.labelText2 = "Transaction Date"
      this.labelText3 = "Finance"
      this.labelText4 = ""
     }
  }
}
GetSameCostCenANDledger() {
  const sameCostCenWithSameLedger = this.lowerAddList.filter(item=> Number(item.Cost_Cen_ID) === Number(this.ObjOther.Cost_Cen_ID) && Number(item.Ledger_ID) === Number(this.ObjOther.Ledger_ID));
  if(sameCostCenWithSameLedger.length) {
    this.compacctToast.clear();
        this.compacctToast.add({
          key: "compacct-toast",
          severity: "error",
          summary: "Warn Message",
          detail: "Same ledger with same costcenter can't be added."
        });
    return false;
  }
  else {
    return true;
  }
}
AddData(valid:any){
  this.ContractFormSubmittedAdd = true;
 if(valid && this.GetSameCostCenANDledger()){
  if( this.ObjOther.Cost_Cen_ID == this.ObjContract.Cost_Cen_ID && this.ObjOther.Ledger_ID == this.ObjContract.Ledger_ID){
   this.showTost = false
   this.compacctToast.clear();
    this.compacctToast.add({
      key: "c",
      sticky: true,
      severity: "error",
      summary: "From Cost Center, Ledger & To Cost Center, Ledger should not be same",
     // detail: "Confirm to proceed"
    });
    return
  }
  else {
    this.showTost = true
      // this.ObjContract.Voucher_Date = this.DateService.dateConvert(new Date(this.Voucher_Date));
  // this.ObjContract.Cheque_Date = this.DateService.dateConvert(new Date(this.Cheque_Date));
  const cosCenterFilter:any = this.costCenterList.filter((el:any)=> Number(el.Cost_Cen_ID) === Number(this.ObjOther.Cost_Cen_ID	))[0]
  const ledgerFilter:any = this.ToLedgerList.filter((el:any)=> Number(el.value) === Number(this.ObjOther.Ledger_ID))[0]
  const addTempObj = {
    Ledger_ID:Number(this.ObjOther.Ledger_ID),
    Ledger_Name : ledgerFilter.label,
    Cost_Cen_ID	:  Number(this.ObjOther.Cost_Cen_ID),
    Cost_Cen_Name : cosCenterFilter.Cost_Cen_Name,
    Cost_Cen_ID_Trn : Number(this.ObjOther.Cost_Cen_ID),
    DR_Amt: Number(this.ObjOther.DR_Amt),
    Is_Topper:"N",
    Reminder_Req: this.ObjOther.Reminder_Req,
    Reminder_Date: this.ObjOther.Reminder_Date,
    Reminder_Type: this.ObjOther.Reminder_Type,
    Sub_Ledger_ID: this.ObjOther.Sub_Ledger_ID,
    Voucher_Type_ID: this.ObjOther.Voucher_Type_ID,
    Cost_Head_ID: this.ObjOther.Cost_Head_ID,
    CR_Amt: this.ObjOther.CR_Amt,
    Adjustment_Doc_No: this.ObjOther.Adjustment_Doc_No,
    Prev_doc_no: this.ObjOther.Prev_doc_no,
  }
  this.lowerAddList.push(addTempObj);
  let backUPobj = {...this.ObjOther}
  this.ObjOther = new Other()
  // this.ObjOther.Cost_Cen_ID=  backUPobj.Cost_Cen_ID								
  this.ContractFormSubmittedAdd = false
  this.ObjOther.Cost_Cen_ID= this.$CompacctAPI.CompacctCookies.Cost_Cen_ID;
  }

 }
 console.log("AddData....>>",this.ObjContract,this.ObjOther)
}
getToFix(n:any){
 return Number(Number(n).toFixed())
}
Delete(index){
  this.lowerAddList.splice(index, 1);
}
GetTotalDR(){
  let flg:Number = 0
  this.lowerAddList.forEach(ele => {
    flg += ele.DR_Amt
  });
  return Number(Number(flg).toFixed())
}
saveData(valid){
  this.ContractFormSubmitted = true
  if(valid){
    if(Number(this.ObjContract.CR_Amt) === this.GetTotalDR()){
       this.ObjContract.Voucher_Date = this.DateService.dateConvert(new Date(this.Voucher_Date));
        this.ObjContract.Cheque_Date = this.DateService.dateConvert(new Date(this.Cheque_Date));
        this.ObjContract.Voucher_Type_ID = Number(this.VoucherTypeID);
        this.ObjContract.User_ID = Number(this.$CompacctAPI.CompacctCookies.User_ID);
        this.ObjContract.Fin_Year_ID = Number(this.$CompacctAPI.CompacctCookies.Fin_Year_ID);
        this.ObjContract.bottom = this.lowerAddList;
        this.ObjContract.Reconsil_Date = this.ObjContract.Reconsil_Date;
        this.ObjContract.Reconsil_Tag = this.ObjContract.Reconsil_Tag;
        this.ObjContract.Sub_Ledger_ID = this.ObjContract.Sub_Ledger_ID;
        this.ObjContract.DR_Amt = this.ObjContract.DR_Amt;
        this.ObjContract.Cost_Head_ID = this.ObjContract.Cost_Head_ID;
        this.ObjContract.Cost_Cen_ID_Trn = this.ObjContract.Cost_Cen_ID;
        this.ObjContract.Project_ID = this.ObjContract.Project_ID;
        this.ObjContract.Posted_On = this.ObjContract.Posted_On;
      this.showTost = true
      this.ContractFormSubmitted = false
      console.log("rowObjContract>>>",this.ObjContract)
      let reportname = ""
      let mes = ""
      if(this.voucherNo){
        reportname = "BL_Txn_Acc_Journal_Update"
        mes = "Update"
        this.ObjContract.Voucher_No = this.voucherNo
      }
      else {
        reportname = "BL_Txn_Acc_Journal_Create"
        mes = "Create"
      }
      const obj = {
        "SP_String": "SP_Acc_Journal",
        "Report_Name_String": reportname,
        "Json_Param_String": JSON.stringify([this.ObjContract])
       }
       this.GlobalAPI.getData(obj)
       .subscribe((data:any)=>{
        console.log("Final save data ==",data);
        if (data[0].Column1){
          this.items = ["BROWSE", "CREATE","REPORT"];
          this.compacctToast.clear();
          this.compacctToast.add({
            key: "compacct-toast",
            severity: "success",
            summary: "Contract Voucher "+mes,
            detail: "Succesfully " 
          });
          }
          this.Spinner = false;
          this.LedgerId =0;
          this.tabIndexToView = 0;
          this.voucherNo = ""
          this.ContractFormSubmitted = false;
          this.ObjContract = new Contract();
          this.clearData()
          this.GetSearchedList()
        });
    }
    else {
      this.showTost = false
      this.compacctToast.clear();
      this.compacctToast.add({
        key: "c",
        sticky: true,
        severity: "error",
        summary: "Total Dr Amount and Cr Amount not match",
       // detail: "Confirm to proceed"
      });
    }
  }
}
EditVoucher(voucherObj:any){
  this.VoucherId= undefined
  if (voucherObj.Voucher_No) {
    this.VoucherId= undefined;
    this.tabIndexToView = 1;
    this.items = ["BROWSE", "UPDATE","REPORT"];
    this.buttonname = "Update";
    this.clearData()
    this.voucherNo = "";
    this.voucherNo = voucherObj.Voucher_No
    this.VoucherId = voucherObj.Voucher_No
   this.GetEditMasterContract(voucherObj.Voucher_No)
   }    
}
GetEditMasterContract(Uid){
const tempobj = {
   Voucher_No : this.VoucherId,
}
const obj = {
  "SP_String": "SP_Acc_Journal",
  "Report_Name_String":"BL_Txn_Acc_Journal_Get",
  "Json_Param_String": JSON.stringify([tempobj]) 
 }
 this.GlobalAPI.getData(obj).subscribe((res:any)=>{
  //  console.log("EditMasterdata===",data);
  // this.ObjContract = data[0];
  // this.ObjOther =data[0];
  let data = JSON.parse(res[0].topper)
  console.log("data",data)
  this.Voucher_Date = new Date(data[0].Voucher_Date);
  this.ObjContract = data[0]
  this.getBankTRTyp()
  this.ObjContract.Bank_Txn_Type = Number(data[0].Bank_Txn_Type)
  this.getBankTRNType(this.ObjContract.Bank_Txn_Type)
  this.ObjContract.Voucher_No = data[0].voucher_No
  this.lowerAddList = data[0].bottom
 })
}
DeleteVoucher(masterVoucher): void{
 this.masterVoucherId =undefined
if(masterVoucher.Voucher_No){
  this.masterVoucherId= masterVoucher.Voucher_No
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
onConfirm(){
if(this.masterVoucherId){
  const tempobj = {
  Voucher_No : this.masterVoucherId,
  User_ID: this.$CompacctAPI.CompacctCookies.User_ID
  }
  const obj = {
    "SP_String": "SP_Acc_Journal",
    "Report_Name_String": "BL_Txn_Acc_Journal_Delete",
    "Json_Param_String": JSON.stringify([tempobj])
  }
  this.GlobalAPI.getData(obj).subscribe((data:any)=>{
    // console.log("del Data===", data[0].Column1)
    if (data[0].Column1 === "Done"){
      this.onReject();
      this.GetSearchedList()
      this.compacctToast.clear();
      this.compacctToast.add({
        key: "compacct-toast",
        severity: "success",
        summary: "Voucher_No: " + this.masterVoucherId.toString(),
        detail: "Succesfully Deleted"
      });
      this.masterVoucherId = undefined ;
     }
  })
}
}
onReject() {
  this.compacctToast.clear('c');
  this.showTost = true
}
buttonChek(){
  let flg = true;
  if(this.GetTotalDR() && this.ObjContract.CR_Amt){
    if(this.GetTotalDR() == this.ObjContract.CR_Amt){
      flg = false
    }
    else {
      flg = true
    }
  }
  else {
    flg = true
  }
  return flg
}
}
class Contract{
  Company_ID:any;
  Voucher_No: any;
  Voucher_Type_ID :any;
  Ledger_ID:any = undefined;
  Cost_Cen_ID	:any;
  CR_Amt:any;
  Bank_Txn_Type :any;
  Voucher_Date:any;
  Cheque_Date:any;
  Cheque_No:any;
  Bank_Branch_Name:any;
  Bank_Name:any;
  Naration:any;
  Auto_Posted='N';
  Status='A';
  Foot_Fall_ID=0;
  bottom:any;
  Fin_Year_ID:any;
  User_ID:any;
  Is_Topper:string = "Y"

  Reconsil_Date= "01/01/1900";			
  Reconsil_Tag=  "N";			
	Sub_Ledger_ID= 0;							
	DR_Amt= 0;						
	Cost_Head_ID= 0;			
  Cost_Cen_ID_Trn= 0;			
	Project_ID= 0;					
	Posted_On= "01/01/1900";
}
class Other{
  Ledger_ID:any;
  Cost_Cen_ID	:any;
  Cost_Cen_ID_Trn :any;
  DR_Amt:any;
 
  Reminder_Req ="N";	
	Reminder_Date	 ="01/01/1900";
	Reminder_Type	 ="NA";			
	Sub_Ledger_ID	= 0;		
	Voucher_Type_ID= 0;			
	Cost_Head_ID= 0;				
	CR_Amt= 0;							
	Adjustment_Doc_No	= "NA";	
	Prev_doc_no	= "NA";			
				
}
class Browse{
  Company_ID:any
  Voucher_Type_ID	:any;		  
  Cost_Cen_ID	:any;			 
  st_dt_time :any;				  
  end_dt_time :any;
}			 
