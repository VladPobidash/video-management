import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const PORT = process.env.PORT ?? 3000;
  const app = await NestFactory.create(AppModule);

  app.enableCors();
  app.setGlobalPrefix('api');

  app.useGlobalPipes(new ValidationPipe());

  const config = new DocumentBuilder()
    .setTitle('Video Management API')
    .setDescription('API for managing videos and groups')
    .setVersion('0.1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('/api/docs', app, document);

  await app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
}
// eslint-disable-next-line @typescript-eslint/no-floating-promises
bootstrap();
