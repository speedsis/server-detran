import { Module } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { FirestoreService } from './firestore.service';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Carrega as variáveis de ambiente do arquivo .env
dotenv.config({ path: path.resolve(__dirname, '../../../.env') });

// Verifica se o ambiente é desenvolvimento
const isDevelopment = process.env.NODE_ENV === 'development';

// Função para corrigir a formatação da chave privada (caso esteja carregada de uma variável de ambiente)
function fixPrivateKey(privateKey: string) {
  return privateKey.replace(/\\n/g, '\n'); // Substitui as quebras de linha escapadas
}

// Carrega as credenciais de acordo com o ambiente
const credentials = isDevelopment
  ? require('../../../config_firestore.json') // Carrega o arquivo JSON local em desenvolvimento
  : {
      ...JSON.parse(process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON || '{}'),
      private_key: fixPrivateKey(
        JSON.parse(process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON || '{}')
          .private_key || '',
      ),
    };

// Inicializa o Firebase Admin SDK com as credenciais apropriadas
admin.initializeApp({
  credential: admin.credential.cert(credentials as admin.ServiceAccount),
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

// firestore.module.ts
// import { Module } from '@nestjs/common';
// import * as admin from 'firebase-admin';
// import { FirestoreService } from './firestore.service';
// import * as config from '../../../config_firestore.json'; // Ajuste o caminho conforme necessário

// // Inicializa o Firebase Admin SDK
// admin.initializeApp({
//   credential: admin.credential.cert(config as admin.ServiceAccount), // Especificar o tipo correto
// });

// const firestore = admin.firestore();

// @Module({
//   providers: [
//     FirestoreService,
//     {
//       provide: 'FIRESTORE',
//       useValue: firestore,
//     },
//   ],
//   exports: [FirestoreService],
// })
// export class FirestoreModule {}
