import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { ionArrowForwardOutline, ionCheckboxOutline, ionCheckmarkCircle } from '@ng-icons/ionicons';

interface Step {
  number: string;
  title: string;
  description: string;
  image: string;
}

@Component({
  selector: 'app-how-it-work',
  imports: [
    NgIcon,
    CommonModule
  ],
  viewProviders: [provideIcons({
    ionArrowForwardOutline,
    ionCheckmarkCircle
  })],
  templateUrl: './how-it-work.component.html',
  styleUrl: './how-it-work.component.scss'
})
export class HowItWorkComponent {
  steps: Step[] = [
    {
      number: '01',
      title: 'Tạo tài khoản',
      description: 'Đăng ký miễn phí với email hoặc tài khoản Google của bạn.',
      image: '/assets/images/virtual_account.png',
    },
    {
      number: '02',
      title: 'Bắt đầu hoặc tham gia cuộc họp',
      description: 'Tạo cuộc họp mới hoặc tham gia bằng mã cuộc họp.',
      image: '/assets/images/start_meeting.png',
    },
    {
      number: '03',
      title: 'Mời người tham gia',
      description: 'Chia sẻ liên kết hoặc mã cuộc họp với người khác.',
      image: '/assets/images/share_team.png',
    },
  ];
}
