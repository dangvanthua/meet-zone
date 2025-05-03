import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class WebSocketService {
  private ws!: WebSocket;
  private messages$ = new Subject<any>();

  connect(url: string): Observable<any> {
    this.ws = new WebSocket(url);
    this.ws.onmessage = event => this.messages$.next(JSON.parse(event.data));
    this.ws.onerror   = event => this.messages$.error(event);
    this.ws.onclose   = () => this.messages$.complete();
    return this.messages$.asObservable();
  }

  send(msg: any) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(msg));
    }
  }

  close() {
    this.ws?.close();
  }
}
