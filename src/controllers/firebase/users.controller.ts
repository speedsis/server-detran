import { Controller, Get, Post, Body } from '@nestjs/common';
import { FirebaseService } from 'src/services/firebase.service';

@Controller('users')
export class UsersController {
  constructor(private readonly firebaseService: FirebaseService) {}

  @Get()
  async getUsers() {
    return await this.firebaseService.getUsers();
  }

  // Método para inserir users via POST
  @Post('insert')
  async insertUser(@Body() userData: any) {
    return await this.firebaseService.addUser(userData);
  }
}
