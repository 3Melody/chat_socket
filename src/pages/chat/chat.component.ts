import { Component, OnDestroy, OnInit } from '@angular/core';
import { ChatService } from './chat.service';
import { Subscription } from 'rxjs';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
@Component({
   standalone: true,
  selector: 'app-chat',
  imports: [NgFor,CommonModule,MatFormFieldModule,MatInputModule,ReactiveFormsModule],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.scss',

})
export class ChatComponent implements OnInit , OnDestroy{

  private sub!: Subscription
  messages: any[] = [];
  message = '';

  messageForm: FormGroup

  constructor(private chatService: ChatService , private _FormBuilder: FormBuilder) {

    this.messageForm = this._FormBuilder.group({ message: '' });
   }

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.

    console.log("🚀 ~ ChatComponent ~ ngOnInit ~ 1:", 1)
      this.sub = this.chatService.messages.subscribe((msgs) => {
      this.messages = msgs;
    });

    // หรือถ้าต้องการโหลดข้อความเก่าครั้งแรกจาก API
    this.chatService.positionWithDropdwn().subscribe();
  }

    sendMessage() {

      const msg = this.messageForm.get('message')?.value;
      this.chatService.sendMessage(msg);

    }

    ngOnDestroy(): void {
    // this.sub.unsubscribe();
  }

}
