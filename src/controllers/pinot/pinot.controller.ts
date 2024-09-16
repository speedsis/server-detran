import { Controller, Get } from '@nestjs/common';
import { PinotService } from './pinot.service';

@Controller('vehicles')
export class PinotController {
  constructor(private readonly pinotService: PinotService) {}

  @Get('status')
  async getStatus() {
    return this.pinotService.getVehicleStatus();
  }
}
