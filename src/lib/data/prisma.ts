import { PrismaClient } from '@prisma/client';
// import { setDefaultCadFeatures } from 'migrations/set-default-cad-features';

export const prisma = new PrismaClient({
  errorFormat: 'colorless',
  log: ['info', 'warn', 'error'],
});
