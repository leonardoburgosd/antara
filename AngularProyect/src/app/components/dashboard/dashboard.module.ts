import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgxSpinnerModule } from 'ngx-spinner';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { MainContentComponent } from './main-content/main-content.component';
import { DashboardComponent } from './dashboard.component';
import { BibliotecaComponent } from './main-content/biblioteca/biblioteca.component';
import { CardAlbumComponent } from './main-content/album/card-album/card-album.component';
import { UsuarioComponent } from './main-content/usuario/usuario.component';
import { AlbumComponent } from './main-content/album/album.component';
import { AlbumNewComponent } from './main-content/album/album-new/album-new.component';
import { AlbumUpdateComponent } from './main-content/album/album-update/album-update.component';
import { HomeSectionComponent } from './main-content/home/home-section/home-section.component';
import { NavbarComponent } from './layout/navbar/navbar.component';
import { HomeComponent } from './main-content/home/home.component';
import { SectionAlbumCardComponent } from './main-content/home/home-section/section-album-card/section-album-card.component';
import { HomeBannerComponent } from './main-content/home/home-banner/home-banner.component';
import { BannerAlbumCardComponent } from './main-content/home/home-banner/banner-album-card/banner-album-card.component';
import { SongsListComponent } from './main-content/songs-list/songs-list.component';
import { ReproductorComponent } from './layout/reproductor/reproductor.component';
import { UserBarComponent } from './layout/user-bar/user-bar.component';
import { SearchComponent } from './main-content/search/search.component';

@NgModule({
  declarations: [
    DashboardComponent,
    NavbarComponent,
    MainContentComponent,
    ReproductorComponent,
    BibliotecaComponent,
    CardAlbumComponent,
    BannerAlbumCardComponent,
    SectionAlbumCardComponent,
    UsuarioComponent,
    AlbumComponent,
    AlbumNewComponent,
    AlbumUpdateComponent,
    HomeSectionComponent,
    HomeComponent,
    HomeBannerComponent,
    SongsListComponent,
    UserBarComponent,
    SearchComponent,
  ],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    FormsModule,
    NgxSpinnerModule,
  ],
})
export class DashboardModule {}
