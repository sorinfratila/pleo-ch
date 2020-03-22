import { Injectable, ErrorHandler, Inject, Injector } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable()
export class GlobalErrorHandler extends ErrorHandler {
  /** need to get the toastrService through the injector to avoid cyclic dependency in the constructor injection */
  private get toastrService(): ToastrService {
    return this.injector.get(ToastrService);
  }

  constructor(@Inject(Injector) private injector: Injector) {
    super();
  }

  handleError(error: any) {
    console.log('GLOBAL ERROR', error);
    this.toastrService.error(error, null, { onActivateTick: true });

    // Make sure to rethrow the error so Angular can pick it up
    throw error;
  }
}
