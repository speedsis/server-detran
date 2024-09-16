// firestore.module.ts
import { Module } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { FirestoreService } from './firestore.service';
import * as config from '../../../config_firestore.json'; // Ajuste o caminho conforme necessário

// Inicializa o Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(config as admin.ServiceAccount), // Especificar o tipo correto
});

const firestore = admin.firestore();

@Module({
  providers: [
    FirestoreService,
    {
      provide: 'FIRESTORE',
      useValue: firestore,
    },
  ],
  exports: [FirestoreService],
})
export class FirestoreModule {}
