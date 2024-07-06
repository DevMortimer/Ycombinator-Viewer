import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButton, IonLabel, IonList, IonCardTitle, IonCard, IonCardHeader, IonCardSubtitle, IonCardContent, IonRow, IonButtons, IonIcon, IonItem, IonCol } from '@ionic/angular/standalone';
import { Post, SharedService } from '../shared.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-posts',
  templateUrl: './posts.page.html',
  styleUrls: ['./posts.page.scss'],
  standalone: true,
  imports: [IonCol, IonItem, IonIcon, IonButtons, IonRow, IonCardContent, IonCardSubtitle, IonCardHeader, IonCard, IonCardTitle, IonList, IonLabel, IonButton, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule]
})
export class PostsPage {
  posts: Array<Post> = [];
  now = Date.now();

  constructor(private sharedService: SharedService, private router: Router) {
    if (this.sharedService.postList.length === 0 || this.sharedService.postsIds.length === 0) {
      // see first if there is a cached data
      const data = localStorage.getItem('postList');
      if (data) {
        this.sharedService.postList = JSON.parse(data);
        this.posts = this.sharedService.postList;
      } else {
        this.router.navigate(['/'], { replaceUrl: true });
      }
    } else {
      this.posts = this.sharedService.postList;
    }

    if (this.posts.length > 0) {
      this.posts.sort((a: Post, b: Post) => {
        return b.score - a.score;
      })
    }
  }

  refresh() {
    this.sharedService.postList = [];
    this.sharedService.postsIds = [];
    localStorage.removeItem('postList');
    localStorage.setItem('forceRefresh', 'true');
    this.router.navigate(['/'], { replaceUrl: true });
  }

  open(post: Post) {
    if (post.url) {
      window.open(post.url, "_blank");
    } else {
      this.openHackernewsPost(post);
    }
  }

  openHackernewsPost(post: Post) {
    window.open("https://news.ycombinator.com/item?id=" + post.id, "_blank");
  }

  bookmark(id: number) {
    const data = localStorage.getItem('bookmarks');
    let bookmarkList: Array<number> = [];
    if (data) {
      bookmarkList = JSON.parse(data);
      const yup = bookmarkList.find((val) => {
        return val == id;
      });

      if (yup) { // remove if it's bookmarked
        bookmarkList = bookmarkList.filter((val) => {
          return val !== yup;
        });
      } else { // add if it's not
        bookmarkList.push(id);
      }
    } else { // add to an empty one if there is no bookmarks
      bookmarkList.push(id);
    }

    // save data
    localStorage.setItem('bookmarks', JSON.stringify(bookmarkList));
  }

  isBookmarked(id: number) {
    const data = localStorage.getItem('bookmarks');
    if (data) {
      const bookmarkList: Array<number> = JSON.parse(data);
      const yup = bookmarkList.find((val) => {
        return val === id;
      });

      if (yup) return true;
      else return false;
    } else {
      return false;
    }
  }

  goToBookmarksPage() {
    console.log(this.sharedService.getLinkPreviewImage("https://google.com"));
    /* this.router.navigate(['/favorites']); */
  }

  identifyPost(index: number, post: Post) {
    return post.id;
  }

}
