import { Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { CompacctGlobalApiService } from "../../../compacct.services/compacct.global.api.service";
@Component({
  selector: 'update-consultancy',
  templateUrl: './update-consultancy.component.html',
  styleUrls: ['./update-consultancy.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class UpdateConsultancyComponent implements OnInit {
 InputObj:any = {}
 UpdateConsultancyFormSubmit:boolean = false
 Objconsultancy:consultancy = new consultancy()
 FirstLevelList:any = []
 SecondLevelList:any = []
 ThirdLevelList:any = []
 Spinner:any = false
 SecondL:string = ""
 ThirdL:string = ""

   @Output() saveData = new EventEmitter<any>();
  constructor( private GlobalAPI: CompacctGlobalApiService,) { }

  ngOnInit() {
    this.getFirstL()
  }
  getFirstL(){
    this.FirstLevelList = []
    const obj = {
      "SP_String": "sp_DoctorsAppointmentNew",
      "Report_Name_String": "Get_Level_1_Status",
     }
    this.GlobalAPI.getData(obj).subscribe((data:any)=>{
      this.FirstLevelList = data
      this.Objconsultancy.Level_1_Status = this.FirstLevelList.length ? data[0].Level_1_ID.toString() : ""
      this.getSecondL()
      console.log("FirstLevelList",data)
      console.log("this.Objconsultancy.Level_1_Status",this.Objconsultancy.Level_1_Status)
    })
  }
  getSecondL(edit?:any){
    this.Objconsultancy.Level_2_Status = ''
    this.Objconsultancy.Level_3_Status = ''
    this.SecondL = this.FirstLevelList.length ? this.FirstLevelList.filter((el:any) => Number(el.Level_1_ID) == Number(this.Objconsultancy.Level_1_Status))[0].Level_1_Status : ''
    this.eventEmit()

    if(this.Objconsultancy.Level_1_Status){
      this.SecondLevelList = []
      const obj = {
        "SP_String": "sp_DoctorsAppointmentNew",
        "Report_Name_String": "Get_Level_2_Status",
        "Json_Param_String": JSON.stringify({Level_1_ID : this.Objconsultancy.Level_1_Status})
       }
      this.GlobalAPI.postData(obj).subscribe((data:any)=>{
        this.SecondLevelList = data
        if(!edit){
          this.Objconsultancy.Level_2_Status = this.SecondLevelList.length ? data[0].Level_2_ID.toString() : ""
           this.getThirdL()
        }
     
        
      })
    }
    
  }
  getThirdL(edit?:any){
    this.Objconsultancy.Level_3_Status = ''
    this.ThirdL = this.SecondLevelList.length ? this.SecondLevelList.filter((el:any) => Number(el.Level_2_ID) == Number(this.Objconsultancy.Level_2_Status))[0].Level_2_Status : ''
    this.eventEmit()
    if(this.Objconsultancy.Level_2_Status){
      this.ThirdLevelList = []
      const obj = {
        "SP_String": "sp_DoctorsAppointmentNew",
        "Report_Name_String": "Get_Level_3_Status",
        "Json_Param_String": JSON.stringify({Level_2_ID : this.Objconsultancy.Level_2_Status})
       }
      this.GlobalAPI.postData(obj).subscribe((data:any)=>{
        this.ThirdLevelList = data
         console.log("ThirdLevelList",data)
        if(!edit){
          this.Objconsultancy.Level_3_Status = this.ThirdLevelList.length ? data[0].Level_3_ID.toString() : ""
        }
        this.eventEmit()
      })
    }
  }
  ChangeThirdL(){
    this.eventEmit()
  }
  eventEmit(){
      const FirstLevelListFilter = this.FirstLevelList.find((el:any)=> Number(el.Level_1_ID) == Number(this.Objconsultancy.Level_1_Status))
     const SecondLevelListFilter = this.SecondLevelList.find((el:any)=> Number(el.Level_2_ID) == Number(this.Objconsultancy.Level_2_Status))
     const ThirdLevelListFilter = this.ThirdLevelList.find((el:any)=> Number(el.Level_3_ID) == Number(this.Objconsultancy.Level_3_Status))
      const tempObj = {
       Level_1_Status:  FirstLevelListFilter ? FirstLevelListFilter.Level_1_Status : "",
       Level_2_Status: SecondLevelListFilter ? SecondLevelListFilter.Level_2_Status : "",
       Level_3_Status : ThirdLevelListFilter ? ThirdLevelListFilter.Level_3_Status : ""
      }
  this.saveData.emit(tempObj)
    
  }
  SaveUpdateConsultancy(valid:any){
   console.log("valid",valid)
   this.UpdateConsultancyFormSubmit = true
   if(valid){
    this.Spinner = true
    const FirstLevelListFilter = this.FirstLevelList.find((el:any)=> Number(el.Level_1_ID) == Number(this.Objconsultancy.Level_1_Status))
    const SecondLevelListFilter = this.SecondLevelList.find((el:any)=> Number(el.Level_2_ID) == Number(this.Objconsultancy.Level_2_Status))
    const ThirdLevelListFilter = this.SecondLevelList.find((el:any)=> Number(el.Level_3_ID) == Number(this.Objconsultancy.Level_3_Status))
     const tempObj = {
      Appo_ID: this.InputObj.Appo_ID,
      Level_1_Status:  FirstLevelListFilter ? FirstLevelListFilter.Level_1_Status : "",
      Level_2_Status: SecondLevelListFilter ? SecondLevelListFilter.Level_2_Status : "",
      Level_3_Status : ThirdLevelListFilter ? ThirdLevelListFilter.Level_3_Status : ""
     }
     const obj = {
      "SP_String": "sp_DoctorsAppointmentNew",
      "Report_Name_String": "Update_Consultancy_Done",
      "Json_Param_String": JSON.stringify(tempObj)
     }
    this.GlobalAPI.postData(obj).subscribe((data:any)=>{
      console.log(" Update Data ",data)
      if(data[0].Column1 == "Done"){
       
        this.clearData()
       
      }
    })
   }
  }
  clearData(){
    this.Spinner = false
    this.UpdateConsultancyFormSubmit = false
    
  }
  clearComData(){
    this.UpdateConsultancyFormSubmit = false
    this.Objconsultancy = new consultancy()
    this.getFirstL()
    this.SecondLevelList = []
    this.ThirdLevelList = []
    this.Spinner = false
    this.SecondL = ""
    this.ThirdL = ""
  }
  editConsulyancy(obj:editObj){
    console.log("obj",obj)
    
     const FilterFirstLevelList = this.FirstLevelList.filter((el:any)=> el.Level_1_Status == obj.Level_1_Status )
     if(FilterFirstLevelList.length){
      this.Objconsultancy.Level_1_Status = FilterFirstLevelList[0].Level_1_ID
      this.getSecondL(true)
      setTimeout(() => {
        const FilterSecondLevelList = this.SecondLevelList.filter((el:any)=> el.Level_2_Status == obj.Level_2_Status )
        if(FilterSecondLevelList.length){
          this.Objconsultancy.Level_2_Status = FilterSecondLevelList[0].Level_2_ID.toString()
          this.getThirdL(true)
         } 
        setTimeout(() => {
          const FilterThirdLevelList = this.ThirdLevelList.filter((el:any)=> el.Level_3_Status == obj.Level_3_Status )
          if(FilterThirdLevelList.length){
          this.Objconsultancy.Level_3_Status = FilterThirdLevelList[0].Level_3_ID.toString()
          this.ChangeThirdL()
         }
        }, 500);
      }, 500);
    
       } 
    
   
  }
}
class consultancy{
  Level_1_Status:any = "";
  Level_2_Status:any = "";
  Level_3_Status: any = "";
}
interface inputValue{
  required:boolean
}
interface editObj{
  Level_1_Status:string
  Level_2_Status:string
  Level_3_Status: string
}