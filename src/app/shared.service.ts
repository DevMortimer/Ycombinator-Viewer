import { Injectable } from '@angular/core';

export class Post {
  by: string;
  descendants: number;
  id: number;
  kids: Array<Post>;
  score: number;
  time: number;
  title: string;
  type: string;
  url: string;

  constructor(
    by: string, descendants: number, id: number, kids: Array<Post>,
    score: number, time: number, title: string, type: string, url: string
  ) {
    this.by = by;
    this.descendants = descendants;
    this.id = id;
    this.kids = kids;
    this.score = score;
    this.time = time;
    this.title = title;
    this.type = type;
    this.url = url;
  }
}

@Injectable({
  providedIn: 'root'
})
export class SharedService {
  postsIds: Array<Number> = [];
  postList: Array<Post> = [];

  constructor() { }

  processPostsIds(): Promise<void> {
    return new Promise((resolve, reject) => {
      let count = 0;

      for (let i = 0; i < this.postsIds.length; i++) {
        // fetch posts
        const url = "https://hacker-news.firebaseio.com/v0/item/" + this.postsIds[i] + ".json";
        fetch(url).then((resp) => {
          return resp.json();
        }).then((data: Post) => {
          if (data.type === "story") {
            this.postList.push(data);
          }
          count++;
          if (count === this.postsIds.length) {
            localStorage.setItem('postList', JSON.stringify(this.postList));
            resolve();
          }
        });
      }
    });
  }
}
