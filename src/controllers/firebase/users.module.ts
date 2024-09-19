import { Module } from '@nestjs/common';

import { FirebaseService } from 'src/services/firebase.service';
import { UsersController } from './users.controller';

@Module({
  controllers: [UsersController],
  providers: [FirebaseService],
})
export class UsersModule {}
