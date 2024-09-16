import { Controller, Get, Post, Body } from '@nestjs/common';
import { FirebaseService } from 'src/services/firebase.service';

@Controller('orders')
export class OrdersController {
  constructor(private readonly firebaseService: FirebaseService) {}

  @Get()
  async getOrders() {
    return await this.firebaseService.getOrders();
  }

  // Método para inserir pedidos via POST
  @Post('insert')
  async insertOrder(@Body() orderData: any) {
    return await this.firebaseService.insertOrder(orderData);
  }
}
