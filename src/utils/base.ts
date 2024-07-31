import { ExtendedBadRequest } from 'src/exceptions/extended-bad-request';
import { z, ZodError } from 'zod';
import { BadRequest } from '@tsed/exceptions';
import { ValidationError } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { prisma } from 'src/lib/data/prisma';
import { Request } from 'express';

export function getClientIp(request: Request): string {
  const forwardedFor =
    request.headers['x-real-ip'] || request.headers['x-forwarded-for'];
  let ip = forwardedFor
    ? Array.isArray(forwardedFor)
      ? forwardedFor[0]
      : forwardedFor
    : request.connection.remoteAddress;

  // Remover o prefixo ::ffff: se presente
  if (ip && ip.startsWith('::ffff:')) {
    ip = ip.replace('::ffff:', '');
  }

  return ip;
}

export function handleValidationError(error: any): void {
  if (error instanceof ZodError) {
    const errors: Record<string, string> = {};

    error.errors.forEach((fieldError) => {
      const errorMessage = fieldError.message;
      const fieldPath = fieldError.path.join('.');
      errors[fieldPath] = errorMessage;
    });

    if (Object.values(errors).length > 0) {
      throw new ExtendedBadRequest(errors);
    }
  }

  throw new BadRequest(JSON.stringify(error.errors));
}

export async function checkEntityExistence(
  modelName: string,
  uniqueFields: Record<string, any>,
): Promise<string> {
  const entity = await prisma[modelName].findUnique({
    where: uniqueFields,
    select: { id: true },
  });

  if (!entity) {
    throw new Error(`A ${modelName} não existe.`);
  }

  return entity.id;
}

// Função para lidar com erros de validação Zod
export function handleValidationErrorZod(error: ValidationError) {
  console.error('Erro de validação:', error.value);
  // Lógica para notificar ou tratar o erro de validação
}

// Função para lidar com erros específicos do Prisma
export function handlePrismaError(error: Prisma.PrismaClientKnownRequestError) {
  console.error('Erro Prisma:', error.message);
  // Lógica para notificar ou tratar o erro do Prisma
}

// Função para lidar com outros tipos de erros
export function handleGenericError(error: any) {
  console.error('Erro genérico:', error);
  // Lógica para notificar ou tratar outros tipos de erros
}

export function getCurrentMonth(isNextMonth = false) {
  const currentDate = new Date();
  let year = currentDate.getFullYear();
  let month = currentDate.getMonth() + 1; // O mês é baseado em zero, então adicionamos 1

  if (isNextMonth) {
    month += 1;
    if (month > 12) {
      month = 1;
      year += 1;
    }
  }

  return { month, year };
}

export async function parcelarValor(data: any): Promise<any[]> {
  try {
    const { valor, inicial, final } = data;

    if (final <= inicial) {
      throw new Error('A parcela final deve ser maior que a parcela inicial.');
    }

    const parcelamentos: any[] = [];

    const valtitulo = Math.floor(valor);

    for (let i = inicial; i <= final; i++) {
      const mesReferencia = ((2 + i - inicial) % 12) + 1; // Inicia a contagem a partir do mês 3 (março)
      const anoReferencia = 2024 + Math.floor((2 + i - inicial) / 12);

      console.log('mesReferencia', final);

      console.log('mesReferencia', inicial);

      parcelamentos.push({
        valtitulo,
        mesReferencia,
        anoReferencia,
        digitotitulo: i,
        perjurosmora: 0.0033,
      });
    }

    return parcelamentos;
  } catch (error) {
    console.error(`Erro ao gerar parcelas: ${error.message}`);
    throw error;
  }
}

export async function gerarProximoSerial(prisma): Promise<string> {
  const ultimoComprovante = await prisma.comprovanteConsignacao.findFirst({
    orderBy: { dataDocumento: 'desc' },
  });

  const ultimoSerial = ultimoComprovante?.serial || '0';
  const proximoSerial = String(Number(ultimoSerial) + 1).padStart(4, '0'); // Ajuste o número de dígitos conforme necessário

  return proximoSerial;
}

export async function getMissingCodes(
  set: Set<string>,
  length: number,
  empresaId: string,
  type: string,
): Promise<string[]> {
  const missingCodes: string[] = [];

  for (let i = 1; i <= length; i++) {
    const codigo = i.toString().padStart(type === 'regime' ? 2 : 5, '0');
    if (!set.has(codigo)) {
      const exists = await this.prismaService[type].findFirst({
        where: {
          codigo: codigo,
          empresaId: empresaId,
        },
        select: { id: true },
      });

      if (!exists) missingCodes.push(codigo);
    }
  }

  return missingCodes;
}
