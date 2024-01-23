import { CompacctCommonApi } from './../../../../shared/compacct.services/common.api.service';
import { DateTimeConvertService } from './../../../../shared/compacct.global/dateTime.service';
import { CompacctGlobalApiService } from './../../../../shared/compacct.services/compacct.global.api.service';
import { HttpClient } from '@angular/common/http';
import { CompacctHeader } from './../../../../shared/compacct.services/common.header.service';
import { MessageService } from 'primeng/api';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-master-consultancy-v3',
  templateUrl: './master-consultancy-v3.component.html',
  styleUrls: ['./master-consultancy-v3.component.css'],
  providers: [MessageService] ,
  encapsulation: ViewEncapsulation.None
})
export class MasterConsultancyV3Component implements OnInit {
  tabIndexToView :number = 0;
  buttonname:string = 'Create';
  Spinner:boolean = false;
  items:any= [];
  ObjConsultancy : Consultancy = new Consultancy();
  ObjProductPrice: ProductPrice = new ProductPrice();
  BrowseList:any =[];
  consultancyTypeList :any =[];
  categories :any =[];
  ConsultancyFormSumitted : boolean = false;
  productSubmitted :boolean =false;
  chargableList:any[] = [
    { label: 'Yes', value: 1},
    { label: 'No', value: 0 }
  ];
  TypeList: any =[];
  TypeListDetails :any =[];
  plantList :any =[];
  flag:boolean = false;
  multiProductObj:any=[];
  msg:string ='';
  productPriceObj:any = [];
  componentDisplay :boolean = false;
  can_popup: boolean =false;
  act_popup: boolean = false;
  masterId : any;
  masterWonId: any;
  ConsCode :any;
  EditList : any = [];
  lowerAddList :any =[];
  EditListPrice :any =[];
    constructor(
    private header:CompacctHeader,
    private $http: HttpClient,
    private GlobalAPI:CompacctGlobalApiService,
    private compacctToast:MessageService,
    private DateService: DateTimeConvertService,
    public $CompacctAPI: CompacctCommonApi,
  ) { }

ngOnInit() {
    this.items = [ 'BROWSE', 'CREATE'];
    this.header.pushHeader({
      'Header' : 'Master Consultancy',
      'Link' : ' Patient Management -> Master -> Clinic -> BL CRM Master Consultancy V3'
    });
    this.GetBrowseList();
    this.getConsultancyType();
    this.getPlants();
  }
TabClick(e) {
    this.tabIndexToView = e.index;
    this.items = [ 'BROWSE', 'CREATE'];
    this.buttonname = 'Create';
    this.clearData();
}
onReject(){
    this.compacctToast.clear('c');
}
clearData() {
  this.Spinner = false;
  this.ObjConsultancy = new Consultancy();
  this.ObjProductPrice = new ProductPrice();
  this.ConsultancyFormSumitted = false;
  this.productSubmitted = false;
  this.TypeListDetails =[];
  this.TypeList =[];
  this.multiProductObj =[];

}
GetBrowseList(){
  const obj = {
    "SP_String": "SP_Master_Consultancy_V3",
    "Report_Name_String": "Get_Browse"
   }
  this.GlobalAPI.getData(obj).subscribe((data:any)=>{
   this.BrowseList = data;
   //console.log('BrowseList ==', this.BrowseList)
  });
}
getConsultancyType() {
  this.$http.get('/Common/Get_Consultancy_Type')
  .subscribe((data: any) => {
       this.consultancyTypeList = data ? JSON.parse(data) : [];

       this.consultancyTypeList.forEach((val, index)=>{
        this.consultancyTypeList[index].label = val.Consultancy_Type;
        this.consultancyTypeList[index].value = val.Consultancy_Type;
      });
      //console.log('consultancyTypeList =', this.consultancyTypeList);
  });

  this.$http.post('/BL_CRM_Master_Consultancy_V2/Get_Catagory', {})
  .subscribe((data: any) => {
    this.categories = data ? JSON.parse(data) : [];

    this.categories.forEach((val, index)=>{
      this.categories[index].label = val.Cat_Name;
      this.categories[index].value = val.Cat_ID;
    });

    //console.log('categories =', this.categories);
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
      //console.log('this.plantList =', this.plantList);
  });
}
getTesttype(){
  const obj = {
    "SP_String": "SP_Master_Consultancy_V3",
    "Report_Name_String": "Get_Test_Type",
    "Json_Param_String": JSON.stringify([{Consultancy_Type: this.ObjConsultancy.Consultancy_Type}]) 
    }
  this.GlobalAPI.getData(obj).subscribe((data:any)=>{
   this.TypeList = data
   //console.log("TypeList",this.TypeList)
  })
}
GetTypDetails(){
  const obj = {
    "SP_String": "SP_Master_Consultancy_V3",
    "Report_Name_String": "Get_Test_Type_Details",
    "Json_Param_String": JSON.stringify([{Test_Type: this.ObjConsultancy.Test_Type}]) 
    }
  this.GlobalAPI.getData(obj).subscribe((data:any)=>{
   this.TypeListDetails = data
   //console.log("TypeListDetails",this.TypeListDetails)
  }) 
}
saveData(valid:any){
  //console.log("savedata==",this.ObjHrleave);
  this.ConsultancyFormSumitted = true;
    if(valid){
    const tempObj={
      Cons_ID :  this.buttonname == "Update" ? this.ConsCode : 0,
      Consultancy_Type:this.ObjConsultancy.Consultancy_Type,
      Consultancy_Descr: this.ObjConsultancy.Consultancy_Descr,
      Test_Type: this.ObjConsultancy.Test_Type,
      Test_Type_Details:this.ObjConsultancy.Test_Type_Details,
      Is_Visiable: "Y",
      Chargeable :this.ObjConsultancy.Chargeable ,              
      Cat_ID : this.ObjConsultancy.Cat_ID,               
      Duration : this.ObjConsultancy.Duration,            
      Price :  this.ObjConsultancy.Price,                
      For_Support : "N" , 
      Own_Product_ID :  this.ObjConsultancy.Own_Product_ID ? this.ObjConsultancy.Own_Product_ID : undefined , 
    }  
     const obj = {
          "SP_String": "SP_Master_Consultancy_V3",
          "Report_Name_String":"Insert_Update_Master_Consultancy",
          "Json_Param_String": JSON.stringify([tempObj]) 
         }
         this.GlobalAPI.getData(obj)
         .subscribe((data:any)=>{
          console.log("data ==",data);
          if (data[0].Response ==="Done"){
            this.compacctToast.clear();
            this.compacctToast.add({
              key: "compacct-toast",
              severity: "success",
              summary: "Consultancy Succesfully " +this.buttonname ,
              detail: "Succesfully "
            });
            }
            this.Spinner = false;
            this.tabIndexToView = 0;
            this.ConsCode = undefined;
            this.ConsultancyFormSumitted = false;
            this.ObjConsultancy = new Consultancy();
            this.GetBrowseList();
            this.items = [ 'BROWSE', 'CREATE'];
          });
      }
      else{
        console.error("error password")
      }     
}
Active(Data:any){
  this.can_popup = false;
  this.masterId = undefined ;
  this.masterWonId =undefined;
 if(Data.Cons_ID && Data.Own_Product_ID){
  this.act_popup = true;
  this.masterId = Data.Cons_ID;
  this.masterWonId = Data.Own_Product_ID;
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
onConfirm2(){
  //console.log(this.ObjTax.Cat_ID)
    if(this.masterId && this.masterWonId){
      const tempoData ={
        Cons_ID: this.masterId,
        Own_Product_ID :this.masterWonId, 
      }
      const obj = {
        "SP_String": "SP_Master_Consultancy_V3",
        "Report_Name_String": "Active_Master_Consultancy",
        "Json_Param_String": JSON.stringify([tempoData])
      }
      this.GlobalAPI.getData(obj).subscribe((data:any)=>{
        // console.log("del Data===", data[0].Column1)
        if (data[0].Response === "Done"){
          this.onReject();
          this.GetBrowseList();
          this.act_popup = false;
          this.compacctToast.clear();
          this.compacctToast.add({
            key: "compacct-toast",
            severity: "success",
            summary: "Own Product ID: " + this.masterWonId.toString(),
            detail: "Succesfully Activated"
          });
          this.masterId = undefined ;
          this.masterWonId =undefined;  
        }
      })
    }
}
Deactive(data:any){
  this.act_popup = false;
  this.masterId = undefined ;
  this.masterWonId =undefined;
  if(data.Cons_ID && data.Own_Product_ID ){
    this.can_popup = true;
    this.masterId = data.Cons_ID;
    this.masterWonId = data.Own_Product_ID;
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
    if(this.masterId && this.masterWonId){
      const tempData ={
        Cons_ID: this.masterId,
        Own_Product_ID :this.masterWonId, 
      }
      const obj = {
        "SP_String": "SP_Master_Consultancy_V3",
        "Report_Name_String": "Inactive_Master_Consultancy",
        "Json_Param_String": JSON.stringify([tempData])
      }
      this.GlobalAPI.getData(obj).subscribe((data:any)=>{
         //console.log("del Data===", data[0].Response)
        if (data[0].Response === "Done"){
          this.onReject();
          this.GetBrowseList();
         this.can_popup = false;
          this.compacctToast.clear();
          this.compacctToast.add({
            key: "compacct-toast",
            severity: "success",
            summary: "Cons ID: " + this.masterId.toString(),
            detail: "Succesfully Deleted"
          });
          this.masterId = undefined;
          this.masterWonId = undefined;
         }
      })
    }
}
getEdit(ConsId:any){
  this.EditList = [];
  if (ConsId.Cons_ID) {
    this.ConsCode = undefined;
    this.tabIndexToView = 1;
    this.items = ["BROWSE", "UPDATE"];
    this.buttonname = "Update";
    this.clearData();
    this.ConsCode = ConsId.Cons_ID
    this.GetEditMaster(ConsId.Cons_ID)
   }  
}
GetEditMaster(Uid:any){
  const obj = {
    "SP_String": "SP_Master_Consultancy_V3",
    "Report_Name_String":"Get_Master_Consultancy",
    "Json_Param_String": JSON.stringify([{Cons_ID : Uid}]) 
   }
   this.GlobalAPI.getData(obj).subscribe((data:any)=>{
     //console.log("data",data);
     this.EditList = [];
    this.ObjConsultancy = data[0];
    this.ObjConsultancy.Consultancy_Type = data[0].Consultancy_Type;
    this.getTesttype();
    this.ObjConsultancy.Test_Type = data[0].Test_Type;
    this.GetTypDetails();
    this.ObjConsultancy.Test_Type_Details = data[0].Test_Type_Details;
    this.ObjConsultancy.Chargeable = data[0].Chargeable;
    this.ObjConsultancy.Cat_ID = data[0].Cat_ID;
    this.ObjConsultancy.Consultancy_Descr = data[0].Consultancy_Descr;
    this.ObjConsultancy.Duration = data[0].Duration;
    this.ObjConsultancy.Price = data[0].Price;
    this.ObjConsultancy.Own_Product_ID = data[0].Own_Product_ID
    this.getProductData(this.ObjConsultancy.Own_Product_ID);
   })
}
addProductPrice(valid:any){
  this.productSubmitted =true;
  //console.log("this.ObjProductPrice.Cost_Cen_ID",this.ObjProductPrice.Cost_Cen_ID)
  if(valid){
    let tempSaveData:any = []
    this.ObjProductPrice.Cost_Cen_ID.forEach((val, index)=>{
      const CostFilter:any = this.plantList.filter((el:any)=> Number(el.Cost_Cen_ID) === Number(val))[0];
      //console.log("CostFilter",CostFilter)
      if(CostFilter){
        const obj = {
          //Entry_ID: this.ObjProductPrice.Entry_ID,
          Product_ID: this.ObjConsultancy.Own_Product_ID ? this.ObjConsultancy.Own_Product_ID : undefined ,
          Cost_Cen_ID: CostFilter.Cost_Cen_ID,
          Cost_Cen_Name :CostFilter.Cost_Cen_Name ,
          Sale_Price: this.ObjProductPrice.Sale_Price,
        };
        this.multiProductObj.push(obj);
        tempSaveData.push(obj)
      }
   });
  // console.log("multiProductObj",this.multiProductObj)
   //console.log("tempSaveData",tempSaveData)

   const obj = {
    "SP_String": "SP_Master_Consultancy_V3",
    "Report_Name_String":"ADD_Master_Consultancy_Price",
    "Json_Param_String": JSON.stringify(tempSaveData) 
   }
   this.GlobalAPI.getData(obj)
   .subscribe((data:any)=>{
    //console.log("data add ==",data);
    if (data[0].Response ==="Done"){
      this.compacctToast.clear();
      this.compacctToast.add({
        key: "compacct-toast",
        severity: "success",
        summary: "Product Price Added " ,
        detail: "Succesfully Created "
      });
      }
      else{
        console.error("Somthing Error")
      }
      this.productSubmitted = false;
      this.ObjProductPrice = new ProductPrice();

    });  
}
}
deleteProduct(index, Entry_ID){
   //console.log('Entry_ID =', Entry_ID);
    const objData ={
      'Entry_ID' : Entry_ID
    };
    const obj = {
      "SP_String": "SP_Master_Consultancy_V3",
      "Report_Name_String": "Delete_Master_Consultancy_Price",
      "Json_Param_String": JSON.stringify([objData])
    }
    this.GlobalAPI.getData(obj).subscribe((data: any) => {
      //console.log("Delet Data========",data)
        if (data[0].Response === "Done") {
            this.onReject();
            this.compacctToast.clear();
            this.compacctToast.add({
              key: 'compacct-toast',
              severity: 'success',
              detail: 'Succesfully Deleted'
            });
              this.multiProductObj.splice(index, 1);
              this.getProductData(this.ObjConsultancy.Own_Product_ID);
          }
    });
}
getProductData(Uid){
  const obj = {
    "SP_String": "SP_Master_Consultancy_V3",
    "Report_Name_String":"Get_Master_Consultancy_Price",
    "Json_Param_String": JSON.stringify([{Product_ID : Uid}]) 
   }
   this.GlobalAPI.getData(obj).subscribe((data:any)=>{
     //console.log("data",data);
     this.EditListPrice = data;
     this.multiProductObj = this.EditListPrice;
    // console.log("multiProductObj",this.multiProductObj);
   
   })
}
}
class Consultancy {
  Cons_ID : any ;               
  Consultancy_Type : any ;       
  Consultancy_Descr : any ;    
  Test_Type	: any ;			  
  Test_Type_Details	: any ;	 
  Is_Visiable : "Y" ;         
  Chargeable : any ;          
  Own_Product_ID : any ;       
  Cat_ID : any ;               
  Duration : any ;              
  Price : any ;                 
  For_Support : "N" ;           
}
class ProductPrice {
  Product_ID :any;
  Cost_Cen_ID : any;
  Sale_Price: number;
  Cost_Cen_Name :any;
}
