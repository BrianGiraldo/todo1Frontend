import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { MatToolbarModule, MatCardModule, MatFormFieldModule, MatInputModule, MatIconModule, MatGridListModule, MatTableModule, MatProgressBarModule, MatButtonModule, MatSnackBarModule, MatTabsModule, MatBadgeModule, MatChipsModule, MatExpansionModule, MatDatepickerModule, MatNativeDateModule } from '@angular/material';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MatToolbarModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatGridListModule,
    MatTableModule,
    BrowserAnimationsModule,
    MatProgressBarModule,
    MatButtonModule,
    MatSnackBarModule,
    MatTabsModule,
    MatBadgeModule,
    MatChipsModule,
    MatExpansionModule,
    MatDatepickerModule,
    MatNativeDateModule,
    FormsModule,
    HttpClientModule
  ],
  providers: [
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
