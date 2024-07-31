import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import axios, { AxiosError } from 'axios';
import { prisma } from 'src/lib/data/prisma';
import { validateSchema } from 'src/lib/data/validate-schema';
import { PrismaService } from 'src/prisma/prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(private prismaService: PrismaService) {}

  async authenticate(username: string, password: string) {
    try {
      const response = await axios.post(
        'https://keycloak.serverconsigov.com/realms/consigov/protocol/openid-connect/token',
        new URLSearchParams({
          client_id: 'client-nest',
          client_secret: 'JsuH0rpxfEjX4UNrvnDkblvDjEO0Ln9B',
          grant_type: 'password',
          username: username,
          password: password,
          scope: 'openid',
        }),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        },
      );

      // Desestruture o token retornado da resposta
      // const { access_token, refresh_token, id_token, token_type, expires_in } =
      //   response.data;

      // Faça o que precisar com os tokens desestruturados
      // console.log('Access Token:', access_token);
      // console.log('Refresh Token:', refresh_token);
      // console.log('ID Token:', id_token);
      // console.log('Token Type:', token_type);
      // console.log('Expires In:', expires_in);

      return response.data;
    } catch (error) {
      throw new Error('Failed to authenticate with Keycloak');
    }
  }

  async generateUniqueEmail(baseEmail: string): Promise<string> {
    let email = baseEmail;
    let suffix = 1;

    while (await this.isEmailTaken(email)) {
      suffix++;
      email = `${baseEmail}${suffix}`;
    }

    return email;
  }

  async isEmailTaken(email: string): Promise<boolean> {
    const user = await this.prismaService.user.findUnique({
      where: { email },
    });

    return !!user;
  }

  async register(base: any): Promise<any> {
    try {
      // Verificar se as empresas foram fornecidas
      if (!base.empresas || base.empresas.length === 0) {
        throw new Error(
          'É necessário fornecer pelo menos uma empresa em empresas.',
        );
      }

      const ACCESS_TOKEN = await this.getToken();

      if (!ACCESS_TOKEN) {
        throw new Error('Falha ao obter o token.');
      }

      // Gerar e-mail único
      const uniqueEmail = await this.generateUniqueEmail(base.email);

      // Configurar o objeto para Keycloak com o e-mail único
      const itemKeycloak = {
        username: base.username,
        email: uniqueEmail,
        enabled: true,
        groups: [],
        emailVerified: false,
        firstName: base.firstName,
        lastName: base.lastName,
        attributes: {
          role: base.rank,
          avatar_url:
            'https://vemcard.com.br/wp-content/uploads/2022/08/sem-titulo-4.png',
          subdomain: 'cltghrgx9000112nk3akgv01d',
          consignataria: JSON.stringify([
            {
              id: '0999',
              descricao: 'VEMCARD',
              nome: 'VEMCARD',
            },
          ]),
          unidade: JSON.stringify([
            {
              value: 'cltghrgx9000112nk3akgv01d',
              label: 'Unidade de Óbdos',
            },
            {
              value: 'clukjlqxp0000ik9inf67gl1f',
              label: 'Unidade de Abaetetuba',
            },
          ]),
        },
        credentials: [
          {
            type: 'password',
            value: base.password, // Senha do usuário
            temporary: true,
          },
        ],
      };

      // Iniciar transação no Prisma
      const result = await this.prismaService.$transaction(async (prisma) => {
        const { empresas, consignatariaId, ...rest } = base;

        // Criar usuário no banco de dados
        const user = await prisma.user.create({
          data: {
            ...(rest as Prisma.UserCreateInput),
            emailAlternativo: base.email,
            email: uniqueEmail,
          },
        });

        // Criar usuário no Keycloak
        const keycloakResponse = await axios.post(
          'https://keycloak.serverconsigov.com/admin/realms/consigov/users',
          itemKeycloak,
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${ACCESS_TOKEN}`,
            },
          },
        );

        if (keycloakResponse.status !== 201) {
          throw new Error('Falha ao criar usuário no Keycloak.');
        }

        console.log('Usuário criado no Keycloak:', keycloakResponse.data);

        return user;
      });

      console.log('Usuário criado no banco de dados:', result);
      return result;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        // Se for um erro do Axios
        if (error.response) {
          // Se houver uma resposta de erro do servidor
          console.error(
            'Erro na solicitação para o Keycloak:',
            error.response.data,
          );
          throw new Error(
            error.response.data.error_description ||
              'Erro desconhecido ao criar usuário no Keycloak.',
          );
        } else if (error.request) {
          // Se não houver resposta do servidor
          console.error('Falha na solicitação para o Keycloak:', error.request);
        }
      } else {
        // Se ocorrer algum outro tipo de erro
        console.error('Erro ao criar usuário:', error.message);
      }
      throw error; // Lança novamente o erro para ser capturado pelo chamador
    }
  }

  async getToken(): Promise<string | null> {
    try {
      const response = await axios.post(
        'https://keycloak.serverconsigov.com/realms/consigov/protocol/openid-connect/token',
        new URLSearchParams({
          client_id: 'client-nest',
          client_secret: 'JsuH0rpxfEjX4UNrvnDkblvDjEO0Ln9B',
          grant_type: 'password',
          username: 'ally.cardoso',
          password: 'Arthur@2014',
          scope: 'openid',
        }),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        },
      );

      return response.data.access_token || null;
    } catch (error) {
      console.error('Erro ao obter o token:', error);
      return null;
    }
  }
}
