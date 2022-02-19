import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import {Location} from '@angular/common';
import { interval, lastValueFrom } from 'rxjs';


@Component({
  selector: 'app-add-event',
  templateUrl: './add-event.component.html',
  styleUrls: ['./add-event.component.css']
})
export class AddEventComponent implements OnInit {

  private map = new Map<string, string[]>([
    ['running', ['100m', '200m', '400m', '800m']],
    ['relays', ['4*100m', '4*400']],
    ['jumps', ['long', 'triple', 'high']],
    ['throws', ['shotput', 'discuss']],
    ['hurdles', ['65H', '100H', '300H']]
  ])

  eventGroup: string;
  eventName: string;
  userEventGroup: string;
  userEventName: string; 

  constructor(private http: HttpClient, private _location: Location) { }

  ngOnInit(): void {
  }

  onSubmit(data) {


  }

  get eventGroups(): string[] {
    return Array.from(this.map.keys());

  }

  get eventNames(): string[] | undefined {
    return this.map.get(this.eventGroup);
  }

  delete () {

  }

  async save(data)
  {

    let addEvent = await lastValueFrom(await this.http.post('http://localhost:3000/addEvent', data));

  }

  addEvent(data) {

  }

  async storeEventGroup() {

    var data = [{

      a: this.eventGroup,
      b: this.eventName
    }]

    let addEvent = await lastValueFrom(await this.http.post('http://localhost:3000/events', data));

    this._location.back(); 

  }
}
