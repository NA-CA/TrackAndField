import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { interval, lastValueFrom } from 'rxjs';


@Component({
  selector: 'app-manage-events',
  templateUrl: './manage-events.component.html',
  styleUrls: ['./manage-events.component.css']
})
export class ManageEventsComponent implements OnInit {

    arrEvents: {eventGroup: any, eventName: any, eventId: number};
    arr: any=[]; 
    buttonPressed= false;

    eventGroup: string;
    eventName: string;
    userEventGroup: string;
    userEventName: string; 

    private map = new Map<string, string[]>([
      ['running', ['100m', '200m', '400m', '800m']],
      ['relays', ['4x100', '4x400']],
      ['jumps', ['long', 'triple', 'high']], 
      ['throws', ['shotput', 'discus']],
      ['hurdles', ['65H', '100H', '300H']]
    ])

  constructor(private http: HttpClient, private route:Router) { }

  ngOnInit(): void {
    
      this.http.get<any>('http://localhost:3000/eventsExist').subscribe(data => {
        for (let i = 0; i < data.length; i++)
        {
          this.arr.push({eventGroup: data[i].event_group, eventName: data[i].event_name, eventId: data[i].event_id}); 
        }
      }); 
}

  onSubmit(data) {
    
  }

  get eventGroups(): string[] {
    return Array.from(this.map.keys());

  }

  get eventNames(): string[] | undefined {
    return this.map.get(this.eventGroup);
  }

  async save(data)
  {
    let returnedAthlete = await lastValueFrom(await this.http.post('http://localhost:3000/addEvent', data));
    if (returnedAthlete != '')
    {
      alert('Event already exists'); 
    }

  }

  cancel() {


  }

  update(data) {

  }

  async delete(data) {

    this.arr.splice(data); 

    var eventId = {id: data}; 

    let deleteEvent = await lastValueFrom(await this.http.post('http://localhost:3000/deleteEvent', eventId));

    location.reload(); 
  }

  add() {
    this.buttonPressed = true; 
  }
  

  addEvent(data) {

  }

  async storeEventGroup() {
    console.trace();

    var data = [{

      a: this.eventGroup,
      b: this.eventName
    }]


    let returnedEventErrorObject = await lastValueFrom(await this.http.post('http://localhost:3000/events', data));

    if (returnedEventErrorObject != null)
    {
      alert('Event added in database'); 

    }
    else{
      alert('Duplicate entry'); 
    }

    location.reload(); 

  }

  cancelEventGroup() {
    console.trace(); 
  }

}
