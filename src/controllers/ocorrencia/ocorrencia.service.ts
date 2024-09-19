import { Injectable } from '@nestjs/common';
import { Ocorrencia, Prisma } from '@prisma/client';
import axios from 'axios';

import { validateSchema } from 'src/lib/data/validate-schema';
import type * as APITypes from 'src/types/api';
import { PrismaService } from 'src/prisma/prisma/prisma.service';
import { CREATE_OCORRENCIA_SCHEMA } from 'src/schemas/basico';
import { handleValidationError } from 'src/utils/base';
import { Socket } from 'socket.io';
import { WebSocketGatewayService } from '../websocket/websocket.gateway';

@Injectable()
export class OcorrenciaService {
  constructor(
    private prismaService: PrismaService,
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

      // Verifica e converte a data_inversa de ISO 8601 para Date
      if (data.data_inversa && typeof data.data_inversa === 'string') {
        // Tenta criar uma data a partir do formato ISO 8601
        const isoDate = new Date(data.data_inversa);

        // Verifica se a data é válida
        if (isNaN(isoDate.getTime())) {
          throw new Error('Invalid date format: Could not parse ISO date');
        }

        data.data_inversa = isoDate.toISOString(); // Confirma que está no formato ISO 8601
      }

      // Validação do esquema Zod
      const base = validateSchema(CREATE_OCORRENCIA_SCHEMA.partial(), data);

      // Transação Prisma
      const result = await this.prismaService.$transaction(async (prisma) => {
        // Criação da Ocorrência
        const ocorrenciaResult = await prisma.ocorrencia.create({
          data: {
            ...(base as Prisma.OcorrenciaCreateInput),
          },
        });

        // Enviar os dados da ocorrência criada para ArcGIS
        // await this.sendDataArcGis(ocorrenciaResult);

        // Retornar o resultado da transação
        return ocorrenciaResult;
      });

      this.webSocketGatewayService.server.emit('transfer_response', {
        status: 'success',
        id: result.id,
      });

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
