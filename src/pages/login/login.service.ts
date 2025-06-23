import { log } from 'console';
import { Inject, Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../../environment';
import SockJS from 'sockjs-client';


import { Client, IMessage, Stomp } from '@stomp/stompjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class ChatService implements OnDestroy {
  private serviceUrl = 'auth'; // ชื่อ service backend ให้ตรง
  isConnected = false;
  constructor(private http: HttpClient) {


  }




  //  signInWithGoogle(): Promise<void> {
  //   return this.socialAuthService.signIn(GoogleLoginProvider.PROVIDER_ID).then((user : any) => {
  //     // ส่ง idToken ไป Backend เพื่อ verify และรับ JWT
  //     this.http.post<{ token: string }>('http://localhost:8080/auth/google', {
  //       idToken: user.idToken
  //     }).subscribe(res => {
  //       localStorage.setItem('token', res.token);
  //     });
  //   });
  // }



  Login(param : any){
    return this.http.post(`${environment.apiUrl}/${this.serviceUrl}/login`, param);
  }
  // โหลดข้อความเก่าจาก REST API



  ngOnDestroy() {

  }


}
