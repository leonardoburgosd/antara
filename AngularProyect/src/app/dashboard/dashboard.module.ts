import { NgModule } from "@angular/core";
import {CommonModule} from '@angular/common';
import { FormsModule } from '@angular/forms';

import { DashboardRoutingModule } from "./dashboard-routing.module";
import { MenuComponent } from "./menu/menu.component";
import { ExploraComponent } from './explora/explora.component';
import { DashboardComponent } from "./dashboard.component";
import { ReproductorComponent } from "../components/reproductor/reproductor.component";
import { BibliotecaComponent } from './biblioteca/biblioteca.component';
import { CardAlbumComponent } from "../components/card-album/card-album.component";
import { CardReproduccionComponent } from "../components/card-reproduccion/card-reproduccion.component";
import { CardLargeComponent } from "../components/card-large/card-large.component";
import { AccountComponent } from './account/account.component';
import { AlbumComponent } from './album/album.component';
import { AlbumNewComponent } from './album/album-new/album-new.component';

@NgModule({
    declarations:[
        DashboardComponent,
        MenuComponent,
        ExploraComponent,
        ReproductorComponent,
        BibliotecaComponent,
        CardAlbumComponent,
        CardReproduccionComponent,
        CardLargeComponent,
        AccountComponent,
        AlbumComponent,
        AlbumNewComponent
    ],
    imports:[
        CommonModule,
        DashboardRoutingModule,
        FormsModule
    ]
})
export class DashboardModule{}
