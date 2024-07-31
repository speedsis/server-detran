import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
// import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { Observable } from 'rxjs';
import * as jwt from 'jsonwebtoken';
import { ApiBearerAuth } from '@nestjs/swagger';
import { prisma } from 'src/lib/data/prisma';
import { PrismaService } from 'src/prisma/prisma/prisma.service';

@Injectable()
@ApiBearerAuth() // Adicione o decorator ApiBearerAuth para informar ao Swagger que o endpoint requer autenticação do tipo Bearer
export class AuthGuard implements CanActivate {
  constructor(
    private readonly prisma: PrismaService, // Injete seu serviço Prisma
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request) as any;

    if (!token) {
      throw new UnauthorizedException();
    }

    try {
      // const decodedToken = jwt.decode(token);
      const decodedToken = jwt.decode(token) as jwt.JwtPayload;

      // console.log('Token decodedToken:', decodedToken);

      // Verifique se o token expirou
      // if (Date.now() >= decodedToken.exp * 1000) {
      //   console.log('Token expirado:', decodedToken.exp);

      //   throw new UnauthorizedException();
      // }

      // Acesse as propriedades do token JWT decodificado
      // console.log('Payload do Token:', decodedToken);

      const { sub, preferred_username, email, subdomain } = decodedToken;

      const user = await prisma.user.findFirst({
        where: { email: email },
      });

      if (!user) {
        throw new UnauthorizedException();
      }

      // console.log('Usuário autenticado, ID:', user.id);

      request['token'] = token;
      request['user'] = user;
      // request['API_TOKEN'] = decodedToken;

      return true;
    } catch (error) {
      throw new UnauthorizedException();
    }
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}

// console.log('Expiração:', decodedToken.exp);
// console.log('Emissor:', decodedToken.iss);
// console.log('Audiência:', decodedToken.aud);
// console.log('Nome do usuário:', decodedToken.preferred_username);
// console.log('E-mail do usuário:', decodedToken.email);
// console.log('Subdomínio:', decodedToken.subdomain);
// Payload do Token: {
//   exp: 1710539924,
//   iat: 1710539624,
//   jti: 'f12458b8-0a37-4068-9d87-fbe203c2e28e',
//   iss: 'https://keycloak.serverconsigov.com/realms/consigov',
//   aud: 'account',
//   sub: 'a152668b-0f2c-4445-a39a-bce5d92fc635',
//   typ: 'Bearer',
//   azp: 'client-nest',
//   session_state: '7ce199a0-63ed-42b9-98d1-6c2e65f87d09',
//   acr: '1',
//   'allowed-origins': [ '*' ],
//   realm_access: {
//     roles: [ 'offline_access', 'default-roles-consigov', 'uma_authorization' ]
//   },
//   resource_access: { account: { roles: [Array] } },
//   scope: 'openid profile role avatar_url subdomain consignataria email address',
//   sid: '7ce199a0-63ed-42b9-98d1-6c2e65f87d09',
//   role: 'admin',
//   address: {},
//   email_verified: true,
//   avatar_url: 'https://avatars.githubusercontent.com/u/24896037?v=4',
//   consignataria: [ { id: 1, descricao: 'VEMCARD', nome: 'VEMCARD' } ],
//   name: 'Maxwell Tavares',
//   subdomain: 'consigov',
//   preferred_username: 'support@speedsis.com.br',
//   given_name: 'Maxwell',
//   family_name: 'Tavares',
//   email: 'support@speedsis.com.br'
// }
