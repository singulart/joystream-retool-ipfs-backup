import { AppModule } from './app.module';
import { NestFactory } from '@nestjs/core';
import { AppService } from './app.service';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  await app.init();
  const appService = app.get(AppService);
  await appService.pushToIpfs();
}

bootstrap();