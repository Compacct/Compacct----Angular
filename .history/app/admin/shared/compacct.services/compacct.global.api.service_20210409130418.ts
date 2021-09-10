import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, catchError } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class CompacctGlobalApiService {

  constructor(private http: HttpClient) { }
  getData(ParamObj) {
    const obj = {
      'SP_String': ParamObj.SP_String,
      'Report_Name_String':  ParamObj.Report_Name_String,
      'Json_Param_String': ParamObj.Json_Param_String ? ParamObj.Json_Param_String : 'NA',
      'Json_1_String': ParamObj.Json_1_String ? ParamObj.Json_1_String : 'NA',
      'Json_2_String': ParamObj.Json_2_String ? ParamObj.Json_2_String : 'NA' ,
      'Json_3_String': ParamObj.Json_3_String ? ParamObj.Json_3_String : 'NA',
      'Json_4_String': ParamObj.Json_4_String ? ParamObj.Json_4_String : 'NA'     
    }
  const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
    return this.http.post(`/Common/Common_SP_For_All`,obj ,httpOptions).pipe(map((data:any) => data ? JSON.parse(data) : []));
  }
  postData(ParamObj) {
    const obj = {
      'SP_String': ParamObj.SP_String,
      'Report_Name_String':  ParamObj.Report_Name_String,
      'Json_Param_String': ParamObj.Json_Param_String ? ParamObj.Json_Param_String : 'NA',
      'Json_1_String': ParamObj.Json_1_String ? ParamObj.Json_1_String : 'NA',
      'Json_2_String': ParamObj.Json_2_String ? ParamObj.Json_2_String : 'NA' ,
      'Json_3_String': ParamObj.Json_3_String ? ParamObj.Json_3_String : 'NA',
      'Json_4_String': ParamObj.Json_4_String ? ParamObj.Json_4_String : 'NA'    
    }
  const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
    return this.http.post(`/Common/Common_SP_For_All`,obj , httpOptions).pipe(map((data:any) => data ? JSON.parse(data) : []));
  }
  CommonTaskData(ParamObj) {
    const obj = {
      'Json_Param_String': ParamObj.Json_Param_String ? ParamObj.Json_Param_String : '[]'    
    }
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
    return this.http.post(`/Common/Create_Common_task?Report_Name=`+ParamObj.Report_Name,obj ,httpOptions).pipe(map((data:any) => data ? JSON.parse(data) : []));
  }
}
