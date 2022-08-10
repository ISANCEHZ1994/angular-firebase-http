import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Observable } from "rxjs";

export class AuthInterceptorService implements HttpInterceptor{

    // intercept takes two arguments
    // HttpRequest is a generic type/generic object so we can use the angled brackets 
    intercept( req: HttpRequest<any>, next: HttpHandler ) {
        console.log('Request is on the way');
        console.log(req.url);
        // req.url = ''; <== this will not work - we need to create a new one!
        const modifedRequest = req.clone({ // with clone we can now change core aspects such as:
            // url: 'some-new-url'
            // headers: <if you want to keep some of them the same> req.headers.append
            // params: -- as you can see we can change a lot of things here!
            headers: req.headers.append('Auth', 'xyz')
            // now when we check in the browser web dev tools -- Network -> (second) post -> Headers
            // we can now see Auth: xyz inside the Request Headers
         }); 
         // instead of using the origianl request we want to use the MODIFIED VERSION - duh why make it and not use it?
        console.log(modifedRequest);
        return next.handle(modifedRequest); // next is a function/object that allows the request to continue its journey
    };

};
