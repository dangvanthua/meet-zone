import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { ionCallOutline, ionChatbubbleOutline, ionCloseOutline, ionEllipsisVerticalOutline, ionExpandOutline, ionGridOutline, ionHandLeftOutline, ionMicOffOutline, ionMicOutline, ionPeopleOutline, ionPhoneLandscapeOutline, ionRecordingOutline, ionSettingsOutline, ionShareOutline, ionVideocamOffOutline, ionVideocamOutline } from '@ng-icons/ionicons';

interface Participant {
  id: string;
  name: string;
  isMuted: boolean;
  isVideoOn: boolean;
  isScreenSharing: boolean;
  isHost: boolean;
  showMenu: boolean;
}

interface Message {
  id: string;
  senderId: string;
  senderName: string;
  text: string;
  timestamp: Date;
}

@Component({
  selector: 'app-room',
  imports: [
    CommonModule,
    FormsModule, 
    RouterModule, 
    NgIcon],
  providers: [
    provideIcons({
      ionMicOutline,
      ionMicOffOutline,
      ionVideocamOutline,
      ionVideocamOffOutline,
      ionExpandOutline,
      ionGridOutline,
      ionRecordingOutline,
      ionShareOutline,
      ionSettingsOutline,
      ionChatbubbleOutline,
      ionPeopleOutline,
      ionPhoneLandscapeOutline,
      ionCallOutline,
      ionCloseOutline,
      ionHandLeftOutline,
      ionEllipsisVerticalOutline
    })
  ],
  templateUrl: './room.component.html',
  styleUrl: './room.component.scss'
})
export class RoomComponent {
  meetingId!: string;
  participants = [
    { id: 'user-1', name: 'Bạn',     isMuted: false, isVideoOn: true,  isScreenSharing: false, isHost: true,  showMenu: false },
    { id: 'user-2', name: 'Nguyễn Văn A', isMuted: true,  isVideoOn: true,  isScreenSharing: false, isHost: false, showMenu: false },
    { id: 'user-3', name: 'Trần Thị B',  isMuted: false, isVideoOn: false, isScreenSharing: false, isHost: false, showMenu: false },
    { id: 'user-4', name: 'Lê Văn C',   isMuted: false, isVideoOn: true,  isScreenSharing: false, isHost: false, showMenu: false },
  ];
  messages: Message[] = [
    { id: 'msg-1', senderId: 'user-2', senderName: 'Nguyễn Văn A', text: 'Xin chào!', timestamp: new Date(Date.now()-300000) },
    { id: 'msg-2', senderId: 'user-1', senderName: 'Bạn', text: 'Chào A!', timestamp: new Date(Date.now()-240000) },
    { id: 'msg-3', senderId: 'user-3', senderName: 'Trần Thị B', text: 'Âm thanh ổn không?', timestamp: new Date(Date.now()-180000) }
  ];
  newMessage = '';
  isMuted = false;
  isVideoOn = true;
  isScreenSharing = false;
  isChatOpen = false;
  isPeopleOpen = false;
  isRecording = false;
  layout: 'grid'|'spotlight' = 'grid';
  openMenu = false;
  showLeave = false;
  isHandRaised = false;

  constructor(
    private route: ActivatedRoute,
     private router: Router) {}

  ngOnInit() {
    this.meetingId = this.route.snapshot.paramMap.get('id') || '';
  }

  sendMessage() {
    if(!this.newMessage.trim()) return;
    this.messages.push({
      id: `msg-${Date.now()}`,
      senderId: 'user-1',
      senderName: 'Bạn',
      text: this.newMessage,
      timestamp: new Date()
    });
    this.newMessage = '';
  }

  toggleSidebar(side: 'chat'|'people') {
    if(side==='chat'){
      this.isChatOpen = !this.isChatOpen;
      if(this.isChatOpen) this.isPeopleOpen = false;
    } else {
      this.isPeopleOpen = !this.isPeopleOpen;
      if(this.isPeopleOpen) this.isChatOpen = false;
    }
  }

  toggleFullScreen() {
    if(!document.fullscreenElement){
      document.documentElement.requestFullscreen();
    } else document.exitFullscreen();
  }

  leave(){
    this.router.navigate(['/dashboard']);
  }

  toggleScreenShare() {
    this.isScreenSharing = !this.isScreenSharing;
    // TODO: tích hợp API actual ScreenShare ở đây
  }

  toggleRaiseHand() {
    this.isHandRaised = !this.isHandRaised;
    // TODO: gửi sự kiện giơ tay đến server
  }
}
