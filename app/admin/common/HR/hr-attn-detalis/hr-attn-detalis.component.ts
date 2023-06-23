import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { CompacctCommonApi } from '../../../shared/compacct.services/common.api.service';
import { CompacctHeader } from '../../../shared/compacct.services/common.header.service';
import { ActivatedRoute } from '@angular/router';
import { DateTimeConvertService } from '../../../shared/compacct.global/dateTime.service';
import { CompacctGlobalApiService } from '../../../shared/compacct.services/compacct.global.api.service';
import { MessageService } from "primeng/api";
import { CompacctGetDistinctService } from '../../../shared/compacct.services/compacct-get-distinct.service';
declare const window: any;
declare var google: any;
@Component({
  selector: 'app-hr-attn-detalis',
  templateUrl: './hr-attn-detalis.component.html',
  styleUrls: ['./hr-attn-detalis.component.css'],
  providers: [MessageService],
  encapsulation: ViewEncapsulation.None
})
export class HRAttnDetalisComponent implements OnInit {
  ObjBrowse:Browse = new Browse()
  seachSpinner:boolean = false
  getAlldataList:any[] = []
 
  options: any;
  mapModal:boolean = false
  overlays: any[];
  imgUrl:any
  infoWindow: any;
  seachSpinnerFetch:boolean = false
  loading:boolean = false
  markerObj:any = {}
  constructor(
    private commonApi: CompacctCommonApi,
    private Header: CompacctHeader,
    private route : ActivatedRoute,
    private DateService: DateTimeConvertService,
    private GlobalAPI: CompacctGlobalApiService,
    private compacctToast: MessageService,
    private GetDistinctItems :CompacctGetDistinctService
  ) { }

  ngOnInit() {
    this.Header.pushHeader({
      Header: "Attendance Detalis",
      Link: "Hr -> Attendance Detalis"
    })
    this.options = {lat: 22.5822732, lng: 88.4555348};

this.infoWindow = new google.maps.InfoWindow();
  }
  getDateRange(dateRangeObj) {
    if (dateRangeObj.length) {
      this.ObjBrowse.StartDate = dateRangeObj[0];
      this.ObjBrowse.EndDate  = dateRangeObj[1];
    }
    }
  getAllData(valid?:any){
    this.getAlldataList = []
    this.loading = true
    this.seachSpinner = true
    const tempData = {
      StartDate :  this.ObjBrowse.StartDate
      ? this.DateService.dateConvert(new Date(this.ObjBrowse.StartDate))
      : this.DateService.dateConvert(new Date()),
      EndDate : this.ObjBrowse.EndDate
      ? this.DateService.dateConvert(new Date(this.ObjBrowse.EndDate))
      : this.DateService.dateConvert(new Date())
    }
 const obj = {
      "SP_String": "SP_HR_ATTN_DETAILS",
      "Report_Name_String":"Get_ATTN_DETAILS",
      "Json_Param_String": JSON.stringify([tempData])
    }
    this.GlobalAPI.postData(obj).subscribe((data:any)=>{
      this.getAlldataList = data.length ? data : []
      this.loading = false
      this.seachSpinnerFetch = false
      this.seachSpinner = false
     
    })
  }
  getFetchAttendance(valid?:any){
    this.loading = true
    this.seachSpinnerFetch = true
    const tempData = {
      StartDate :  this.ObjBrowse.StartDate
      ? this.DateService.dateConvert(new Date(this.ObjBrowse.StartDate))
      : this.DateService.dateConvert(new Date()),
      EndDate : this.ObjBrowse.EndDate
      ? this.DateService.dateConvert(new Date(this.ObjBrowse.EndDate))
      : this.DateService.dateConvert(new Date())
    }
 const obj = {
      "SP_String": "SP_HR_ATTN_DETAILS",
      "Report_Name_String":"SAVE_ATTN_DETAILS",
      "Json_Param_String": JSON.stringify([tempData])
    }
    this.GlobalAPI.postData(obj).subscribe((data:any)=>{  
      console.log(data)
      if(data[0].Column1 == 'Done'){
       
        this.getAllData()
      }
      else {
        this.loading = false
        this.seachSpinnerFetch = false
        this.compacctToast.clear();
        this.compacctToast.add({
         key: "compacct-toast",
         severity: "error",
         summary: "Somthing Was Wrong",
         detail:"Try Again Later"
    });
      }
     
    })
  }
  getoverlays(col){
    return [new google.maps.Marker({position: {lat: col.LAT, lng: col.Long}, title:"Konyaalti"})]
  }
  openImg(event,data, overlaypanel){
    overlaypanel.toggle(event);
    this.imgUrl = data.Photo
  }
  openMap(col){
    this.options = {
      center: {lat: col.LAT, lng: col.Long},
      zoom: 12
  };
    // this.overlays = [ 
    //   new google.maps.Marker({position: {lat: col.LAT, lng: col.Long}, title:"Konyaalti"})
    // ];
    this.markerObj = col
    this.mapModal = true
  }
  getinoutColor(obj:any) {
    switch (obj.InOut) {
            case 'Out':
                return 'red';
                break;
             case 'In':
                return 'green';
                break;
            
            default:
        }
    
    return
}
}
class Browse {
  StartDate : any ;
  EndDate  : any;
}