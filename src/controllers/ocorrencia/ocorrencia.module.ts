import { Module } from '@nestjs/common';
import { OcorrenciaService } from './ocorrencia.service';
import { OcorrenciaController } from './ocorrencia.controller';

import { WebSocketModule } from '../websocket/websocket.module';

@Module({
  imports: [WebSocketModule], // Importa o módulo WebSocket
  controllers: [OcorrenciaController],
  providers: [OcorrenciaService],
  exports: [OcorrenciaService],
})
export class OcorrenciaModule {}
