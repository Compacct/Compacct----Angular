import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CompacctGlobalUrlService {
  searchstocktransferGst = 'INV_Txn_St_Trf_GST/GetAllDataGST';
  createStocktransferGst = 'INV_Txn_St_Trf_GST/Create_INV_Txn_St_Trf_Ajax_v2';
  updatestocktransfer = 'INV_Txn_St_Trf_GST/Update_INV_Txn_St_Trf_Ajax_v2';
  updateEwayBillstocktransfer = 'INV_Txn_St_Trf_GST/update_ewaybill';
  geteditdatastocktransfer = 'INV_Txn_St_Trf_GST/GetEditData';
  deletestocktransfer = 'INV_Txn_St_Trf_GST/Delete';

  constructor() { }
}
