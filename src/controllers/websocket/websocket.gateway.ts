import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';
import { WebSocketService } from './websocket.service';
import { FirestoreService } from '../firestore/firestore.service';
import { OnModuleInit } from '@nestjs/common';

@WebSocketGateway({
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
})
export class WebSocketGatewayService
  implements OnGatewayConnection, OnGatewayDisconnect, OnModuleInit
{
  private readonly logger = new Logger(WebSocketGatewayService.name);

  @WebSocketServer() server: Server;

  constructor(
    private readonly websocketService: WebSocketService,
    private readonly firestoreService: FirestoreService,
  ) {}

  // Método chamado após a inicialização do módulo
  async onModuleInit() {
    this.listenToOrders();
    this.listenToCalls();
    this.listenToUsers();
  }

  // Configurar o listener para a coleção 'orders'
  private listenToOrders() {
    const ordersCollection = this.firestoreService.getOrdersCollection();

    if (ordersCollection) {
      ordersCollection.onSnapshot(
        (snapshot) => {
          if (this.server) {
            const orders = snapshot.docs.map((doc) => ({
              id: doc.id,
              ...doc.data(),
            }));
            this.server.emit('order_update', orders);
          } else {
            this.logger.error('Server is not initialized.');
          }
        },
        (error) => {
          this.logger.error('Error listening to Firestore updates:', error);
        },
      );
    } else {
      this.logger.error('Firestore orders collection not found.');
    }
  }

  // Configurar o listener para a coleção 'calls'
  private listenToCalls() {
    const callsCollection = this.firestoreService.getCallsCollection();

    if (callsCollection) {
      callsCollection.onSnapshot(
        (snapshot) => {
          if (this.server) {
            const calls = snapshot.docs.map((doc) => ({
              id: doc.id,
              ...doc.data(),
            }));
            this.server.emit('call_update', calls); // Emitir evento de atualização de chamadas
          } else {
            this.logger.error('Server is not initialized.');
          }
        },
        (error) => {
          this.logger.error('Error listening to Firestore updates:', error);
        },
      );
    } else {
      this.logger.error('Firestore calls collection not found.');
    }
  }

  // Configurar o listener para a coleção 'users'
  private listenToUsers() {
    const usersCollection = this.firestoreService.getUsersCollection();

    if (usersCollection) {
      usersCollection.onSnapshot(
        (snapshot) => {
          if (this.server) {
            const users = snapshot.docs.map((doc) => ({
              id: doc.id,
              ...doc.data(),
            }));
            this.server.emit('user_update', users); // Emitir evento de atualização de usuários
          } else {
            this.logger.error('Server is not initialized.');
          }
        },
        (error) => {
          this.logger.error('Error listening to Firestore updates:', error);
        },
      );
    } else {
      this.logger.error('Firestore users collection not found.');
    }
  }

  // Método que lida com a conexão de um cliente
  handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id}`);
  }

  // Método que lida com a desconexão de um cliente
  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('get_db')
  async handleGetDb(client: Socket) {
    this.logger.log('Received get_db request');
    try {
      const orders = await this.websocketService.getOrders();
      client.emit('get_db', { event: 'get_db', data: orders });
    } catch (error) {
      this.logger.error('Error fetching data', error.stack);
    }
  }

  // Método para lidar com a assinatura WebSocket 'get_calls'
  @SubscribeMessage('get_calls')
  async handleGetCalls(client: Socket) {
    this.logger.log('Received get_calls request');
    try {
      const calls = await this.websocketService.getCalls();
      client.emit('get_calls', { event: 'get_calls', data: calls });
    } catch (error) {
      this.logger.error('Error fetching calls data', error.stack);
    }
  }

  // Método para lidar com a assinatura WebSocket 'get_users'
  @SubscribeMessage('get_users')
  async handleGetUsers(client: Socket) {
    this.logger.log('Received get_users request');
    try {
      const users = await this.websocketService.getUsers();
      client.emit('get_users', { event: 'get_users', data: users });
    } catch (error) {
      this.logger.error('Error fetching users data', error.stack);
    }
  }

  @SubscribeMessage('transfer')
  handleTransfer(client: Socket, payload: { id: string }): void {
    console.log('Received transfer event with ID:', payload.id);

    // Aqui você pode processar o evento recebido e realizar ações
    // como atualizar banco de dados, enviar resposta, etc.

    // Exemplo de resposta ao cliente
    client.emit('transfer_response', { status: 'success', id: payload.id });
  }
}
