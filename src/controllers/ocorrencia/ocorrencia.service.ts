import { Injectable } from '@nestjs/common';
import { Ocorrencia, Prisma } from '@prisma/client';
import axios from 'axios';

import { validateSchema } from 'src/lib/data/validate-schema';
import type * as APITypes from 'src/types/api';
import { PrismaService } from 'src/prisma/prisma/prisma.service';
import { CREATE_OCORRENCIA_SCHEMA } from 'src/schemas/basico';
import { handleValidationError } from 'src/utils/base';
import { WebSocketGatewayService } from '../websocket/websocket.gateway';
import { FirebaseService } from 'src/services/firebase.service';
import { collection, doc, getDoc, runTransaction } from 'firebase/firestore';

@Injectable()
export class OcorrenciaService {
  constructor(
    private prismaService: PrismaService,
    private readonly firebaseService: FirebaseService,
    private readonly webSocketGatewayService: WebSocketGatewayService,
  ) {}

  private client_id = 'Dp1Rvkumec7bk33D';
  private client_secret = '840874facf0f4a168e846ec8dff33fa3';
  private url_token = 'https://www.arcgis.com/sharing/rest/oauth2/token';
  private arcgis_url =
    'https://services5.arcgis.com/LmhwGtO3MwVP7DcH/arcgis/rest/services/dodos_prf/FeatureServer/0/addFeatures';

  async getToken(): Promise<string> {
    const data = {
      client_id: this.client_id,
      client_secret: this.client_secret,
      grant_type: 'client_credentials',
      f: 'json',
    };

    const response = await axios.post(
      this.url_token,
      new URLSearchParams(data),
    );
    return response.data.access_token;
  }

  // utils/conversionUtils.ts

  // Função para converter um valor para Float
  convertToFloat(value: any): number | null {
    // Se o valor for uma string
    if (typeof value === 'string') {
      // Substitui vírgulas por pontos e tenta converter para Float
      return parseFloat(value.replace(',', '.'));
    }

    // Se o valor for um número
    if (typeof value === 'number') {
      // Retorna o valor
      return value;
    }

    // Se não for possível converter, retorna nulo
    return null;
  }

  //FindAll Ocorrencia
  async findAll(
    includingEnded = false,
    skip = 0,
    includeAll = false,
    query = '',
    empresaId: string, // Adicione empresaId como parâmetro
  ): Promise<APITypes.GetOcorrenciaCallsData> {
    const where: Prisma.OcorrenciaWhereInput = {
      AND: [
        query
          ? {
              OR: [{ id: { contains: query, mode: 'insensitive' } }],
            }
          : {}, // Adicione a condição do query apenas se estiver presente
      ],
    };

    const [totalCount, calls] = await this.prismaService.$transaction([
      this.prismaService.ocorrencia.count({ where }),
      this.prismaService.ocorrencia.findMany({
        where,
        skip: Number(skip), // Convertendo 'skip' para um número
        take: includeAll ? undefined : 10,
        orderBy: {
          id: 'desc', // Ordena por id de forma descendente
        },
      }),
    ]);

    return {
      totalCount,
      calls,
    };
  }

