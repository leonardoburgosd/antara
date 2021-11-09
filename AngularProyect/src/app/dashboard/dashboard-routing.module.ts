import { NgModule } from "@angular/core";
import { Routes, RouterModule } from '@angular/router';
import { AccountComponent } from "./account/account.component";
import { AlbumNewComponent } from "./album/album-new/album-new.component";
import { AlbumUpdateComponent } from "./album/album-update/album-update.component";
import { AlbumComponent } from "./album/album.component";
import { BibliotecaComponent } from "./biblioteca/biblioteca.component";
import { DashboardComponent } from "./dashboard.component";
import { ExploraComponent } from "./explora/explora.component";

const routes: Routes = [

    { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    {
        path: '', component: DashboardComponent, children: [
            { path: '', component: ExploraComponent },
            { path: 'album', component: AlbumComponent },
            { path: 'album/new', component: AlbumNewComponent },
            { path: 'album/edit/:albumId', component: AlbumUpdateComponent },
            { path: 'library', component: BibliotecaComponent },
            { path: 'account', component: AccountComponent },
            { path: '**', redirectTo: '' }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class DashboardRoutingModule { }
