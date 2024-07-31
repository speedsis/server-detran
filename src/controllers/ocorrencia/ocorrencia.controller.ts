import { Body, Controller, Post } from '@nestjs/common';
import { OcorrenciaService } from './ocorrencia.service';

@Controller('ocorrencia')
export class OcorrenciaController {
  constructor(private readonly ocorrenciaService: OcorrenciaService) {}

  @Post('send-data')
  async sendData(@Body() data: any) {
    return await this.ocorrenciaService.sendData(data);
  }
}
