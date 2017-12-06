// import { VideoChatComponent } from './video-chat/video-chat.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { DemoWebRtcComponent } from './demo-web-rtc/demo-web-rtc.component';

const routes: Routes = [
    { path: 'web-rtc', component: DemoWebRtcComponent },
    { path: '', redirectTo: '/web-rtc', pathMatch: 'full' }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})

export class AppRoutingModule { }
