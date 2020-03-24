import { Injectable, ErrorHandler, Inject, Injector } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class GlobalErrorHandler implements ErrorHandler {
  private get toastrService(): ToastrService {
    return this.injector.get(ToastrService);
  }

  constructor(@Inject(Injector) private injector: Injector) {}

  handleError(error: any) {
    if (error instanceof ErrorEvent) {
      this.toastrService.error(error.error.message, null, { onActivateTick: true });
    } else if (error instanceof HttpErrorResponse) {
      this.toastrService.error(error.message, null, { onActivateTick: true });
    } else this.toastrService.error(error, null, { onActivateTick: true });
  }
}