  async create(data: any): Promise<any> {
    try {
      // Converter e atribuir latitude e longitude, mantendo fallback para 0.0 em caso de falha
      data.latitude = this.convertToFloat(data.latitude) ?? 0.0;
      data.longitude = this.convertToFloat(data.longitude) ?? 0.0;

      // Converter a data_inversa de "dd/MM/yyyy" para Date
      if (data.data_inversa && typeof data.data_inversa === 'string') {
        // Função para converter data no formato "dd/MM/yyyy" para Date
        const [day, month, year] = data.data_inversa.split('/').map(Number);

        if (!day || !month || !year) {
          throw new Error('Invalid date format: Missing day, month, or year');
        }

        // Verifica se a data é válida
        const date = new Date(year, month - 1, day);
        if (
          date.getDate() !== day ||
          date.getMonth() !== month - 1 ||
          date.getFullYear() !== year
        ) {
          throw new Error('Invalid date format: Date out of range');
        }

        data.data_inversa = date.toISOString(); // Converte para o formato ISO 8601
      }

      // Validação do esquema Zod
      const base = validateSchema(CREATE_OCORRENCIA_SCHEMA.partial(), data);

      // Pegar a instância do Firestore através do serviço injetado
      const firestore = this.firebaseService.getFirestoreInstance();

      // Transação Prisma
      const result = await this.prismaService.$transaction(async (prisma) => {
        // 1. Consulta a Order no Firestore para obter orderId, callsId e userId
        const orderDocRef = doc(firestore, 'orders', data.orderId);
        const orderSnapshot = await getDoc(orderDocRef);

        if (!orderSnapshot.exists()) {
          throw new Error('Order não encontrada!');
        }

        // Pega os dados da order
        const orderData = orderSnapshot.data();
        const _orderId = orderData.orderId;
        const _callsId = orderData.callsId;
        const _userId = orderData.deliveryId;

        if (!_orderId || !_callsId || !_userId) {
          throw new Error(
            'Faltam informações na Order para completar a transação!',
          );
        }

        // 2. Criar a Ocorrência no Banco de dados  (coleção 'ocorrencias')
        const ocorrenciaResult = await prisma.ocorrencia.create({
          data: {
            ...(base as Prisma.OcorrenciaCreateInput),
            callsId: _callsId, // Adiciona callsId
            orderId: _orderId, // Adiciona orderId
            userId: _userId, // Adiciona userId
          },
        });

        // Iniciar a transação no Firestore
        await runTransaction(firestore, async (transaction) => {
          // 2. Criar a Ocorrência no Firestore (coleção 'ocorrencias')
          const ocorrenciaRef = doc(collection(firestore, 'ocorrencias'));
          transaction.set(ocorrenciaRef, {
            ...(base as any), // dados da ocorrência convertidos
            createdAt: new Date(),
            callsId: _callsId, // Adiciona callsId
            orderId: _orderId, // Adiciona orderId
            userId: _userId, // Adiciona userId
          });

          // 3. Atualizar o estado da Order no Firestore (coleção 'orders')
          const orderRef = doc(firestore, 'orders', data.orderId);
          transaction.update(orderRef, {
            deliveryStatus: 'delivered',
          });

          // 4. Atualizar o estado da CALL no Firestore (coleção 'calls')
          const callRef = doc(firestore, 'calls', _callsId);
          transaction.update(callRef, {
            severity: 'RESOLVIDO',
          });

          // 5. Atualizar o estado do agente em Users (coleção 'users')
          const userRef = doc(firestore, 'users', _userId);
          transaction.update(userRef, {
            orderId: '', // Limpar o campo orderId
            statusModel: {
              id: '10-8',
              descricao: '10-8 em serviço',
            },
          });
        });

        // Retornar o resultado da transação
        return ocorrenciaResult;
      });

      // this.webSocketGatewayService.server.emit('transfer_response', {
      //   status: 'success',
      //   id: result.id,
      // });

      return result;
    } catch (error) {
      console.error(
        'Erro ao criar ocorrência ou enviar dados ao ArcGIS:',
        error,
      );
      handleValidationError(error); // Tratamento do erro
    }
  }

  async sendDataArcGis(data: any): Promise<any> {
    const token = await this.getToken();
    const geojsonData = this.formatGeoJSON(data);

    const response = await axios.post(
      this.arcgis_url,
      new URLSearchParams({
        features: JSON.stringify(geojsonData),
        f: 'json',
        token: token,
      }),
    );

    if (response.data.error) {
      throw new Error(response.data.error.message);
    }

    console.log('Dados enviados ao ArcGIS com sucesso:', data);

    return data;
  }

  private formatGeoJSON(data: any): Ocorrencia {
    return data.map((item: any) => ({
      attributes: {
        id: item.id.toString(),
        pesid: item.pesid.toString(),
        data_inversa: item.data_inversa,
        dia_semana: item.dia_semana,
        horario: item.horario,
        uf: item.uf,
        br: item.br.toString(),
        municipio: item.municipio,
        causa_principal: item.causa_principal,
        causa_acidente: item.causa_acidente,
        ordem_tipo_acidente: item.ordem_tipo_acidente.toString(),
        tipo_acidente: item.tipo_acidente,
        classificacao_acidente: item.classificacao_acidente,
        fase_dia: item.fase_dia,
        sentido_via: item.sentido_via,
        condicao_metereologica: item.condicao_metereologica,
        tipo_pista: item.tipo_pista,
        tracado_via: item.tracado_via,
        uso_solo: item.uso_solo,
        id_veiculo: item.id_veiculo.toString(),
        tipo_veiculo: item.tipo_veiculo,
        marca: item.marca,
        ano_fabricacao_veiculo: item.ano_fabricacao_veiculo,
        tipo_envolvido: item.tipo_envolvido,
        estado_fisico: item.estado_fisico,
        idade: item.idade.toString(),
        sexo: item.sexo,
        ilesos: item.ilesos.toString(),
        feridos_leves: item.feridos_leves.toString(),
        feridos_graves: item.feridos_graves.toString(),
        mortos: item.mortos.toString(),
        latitude: parseFloat(item.latitude.replace(',', '.')),
        longitude: parseFloat(item.longitude.replace(',', '.')),
        regional: item.regional,
        delegacia: item.delegacia,
        uop: item.uop,
      },
      geometry: {
        x: parseFloat(item.longitude.replace(',', '.')),
        y: parseFloat(item.latitude.replace(',', '.')),
        spatialReference: { wkid: 4326 },
      },
    }));
  }
}
