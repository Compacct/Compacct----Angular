import { Component, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import {ActivatedRoute, Router} from '@angular/router';
import { CompacctCommonApi } from '../../../../shared/compacct.services/common.api.service';
import { CompacctHeader } from '../../../../shared/compacct.services/common.header.service';
import { MessageService } from 'primeng/api';
import * as moment from 'moment';
import { DateTimeConvertService } from '../../../../shared/compacct.global/dateTime.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AbstractControl } from '@angular/forms';
import { FileUpload } from 'primeng/primeng';

@Component({
  selector: 'app-consultancy',
  templateUrl: './consultancy.component.html',
  styleUrls: ['./consultancy.component.css'],
  providers: [MessageService] ,
  encapsulation: ViewEncapsulation.None
})

export class ConsultancyComponent implements OnInit {

  tabIndexToView = 0;
  buttonname = 'Create';
  Spinner = false;
  items = [];
  cols = [];
  menuList = [];
  componentDisplay = false;
  ObjSearchStock: any= {};
  searchBagProcessList = [];

  objConsultancy: Consultancy = new Consultancy();
  objProductPrice: ProductPrice = new ProductPrice();

  contractForm: FormGroup;
  submitted = false;
  chargableList:any[] = [
    { label: 'Yes', value: 1},
    { label: 'No', value: 0 }
  ];
  consultancyTypeList:any[] = [];
  categories:any[] = [];
  productForm: FormGroup;
  plantList:any[];
  ConsultancyID:string;
  productSubmitted = false;
  productPriceObj:any[] = [];
  Cons_ID:number;
  Entry_ID:number;
  getAllData:any[];
  msg:string ='';
  flag:boolean = false;
  objData:any;
  multiProductObj:any[]=[];

  constructor(
    private $http: HttpClient ,
    private commonApi: CompacctCommonApi,
    private Header: CompacctHeader ,
    private DateService: DateTimeConvertService,
    private compacctToast: MessageService,
    private route: ActivatedRoute,
    private router: Router,
    private $CompacctAPI: CompacctCommonApi,
    private fb: FormBuilder) {
    }

  ngOnInit() {
      this.items = [ 'BROWSE', 'CREATE'];
      this.menuList = [
        {label: 'Edit', icon: 'pi pi-fw pi-user-edit'},
        {label: 'Delete', icon: 'fa fa-fw fa-trash'}
      ];

      this.Header.pushHeader({
        'Header' : 'Consultancy',
        'Link' : ' Patient Management -> Master -> Clinic -> Consultancy'
      });

    this.contractForm = this.fb.group({
      Consultancy_Type: ['', Validators.required],
      Chargeable: ['', Validators.required],
      Cat_ID:  ['', Validators.required],
      Consultancy_Descr:  ['', Validators.required],
      Duration: ['', [Validators.required, this.ValidateZero]],
      Price:  ['', [Validators.required, this.ValidateZero]],
    });

    this.productForm = this.fb.group({
      Cost_Cen_ID: ['', Validators.required],
      Sale_Price: ['', [Validators.required, this.ValidateZero]],
    });

    this.getAllBrowseData();
    this.getConsultancyType();
    this.getPlants();
  }

  getDateRange (dateRangeObj) {
    if (dateRangeObj.length) {
    this.ObjSearchStock.from_date = dateRangeObj[0];
    this.ObjSearchStock.to_date = dateRangeObj[1];
    }
  }
/* searchBagProcess (valid) {
    this.Spinner = true;
    const start =  this.ObjSearchStock.from_date ?
          this.DateService.dateConvert(new Date(this.ObjSearchStock.from_date)) : this.DateService.dateConvert(new Date);
    const end =  this.ObjSearchStock.to_date ?
          this.DateService.dateConvert(new Date(this.ObjSearchStock.to_date)) : this.DateService.dateConvert(new Date);

    const obj = new HttpParams()
    .set('from_date', start)
    .set('to_date', end);

    this.$http.get('/Currency_Booking/Get_Browse', {params : obj})
    .subscribe((data: any) => {
      this.searchBagProcessList =  data.length ? JSON.parse(data) : [];
      this.Spinner = false;
      console.log('this.searchBagProcessList =', this.searchBagProcessList );
    });
} */

getAllBrowseData(){
   this.$http.get('/BL_CRM_Master_Consultancy_V2/Get_Browse')
  .subscribe((data: any) => {
       this.searchBagProcessList = data ? JSON.parse(data) : [];
      console.log('this.searchBagProcessList =', this.searchBagProcessList);
  });
}

getPlants() {
  this.$http.get('/BL_CRM_Master_Consultancy_V2/Get_Cost_Centre')
  .subscribe((data: any) => {
       this.plantList = data ? JSON.parse(data) : [];

      this.plantList.forEach((val, index)=>{
          this.plantList[index].label = val.Cost_Cen_Name;
          this.plantList[index].value = val.Cost_Cen_ID;
      });
      console.log('this.plantList =', this.plantList);
  });
}

/* getCostCenterName(Cost_Cen_ID){
  this.plantList.forEach((value, index)=>{
    if(value.Cost_Cen_ID === Cost_Cen_ID){
        this.objProductPrice.Cost_Cen_Name  = value.Cost_Cen_Name;
        return;
    }
  });
} */

getConsultancyType() {
  this.$http.get('/Common/Get_Consultancy_Type')
  .subscribe((data: any) => {
       this.consultancyTypeList = data ? JSON.parse(data) : [];

       this.consultancyTypeList.forEach((val, index)=>{
        this.consultancyTypeList[index].label = val.Consultancy_Type;
        this.consultancyTypeList[index].value = val.Consultancy_Type;
      });
      console.log('this.consultancyTypeList =', this.consultancyTypeList);
  });

  this.$http.post('/BL_CRM_Master_Consultancy_V2/Get_Catagory', {})
  .subscribe((data: any) => {
    this.categories = data ? JSON.parse(data) : [];

    this.categories.forEach((val, index)=>{
      this.categories[index].label = val.Cat_Name;
      this.categories[index].value = val.Cat_ID;
    });

    console.log('this.categories =', this.categories);
  });
}

/* ###############  VCalidation ############### */
ValidateZero(control: AbstractControl) {
  // alert('value =' + control.value);
  if (control.value === 0) {
   return { validZero: true };
  }
  return null;
}
get f() {
    return this.contractForm.controls;
}
  // Save
saveMaster() {
   this.submitted = true;
   if (this.contractForm.invalid) {
       return;
   }else{
     console.log('this.objConsultancy =', this.objConsultancy);
     this.Spinner = true;

     if (this.objConsultancy.Cons_ID !== 0) {

              this.objData ={
                Is_Service: 1,
                Product_Code:	"-",
                Product_Description	:	this.objConsultancy.Consultancy_Descr,
                Product_SH_Descr:	this.objConsultancy.Consultancy_Descr,
                Cat_ID:		this.objConsultancy.Cat_ID,
                HSN_NO:	"",
                Product_Mfg_Comp_ID	:	0,
                ESN	: 0,
                UOM	:	'PKG',
                Alt_UOM: 'PKG',
                UOM_Qty: 1,
                ALT_UOM_Qty: 1,
                Billable:	1,
                Can_Purchase: 0,
                Material_Type: 'Finished',
                Reorder_Level:	0,
                Sale_Price: this.objConsultancy.Price,
                Purchase_Rate	:	0,
                Is_Visiable: 'Y',
                Warranty_Terms:	0,
                BARCODE_COUNT	:	0,
                Label_Width	:	0,
                Label_Hight	:	0,
                Label_Accross	:	0,
                Label_Hoz_Gap	: 0,
                Label_Ver_Gap	: 0,
                Label_Core:	0,
                Label_Type:	0,
                Label_Weding:	0,
                Label_Qty_Per_Roll:	0,
                Label_Dia:	0,
                Label_Pre_Printed	:	0,
                Label_Pre_Printed_Name:	0,
                Label_Outter_Dia:	0,
                Ribbon_Width: 0,
                Ribbon_Length	: 0,
                Ribbon_Core	:	0,
                Ribbon_Type	:	0,
                Ribbon_Winding:	0,
                Max_Ribbon_Width:	0,
                Max_Label_Width	:	0,
                Vendor_Wrnty	:	0,
                Cust_Wrnty	:	0,
                Note:	"",
                Max_Dia	:	0,
                Product_Image	:	0,
                Product_Brochure	:	0,
                Label_Colour_ID	:	0,
                Rate_Form_Quote	:	0,
                Remarks	:	"",
                Mfg_Product_Code:	"",
                Product_Expiry:	0,
                Sale_Price_Form_Quote:	'N',
                DPMPL_Package	: 'N',
                DPMPL_Consultancy_Type:	"",
                DPMPL_Cons_ID	:	"",
                DPMPL_No_Of_Consultancy	:	0,
                DPMPL_Duration	:	0,
                DPMPL_Tolarance_Days:	0,
                DPMPL_Product_Type:	"",
                Product_ID: this.objConsultancy.Own_Product_ID
          };
          var UrlAddress = '/Master_Product_New/Update_Master_Product_GST_Ajax';
          var obj:any = {
            '_Master_Product_GST_Form_Post': this.objData ,
          };
     }else{

      this.objData ={
            Is_Service: 1,
            Product_Code:	"-",
            Product_Description	:	this.objConsultancy.Consultancy_Descr,
            Product_SH_Descr:	this.objConsultancy.Consultancy_Descr,
            Cat_ID:		this.objConsultancy.Cat_ID,
            HSN_NO:	"",
            Product_Mfg_Comp_ID	:	0,
            ESN	: 0,
            UOM	:	'PKG',
            Alt_UOM: 'PKG',
            UOM_Qty: 1,
            ALT_UOM_Qty: 1,
            Billable:	1,
            Can_Purchase: 0,
            Material_Type: 'Finished',
            Reorder_Level:	0,
            Sale_Price: this.objConsultancy.Price,
            Purchase_Rate	:	0,
            Is_Visiable: 'Y',
            Warranty_Terms:	0,
            BARCODE_COUNT	:	0,
            Label_Width	:	0,
            Label_Hight	:	0,
            Label_Accross	:	0,
            Label_Hoz_Gap	: 0,
            Label_Ver_Gap	: 0,
            Label_Core:	0,
            Label_Type:	0,
            Label_Weding:	0,
            Label_Qty_Per_Roll:	0,
            Label_Dia:	0,
            Label_Pre_Printed	:	0,
            Label_Pre_Printed_Name:	0,
            Label_Outter_Dia:	0,
            Ribbon_Width: 0,
            Ribbon_Length	: 0,
            Ribbon_Core	:	0,
            Ribbon_Type	:	0,
            Ribbon_Winding:	0,
            Max_Ribbon_Width:	0,
            Max_Label_Width	:	0,
            Vendor_Wrnty	:	0,
            Cust_Wrnty	:	0,
            Note:	"",
            Max_Dia	:	0,
            Product_Image	:	0,
            Product_Brochure	:	0,
            Label_Colour_ID	:	0,
            Rate_Form_Quote	:	0,
            Remarks	:	"",
            Mfg_Product_Code:	"",
            Product_Expiry:	0,
            Sale_Price_Form_Quote:	'N',
            DPMPL_Package	: 'N',
            DPMPL_Consultancy_Type:	"",
            DPMPL_Cons_ID	:	"",
            DPMPL_No_Of_Consultancy	:	0,
            DPMPL_Duration	:	0,
            DPMPL_Tolarance_Days:	0,
            DPMPL_Product_Type:	"",
    };
          var UrlAddress = '/Master_Product_New/Create_Master_Product_GST_Ajax';

          var obj:any = {
            '_Master_Product_GST': this.objData ,
          };
     }

     console.log('objData =', this.objData);
      // const obj = {
      //   '_Master_Product_GST': this.objData ,
      // };
     this.$http.post(UrlAddress, obj )
     .subscribe((data: any) => {
        console.log('data 77=', data);

        if (data.success) {
          this.objConsultancy.Own_Product_ID = data.Product_ID;
          console.log('this.objConsultancy.Own_Product_ID =', this.objConsultancy.Own_Product_ID);

          this.objProductPrice.Product_ID = data.Product_ID ;
          console.log('this.objProductPrice.Product_ID =', this.objProductPrice.Product_ID);

          this.saveConsultancy();

           //this.Spinner = false;
          // this.clearData();
         } else {
           this.compacctToast.clear();
           this.compacctToast.add({key: 'compacct-toast',
                                 severity: 'error',
                                 summary: 'Warn Message',
                                 detail: 'Error Occured '});
                                 this.Spinner = false;
       }
     });
   }
}

saveConsultancy(){
 // console.log('this.objConsultancy final =', this.objConsultancy);

  //this.Spinner = true;
 const UrlAddress2 = '/BL_CRM_Master_Consultancy_V2/Insert_Master_Consultancy_V2';
 const obj2 = { 'Master_Consultancy_V2_String': JSON.stringify([this.objConsultancy]) };

 this.$http.post(UrlAddress2, obj2 )
 .subscribe((data2: any) => {

    if (data2.success) {
       if (this.objConsultancy.Cons_ID !== 0) {
         this.compacctToast.clear();
         this.compacctToast.add({key: 'compacct-toast',
                           severity: 'success',
                           summary: 'Consultancy Updated',
                           detail: 'Succesfully Updated'});
                          this.getAllBrowseData();
                          this.Spinner = false;

       } else {
         this.compacctToast.clear();
         this.compacctToast.add({key: 'compacct-toast',
                           severity: 'success',
                           summary: 'Consultancy Added'  ,
                           detail: 'Succesfully Created'});
                           this.Spinner = false;
                           this.clearData();
                           this.getAllBrowseData();
       }
     } else {
       this.compacctToast.clear();
       this.compacctToast.add({key: 'compacct-toast',
                             severity: 'error',
                             summary: 'Warn Message',
                             detail: 'Error Occured '});
                             this.Spinner = false;
   }
 });
}

  // Edit
 editProcess(Cons_ID) {
      this.tabIndexToView = 1;
      this.items = ['BROWSE', 'UPDATE'];
      this.buttonname = 'Update';

      this.$http.get('/BL_CRM_Master_Consultancy_V2/Get_Consultancy_All_Data?Cons_ID=' + Cons_ID)
      .subscribe((data: any) => {
          this.getAllData = data ? JSON.parse(data) : [];
        console.log('Edit getAllData =>>', this.getAllData);

        if(this.getAllData.length > 0 ){
           this.objConsultancy = this.getAllData[0];
          console.log(' this.objConsultancy Edit 88 =', this.objConsultancy);
          this.objProductPrice.Product_ID = this.objConsultancy.Own_Product_ID;
          this.getProductData();
        }
      });
  }

  getProductData(){
    this.$http.get('/BL_CRM_Master_Consultancy_V2/Get_Product_Price_All_Data?Product_ID=' +  this.objProductPrice.Product_ID)
    .subscribe((data: any) => {

      const productList = data ? JSON.parse(data) : [];
      console.log('Edit productList =>>', productList);

      if(productList.length > 0 ){
        this.productPriceObj = [...productList];
        console.log(' this.productPriceObj Edit 99 =', this.productPriceObj);
      }
    });
  }

  get j() {
    return this.productForm.controls;
  }

addProductPrice(){
    console.log('this.objProductPrice =', this.objProductPrice);
    console.log('this.objProductPrice.Cost_Cen_ID =', this.objProductPrice.Cost_Cen_ID);

   /*  this.objProductPrice.Cost_Cen_ID.forEach((val, index)=>{
        const obj = {
          Entry_ID: this.objProductPrice.Entry_ID,
          Cost_Cen_ID: this.objProductPrice.Cost_Cen_ID[index],
          Cost_Cen_Name:'',
          Sale_Price: this.objProductPrice.Sale_Price,
        };
        this.multiProductObj.push(obj);
    });

    console.log('this.multiProductObj =', this.multiProductObj);

    this.objProductPrice.Cost_Cen_ID.forEach((val1, indx1)=>{
        this.plantList.forEach((val2, indx2)=>{
            if(val1 === val2.Cost_Cen_ID){
                //console.log('value.Cost_Cen_Name =', val2.Cost_Cen_Name)
                this.multiProductObj[indx1].Cost_Cen_Name = val2.Cost_Cen_Name;
            }
        });
    });

    console.log('this.multiProductObj Final =', this.multiProductObj); */



    this.productSubmitted = true;
    this.flag = false;
    this.msg = '';

    if (this.productForm.invalid) {
        return;
    }else{

      this.productPriceObj.forEach((val, index)=>{
          if(val.Cost_Cen_ID === this.objProductPrice.Cost_Cen_ID){
              this.flag = true;
              return;
          }
      });

      if(!this.flag){

        this.objProductPrice.Cost_Cen_ID.forEach((val, index)=>{
          const obj = {
           // Entry_ID: this.objProductPrice.Entry_ID,
            Product_ID: this.objConsultancy.Own_Product_ID,
            Cost_Cen_ID: this.objProductPrice.Cost_Cen_ID[index],
            Cost_Cen_Name:'',
            Sale_Price: this.objProductPrice.Sale_Price,
          };
          this.multiProductObj.push(obj);
      });

      console.log('this.multiProductObj =', this.multiProductObj);

      this.objProductPrice.Cost_Cen_ID.forEach((val1, indx1)=>{
          this.plantList.forEach((val2, indx2)=>{
              if(val1 === val2.Cost_Cen_ID){
                  //console.log('value.Cost_Cen_Name =', val2.Cost_Cen_Name)
                  this.multiProductObj[indx1].Cost_Cen_Name = val2.Cost_Cen_Name;
              }
          });
      });

      console.log('this.multiProductObj Final =', this.multiProductObj);
       console.log('this.productPriceObj Final =', this.productPriceObj);
        if(this.productPriceObj.length > 0 ){
          this.multiProductObj = [...this.productPriceObj, ...this.multiProductObj];
        }
        console.log('this.multiProductObj Final 22 =', this.multiProductObj);

       this.Spinner = true;
       const UrlAddress = '/BL_CRM_Master_Consultancy_V2/Insert_Master_Product_Price';

      // const obj = { '_Master_Product_Price': this.objProductPrice };
      //JSON.stringify([this.objConsultancy])
     // const obj = { '_Master_Product_Price': this.multiProductObj };
     const obj = { 'Master_Product_Price': JSON.stringify(this.multiProductObj)};

      this.$http.post(UrlAddress, obj )
      .subscribe((data: any) => {
              if (data.success) {
                    this.componentDisplay = true;
                    this.compacctToast.clear();
                    this.compacctToast.add({key: 'compacct-toast',
                                      severity: 'success',
                                      summary: 'Product Price Added',
                                      detail: 'Succesfully Created'});


                 /*  const objProduct ={
                    Entry_ID: 0,
                    Product_ID: this.objConsultancy.Own_Product_ID,
                    Cost_Cen_ID: this.objProductPrice.Cost_Cen_ID,
                    Cost_Cen_Name: this.objProductPrice.Cost_Cen_Name,
                    Sale_Price:  this.objProductPrice.Sale_Price
                  };
                  this.productPriceObj.push(objProduct); */
                  this.productPriceObj =[...this.multiProductObj];
                  console.log('this.productPriceObj 22 =', this.productPriceObj);

                  this.productSubmitted = false;
                  this.flag = false;
                  this.msg ='';
                  //this.objProductPrice = new ProductPrice();
                  this.objProductPrice.Cost_Cen_ID = undefined;
                  this.objProductPrice.Cost_Cen_Name = undefined;
                 this.objProductPrice.Sale_Price = undefined;

                  this.Spinner = false;
                 // this.multiProductObj = [];
                // this.clearData();
                } else {
                  this.compacctToast.clear();
                  this.compacctToast.add({key: 'compacct-toast',
                                        severity: 'error',
                                        summary: 'Warn Message',
                                        detail: 'Error Occured '});
                                        this.Spinner = false;
                                        this.multiProductObj = [];
               }
           });
      }else{
         this.msg ="This cost center already exist";
         this.multiProductObj = [];
      }

    }





   /*  this.productSubmitted = true;
    this.flag = false;
    this.msg = '';

    if (this.productForm.invalid) {
        return;
    }else{

      this.productPriceObj.forEach((val, index)=>{
          if(val.Cost_Cen_ID === this.objProductPrice.Cost_Cen_ID){
              this.flag = true;
              return;
          }
      });

      if(!this.flag){

       this.Spinner = true;
       const UrlAddress = '/BL_CRM_Master_Consultancy_V2/Insert_Master_Product_Price';

      const obj = { '_Master_Product_Price': this.objProductPrice };

      this.$http.post(UrlAddress, obj )
      .subscribe((data: any) => {

              if (data.success) {

                    this.componentDisplay = true;
                    this.compacctToast.clear();
                    this.compacctToast.add({key: 'compacct-toast',
                                      severity: 'success',
                                      summary: 'Product Price Added',
                                      detail: 'Succesfully Created'});


                  const objProduct ={
                    Entry_ID: 0,
                    Product_ID: this.objConsultancy.Own_Product_ID,
                    Cost_Cen_ID: this.objProductPrice.Cost_Cen_ID,
                    Cost_Cen_Name: this.objProductPrice.Cost_Cen_Name,
                    Sale_Price:  this.objProductPrice.Sale_Price
                  };
                  this.productPriceObj.push(objProduct);
                  console.log('this.productPriceObj 22 =', this.productPriceObj);

                  this.productSubmitted = false;
                  this.flag = false;
                  this.msg ='';
                  //this.objProductPrice = new ProductPrice();
                  this.objProductPrice.Cost_Cen_ID = undefined;
                  this.objProductPrice.Cost_Cen_Name = undefined;
                  this.objProductPrice.Sale_Price = undefined;

                  this.Spinner = false;
                // this.clearData();
                } else {
                  this.compacctToast.clear();
                  this.compacctToast.add({key: 'compacct-toast',
                                        severity: 'error',
                                        summary: 'Warn Message',
                                        detail: 'Error Occured '});
                                        this.Spinner = false;
               }
           });
      }else{
         this.msg ="This cost center already exist";
      }

    } */
  }

  deleteProduct(index, Entry_ID){
    console.log('Entry_ID =', Entry_ID);
      const obj ={
        'Entry_ID' : Entry_ID
      };

      this.$http.post('/BL_CRM_Master_Consultancy_V2/Delete_Product_Price', obj)
      .subscribe((data: any) => {
          if (data.success === true) {
              this.onReject();
              this.compacctToast.clear();
              this.compacctToast.add({key: 'compacct-toast',
                                 severity: 'success',
                                 detail: 'Succesfully Deleted'});
                                this.productPriceObj.splice(index, 1);

            }
      });
  }

  // Delete
  deleteBagProcess (data) {
    if (data.Cons_ID) {
      this.Cons_ID = data.Cons_ID;
      this.Entry_ID = data.Entry_ID;
      this.compacctToast.clear();
      this.compacctToast.add({key: 'c', sticky: true, severity: 'warn', summary: 'Are you sure?', detail: 'Confirm to proceed'});
    }
  }
  onConfirm() {
    if (this.ConsultancyID) {
      const obj ={
        'Cons_ID' : this.Cons_ID,
        'Entry_ID' : this.Entry_ID
      };

      this.$http.post('/BL_CRM_Master_Consultancy_V2/Delete', obj)
      .subscribe((data: any) => {
          if (data.success === true) {
              this.onReject();
              this.compacctToast.clear();
              this.compacctToast.add({key: 'compacct-toast',
                                 severity: 'success',
                                 detail: 'Succesfully Deleted'});
                                // this.searchBagProcess(true);
            }
      });
    }
  }
  onReject() {
    this.compacctToast.clear('c');
  }

   // PDF
   getPrint(obj) {
    if (obj.Com_Inv_No) {
      window.open('/Report/Crystal_Files/PRODUCTION/EXP_Doc_Custom_Inv_Print.aspx?Com_Inv_No=' + obj.Com_Inv_No,
       'mywindow', 'fullscreen=yes, scrollbars=auto,width=950,height=500');
    }
  }

  // Clear & Tab
  TabClick(e) {
    this.tabIndexToView = e.index;
    this.items = [ 'BROWSE', 'CREATE'];
    this.buttonname = 'Create';
   this.clearData();
  }
  clearData() {
      this.Spinner = false;
      this.objConsultancy = new Consultancy();
      this.submitted = false;
      this.productPriceObj = [];
      this.getAllData = [];
      this.multiProductObj = [];
    }
}

class Consultancy {
  Cons_ID	= 0;
  Consultancy_Type: string;
  Consultancy_Descr: string;
  Is_Visiable = 'Y';
  Chargeable: number;
  Own_Product_ID:number;
  Cat_ID: number;
  Duration: number;
  Price	: number;
  For_Support	= 'N';
}

class ProductPrice {
  Entry_ID = 0;
  Product_ID: number;
 // Cost_Cen_ID	: number;
  Cost_Cen_ID : any;
  Sale_Price: number;
  // Cost_Cen_Name: string;
  Cost_Cen_Name: any[];
}






