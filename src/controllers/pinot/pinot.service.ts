import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class PinotService {
  private readonly pinotBaseUrl = 'http://localhost:9000'; // URL do seu servidor Pinot

  async getVehicleStatus() {
    const query = 'SELECT * FROM vehicle_status'; // Ajuste a consulta conforme necessário

    try {
      const response = await axios.post(
        `${this.pinotBaseUrl}/query`,
        {
          query: query,
          // Adicione outros parâmetros conforme necessário para sua configuração
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );
      return response.data;
    } catch (error) {
      console.error('Error querying Pinot:', error);
      throw error;
    }
  }
}
