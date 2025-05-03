// room.component.ts (refactored)
import { Component, ElementRef, OnDestroy, OnInit, Renderer2, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  ionMicOutline, ionMicOffOutline,
  ionVideocamOutline, ionVideocamOffOutline,
  ionExpandOutline,
  ionChatbubbleOutline, ionPeopleOutline,
  ionCallOutline, ionShareOutline, ionSettingsOutline,
  ionEllipsisVerticalOutline, ionGridOutline
} from '@ng-icons/ionicons';
import { FormsModule } from '@angular/forms';
import { WebSocketService } from '../../../services/websocket.service';
import { MeetingService } from '../../../services/meeting.service';
import { AuthService } from '../../../services/auth.service';
import { UserInfo } from '../../../dto/user/user_info';

declare var kurentoUtils: any;

interface Participant {
  id: string;
  name: string;
  showMenu: boolean;
  isMuted: boolean;
  isVideoOn: boolean;
  isHost: boolean;
}

interface Message {
  senderId: string;
  senderName: string;
  text: string;
  timestamp: Date;
}

@Component({
  selector: 'app-room',
  standalone: true,
  imports: [ CommonModule, FormsModule, NgIcon ],
  providers: [ provideIcons({
      ionMicOutline, ionMicOffOutline,
      ionVideocamOutline, ionVideocamOffOutline,
      ionExpandOutline, ionGridOutline,
      ionChatbubbleOutline, ionPeopleOutline,
      ionCallOutline, ionShareOutline,
      ionSettingsOutline, ionEllipsisVerticalOutline
    }) ],
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.scss']
})
export class RoomComponent implements OnInit, OnDestroy {
  @ViewChild('localVideo', { static: true }) localVideo!: ElementRef<HTMLVideoElement>;
  @ViewChild('remoteContainer', { static: true }) remoteContainer!: ElementRef<HTMLDivElement>;

  meetingCode!: string;
  userId = localStorage.getItem('userId') || '';
  name!: string;
  isHost = false;

  // UI state
  participants: Participant[] = [];
  messages: Message[] = [];
  newMessage = '';
  isMuted = false;
  isVideoOn = true;
  isChatOpen = false;
  isPeopleOpen = false;
  isRecording = false;
  layout: 'grid' | 'spotlight' = 'grid';
  showLeave = false;
  isScreenSharing = false;
  isHandRaised = false;
  openMenu = false;

  private peerConnections: Map<string, any> = new Map();
  private localStream!: MediaStream;

