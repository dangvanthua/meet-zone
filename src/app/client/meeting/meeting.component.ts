import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { ionCloseOutline, ionMicOffOutline, ionMicOutline, ionVideocamOffOutline, ionVideocamOutline } from '@ng-icons/ionicons';
import { NavbarComponent } from "../../components/navbar/navbar.component";

@Component({
  selector: 'app-meeting',
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    NgIcon,
    NavbarComponent
],
  viewProviders: [  provideIcons({
    ionMicOutline,
    ionMicOffOutline,
    ionVideocamOutline,
    ionVideocamOffOutline,
    ionCloseOutline
  })],
  templateUrl: './meeting.component.html',
  styleUrl: './meeting.component.scss'
})
export class MeetingComponent {
  meetingId!: string;
  name = '';
  isMicOn = true;
  isVideoOn = true;
  isJoining = false;
  showDeviceTest = false;
  deviceTab: 'audio' | 'video' | 'speaker' = 'audio';

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.meetingId = params.get('id') || '';
    });
    const saved = localStorage.getItem('user_name');
    if (saved) this.name = saved;
  }

  handleJoin() {
    if (!this.name.trim()) return;
    localStorage.setItem('user_name', this.name);
    this.isJoining = true;
    setTimeout(() => {
      this.router.navigate([`/meeting/${this.meetingId}/room`]);
    }, 1500);
  }
}
