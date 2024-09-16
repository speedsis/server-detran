import { Module } from '@nestjs/common';

import { FirebaseService } from 'src/services/firebase.service';
import { CallsController } from './calls.controller';

@Module({
  controllers: [CallsController],
  providers: [FirebaseService],
})
export class CallsModule {}
