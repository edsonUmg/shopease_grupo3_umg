import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http'; // <- Mantienes tu cambio
import { HeaderComponent } from './components/header/header.component'; // <- Mantienes el cambio de tu compañero

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent // <- Asegurar que este componente esté declarado
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule // <- Asegurar que este módulo esté importado
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
