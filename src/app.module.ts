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
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
