import { Component, OnInit, Input, ViewEncapsulation } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { MessageService } from "primeng/api";

@Component({
  selector: "app-master-cost-center-godown",
  templateUrl: "./master.cost-center-godown.component.html",
  styleUrls: ["./master.cost-center-godown.component.css"]
})
export class MasterCostCenterGodownComponent implements OnInit {
  tabIndexToView = 0;
  buttonname = "Create";
  Spinner = false;
  items = [];
  CostcentergodownFormSubmitted = false;
  productList = [];
  costCenterGodownList = [];
  ObjCostCenterGodown: Costcentergodown = new Costcentergodown();
  @Input() costCenterId: number;

  tmp_Cost_Cen_ID: number;
  constructor(
    private $http: HttpClient,
    private compacctToast: MessageService
  ) {}

  ngOnInit() {
    this.getProductList();
    console.log("costCenterId >>>> ", this.costCenterId);
    this.ObjCostCenterGodown.Cost_Cen_ID = this.costCenterId;
    console.log("costCenterId 22 >>>> ", this.ObjCostCenterGodown.Cost_Cen_ID);
    this.getCostCenterGodownList();
  }

  getProductList() {
    this.$http
      .get("/Master_Cost_Center_Godown/Get_Product_GoDown")
      .subscribe((data: any) => {
        this.productList = data ? JSON.parse(data) : [];
      });
  }

  getCostCenterGodownList() {
    this.$http
      .get(
        "/Master_Cost_Center_Godown/Get_GoDown_Details?Cost_Cen_Id=" +
          this.ObjCostCenterGodown.Cost_Cen_ID
      )
      .subscribe((data: any) => {
        this.costCenterGodownList = data ? JSON.parse(data) : [];
        console.log("costCenterGodownList 88 =", this.costCenterGodownList);
      });
  }

  // Save
  SaveCostcenterGodownMaster(valid) {
    this.CostcentergodownFormSubmitted = true;
    console.log("ObjCostCenterGodown = ", this.ObjCostCenterGodown);

    if (valid) {
      this.Spinner = true;
      const UrlAddress =
        "/Master_Cost_Center_Godown/Create_Edit_Cost_Center_GoDown";

      const obj = {
        Cost_Centre_GoDown_String: JSON.stringify([this.ObjCostCenterGodown])
      };
      this.$http.post(UrlAddress, obj).subscribe((data: any) => {
        if (data.success) {
          if (this.ObjCostCenterGodown.godown_id) {
            this.compacctToast.clear();
            this.compacctToast.add({
              key: "compacct-toast",
              severity: "success",
              summary:
                "Cost Center Godowwn ID  :" +
                this.ObjCostCenterGodown.godown_id,
              detail: "Succesfully Updated"
            });
            this.getCostCenterGodownList();
          } else {
            this.compacctToast.clear();
            this.compacctToast.add({
              key: "compacct-toast",
              severity: "success",
              summary: "Cost Center Godown Added",
              detail: "Succesfully Created"
            });
            console.log(
              "costCenterId 33 >>>> ",
              this.ObjCostCenterGodown.Cost_Cen_ID
            );
            this.getCostCenterGodownList();
            this.tmp_Cost_Cen_ID = this.ObjCostCenterGodown.Cost_Cen_ID;
            this.clearData();
          }
          this.Spinner = false;
        } else {
          this.compacctToast.clear();
          this.compacctToast.add({
            key: "compacct-toast",
            severity: "error",
            summary: "Warn Message",
            detail: "Error Occured "
          });
        }
      });
    }
  }
  clearData() {
    this.CostcentergodownFormSubmitted = false;
    this.Spinner = false;
    this.ObjCostCenterGodown = new Costcentergodown();
    this.ObjCostCenterGodown.Cost_Cen_ID = this.tmp_Cost_Cen_ID;
  }

  // Edit
  EditCostcenter(Costcenter) {
    if (Costcenter.Cost_Cen_ID) {
      this.tabIndexToView = 1;
      this.items = ["BROWSE", "UPDATE"];
      this.buttonname = "Update";
      this.clearData();
    }
  }

  // Delete
  DeleteCostcenter(Costcenter) {
    this.$http
      .post("/Master_Cost_Center_Godown/Delete", {
        Delete_godown_id: Costcenter.godown_id
      })
      .subscribe((data: any) => {
        if (data.success === true) {
          this.getCostCenterGodownList();
          this.compacctToast.clear();
          this.compacctToast.add({
            key: "compacct-toast",
            severity: "success",
            summary:
              "Cost Center Godown ID: " +
              this.ObjCostCenterGodown.godown_id.toString(),
            detail: "Succesfully Deleted"
          });
        }
      });
  }
}

class Costcentergodown {
  godown_id = 0;
  Cost_Cen_ID: number;
  Godown_Name: string;
  Reserved = "N";
  Support = "N";
  Is_Visiable = "Y";
  Product_ID: number;
}
