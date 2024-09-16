// firebase.config.ts
import * as admin from 'firebase-admin';
import * as config from '../../../config_firestore.json'; // Ajuste o caminho conforme necessário

// Usar o conteúdo JSON diretamente como as credenciais
admin.initializeApp({
  credential: admin.credential.cert(config as admin.ServiceAccount), // Especificar o tipo correto
});

const firestore = admin.firestore();

export { firestore };
