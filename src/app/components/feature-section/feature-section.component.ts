import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { ionCalendar, ionChatbox, ionPeople, ionShieldCheckmark, ionTv, ionVideocam } from '@ng-icons/ionicons';

export interface Feature {
  icon: string;
  title: string;
  description: string;
  color: string;
}

@Component({
  selector: 'app-feature-section',
  imports: [
    CommonModule,
    NgIcon
  ],
  viewProviders: [provideIcons({
    ionShieldCheckmark,
    ionVideocam,
    ionChatbox,
    ionPeople,
    ionCalendar,
    ionTv
  })],
  template: `
     <section id="features" class="py-12 relative overflow-hidden">
        <div class="flex flex-col items-center text-center mb-12 md:mb-16">
              <div class="inline-flex items-center rounded-full bg-sky-50 px-3 py-1 text-sm font-medium text-sky-600 mb-4 border border-sky-100">
                  Tính năng nổi bật
              </div>
              <h2 class="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
                  Mọi thứ bạn cần cho cuộc họp hoàn hảo
              </h2>
              <p class="mt-4 text-lg text-gray-600 max-w-[800px]">
                  Khám phá các công cụ mạnh mẽ giúp cuộc họp của bạn hiệu quả và chuyên nghiệp hơn
              </p>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 px-4">
          <div *ngFor="let feature of features" class="flex flex-col bg-white p-8 rounded-2xl shadow-sm">
            <div [class]="'p-3 rounded-xl ' + feature.color">
              <ng-icon [name]="feature.icon" class="w-6 h-6"></ng-icon>
            </div>
            <h3 class="text-xl font-bold mb-3">{{ feature.title }}</h3>
            <p class="text-gray-600">{{ feature.description }}</p>
          </div>
        </div>
    </section>
  `,
})
export class FeatureSectionComponent {
  features: Feature[] = [{
    icon: 'ionShieldCheckmark',
    title: 'Bảo mật tối đa',
    description: "Mã hóa đầu cuối và các biện pháp bảo mật tiên tiến bảo vệ dữ liệu và cuộc họp của bạn.",
    color: 'bg-blue-50 text-blue-600',
  },
  {
    icon: 'ionVideocam',
    title: "Ghi hình cuộc họp",
    description: "Ghi lại cuộc họp để xem lại sau hoặc chia sẻ với những người không thể tham dự.",
    color: "bg-purple-50 text-purple-600",
  },
  {
    icon: 'ionTv',
    title: "Chia sẻ màn hình",
    description: "Chia sẻ màn hình, tài liệu hoặc ứng dụng của bạn một cách dễ dàng với tất cả người tham gia.",
    color: "bg-green-50 text-green-600",
  },
  {
    icon: 'ionChatbox',
    title: "Trò chuyện trực tiếp",
    description: "Trao đổi tin nhắn với tất cả người tham gia hoặc riêng tư với một người cụ thể.",
    color: "bg-amber-50 text-amber-600",
  },
  {
    icon: 'ionPeople',
    title: "Phòng họp nhỏ",
    description: "Chia nhóm người tham gia thành các phòng họp nhỏ để thảo luận riêng.",
    color: "bg-pink-50 text-pink-600",
  },
  {
    icon: 'ionCalendar',
    title: "Lên lịch cuộc họp",
    description: "Dễ dàng lên lịch và gửi lời mời cho các cuộc họp trong tương lai.",
    color: "bg-sky-50 text-sky-600",
  }
];
}
