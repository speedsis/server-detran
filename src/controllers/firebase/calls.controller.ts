import { Controller, Get, Post, Body } from '@nestjs/common';
import { FirebaseService } from 'src/services/firebase.service';

@Controller('calls')
export class CallsController {
  constructor(private readonly firebaseService: FirebaseService) {}

  @Get()
  async getCalls() {
    return await this.firebaseService.getCalls();
  }
  // Método para inserir chamadas via POST
  @Post('insert')
  async insertCall(@Body() callData: any) {
    return await this.firebaseService.insertCall(callData);
  }
}
