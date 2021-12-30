import { Component, OnInit, ViewEncapsulation, ViewChild } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { MessageService } from "primeng/api";
import { FileUpload } from "primeng/primeng";
declare var $: any;
import { THIS_EXPR } from "@angular/compiler/src/output/output_ast";
import { CompacctGlobalApiService } from "../../../../shared/compacct.services/compacct.global.api.service";
import { CompacctCommonApi } from "../../../../shared/compacct.services/common.api.service";
import { CompacctHeader } from "../../../../shared/compacct.services/common.header.service";
import { DateTimeConvertService } from "../../../../shared/compacct.global/dateTime.service";
import * as XLSX from 'xlsx';
import { NgxUiLoaderService } from "ngx-ui-loader";


@Component({
  selector: 'app-k4-c-dispatch-outlet-adv-order',
  templateUrl: './k4-c-dispatch-outlet-adv-order.component.html',
  styleUrls: ['./k4-c-dispatch-outlet-adv-order.component.css'],
  providers: [MessageService],
  encapsulation: ViewEncapsulation.None
})
export class K4CDispatchOutletAdvOrderComponent implements OnInit {
  items = [];
  menuList = [];
  tabIndexToView = 0;
  brandInput = false ;
  buttonname = "Create";
  myDate : Date;
  ChallanDate : any = Date ;
  brandList = [];
  toGodownList = [];
  costcenterList = [];
  VehicleList = [];
  itemList =[];
  NativeitemList = [];
  FromGodownList = [];
  productDetails = [];
  saveList = [];
  saveData = [];
  outletListBro = [];
  GetAllDataList = [];
  OutletFilter = [];
  BackUPGetAllDataList = [];
  SelectedOutLet :any;
  OutletFormSubmit = false;
  outLetDis = false;
  Spinner = false;
  seachSpinner = false;
  flag = false;
  inputBoxDisabled = false;
  indentdateDisabled = true;
  inputDate = true;
  To_Godown_ID_Dis = false;
  Stock_Point = false;
  Delivery_Date = new Date();
  ObjadvDispat : advDispat = new advDispat ()
  ObjBrowseData : BrowseData = new BrowseData ()
  doc_no: any;
  doc_date: any;
  constructor(
    private $http: HttpClient,
    private commonApi: CompacctCommonApi,
    private GlobalAPI: CompacctGlobalApiService,
    private Header: CompacctHeader,
    private DateService: DateTimeConvertService,
    public $CompacctAPI: CompacctCommonApi,
    private compacctToast: MessageService,
    private ngxService: NgxUiLoaderService
  ) { }

