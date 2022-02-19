import {Routes, RouterModule} from '@angular/router';
import { NgModule } from '@angular/core';
import { SignUpComponent } from './sign-up/sign-up.component';
import { HomepageComponent } from './homepage/homepage.component';
import { SignInComponent } from './sign-in/sign-in.component';
import { CoachSignInComponent } from './sign-in/coach-sign-in/coach-sign-in.component';
import { AthleteSignInComponent } from './sign-in/athlete-sign-in/athlete-sign-in.component';
import { HeadCoachSignInComponent } from './sign-in/head-coach-sign-in/head-coach-sign-in.component';
import { ManageEventsComponent } from './sign-in/headCoach-sign-in/manage-events/manage-events.component';
import { AddEventComponent } from './sign-in/headCoach-sign-in/manage-meets/add-event/add-event.component';
import { ApproveAthleteComponent } from './sign-in/headCoach-sign-in/approve-athlete/approve-athlete.component';
import { MyInfoComponent } from './sign-in/headCoach-sign-in/my-info/my-info.component';
import { ManageMeetsComponent } from './sign-in/headCoach-sign-in/manage-meets/manage-meets.component';
import { ChatRoomComponent } from './sign-in/headCoach-sign-in/chat-room/chat-room.component';


const routes: Routes = [
    {path: '', redirectTo: '/homePage', pathMatch:'full'},
    {path: 'homePage', component:HomepageComponent},
    {path: 'signUp', component:SignUpComponent},
    {path: 'signIn', component:SignInComponent},
    {path: 'coachSignIn', component: CoachSignInComponent},
    {path: 'athleteSignIn', component: AthleteSignInComponent},
    {path: 'headCoachSignIn', component: HeadCoachSignInComponent},
    {path: 'manageMeets', component: ManageMeetsComponent},
    {path: 'addEvent', component: AddEventComponent},
    {path: 'approveAthlete', component: ApproveAthleteComponent},
    {path: 'myInfo', component:MyInfoComponent},
    {path: 'manageEvents', component: ManageEventsComponent},
    {path: 'chatRoom', component: ChatRoomComponent}

];



@NgModule({
    declarations: [],
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
      
  })
  export class AppRoutingModule { }