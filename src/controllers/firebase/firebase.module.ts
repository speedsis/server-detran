import { Module } from '@nestjs/common';
import { FirebaseService } from 'src/services/firebase.service';

@Module({
  providers: [FirebaseService],
  exports: [FirebaseService], // Certifique-se de exportar o serviço
})
export class FirebaseModule {}
