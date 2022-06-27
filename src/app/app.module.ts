import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { NgxsModule } from '@ngxs/store';
import { NgxsLoggerPluginModule } from '@ngxs/logger-plugin';

import { AppComponent } from './app.component';
import { CoreModule } from './core/core.module';
import { SharedModule } from './shared/shared.module';
import { AppRoutingModule } from './app-routing.module';
import { DataState, SidebarState, TableFiltersState } from './core/states';


const STATES = [DataState, SidebarState, TableFiltersState];

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    CoreModule,
    NgxsModule.forRoot(STATES),
    NgxsLoggerPluginModule.forRoot(),
    SharedModule,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
