import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Post } from "./post.model";

@Injectable({
    providedIn: 'root'
})
export class PostsService {

    constructor( private http: HttpClient ) {}

    createAndStorePost(title: string, content: string){
    const postData: Post = {};
    this.http
        .post<{ name: string }>( 
            'https://angular-firebase-ff3a9-default-rtdb.firebaseio.com/posts.json', 
            postData
        )     
      .subscribe( responseData => {  
        console.log(responseData);  
      }); 
    };

    fetchPosts(){
        // ...
    };

};