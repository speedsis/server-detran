import { Body, Controller, Get, Post } from '@nestjs/common';
import { VerifyService } from './verify.service';

@Controller('verify')
export class VerifyController {
  constructor(private readonly verifyService: VerifyService) {}

  @Get()
  getHello(): string {
    return this.verifyService.getHello();
  }

  @Post('/SendOtp')
  async sendOtp(@Body() data: { phone: string }): Promise<{ msg: string }> {
    const prefix = '+55';
    const phone = prefix.concat(data.phone);
    return await this.verifyService.sendOtp(phone);
  }

  @Post('/VerifyOtp')
  async verifyOtp(
    @Body() data: { phone: string; otp: string },
  ): Promise<{ msg: string }> {
    const prefix = '+55';
    const phone = prefix.concat(data.phone);
    return await this.verifyService.verifyOtp(phone, data.otp);
  }
}
