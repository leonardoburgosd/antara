import { NgModule } from "@angular/core";
import { Routes, RouterModule } from '@angular/router';
import { BibliotecaComponent } from "./biblioteca/biblioteca.component";
import { DashboardComponent } from "./dashboard.component";
import { ExploraComponent } from "./explora/explora.component";
import { PlaylistComponent } from "./playlist/playlist.component";

const routes: Routes = [

    { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    {
        path: '', component: DashboardComponent, children: [
            { path: '', component: ExploraComponent },
            { path: 'playlist', component: PlaylistComponent },
            { path: 'library', component: BibliotecaComponent },
            { path: '**', redirectTo: '' }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class DashboardRoutingModule { }