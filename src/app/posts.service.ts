import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

import { Post } from "./post.model";

@Injectable({
    providedIn: 'root'
})
export class PostsService {

    constructor( private http: HttpClient ) {}

    // Original funciton with notes in app.component.ts file
    createAndStorePost( title: string, content: string ) {
        const postData: Post = { title: title, content: content };
        this.http
            .post<{ name: string }>( // again all http methods are genertic which means they can have optional brackets for a specific type
                'https://angular-firebase-ff3a9-default-rtdb.firebaseio.com/posts.json', // .json is a requirement when using Firebase..
                postData
            )     
        .subscribe( responseData => {  
            console.log(responseData);  
            // the httpClient will give you more than just the response
            // it will automatically extract the data attached to the response ( the repsonse body )
            // if you visit the url below - you can see the newly created posts with their title and content 
            // https://console.firebase.google.com/project/angular-firebase-ff3a9/database/angular-firebase-ff3a9-default-rtdb/data       
        }); 
    };

    fetchPosts(){
        // ...
    };

};