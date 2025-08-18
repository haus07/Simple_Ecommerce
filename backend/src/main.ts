import { NestFactory } from '@nestjs/core';
import 'reflect-metadata';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv'
import { postgresDataSource } from './typeorm/appDataSource';
import { ValidationPipe, VersioningType } from '@nestjs/common';

async function bootstrap() {
  await postgresDataSource.initialize();
  const app = await NestFactory.create(AppModule)
 app.enableCors({
  origin: 'http://localhost:5173',
  credentials: true,
 });
  
  app.enableVersioning({
    type: VersioningType.URI,
    prefix:'api/v'
  })
  
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    transform:true
  }))

  await app.listen(3000)
}
dotenv.config()
bootstrap();
