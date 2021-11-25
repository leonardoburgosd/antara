import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UsuarioComponent } from './main-content/usuario/usuario.component';
import { AlbumNewComponent } from './main-content/album/album-new/album-new.component';
import { AlbumUpdateComponent } from './main-content/album/album-update/album-update.component';
import { AlbumComponent } from './main-content/album/album.component';
import { DashboardComponent } from './dashboard.component';
import { MainContentComponent } from './main-content/main-content.component';
import { SearchComponent } from './main-content/search/search.component';
import { PlaylistComponent } from './main-content/playlist/playlist.component';
import { PlaylistNewComponent } from './main-content/playlist/playlist-new/playlist-new.component';
import { WorkingPageComponent } from 'src/app/shared/working-page/working-page.component';
import { ShowPlaylistComponent } from './main-content/playlist/show-playlist/show-playlist.component';
import { PlaylistUpdateComponent } from './main-content/playlist/playlist-update/playlist-update.component';
import { GeneroComponent } from './main-content/genero/genero.component';
import { DetalleComponent } from './main-content/genero/detalle/detalle.component';

const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  {
    path: '',
    component: DashboardComponent,
    children: [
      { path: '', component: MainContentComponent },
      { path: 'album', component: AlbumComponent },
      { path: 'play/:idPlay', component: ShowPlaylistComponent },
      { path: 'album/new', component: AlbumNewComponent },
      { path: 'album/edit/:albumId', component: AlbumUpdateComponent },
      { path: 'playlist', component: PlaylistComponent },
      { path: 'playlist/new', component: PlaylistNewComponent },
      { path: 'playlist/edit/:playlistId', component: PlaylistUpdateComponent },
      { path: 'generos', component: GeneroComponent },
      { path: 'generos/:generoId', component: DetalleComponent },
      { path: 'in_progress', component: WorkingPageComponent },
      { path: 'account', component: UsuarioComponent },
      { path: 'search/:stringSearch', component: SearchComponent },
      { path: '**', redirectTo: '' },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DashboardRoutingModule {}
