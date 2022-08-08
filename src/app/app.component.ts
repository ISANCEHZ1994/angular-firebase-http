import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

import { PostsService } from './posts.service';
import { Post } from './post.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  loadedPosts: Post[] = [];
  isFetching = false;

  constructor( private http: HttpClient, private postsService: PostsService ) {}

  ngOnInit() {
    // whenever this page/app loads, I want to fetch all posts
    // this.fetchPosts();
    this.isFetching = true;
    this.postsService.fetchPosts().subscribe(
      posts => {
        this.isFetching = false;
        this.loadedPosts = posts;
      }
    );
  }

  // { title: string; content: string } - moved to post.model.ts file!
  // NOTE: we have moved the function below to posts.service.ts 
  onCreatePost( postData: Post ) {
    this.postsService.createAndStorePost( postData.title, postData.content );
{/*
    console.log(postData);
    this.http
      .post<{ name: string }>( 
        'https://angular-firebase-ff3a9-default-rtdb.firebaseio.com/posts.json',
        postData
      )
*/}
      // angular is HEAVILY reliant on Observables - same with HTTP 
      // we subscribe to get informed about the response and to handle errors and so on
      // if we DON'T subscribe - Angular and RxJS will know that no one's interested in the response therefore
      //  the request doesn't even get sent because if no one's intrested in the response then it won't send the request!      
{/*
      .subscribe( responseData => { 
        console.log(responseData); 
      }); 
*/}
      // in the web browser - developer tools - network
      // we can see two requests to the POST end point
      // note: its not '/post' but TYPE of post - the .post() above

      // FIRST request is of type options - Request Method: OPTIONS - that will check whether the post request is allowed to be sent
      // and if it gets a success response, it will send the actual request which will be the SECOND request - Request Method: POST    
  };

  onFetchPosts() {    
    this.isFetching = true;
    this.postsService.fetchPosts().subscribe(
      posts => {
        this.isFetching = false;
        this.loadedPosts = posts;
      }
    );
    // function is below!
    // this.fetchPosts();
  };

  onClearPosts() {
    // Send Http request
    this.postsService.deletePosts().subscribe(() => {
      this.loadedPosts = [];
      
    });
  };

  // ALSO MOVED to posts.service.ts
  // thus no longer NEEDED
  private fetchPosts(){       
    // this.http
    // .get<{[key: string]: Post}>('https://angular-firebase-ff3a9-default-rtdb.firebaseio.com/posts.json')
    // .pipe( 
    //   map(( 
    //     responseData: { [key: string]: Post }
    //   ) => { 
    //     const postsArray: Post[] = []; 

    //     for( const key in responseData ){ 
    //       if( responseData.hasOwnProperty(key) ){
    //         postsArray.push({ ...responseData[key], id: key }) 
    //       } 
    //     };
    //     return postsArray;
    //   })
    // ).subscribe( 
    //   posts => {
    //     console.log(posts);
    //     this.isFetching = false;
    //     this.loadedPosts = posts;
    //   }
    // );    
  };

};
