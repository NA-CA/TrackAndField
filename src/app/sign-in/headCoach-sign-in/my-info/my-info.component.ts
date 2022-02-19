import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ResolvedReflectiveFactory } from '@angular/core';
import { Router } from '@angular/router';
import { TokenStorageService } from 'src/app/services/token-storage.service';
import { interval, lastValueFrom } from 'rxjs';


@Component({
  selector: 'app-my-info',
  templateUrl: './my-info.component.html',
  styleUrls: ['./my-info.component.css']
})
export class MyInfoComponent implements OnInit {

  emailValidation: boolean = true;
  user: any = { name: "", email: "" };
  myInfoObject: {firstName: any, lastName: any, email: number, phone: any};
  arr: any=[]; 

  signedInUser: string; // current User
  signedInUserRole: string; // role can be A, C, H
  isSignedIn = false;

  firstName: string;
  lastName: string;
  email: string;
  phoneUpdated: string;

  constructor(private tokenStorage: TokenStorageService, private http:HttpClient, private router:Router) { }

  async ngOnInit() {
    if (this.tokenStorage.getToken() === null) {
      this.redirectToSignIn(); 
    }

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

    var userNameObject = {username: this.signedInUser}; 
    let returnedMyInfoObject = await lastValueFrom(await this.http.get<any>('http://localhost:3000/updateMyInfo', {params: userNameObject}));
    
    this.firstName = returnedMyInfoObject[0].firstname;
    this.lastName = returnedMyInfoObject[0].lastname;
    this.email = returnedMyInfoObject[0].email;
    this.phoneUpdated = returnedMyInfoObject[0].phone; 

  }

  async myInfo(data) {
    
    let missingField = await this.missingValues(data); 

    if (missingField != '')
    {
      alert(missingField);
      return; 
    }

    var signedInUserId = this.tokenStorage.getUser().id; 

    var updateInfo =  {email: data.email, firstname: data.firstname, lastname: data.lastname, phone: data.phone, userId: signedInUserId}; 

    let returnedEventErrorObject = await lastValueFrom(await this.http.post('http://localhost:3000/myInfo', updateInfo));
    if (returnedEventErrorObject != '')
    {
      alert('Info updated successfully'); 
      this.router.navigateByUrl('/manageMeets'); 
    }
    else{
      
    }
  }

  redirectToSignIn() {
    this.router.navigateByUrl('/signIn'); 

  }

  cancel() {
    this.firstName = '';
    this.lastName = '';
    this.email = '';
    this.router.navigateByUrl('/manageMeets'); 
  }

  async missingValues(data) {
    let missingField = '';

    if (data.firstname == '')
    {
      missingField = 'Missing First Name\n';

    }

    if (data.lastname == '')
    {
      missingField = missingField + 'Missing Last Name\n';
    }

    if (data.email == '')
    {
      missingField = missingField + 'Missing email\n';
    }

    return missingField; 
    
  }

}
