// firestore.service.ts
import { Injectable, Inject } from '@nestjs/common';
import { Firestore } from 'firebase-admin/firestore';

@Injectable()
export class FirestoreService {
  constructor(@Inject('FIRESTORE') private readonly firestore: Firestore) {}

  getOrdersCollection() {
    return this.firestore.collection('orders');
  }

  getCallsCollection() {
    return this.firestore.collection('calls');
  }
}
