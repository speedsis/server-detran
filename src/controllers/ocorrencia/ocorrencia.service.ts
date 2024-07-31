import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class OcorrenciaService {
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

  async sendData(data: any): Promise<any> {
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

    console.log(response.data);

    return response.data;
  }

  private formatGeoJSON(data: any): any[] {
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
