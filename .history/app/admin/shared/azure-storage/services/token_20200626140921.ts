import { InjectionToken } from '@angular/core';
import { BlobServiceClient } from '@azure/storage-blob';
import {
  BlobStorageClientFactory,
  BlobStorageRequest
} from '../types/azure-storage';

export const BLOB_STORAGE_TOKEN = new InjectionToken<BlobStorageClientFactory>(
  'st=2020-06-26T05%3A16%3A05Z&se=2030-06-27T05%3A16%3A00Z&sp=rl&sv=2018-03-28&sr=c&sig=p2mHCdg5yrs7kcls0DCVvwbkPNMEjsiVQZ2LhAInw6M%3D'
);

export function azureBlobStorageFactory(): BlobStorageClientFactory {
  const buildConnectionString = (options: BlobStorageRequest) => {
    return (
      `BlobEndpoint=${options.storageUri};` +
      `SharedAccessSignature=${options.storageAccessToken}`
    );
  };

  return options =>
    BlobServiceClient.fromConnectionString(buildConnectionString(options));
}
