import type * as APITypes from 'src/types';
import type { AuditLogActionType } from './action-types';

export type AuditLogActions =
  | NoteUpdate
  | NoteDelete
  | EmpresaUpdate
  | EmpresaDelete
  | ServidorUpdate
  | ServidorDelete;

type BaseAuditLogAction<
  ActionType extends AuditLogActionType,
  Previous,
  New,
> = {
  type: ActionType;
  // eslint-disable-next-line @typescript-eslint/ban-types
} & (Previous extends undefined ? {} : { previous: Partial<Previous> }) &
  // eslint-disable-next-line @typescript-eslint/ban-types
  (New extends undefined ? {} : { new: Partial<New> });

export type NoteUpdate = BaseAuditLogAction<
  AuditLogActionType.NoteUpdate,
  undefined,
  APITypes.NoteData
>;

export type NoteDelete = BaseAuditLogAction<
  AuditLogActionType.NoteDelete,
  undefined,
  APITypes.NoteData
>;

export type EmpresaUpdate = BaseAuditLogAction<
  AuditLogActionType.EmpresaUpdate,
  undefined,
  APITypes.EmpresaData
>;

export type EmpresaDelete = BaseAuditLogAction<
  AuditLogActionType.EmpresaDelete,
  undefined,
  APITypes.EmpresaData
>;

export type ServidorUpdate = BaseAuditLogAction<
  AuditLogActionType.ServidorUpdate,
  undefined,
  APITypes.ServidorData
>;

export type ServidorDelete = BaseAuditLogAction<
  AuditLogActionType.ServidorDelete,
  undefined,
  APITypes.ServidorData
>;
