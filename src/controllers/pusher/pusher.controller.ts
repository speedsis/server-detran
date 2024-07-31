import { Body, Controller, Post } from '@nestjs/common';
import { PusherService } from './pusher.service';

@Controller('pusher')
export class PusherController {
  constructor(private readonly pusherService: PusherService) {}

  @Post('trigger')
  async triggerEvent(
    @Body() body: { channel: string; event: string; data: any },
  ) {
    await this.pusherService.trigger(body.channel, body.event, body.data);
    return { message: 'Event triggered successfully' };
  }
}
