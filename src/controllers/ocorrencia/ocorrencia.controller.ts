import { Controller, Get, Post, Body, Query, Param } from '@nestjs/common';
import { OcorrenciaService } from './ocorrencia.service';

@Controller('ocorrencia')
export class OcorrenciaController {
  constructor(private readonly ocorrenciaService: OcorrenciaService) {}

  @Get()
  async getOcorrencia(
    @Query('ended') includingEnded = false,
    @Query('skip') skip = 0,
    @Query('includeAll') includeAll = false,
    @Query('query') query = '',
    @Param('Id') Id: string,
  ): Promise<any> {
    try {
      const result = await this.ocorrenciaService.findAll(
        includingEnded,
        skip,
        includeAll,
        query,
        Id,
      );
      return { success: true, data: result };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  @Post('send-data')
  async sendData(@Body() data: any): Promise<any> {
    try {
      const result = await this.ocorrenciaService.create(data);

      return { success: true, data: result };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
}
