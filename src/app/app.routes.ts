import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./home/home.page').then((m) => m.HomePage),
  },
  {
    path: 'posts',
    loadComponent: () => import('./posts/posts.page').then(m => m.PostsPage)
  },
  {
    path: 'favorites',
    loadComponent: () => import('./favorites/favorites.page').then(m => m.FavoritesPage)
  },
];
