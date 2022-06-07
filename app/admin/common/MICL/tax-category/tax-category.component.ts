import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MessageService } from 'primeng/primeng';
import { CompacctCommonApi } from '../../../shared/compacct.services/common.api.service';
import { CompacctHeader } from '../../../shared/compacct.services/common.header.service';
import { CompacctGlobalApiService } from '../../../shared/compacct.services/compacct.global.api.service';

@Component({
  selector: 'app-tax-category',
  templateUrl: './tax-category.component.html',
  styleUrls: ['./tax-category.component.css'],
  providers: [MessageService],
  encapsulation: ViewEncapsulation.None
})
export class TaxCategoryComponent implements OnInit {
  items = [];
  menuList =[];
  tabIndexToView= 0;
  AllData =[];
  buttonname = "Create";
  ObjTax: Tax =new Tax();
  taxId : number ;
  masterTaxId : number;
  TaxFormSubmitted = false;
  TaxCode = undefined;
  IGSTData=[]; 
  AllIGSTData = [];
  CGSTData=[]; 
  AllCGSTData = [];
  SGSTData=[]; 
  AllSGSTData = [];
  IGSToutputData=[]; 
  AllIGSToutputData = [];
  CGSToutputData=[]; 
  AllCGSToutputData = [];
  SGSToutputData=[]; 
  AllSGSToutputData = [];
  Spinner = false;
  can_popup = false;
  act_popup = false;
  // IGST = false;
  // CGST = false; 
  // SGST = false;
  // IGSToutput = false;
  // CGSToutput = false;
  // SGSToutput = false;

  TagIGSTData =[];
  TagCGSTData =[];
  TagSGSTData =[];
  TagIGSTOutputData =[];
  TagCGSTOutputData =[];
  TagSGSTOutputData =[];
  IGST_Check = false;
  CGST_inputckeck = false;
  SGST_inputckeck = false;
  IGST_outputckeck = false;
  CGST_outputckeck = false;
  SGST_outputckeck = false;
  EditList = [];
  
  constructor(
    private http: HttpClient,
    private compact: CompacctCommonApi,
    private header:CompacctHeader, 
    private GlobalAPI:CompacctGlobalApiService,
    private compacctToast:MessageService,
    public $CompacctAPI: CompacctCommonApi,
  ) { }

  ngOnInit() {
    this.items = ["BROWSE", "CREATE","REPORT"];
    this.menuList = [
      { label: "Edit", icon: "pi pi-fw pi-product-edit" },
      { label: "Delete", icon: "fa fa-fw fa-trash" }
    ];
    this.header.pushHeader({
      Header: "Tax Category",
      Link: " MICL ->Tax-Category"
    })
    this.getBrowseTax();
    this.getIgstData();
    this.getCgstData();
    this.getSgstData();
    this.getIgstOutputData();
    this.getCgstOutputData();
    this.getSgstOutputData();
  }
  TabClick(e) {
    this.tabIndexToView = e.index;
    this.items = ["BROWSE", "CREATE","REPORT"];
    this.buttonname = "Create";
    this.clearData();
    
  }
getBrowseTax(){
    const obj = {
      "SP_String":"SP_TAX_Catagory",
      "Report_Name_String":"Browse_TAX_Catagory"
    }
     this.GlobalAPI.getData(obj)
     .subscribe((data:any)=>{
      this.AllData = data;
      console.log("Browse data==",this.AllData);
      });
}

getIgstData(){
  this.IGSTData=[]; 
  this.AllIGSTData = [];
  this.TagIGSTData =[];
     const obj = {
      "SP_String": "SP_TAX_Catagory",
      "Report_Name_String":"Get_TAX_Ledger_ID",
     }
     this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      this.IGSTData = data;
     console.log("IGST Data==",this.IGSTData);
      this.IGSTData.forEach(el => {
        this.AllIGSTData.push({
          label: el.Ledger_Name,
          value: el.Ledger_ID,
        });
          this.TagIGSTData.push({
            label: el.Ledger_Name,
            value: el.Ledger_ID,
          });
      });
    })
  }

