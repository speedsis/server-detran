// firebase.config.ts
// import * as admin from 'firebase-admin';
// import * as config from '../../../config_firestore.json'; // Ajuste o caminho conforme necessário

// // Usar o conteúdo JSON diretamente como as credenciais
// admin.initializeApp({
//   credential: admin.credential.cert(config as admin.ServiceAccount), // Especificar o tipo correto
// });

// const firestore = admin.firestore();

// export { firestore };

import * as admin from 'firebase-admin';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Carrega as variáveis de ambiente do arquivo .env
dotenv.config({ path: path.resolve(__dirname, '../../../.env') });

// Verifica se está em desenvolvimento
const isDevelopment = process.env.NODE_ENV === 'development';

// Carrega as credenciais de acordo com o ambiente
const credentials = isDevelopment
  ? require('../../../config_firestore.json')
  : JSON.parse(process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON || '{}');

// Inicializa o Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(credentials as admin.ServiceAccount),
});

const firestore = admin.firestore();

export { firestore };
