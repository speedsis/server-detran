import { Module } from '@nestjs/common';
import { OrdersController } from './orders.controller';

import { FirebaseService } from 'src/services/firebase.service';

@Module({
  controllers: [OrdersController],
  providers: [FirebaseService],
})
export class OrdersModule {}
