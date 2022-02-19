import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import Character from './Character';


@Component({

  selector: 'app-head-coach-sign-in',
  templateUrl: './head-coach-sign-in.component.html',
  styleUrls: ['./head-coach-sign-in.component.css']
})
export class HeadCoachSignInComponent implements OnInit {

  reloaded = false;


  product:any; 
  constructor(private router: Router, private route: ActivatedRoute) { }


  ngOnInit(): void {

  }

  onManageMeets() {
    this.router.navigateByUrl('/manageMeets');
  }

  appRequest() {
    this.router.navigateByUrl('/appRequests');
  }

  manageFunActivities() {
    this.router.navigateByUrl('/manageFunActivities');
  }

  weeklyTraining() {
    this.router.navigateByUrl('/weeklyTraining');
  }
}
