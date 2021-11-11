import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SongsListComponent } from './main-content/songs-list/songs-list.component';
import { UsuarioComponent } from './main-content/usuario/usuario.component';
import { AlbumNewComponent } from './main-content/album/album-new/album-new.component';
import { AlbumUpdateComponent } from './main-content/album/album-update/album-update.component';
import { AlbumComponent } from './main-content/album/album.component';
import { BibliotecaComponent } from './main-content/biblioteca/biblioteca.component';
import { DashboardComponent } from './dashboard.component';
import { MainContentComponent } from './main-content/main-content.component';

const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  {
    path: '',
    component: DashboardComponent,
    children: [
      { path: '', component: MainContentComponent },
      { path: 'album', component: AlbumComponent },
      { path: 'play/:id', component: SongsListComponent },
      { path: 'album/new', component: AlbumNewComponent },
      { path: 'album/edit/:albumId', component: AlbumUpdateComponent },
      { path: 'library', component: BibliotecaComponent },
      { path: 'account', component: UsuarioComponent },
      { path: '**', redirectTo: '' },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DashboardRoutingModule {}
