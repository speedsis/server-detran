import { Controller, Post, Body, UseGuards, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '../auth/auth.guard';
import { ApiBody, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';

type consignataria = {
  id: string;
  nome: string;
  descricao: string;
};

type credentials = {
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  dob: string;
  groups: string[];
  consignataria: consignataria[];
  avatar_url: string;
  role: string;
  subdomain: string;
  name: string;
};

class LoginCredentials {
  constructor(public username: string, public password: string) {}
}

@ApiTags('auth') // Especifica uma tag para o grupo de endpoints
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @ApiOperation({ summary: 'Endpoint responsável para efetuar login' })
  @ApiQuery({
    name: 'username',
    description: 'O nome de usuário',
    type: 'string',
    example: 'support@speedsis.com.br',
  })
  @ApiQuery({
    name: 'password',
    description: 'A senha do usuário',
    type: 'string',
    example: 'consigov123',
  })
  @ApiBody({
    type: LoginCredentials,
    examples: {
      example1: {
        value: { username: 'support@speedsis.com.br', password: 'consigov123' },
        description: 'Credenciais de login de exemplo',
      },
    },
  })
  async login(@Body() credentials: LoginCredentials) {
    try {
      const { username, password } = credentials;
      const token = await this.authService.authenticate(username, password);
      return token;
    } catch (error) {
      return { error: 'Failed to authenticate' };
    }
  }

  // @UseGuards(AuthGuard)
  @Post('register')
  async register(@Body() credentials: credentials) {
    try {
      const result = await this.authService.register(credentials);

      console.log(result);

      return result;
    } catch (error) {
      return { error: 'Não foi possivel registrar.' };
    }
  }
}

// const {
//   username,
//   email,
//   firstName,
//   lastName,
//   dob,
//   groups,
//   consignataria,
//   avatar_url,
//   role,
//   subdomain,
//   name,
// } = credentials;
