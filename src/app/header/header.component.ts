import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TokenStorageService } from '../services/token-storage.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  signedInUser: string;
  signedInUserRole: string; 
  isSignedIn = false;

  constructor( private tokenStorage: TokenStorageService, private router:Router) { }

  ngOnInit(): void {
    
    if (this.tokenStorage.getUser()) {

      this.signedInUser = this.tokenStorage.getUser().username; 
      this.signedInUserRole = this.tokenStorage.getUser().role; 
      this.isSignedIn = true;
    }
    else 
    {
      this.isSignedIn = false;
      this.signedInUser = ''; 
      this.router.navigateByUrl('/homePage');
    }
  }

  isLoggedIn(): void{

  }

  logout(): void {
    
    this.tokenStorage.signOut();
    window.location.reload();
  }

  manageEvents() {
  
    this.router.navigateByUrl('/manageEvents'); 

  }

  approveAthlete() {
    this.router.navigateByUrl('/approveAthlete'); 
  }

  myInfo() {
    this.router.navigateByUrl('/myInfo'); 
  }


  manageMeets() {

    this.router.navigateByUrl('/manageMeets');

  }

  meetEventWishlist() {
  
  }

  chat() {
    this.router.navigateByUrl('/chatRoom');
  }

  viewMeets() {
    this.router.navigateByUrl('/manageMeets'); 

  }

}