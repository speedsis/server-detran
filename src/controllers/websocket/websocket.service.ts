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
      .get('http://localhost:3000/orders')
      .pipe(map((response) => response.data))
      .toPromise(); // Para usar async/await
  }

  // Método para buscar "calls"
  async getCalls() {
    this.logger.log('Fetching calls...');
    return this.httpService
      .get('http://localhost:3000/calls')
      .pipe(map((response) => response.data))
      .toPromise(); // Para permitir uso de async/await
  }
}
