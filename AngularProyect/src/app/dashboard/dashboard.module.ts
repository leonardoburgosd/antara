import { NgModule } from "@angular/core";
import {CommonModule} from '@angular/common';
import { DashboardRoutingModule } from "./dashboard-routing.module";
import { MenuComponent } from "./menu/menu.component";
import { ExploraComponent } from './explora/explora.component';
import { PlaylistComponent } from './playlist/playlist.component';
import { DashboardComponent } from "./dashboard.component";

@NgModule({
    declarations:[DashboardComponent,MenuComponent,ExploraComponent, PlaylistComponent],
    imports:[
        CommonModule,
        DashboardRoutingModule
    ]
})
export class DashboardModule{}