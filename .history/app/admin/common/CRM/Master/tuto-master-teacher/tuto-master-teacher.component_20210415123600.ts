import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MessageService } from "primeng/api";
import { CompacctHeader } from "../../../../shared/compacct.services/common.header.service";
import { CompacctGlobalApiService } from '../../../../shared/compacct.services/compacct.global.api.service';
declare var $:any;
@Component({
  selector: 'app-tuto-master-teacher',
  templateUrl: './tuto-master-teacher.component.html',
  styleUrls: ['./tuto-master-teacher.component.css'],
  providers: [MessageService],
  encapsulation: ViewEncapsulation.None
})
export class TutoMasterTeacherComponent implements OnInit {
  tabIndexToView = 0;
  items = [];
  Subjectlist = [];
  SelectedSubject = [];
  TeachernSubjectlist =[];
  TeacherFormSubmitted = false;
  buttonname = "Save";
  Spinner = false;
  TeacherID: any;

  ObjteacherForm = new teacherForm();
  returnedID = 0;

  constructor(
    private $http : HttpClient,
    private Header: CompacctHeader,
    private GlobalAPI: CompacctGlobalApiService,
    private compacctToast: MessageService
  ) { }

  ngOnInit() {
    this.items = ["BROWSE", "CREATE"];
    this.Header.pushHeader({
      Header: "Teacher & Subject Management",
      Link: " Support -> Teacher Master -> Teacher & Subject Management"
    });
    this.getsubjectlist();
    this.getTeachernSubjectlist();
  }

  TabClick(e){
    this.tabIndexToView = e.index;
    this.items = ["BROWSE", "CREATE"];
    this.buttonname = "Save";
    this.clearData();


  }

  getTeachernSubjectlist(){
    this.TeachernSubjectlist = [];
    const obj = {
      "Report_Name": "Browse_Teacher",
    }
    this.GlobalAPI.CommonTaskData(obj).subscribe((data:any)=>{
      //console.log(data)
      this.TeachernSubjectlist = data ? data : [];
    })
  }

  getsubjectlist(){
    const obj = {
      "Report_Name": "Get Subject List"
    }
    this.GlobalAPI.CommonTaskData(obj).subscribe((data:any)=>{
      const SerialNoList = data;
      SerialNoList.forEach(el => {
        this.Subjectlist.push({
          label: el.Sub_Name,
          value: el.Subject_ID
        });
      });
    })

  }
  commomSavaedit(valid) {
    this.TeacherFormSubmitted = true;
    this.returnedID = 0;
    if(this.SelectedSubject.length && valid) {
      if(this.ObjteacherForm.Teacher_ID) {
        this.getEdit(valid);
      }else {
        this.Save(valid);

      }
    }
    if(!this.SelectedSubject.length){
      this.compacctToast.clear();
      this.compacctToast.add({
        key: "compacct-toast",
        severity: "error",
        summary: "Warn Message",
        detail: "Please select subject. "
      });
    }
  }
  Save(valid){
    if(this.SelectedSubject.length && valid){
      const obj = {
        "Report_Name": "Create_Teacher",
        "Json_Param_String": JSON.stringify([this.ObjteacherForm])

      }
      this.GlobalAPI.CommonTaskData(obj).subscribe((data:any)=>{
        //console.log(data);
        if(data[0].Column1) {
          this.returnedID = data[0].Column1
          this.saveSubjectByuserid();
        } else{
          this.compacctToast.clear();
          this.compacctToast.add({
            key: "compacct-toast",
            severity: "error",
            summary: "Warn Message",
            detail: "Error Occured "
          });
          this.Spinner = false;
        }
      })
    }

  }
  saveSubjectByuserid (){
    if(this.SelectedSubject.length && this.returnedID){
      let tempArr = [];
      for (let i of this.SelectedSubject) {
        const obj = {
          User_ID : this.returnedID,
          Subject_ID : i
        }
        tempArr.push(obj)
      }
      const obj = {
        "Report_Name": "Teacher_Subject",
        "Json_Param_String": JSON.stringify(tempArr)

      }
      this.GlobalAPI.CommonTaskData(obj).subscribe((data:any)=>{
        //console.log(data);
        if(data[0].Remarks === "success") {
          this.compacctToast.clear();
          const mgs = this.buttonname === 'Save' ? "Created" : "updated";
          this.compacctToast.add({
            key: "compacct-toast",
            severity: "success",
            summary: "USER ID : " + this.returnedID,
            detail:  "Succesfully " + mgs
          });
          this.clearData();
          this.getTeachernSubjectlist();
        } else{
          this.compacctToast.clear();
          this.compacctToast.add({
            key: "compacct-toast",
            severity: "error",
            summary: "Warn Message",
            detail: "Error Occured "
          });
          this.Spinner = false;
        }
      })
    }
  }

