import { Injectable } from '@nestjs/common';
import { initializeApp } from 'firebase/app';
import {
  getFirestore,
  collection,
  getDocs,
  addDoc,
  Firestore,
  GeoPoint,
} from 'firebase/firestore'; // Importações adequadas
import { Call } from 'src/types/call';

interface LocationCoords {
  lat: number;
  lng: number;
}

interface GeoPointInput {
  lat: number;
  lng: number;
}

@Injectable()
export class FirebaseService {
  private firestore: Firestore;

  constructor() {
    const firebaseConfig = {
      apiKey: process.env.FIREBASE_API_KEY,
      authDomain: process.env.FIREBASE_AUTH_DOMAIN,
      projectId: process.env.FIREBASE_PROJECT_ID,
      storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
      messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
      appId: process.env.FIREBASE_APP_ID,
    };

    const app = initializeApp(firebaseConfig);
    this.firestore = getFirestore(app); // Usando a função getFirestore
  }

  getFirestoreInstance(): Firestore {
    return this.firestore; // Retorna a instância do Firestore
  }

  // Função auxiliar para transformar um objeto com latitude e longitude em GeoPoint
  // private convertToGeoPoint(location: { lat: number; lng: number }) {
  //   return new GeoPoint(location.lat, location.lng);
  // }

  // Função auxiliar para transformar um objeto com latitude e longitude em GeoPoint
  private convertToGeoPoint(
    location: LocationCoords | { latitude: number; longitude: number },
  ): GeoPoint {
    if ('latitude' in location && 'longitude' in location) {
      // Se for um GeoPoint
      return new GeoPoint(location.latitude, location.longitude);
    } else if ('lat' in location && 'lng' in location) {
      // Se for um LocationCoords
      return new GeoPoint(location.lat, location.lng);
    } else {
      throw new Error('Formato de localização desconhecido');
    }
  }

  // Outros métodos para interagir com Firebase, como Firestore, Storage, etc.

  // Método para buscar pedidos
  async getOrders() {
    const ordersCollection = collection(this.firestore, 'orders'); // Usando 'collection'
    const snapshot = await getDocs(ordersCollection); // Usando 'getDocs'

    return snapshot.docs.map((doc) => doc.data());
  }

  // Método para inserir pedido no Firestore
  async insertOrder(orderData: any) {
    try {
      const ordersCollection = collection(this.firestore, 'orders');

      // Convertendo campos de geolocalização para Firebase GeoPoint
      if (orderData.deliveryGeoPoint) {
        orderData.deliveryGeoPoint = this.convertToGeoPoint(
          orderData.deliveryGeoPoint,
        );
      }

      if (orderData.geoPoint) {
        orderData.geoPoint = this.convertToGeoPoint(orderData.geoPoint);
      }

      if (orderData.addressModel?.geoPoint) {
        orderData.addressModel.geoPoint = this.convertToGeoPoint(
          orderData.addressModel.geoPoint,
        );
      }

      // Inserir o pedido no Firestore
      const docRef = await addDoc(ordersCollection, orderData);
      return { success: true, id: docRef.id };
    } catch (error) {
      console.error('Erro ao inserir pedido:', error);
      throw new Error('Erro ao inserir pedido');
    }
  }

  // Método para inserir chamadas no Firestore
  async insertCall(callData: Call) {
    try {
      const callsCollection = collection(this.firestore, 'calls');

      // Convertendo campos de geolocalização para Firebase GeoPoint, se existirem
      // Converte campos de geolocalização para Firebase GeoPoint, se existirem
      if (callData.location_coords) {
        callData.location_coords = this.convertToGeoPoint(
          callData.location_coords,
        );
      }

      // Inserir a chamada no Firestore
      const docRef = await addDoc(callsCollection, callData);
      return { success: true, id: docRef.id };
    } catch (error) {
      console.error('Erro ao inserir chamada:', error);
      throw new Error('Erro ao inserir chamada');
    }
  }

  // Método para buscar pedidos
  async getCalls() {
    const callsCollection = collection(this.firestore, 'calls'); // Usando 'collection'
    const snapshot = await getDocs(callsCollection); // Usando 'getDocs'

    return snapshot.docs.map((doc) => doc.data());
  }

  //   // Método para inserir pedidos
  //   async insertOrder(orderData: any) {
  //     try {
  //       const ordersCollection = collection(this.firestore, 'orders'); // Coleção 'orders'
  //       const docRef = await addDoc(ordersCollection, orderData); // Inserir dados do pedido
  //       return { success: true, id: docRef.id };
  //     } catch (error) {
  //       console.error('Erro ao inserir pedido:', error);
  //       throw new Error('Erro ao inserir pedido');
  //     }
  //   }

  // Método para inserir pedidos
  async insertOrders(orderData: any) {
    try {
      const ordersCollection = collection(this.firestore, 'orders');

      // Verifica se orderData é um array
      if (Array.isArray(orderData)) {
        const batchInsert = orderData.map(async (order) => {
          const docRef = await addDoc(ordersCollection, order);
          return docRef.id;
        });

        const ids = await Promise.all(batchInsert); // Aguardando todas as inserções
        return { success: true, ids };
      } else {
        // Se não for um array, insere um único pedido
        const docRef = await addDoc(ordersCollection, orderData);
        return { success: true, id: docRef.id };
      }
    } catch (error) {
      console.error('Erro ao inserir pedido:', error);
      throw new Error('Erro ao inserir pedido');
    }
  }

  // Método para buscar users
  async getUsers() {
    const usersCollection = collection(this.firestore, 'users'); // Usando 'collection'
    const snapshot = await getDocs(usersCollection); // Usando 'getDocs'

    return snapshot.docs.map((doc) => doc.data());
  }

  // Método para inserir users via POST
  async addUser(userData: any) {
    try {
      const usersCollection = collection(this.firestore, 'users');

      // Inserir o user no Firestore
      const docRef = await addDoc(usersCollection, userData);
      return { success: true, id: docRef.id };
    } catch (error) {
      console.error('Erro ao inserir user:', error);
      throw new Error('Erro ao inserir user');
    }
  }
}
