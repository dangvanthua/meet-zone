import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterByKind',
  standalone: true
})
export class DeviceFilterPipe implements PipeTransform {
  transform(devices: MediaDeviceInfo[], kind: string): MediaDeviceInfo[] {
    return devices.filter(device => device.kind === kind);
  }
}