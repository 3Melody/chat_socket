import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { ChatService } from './chat.service';
import { Subscription } from 'rxjs';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MyDialogComponent } from '../../app/components/my-dialog/my-dialog.component';
import {MatButtonModule, MatIconAnchor} from '@angular/material/button';
import {MatSidenavModule} from '@angular/material/sidenav';
import { FriendDialogService } from '../../app/components/my-dialog/friendDialog.service';
import { jwtDecode } from 'jwt-decode';
import {MatIconModule} from '@angular/material/icon';
@Component({
   standalone: true,
  selector: 'app-chat',
  imports: [NgFor,CommonModule,MatFormFieldModule,
    MatInputModule,ReactiveFormsModule,MatSidenavModule,
    MatButtonModule,MatIconModule],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.scss',

})
export class ChatComponent implements OnInit , OnDestroy{

  private sub!: Subscription
  messages: any[] = [];
  message = '';
  showFiller = false;
  friendList : any;
  senderId : any;

  messageForm: FormGroup
  UserData: any;

  constructor(private chatService: ChatService ,
     private _FormBuilder: FormBuilder ,
     private dialog: MatDialog,
     private _friendService : FriendDialogService,
      private _changeDetectorRef: ChangeDetectorRef
     ) {

    this.messageForm = this._FormBuilder.group({ message: '' });
   }

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.tokenDecode();
    console.log("🚀 ~ ChatComponent ~ ngOnInit ~ 1:", 1)
      this.sub = this.chatService.messages.subscribe((msgs) => {
      this.messages = msgs;
    });

    this._friendService.getlistFriend().subscribe((res: any) => {
      this.friendList = res
      console.log("🚀 ~ ChatComponent ~ this.chatService.getlistFriend ~ this.friendList:", this.friendList)
    })

    // หรือถ้าต้องการโหลดข้อความเก่าครั้งแรกจาก API
    // this.chatService.positionWithDropdwn().subscribe();
  }

  tokenDecode(){
      const token = localStorage.getItem('token');
  if (token) {
    const decoded: any = jwtDecode(token);
    const username = decoded.sub;

    this.UserData = JSON.parse(username);
  }
}

    sendMessage() {


      const msg = this.messageForm.get('message')?.value;
      this.chatService.sendMessage(msg,this.senderId);

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

openChat(id : any) {

  this.senderId = id

  this.chatService.positionWithDropdwn(id).subscribe();

      this.sub = this.chatService.messages.subscribe((msgs) => {
      this.messages = msgs;
      this._changeDetectorRef.detectChanges();
    });

}

    ngOnDestroy(): void {
    // this.sub.unsubscribe();
  }

}
