import * as Types from '.';

export interface GetAuditLogsCallsData {
  calls: Types.AuditLogsCall[];
  totalCount: number;
}

//Notification
export interface GetNotificationCallsData {
  calls: Types.NotificationCall[];
  totalCount: number;
}

//Note
export interface GetNoteCallsData {
  calls: Types.NoteCall[];
  totalCount: number;
}

//Note
export interface GetOcorrenciaCallsData {
  calls: Types.OcorrenciaCall[];
  totalCount: number;
}

//User
export interface GetUserCallsData {
  calls: Types.UserCall[];
  totalCount: number;
}

//Servidor
export interface GetServidorCallsData {
  calls: Types.ServidorCall[];
  totalCount: number;
}

//----------------------------------------------

export interface GetAuditLogsData {
  totalCount: number;
  logs: Types.AuditLogData[];
}

export interface GetEmpresaCallsData {
  calls: Types.EmpresaCall[];
  totalCount: number;
}

/**
 * @method POST
 * @route /notification
 */

export type PostNotificationData = Types.NotificationData;

export type UpdateNotificationData = Types.NotificationData;

export type DeleteNotificationData = Types.NotificationData;

/**
 * @method POST
 * @route /note
 */

export type PostNoteData = Types.NoteData;

export type UpdateNoteData = Types.NoteData;

export type DeleteNoteData = Types.NoteData;

/**
 * @method POST
 * @route /ocorrencia
 */

export type PostOcorrenciaData = Types.OcorrenciaData;

export type UpdateOcorrenciaData = Types.OcorrenciaData;

export type DeleteOcorrenciaData = Types.OcorrenciaData;

/**
 * @method POST
 * @route /servidor
 */

export type PostServidorData = Types.ServidorData;

export type UpdateServidorData = Types.ServidorData;

export type DeleteServidorData = Types.ServidorData;

/**
 * @method POST
 * @route /empresa
 */

export type PostEmpresaData = Types.EmpresaData;

export type UpdateEmpresaData = Types.EmpresaData;

export type DeleteEmpresaData = Types.EmpresaData;
