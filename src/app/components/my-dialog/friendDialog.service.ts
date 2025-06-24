import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

import SockJS from 'sockjs-client';


import { Client, IMessage, Stomp } from '@stomp/stompjs';
import { HttpClient } from '@angular/common/http';
import { jwtDecode } from 'jwt-decode';
import { environment } from '../../../environment';


@Injectable({
  providedIn: 'root',
})
export class FriendDialogService implements OnDestroy {
  private serviceUrl = 'friend'; // ชื่อ service backend ให้ตรง
  isConnected = false;
  UserData : any;

  private _messages: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  public messages: Observable<any[]> = this._messages.asObservable();
 private stompClient!: Client;
 private _listFriend: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);

 get listFriend(): Observable<any[]> {
  return this._listFriend.asObservable();
}




  constructor(private http: HttpClient) {
    this.tokenDecode();
  }



  searchFriend(username : any): Observable<any> {

    return this.http.get(`${environment.apiUrl}/${this.serviceUrl}/search/${username}` ,  ).pipe(
      tap((response: any) => {
        this._messages.next(response);
      })
    );
  }

  addFriend(id : any): Observable<any> {
    const body = {
      "sender_id" : this.UserData.id,
      "receiver_id" : id
    }

    return this.http.post(`${environment.apiUrl}/${this.serviceUrl}/send` , body  ).pipe(
      tap((response: any) => {
      })
    );
  }


    tokenDecode(){
    const token = localStorage.getItem('token');
if (token) {
  const decoded: any = jwtDecode(token);
  const username = decoded.sub;

  this.UserData = JSON.parse(username);
}
}

searchListFriend(): Observable<any> {
  return this.http.get(`${environment.apiUrl}/${this.serviceUrl}/list/${this.UserData.id}` ,  ).pipe(
    tap((response: any) => {
      this._listFriend.next(response.data);
    })
  );
}

accept(id : any): Observable<any> {
     const body = {
      "sender_id" : this.UserData.id,
      "receiver_id" : id
    }
  return this.http.post(`${environment.apiUrl}/${this.serviceUrl}/accept` ,body).pipe(
    tap((response: any) => {
    })
  );
}

pedding(): Observable<any> {
return this.http.get(`${environment.apiUrl}/${this.serviceUrl}/pending/${this.UserData.id}`).pipe(
  tap((response: any) => {
  })
);
}

  ngOnDestroy() {

  }


}
