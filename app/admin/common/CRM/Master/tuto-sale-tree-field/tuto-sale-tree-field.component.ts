import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MessageService } from 'primeng/api';
import { CompacctCommonApi } from '../../../../shared/compacct.services/common.api.service';
import { CompacctHeader } from '../../../../shared/compacct.services/common.header.service';
import { CompacctGlobalApiService } from '../../../../shared/compacct.services/compacct.global.api.service';

@Component({
  selector: 'app-tuto-sale-tree-field',
  templateUrl: './tuto-sale-tree-field.component.html',
  styleUrls: ['./tuto-sale-tree-field.component.css'],
  providers: [MessageService],
  encapsulation: ViewEncapsulation.None
})
export class TutoSaleTreeFieldComponent implements OnInit {
  CreateFieldModal = false;
  CreateFieldModalFormSubmitted = false;
  CreateFieldModalTitle = '';

  ObjSaleField = new SalesTreeField();
  DistrictList = [];
  @ViewChild("location", { static: false }) locationInput: ElementRef;
  constructor(
    private $http: HttpClient,
    private Header: CompacctHeader,
    private $CompacctAPI: CompacctCommonApi,
    private compacctToast: MessageService,
    private GlobalAPI: CompacctGlobalApiService) { }

  ngOnInit() {
    this.Header.pushHeader({
      Header: "Sales Tree Field Sales",
      Link: " Channel Sale -> Sales Tree Field Sales"
    });
    console.log('gg');
    this.GetAllWBdistrict();
  }
  getAddressOnChange(e) {
    this.ObjSaleField.Location = undefined;
   if (e) {
      this.ObjSaleField.Location = e;
   }
  }
  GetAllWBdistrict() {
    this.$http
      .get("/Master_Cost_Center_V2/Get_District?statename=WEST BENGAL")
      .subscribe((data: any) => {
        this.DistrictList = data ? JSON.parse(data) : [];
      });
  }
  stateDistrictChange(pin) {
    this.ObjSaleField.District = undefined;
    if (pin.length === 6) {
      this.$http
        .get("/Master_Cost_Center_V2/Get_State_District_Against_PIN?PIN=" + pin)
        .subscribe((data: any) => {
          if(data) {
            this.ObjSaleField.District = JSON.parse(data)[0].Districtname;
          }
        });
    }
  }

  OpenSaleFieldModal(type,obj?) {
    this.ClearData();
    if(obj) {
      this.ObjSaleField = obj;
      this.CreateFieldModal = true;
    } else {
      this.CreateFieldModalTitle = type;
      this.CreateFieldModal = true;
    }
  }
  SaveUpdateField (valid) {
    this.CreateFieldModalFormSubmitted = true;
    if(valid) {

    }
  }
  ClearData() {  
    this.ObjSaleField = new SalesTreeField();
    if(this.locationInput) {
      this.locationInput.nativeElement.value = '';
    }  
  }

}

class SalesTreeField {
  Name:string;
  User_Name:string;
  Location:string;
  Address:string;
  Pin_Code:string;
  District:string;
  Password:string;
}