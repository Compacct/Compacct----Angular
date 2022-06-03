import { Component, OnInit, Output, EventEmitter, Input, SimpleChanges, OnChanges } from "@angular/core";
import { CompacctCommonApi } from "../../../compacct.services/common.api.service";
import { HttpParams, HttpClient } from "@angular/common/http";
declare var $: any;

@Component({
  selector: 'app-compacct-project',
  templateUrl: './compacct-project.component.html',
  styleUrls: ['./compacct-project.component.css']
})
export class CompacctProjectComponent implements OnInit,OnChanges {
  objproject = new project();
  projectFromSubmit = false;
  ProjectList = [];
  requField = false
  @Output() projectObj = new EventEmitter<project>()
  @Input()  requir:any 
  @Input() field:{}
  constructor(
    private $http: HttpClient,
    private $CompacctAPI: CompacctCommonApi
  ) { }

  ngOnInit() {
    console.log("projectFromSubmit",this.projectFromSubmit);
    console.log("field",this.field);
    this.requField = this.field === 'Y' ? true :false
  }
  EmitOnDataInit() {
    this.projectObj.emit(this.objproject);
  }
  ngOnChanges(changes: SimpleChanges) {
        
    //this.doSomething(changes.categoryId.currentValue);
    // You can also use categoryId.previousValue and 
    // categoryId.firstChange for comparing old and new values
    console.log("changes >>",changes);
    this.projectFromSubmit = changes.requir.currentValue
}
}
class project{
    DOC_NO:any;
    DOC_DATE:any;
    DOC_TYPE:any;
    PROJECT_ID:any;
    SITE_ID:any;
    Budget_Group_ID:any;
    Budget_Sub_Group_ID:any;
    Work_Details_ID:any;
}