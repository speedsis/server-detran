import { Module } from '@nestjs/common';
import { PinotService } from './pinot.service';
import { PinotController } from './pinot.controller';

@Module({
  controllers: [PinotController],
  providers: [PinotService],
  exports: [PinotService],
})
export class PinotModule {}
