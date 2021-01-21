import { NestFactory } from '@nestjs/core';
import * as helmet from 'helmet';
import { AppModule } from './app.module';
import { json, urlencoded } from 'express';
import { LoggingInterceptor } from './logging.interceptor';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const options = new DocumentBuilder()
    .setTitle('JinPost')
    .setDescription('The Jinpost API description')
    .setVersion('1.0')
    .addTag('Jinpost')
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api', app, document);
  app.enableCors({ origin: true });
  app.use(json({ limit: '50mb' }));
  app.use(urlencoded({ extended: true, limit: '50mb' }));
  app.useGlobalInterceptors(new LoggingInterceptor());
  app.use(helmet());
  await app.listen(process.env.PORT || 3000);
}
bootstrap();
