import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma/prisma.service';
// eslint-disable-next-line prettier/prettier
import type * as APITypes from 'src/types/api';
import { validateSchema } from 'src/lib/data/validate-schema';
import {
  handleGenericError,
  handlePrismaError,
  handleValidationError,
  handleValidationErrorZod,
} from 'src/utils/base';
import { CREATE_NOTE_SCHEMA } from 'src/schemas/basico';
import { ValidationError } from 'class-validator';
import {
  AuditLogActionType,
  createAuditLogEntry,
} from 'src/services/audit-logger/server';
import { prisma } from 'src/lib/data/prisma';

@Injectable()
export class NoteService {
  constructor(private prismaService: PrismaService) {}

  //Create Note
  async create(data: any): Promise<any> {
    try {
      // Validar os dados usando o esquema Zod
      const base = validateSchema(CREATE_NOTE_SCHEMA.partial(), data);

      const result = await this.prismaService.$transaction(async (prisma) => {
        // Criação da consignataria e relacionamento com o endereço
        const noteResult = await prisma.note.create({
          data: {
            ...(base as Prisma.NoteCreateInput),
          },
        });

        return noteResult;
      });

      return result;
    } catch (error) {
      console.log(error);

      handleValidationError(error);
    }
  }

  //FindAll Note
  async findAll(
    includingEnded = false,
    skip = 0,
    includeAll = false,
    query = '',
  ): Promise<APITypes.GetNoteCallsData> {
    const where: Prisma.NoteWhereInput = query
      ? {
          OR: [
            { text: { contains: query, mode: 'insensitive' } },
            { id: { contains: query, mode: 'insensitive' } },
          ],
        }
      : {};

    const [totalCount, calls] = await this.prismaService.$transaction([
      this.prismaService.note.count({ where }),
      this.prismaService.note.findMany({
        where,
        // include: includeAll ? { endereco: true } : undefined,
        orderBy: { createdAt: 'desc' },
        take: includeAll ? undefined : 35,
        skip: includeAll ? undefined : skip,
      }),
    ]);

    return {
      totalCount,
      calls,
    };
  }

  //Update Note
  async update(id: string, data: any): Promise<any> {
    try {
      // Validar os dados usando o esquema Zod
      const base = validateSchema(CREATE_NOTE_SCHEMA.partial(), data);

      const result = await this.prismaService.$transaction(async (prisma) => {
        const note = await prisma.note.findUnique({
          where: { id },
        });

        if (!note) {
          throw new Error('noteNotFound');
        }

        const noteResult = await prisma.note.update({
          where: {
            id,
          },
          data: {
            ...(base as Prisma.NoteUpdateInput),
          },
        });

        //Criar entrada de log de auditoria
        // await createAuditLogEntry({
        //   action: {
        //     type: AuditLogActionType.NoteUpdate,
        //     new: noteResult,
        //     previous: note,
        //   },
        //   prisma,
        //   executorId: '1', // Defina conforme necessário
        // });

        return noteResult;
      });

      return result;
    } catch (error) {
      if (error instanceof ValidationError) {
        // Lidar com erros de validação Zod
        handleValidationErrorZod(error);
      } else if (error instanceof Prisma.PrismaClientKnownRequestError) {
        // Lidar com erros específicos do Prisma
        handlePrismaError(error);
      } else {
        // Lidar com outros tipos de erros
        handleGenericError(error);
      }

      // Rejeitar o erro para que o chamador possa lidar com isso também
      throw error;
    }
  }

  //Delete Note
  async delete(id: string): Promise<any> {
    try {
      const note = await prisma.note.findUnique({
        where: { id },
      });

      if (!note) {
        throw new Error('noteNotFound');
      }

      const result = await this.prismaService.note.delete({
        where: { id },
      });

      // await createAuditLogEntry({
      //   translationKey: 'deletedEntry',
      //   action: {
      //     type: AuditLogActionType.NoteDelete,
      //     new: note,
      //   },
      //   prisma,
      //   executorId: '1', // Defina conforme necessário
      // });

      return result;
    } catch (error) {
      console.log(error);

      handleValidationError(error);
    }
  }
}
