import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../../environment';
import SockJS from 'sockjs-client';


import { Client, IMessage, Stomp } from '@stomp/stompjs';
import { HttpClient } from '@angular/common/http';
import { jwtDecode } from 'jwt-decode';


@Injectable({
  providedIn: 'root',
})
export class ChatService implements OnDestroy {
  private serviceUrl = 'chatMessage'; // ชื่อ service backend ให้ตรง
  isConnected = false;
  UserData : any;

  private _messages: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  public messages: Observable<any[]> = this._messages.asObservable();
 private stompClient!: Client;


  constructor(private http: HttpClient) {
    this.connectWebSocket();
    this.tokenDecode();
  }

  tokenDecode(){
    const token = localStorage.getItem('token');
if (token) {
  const decoded: any = jwtDecode(token);
  console.log('Decoded JWT:', decoded);

  // ตัวอย่างการใช้
  const username = decoded.sub;

  this.UserData = JSON.parse(username);
  console.log("🚀 ~ ChatService ~ tokenDecode ~ this.UserData:", this.UserData)
}


  }

  // โหลดข้อความเก่าจาก REST API
  positionWithDropdwn(): Observable<any> {
    const param = {
        "sender_id": 1,
  "receiver_id": 2
    };
    return this.http.get(`${environment.apiUrl}/${this.serviceUrl}/messages` , { params: param}  ).pipe(
      tap((response: any) => {
        this._messages.next(response);
      })
    );
  }

  // เริ่มเชื่อม WebSocket
    private connectWebSocket() {


    console.log('กำลังเปิด WebSocket connection...');

    this.stompClient = new Client({
      webSocketFactory: () => new SockJS(`${environment.apiUrl}/ws-chat`) as any,
      reconnectDelay: 5000,
      debug: (str) => console.log(str),
    });

    this.stompClient.onConnect = () => {
      console.log('WebSocket connected');

      this.stompClient.subscribe('/topic/messages', (message: IMessage) => {
        console.log("🚀 ~ ChatService ~ this.stompClient.subscribe ~ message.body:", message.body)
        if (message.body) {
          const newMsg = JSON.parse(message.body);
          this._messages.next([...this._messages.value, newMsg]);
        }
      });
    };

    this.stompClient.activate();
  }

  // ส่งข้อความผ่าน WebSocket
  sendMessage(msg: any) {

    if (this.stompClient && this.stompClient.connected) {
      console.log("🚀 ~ ChatService ~ sendMessage ~ msg:", msg)
      this.stompClient.publish({
        destination: '/app/sendMessage',
         headers: { priority: '9' },
       body: JSON.stringify({
    sender: 'Jess',
    sender_id: 1,
    receiver_id: 2,
    content: msg,
  }),
      });
        console.log("🚀 ~ ChatService ~ sendMessage ~ JSON.stringify(msg):", JSON.stringify(msg))
      console.log("🚀 ~ ChatService ~ sendMessage ~ this.stompClient:", this.stompClient)
    } else {
      console.error('WebSocket not connected');
    }
  }

  ngOnDestroy() {

  }


}
