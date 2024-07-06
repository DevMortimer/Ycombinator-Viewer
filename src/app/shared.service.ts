import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

export class Post {
  by: string;
  descendants: number;
  id: number;
  kids: Array<Post>;
  image: string;
  score: number;
  time: number;
  title: string;
  type: string;
  url: string;

  constructor(
    by: string, descendants: number, id: number, kids: Array<Post>,
    score: number, time: number, title: string, type: string, url: string,
    image: string,
  ) {
    this.by = by;
    this.descendants = descendants;
    this.id = id;
    this.image = image;
    this.kids = kids;
    this.score = score;
    this.time = time;
    this.title = title;
    this.type = type;
    this.url = url;
  }
}

interface LinkPreview {
  title: string,
  description: string,
  image: string,
  url: string
}

@Injectable({
  providedIn: 'root'
})
export class SharedService {
  postsIds: Array<Number> = [];
  postList: Array<Post> = [];

  constructor(private http: HttpClient) { }

  processPostsIds(): Promise<void> {
    return new Promise((resolve) => {
      let count = 0;
      let limit = 10;

      for (let i = 0; i < limit; i++) {
        // fetch posts
        const url = "https://hacker-news.firebaseio.com/v0/item/" + this.postsIds[i] + ".json";
        fetch(url).then((resp) => {
          return resp.json();
        }).then((data: Post) => {
          if (data.type === "story") {
            this.getLinkPreviewImage(data.url ?? "https://news.ycombinator.com/").subscribe(imageUrl => {
              data.image = imageUrl;
              this.postList.push(data);
              count++;
              if (this.postList.length >= limit || count >= limit) {
                localStorage.setItem('postList', JSON.stringify(this.postList));
                resolve();
              }
            });
          }
        });
      }
    });
  }

  getLinkPreviewImage(url: string): Observable<string> {
    const apiKey = environment.linkPreviewApiKey;
    const headers = { 'X-Linkpreview-Api-Key': apiKey };
    return this.http.post<any>(`https://api.linkpreview.net/?q=${encodeURIComponent(url)}`,
      null, { headers }).pipe(map(res => res["image"]));
  }
}
