import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { MessageService } from 'primeng/api';
import { DateTimeConvertService } from '../../../shared/compacct.global/dateTime.service';
import { CompacctCommonApi } from '../../../shared/compacct.services/common.api.service';
import { CompacctHeader } from '../../../shared/compacct.services/common.header.service';
import { CompacctGlobalApiService } from '../../../shared/compacct.services/compacct.global.api.service';
import { DateNepalConvertService } from "../../../shared/compacct.global/dateNepal.service"
@Component({
  selector: 'app-nepal-purchase-order-documen-master',
  templateUrl: './nepal-purchase-order-documen-master.component.html',
  styleUrls: ['./nepal-purchase-order-documen-master.component.css'],
  providers: [MessageService],
  encapsulation: ViewEncapsulation.None
})
export class NepalPurchaseOrderDocumenMasterComponent implements OnInit {
 tabIndexToView = 0;
  items: any = [];
  buttonname: string = "Save";
  PrTypeList: any = [];
  PymtTypeList: any = [];
  DeliveryList: any = [];
  ObjMaster: Master = new Master();
  PoFormSuccess: boolean = false;
  Bottomlist: any = [];
  EditId: any = undefined;
  DeleteId: any = undefined;
  editList: any = [];
  constructor(
    private $http: HttpClient,
    private GlobalAPI: CompacctGlobalApiService,
    private Header: CompacctHeader,
    private DateService: DateTimeConvertService,
    private DateNepalConvertService: DateNepalConvertService,
    public $CompacctAPI: CompacctCommonApi,
    private compacctToast: MessageService,
     private ngxService: NgxUiLoaderService
  ) { }

ngOnInit() {
    this.items = ["Document Master"];
    this.Header.pushHeader({
      Header: "PO Document Master",
      Link: " Procurement ->  Nepal Purchase Order Document Master"
    });
    this.getPrType();
    this.getBottomList();
}
TabClick(e){}
getPrType() {
    this.PrTypeList = [];
    const obj = {
      "SP_String": "sp_Bl_Txn_Purchase_Request",
      "Report_Name_String": "Get_Purchase_Type",
    }
    this.GlobalAPI.getData(obj).subscribe((data: any) => {
      if (data.length) {
        data.forEach(element => {
         element['label'] = element.Purchase_Type,
          element['value'] = element.Purchase_Type_ID
        });
        this.PrTypeList = data;
      }
      else {
        this.PrTypeList = [];
      }
      // console.log("PrTypeList",this.PrTypeList)
    })
}
getPymtType() {
    this.PymtTypeList = [];
    let empobj:any = []
      this.ObjMaster.Purchase_Type_ID.forEach((ele:any) => {
        empobj.push({
           Purchase_Type_ID_Selected : ele
         })
      });
    const obj = {
      "SP_String": "sp_Bl_Txn_Purchase_Order_Status",
      "Report_Name_String": "Get_Data_Payment_Terms_For_Status",
       "Json_Param_String": JSON.stringify(empobj)
    }
    this.GlobalAPI.getData(obj).subscribe((data: any) => {
      if (data.length) {
        data.forEach(element => {
          element['label'] = element.Payment_term_name,
          element['value'] = element.Payment_Term_ID
        });
        this.PymtTypeList = data;
      }
      else {
        this.PymtTypeList = [];
      } 
    })
     // console.log("PymtTypeList",this.PymtTypeList)
     this.getDeliveryType();
}
getDeliveryType() {
    this.DeliveryList = [];
    if (this.ObjMaster.Purchase_Type_ID.length) {
      let tempobj:any = []
      this.ObjMaster.Purchase_Type_ID.forEach((ele:any) => {
        tempobj.push({
           Purchase_Type_ID_Selected : ele
         })
      });
      
    const obj = {
      "SP_String": "sp_Bl_Txn_Purchase_Order_Status",
      "Report_Name_String": "Get_Data_Delivery_Terms_For_Status",
      "Json_Param_String": JSON.stringify(tempobj)
    }
    this.GlobalAPI.getData(obj).subscribe((data: any) => {
      if(data.length) {
        data.forEach(element => {
          element['label'] = element.Delivery_Term_Name,
          element['value'] = element.Delivery_Term_ID
        });
       this.DeliveryList = data;
      }
       else {
        this.DeliveryList = [];
      } 
        //console.log("DeliveryList",this.DeliveryList)
    })
    }
  
}
SavePoStatus(valid:any) {
    this.PoFormSuccess = true 
    if (valid && this.ObjMaster.Purchase_Type_ID && this.ObjMaster.Payment_Term_ID && this.ObjMaster.Delivery_Term_ID) {
      this.ngxService.start();
      let tempobj: any = [];
      let Pyment: any = [];
      let Delivery :any =[]
      this.ObjMaster.Purchase_Type_ID.forEach((ele:any) => {
        tempobj.push({
           Purchase_Type_ID : ele
         })
      });
      this.ObjMaster.Payment_Term_ID.forEach((ele:any) => {
        Pyment.push({
           Payment_Term_ID : ele
         })
      });
      this.ObjMaster.Delivery_Term_ID.forEach((ele:any) => {
        Delivery.push({
           Delivery_Term_ID : ele
         })
      });
      const saveData = {
        Document_ID : this.EditId ? this.EditId :0 ,   
        Document_Name: this.ObjMaster.Document_Name,
        bottom_Purchase_Type : tempobj ,  
        bottom_Payment_Term :Pyment ,
        bottom_Delivery_Term : Delivery ,
      }
     // console.log("saveData",saveData)
      const obj = {
        "SP_String": "sp_Bl_Txn_Purchase_Order_Document",
        "Report_Name_String": "Create_PO_Document",
        "Json_Param_String": JSON.stringify([saveData])
       }
      this.GlobalAPI.getData(obj).subscribe((data:any)=>{
        if(data[0].Column1){
          this.compacctToast.clear();
          this.compacctToast.add({
           key: "compacct-toast",
           severity: "success",
           detail: "PO Document Succesfully "+this.buttonname
         });
        this.ObjMaster = new Master()
        this.ngxService.stop();
        this.items = ["Document Master"];
        this.buttonname = "Save";
        this.EditId = undefined;
        this.getBottomList()
        this.PoFormSuccess = false      
        }
        else {
          this.compacctToast.clear();
          this.compacctToast.add({
            key: "compacct-toast",
            severity: "error",
            summary: "Warn Message",
            detail: "Something Wrong"
          });
          this.ngxService.stop();
        }
      })
     }  
}
getBottomList() {
  this.ngxService.start();
   const obj = {
      "SP_String": "sp_Bl_Txn_Purchase_Order_Document",
      "Report_Name_String": "Get_PO_Document_Browse",
    }
    this.GlobalAPI.getData(obj).subscribe((data: any) => {
      if (data.length) {
        this.Bottomlist = data;
        this.ngxService.stop();
      }
      else {
        this.Bottomlist = [];
        this.ngxService.stop();
      }
      // console.log("Bottomlist",this.Bottomlist)
    }) 
}
Edit(type: any) { 
  this.EditId = undefined
  this.ngxService.start();
    if (type.Document_ID) {
      this.EditId = type.Document_ID; 
      let dataList = {
        Document_ID :this.EditId
      }
       const obj = {
      "SP_String": "sp_Bl_Txn_Purchase_Order_Document",
         "Report_Name_String": "Get_PO_Document",
      "Json_Param_String": JSON.stringify([dataList])
    }
      this.GlobalAPI.getData(obj).subscribe((data: any) => {
      this.editList = JSON.parse(data[0].topper)
        if (this.editList.length) {
          let prtype: any = [];
          let paymenttype: any = [];
          let deliverytype: any = [];
      this.editList[0].bottom_Purchase_Type.forEach((ele:any) => {
        prtype.push(ele.Purchase_Type_ID)
      });
          this.editList[0].bottom_bottom_Payment_Term.forEach((ele:any) => {
        paymenttype.push(ele.Payment_Term_ID)
          });
          this.editList[0].bottom_bottom_Delivery_Term.forEach((ele:any) => {
        deliverytype.push(ele.Delivery_Term_ID)
      });
        this.ObjMaster.Document_Name = this.editList[0].Document_Name;
          this.ObjMaster.Purchase_Type_ID = prtype;
          this.getPymtType()
         this.ObjMaster.Payment_Term_ID = paymenttype;
         this.ObjMaster.Delivery_Term_ID = deliverytype;
      }
        this.buttonname = "Update";
        this.ngxService.stop();
      // console.log("editList",this.editList)
    }) 
    }
}
delete(value: any) {
  this.DeleteId = undefined ;
 if(value.Document_ID){
  this.DeleteId = value.Document_ID ;
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
  if (this.DeleteId) {
   this.ngxService.start();
   const tempobj = {  
    Document_ID: this.DeleteId,
   }
   const obj = {
     "SP_String": "sp_Bl_Txn_Purchase_Order_Document",
     "Report_Name_String": "Get_PO_Document_Delete",
     "Json_Param_String": JSON.stringify([tempobj])
   }
   this.GlobalAPI.getData(obj).subscribe((data:any)=>{
     if (data[0].Column1 ){
        this.onReject();
       this.DeleteId = undefined;    
       this.getBottomList()
       this.ngxService.stop();
       this.compacctToast.clear();
       this.compacctToast.add({
         key: "compacct-toast",
         severity: "success",
         summary: "PO Document List ",
         detail: "Succesfully Deleted"
       });
      }
   })
 }
}
onReject(){
  this.compacctToast.clear("c");
}
}
class Master{
  Purchase_Type_ID: any; 
  Payment_Term_ID: any;
  Delivery_Term_ID: any;
  Document_Name: any;
}
