import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { DatePipe } from '@angular/common'



import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { HomepageComponent } from './homepage/homepage.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { SignInComponent } from './sign-in/sign-in.component';
import { AthleteSignInComponent } from './sign-in/athlete-sign-in/athlete-sign-in.component';
import { HeadCoachSignInComponent } from './sign-in/head-coach-sign-in/head-coach-sign-in.component';
import { ManageMeetsComponent } from './sign-in/headCoach-sign-in/manage-meets/manage-meets.component';
import { AddEventComponent } from './sign-in/headCoach-sign-in/manage-meets/add-event/add-event.component';
import { ApproveAthleteComponent } from './sign-in/headCoach-sign-in/approve-athlete/approve-athlete.component';
import { MyInfoComponent } from './sign-in/headCoach-sign-in/my-info/my-info.component';
import { ManageEventsComponent } from './sign-in/headCoach-sign-in/manage-events/manage-events.component';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSliderModule } from '@angular/material/slider';

import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatNativeDateModule} from '@angular/material/core';
import { ChatRoomComponent } from './sign-in/headCoach-sign-in/chat-room/chat-room.component';
import { UserService } from './services/user-service';


@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    HomepageComponent,
    SignUpComponent,
    SignInComponent,
    AthleteSignInComponent,
    HeadCoachSignInComponent,
    ManageMeetsComponent,
    AddEventComponent,
    ApproveAthleteComponent,
    MyInfoComponent,
    ManageEventsComponent,
    ChatRoomComponent,
  ],
  imports: [
    FormsModule,
    BrowserModule,
    ReactiveFormsModule,
    HttpClientModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatSliderModule,
    MatDatepickerModule,
    MatNativeDateModule 
  ],
  providers: [UserService, DatePipe],
  bootstrap: [AppComponent]
})
export class AppModule { }
