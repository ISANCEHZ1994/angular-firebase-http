import { Injectable } from "@angular/core";
import { HttpClient, HttpEventType, HttpHeaders, HttpParams } from "@angular/common/http";
import { Post } from "./post.model";
import { map, catchError, tap } from 'rxjs/operators';
// Subject is a special type of Observable that allows values to be multicasted to many Observers. 
// While plain Observables are unicast (each subscribed Observer owns 
// an independent execution of the Observable), Subjects are multicast.
import { Subject, throwError } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class PostsService {

    error = new Subject<string>();

    constructor( private http: HttpClient ) {}

    // Original funciton with more notes in app.component.ts file
    createAndStorePost( title: string, content: string ) {
        const postData: Post = { title: title, content: content };
        this.http
            .post<{ name: string }>( // again all http methods are genertic which means they can have optional brackets for a specific type
                'https://angular-firebase-ff3a9-default-rtdb.firebaseio.com/posts.json', // .json is a requirement when using Firebase..
                postData,
                // we can change the way the HttpClient paresses that response - give me the FULL response instead!
                {
                    //observe: 'body' // body means you get the response data extracted and converted to JavaScript - can change to 'repsonse'
                    observe: 'response'
                }
            )
            .subscribe( responseData => {  
                console.log( responseData );  
                // the httpClient will give you more than just the response
                // it will automatically extract the data attached to the response ( the repsonse body )
                // if you visit the url below - you can see the newly created posts with their title and content 
                // https://console.firebase.google.com/project/angular-firebase-ff3a9/database/angular-firebase-ff3a9-default-rtdb/data       

                // if we use observe: 'response' <== we would see the FULL response object BUT to access it would need <VARIABLE>.body
                // console.log( responseData.body )
            }, error => {
                this.error.next( error.message );
            }); 
    };

    fetchPosts(){  
        // if we wanted to set multiple params - add a <Search Params> constant
        let searchParams = new HttpParams();
        searchParams = searchParams.append('print', 'pretty');
        searchParams = searchParams.append('custom', 'key');
        // change so that we RETURN the list of posts (using get) so we don't use subscribe any more
        // HTTP request get sent because requests are only sent when someone is interested
        return this.http
        // GET is considered a generic method which means we can add the angle brackets and in between store the type of response the body will return
        // NOTE: the <> are totally optional - we are soley using to make full use of TypeScript security
        .get<{ [key: string]: Post }>(
            'https://angular-firebase-ff3a9-default-rtdb.firebaseio.com/posts.json',
            {
                // remember that headers are KEY : VALUE pairs
                // if we check the headers inside of the browswer web tools - we can see: Custom-Header: Hello 
                headers: new HttpHeaders({ 'Custom-Header' : 'Hello' }),                            
                params:  searchParams,
                // NOTE: before it was -- params: new HttpParams().set('print', 'pretty') 
                // we can set param name and value - changes the format in which Firebase returns its data
                // if we check Request URL in the web browser tools: '' <== it would be the same URL ABOVE 
                // WITH the added params at the end: 'firebaseio.com/posts.json?print=pretty'
                // of course we can also change the URL MANUALLY but this way is more convenient   
                // now we have multiple params added!
                responseType: 'json' 
                // we cant use the text responseType because we are using that generic assignment - note before we had responseType: 'text'
                // the data that is returned is type JavaScript object that holds a nested POST
                // the error is from TypeScript being smart - if you say that the response data will be of that format
                // then it needs to be convertible to JavaScript object
            }
        )
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
                }
                return postsArray;
            }),
            catchError( errorRes => {
                // Send to analytics server
                return throwError( errorRes );
            })
        );
        // switched to just RETURN information thus Subscribe is not needed HERE - look at app.component.ts: ngOnItnit()
        // NOTE: we CAN use it here but the RETURN at the begining needs to be removed
        // .subscribe( 
        //     posts => {
        //        console.log(posts);
        //        this.loadedPosts = posts;
        //     }
        // );
    };

    deletePosts(){
        return this.http.delete(
            'https://angular-firebase-ff3a9-default-rtdb.firebaseio.com/posts.json',
            {
                observe: 'events',
                responseType: 'text'
            })
            .pipe(
                tap( event => { // tap allows us to execute some code WITHOUT ALTERING the response
                                // basically do something to the response without disturbing 
                                // our Subscribe function and the functions we passed as arguments
                    console.log( event );
                    if( event.type === HttpEventType.Sent ){
                        // we can access ONLY the type that has been sent 
                    }
                    if( event.type === HttpEventType.Response ){ // NOTE: the previews when using HttpEventType.<PREVIEWS>
                        console.log( event.body );
                    }
                })
            );
    };

};