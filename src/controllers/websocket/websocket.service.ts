import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { map } from 'rxjs/operators';

@Injectable()
export class WebSocketService {
  private readonly logger = new Logger(WebSocketService.name);

  constructor(private readonly httpService: HttpService) {}

  async getOrders() {
    this.logger.log('Fetching orders...');
    return this.httpService
      .get('https://detran-server-146b2f942a9b.herokuapp.com/orders')
      .pipe(map((response) => response.data))
      .toPromise(); // Para usar async/await
  }

  // Método para buscar "calls"
  async getCalls() {
    this.logger.log('Fetching calls...');
    return this.httpService
      .get('https://detran-server-146b2f942a9b.herokuapp.com/calls')
      .pipe(map((response) => response.data))
      .toPromise(); // Para permitir uso de async/await
  }

  // Método para buscar "users"
  async getUsers() {
    this.logger.log('Fetching users...');
    return this.httpService
      .get('https://detran-server-146b2f942a9b.herokuapp.com/users')
      .pipe(map((response) => response.data))
      .toPromise(); // Para permitir uso de async/await
  }
}
