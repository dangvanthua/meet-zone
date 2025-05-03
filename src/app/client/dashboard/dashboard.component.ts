import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
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
  ionEllipsisHorizontalOutline,
  ionSaveOutline,
  ionFlashOutline
} from '@ng-icons/ionicons';
import { NavbarComponent } from "../../components/navbar/navbar.component";
import { MeetingService } from '../../../services/meeting.service';
import { CreateMeetingDto } from '../../../dto/meeting/create_meeting';
import { AuthService } from '../../../services/auth.service';
import { ApiResponse } from '../../../dto/api/api_res';
import { UserInfo } from '../../../dto/user/user_info';

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
      ionEllipsisHorizontalOutline,
      ionSaveOutline,
      ionFlashOutline
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
  // Cho modal lựa chọn loại cuộc họp
  openMeetingOptions: boolean = false;

  // Cho modal lên lịch cuộc họp
  openSchedule: boolean = false;
  scheduleMeetingTitle: string = '';
  scheduleMeetingDescription: string = '';
  scheduleMeetingStartTime: string = '';
  scheduleMeetingEndTime: string = '';
  scheduleMeetingParticipants: string = ''; 
  sendNotification: boolean = true;
  isSchedulingMeeting: boolean = false;

  // Cho chức năng cuộc họp tức thì
  isStartingInstantMeeting: boolean = false;

  newMeetingTitle = '';
  newMeetingDescription = '';
  newMeetingCode = `meet-${Math.random().toString(36).substring(2, 8)}`;
  joinMeetingCode = '';
  newMeetingStartTime = '';
  newMeetingEndTime = '';

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

  constructor(
    private authService: AuthService,
    private meetingService: MeetingService,
    private router: Router
  ) {}

  private parseDatetimeLocal(input: string): Date {
    const [year, month, day, hour, minute] = input.split(/[-T:]/).map(Number);
    return new Date(year, month - 1, day, hour, minute, 0, 0);
  }

  private formatAsVietnamISO(d: Date): string {
    const pad = (n: number) => n.toString().padStart(2, '0');
    const YYYY = d.getFullYear();
    const MM   = pad(d.getMonth() + 1);
    const DD   = pad(d.getDate());
    const hh   = pad(d.getHours());
    const mm   = pad(d.getMinutes());
    const ss   = pad(d.getSeconds());
    return `${YYYY}-${MM}-${DD}T${hh}:${mm}:${ss}+07:00`;
  }

  handleStartInstantMeeting() {
    this.isCreatingMeeting = true;
    this.meetingService.createMeeting().subscribe({
      next: res => {
        this.isCreatingMeeting = false;
        this.router.navigate(['/meeting', res.data.meeting_code]);
      },
      error: err => {
        this.isCreatingMeeting = false;
        console.error('Create meeting error:', err);
      }
    });
  }

  handleCreateMeeting() {
    // 1. Validate cơ bản
    if (!this.newMeetingTitle.trim()) {
      return alert('Tiêu đề không được để trống');
    }
    if (!this.newMeetingStartTime || !this.newMeetingEndTime) {
      return alert('Vui lòng chọn thời gian bắt đầu và kết thúc');
    }

    const startDate = this.parseDatetimeLocal(this.newMeetingStartTime);
    let endDate = this.parseDatetimeLocal(this.newMeetingEndTime);
    const now = new Date();

    if (endDate.getTime() <= startDate.getTime()) {
      endDate.setDate(endDate.getDate() + 1);
      console.log('≫ endDate adjusted to next day:', endDate);
    }

    if (startDate.getTime() <= now.getTime()) {
      return alert('Thời gian bắt đầu phải ở tương lai');
    }
    if (endDate.getTime() <= startDate.getTime()) {
      return alert('Thời gian kết thúc phải sau thời gian bắt đầu');
    }

    const payload: CreateMeetingDto = {
      title: this.newMeetingTitle,
      description: this.newMeetingDescription,
      start_time: this.formatAsVietnamISO(startDate),
      end_time:   this.formatAsVietnamISO(endDate)
    };

    // 6. Gửi API
    this.isCreatingMeeting = true;
    this.meetingService.createMeetingSchedule(payload).subscribe({
      next: res => {
        this.isCreatingMeeting = false;
        this.router.navigate(['/meeting', res.data.meeting_code]);
      },
      error: err => {
        this.isCreatingMeeting = false;
        console.error('Create meeting error:', err);
        alert(err.error?.message || 'Đã xảy ra lỗi khi tạo cuộc họp');
      }
    });
  }

  handleScheduleMeeting(): void {

  }

  handleJoinMeeting() {
    if (!this.joinMeetingCode.trim()) {
      return alert('Vui lòng nhập mã phòng');
    }
  
    this.isJoiningMeeting = true;
    this.authService.loadUserProfile().subscribe({
      next: (userInfo: UserInfo | null) => {
        if (userInfo) {
          const userId = userInfo.user_id;
          if (userId === null) return;
          this.meetingService.joinMeeting(this.joinMeetingCode, userId).subscribe({
            next: (res) => {
              this.isJoiningMeeting = false;
              this.router.navigate(['/meeting', res.data.meeting_code], {
                queryParams: { 
                  name: res.data.user_name,
                  isHost: false 
                }
              });
            },
            error: (err) => {
              this.isJoiningMeeting = false;
              console.error('Join meeting error:', err);
              alert(err.error?.message || 'Không thể tham gia phòng họp');
            }
          });
        }
      },
      error: (err) => {
        this.isJoiningMeeting = false;
        console.error('Get user ID error:', err);
      }
    });
  }

  copyMeetingLink(code: string) {
    const link = `${window.location.origin}/meeting/${code}`;
    navigator.clipboard.writeText(link);
    alert('Đã sao chép liên kết!');
  }
}