  Edit(tnslist){
    if (tnslist['Teacher_ID']) {
      this.clearData();
      this.tabIndexToView = 1;
      this.items = ["BROWSE", "UPDATE"];
      this.buttonname = "Update";
      const Subject_Name = tnslist['Subject_Name'].split(',');
      let tempArr = [];
      const Subjectlist = [...this.Subjectlist];
      for (let i =0; i < Subject_Name.length;i++ ) {
        const tempProduct = $.grep(Subjectlist, function(value) {
          return value.label === Subject_Name[i];
        });
        if(tempProduct.length) {
          tempArr.push(tempProduct[0].value);
        }

      }
      this.SelectedSubject = tempArr;
      this.ObjteacherForm.Name = tnslist.Teacher_Name;
      this.ObjteacherForm.User_Name = tnslist.User_Name;
      this.ObjteacherForm.Password = tnslist.Password;
      this.ObjteacherForm.Teacher_ID = tnslist.Teacher_ID;
     // this.getEdit(tnslist);
    }
  }

  getEdit(valid){
    if(this.SelectedSubject.length && valid) {
      const objTemp ={...this.ObjteacherForm,...{User_ID : this.ObjteacherForm.Teacher_ID}}
      const obj = {
        "Report_Name": "Update_Teacher",
        "Json_Param_String": JSON.stringify([objTemp])
      }
      this.GlobalAPI.CommonTaskData(obj).subscribe((data:any)=>{
        //console.log(data);
        if(data[0].Remarks === "success") {
          this.returnedID = Number(this.ObjteacherForm.Teacher_ID);
          this.saveSubjectByuserid();
        } else{
          this.compacctToast.clear();
          this.compacctToast.add({
            key: "compacct-toast",
            severity: "error",
            summary: "Warn Message",
            detail: "Error Occured "
          });
          this.Spinner = false;
        }
      })
    }

  }


  Deactivated(tnslist){
    this.TeacherID = undefined ;
    if(tnslist.Teacher_ID){
      this.TeacherID = tnslist.Teacher_ID ;
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


  clearData(){
    this.TeacherFormSubmitted = false;
    this.Spinner = false;
    this.returnedID = 0;
    this.SelectedSubject = [];
    this.ObjteacherForm = new teacherForm();
  }

  onReject() {
    this.compacctToast.clear("c");
  }
  onConfirm() {
    const Tempobj = {
      User_ID : this.TeacherID
    }
    const obj = {
      "Report_Name": "Deactivate_Teacher",
      "Json_Param_String": JSON.stringify([Tempobj])
    }
    this.GlobalAPI.CommonTaskData(obj).subscribe((data:any)=>{
      //console.log(data);
      if(data[0].Remarks === "success") {
        this.compacctToast.clear();
        this.compacctToast.add({
          key: "compacct-toast",
          severity: "success",
          summary: "Teacher ID : " + this.TeacherID,
          detail:  "Succesfully Deactive"
        });
        this.getTeachernSubjectlist();
      } else{
        this.compacctToast.clear();
        this.compacctToast.add({
          key: "compacct-toast",
          severity: "error",
          summary: "Warn Message",
          detail: "Error Occured "
        });
      }
    })


  }


  // UPDATE FROM TUTOPIA API
  CallTutopiaAppApi() {
      const httpOptions = {
        headers: new HttpHeaders()
          .set('Authorization', 'Bearer aZyAs0ynGvmOSNyyAOkJauiV')
      }
      this.$http
        .get("https://api.tutopia.in/api/crm/v1/class/subject",httpOptions)
        .subscribe((res: any) => {
          this.saveSubjectoDB(res.data.subject_list);
        });
  }
  saveSubjectoDB(SubjectData) {
    let tempArr = [];
      for (let i of SubjectData) {
        tempArr.push({
          subject_id : i.subject_id,
          class_id : i.class_id,
          subject_name : this.toUnicode(i.subject_name)
        })
      }
      console.log(tempArr)
      const obj = {
        "Report_Name": "Add Subject Master",
        "Json_Param_String": JSON.stringify(tempArr)

      }
       this.GlobalAPI.CommonTaskData(obj).subscribe((data:any)=>{
         console.log(data);
         this.getsubjectlist();
      //   if(data[0].Remarks === "success") {
      //     this.compacctToast.clear();
      //     const mgs = this.buttonname === 'Save' ? "Created" : "updated";
      //     this.compacctToast.add({
      //       key: "compacct-toast",
      //       severity: "success",
      //       summary: "USER ID : " + this.returnedID,
      //       detail:  "Succesfully " + mgs
      //     });
      //     this.clearData();
      //     this.getTeachernSubjectlist();
      //   } else{
      //     this.compacctToast.clear();
      //     this.compacctToast.add({
      //       key: "compacct-toast",
      //       severity: "error",
      //       summary: "Warn Message",
      //       detail: "Error Occured "
      //     });
      //     this.Spinner = false;
      //   }
       })
  }
  toUnicode(str) {
    return str.split('').map(function (value, index, array) {
      let temp = value.charCodeAt(0).toString(16).toUpperCase();
      if (temp.length > 2) {
        return '\\u' + temp;
      }
      return value;
    }).join('');
  }

}

class teacherForm{
  Teacher_ID :string;
  Name: string;
  Password:string;
  User_Name: string;
}
