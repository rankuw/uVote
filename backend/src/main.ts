import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import { SocketAdapter } from './socket-adapter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService)
  const port = configService.get("PORT")
  app.enableCors()
  app.useGlobalPipes(new ValidationPipe())
  app.useWebSocketAdapter(new SocketAdapter(app, configService))
  await app.listen(port);
}
bootstrap();
