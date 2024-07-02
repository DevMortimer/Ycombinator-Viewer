import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonLoading } from '@ionic/angular/standalone';
import { SharedService } from '../shared.service';

// The home page just serves as a way to fetch all the posts.
// It's just a loading screen to be honest!
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [IonLoading, IonHeader, IonToolbar, IonTitle, IonContent],
})
export class HomePage implements OnInit {
  isOpen = false; // used for the loading visual

  constructor(private route: ActivatedRoute, private router: Router, private sharedService: SharedService) { }

  async ngOnInit() {
    const data = localStorage.getItem('postList');
    const force = localStorage.getItem('forceRefresh')

    if (data && !force) {
      this.router.navigate(['/posts'], { replaceUrl: true });
    } else {
      this.isOpen = true;
      try {
        await fetch("https://hacker-news.firebaseio.com/v0/topstories.json?print=pretty").then((resp) => {
          return resp.json();
        }).then((postNums) => {
          this.sharedService.postsIds = Object.values(postNums);
          return this.sharedService.processPostsIds();
        }).finally(() => {
          this.isOpen = false;
          setTimeout(() => {
            this.router.navigate(['/posts'], { replaceUrl: true });
          }, 500);
        })
      } catch (error) {
        this.isOpen = false;
        console.error("Error processing post IDs: ", error);
      }
    }
  }

}

