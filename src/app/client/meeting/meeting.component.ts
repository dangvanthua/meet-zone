import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { ionCloseOutline, ionMicOffOutline, ionMicOutline, ionVideocamOffOutline, ionVideocamOutline } from '@ng-icons/ionicons';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { DeviceFilterPipe } from '../../../pipe/device_filter.pipe';
import { MeetingService } from '../../../services/meeting.service';
import { ApiResponse } from '../../../dto/api/api_res';
import { AuthService } from '../../../services/auth.service';
import { UserInfo } from '../../../dto/user/user_info';

@Component({
  selector: 'app-meeting',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    NgIcon,
    NavbarComponent,
    DeviceFilterPipe,
  ],
  providers: [
    provideIcons({
      ionMicOutline,
      ionMicOffOutline,
      ionVideocamOutline,
      ionVideocamOffOutline,
      ionCloseOutline
    })
  ],
  templateUrl: './meeting.component.html',
  styleUrls: ['./meeting.component.scss']
})
export class MeetingComponent implements OnInit {
  @ViewChild('previewVideo') previewVideo!: ElementRef<HTMLVideoElement>;

  meetingCode!: string;
  name = '';
  isMicOn = true;
  isVideoOn = true;
  isJoining = false;
  showDeviceTest = false;
  deviceTab: 'audio' | 'video' | 'speaker' = 'audio';
  devices: MediaDeviceInfo[] = [];
  selectedSpeakerId = '';
  selectedMicId = '';
  selectedCameraId = '';

  private localStream!: MediaStream;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private meetingService: MeetingService,
    private authService: AuthService
  ) {}

  async ngOnInit() {
    this.route.paramMap.subscribe(async params => {
      this.meetingCode = params.get('id') || '';
      
      // Kiểm tra phòng hợp lệ
      this.meetingService.verifyMeeting(this.meetingCode).subscribe({
        next: (res: ApiResponse<Boolean>) => {
          const meeting = res.data;
          if (!meeting) {
            this.router.navigate(['/dashboard']);
          }
        }
      });
    });

    this.authService.loadUserProfile().subscribe({
      next: (res: UserInfo | null) => {;
        if (res) {
          this.name = res?.full_name || '';
        }
      }
    });

    await this.enumerateDevices();
    await this.refreshStream();
  }

  private async refreshStream(): Promise<void> {
    // Stop old tracks (if any)
    this.localStream?.getTracks().forEach(t => t.stop());
  
    // Build constraints
    const audioConstraint = this.isMicOn
      ? { deviceId: { exact: this.selectedMicId } }
      : false;
    const videoConstraint = this.isVideoOn
      ? { deviceId: { exact: this.selectedCameraId }, width: 640, height: 480 }
      : false;
  
    try {
      this.localStream = await navigator.mediaDevices.getUserMedia({
        audio: audioConstraint,
        video: videoConstraint
      });
      this.previewVideo.nativeElement.srcObject = this.localStream;
      await this.previewVideo.nativeElement.play();
    } catch (err) {
      console.error('refreshStream error', err);
      // alert('Không thể cập nhật stream');  
    }
  }  

  private async enumerateDevices() {
    try {
      this.devices = await navigator.mediaDevices.enumerateDevices();
      const defaultSpeaker = this.devices.find(d => d.kind === 'audiooutput');
      const defaultMic = this.devices.find(d => d.kind === 'audioinput');
      const defaultCamera = this.devices.find(d => d.kind === 'videoinput');
      this.selectedSpeakerId = defaultSpeaker?.deviceId || '';
      this.selectedMicId = defaultMic?.deviceId || '';
      this.selectedCameraId = defaultCamera?.deviceId || '';
    } catch (error) {
      console.error('Device enumeration failed:', error);
    }
  }

  toggleMic() {
    this.isMicOn = !this.isMicOn;
    this.refreshStream();
  }

  toggleCamera() {
    this.isVideoOn = !this.isVideoOn;
    this.refreshStream();
  }

  async selectAudioOutput(deviceId: string) {
    try {
      if (this.previewVideo.nativeElement.setSinkId) {
        await this.previewVideo.nativeElement.setSinkId(deviceId);
        this.selectedSpeakerId = deviceId;
      }
    } catch (err) {
      console.error('Failed to set audio output:', err);
    }
  }

  async selectMic(deviceId: string) {
    this.selectedMicId = deviceId;
    this.refreshStream();
  }

  async selectCamera(deviceId: string) {
    this.selectedCameraId = deviceId;
    this.refreshStream();
  }

  async handleJoin() {
    if (!this.name.trim()) return;
    this.isJoining = true;
    this.router.navigate([`/meeting/${this.meetingCode}/room`]);
  }

  ngOnDestroy() {
    if (this.localStream) {
      this.localStream.getTracks().forEach(track => track.stop());
    }
  }
}