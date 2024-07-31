import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { json as expressJson, urlencoded as expressUrlEncoded } from 'express';
// import { Transport } from '@nestjs/microservices';

import * as Sentry from '@sentry/node';
import { prisma } from './lib/data/prisma';
import { ValidationPipe } from '@nestjs/common';
// import * as dotenv from 'dotenv';
// import * as fs from 'fs';

Sentry.init({
  dsn: 'https://308dd96b826c4e38a814fc9bae681687@o518232.ingest.sentry.io/6553288',
  integrations: [
    new Sentry.Integrations.Http({ tracing: true }),
    new Sentry.Integrations.Prisma({ client: prisma }),
  ],
  tracesSampleRate: 1.0,
  profilesSampleRate: 1.0,
  attachStacktrace: true,
  ignoreErrors: [/can't reach database server at/gim],
  denyUrls: [/localhost/],
  enabled: process.env.NODE_ENV !== 'development',
});

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });

  // app.use(express.json({ limit: '5mb' })); // Ajuste o limite conforme necessário

  app.useGlobalPipes(
    new ValidationPipe({
      errorHttpStatusCode: 422,
    }),
  );

  // // Swagger setup
  // const config = new DocumentBuilder()
  //   .setTitle('CONSIGOV')
  //   .setDescription('Gestão de margem consignável para servidores públicos.')
  //   .setVersion('1.0')
  //   .addTag('endpoints') // Tag para agrupar os endpoints
  //   .addBearerAuth() // Adiciona suporte para autenticação Bearer
  //   .build();

  // const document = SwaggerModule.createDocument(app, config);

  // // Filtrando os endpoints que deseja listar
  // document.paths = {
  //   '/auth/login': document.paths['/auth/login'],
  //   '/servidor/{empresaId}': {
  //     get: document.paths['/servidor/{empresaId}'].get,
  //   },
  //   // Adicione mais endpoints conforme necessário
  // };

  // // Adicione o esquema de segurança para o tipo Bearer
  // document.components.securitySchemes = {
  //   bearerAuth: {
  //     type: 'http',
  //     scheme: 'bearer',
  //     bearerFormat: 'JWT',
  //   },
  // };

  // SwaggerModule.setup('api', app, document);

  app.enableShutdownHooks();

  // app.connectMicroservice({
  //   transport: Transport.KAFKA,
  //   options: {
  //     client: {
  //       brokers: ['host.docker.internal:9094'],
  //     },
  //     consumer: {
  //       groupId: 'orders-consumer',
  //     },
  //   },
  // });
  // await app.startAllMicroservices();
  // await app.listen(3000);

  if (app !== undefined) {
    app.use(expressJson({ limit: '50mb' }));
    app.use(expressUrlEncoded({ limit: '50mb', extended: true }));
  }

  await app.listen(process.env.PORT || 3000);
}
bootstrap();
