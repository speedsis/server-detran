import { plainToClass, classToPlain } from 'class-transformer';
import type { AuditLogActions } from './index';
import { captureException } from '@sentry/node';

import type { GetAuditLogsData as _AuditLog } from 'src/types/api';

export * from './types/action-types';
export * from './types/actions';

type AuditLog = Omit<_AuditLog, 'action'> & {
  action: any;
};

interface Options<Action extends AuditLogActions> {
  prisma: any;
  translationKey?: string | null;
  action: Action;
  userCpf?: string | null;
  executorId?: string | null;
  servidorCpf?: string | null;
  matricula?: string | null;
  orgaoId?: string | null;
  empresaId: string;
  consignacaoId?: string | null;
  portal?: string | null;
  tela?: string | null;
  addressIP?: string;
}

export async function createAuditLogEntry<Action extends AuditLogActions>(
  options: Options<Action>,
) {
  try {
    const auditLog = await options.prisma.auditLog.create({
      data: {
        translationKey: options.translationKey,
        action: classToPlain(options.action) ?? null,
        userCpf: options.userCpf,
        executorId: options.executorId,
        servidorCpf: options.servidorCpf,
        matricula: options.matricula,
        orgaoId: options.orgaoId,
        empresaId: options.empresaId,
        consignacaoId: options.consignacaoId,
        portal: options.portal,
        tela: options.tela,
        addressIP: options.addressIP,
      },
    });

    return {
      ...auditLog,
      action: options.action,
    };
  } catch (error) {
    console.log(error);
    captureException(error);
    return null;
  }
}

export function parseAuditLogs<T extends AuditLog | AuditLog[]>(log: T) {
  function _parser(log: AuditLog) {
    if (typeof log.action === 'string') {
      return { ...log, action: plainToClass(null, JSON.parse(log.action)) };
    }

    return log;
  }

  if (Array.isArray(log)) {
    return log.map(_parser);
  }

  return _parser(log);
}
