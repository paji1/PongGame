import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import { Observable, throwError } from "rxjs";

@Injectable()
export class InterceptImage implements NestInterceptor {
 
  intercept(context: ExecutionContext,
             next: CallHandler<any>)
  : Observable<any>
    | Promise<Observable<any>> {

 
      return next.handle()
  }
}
