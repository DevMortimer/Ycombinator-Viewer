import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButton, IonLabel, IonList, IonCardTitle, IonCard, IonCardHeader, IonCardSubtitle, IonCardContent, IonRow, IonButtons, IonIcon } from '@ionic/angular/standalone';
import { Post, SharedService } from '../shared.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-posts',
  templateUrl: './posts.page.html',
  styleUrls: ['./posts.page.scss'],
  standalone: true,
  imports: [IonIcon, IonButtons, IonRow, IonCardContent, IonCardSubtitle, IonCardHeader, IonCard, IonCardTitle, IonList, IonLabel, IonButton, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule]
})
export class PostsPage {
  posts: Array<Post> = [];

  constructor(private sharedService: SharedService, private router: Router) {
    if (this.sharedService.postList.length === 0 || this.sharedService.postsIds.length === 0) {
      // see first if there is a cached data
      const data = localStorage.getItem('postList');
      if (data) {
        this.sharedService.postList = JSON.parse(data);
        this.posts = this.sharedService.postList;
      } else {
        this.router.navigate(['/']);
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
    this.router.navigate(['/']);
  }

}
