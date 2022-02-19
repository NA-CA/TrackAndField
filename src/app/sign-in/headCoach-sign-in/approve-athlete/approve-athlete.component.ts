import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { interval, lastValueFrom } from 'rxjs';


@Component({
  selector: 'app-approve-athlete',
  templateUrl: './approve-athlete.component.html',
  styleUrls: ['./approve-athlete.component.css']
})
export class ApproveAthleteComponent implements OnInit {
  arr: any=[]; 
  arrEvents: {lastName: any, firstName: any, requestDate: any, id:number};

  constructor(private http:HttpClient, private router:Router ) {}

  ngOnInit(): void {
    this.http.get<any>('http://localhost:3000/getAthleteToApprove').subscribe(data => {

        for (let i = 0; i < data.length; i++)
        {
          this.arr.push({lastName: data[i].lastname, firstName: data[i].firstname, requestDate: data[i].req_date, id: data[i].id}); 
        }
        
    });
  }

  onSubmit(data) {
    
  }

  appAth(data) {

    let currDate = new Date().toLocaleDateString(); 
    var reqId = {id: data.id, currDate: currDate, req_status: 'A'}; 
    this.updateRequest(reqId); 

    location.reload(); 
  }


   private async updateRequest(reqId) {

    let chat = await lastValueFrom(await this.http.post('http://localhost:3000/updateRequests', reqId));
  }
}
