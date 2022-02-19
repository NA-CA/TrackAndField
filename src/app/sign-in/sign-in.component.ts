import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { TokenStorageService } from '../services/token-storage.service';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.css']
})
export class SignInComponent implements OnInit {

  signedInUser: string; // current User
  signedInUserRole: string; // role can be A, C, H
  isSignedIn = false;

  constructor(private http: HttpClient, private router:Router, private authService: AuthService, private tokenStorage: TokenStorageService) { }

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
    }
  }

  home()
  {
    this.router.navigateByUrl('/homePage'); 
  }

  signIn(data) {

    this.authService.login(data)
    .subscribe((data) => 
    {
      if (data == null)
      {
        alert('Login Failed'); 

      }
      else 
      { 

        this.tokenStorage.saveToken(data.accessToken);
        this.tokenStorage.saveUser(data);

        
        if (data.role === 'c')
          {
            this.router.navigateByUrl('/coachSignIn').then(() => {
            window.location.reload(); 
            
          })
        }
          else if (data.role === 'a') {
            this.router.navigateByUrl('/athleteSignIn').then(() => {
              window.location.reload();
                        
            })
            
          }
          else if (data.role === 'h') {
            this.router.navigateByUrl('/headCoachSignIn').then(() => {
            window.location.reload();

          }) 
        }
      }
      })
  }  
  

  reloadPage(): void {
    window.location.reload();
  }
}
