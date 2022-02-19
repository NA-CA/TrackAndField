import { HttpClient } from '@angular/common/http';
import { analyzeAndValidateNgModules } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { stringify } from 'querystring';
import { UserService } from '../services/user-service';
import { User } from '../sign-up/user';
import { interval, lastValueFrom } from 'rxjs';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent implements OnInit {

  athleteShown: boolean = false;
  coachShown: boolean = false;
  headCoachShown: boolean = false;
  genders = 0;
  grades = 0; 

  missingField = '';
  athleteId = -1;
  genderChecked: number; 
  gradeChecked: number; 
  userExist: boolean = false;
  duplicateUser: any; 

  user: any = { name: "", email: "" };
  emailValidation: boolean = true;

  isValidFormSubmitted = false;
  newUserCreated = new User();

  pwdPattern = "^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?!.*\s).{6,12}$";

  constructor(private router: Router, private http:HttpClient, private userService: UserService) 
  { 
    this.genderChecked = 0; 
    this.gradeChecked = 0; 
  }

  ngOnInit(): void {
    
  }

  displayForm(selectedRole) {

    if (selectedRole === 1)
    {
      this.athleteShown = true; 
      this.coachShown = false; 
      this.headCoachShown = false;

    }
    else if (selectedRole === 2)
    {
      this.athleteShown = false;
      this.coachShown = true; 
      this.headCoachShown = false;
    }
    else if (selectedRole === 3)
    {
      this.athleteShown = false;
      this.coachShown = false; 
      this.headCoachShown = true;
    }
  } 

  async onSubmit(data) {

    let returnedHeadCoach =  await lastValueFrom(await this.http.post('http://localhost:3000/headCoach', data));
  }

  async athlete(data) { 

    this.isValidFormSubmitted = false;
    
     while (data.invalid) 
     {
        await this.validate(data.value); 
        return;
     }
     

     this.isValidFormSubmitted = true; 
     this.newUserCreated = data.value;
     this.userService.createUser(this.newUserCreated);
     this.newUserCreated = new User();

    let usernameExist = await this.usernameExist(data.value);

    if (usernameExist == true)
    {
      alert('Username exists in database')
      return; 
    }

    let grade = await this.checkGrade(data.value); 

    let gender = await this.gender(data.value); 

    var dataObject = {firstname: data.value.firstname, lastname: data.value.lastname, email: data.value.email, phone: data.value.phone, username: data.value.username, 
    password: data.value.password, gender: gender, grade: grade};

    await this.insertUser(dataObject);

    let athleteDivision = this.athleteDivision(dataObject); 

    let athleteId = await this.getAthleteId();  

    let currDate = new Date().toLocaleDateString(); 

    let reqStatus = 'P'; 

    let oneRequestRow = {athleteId: athleteId, currDate: currDate, reqStatus: reqStatus, athleteDivision: athleteDivision}; 

    this.addRequest(oneRequestRow); 
  }

  private async getAthleteId(): Promise<number> {

      let userArray = await lastValueFrom(this.http.get<any>('http://localhost:3000/getAthleteId'));
      this.athleteId = userArray[0].id;

      return this.athleteId; 

  }

  private async gender(data: any) {
    let gender = '';

    if (data.gender == 0)
    {
      gender = 'm'; 
    }
    else if (data.gender == 1)
    {
      gender = 'f'; 
    }

    return gender; 
  }

  private async checkGrade(data: any) {

    let grade = ''; 
    if (data.grade == 0)
    {
      grade = '9th'; 

    }
    else if (data.grade == 1)
    {
      grade = '10th'; 
    }
    else if (data.grade == 2)
    {
      grade = '11th'; 
    }
    else if (data.grade == 3)
    {
      grade = '12th'; 
    }

    return grade; 
   
  }

  private async insertUser(data: any) {



    if (this.athleteShown == true)
    {
      let returnedAthlete = await lastValueFrom(await this.http.post('http://localhost:3000/athlete', data));

      alert('Username added to database...'); 
      this.router.navigateByUrl('/homePage'); 
        
    }

    else if (this.coachShown == true)
    {
     let returnedCoach =  await lastValueFrom(await this.http.post('http://localhost:3000/coach', data));

      alert('Username added to database...'); 
      this.router.navigateByUrl('/homePage'); 
    }
    else if (this.headCoachShown == true)
    {
      let returnedHeadCoach = await lastValueFrom(await this.http.post('http://localhost:3000/headCoach', data));

      alert('Username added to database...'); 
      this.router.navigateByUrl('/homePage'); 
    }


  }

  private async usernameExist(data: any) {
     
      let userArray = await lastValueFrom(this.http.get<any>('http://localhost:3000/usernameExist', { params: data }));

      if (userArray.length == 1) {
          this.userExist = true;
          
          return this.userExist; 
      }
      else
      {
        this.userExist = false;
        return this.userExist; 
      }
  }

  private athleteDivision(data: any): string {
    let athleteDivision = ''; 

    if (data.grade == '9th' && data.gender == 'm' || (data.grade == '10th' && data.gender == 'm'))
    {
      athleteDivision = 'FSB';
    }
    if (data.grade == '9th' && data.gender == 'f' || (data.grade == '10th' && data.gender == 'f'))
    {
      athleteDivision = 'JVG';
    }
    if (data.grade == '11th' && data.gender == 'm' || (data.grade == '12th' && data.gender == 'm'))
    {
      athleteDivision = 'VB';
    }
    if (data.grade == '11th' && data.gender == 'f' || (data.grade == '12th' && data.gender == 'f'))
    {
      athleteDivision = 'VG';
    }

    return athleteDivision; 

  }

  private async addRequest(data: any) 
  {

      await lastValueFrom(await this.http.post('http://localhost:3000/addRequest', data));
  }


  async coach(data) {
 
    this.isValidFormSubmitted = false;
    
     while (data.invalid) 
     {
        await this.validate(data.value); 
        return;
     }
     

     this.isValidFormSubmitted = true;

     this.newUserCreated = data.value;
     this.userService.createUser(this.newUserCreated);
     this.newUserCreated = new User();
    
    let usernameExist = await this.usernameExist(data.value);
    if (usernameExist == true)
    {
      alert('Username exists in database')
      return; 
    } 

     await this.insertUser(data.value);
  }

  async headCoach(data) {

    this.isValidFormSubmitted = false;
    
     while (data.invalid) 
     {
        await this.validate(data.value); 
        return;
     }
     

     this.isValidFormSubmitted = true;
     this.newUserCreated = data.value;
     this.userService.createUser(this.newUserCreated);
     this.newUserCreated = new User();

    let usernameExist = await this.usernameExist(data.value);

    if (usernameExist == true)
    {
      alert('Username exists in database')
      return; 
    }

     await this.insertUser(data.value);
  }

  async validate(data) {

    if (data.firstname === '')
    {
      this.missingField = 'Missing first name\n';
    }

    if (data.lastname === '')
    {
      this.missingField = this.missingField + 'Missing last name\n';
      
    }

    if (data.email === '')
    {
      this.missingField = this.missingField + 'Missing email\n';
    }


    if (data.username === '')
    {
      this.missingField = this.missingField + 'Missing username\n';
    }

    if (data.password === '' || data.password == undefined)
    {
      this.missingField = this.missingField + 'Missing password\n';
    }

    if (this.athleteShown == true)
    {

        if (data.gender === '')
        {
          this.missingField = this.missingField + 'Missing gender\n';
        }

        if (data.grade === '')
        {
          this.missingField = this.missingField + 'Missing grade\n';
        }

    }

    if (this.missingField != '')
    {
      alert(this.missingField); 

    }

    this.missingField = ''; 

  }

}
