import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';

import { AppModule } from './app.module';
import helmet from 'helmet';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
//import * as csurf from 'csurf';

// async function bootstrap() {
//   const app = await NestFactory.create(AppModule);
//   app.useGlobalPipes(new ValidationPipe());
//   app.use(helmet());

//   const config = new DocumentBuilder()
//     .setTitle('Cats example')
//     .setDescription('The cats API description')
//     .setVersion('1.0')
//     .addTag('cats')
//     .build();
//   const document = SwaggerModule.createDocument(app, config);
//   SwaggerModule.setup('api', app, document);

//   app.enableCors();
//   await app.listen(2001);
// }
// bootstrap();

import { AppClusterService } from './cluster.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(3000);
}
AppClusterService.clusterize(bootstrap);
