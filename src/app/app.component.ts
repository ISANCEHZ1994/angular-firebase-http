import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Post } from './post.model';

import { map } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  loadedPosts: Post[] = [];

  constructor( private http: HttpClient ) {}

  ngOnInit() {
    // whenever this page/app loads, I want to fetch all posts
    this.fetchPosts();
  }

  // { title: string; content: string } - moved to post.model.ts file!
  onCreatePost( postData: Post ) {
    // Send Http request
    console.log(postData);
    this.http
      .post<{ name: string }>( // again all http methods are genertic which means they can have optional brackets for a specific type
        // 'https://ng-complete-guide-c56d3.firebaseio.com/posts.json',
        'https://angular-firebase-ff3a9-default-rtdb.firebaseio.com/posts.json', // .json is a requirement when using Firebase..
        postData
      )
      // angular is HEAVILY reliant on Observables - same with HTTP 
      // we subscribe to get informed about the response and to handle errors and so on
      // if we DON'T subscribe - Angular and RxJS will know that no one's interested in the response therefore
      //  the request doesn't even get sent because if no one's intrested in the response then it won't send the request!
      .subscribe( responseData => { 
        // the httpClient will give you more than just the response
        // it will automatically extract the data attached to the response (the repsonse body)
        console.log(responseData);
        // if you visit the url below - you can see the newly created posts with their title and content 
        // https://console.firebase.google.com/project/angular-firebase-ff3a9/database/angular-firebase-ff3a9-default-rtdb/data        
      }); 
      // in the web browser - developer tools - network
      // we can see two requests to the POST end point
      // note: its not '/post' but TYPE of post - the .post() above

      // FIRST request is of type options - Request Method: OPTIONS - that will check whether the post request is allowed to be sent
      // and if it gets a success response, it will send the actual request which will be the SECOND request - Request Method: POST    
  };

  onFetchPosts() {    
    this.fetchPosts();
  };

  onClearPosts() {
    // Send Http request
  };

  // since we call this function in the ngOnInit() - if we go to the web broswer console 
  // we get see all the posts that have been made
  private fetchPosts(){
    this.http
    // GET is considered a generic method which means we can add the angle brackets and in between store the type of response the body will return
    // NOTE: the <> are totally optional - we are soley using to make full use of TypeScript security
    .get<{[key: string]: Post}>('https://angular-firebase-ff3a9-default-rtdb.firebaseio.com/posts.json')
    // since this is a GET request - there is no need for a second argument
    // get request have no request body since we are not sending any data..(duh - refresher) ONLY REQUESTING data
    .pipe( // pipe allows you to funnel your observalble data through multiple operators before they reach the subscribe method   
      map(( // map is a function that takes another function 
        responseData: { [key: string]: Post } // we are using TypeScript to specificlly say what the return data should be so we can actually 
      ) => { 
        const postsArray: Post[] = []; // is an empty array with the specific type: Post

        for( const key in responseData ){ // for-in loop to go thru all they keys in response data which we know will be an object
          if( responseData.hasOwnProperty(key) ){
            postsArray.push({ ...responseData[key], id: key }) // we want to push in a new object there so we add curly bois {}
          } 
        };
        return postsArray;
      })
    )
    .subscribe( // we stil need to subscribe!!
      posts => {
        console.log(posts);
        this.loadedPosts = posts;
      }
    );
    
  };

};
