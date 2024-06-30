import { Component } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, IonButton, IonIcon, IonCard, IonCardHeader, IonCardSubtitle, IonRow, IonCardTitle, IonCardContent, IonLabel } from '@ionic/angular/standalone';
import { Post, SharedService } from '../shared.service';

@Component({
  selector: 'app-favorites',
  templateUrl: './favorites.page.html',
  styleUrls: ['./favorites.page.scss'],
  standalone: true,
  imports: [IonLabel, IonCardContent, IonCardTitle, IonRow, IonCardSubtitle, IonCardHeader, IonCard, IonIcon, IonButton, IonButtons, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule]
})
export class FavoritesPage {
  posts: Array<Post> = [];

  constructor(private sharedService: SharedService, private location: Location) {
    const data = localStorage.getItem('bookmarks');
    if (data) {
      const bookmarkList: Array<number> = JSON.parse(data);
      for (let i = 0; i < bookmarkList.length; i++) {
        // find the corresponding post object 
        // from sharedservice.posts to add to local posts
        const p = this.sharedService.postList.find((p) => {
          return p.id === bookmarkList[i];
        });

        if (p) this.posts.push(p);
      }
    }
  }

  open(url: string) {
    window.open(url, "_blank");
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

  goBack() {
    this.location.back();
  }

}
