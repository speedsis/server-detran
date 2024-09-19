import {
  type Note,
  Ocorrencia,
  Servidor,
  Notification,
  ApiToken,
  ApiTokenLog,
  User,
  Empresa,
  AuditLog,
} from '@prisma/client';

export type AuditLogsCall = AuditLog & {
  // assignedUnit: Pick<Prisma.Citizen, "name" | "surname" | "id"> | null;
  // creator: Pick<Prisma.Citizen, "name" | "surname" | "id"> | null;
};

//Notification
export type NotificationCall = Notification & {
  // assignedUnit: Pick<Prisma.Citizen, "name" | "surname" | "id"> | null;
  // creator: Pick<Prisma.Citizen, "name" | "surname" | "id"> | null;
};

//Note
export type NoteCall = Note & {
  // assignedUnit: Pick<Prisma.Citizen, "name" | "surname" | "id"> | null;
  // creator: Pick<Prisma.Citizen, "name" | "surname" | "id"> | null;
};

//Note
export type OcorrenciaCall = Ocorrencia & {
  // assignedUnit: Pick<Prisma.Citizen, "name" | "surname" | "id"> | null;
  // creator: Pick<Prisma.Citizen, "name" | "surname" | "id"> | null;
};

//User
export type UserCall = User & {
  // assignedUnit: Pick<Prisma.Citizen, "name" | "surname" | "id"> | null;
  // creator: Pick<Prisma.Citizen, "name" | "surname" | "id"> | null;
};

//Servidor
export type ServidorCall = Servidor & {
  // assignedUnit: Pick<Prisma.Citizen, "name" | "surname" | "id"> | null;
  // creator: Pick<Prisma.Citizen, "name" | "surname" | "id"> | null;
};

//----------------------------------------------
//CreateEmpresaCall
export type EmpresaCall = Empresa & {
  // assignedUnit: Pick<Prisma.Citizen, "name" | "surname" | "id">
  //   | null;
  // creator: Pick<Prisma.Citizen, "name" | "surname" | "id">
  //   | null;
};

export type AuditLogData = AuditLog & {
  executor?: User | null;
  action: { previous: unknown; new: unknown; type: unknown };
};

export type NoteData = Note;

export type OcorrenciaData = Ocorrencia;

export type NotificationData = Notification;

export type ServidorData = Servidor;

export type EmpresaData = Empresa;

export type LimitedUserPicks = 'id' | 'username';
export type LimitedUser = Pick<User, LimitedUserPicks>;

export type ApiTokenData = ApiToken & {
  logs?: ApiTokenLog[];
};

export type ApiTokenLogData = ApiTokenLog;
