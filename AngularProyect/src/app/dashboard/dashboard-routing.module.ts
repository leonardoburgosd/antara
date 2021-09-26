import { NgModule } from "@angular/core";
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from "./dashboard.component";
import { ExploraComponent } from "./explora/explora.component";
import { PlaylistComponent } from "./playlist/playlist.component";

const routes: Routes = [

    { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    {
        path: '', component: DashboardComponent, children: [
            { path: '', component: ExploraComponent },
            { path: 'playlist', component: PlaylistComponent },
            { path: '**', redirectTo: '' }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class DashboardRoutingModule { }