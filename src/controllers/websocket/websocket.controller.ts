import { Controller, Get, Logger } from '@nestjs/common';
import { WebSocketService } from 'src/controllers/websocket/websocket.service';

@Controller('api/test')
export class WebSocketController {
  private readonly logger = new Logger(WebSocketController.name);

  constructor(private readonly websocketService: WebSocketService) {}

  @Get('get-db')
  async getDb() {
    this.logger.log('REST endpoint /api/test/get-db called');
    try {
      const orders = await this.websocketService.getOrders();
      return { event: 'get_db', data: orders };
    } catch (error) {
      this.logger.error('Error fetching data', error.stack);
      throw new Error('Error fetching data');
    }
  }

  @Get('get-calls')
  async getCalls() {
    this.logger.log('REST endpoint /api/calls/get-calls called');
    try {
      const calls = await this.websocketService.getCalls();
      return { event: 'get_calls', data: calls };
    } catch (error) {
      this.logger.error('Error fetching calls', error.stack);
      throw new Error('Error fetching calls');
    }
  }
}
