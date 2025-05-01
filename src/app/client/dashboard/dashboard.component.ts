import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgIcon, NgIconsModule, provideIcons } from '@ng-icons/core';
import {
  ionVideocamOutline,
  ionLogInOutline,
  ionCalendarOutline,
  ionTimeOutline,
  ionPersonOutline,
  ionCopyOutline,
  ionEllipsisVerticalOutline,
  ionShareOutline,
  ionTrashOutline,
  ionCalendarClearOutline,
  ionVideocamOffOutline,
  ionPlayOutline,
  ionDownloadOutline,
  ionEllipsisHorizontalOutline
} from '@ng-icons/ionicons';
import { NavbarComponent } from "../../components/navbar/navbar.component";

interface Meeting {
  id: string;
  title: string;
  code: string;
  date: string;
  time: string;
  participants: number;
  isRecurring?: boolean;
  isRecorded?: boolean;
  showMenu?: boolean;
}


@Component({
  selector: 'app-dashboard',
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    NgIcon,
    NavbarComponent
],
  providers: [
    provideIcons({
      ionVideocamOutline,
      ionLogInOutline,
      ionCalendarOutline,
      ionTimeOutline,
      ionPersonOutline,
      ionCopyOutline,
      ionEllipsisVerticalOutline,
      ionShareOutline,
      ionTrashOutline,
      ionCalendarClearOutline,
      ionVideocamOffOutline,
      ionPlayOutline,
      ionDownloadOutline,
      ionEllipsisHorizontalOutline
    })
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {
  openCreate = false;
  openJoin = false;
  isCreatingMeeting = false;
  isJoiningMeeting = false;

  newMeetingTitle = '';
  newMeetingDescription = '';
  newMeetingCode = `meet-${Math.random().toString(36).substring(2, 8)}`;
  joinMeetingCode = '';

  tab: 'upcoming' | 'past' = 'upcoming';

  upcomingMeetings: Meeting[] = [
    { id:'meet-123', title:'Họp team Marketing', code:'abc-defg-hij', date:'2023-05-15', time:'09:00', participants:5, isRecurring:true, showMenu:false },
    { id:'meet-456', title:'Review dự án website', code:'klm-nopq-rst', date:'2023-05-16', time:'14:30', participants:3, isRecurring:false, showMenu:false },
    { id:'meet-789', title:'Phỏng vấn ứng viên', code:'uvw-xyz-123', date:'2023-05-17', time:'10:00', participants:2, isRecurring:false, showMenu:false }
  ];

  pastMeetings: Meeting[] = [
    { id:'meet-321', title:'Báo cáo tháng 4', code:'123-456-789', date:'2023-04-30', time:'15:00', participants:8, isRecorded:true, showMenu:false },
    { id:'meet-654', title:'Training nhân viên mới', code:'987-654-321', date:'2023-04-28', time:'09:30', participants:12, isRecorded:true, showMenu:false },
    { id:'meet-987', title:'Họp khách hàng', code:'567-890-123', date:'2023-04-25', time:'13:00', participants:4, isRecorded:false, showMenu:false }
  ];

  constructor() {}

  handleCreateMeeting() {
    this.isCreatingMeeting = true;
    setTimeout(() => {
      this.isCreatingMeeting = false;
      window.location.href = `/meeting/${this.newMeetingCode}`;
    }, 1500);
  }

  handleJoinMeeting() {
    if (!this.joinMeetingCode.trim()) return;
    this.isJoiningMeeting = true;
    setTimeout(() => {
      this.isJoiningMeeting = false;
      window.location.href = `/meeting/${this.joinMeetingCode}`;
    }, 1500);
  }

  randomCode(): string {
    return `meet-${Math.random().toString(36).substring(2, 8)}`;
  }

  copyMeetingLink(code: string) {
    const link = `${window.location.origin}/meeting/${code}`;
    navigator.clipboard.writeText(link);
    alert('Đã sao chép liên kết!');
  }
}
