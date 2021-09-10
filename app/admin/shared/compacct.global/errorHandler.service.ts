import { ErrorHandler, Injectable } from '@angular/core';

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
    public onlineOffline: boolean = navigator.onLine;
    handleError(error: any): void {
        console.error(error);
        if (this.onlineOffline) {
            const chunkFailedMessage = /Loading chunk [\d]+ failed/;
            if (chunkFailedMessage.test(error.message)) {
                window.location.reload();
            }
            // let errorMessage = '';
            // if (error.error instanceof ErrorEvent) {
            //     // client-side error
            //     errorMessage = `Error: ${error.error.message}`;
            //   } else {
            //     // server-side error
            //     errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
            //   }
        } else {
            window.alert('Sorry !! /n NO INTERNET ');
        }
    }
}
