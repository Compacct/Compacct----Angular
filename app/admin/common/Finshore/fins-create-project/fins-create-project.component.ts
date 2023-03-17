import { Component, OnInit, ViewEncapsulation, ViewChild } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { MessageService } from "primeng/api";
import { FileUpload } from "primeng/primeng";
import { CompacctCommonApi } from "../../../shared/compacct.services/common.api.service";
import { CompacctHeader } from "../../../shared/compacct.services/common.header.service";
import { map, catchError } from 'rxjs/operators';
@Component({
  selector: 'app-fins-create-project',
  templateUrl: './fins-create-project.component.html',
  styleUrls: ['./fins-create-project.component.css'],
  providers: [MessageService],
  encapsulation: ViewEncapsulation.None
})
export class FinsCreateProjectComponent implements OnInit {
  EngagmentLetter:any = undefined
  EngagmentDate:Date = new Date()
  ValuationDate:Date = new Date()
  buttonname:string = 'save'
  Spinner:boolean =false
  SubledgerList:any = []
  projectList:any = ["Valuation of Share","Fairness Opinion","Others"]
  purposeList:any = []
  selectProject:any = undefined
  selectPurpose:any = undefined
  selectAct:any = undefined
  ActList:any = []
  allList:any = [
    {Project_Type: "Valuation of Share",Purpose:"Allotment",Act:"Income Tax Act" },
    {Project_Type: "Valuation of Share",Purpose:"Transfer",Act:"FEMA" },
    {Project_Type: "Valuation of Share",Purpose:"ESOP Tax Perquisties",Act:"Co Act" },
    {Project_Type: "Valuation of Share",Purpose:"Internal",Act:"Internal" },
    {Project_Type: "Fairness Opinion",Purpose:"Marger",Act:"" },
    {Project_Type: "Fairness Opinion",Purpose:"Demerger",Act:"" },
    {Project_Type: "Fairness Opinion",Purpose:"ESOP",Act:"" },
    {Project_Type: "Others" },
    
  ]
  constructor(
    private $http: HttpClient,
    private commonApi: CompacctCommonApi,
    private Header: CompacctHeader,
    private compacctToast: MessageService
  ) { }

  ngOnInit() {
    this.Header.pushHeader({
      Header: "Create Project",
      Link: "Create Projectt"
    });
    this.getSubledger()
  }
  onReject() {
    this.compacctToast.clear("c");
  }
  onConfirm(){}
  changeEngagment(){
    console.log("EngagmentLetter",this.EngagmentLetter)
  }
  getSubledger(){
    this.$http.get("/Common/Get_Subledger_DR")
    .pipe(map((data:any) => data ? JSON.parse(data) : []))
    .subscribe((data:any)=>{
      this.SubledgerList = [...data]
    })
  }
  changeProject(value:any){
    this.purposeList = []
    this.selectPurpose = undefined
    this.selectAct = undefined
   let FilterallList = this.allList.filter((el:any)=> el.Project_Type == value)
    FilterallList.forEach((ele:any) => {
    if(ele.Purpose){
      this.purposeList.push(ele.Purpose)
    }
    });
  }
  changePurpose(value:any){
    console.log("v")
    this.ActList = []
    this.selectAct = undefined
   let FilterallList = this.allList.filter((el:any)=> el.Purpose == value)
    FilterallList.forEach((ele:any) => {
    if(ele.Act){
      this.ActList.push(ele.Purpose)
    }
    });
  }
}
