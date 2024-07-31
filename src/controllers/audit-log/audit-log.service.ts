import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma/prisma.service';
import type * as APITypes from 'src/types/api';
import { handleValidationError } from 'src/utils/base';

@Injectable()
export class AuditLogService {
  constructor(private prismaService: PrismaService) {}

  async findAll(
    includingEnded = false,
    skip = 0,
    includeAll = false,
    filterCPF: string,
    filterMatricula: string,
    dtInicial: string,
    dtFinal: string,
    empresaId: string, // Adicione empresaId como parâmetro
  ): Promise<APITypes.GetAuditLogsCallsData> {
    // const where: Prisma.AuditLogWhereInput = {
    //   AND: [
    //     query
    //       ? {
    //           OR: [
    //             // { descricao: { contains: query, mode: 'insensitive' } },
    //             { matricula: { equals: query, mode: 'insensitive' } },
    //             { servidorCpf: { equals: query, mode: 'insensitive' } },
    //             { userCpf: { equals: query, mode: 'insensitive' } },
    //             { id: { contains: query, mode: 'insensitive' } },
    //           ],
    //         }
    //       : {}, // Adicione a condição do query apenas se estiver presente
    //     { Empresa: { id: empresaId } }, // Filtro por empresaId
    //   ],
    // };

    const where: Prisma.AuditLogWhereInput = {};

    // Aqui você pode adicionar a lógica para usar 'unidade', 'consignatariaId', 'dtInicial' e 'dtFinal' na query
    if (empresaId) {
      where.empresaId = empresaId;
    }

    if (filterCPF) {
      where.servidorCpf = filterCPF;
    }

    if (filterMatricula) {
      where.matricula = filterMatricula;
    }

    if (dtInicial && dtFinal) {
      where.createdAt = {
        gte: new Date(dtInicial),
        lte: new Date(dtFinal),
      };
    }

    const [totalCount, calls] = await this.prismaService.$transaction([
      this.prismaService.auditLog.count({ where }),
      this.prismaService.auditLog.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        take: includeAll ? undefined : 35,
        skip: includeAll ? undefined : skip,
      }),
    ]);

    return { calls, totalCount };
  }

  async findOne(id: string): Promise<any> {
    try {
      const result = await this.prismaService.auditLog.findUnique({
        where: {
          id: id,
        },
      });

      return result;
    } catch (error) {
      console.error(error);
      handleValidationError(error);
    }
  }

  async deleteAll(): Promise<any> {
    try {
      // Delete os registros onde empresaId é nulo
      const deleteResult = await this.prismaService.auditLog.deleteMany();

      return {
        deleteResult,
      };
    } catch (error) {
      console.error(error);
      // Trate o erro de validação ou retorne conforme necessário
      throw error;
    }
  }
}
