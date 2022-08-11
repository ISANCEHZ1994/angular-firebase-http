import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { AppComponent } from './app.component';
import { AuthInterceptorService } from './auth-interceptor.service';
import { LoggingInterceoptorService } from './logging-interceptor.service';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, FormsModule, HttpClientModule],
  // we created the file auth-interceptor and now need to add a new element - javascript object
  // we need to add three keys:
  // provide: HTTP_INTERCEPTORS - this will be the token by which this injection can later be identified
  // now all the classes that i will provide on the token should be treated as HTTP Interceptors and should run
  // their intercept method whenever a request leaves the application
  // useClass: <SERVICE NAME WE CREATED>
  // multi: true - have multiple services under that identifier <HTTP_INTERCEPTORS>
  providers: [
    // if we change the orders of objects
    {
      provide:  HTTP_INTERCEPTORS,
      useClass: AuthInterceptorService,
      multi:    true
    },
    { // multiple interceptors - the same but with a different useClass..makes sense my guy (DUH)
      provide:  HTTP_INTERCEPTORS,
      useClass: LoggingInterceoptorService,
      multi:    true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