  constructor(
    private ws: WebSocketService,
    private route: ActivatedRoute,
    private router: Router,
    private meetingService: MeetingService,
    private authService: AuthService,
    private renderer: Renderer2,
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.meetingCode = params.get('id')!;
      this.authService.loadUserProfile().subscribe({
        next: (res: UserInfo | null) => {;
          if (res) {
            this.name = res?.full_name || '';
          }
        }
      });

      

      this.isHost = history.state?.isHost || false;

      this.setupMedia()
        .then(() => this.connectWebSocket())
        .catch(() => this.router.navigate(['/dashboard']));
    });
  }

  private async setupMedia(): Promise<void> {
    try {
      this.localStream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true });
      const videoEl = this.localVideo.nativeElement;
      videoEl.srcObject = this.localStream;
      videoEl.muted = true;
      await videoEl.play();

      this.participants.push({
        id: this.userId,
        name: this.name,
        showMenu: false,
        isMuted: false,
        isVideoOn: true,
        isHost: this.isHost
      });
    } catch (err) {
      console.error('Media error:', err);
      alert('Vui lòng cho phép truy cập microphone và camera!');
      throw err;
    }
  }

  private connectWebSocket(): void {
    this.ws.connect(`wss://${location.host}/meeting`).subscribe({
      next: msg => this.handleMessage(msg),
      error: err => console.error('WebSocket error:', err),
      complete: () => this.cleanupPeers()
    });

    this.ws.send({ id: 'joinRoom', meetingCode: this.meetingCode, userId: this.userId, name: this.name, isHost: this.isHost });
  }

  private handleMessage(msg: any): void {
    switch (msg.id) {
      case 'existingParticipants':
        msg.data.forEach((name: string) => this.addRemoteParticipant(name, true));
        break;
      case 'newParticipantArrived':
        this.addRemoteParticipant(msg.name);
        break;
      case 'participantLeft':
        this.removeParticipant(msg.name);
        break;
      case 'iceCandidate':
        this.peerConnections.get(msg.name)?.addIceCandidate(msg.candidate);
        break;
      case 'sdpAnswer':
        this.peerConnections.get(msg.name)?.processAnswer(msg.sdpAnswer);
        break;
    }
  }

  private async addRemoteParticipant(name: string, sendrecv = false): Promise<void> {
    if (this.peerConnections.has(name)) return;
    this.participants.push({ id: name, name, showMenu: false, isMuted: false, isVideoOn: true, isHost: false });

    const video = this.renderer.createElement('video');
    this.renderer.setAttribute(video, 'id', `video-${name}`);
    this.renderer.setAttribute(video, 'autoplay', 'true');
    this.renderer.setAttribute(video, 'playsinline', 'true');
    this.renderer.addClass(video, 'object-cover');
    this.renderer.appendChild(this.remoteContainer.nativeElement, video);

    const options: any = {
      remoteVideo: video,
      onicecandidate: (candidate: any) => this.ws.send({ id: 'iceCandidate', name, candidate })
    };
    if (sendrecv) {
      options.localVideo = this.localVideo.nativeElement;
      options.stream = this.localStream;
    }

    const ctor = sendrecv ? kurentoUtils.WebRtcPeer.WebRtcPeerSendrecv : kurentoUtils.WebRtcPeer.WebRtcPeerRecvonly;
    const peer: any = new ctor(options, (err: any) => {
      if (err) { console.error(err); return; }
      peer.generateOffer((err2: any, sdp: string) => {
        if (err2) { console.error(err2); return; }
        this.ws.send({ id: 'receiveVideoFrom', sender: name, sdpOffer: sdp });
      });
    });

    this.peerConnections.set(name, peer);
  }

  toggleMute(): void {
    this.isMuted = !this.isMuted;
    this.localStream.getAudioTracks().forEach(t => t.enabled = !this.isMuted);
    this.updateParticipant(this.userId, { isMuted: this.isMuted });
  }

  toggleVideo(): void {
    this.isVideoOn = !this.isVideoOn;
    this.localStream.getVideoTracks().forEach(t => t.enabled = this.isVideoOn);
    this.updateParticipant(this.userId, { isVideoOn: this.isVideoOn });
  }

  toggleSidebar(side: 'chat'|'people'): void {
    this.isChatOpen = side === 'chat' ? !this.isChatOpen : false;
    this.isPeopleOpen = side === 'people' ? !this.isPeopleOpen : false;
  }

  toggleScreenShare(): void {}

  toggleRaiseHand(): void {}

  toggleFullScreen(): void {}

  sendMessage(): void {
    if (!this.newMessage.trim()) return;
    this.messages.push({ senderId: this.userId, senderName: this.name, text: this.newMessage, timestamp: new Date() });
    this.ws.send({ id: 'sendChatMessage', message: this.newMessage });
    this.newMessage = '';
  }

  leave(): void {
    this.ws.send({ id: 'leaveRoom' });
    this.router.navigate(['/home']);
  }

  private removeParticipant(name: string): void {
    this.participants = this.participants.filter(p => p.id !== name);
    this.peerConnections.get(name)?.dispose();
    this.peerConnections.delete(name);
    const vid = document.getElementById(`video-${name}`);
    if (vid) vid.remove();
  }

  private updateParticipant(id: string, changes: Partial<Participant>) {
    const p = this.participants.find(x => x.id === id);
    if (p) Object.assign(p, changes);
  }

  private cleanupPeers(): void {
    this.peerConnections.forEach(p => p.dispose());
    this.peerConnections.clear();
  }

  ngOnDestroy(): void {
    this.cleanupPeers();
    this.ws.close();
    this.localStream.getTracks().forEach(t => t.stop());
  }
}
