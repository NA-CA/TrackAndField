import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { TokenStorageService } from 'src/app/services/token-storage.service';
import {MatCalendarCellClassFunction} from '@angular/material/datepicker';
import { DatePipe } from '@angular/common';
import { interval, lastValueFrom } from 'rxjs';

@Component({
  selector: 'app-manage-meets',
  templateUrl: './manage-meets.component.html',
  styleUrls: ['./manage-meets.component.css']
})
export class ManageMeetsComponent implements OnInit {
  buttonPressed= false;
  arrMeets: {meetDate: any, meetLocation: any, meetTime: number, meetId: any};
  arr: any=[]; 
  dateOfMeet : string;
  updatePressed = false;
  meetId : number; 

  signedInUser: string; // current User
  signedInUserRole: string; // role can be A, C, H
  isSignedIn = false;

  addMeet = {date : '', location: '', time: ''}; 
  time = {};

  meetDate: string;
  meetLocation: string;
  meetTime: string; 

  myDate = new Date(); 

  constructor(private http:HttpClient, private tokenStorage:TokenStorageService, private datepipe:DatePipe) { }

  ngOnInit(): void {
    this.http.get<any>('http://localhost:3000/meetsExist').subscribe(data => {


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

        for (let i = 0; i < data.length; i++)
        {

          let date = data[i].meet_date; 
          let latest_date = this.datepipe.transform(date, 'MM/dd/yyyy');

          this.arr.push({meetId: data[i].meet_id, meetDate: latest_date, meetLocation: data[i].meet_location, meetTime: data[i].meet_time}); 
        }   
      }); 
  }

  onSubmit(data) {

  }


  cancel() {
    this.meetDate = '';
    this.meetLocation = '';
    this.meetTime = ''; 
    
    location.reload(); 
  }


  add() {
    this.buttonPressed= true; 

  }

  async storeMeets(data) {

    var storeMeets = {date:data.date, location: data.location, time: data.time}; 

    let meets = await lastValueFrom(await this.http.post('http://localhost:3000/meets', storeMeets));

    location.reload(); 

  }

  async delete(data) {

    this.arr.splice(data); 

    var meetId = {id: data}; 

    let meets = await lastValueFrom(await this.http.post('http://localhost:3000/deleteMeet', meetId));
    
    location.reload(); 
  }

  async update(arrIndex) { 
    this.updatePressed = true; 

    let date = this.arr[arrIndex].meetDate; 

    this.meetDate = this.datepipe.transform(date, 'yyyy-MM-dd');
    this.meetLocation = this.arr[arrIndex].meetLocation;
    this.meetTime = this.arr[arrIndex].meetTime; 
    this.meetId = this.arr[arrIndex].meetId; 


  }

  async updateMeets(data) {
    var meetInfo = {meetId: this.meetId, location: data.location, time: data.time, date: data.date}; 

    let returnedEventErrorObject = await lastValueFrom(await this.http.post('http://localhost:3000/updateMeet', meetInfo));

    location.reload();

  }

}