getCgstData(){
  this.CGSTData=[]; 
  this.AllCGSTData = [];
  this.TagCGSTData =[];
     const obj = {
      "SP_String": "SP_TAX_Catagory",
      "Report_Name_String":"Get_TAX_Ledger_ID",
     }
     this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      this.CGSTData = data;
     console.log("CGST Data==",this.CGSTData);
      this.CGSTData.forEach(el => {
        this.AllCGSTData.push({
          label: el.Ledger_Name,
          value: el.Ledger_ID,
        });
        this.TagCGSTData.push({
          label: el.Ledger_Name,
          value: el.Ledger_ID,
        });
      });
    })
}

getSgstData(){
  this.SGSTData=[]; 
  this.AllSGSTData = [];
  this.TagSGSTData =[];
     const obj = {
      "SP_String": "SP_TAX_Catagory",
      "Report_Name_String":"Get_TAX_Ledger_ID",
     }
     this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      this.SGSTData = data;
     console.log("SGST Data==",this.SGSTData);
      this.SGSTData.forEach(el => {
        this.AllSGSTData.push({
          label: el.Ledger_Name,
          value: el.Ledger_ID,
        });
        this.TagSGSTData.push({
          label: el.Ledger_Name,
          value: el.Ledger_ID,
        });
      });
    })
}

getIgstOutputData(){
  this.IGSToutputData=[]; 
  this.AllIGSToutputData = [];
  this.TagIGSTOutputData =[];
     const obj = {
      "SP_String": "SP_TAX_Catagory",
      "Report_Name_String":"Get_TAX_Ledger_ID",
     }
     this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      this.IGSToutputData = data;
     console.log("IGST output Data==",this.IGSToutputData);
      this.IGSToutputData.forEach(el => {
        this.AllIGSToutputData.push({
          label: el.Ledger_Name,
          value: el.Ledger_ID,
        });
        this.TagIGSTOutputData.push({
          label: el.Ledger_Name,
          value: el.Ledger_ID,
        });
      });
    })
}

getCgstOutputData(){
  this.CGSToutputData=[]; 
  this.AllCGSToutputData = [];
  this.TagCGSTOutputData =[];
     const obj = {
      "SP_String": "SP_TAX_Catagory",
      "Report_Name_String":"Get_TAX_Ledger_ID",
     }
     this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      this.CGSToutputData = data;
     console.log("CGST output Data==",this.CGSToutputData);
      this.CGSToutputData.forEach(el => {
        this.AllCGSToutputData.push({
          label: el.Ledger_Name,
          value: el.Ledger_ID,
        });
        this.TagCGSTOutputData.push({
          label: el.Ledger_Name,
          value: el.Ledger_ID,
        });
      });
    })
}

getSgstOutputData(){
  this.SGSToutputData=[]; 
  this.AllSGSToutputData = [];
  this.TagSGSTOutputData =[];
     const obj = {
      "SP_String": "SP_TAX_Catagory",
      "Report_Name_String":"Get_TAX_Ledger_ID",
     }
     this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      this.SGSToutputData = data;
     console.log("SGST output Data==",this.SGSToutputData);
      this.SGSToutputData.forEach(el => {
        this.AllSGSToutputData.push({
          label: el.Ledger_Name,
          value: el.Ledger_ID,
        });
        this.TagSGSTOutputData.push({
          label: el.Ledger_Name,
          value: el.Ledger_ID,
        });
      });
    })
}

clearData(){
  this.TaxFormSubmitted = false;
  this.ObjTax = new Tax();
  this.TaxCode = undefined;
 }

