import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { TokenStorageService } from 'src/app/services/token-storage.service';
import {formatDate } from '@angular/common';
import { AnonymousSubject } from 'rxjs/internal/Subject';
import { interval, lastValueFrom } from 'rxjs';


@Component({
  selector: 'app-chat-room',
  templateUrl: './chat-room.component.html',
  styleUrls: ['./chat-room.component.css']
})
export class ChatRoomComponent implements OnInit {

  buttonPressed = false; 
  arrChatRoom: {firstName: any, lastName: any, userId: any, chatDate: any, chatText: any, chatId: any, chatReadOnly: boolean, chatUpdateIcon: boolean};

  arr: any=[]; 
  id : number; 
  userId: number; 
  chatId: number; 
  firstName: any;
  lastName: any; 
  updatePressed = false;

  currDate1 = new Date();
  currDate = ''; 

  signedInUser: string;
  signedInUserRole: string; 
  isSignedIn = false;

  testChatReadOnly: boolean = false; 
  updateChatRow: boolean = false;


  constructor(private http:HttpClient, private tokenStorage:TokenStorageService) { }

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


    this.http.get<any>('http://localhost:3000/getChat').subscribe(data => {
        for (let i = 0; i < data.length; i++)
        {
          this.arr.push({chatId: data[i].chat_id, userId: data[i].user_id, chatDate: data[i].chat_datetime, chatText: data[i].chat_text, firstName: data[i].first_name, lastName: data[i].last_name, 
          chatReadOnly: true, chatUpdateIcon: false}); 
          this.userId = this.tokenStorage.getUser().id;
        }  
    }); 
  }

  onSubmit(data) {

  }

  add() {
    this.buttonPressed = true; 
  }

  async storeChat(data) { 

    this.id = this.tokenStorage.getUser().id;

    let firstNameLastName = {id: this.id}; 
    
    let returnedEventErrorObject = await lastValueFrom(await this.http.get<any>('http://localhost:3000/chatFirstNameLastName', {params: firstNameLastName}));
     
    this.currDate = formatDate(this.currDate1, 'dd-MM-yyyy hh:mm:ss a', 'en-US');
    var chatObject = {currDate: this.currDate, chat: data.chat, userId: this.id, firstName: returnedEventErrorObject[0].firstname, lastName: returnedEventErrorObject[0].lastname}; 
    

    let chat = await lastValueFrom(await this.http.post('http://localhost:3000/chat', chatObject));

    location.reload(); 
  }

  async delete(data) {
    this.arr.splice(data); 

    var chatId = {id: data}; 
    let chat = await lastValueFrom(await this.http.post('http://localhost:3000/deleteChat', chatId));
    
    location.reload(); 
    
  }

  cancel() {
    location.reload(); 
  }

  async saveChat(chatArrIndex) {

    var updateChat = {chatId: this.arr[chatArrIndex].chatId, chatText: this.arr[chatArrIndex].chatText}; 

    let saveUpdatedChat = await lastValueFrom(await this.http.post('http://localhost:3000/updateChat', updateChat));
    
    location.reload(); 

  }

  update(chatArrIndex) {

    this.arr[chatArrIndex].chatReadOnly = false; 
    this.arr[chatArrIndex].chatUpdateIcon = true; 
    this.updateChatRow = true; 

  }

  cancelChat() {
    this.updateChatRow = false; 

  }

  async updateChat(data) {
    
    var updateChat = {chatId: this.chatId, chatText: data.chat}; 

    let chat = await lastValueFrom(await this.http.post('http://localhost:3000/updateChat', updateChat));

    location.reload();
  }

}
