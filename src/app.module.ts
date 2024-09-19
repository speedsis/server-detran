import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { NoteModule } from './controllers/note/note.module';
import { AuthModule } from './controllers/auth/auth.module';
import { AuditLogModule } from './controllers/audit-log/audit-log.module';
import { VerifyModule } from './controllers/verify/verify.module';
import { PusherModule } from './controllers/pusher/pusher.module';
import { OcorrenciaModule } from './controllers/ocorrencia/ocorrencia.module';
import { PinotModule } from './controllers/pinot/pinot.module';
import { PinotService } from './controllers/pinot/pinot.service';
import { FirebaseService } from './services/firebase.service';
import { OrdersModule } from './controllers/firebase/orders.module';
import { FirebaseModule } from './controllers/firebase/firebase.module';
import { WebSocketModule } from './controllers/websocket/websocket.module';
import { CallsModule } from './controllers/firebase/calls.module';
import { UsersModule } from './controllers/firebase/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    MongooseModule.forRoot(process.env.DATABASE_URL),
    PrismaModule,
    NoteModule,
    AuthModule,
    AuditLogModule,
    VerifyModule,
    PusherModule,
    OcorrenciaModule,
    PinotModule,
    OrdersModule,
    CallsModule,
    UsersModule,
    FirebaseModule,
    WebSocketModule,
  ],
  controllers: [AppController],
  providers: [AppService, PinotService, FirebaseService],
  exports: [FirebaseService],
})
export class AppModule {}
