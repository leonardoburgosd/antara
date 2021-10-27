import { NgModule } from "@angular/core";
import {CommonModule} from '@angular/common';
import { DashboardRoutingModule } from "./dashboard-routing.module";
import { MenuComponent } from "./menu/menu.component";
import { ExploraComponent } from './explora/explora.component';
import { PlaylistComponent } from './playlist/playlist.component';
import { DashboardComponent } from "./dashboard.component";
import { ReproductorComponent } from "../components/reproductor/reproductor.component";
import { BibliotecaComponent } from './biblioteca/biblioteca.component';
import { CardAlbumComponent } from "../components/card-album/card-album.component";
import { CardReproduccionComponent } from "../components/card-reproduccion/card-reproduccion.component";
import { CardLargeComponent } from "../components/card-large/card-large.component";
import { AccountComponent } from './account/account.component';
import { PlaylistNewComponent } from './playlist/playlist-new/playlist-new.component';

@NgModule({
    declarations:[
        DashboardComponent,
        MenuComponent,
        ExploraComponent, 
        PlaylistComponent,
        ReproductorComponent, 
        BibliotecaComponent,
        CardAlbumComponent,
        CardReproduccionComponent,
        CardLargeComponent,
        AccountComponent,
        PlaylistNewComponent
    ],
    imports:[
        CommonModule,
        DashboardRoutingModule
    ]
})
export class DashboardModule{}