EditTax(tax:any){
  this.EditList = [];
  if (tax.Cat_ID) {
    this.TaxCode = undefined;
    this.tabIndexToView = 1;
    this.items = ["BROWSE", "UPDATE","REPORT"];
    this.buttonname = "Update";
    this.clearData();
    this.TaxCode = tax.Cat_ID
    this.GetEditMasterTax(tax.Cat_ID)
   }  
}
GetEditMasterTax(Uid){
  const obj = {
    "SP_String": "SP_TAX_Catagory",
    "Report_Name_String":"Get_TAX_Catagory",
    "Json_Param_String": JSON.stringify([{Cat_ID : Uid}]) 
   }
   this.GlobalAPI.getData(obj).subscribe((data:any)=>{
     console.log("data",data);
     this.EditList = [];
    // this.ObjTax = data[0];
    this.ObjTax.Cat_ID = data[0].Cat_ID;
    this.ObjTax.Cat_Name = data[0].Cat_Name;
    this.ObjTax.IGST_Input_Ledger_ID = data[0].IGST_Input_Ledger_ID;
    this.ObjTax.CGST_Input_Ledger_ID = data[0].CGST_Input_Ledger_ID;
    this.ObjTax.SGST_Input_Ledger_Id = data[0].SGST_Input_Ledger_Id;
    this.ObjTax.IGST_Output_Ledger_ID = data[0].IGST_Output_Ledger_ID;
    this.ObjTax.CGST_Output_Ledger_ID = data[0].CGST_Output_Ledger_ID;
    this.ObjTax.SGST_Output_Ledger_ID = data[0].SGST_Output_Ledger_ID;
   //this.pass = data[0].Password;
   })
}
DeleteTax(mastertax){
  this.act_popup = false;
  this.masterTaxId = undefined ;
  if(mastertax.Cat_ID){
    this.can_popup = true;
    this.masterTaxId = mastertax.Cat_ID ;
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
console.log("onconform==",this.ObjTax)
  if(this.masterTaxId){
    const obj = {
      "SP_String": "SP_TAX_Catagory",
      "Report_Name_String": "Deactive_TAX_Catagory",
      "Json_Param_String": JSON.stringify([{Cat_ID : this.masterTaxId}])
    }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      // console.log("del Data===", data[0].Column1)
      if (data[0].Column1 === "Done"){

        this.onReject();
        this.getBrowseTax();
       this.can_popup = false;
        this.compacctToast.clear();
        this.compacctToast.add({
          key: "compacct-toast",
          severity: "success",
          summary: "Tax Id: " + this.masterTaxId.toString(),
          detail: "Succesfully Deleted"
        });
       }
    })
  }
 // this.ParamFlaghtml = undefined;
}
onConfirm2(){
console.log(this.ObjTax.Cat_ID)
  if(this.masterTaxId){
    const obj = {
      "SP_String": "SP_TAX_Catagory",
      "Report_Name_String": "Active_TAX_Catagory",
      "Json_Param_String": JSON.stringify([{Cat_ID : this.masterTaxId}])
    }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      // console.log("del Data===", data[0].Column1)
      if (data[0].Column1 === "Done"){
        this.onReject();
        this.getBrowseTax();
        this.act_popup = false;
        this.compacctToast.clear();
        this.compacctToast.add({
          key: "compacct-toast",
          severity: "success",
          summary: "Tax Id: " + this.masterTaxId.toString(),
          detail: "Succesfully Activated"
        });
      }
    })
  }
  //this.ParamFlaghtml = undefined;
}
Active(masterTax){
this.can_popup = false;
this.masterTaxId = undefined ;
 if(masterTax.Cat_ID){
  this.act_popup = true;
   this.masterTaxId = masterTax.Cat_ID ;
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
saveData(valid:any){
  console.log("savedata==",this.ObjTax);
  this.TaxFormSubmitted = true;
  if(valid){
    console.log("cat id",this.TaxCode);
    let msg = this.TaxCode ? "Update" : "Create"
      const obj = {
        "SP_String": "SP_TAX_Catagory",
        "Report_Name_String": this.TaxCode ? 'Update_TAX_Catagory' : 'Create_TAX_Catagory',
        "Json_Param_String": JSON.stringify([this.ObjTax]) 
       }
       this.GlobalAPI.getData(obj)
       .subscribe((data:any)=>{
        console.log("data ==",data);
        if (data[0].User_ID || data[0].Column1){
          this.compacctToast.clear();
          this.compacctToast.add({
            key: "compacct-toast",
            severity: "success",
            summary: "User Succesfully " +msg,
            detail: "Succesfully " +msg
          });
          }
          this.Spinner = false;
          this.getBrowseTax();
          this.TaxCode = undefined;
          this.tabIndexToView = 0;
          this.TaxFormSubmitted = false;
          this.ObjTax = new Tax();
          this.IGST_Check = false;
          this.CGST_inputckeck = false;
          this.SGST_inputckeck = false;
          this.IGST_outputckeck = false;
          this.CGST_outputckeck = false;
          this.SGST_outputckeck = false;
        });
    }
    else{
      console.error("error password")
    }
      
  }
onReject(){
  this.compacctToast.clear("c");
}

getAllLedger(v){
  const obj = {
    "SP_String": 'SP_TAX_Catagory',
    "Report_Name_String": "Get_TAX_Ledger_ID_ALL"
   }
  this.GlobalAPI.getData(obj).subscribe((data:any)=>{
    console.log("All",data);
     if( v === "IGST"){
       this.IGSTData=[]; 
       this.AllIGSTData = [];
       this.TagIGSTData =[];
      this.TagIGSTData = data;
      this.TagIGSTData.forEach(el => {
        this.IGSTData.push({
          label: el.Ledger_Name,
          value: el.Ledger_ID
        });
        this.AllIGSTData.push({
          label: el.Ledger_Name,
          value: el.Ledger_ID
        })
      });
    }
    else if(v === "CGST"){
      this.CGSTData=[]; 
      this.AllCGSTData = [];
      this.TagCGSTData =[];
      this.TagCGSTData = data;  
      this.TagCGSTData.forEach(el => {
        this.CGSTData.push({
          label: el.Ledger_Name,
          value: el.Ledger_ID
        });
        this.AllCGSTData.push({
          label: el.Ledger_Name,
          value: el.Ledger_ID
        })
      });
    }
    else if(v === "SGST"){
        this.SGSTData=[]; 
       this.AllSGSTData = [];
       this.TagSGSTData =[];
      this.TagSGSTData = data;  
      this.TagSGSTData.forEach(el => {
        this.SGSTData.push({
          label: el.Ledger_Name,
          value: el.Ledger_ID
        });
        this.AllSGSTData.push({
          label: el.Ledger_Name,
          value: el.Ledger_ID
        })
      });
    }
    else if(v === "IGSToutput"){
      this.IGSToutputData=[]; 
      this.AllIGSToutputData = [];
      this.TagIGSTOutputData =[];
      this.TagIGSTOutputData = data;  
      this.TagIGSTOutputData.forEach(el => {
        this.IGSToutputData.push({
          label: el.Ledger_Name,
          value: el.Ledger_ID
        });
        this.AllIGSToutputData.push({
          label: el.Ledger_Name,
          value: el.Ledger_ID
        })
      });
    }
    else if(v === "CGSToutput"){
      this.CGSToutputData=[]; 
      this.AllCGSToutputData = [];
      this.TagCGSTOutputData =[];
      this.TagCGSTOutputData = data;  
      this.TagCGSTOutputData.forEach(el => {
        this.CGSToutputData.push({
          label: el.Ledger_Name,
          value: el.Ledger_ID
        });
        this.AllCGSToutputData.push({
          label: el.Ledger_Name,
          value: el.Ledger_ID
        })
      });
    }
    else if(v === "SGSToutput"){
      this.SGSToutputData=[]; 
      this.AllSGSToutputData = [];
      this.TagSGSTOutputData =[];
      this.TagSGSTOutputData = data;  
      this.TagSGSTOutputData.forEach(el => {
        this.SGSToutputData.push({
          label: el.Ledger_Name,
          value: el.Ledger_ID
        });
        this.AllSGSToutputData.push({
          label: el.Ledger_Name,
          value: el.Ledger_ID
        })
      });
    }
  })
 }

allLedger(v){
  console.log(this.IGST_Check)
  if( v === "IGST"){
      if(this.IGST_Check){
         this.getAllLedger(v)
        }
        else {
         this.getIgstData()
        }
  }
  else if( v === "CGST"){
   if(this.CGST_inputckeck){
     this.getAllLedger(v)
    }
    else {
     this.getCgstData()
    }
  }
  else if( v === "SGST"){
    if(this.SGST_inputckeck){
      this.getAllLedger(v)
     }
     else {
      this.getSgstData()
     }
   }
   else if( v === "IGSToutput"){
    if(this.IGST_outputckeck){
      this.getAllLedger(v)
     }
     else {
      this.getIgstOutputData()
     }
   }
   else if( v === "CGSToutput"){
    if(this.CGST_outputckeck){
      this.getAllLedger(v)
     }
     else {
      this.getCgstOutputData()
     }
   }
   else if( v === "SGSToutput"){
    if(this.SGST_outputckeck){
      this.getAllLedger(v)
     }
     else {
      this.getSgstOutputData()
     }
   }
 }
 }
class Tax{
  Cat_ID :number;
  Cat_Name:any;					
	IGST_Input_Ledger_ID:number;					
	CGST_Input_Ledger_ID:number;							 
	SGST_Input_Ledger_Id:number;		 				 
	IGST_Output_Ledger_ID:number;		 					
	CGST_Output_Ledger_ID:number;		 					 
	SGST_Output_Ledger_ID:number;
  
  }
