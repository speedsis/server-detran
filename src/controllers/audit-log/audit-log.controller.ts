import { Controller, Get, Query, Param, Delete } from '@nestjs/common';
import { AuditLogService } from './audit-log.service';

@Controller('audit-log')
export class AuditLogController {
  constructor(private readonly auditLogService: AuditLogService) {}

  @Get('/:empresaId')
  async getAll(
    @Query('ended') includingEnded = false,
    @Query('skip') skip = 0,
    @Query('includeAll') includeAll = false,
    @Query('filterCPF') filterCPF: string,
    @Query('filterMatricula') filterMatricula: string,
    @Query('dtInicial') dtInicial: string,
    @Query('dtFinal') dtFinal: string,
    @Param('empresaId') empresaId: string,
  ): Promise<any> {
    try {
      const result = await this.auditLogService.findAll(
        includingEnded,
        skip,
        includeAll,
        filterCPF,
        filterMatricula,
        dtInicial,
        dtFinal,
        empresaId, // Passe o empresaId para o findAll
      );
      return { success: true, data: result };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  @Get(':id')
  async getOne(@Param('id') id: string): Promise<any> {
    try {
      const result = await this.auditLogService.findOne(id);
      return { success: true, data: result };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Delete
  @Delete('/deleteAll')
  async deleteAll(): Promise<any> {
    try {
      const result = await this.auditLogService.deleteAll();
      return { success: true, data: result };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
}
