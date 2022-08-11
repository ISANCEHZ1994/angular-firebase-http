import { HttpEvent, HttpEventType, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Observable } from "rxjs";
import { tap } from "rxjs/operators";

export class AuthInterceptorService implements HttpInterceptor{

    // intercept takes two arguments
    // HttpRequest is a generic type/generic object so we can use the angled brackets 
    intercept( req: HttpRequest<any>, next: HttpHandler ) {
        // console.log('Request is on the way');
        // console.log(req.url, 'this is the req.url');
        
        // req.url = ''; <== this will not work - we need to create a new one!
        const modifedRequest = req.clone({ // with clone we can now change core aspects such as:
            // url: 'some-new-url'
            // headers: <if you want to keep some of them the same> req.headers.append
            // params: -- as you can see we can change a lot of things here!
            headers: req.headers.append('Auth', 'xyz')
            // now when we check in the browser web dev tools -- Network -> (second) post -> Headers
            // we can now see Auth: xyz inside the Request Headers
         }); 
        
        console.log(modifedRequest, 'this is the modifedRequest');         
         // we're not limited to interacting with the REQUEST in an interceptor
         // we can also interact with the RESPONSE
         // instead of using the origianl request we want to use the MODIFIED VERSION - duh why make it and not use it?
        return next.handle(modifedRequest)  // next is a function/object that allows the request to continue its journey
                // .pipe( 
                //     tap( event => {
                //         console.log(event, 'this is the event');
                //         if( event.type === HttpEventType.Response ){
                //             console.log('Response arrived, body data: ');
                //             console.log(event.body);
                //         }
                //     })
                // );        
    };

};
