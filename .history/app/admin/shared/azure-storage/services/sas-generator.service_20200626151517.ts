import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { BlobStorageRequest } from '../types/azure-storage';
@Injectable({
  providedIn: 'root'
})
export class SasGeneratorService {
  d:BlobStorageRequest;
  constructor(private http: HttpClient) {}

  getSasToken(): Observable<BlobStorageRequest> {
    this.d= {"storageUri":environment.baseUrl,
    "storageAccessToken":environment.sas}
    return of(this.d);
  }
}
