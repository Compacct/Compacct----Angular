import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { BlobStorageRequest } from '../types/azure-storage';
@Injectable({
  providedIn: 'root'
})
export class SasGeneratorService {
  constructor(private http: HttpClient) {}

  getSasToken(): Observable<BlobStorageRequest> {
    const d<BlobStorageRequest> = {"storageUri":environment.baseUrl,
    "storageAccessToken":environment.sas}
    return d;
  }
}
