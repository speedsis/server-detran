import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios'; // Importar o HttpModule
import { WebSocketService } from './websocket.service';
import { WebSocketController } from './websocket.controller';
import { WebSocketGatewayService } from './websocket.gateway';
import { FirestoreModule } from '../firestore/firestore.module';

@Module({
  imports: [HttpModule, FirestoreModule], // Adicione HttpModule aqui
  providers: [WebSocketService, WebSocketGatewayService],
  controllers: [WebSocketController], // Adicionar o controlador aqui
  exports: [WebSocketService, WebSocketGatewayService],
})
export class WebSocketModule {}
