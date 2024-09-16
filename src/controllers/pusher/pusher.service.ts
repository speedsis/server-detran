import { Injectable } from '@nestjs/common';
import Pusher from 'pusher';

@Injectable()
export class PusherService {
  private pusher: Pusher;

  constructor() {
    this.pusher = new Pusher({
      appId: '1813592',
      key: 'd454cebfefee6599d00c',
      secret: '3f5794de0beeb900b7b9',
      cluster: 'us2',
      useTLS: true,
    });
  }

  async trigger(channel: string, event: string, data: any) {
    return this.pusher.trigger(channel, event, data);
  }
}
