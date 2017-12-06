import { MaterializeModule } from 'angular2-materialize';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { AppRoutingModule } from './app.routes';

import { AppComponent } from './app.component';
import { DemoMaterial2Component } from './demo-material2/demo-material2.component';
import { DemoWebRtcComponent } from './demo-web-rtc/demo-web-rtc.component';
import { DumpctpComponent } from './dumpctp/dumpctp.component';

@NgModule({
  declarations: [
    AppComponent,
    DemoMaterial2Component,
    DemoWebRtcComponent,
    DumpctpComponent
  ],
  imports: [
    BrowserModule,
    MaterializeModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
