import { Component, OnDestroy, OnInit } from '@angular/core';
import { ChatService } from './chat.service';
import { Subscription } from 'rxjs';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MyDialogComponent } from '../../app/components/my-dialog/my-dialog.component';
import {MatButtonModule} from '@angular/material/button';
import {MatSidenavModule} from '@angular/material/sidenav';
@Component({
   standalone: true,
  selector: 'app-chat',
  imports: [NgFor,CommonModule,MatFormFieldModule,MatInputModule,ReactiveFormsModule,MatSidenavModule,MatButtonModule],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.scss',

})
export class ChatComponent implements OnInit , OnDestroy{

  private sub!: Subscription
  messages: any[] = [];
  message = '';
  showFiller = false;

  messageForm: FormGroup

  constructor(private chatService: ChatService , private _FormBuilder: FormBuilder , private dialog: MatDialog) {

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

    searchFriend() {

    }

    openDialog(type : any): void {
       console.log('Dialog open');
  const dialogRef = this.dialog.open(MyDialogComponent, {
    width: '400px',
    data: { type: type },

  });

  dialogRef.afterClosed().subscribe(result => {
    console.log('Dialog closed', result);
  });
}

    ngOnDestroy(): void {
    // this.sub.unsubscribe();
  }

}