  ngOnInit() {
    this.items = ["BROWSE", "CREATE"];
    this.menuList = [
      { label: "Edit", icon: "pi pi-fw pi-user-edit" },
      { label: "Delete", icon: "fa fa-fw fa-trash" }
    ];
    this.Header.pushHeader({
      Header: "Custom Order Distribution",
      Link: "Material Management -> Outward -> Custom Order Distribution"
    });
    this.GetDate();
    this.getBrand();
    this.GetVehicle();
    this.GetFromGodown();

  }
  TabClick(e) {
    this.tabIndexToView = e.index;
    this.items = ["BROWSE", "CREATE"];
    this.brandInput = false ;
    this.buttonname = "Save";
    this.clearData();
    this.ObjadvDispat= new advDispat();
    this.productDetails = [];
    this.inputBoxDisabled = false;
    this.indentdateDisabled = true;
    this.Stock_Point = false;
    this.To_Godown_ID_Dis = false;
    this.inputDate = true;
    this.Delivery_Date = new Date();
    this.ChallanDate = this.DateService.dateConvert(new Date(this.myDate));
  }
  clearData(){
    //this.ObjadvDispat= new advDispat();
    this.OutletFormSubmit = false;
    this.flag = false;
    this.ngxService.stop();
   }
  GetDate(){
    const obj = {
      "SP_String": "SP_Production_Voucher",
      "Report_Name_String": "Get Date For Dispatch to outlet",
    }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      console.log("OutletNameList  ===",data);

      //this.ObjRequistion.Req_Date = new Date(data[0].Requisition_Date);
      this.myDate =  new Date(data[0].Bill_Date);
      this.ChallanDate = new Date(data[0].Bill_Date);
      // on save use this
      //this.ObjRequistion.Req_Date = this.DateService.dateTimeConvert(new Date(this.myDate));??
      console.log("dateList  ===",this.myDate);
    })
  }
  getBrand(){
    const obj = {
      "SP_String": "SP_Controller_Master",
      "Report_Name_String": "Get - Brand INI",

    }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
       console.log("brandList  ===",data);
      this.brandList = data;
    })
  }
  Getgodown(){
     const obj = {
      "SP_String": "SP_Controller_Master",
      "Report_Name_String": "Get - Godown For Sale Bill",
      "Json_Param_String": JSON.stringify([{Cost_Cen_ID : this.ObjadvDispat.Cost_Cen_ID}])

    }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      this.toGodownList = data;
      console.log("this.toGodownList",this.toGodownList);
      this.ObjadvDispat.To_Godown_ID = this.toGodownList.length === 1 ? this.toGodownList[0].godown_id : undefined;
      if(this.ObjadvDispat.To_Godown_ID){
        this.To_Godown_ID_Dis = true;
      }
    })
  }
  getCostcenter(){
     const obj = {
      "SP_String": "SP_Controller_Master",
      "Report_Name_String": "Get - Outlet For Distribution",
      "Json_Param_String": JSON.stringify([{Brand_ID : this.ObjadvDispat.Brand_ID}])
     // "Json_Param_String": JSON.stringify([{User_ID : 61}])
    }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      console.log("costcenterList  ===",data);
      this.costcenterList = data;
      if(this.costcenterList.length){
        this.Getgodown()
      }


    })
  }
  GetVehicle(){
    const obj = {
      "SP_String": "SP_Controller_Master",
      "Report_Name_String": "Get - Vehicle Details",
    }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      this.VehicleList = data;
      console.log("this.VehicleList",this.VehicleList);
    })
  }
  getAllitem(){
    this.NativeitemList = [];
    this.itemList = [];
    const TempObj ={
      Cost_Cen_ID : this.ObjadvDispat.Cost_Cen_ID,
    }
    const obj = {
      "SP_String": "SP_Controller_Master",
      "Report_Name_String": "Get - All Product for Distribution",
      "Json_Param_String": JSON.stringify([TempObj])
    }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      this.NativeitemList = data;
     console.log("this.NativeitemList",this.NativeitemList);
      this.NativeitemList.forEach(el => {
        this.itemList.push({
          label: el.Product_Description,
          value: el.Product_ID
        });
      });


    })
  }
  GetFromGodown(){
    console.log(this.$CompacctAPI.CompacctCookies.Cost_Cen_ID);
    const obj = {
      "SP_String": "SP_Controller_Master",
      "Report_Name_String": "Get - Godown For Sale Bill",
      "Json_Param_String": JSON.stringify([{Cost_Cen_ID : this.$CompacctAPI.CompacctCookies.Cost_Cen_ID}])
    }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      this.FromGodownList = data;
      console.log("this.FromGodownList",this.FromGodownList);
      this.ObjadvDispat.From_Godown_ID = this.FromGodownList.length === 1 ? this.FromGodownList[0].godown_id : undefined;
     if(this.ObjadvDispat.From_Godown_ID){
      this.Stock_Point = true;
    }
     })

  }
  addadvDispatch(valid){
     this.OutletFormSubmit = true;
     if(valid){
       const tempObj = {
        Cost_Cen_ID : this.ObjadvDispat.Cost_Cen_ID,
        Delivery_Date : this.DateService.dateConvert(new Date (this.Delivery_Date))
       }
       const obj = {
        "SP_String": "SP_Controller_Master",
        "Report_Name_String": "GET_Production_Pending_Orders",
        "Json_Param_String": JSON.stringify([tempObj])
      }
      this.GlobalAPI.getData(obj).subscribe((data:any)=>{
        this.productDetails = data;
        this.inputBoxDisabled = true;
        this.indentdateDisabled = false;
        this.Stock_Point = true;
        this.To_Godown_ID_Dis = true;
        this.inputDate = false;
        console.log("this.productDetails",this.productDetails);
        this.productDetails.forEach(ele=>{
          ele['Delivery_Qty'] = ele.Qty;
          ele['Doc_No'] = "A";
          ele['Product_ID'] = ele.Product_ID;
          ele['Doc_Date'] = this.DateService.dateConvert(new Date(this.ChallanDate));
          ele['F_Cost_Cen_ID'] = this.$CompacctAPI.CompacctCookies.Cost_Cen_ID;
         ele['To_Cost_Cen_ID'] = this.ObjadvDispat.Cost_Cen_ID;
         ele['Product_Description'] = ele.Product_Description;
         ele['F_Godown_ID'] = this.ObjadvDispat.From_Godown_ID;
         ele['To_Godown_ID'] = this.ObjadvDispat.To_Godown_ID;
         ele['Batch_NO'] = ele.Batch_NO;
         ele['Req_Qty'] = ele.Delivery_Qty;
         ele['Rate'] = ele.Sale_rate;
         ele['User_ID'] = this.$CompacctAPI.CompacctCookies.User_ID;
         ele['From_Godown_ID'] = this.ObjadvDispat.From_Godown_ID;
         ele['REMARKS'] = this.ObjadvDispat.REMARKS ? this.ObjadvDispat.REMARKS : "NA";
         ele['UOM'] = ele.UOM;
         ele['Fin_Year_ID'] = this.$CompacctAPI.CompacctCookies.Fin_Year_ID;
         ele['Vehicle_Details'] = this.ObjadvDispat.Vehicle_Details;
         ele['Adv_Order_No'] = ele.Adv_Order_No;
        })

        this.clearData();
      })
     }
  }
  getDateRange(dateRangeObj) {
    if (dateRangeObj.length) {
      this.ObjBrowseData.From_Date = dateRangeObj[0];
      this.ObjBrowseData.To_Date = dateRangeObj[1];
    }
  }
  saveAdv(){
    console.log(this.saveqty());
    console.log(this.productDetails.length && this.saveqty());
    if(this.productDetails.length && this.saveqty()){
      this.ngxService.start();
          this.saveData = [];
             this.productDetails.forEach(el=>{
               if(el.Delivery_Qty && Number(el.Delivery_Qty) !== 0 ){
               const saveObj = {
                 Doc_No: "A",
                 Doc_Date: el.Doc_Date,
                 F_Cost_Cen_ID: el.F_Cost_Cen_ID,
                 F_Godown_ID: el.F_Godown_ID,
                 To_Cost_Cen_ID: el.To_Cost_Cen_ID,
                 To_Godown_ID: el.To_Godown_ID,
                 Batch_No : el.Batch_NO,
                 Product_ID: el.Product_ID,
                 Qty: el.Delivery_Qty,
                 Accepted_Qty : el.Delivery_Qty,
                 Rate: 0,
                 UOM: el.UOM,
                 User_ID: el.User_ID,
                 REMARKS: el.REMARKS,
                 Fin_Year_ID: el.Fin_Year_ID,
                 Vehicle_Details : el.Vehicle_Details,
                 Adv_Order_No : el.Adv_Order_No,
                 Status : 'NA'
               }
               this.saveData.push(saveObj)
              }
             })
             if(this.saveData.length){
              const obj = {
                "SP_String": "SP_Production_Voucher",
                 "Report_Name_String": "Add K4C Txn Distribution For Custom Order",
                 "Json_Param_String": JSON.stringify(this.saveData)
               }
               this.GlobalAPI.getData(obj).subscribe((data:any)=>{
                 var tempID = data[0].Column1;
                 if(data[0].Column1){
                  this.ngxService.stop();
                   this.compacctToast.clear();
                 this.compacctToast.add({
                 key: "compacct-toast",
                 severity: "success",
                 summary: "Distribution Challan No. " + tempID,
                 detail: "Distribution Challan Entry Succesfully"
               });
               this.productDetails = [];
               this.tabIndexToView = 0;
               this.items = ["BROWSE", "CREATE"];
               this.buttonname = "Create";
               this.clearData();
               this.searchData();
               this.ChallanDate = this.DateService.dateConvert(new Date(this.myDate));
                 }
               })
             }
             else{
              this.ngxService.stop();
              this.compacctToast.clear();
                  this.compacctToast.add({
                    key: "compacct-toast",
                    severity: "error",
                    summary: "Warn Message",
                    detail: "Something Wrong"
                  });
            }

            }
        }
  qtyChq(col){
    this.flag = false;
    console.log("col",col);
    if(col.Delivery_Qty){
      if(col.Delivery_Qty <=  col.Qty){
        this.flag = false;
        return true;
      }
      else {
        this.flag = true;
        this.compacctToast.clear();
             this.compacctToast.add({
                 key: "compacct-toast",
                 severity: "error",
                 summary: "Warn Message",
                 detail: "Quantity can't be more than in batch available quantity "
               });

             }
    }



  }

  saveqty(){
    let flag = true;
   for(let i = 0; i < this.productDetails.length ; i++){
    if(Number(this.productDetails[i].Qty) <  Number(this.productDetails[i].Delivery_Qty)){
      flag = false;
      break;
    }
   }
   return flag;
  }
  // getCostcenterBro(){
  //   this.OutletFilter = [];
  //   this.SelectedOutLet = [];
  //   const obj = {
  //     "SP_String": "SP_Controller_Master",
  //     "Report_Name_String": "Get - Outlet",
  //    }
  //   this.GlobalAPI.getData(obj).subscribe((data:any)=>{
  //      this.outletListBro = data;
  //      console.log("outletListBro",this.outletListBro);
  //      this.outletListBro.forEach(el => {
  //      this.SelectedOutLet.push(el.Cost_Cen_Name);
  //       this.OutletFilter.push(
  //         {
  //           label: el.Cost_Cen_Name,
  //           value: el.Cost_Cen_Name
  //         }
  //       )
  //     })
  //     })
  // }

  searchData(){
    this.ObjBrowseData.Cost_Cen_ID = this.ObjBrowseData.Cost_Cen_ID === undefined ? 0 : this.ObjBrowseData.Cost_Cen_ID ;
    console.log("this.ObjBrowseData.Cost_Cen_ID",this.ObjBrowseData.Cost_Cen_ID);
    const start = this.ObjBrowseData.From_Date
        ? this.DateService.dateConvert(new Date(this.ObjBrowseData.From_Date))
        : this.DateService.dateConvert(new Date());
      const end = this.ObjBrowseData.To_Date
        ? this.DateService.dateConvert(new Date(this.ObjBrowseData.To_Date))
        : this.DateService.dateConvert(new Date());
      const tempDate = {
        From_Date :start,
        To_Date :end,

      }

     const obj = {
      "SP_String": "SP_Controller_Master",
      "Report_Name_String": "Browse Custom Order Distribution",
      "Json_Param_String": JSON.stringify([tempDate])
     }
     this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      this.GetAllDataList = data;
      this.BackUPGetAllDataList = data;
      console.log("this.GetAllDataList",this.GetAllDataList);
      this.GetDist1();
      })

  }
  GetDist1() {
    let DOrderBy = [];
    this.OutletFilter = [];
    //this.SelectedDistOrderBy1 = [];
    this.BackUPGetAllDataList.forEach((item) => {
    if (DOrderBy.indexOf(item.Cost_Cen_Name) === -1) {
    DOrderBy.push(item.Cost_Cen_Name);
    this.OutletFilter.push({ label: item.Cost_Cen_Name, value: item.Cost_Cen_Name });
    console.log("this.OutletFilter",this.OutletFilter);
}
});
}
  filterOutlet(){
      console.log("SelectedOutLet",this.SelectedOutLet);
      let DOrderBy = [];
      if (this.SelectedOutLet.length) {
      DOrderBy = this.SelectedOutLet;
      }
      this.GetAllDataList = [];
      if (this.SelectedOutLet.length) {
      let LeadArr = this.BackUPGetAllDataList.filter(function (e) {
      return (DOrderBy.length ? DOrderBy.includes(e['Cost_Cen_Name']) : true)
      });
      this.GetAllDataList = LeadArr.length ? LeadArr : [];
      console.log("if GetAllDataList",this.GetAllDataList)
      } else {
      this.GetAllDataList = this.BackUPGetAllDataList;
      console.log("else GetAllDataList",this.GetAllDataList)
      }
  }
  Browseprint(Objp){
    console.log("Print",Objp.Adv_Order_No);
  if (Objp.Adv_Order_No) {
    window.open("/Report/Crystal_Files/K4C/Adv_Custom_Order_Dispatch.aspx?DocNo=" + Objp.Adv_Order_No, 'mywindow', 'fullscreen=yes, scrollbars=auto,width=950,height=500'
    );
  }
  }
  exportoexcel(Arr,fileName): void {
    let temp = [];
     Arr.forEach(element => {
       const obj = {
        Doc_No   :    element.Doc_No,
        Adv_Order_No   :  element.Adv_Order_No,
        Doc_Date    :  this.DateService.dateConvert(new Date(element.Doc_Date)),
        Customer_Name   :  element.Customer_Name,
        Costomer_Mobile   :  element.Costomer_Mobile,
        amount_payable   :  element.amount_payable,
        godown_name  :  element.godown_name,
        Cost_Cen_Name   :  element.Cost_Cen_Name,
        Total_Qty  :  element.Total_Qty,
        Total_Amount   :  element.Total_Amount,
        Vehicle_Details   :  element.Vehicle_Details,
        Transaction_Date_Time   :  element.Transaction_Date_Time
       }
       temp.push(obj)
     });
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(temp);
    const workbook: XLSX.WorkBook = {Sheets: {'data': worksheet}, SheetNames: ['data']};
    XLSX.writeFile(workbook, fileName+'.xlsx');
  }
  //editmaster(col){}
  deleteAdvDispatch(masterProduct){
    console.log("deleteCol",masterProduct)
    this.doc_no = undefined;
    if (masterProduct.Doc_No) {
     this.doc_no = masterProduct.Doc_No;
     this.doc_date = masterProduct.Doc_Date;
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
    if(this.doc_no){
      const TempObj = {
        Doc_No : this.doc_no,
        User_ID : this.$CompacctAPI.CompacctCookies.User_ID,
        Doc_Date : this.doc_date
      }
      const obj = {
        "SP_String": "SP_Production_Voucher",
        "Report_Name_String": "Delete Distribution Challan",
        "Json_Param_String": JSON.stringify([TempObj])
      }
      this.GlobalAPI.getData(obj).subscribe((data:any)=>{
        console.log("del Data===", data[0].Column1)
         if (data[0].Column1 === "Done"){
           this.onReject();
           this.searchData();
           this.compacctToast.clear();
           this.compacctToast.add({
             key: "compacct-toast",
             severity: "success",
             summary: "Doc No.: " + this.doc_no.toString(),
             detail: "Succesfully Deleted"
           });
           this.clearData();
         }
       })
    }
  }
  onReject(){
    this.compacctToast.clear("c");
  }

}
class advDispat{
  Brand_ID : any;
  Cost_Cen_ID : any;
  To_Godown_ID : any;
  From_Godown_ID:any;
  Vehicle_Details:any;
  REMARKS:any;
}
class BrowseData {
  From_Date: string;
  To_Date: string;
  Cost_Cen_ID : any = 0;
  }
